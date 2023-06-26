# Vue处理img动态src

**assets**路径：在项目编译的过程中**会被webpack处理解析为模块依赖**，只支持**相对路径**的形式，如< img src=”./logo.png”>和background:url(./logo.png),

js：

```js
<script>
export default {
    setup() {
        const iconsList = [{
            imgName: "超市",
            desc: "超市便利",
        },
        {
            imgName: "菜市场",
            desc: "菜市场",
        },
        {
            imgName: "水果店",
            desc: "水果店",
        },
        {
            imgName: "鲜花",
            desc: "鲜花绿植",
        },
        {
            imgName: "医药健康",
            desc: "医药健康",
        },
        {
            imgName: "家居",
            desc: "家居时尚",
        },
        {
            imgName: "蛋糕",
            desc: "烘培蛋糕",
        },
        {
            imgName: "签到",
            desc: "签到",
        },
        {
            imgName: "大牌免运",
            desc: "大牌免运",
        },
        {
            imgName: "红包",
            desc: "红包套餐",
        }]
        return { iconsList }
    }
}
</script>
```

template：

```html
<div class="icons__item" v-for="item in iconsList" :key="item.desc">
    <img class="icons__item__img" :src="require(`../../assets/images/${item.imgName}.png`)" />
    <p class="icons__item__desc">{{ item.desc }}</p>
</div>
```

或者使用`@`表示dist目录：

```html
<div class="icons__item" v-for="item in iconsList" :key="item.desc">
    <img class="icons__item__img" :src="require(`@/assets/images/${item.imgName}.png`)" />
    <p class="icons__item__desc">{{ item.desc }}</p>
</div>
```

