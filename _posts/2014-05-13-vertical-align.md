---
layout: post
title: vertical-align详解
excerpt: "剖析vertical-align与baseline、x-height等的关系，确定其原理"
author:
  name: 天镶
  email: lingyucoder@gmail.com
  bio: 前端开发工程师
---

{% raw %}

##vertical-align 
属性`vertical-align`影响一个内联级元素（inline-level element）垂直方向上的布局。具体适用于`display`值为`inline`,`inline-block`或`table-cell`的元素。

其可选的值有：
- baseline
- middle
- sub
- super
- text-top
- text-bottom
- percentage
- length
- top
- bottom

其中除了bottom和top外，这些值是相对于父内联元素（或父块包含元素）来说的。对于内联非替换元素来说，被用来布局的子元素盒子的高度由其子元素的`line-height`属性来确定。而对于不是内联非替换元素的其他元素来说，子元素盒子则是其margin box。

举个例子来表现子元素为inline和inline-block时的不同：
```html
<div class="ctn-block">
    <div class="child child1">child1</div>
    <div class="child child2">child2</div>
    <span>Gg</span>
</div>
```
```css
.ctn-block {
    display: block;
    background-color: #bbb;
}

.ctn-block span {
    font-size: 50px;
    line-height: 200px;
}

.ctn-block .child {
    margin: 10px 0;
    border: 10px solid bisque;
    font-size: 32px;
    vertical-align: top;
    background-color: aliceblue;
}

.ctn-block .child1 {
    display: inline;
}
.ctn-block .child2 {
    display: inline-block;
}
```
效果图如下：
![Alt text](http://skyinlayer.com/img/verticalalign/1.png)

可以看到，inline元素只会将其content box用来定位，而inline-block元素则会将将其margin box用来定位。结合inline元素的特性，就很好理解了

除了bottom和top外，其他根据父内联元素（或父块包含元素）来确定。这句话下面会给出实例

##baseline的确定
###什么是baseline
![Alt text](http://skyinlayer.com/img/verticalalign/2.png)

这里大写字母`G`底端的那条线，即为baseline

下面以如下代码为基础，来比较`vertical-align`值不同时的效果：
```html
<div class="ctn-block">
    <div class="child1"></div>
    <span>Gg</span>
</div>
```
```css
.ctn-block {
    display: block;
    background-color: #bbb;
    line-height: 200px;
    font-size: 50px;
}

.ctn-block .child1 {
    display: inline-block;
    width: 100px;
    height: 100px;
    margin: 10px 0;
    
    /*vertical-align: baseline;*/
    
    background-color: aliceblue;
}
```

这里`.ctn-block`为父元素，`.child1`为子元素，父元素的baseline根据规则，为最后一个line box的baseline，也就是说其baseline为如下红线：

![Alt text](http://skyinlayer.com/img/verticalalign/3.png)

而由于子元素为`display: inline-block`，其内部没有内容，也没有line box，所以根据如下计算规则:

> 如果它内部没有line box或它的overflow属性不是visible，那么baseline将是这个inline-block元素的底margin边界

那么，它的baseline就是其margin-bottom边界，如红线所示：

![Alt text](http://skyinlayer.com/img/verticalalign/4.png)

###元素的baseline
inline-table元素的baseline是它table第一行的baseline

inline-block元素的baseline是他普通流中最后一个line box的baseline。如果它内部没有line box或它的overflow属性不是visible，那么baseline将是这个inline-block元素的底margin边界

如果想要了解更多关于baseline的详细的信息，可以参照[W3C标准css-inline的baseline部分](http://dev.w3.org/csswg/css-inline/#baseline)

更多关于baseline的确定方式可以参照[W3C标准css-align的baseline-rules部分](http://dev.w3.org/csswg/css-align/#baseline-rules)

###line box的baseline
> CSS 2.1 does not define the position of the line box's baseline 

CSS 2.1没有定义baseline具体的位置。但经过测试，在chrome中，line box的baseline为其中所有inline-level元素（vertical值不为top或bottom）的baseline中位置最下面的一个basenline。如果vertical值为middle，其baseline为元素中点所在水平线
比如如下例子：

```html
<div class="ctn-block">
    <div class="child child-1"></div>
    <div class="child child-2">ggggggggggggggggggggggggggggggggggg</div>
    <div class="child child-3">ggggggggggggggggggggggggggggggggggggggggggggggggg</div>
</div>
```

```css
.ctn-block {
    width: 400px;
    display: block;
    background-color: #bbb;
}

.ctn-block .child {
    display: inline-block;
    width: 100px;
    background-color: aliceblue;
}

.ctn-block .child-1 {
    height: 100px;
}
.ctn-block .child-2 {
    height: 200px;
}
.ctn-block .child-3 {
    height: 350px;
}
```

可以看到布局效果如下：

![Alt text](http://skyinlayer.com/img/verticalalign/5.png)

由于child-1没有内容，其baseline为其margin-bottom外边界，而child-2和child-3的baseline则是其内部最后一个line box的baseline，而由于其设定为`vertical-align:baseline`，child-1的baseline处在最下面，child-2和child-3的baseline均与child-1的baseline对齐

增加child-3的内容：

![Alt text](http://skyinlayer.com/img/verticalalign/6.png)

布局发生改变，child-1和child-2的baseline都对齐child-3的baseline了

##vertical-align不同值之间的表现
###baseline
将子元素盒子的baseline与父盒子的baseline对齐。如果这个元素盒子没有baseline，将这个盒子的底margin边界与父盒子的baseline对齐

> From W3C: Align the baseline of the box with the baseline of the parent box. If the box does not have a baseline, align the bottom margin edge with the parent's baseline.

vertical-align默认就是baseline，所以这里会将子元素和父盒子的baseline对齐：

![Alt text](http://skyinlayer.com/img/verticalalign/7.png)

###middle
将子元素盒子的垂直中点与 父盒子的baseline加上父盒子的x-height的一半位置 对齐

> From W3C: Align the vertical midpoint of the box with the baseline of the parent box plus half the x-height of the parent.

这里子元素盒子的垂直中点还是比较容易确定的，父盒子的baseline之前也确定了，但这里需要通过x-height进行计算：

> From W3C: The x-height is, roughly, the height of lowercase letters such as a, c, m, or o. Fonts that have the same size (and thus the same em) may vary wildly in the size of their lowercase letters

其实x-height就是字体的x字母的高度

为了方便，将内容换成"Xx"，由于X(无论大小写)下边界都是顶着baseline的，而小写字母"x"这种上下对称的字母，其中点所在的水平直线就是子元素中点所需要对齐的直线了：

![Alt text](http://skyinlayer.com/img/verticalalign/8.png)

###text-top
将盒子的顶端（margin-top边界）与父盒子的文本区域顶端对齐

> From W3C: Align the top of the box with the top of the parent's content area

这里盒子的顶端（margin-top上边界）很好确定，而父盒子的文本区域顶端又是哪里？

![Alt text](http://skyinlayer.com/img/verticalalign/9.png)

审查一下文本，可以看到，蓝色的区域上边界就是文本区域：

![Alt text](http://skyinlayer.com/img/verticalalign/10.png)

这样就很好理解了，而可以看到对齐结果如下：

![Alt text](http://skyinlayer.com/img/verticalalign/11.png)

子元素盒子的margin-top上边界很好的和文本区域上边界对齐了

###text-bottom
将盒子的底端（margin-bottom边界）与父盒子的文本区域底端对齐

> From W3C: Align the bottom of the box with the bottom of the parent's content area

有了上面的text-top的实例，这里就很好理解了，不过换个方向罢了，将子元素的margin-bottom和文本区域的下边界对齐：

![Alt text](http://skyinlayer.com/img/verticalalign/12.png)

###sub
将子元素盒子的baseline降低，到适当的父盒子的下标位置

> From W3C: Lower the baseline of the box to the proper position for subscripts of the parent's box.

子元素的baseline已经确定了，就是其margin-bottom下边界，但是父盒子的下标位置不太好理解...首先需要了解下标这个概念，我们可以通过`<sub>`标签为文字添加下标，将`<span>`中的内容修改为`Gg<sub>Gg</sub>`，就会有如下效果：

![Alt text](http://skyinlayer.com/img/verticalalign/13.png)

既然下标也是一段文字，其也有上述的三条线，文本区域上边界，文本区域下边界，baseline。这里是根据下标的baseline对齐的，也就是说，对齐下标中`G`字母的底部:

![Alt text](http://skyinlayer.com/img/verticalalign/14.png)

###super
将子元素盒子的baseline升高，到适当的父盒子的上标位置

> From W3C: Raise the baseline of the box to the proper position for superscripts of the parent's box.

与sub对应，super提升到上标内容的baseline处，首先通过`<sup>`标签创建上标：

![Alt text](http://skyinlayer.com/img/verticalalign/15.png)

也是三条线，和上面基准一样，将子元素的baseline对齐上标的baseline：

![Alt text](http://skyinlayer.com/img/verticalalign/16.png)

###percentage和length
首先看看percentage（百分比）：

升高（正值）或降低（负值）子元素盒子，具体的升高/降低数值由父盒子的line-height的值乘以百分比值计算得出。如果百分比为0%，那么和`vertical-align:baseline`没有区别
> From W3C: Raise (positive value) or lower (negative value) the box by this distance (a percentage of the 'line-height' value). The value '0%' means the same as 'baseline'.

这个还是相当好理解的，就是相当于baseline升高或降低，具体数值为百分比乘以父盒子的line-height值，比如这里的例子，父盒子的line-height为200px，所以设定为25%的使用应当上移50px:

![Alt text](http://skyinlayer.com/img/verticalalign/17.png)

并不是很直观，给它加上一个`transfrom: translate(0, 50px)`（相对下移50px）,它又移到那个熟悉的位置了：

![Alt text](http://skyinlayer.com/img/verticalalign/18.png)

接下来看看length：

升高（正值）或降低（负值）子元素盒子。值为升高/降低的距离，如果为0，那么和`vertical-align:baseline`没有区别

> From W3C: Raise (positive value) or lower (negative value) the box by this distance. The value '0cm' means the same as 'baseline'.

以我们最常用的px作为单位，设定`vertical-align:50px`，效果就和上面百分比为25%效果一样了（200px * 25% = 50px）。这里就不做例子了

###vertical-align与line box
当`vertical-align`设置为top和bottom时，其就不是按照baseline进行定位了，而是根据line box进行定位。子元素盒子的顶部和底部也就是其上下margin外边界。而line box则是IFC中定义了一套规范，其高度计算如下：

1. 计算出line box内部的每个内联盒子的高度。对于替换元素、inline-block元素和inline-table元素，他们的高度是整个margin box的高度。而对于内联盒子，值是他们的line-height属性。
2. 内联盒子在垂直方向上根据他们的vertival-align属性来分布。当值为top或bottom时，他们必须以最小化line box高度的方式排布。如果那个盒子足够高，就会撑开line box
3. line box的高度是最上面盒子的顶端到最下面盒子的底端的值

比如之前的例子，父盒子的`line-height`为200px，而其中的`span`包含文字，所以根据第一条规则将line box的高度撑开到200px

如果设定子元素`height: 200px;`,`vertical-align: baseline`，那么可以看到整个父容器被撑开：

![Alt text](http://skyinlayer.com/img/verticalalign/19.png)

由于根据上面的`vertical-align: baseline`进行垂直定位，规则并没有变。而由于规则3，line box的高度需要包含所有的内容，所以整个line box被撑开

而如果在后面加一个元素：
```html
<div class="ctn-block">
    <div class="child1"></div>
    <span>Gg</span>
    <div class="big"></div>
</div>
```
```css
.ctn-block .big {
    display: inline-block;
    width: 100px;
    height: 400px;
    vertical-align: top;
    background-color: antiquewhite;
}
```

可以看到效果如下：

![Alt text](http://skyinlayer.com/img/verticalalign/20.png)

由于规则2的计算，line box被这个big元素撑开，达到400px，如果我们将其降低到200px：

![Alt text](http://skyinlayer.com/img/verticalalign/21.png)

则会由于其高度不够已有的高度，line box没有被撑开，这个big元素由于`vertical-align: top`而在line box顶端显示

###top
将子元素盒子的顶部和其所在的line box顶部对齐

> From W3C: Align the top of the aligned subtree with the top of the line box.

由之前所说，`vertical-align:top`将会让子元素盒子顶部与line box顶部对齐，而如果line box的高度小于子元素的高度，line box将会被撑开。我们先用一个高度较高的元素撑开line box，然后看看效果：

```html
<div class="ctn-block">
    <div class="child1"></div>
    <div class="big"></div>
</div>
```
```css
.ctn-block .child1 {
    display: inline-block;
    width: 100px;
    height: 100px;
    margin: 10px 0;
    vertical-align: top;
    background-color: aliceblue;
}
.ctn-block .big {
    display: inline-block;
    width: 100px;
    height: 200px;
    vertical-align: top;
    background-color: antiquewhite;
}
```

![Alt text](http://skyinlayer.com/img/verticalalign/22.png)

可以看到，big子元素撑开了line box，而child1的margin-top外边界紧贴在line box的顶端

###bottom
将子元素盒子的底部和其所在的line box底部对齐

> From W3C: Align the bottom of the aligned subtree with the bottom of the line box.

和top类似，由于big用于撑开line box，可以不必修改其`vertical-align`的值，仅修改child1为`vertical-align: bottom;`：

![Alt text](http://skyinlayer.com/img/verticalalign/23.png)

##vertical-align: middle让元素下移而不居中的问题分析
###问题
现在有三个inline-block块，高度分别为100px，200px，300px，想让高度为100px的块垂直居中，于是写出了如下代码：
```html
<div class="ctn-block">
    <div class="child child-1"></div>
    <div class="child child-2"></div>
    <div class="child child-3"></div>
</div>
```

```css
.ctn-block {
    display: inline-block;
    background-color: #bbb;
}

.ctn-block .child {
    display: block;
    width: 100px;
    background-color: aliceblue;
}

.ctn-block .child-1 {
    height: 100px;
    vertical-align: middle;
}
.ctn-block .child-2 {
    height: 200px;
}
.ctn-block .child-3 {
    height: 300px;
}
```

结果却只能得到如下效果：

![Alt text](http://skyinlayer.com/img/verticalalign/24.png)

child-1元素下移了，但是却没有居中。

###原因
从上面可以知道，`vertical-align: middle`的定位方式是：将子元素盒子的垂直中点与 父盒子的baseline加上父盒子的x-height的一半位置 对齐。

子元素的垂直中点还是比较好算的，而父盒子的baseline加上父盒子的x-height一半位置又是什么呢？

首先计算父盒子的baseline：三个子元素的baseline走在一条直线上，就是child-2和child-3的底部

然后加上父盒子的x-height：由于默认font-size是16px，而`font-family: sans-serif`，而其x-height的一半大概3-4px

综上，大致按照如下方式对齐：

![Alt text](http://skyinlayer.com/img/verticalalign/25.png)

###解决
一种方式是将最高的元素设为`vertical-align: middle`

然后将想要居中的也设定为`vertical-align: middle`,其他的根据需要设定`vertical-align: top/bottom`

由于设定为`vertical-align: middle`后，这个元素的对于line box来说，baseline就是其中线。而其他元素全部设定为`vertical-align: top/bottom`后，他们不影响line box的baseline，所以再将需要设定垂直居中的元素也设定为`vertical-align: middle`，他们的baseline必然在最高元素的baseline之上，所以会被强制下移，进行居中

###衍生的一种可行的垂直居中方案
为父容器设定一个伪元素`::after`，其高度为父元素的高度，`display:inline-block`，将其设定为`vertical-align: middle`即可撑开line box，同时line box的baseline为父元素高度一半的位置。然后设定子元素`vertical-align: middle`，即可实现居中

```html
<div class="g-ctn">
    <div class="g-mn">
        <p>这是内容区</p>
        <p style="font-size: 3em;">这是一大串的废话这是一大串的废话这是一大串的废话这是一大串的废话这是一大串的废话这是一大串的废话这是一大串的废话这是一大串的废话这是一大串的废话这是一大串的废话这是一大串的废话这是一大串的废话这是一大串的废话这是一大串的废话这是一大串的废话这是一大串的废话这是一大串的废话这是一大串的废话这是一大串的废话这是一大串的废话这是一大串的废话</p>
    </div>
    <!--[if lt IE 8]><span></span><![endif]-->
</div>
```
```css
.g-ctn {
    height: 800px;
    width: 100%;
    text-align: center;
}

.g-ctn:after,.g-ctn span{
    display:inline-block;
    *display:inline;
    *zoom:1;
    width:0;
    height:100%;
    vertical-align:middle;
}
.g-ctn:after{
    content:'';
}

.g-ctn .g-mn{
    display:inline-block;
    *display:inline;
    *zoom:1;
    width: 80%;
    max-height: 80%;
    max-width: 1000px;
    vertical-align:middle;
    overflow: auto;
}
```

这里需要使用一些hack，由于IE8-不支持`::after`伪元素，所以需要一个span来替代。而display: inline-block亦需要hack。

{% endraw %}