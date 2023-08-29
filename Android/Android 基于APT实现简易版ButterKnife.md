[toc]

# Android 基于APT实现简易版ButterKnife

## 概述

APT（Annotation Processing Tool）即注解处理器，是一种注解处理工具。用于在编译器扫描和处理注解，通过注解生成Java文件。



## 依赖库

- JavaPoet：生成指定格式的Java代码

- auto-service：用于注解处理

[JavaPoet资料](https://blog.csdn.net/l540675759/article/details/82931785)

```
//编译时期进行注解处理
annotationProcessor 'com.google.auto.service:auto-service:1.0-rc4'
compileOnly 'com.google.auto.service:auto-service:1.0-rc4'

//生成Java代码
implementation 'com.squareup:javapoet:1.10.0'
```



## 常用API介绍

### AbstractProcessor

- `init()`：初始化操作，如获取`Filer`
- `process()`：核心方法，处理注解
- `getSupportedAnnotattiontypes()`：指定所支持的注解
- `getSupportedSourceVersion()`：指定使用的Java版本



**Element类**

```java
//返回元素的定义类型
TypeMirror asType();
//获取元素的种类：包、类、接口、方法、字段等
ElementKind getKind();
//获取元素的修饰符
Set<Modifier> getModifiers();
//获取元素名
Name getSimpleName();
//获取当前元素的外围元素
Element getEnclosingElement();
//获取当前元素的所有子元素
Element getEnclosingElement();
//获取元素的注解
<A extends Annotation> A getAnnotation(Class<A> var1);
```

**Element的子类**

Element常用的五个子类，每个子类都表示一种类型

```
//类或接口类型的元素
TypeElement
//变量类型的元素
VariableElement
//方法类型的元素
ExecutableElement
//包类型的元素
PackageElement
//泛型参数的类型
TypeParameterElement
```

**TypeElement类**

```java
//获取元素的全类名
Name getQualifiedName();
//获取元素的简单类名
Name getSimpleName();
//获取元素的父类
TypeMirror getSuperclass();
//获取元素的接口
List<? extends TypeMirror> getInterfaces();
//获取元素的参数
List<? extends TypeParameterElement> getTypeParameters();
```

**VariableElement类**

```java
//获取变量初始化值
Object getConstantValue();
//获取类信息
Element getEnclosingElement();
```



## 实现

一个APT项目需要至少两个Java Library模块组成，一个模块负责提供注解，另外一个模块负责注解处理。

### 创建注解模块

```java
@Retention(RetentionPolicy.CLASS)
@Target(ElementType.FIELD)
public @interface BindView {
    int value();
}
```

### 创建注解处理模块

```groovy
dependencies {
    //编译时期进行注解处理
    annotationProcessor 'com.google.auto.service:auto-service:1.0-rc4'
    compileOnly 'com.google.auto.service:auto-service:1.0-rc4'
    //生成Java代码
    implementation 'com.squareup:javapoet:1.10.0'
    // 依赖于注解
    implementation project(':apt_annotation')
}
```

```java
/**
 * 注解处理器
 */
@AutoService(Processor.class)
public class AnnotationCompiler extends AbstractProcessor {
    //生成文件的对象
    private Filer filer;
    //打印日志工具类
    private Messager messager;

    @Override
    public synchronized void init(ProcessingEnvironment processingEnvironment) {
        super.init(processingEnvironment);
        filer = processingEnvironment.getFiler();
        messager = processingEnvironment.getMessager();
    }

    /**
     * 支持的注解
     */
    @Override
    public Set<String> getSupportedAnnotationTypes() {
        Set<String> set = new HashSet<>();
        set.add(BindView.class.getCanonicalName());
        return set;
    }

    /**
     * 支持Java版本
     */
    @Override
    public SourceVersion getSupportedSourceVersion() {
        return processingEnv.getSourceVersion();
    }

    @Override
    public boolean process(Set<? extends TypeElement> set, RoundEnvironment roundEnvironment) {
        //获取所有BindView注解的元素
        Set<? extends Element> elements = roundEnvironment.getElementsAnnotatedWith(BindView.class);

        //生成Map集合，存储Activity和BindView注解的元素
        Map<String, List<VariableElement>> map = new HashMap<>();
        for (Element e : elements) {
            //获取注解的元素
            VariableElement variableElement = (VariableElement) e;
            //获取外层元素
            Element enclosingElement = variableElement.getEnclosingElement();
            //转为类元素
            TypeElement typeElement = (TypeElement) enclosingElement;
            //获取类名
            String className = typeElement.getSimpleName().toString();

            //存储
            List<VariableElement> variableElements = map.get(className);
            if (variableElements == null) {
                variableElements = new ArrayList<>();
                map.put(className, variableElements);
            }
            variableElements.add(variableElement);
        }

        //生成APT文件
        if (map.size() > 0) {
            Iterator<String> iterator = map.keySet().iterator();
            while (iterator.hasNext()) {
                String className = iterator.next();
                List<VariableElement> variableElements = map.get(className);
                String packageName = getPackageName(variableElements.get(0));
                //生成新的类名
                String newClassName = className + "ViewBinding";

                try {
                    JavaFileObject sourceFile = filer.createSourceFile(newClassName);
                    try (Writer writer = sourceFile.openWriter()) {
                        StringBuilder stringBuilder = new StringBuilder();
                        stringBuilder.append(String.format("package %s;", packageName))
                            .append(String.format("public class %s {", newClassName))
                            .append(String.format("public %s(final %s activity) {", newClassName, className));
                        for (VariableElement variableElement : variableElements) {
                            String fieldName = variableElement.getSimpleName().toString();
                            BindView annotation = variableElement.getAnnotation(BindView.class);
                            if (annotation != null) {
                                int viewId = annotation.value();
                                stringBuilder.append(String.format("activity.%s = activity.findViewById(%s);", fieldName, viewId));
                            }
                        }
                        stringBuilder.append("}\n}");
                        writer.write(stringBuilder.toString());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return false;
    }

    /**
     * 获取包名
     */
    public String getPackageName(VariableElement variableElement) {
        Element typeElement = variableElement.getEnclosingElement();
        return typeElement.getEnclosingElement().toString();
    }
}
```

**可以使用JavaPoet简化代码**

```java
//$L 子面量
//$S 字符串
//$T 类型
//$N 名称
MethodSpec.Builder constructorBuilder = MethodSpec.constructorBuilder()
    .addModifiers(Modifier.PUBLIC)
    .addParameter(ClassName.get(packageName, className), "activity");

for (VariableElement element : variableElements) {
    if (element.getKind() == ElementKind.FIELD) {
        BindView annotation = element.getAnnotation(BindView.class);
        if (annotation != null) {
            constructorBuilder.addStatement("activity.$N = activity.findViewById($L)", element.getSimpleName(), annotation.value());
        }
    }
}

TypeSpec typeSpec = TypeSpec.classBuilder(newClassName)
    .addModifiers(Modifier.PUBLIC)
    .addMethod(constructorBuilder.build())
    .build();

try {
    JavaFile.builder(packageName, typeSpec)
        .build()
        .writeTo(filer);
} catch (IOException e) {
    e.printStackTrace();
}
```

### 创建依赖库

```groovy
dependencies {
    implementation project(':apt_annotation')
    annotationProcessor project(':apt_compiler')
}
```

```java
public class MyButterKnife {
    public static void bind(Activity activity) {
        Class<?> aClass = activity.getClass();
        String binderName = aClass.getName() + "ViewBinding";
        try {
            Class<?> viewBinderClz = Class.forName(binderName);
            Constructor<?> constructor = viewBinderClz.getConstructor(activity.getClass());
            constructor.newInstance(activity);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### 使用

```java
public class MainActivity extends AppCompatActivity {
    @BindView(R.id.textView)
    TextView textView;
    @BindView(R.id.imageView)
    ImageView imageView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        MyButterKnife.bind(this);
        textView.setText("hello");
        imageView.setImageResource(R.mipmap.ic_launcher);
    }
}
```



## [代码下载](https://github.com/xiangxiongfly/MyButterKnifeProject)

