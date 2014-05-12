---
layout: post

title: JavaScript in-between原理与应用

excerpt: "本文介绍in-between（tween）的原理，实现。并介绍in-between在动画中的应用。"

author:
  name: 伯周
  email: webmaster@leapoahead.com
  bio: 前端开发工程师
---

## 简介
本文将介绍in-between的概念，以及in-between类库[Tween.js](https://github.com/sole/tween.js)的实现。接着，我将介绍一些常见的in-between的好玩的用法。最后，我还将介绍jQuery Effects对in-between的应用。

## 目录

- [什么是tween](#什么是tween)
- [Tween.js](#Tween.js)
- [有趣的应用](#有趣的应用)
- [jQuery中的Tween](#jQuery中的Tween)

<div id="什么是tween"></div>
## 什么是tween
tween是[in-between](http://en.wikipedia.org/wiki/Inbetweening)的另一种写法。一个tween指的是**让对象的属性值平滑变化的一个过程**。

那么，什么是平滑变化？假设在9点10分的时候，对象`foo.a`的值为0。在9点20分的时候，我希望它的值变成1。如果`foo.a`是非平滑变化的，在9点10分到9点20分（除9点20分外）之间它依然是0。如果它是平滑变化的，那么它应该在9点10分到9点20分之间的每一个时间点上的值都不同，并且是根据一定函数规律变化的。

tween就是这个平滑变化的过程。

<img src="/images/2014-05-12-javascript-in-between/1.png" alt="平滑变化示意图" class="img-responsive">

这就好比一个人溜冰一样。你要从点a滑到点b，你是不可能一开始一直呆在a点，直到最后通过[超时空转换](http://www.baike.com/wiki/%E8%B6%85%E6%97%B6%E7%A9%BA%E8%BD%AC%E6%8D%A2)直接把自己变到b点的。要从a点滑到b点，你必须经过一个路径，从而**平滑地**从a点滑到b点。

<div id="Tween.js"></div>
## Tween.js
[Tween.js](https://github.com/sole/tween.js)是用来在JavaScript当中实现tween的一个工具库。我们接下来讲解它的实现。在实际应用中，我们一般自己编写自己的Tween类，或者复制并修改开源工具库中的Tween类，因为**自己编写的总是最符合自己业务需求的**。大部分Tween工具库包含了很多你用不到的东西，在后面我会提到。

为了使用Tween.js，你需要先有一个待变化的对象。在下面的例子里，我们将对象`foo`初始化为`{a: 1}`（初始状态），并要求它在3000毫秒后变成`{a: 4}`（目标状态）。变化过程采用线性变化，即每个时间点的变化速率相等。

{%highlight javascript linenos%}
var foo = {a: 1}, /*初始状态*/
  tween = new TWEEN.Tween(foo)
    .to({a: 4} /*目标状态*/, 3000 /*变化时间*/)
    .start();

  (function animate() {
    if ( foo.a < 4 ) {
      requestAnimationFrame(animate);
    }
    TWEEN.update();
    console.log(foo);
  })();
{%endhighlight%}

如果你查看Chrome Inspector（或者Firefox下的Firebug插件），你将会看到控制台中输出了下面的数据

    Object {a: 1.0001740000443533} 
    Object {a: 1.0924470000900328} 
    Object {a: 1.1527340000029653} 
    Object {a: 1.1701550000580028} 
    Object {a: 1.185736000072211}
    ... ...

#### 喘口气

回过头来，我们来稍微解释一下上面的代码段。首先我们创建一个`foo`对象的tween

{%highlight javascript linenos%}
var foo = {a: 1}, /*初始状态*/
  tween = new TWEEN.Tween(foo);
{%endhighlight%}

接下来，我们需要将确认foo对象的目标状态，在这里是`{a: 4}`，并且要求它正好在3000毫秒后到达目标状态。

{%highlight javascript linenos%}
tween.to({a: 4} /*目标状态*/, 3000 /*变化时间*/);
{%endhighlight%}

最后，我们需要激活这个tween，代表开始变化。调用`tween.start()`的时间就是开始变化的时间时间戳，除非你调用了`tween.delay()`方法。你还可以给`tween.start(time)`传入一个额外参数`time`，直接指定开始变化的时间戳。我们可以通过源码验证这点

{%highlight javascript linenos%}
_startTime = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );
_startTime += _delayTime;
{%endhighlight%}

值得注意的是，在没有delay和指定time参数的情况下，Tween.js将优先使用`window.performance.now()`获取当前的时间戳，这样的时间戳是高精度时间戳（精度为10μs）。这是HTML5当中的新增的[DOMHighResTimeStamp API](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp)。

#### 询问进度

我们通过`animate`函数来轮询`foo`对象目前的状态。采用`requestAnimationFrame`进行异步调用，效率会更高。你也可以选择用`setTimeout`，jQuery就是这样做的。

在询问的时候，你首先需要调用`TWEEN.update()`更新所有的tween。

{%highlight javascript linenos%}
(function animate() {
  if ( foo.a < 4 ) {
    requestAnimationFrame(animate);
  }
  TWEEN.update();
  console.log(foo);
})();
{%endhighlight%}

#### 精髓
使用in-between的精髓就在于，它将属性的变化和询问分离。如果你熟悉MVC，属性的变化就好像是MVC里面的Model，而询问就好像是Controller，最后我们输出到控制台（Console）就好像是View。

> “历史总是惊人地相似”

分离带来的好处是什么呢？它使得我们可以统一管理所有页面上的Tween，而不用关心它们究竟用于什么途径。接下来，我们通过实践来证明这一点。

<div id="有趣的应用"></div>
## 有趣的应用
首先你需要先将Tween.js的GitHub代码仓库复制到本地

    git clone git@github.com:sole/tween.js.git
    cd tween.js

在`examples`目录里面有许多有趣的应用，我们只看其中第二个例子`01_bars.html`。在这个例子中，有1000个彩条在屏幕上水平移动。每个彩条都对应两个tween，一个是从出发位置到目标位置的，一个是返回出发位置的。

{%highlight javascript linenos%}
var tween = new TWEEN.Tween(elem)
  .to({ x: endValue }, 4000)
  .delay(Math.random() * 1000)
  .onUpdate(updateCallback)
  .easing(TWEEN.Easing.Back.Out)
  .start();

var tweenBack = new TWEEN.Tween(elem, false)
  .to({ x: startValue}, 4000)
  .delay(Math.random() * 1000)
  .onUpdate(updateCallback)
  .easing(TWEEN.Easing.Elastic.InOut);

tween.chain(tweenBack);
tweenBack.chain(tween);
{%endhighlight%}

Tween.js支持事件`onUpdate`，每当`TWEEN.update()`被调用的时候，会触发所有tween的`update`事件。另外，你还能为每个tween设置easing function。如果你不清楚什么是easing function，可以看我昨天写的文章[《JavaScript动画实现初探》](/2014/05/11/getting-started-with-implementations-of-script-based-animations/)。

由于Tween.js和其他支持in-between的类库都含有大量预置的easing function，其中有很多我们用不到的。所以，就像本文前面提到的一样，我们经常需要定制自己的Tween类库。

这里还用到了chaining来循环动画，`tween`结束后将启动`tweenBack`，`tweenBack`启动后会再次启动`tween`。

<div id="jQuery中的Tween"></div>
## jQuery中的Tween
jQuery中也采用了Tween来管理动画的效果进度。在jQuery 1.8之后，引入了Tween来管理动画效果进度，原先的`jQuery.fx`和`Tween.prototype.init`是相同的。之所以保留`jQuery.fx`，是为了兼容以前的插件。

{%highlight javascript linenos%}
jQuery.fx = Tween.prototype.init;
{%endhighlight%}

对于动画中需要变化的每一个属性，jQuery都为其创建一个Tween。

{%highlight javascript linenos%}
jQuery.map( props, createTween, animation );

function createTween( value, prop, animation ) {
  var tween,
    collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
    index = 0,
    length = collection.length;
  for ( ; index < length; index++ ) {
    if ( (tween = collection[ index ].call( animation, prop, value )) ) {
      // we're done with this property
      return tween;
    }
  }
}
{%endhighlight%}

每隔一段时间，jQuery要求每隔DOM节点的tween根据当前进度更新style。

{%highlight javascript linenos%}
for ( ; index < length ; index++ ) {
  animation.tweens[ index ].run( percent /*当前动画的时间进度*/);
}
{%endhighlight%}

jQuery当中并没有用`requestAnimationFrame`一直去询问，而是采用`setTimeout`每隔13ms去询问，然后更新界面。13ms是一个平衡点，不会太长，也不会太短。

{%highlight javascript linenos%}
jQuery.fx.start = function() {
  if ( !timerId ) {
    timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
  }
};
{%endhighlight%}

## 总结
本文介绍了in-between，并介绍了它的原理以及一些应用。in-between主要用在页面效果动画，数据可视化当中。你可以让它和一些著名的数据可视化库（如[d3.js](http://d3js.org/)）协同工作。你可以查看Tween.js的examples，学到更多相关的应用。

