[toc]

# 微信小程序-canvas

## 概述

在HTML中，canvas 标签可用于图形的绘制，也可用于创建图片特效和动画。在微信小程序中，canvas组件也起着类似作用，可用于自定义绘制图形，该组件支持2D和WebGL的绘图。

canvas 组件通过 `<canvas>` 标签来定义：

```xml
<canvas></canvas>
```

canvas 标签默认宽度300px、高度150px。



## canvas常用属性

| 属性            | 类型        | 说明                                                         |
| --------------- | ----------- | ------------------------------------------------------------ |
| type            | string      | 指定 canvas 组件的类型，支持 2D 和 WebGL                     |
| canvas-id       | string      | canvas 组件的唯一表示，若指定 type 属性则无需再指定该属性    |
| disable-scroll  | boolean     | 当在 canvas 中移动时且有绑定手势事件时，禁止屏幕滚动以及下拉刷新 |
| bindtouchstart  | eventhandle | 手指触摸动作开始                                             |
| bindtouchmove   | eventhandle | 手指触摸移动                                                 |
| bindtouchend    | eventhandle | 手指触摸动作结束                                             |
| bindtouchcancel | eventhandle | 手指触摸动作被打断，如：来电提醒、弹窗等                     |
| bindlongtap     | eventhandle | 手指长按 500 毫秒后触发，触发了长按事件后进行移动不会触发屏幕的滚动 |
| binderror       | eventhandle | 当发生错误时触发                                             |

```xml
<canvas id="myCanvas" type="2d"></canvas>
```

```css
#myCanvas {
	dispplay: block;
    width: 300px;
    height: 150px;
    position: relative;
    border: 1px solid red;
}
```

```js
wx.createSelectorQuery()
    .select("myCanvas")
    .fields({node:true,size:true})
    .exec(res => {
        const canvas = res[0].node // 获取Canvas实例
        const ctx = canvas.getContext("2d") // 获取RenderingContext实例
    })
```



## RenderingContext属性和方法

**属性：**

| 属性         | 说明                                     |
| ------------ | ---------------------------------------- |
| width        | 画布宽度                                 |
| height       | 画布高度                                 |
| fillStyle    | 设置或返回用于填充绘画的颜色、渐变或模式 |
| strokeStyle  | 设置描边颜色                             |
| lineWidth    | 设置或返回当前线条宽度                   |
| font         | 设置或返回文本内容的当前字体属性         |
| textBaseline | 设置或返回在绘制文本时使用的当前文本基线 |

**方法：**

| 方法         | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| rect()       | 创建矩形                                                     |
| fillRect()   | 创建填充矩形                                                 |
| strokeRect() | 画一个矩形(非填充)。                                         |
| clearRect()  | 清除矩形范围内的像素                                         |
| stroke()     | 画出当前路径的边框。默认颜色色为黑色。                       |
| beginPath()  | 开始创建一个路径                                             |
| closePath()  | 创建从当前点回到起点的路径                                   |
| moveTo()     | 移动路径到指定点，不创建线                                   |
| arc()        | 绘制一条弧线                                                 |
| rotate()     | 以原点为中心顺时针旋转当前坐标轴。多次调用旋转的角度会叠加。原点可以用 `translate` 方法修改。 |
| translate()  | 对当前坐标系的原点 (0, 0) 进行变换。默认的坐标系原点为页面左上角。 |
| fillText()   | 在画布上绘制被填充的文本                                     |
| restore()    | 恢复之前保存的绘图上下文                                     |
| save         | 保存绘图上下文                                               |

```xml
<canvas id="draw" type="2d" ></canvas>
```

```js
Page({
    onReady() {
        wx.createSelectorQuery()
            .select("#draw")
            .fields({node: true, size: true})
            .exec(res => {
            const canvas = res[0].node
            const ctx = canvas.getContext("2d")
            this.drawRect(ctx)
            this.drawSmile(ctx)
        })
    },
    drawRect(ctx) {
        ctx.fillStyle = "rgba(0,0,200,0.4)"
        ctx.fillRect(10, 10, 150, 150)
    },
    drawSmile(ctx) {
        // 绘制线条
        ctx.strokeStyle = "#f00"
        ctx.lineWidth = "2"
        // 绘制外部大圆
        ctx.moveTo(160, 80)
        ctx.arc(100, 80, 60, 0, 2*Math.PI, true)
        // 绘制外部嘴巴线条
        ctx.moveTo(140, 80)
        ctx.arc(100, 80, 40, 0, Math.PI, false)
        // 绘制左边眼圈
        ctx.moveTo(85, 60)
        ctx.arc(80, 60, 5, 0, 2*Math.PI, true)
        // 绘制右边眼圈
        ctx.moveTo(125, 60)
        ctx.arc(120, 60, 5, 0, 2*Math.PI, true)
        ctx.stroke()            
    }
})
```

