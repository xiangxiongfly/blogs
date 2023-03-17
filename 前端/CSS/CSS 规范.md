[toc]

# CSS 规范

## 命名规范

#### CSS文件命名法

| 文件名      | 说明                         |
| ----------- | ---------------------------- |
| reset.css   | 重置样式                     |
| global.css  | 全局样式，适用于整个网站     |
| common.css  | 通用样式，适用于多个HTML元素 |
| public.css  | 公共样式，适用于多模块       |
| themes.css  | 主题样式                     |
| module.css  | 模块样式                     |
| master.css  | 木板样式                     |
| columns.css | 专栏样式                     |
| forms.css   | 表单样式                     |
| mend.css    | 补丁样式                     |
| print.css   | 打印样式                     |

#### id和class命名法

| 命名法       | 例如                    |
| ------------ | ----------------------- |
| 驼峰命名法   | topMain、subLeftMenu    |
| 中划线命名法 | top-main、sub-left-menu |
| 下划线命名法 | top_main、sub_left_menu |

#### 网页元素命名法

**网页主题部分**

| 命名法        | 说明                     |
| ------------- | ------------------------ |
| container     | 最外层容器，如：header、footer、sidebar等 |
| wrap       | 包裹其他元素的容器            |
| box       | 独立的容器，包裹单独的HTML元素    |
| header        | 头部                     |
| content       | 内容                     |
| sidebar       | 侧栏                     |
| column        | 栏目                     |
| hot           | 热点                     |
| news          | 新闻                     |
| download      | 下载                     |
| logo          | 标志                     |
| nav           | 导航条                   |
| main          | 主体                     |
| main-left     | 左侧                     |

**导航**

| 命名法        | 说明     |
| ------------- | -------- |
| main-nav      | 主导航   |
| sub-nav       | 子导航   |
| side-nav      | 边导航   |
| leftside-nav  | 左导航   |
| rightside-nav | 右导航   |
| top-nav       | 顶导航   |
| main-right    | 右侧     |
| footer        | 底部     |
| friendlink    | 友情链接 |
| joinus        | 加入我们 |
| copyright     | 版权     |
| service       | 服务     |
| login         | 登陆     |
| register      | 注册     |

**菜单**

| 命名    | 说明   |
| ------- | ------ |
| menu    | 菜单   |
| submenu | 子菜单 |

**其他**

| 命名          | 说明     |
| ------------- | -------- |
| title         | 标题     |
| summary       | 摘要     |
| loginbar      | 登陆条   |
| search        | 搜索     |
| tab           | 标签页   |
| banner        | 广告     |
| tips          | 小技巧   |
| icon          | 图标     |
| siteinfolegal | 法律声明 |
| sitemap       | 网站地图 |
| tool、toolbar | 工具条   |
| homepage      | 首页     |
| subpage       | 子页     |
| parter        | 合作伙伴 |
| help          | 帮助     |
| guide         | 指南     |
| scroll        | 滚动     |
| msg           | 消息     |
| vote          | 投票     |
| related       | 相关文章 |
| list          | 列表     |



## 书写顺序规范

**CSS属性书写顺序**

| 类别       | 例如                                                       |
| ---------- | ---------------------------------------------------------- |
| 布局属性   | display、position、float、clear                            |
| 盒模型属性 | width、height、padding、border、margin、overflow           |
| 文本属性   | font、line-height、text-align、text-indent、vertical-align |
| 装饰属性   | color、background-color、opacity、cursor                   |
| 其他       | content、list-style                                        |

**举例**

```css
#main {
    /*影响文档流属性*/
    display:inline-block;
    position:absolute;
    top:0;
    left:0;
    /*盒子模型属性*/
    width:100px;
    height:100px;
    border:1px solid gray;
    /*文本性属性*/
    font-size:15px;
    font-weight:bold;
    text-indent:2em;
    /*装饰性属性*/
    color:White;
    background-color:Red;
    /*其他属性*/
    cursor:pointer;
}
```



## 注释规范

**单行注释**

```
/*单行注释内容*/
```

**多行注释**

```
/*
*多行注释内容
*多行注释内容
*多行注释内容
*/
```

**顶部注释**

```
/*
*@description：说明
*@author：作者
*@update：更新时间，如2016-4-19 18:30
*/
```

**模块注释**

```
/*导航部分，开始*/
……
/*导航部分，结束*/
```

