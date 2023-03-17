# Java hashCode与identityHashCode区别

```java
String str1 = "abc";
String str2 = new String("abc");
String str3 = "abc".intern();

System.out.println("hashCode:" + str1.hashCode() + " identityHashCode:" + System.identityHashCode(str1));
System.out.println("hashCode:" + str2.hashCode() + " identityHashCode:" + System.identityHashCode(str2));
System.out.println("hashCode:" + str3.hashCode() + " identityHashCode:" + System.identityHashCode(str3));
//hashCode:96354 identityHashCode:460141958
//hashCode:96354 identityHashCode:1163157884
//hashCode:96354 identityHashCode:460141958

System.out.println(str1 == str2); //false
System.out.println(str1 == str3); //true
```

**总结：**

- 这三个字符串的hashCode都是相同的，这是因为String类重写hashCode方法，通过String的值生成hashCode值，所以只要值相同，hashCode就相同。
- str1与str2的identityHashCode不一样，是因为identityHashCode永远返回对象的内存地址，所以不相同；而str1与str3的identityHashCode相同，是因为intern方法会先从字符串常量池里获取字符串，所以二者的地址值相同。
- `==`比较的是两个对象的引用地址，所以`str1 == str2`返回false，`(str1 == str3`返回true。