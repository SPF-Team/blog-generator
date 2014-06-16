---
layout: post

title: 深入理解z-index

excerpt: "本文介绍z-index的工作原理，以及页面元素重叠的本质。"

author:
  name: 子回
  email: webmaster@leapoahead.com
  bio: 前端开发工程师
---

## 要解决的问题
在页面编写的过程中，经常需要处理元素的重叠。重叠的顺序不当则容易造成元素被错误地遮盖等现象。一般地，有很多人认为只需要指定元素的z-index即可调整重叠的顺序，但是实际上并不是这样的。

## 目录

- [重新理解页面维度](#重新理解页面维度)
- [默认重叠](#默认重叠)
- [Stacking-Context](#Stacking-Context)
- [什么样的元素是一个Stacking-Context](#什么样的元素是一个Stacking-Context)
- [多个Stacking-Context之间的重叠](#多个Stacking-Context之间的重叠)

<div id="重新理解页面维度"></div>
## 重新理解页面维度
当我们打开一个网页，我们会看到一个二维的世界。在这个二维的世界里，页面里的box（盒子）各有自己的x坐标和y坐标。比如，在下图所示的页面结构里面，有四个`div`元素。它们分别具有自己的宽和高，而每个box左上角的x和y坐标就分别是这个box在页面中的x和y坐标。因而，在我们直观的感知里，页面是二维的。

![2D页面的世界](http://ww4.sinaimg.cn/mw690/6aadf779gw1eheltpc2g7j211q0t075u.jpg)


然而，页面实际上还有第三个维度。垂直于x轴与y轴的方向，存在一个c轴。c轴的正方向指向用户。对于一个页面上的box，它一定有一个c坐标。**注意，此处的c坐标并不是z-index。下图中的坐标名有误，z应该是c。**

![3D页面的世界](http://ww3.sinaimg.cn/mw690/6aadf779gw1eheltpv2fij209x06ojrb.jpg)

两个重叠的box最能证明这第三个维度的存在，如果页面上有两个元素是重叠的，那么浏览器的渲染引擎必须决定哪一个box的重叠部分要被放在前面。决定的方法很简单，就是直接比较这两个元素的c坐标。c坐标大的那一个，就被渲染在前面；反之，则被压在下面。

你不能把c坐标的大小理解成离用户的远近，因为如果那样理解，那么应该有“近大远小”现象。然而事实上，c坐标大的box并不会变小，只是被浏览器渲染在c坐标小的box前面而已。就好像在现实生活中，我们把两张卡片叠在一起，它们会有上下之分，但是看起来两张卡片的大小并不会有所改变（因为它们足够薄且小）。会产生近大远小现象的应该是z坐标，学过一点空间几何的人都应该熟悉。这也是我称这个维度为c坐标而非z坐标的原因。

下面我们一起来探究一下页面box之间是如何重叠的，换句话说，浏览器是怎么决定一个box的c坐标的。

<div id="默认重叠"></div>
## 默认重叠
对于重叠的元素，浏览器默认会按下面的顺序重叠。编号越大的box类型，所拥有的c坐标就越大，因此排在前面。

1. 正常流当中的block level的box
2. 浮动的元素
3. 正常流当中inline level或者inline-block level的box
4. `position`值不是`static`（非正常流中）的box

这里并不是完整的列表，因为我略去了一些后面才会提到的内容。下面是一个示例：

<p data-height="268" data-theme-id="0" data-slug-hash="sLrKt" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/tjwudi/pen/sLrKt/'>sLrKt</a> by John Wu (<a href='http://codepen.io/tjwudi'>@tjwudi</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async="async" src="//codepen.io/assets/embed/ei.js"></script>

可以看到，上述四种不同类型的box中，具有最大c坐标的是第4种，它能够覆盖其他所有三种元素。

你需要注意的一点是，不要用DOM树的结构来理解重叠。DOM树中下一级的box完全可以重叠在上一级box之上。这都和Stacking Context有关，我们接下来就详细解释一下。

<div id="Stacking-Context"></div>
## Stacking-Context
上述四种box类型的重叠规律，当且仅当这些box在同一个Stacking Context的时候生效。不同Stacking Context中的box之间的重叠在下面会提到。

什么是Stacking Context？假设你正在玩贴纸，将很多贴纸贴到同一张纸上，并且贴纸之间可能产生重叠。Stacking Context就像是这张纸。浏览器首先按照默认的重叠规律，将同一个Stacking Context下的所有元素排好顺序，然后按照这个顺序渲染到Stacking Context上。例如，在下面的DOM结构中，有5个box，其中`node1`是一个Stacking Context，其他的都不是。

![Stacking Context 1](http://ww3.sinaimg.cn/mw690/6aadf779gw1eheltrbayzj20d109et8u.jpg)

在渲染的时候，浏览器将`node1`当做画板，其他box都是贴纸。在决定贴纸顺序的时候，浏览器是不会考虑它们DOM结构上的父子关系的。也就是说，`node3-1`完全可以被渲染在`node2-1`的后面，只要在前面所说的默认重叠顺序中，`node3-1`具有的c坐标比`node2-1`来得低即可。

整个“贴纸”的过程如下图。可以看到，浏览器在当前Stacking Context中，无视了“贴纸”们的DOM结构之间的关系，而是通过我们前面提到的默认重叠顺序决定“贴纸”的先后关系。决定之后，浏览器将所有“贴纸”贴到Stacking Context上，这个过程称作Composite（组合）。

![Stacking Context 组合](http://ww4.sinaimg.cn/mw690/6aadf779gw1eheltrvlgsj20yk14v40k.jpg)

<div id="什么样的元素是一个Stacking-Context"></div>
## 什么样的元素是一个Stacking-Context
符合下面要求的页面box，都是一个Stacking Context。

- 根元素（`html`元素）
- `position`是`absolute`或者`relative`，并且`z-index`不是`auto`的元素
- 是flex item，并且`z-index`不是`auto`的元素
- `opacity`值小于1的元素
- 在mobile webkit以及Chrome 22+中，`position: fixed`的元素

参考来源：[The stacking context - MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context)

<div id="多个Stacking-Context之间的重叠"></div>
## 多个Stacking-Context之间的重叠
由上面产生Stacking Context的条件，我们可以知道，一个页面上一般有多个Stacking Context。那么多个Stacking Context之间如何决定重叠顺序呢？浏览器一般按下面的规则来决定其顺序，这实际上就是之前我们提到的默认重叠顺序的完整版。

1. Stacking Context的背景和边框
2. 具有负的`z-index`的，且`position`值不是`static`（非正常流中）的子box的Stacking Context，且`z-index`数值越小，其c坐标越小
3. 正常流当中的block level的box
4. 浮动的元素
5. 正常流当中inline level或者inline-block level的box
6. `position`值不是`static`（非正常流中）的box，且`z-index`为0或者auto
7. 具有正的`z-index`的，且`position`值不是`static`（非正常流中）的子box的Stacking Context，且`z-index`数值越小，其c坐标越小

你需要注意到的是，`z-index`只能作用在`position`值不是`static`的box上方能起效。下面的例子可以说明多个Stacking Context之间的重叠规律。

<p data-height="268" data-theme-id="0" data-slug-hash="mjtxg" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/tjwudi/pen/mjtxg/'>mjtxg</a> by John Wu (<a href='http://codepen.io/tjwudi'>@tjwudi</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async="async" src="//codepen.io/assets/embed/ei.js"></script>

在这里，`.wrapper`、`#b1`和`#b2`分别都是一个Stacking Context。`#b1`和`#b2`是`.wrapper`的子Stacking Context，浏览器会首先组合`#b1`以及组合`#b2`，之后再将`#b1`和`#b2`组合到`.wrapper`上。由于`#b1`具有正的`z-index`，而`#b2`具有负的`z-index`，所以`#b1`被组合到了`#b2`的上面。

你可以试着把`#b1`的`z-index`改成`-2`，那么它就变成了第二类的box（和`#b2`一样），又因为它的`z-index`比`#b2`来得小，所以它会被组合到`#b2`之后。

## 总结
`z-index`只在同一个Stacking Context的组合过程中，参与各个子box的重叠顺序的决定。但是页面box的重叠关系并非仅仅和`z-index`有关。清楚地认识`z-index`的工作原理，有助于你写出更有效率的样式表。

如果有任何问题，欢迎在评论区讨论。

## 声明
本文图片和文章均为原创，转载请注明出处。这是对人最基本的尊重。