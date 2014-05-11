---
layout: post

title: JavaScript动画实现初探

excerpt: "本文介绍如何使用JavaScript操作CSS实现最基础的动画效果。"

author:
  name: 伯周
  email: webmaster@leapoahead.com
  bio: 前端开发工程师
---

## 前言
现如今，许多页面上均有一些动画效果。适当的动画效果可以在一定程度上提高页面的美观度，具有提示效果的动画可以增强页面的易用性。

实现页面动画的途径有两种。一种是通过操作JavaScript间接操作CSS样式，每隔一段时间更新一次；一种是直接通过CSS定义动画。第二种方法在CSS3成熟之后被广泛采用。在本文中，我们讨论第一种方法的原理和实现。

## 目录

- [JavaScript动画实现原理](#JavaScript动画实现原理)
- [easing](#easing)

<span id="JavaScript动画实现原理"></span>
## JavaScript动画实现原理
首先我们需要知道两个重要的概念，动画时间进程和动画效果进程。

动画时间进程指从时间上看动画的完成度，是一个\[0, 1\]之间的数字。假设动画于时间戳`t1`开始，要在`t2`结束，当前时间戳为`t`，那么该动画目前的时间进程为`(t-t1)/(t2-t1)`。如果你不能理解，我建议你用纸笔画出来。理解这一概念对理解本文至关重要。

动画效果进程指**被动画的属性值**当前的增量。假设我们要将`#el`元素的CSS `left` 属性从`100px`变到`200px`，当前已经变到了`130px`，那么该动画目前的效果进程为`130px - 100px = 30px`。

假设动画时间进程和动画效果进程都是线性的。那么如果知道了动画时间进程，一定可以得到动画效果进程。

<img src="/images/2014-05-11-getting-started-with-implementations-of-script-based-animations/1.png" class="img-responsive" alt="">

根据这个解释，我们很快可以编写出一个线性的动画。

{%highlight javascript%}
    (function() {
      var begin, // 开始动画的时间
        el, start, end, duration; 
      var INTERVAL = 13;

      function now() {
        return (new Date).getTime();
      }

      /**
       * 执行一步动画（更新属性）
       */
      function _animLeft() {
        var pos = (now() - begin) / duration;
        if (pos >= 1.0) {
          return false;
        }
        return !!(el.style.left = start + (end - start) * pos);
      }

      /**
       * 对一个DOM执行动画，left从_start到_end，执行时间为
       * _duration毫秒。
       * 
       * @param  {object} _el       要执行动画的DOM节点
       * @param  {integer} _start   left的起始值
       * @param  {integer} _end     left的最终值
       * @param  {integer} _duration  动画执行时间
       */
      function animLeft(_el, _start, _end, _duration) {
        stopped = false;
        begin = now();
        el = _el;
        start = _start;
        end = _end;
        duration = _duration || 1000;

        var step = function() {
          if (_animLeft()) {
            setTimeout(step, INTERVAL);
          }
        };
        setTimeout(step, 0);
      }

      window.animLeft = animLeft;
    })();

    animLeft(
      document.getElementById('el'),
      100,
      200
    )
{%endhighlight%}

[JSBin](http://jsbin.com/fugey/1/edit)

<span id="easing"></span>
## easing
很多时候，我们需要的动画并非线性的。所谓非线性，从直观上看，就是动画速度随着时间会产生变化。那么如何实现变速的动画呢？

由前所述，我们知道通过控制动画的时间进程就相当于控制动画的效果进程。随着真实世界的时间进程推移，动画的时间进程跟着推移，从而控制动画的效果进程推移。那么，我们可以通过修改真实世界的时间进程和动画的时间进程间的映射关系，从而控制动画进程。如果你感到困惑，没关系，请看下图：

<img src="/images/2014-05-11-getting-started-with-implementations-of-script-based-animations/2.png" class="img-responsive" alt="">

这是线性动画中，真实世界的时间进程和动画进程的映射关系。接下来，我们将其进行变换

<img src="/images/2014-05-11-getting-started-with-implementations-of-script-based-animations/3.png" class="img-responsive" alt="">

这条曲线实际上是函数`y = x * x`的图像。可以看到，两个曲线的定义域和值域并没有变化。曲线的斜率就是动画的速率。接下来我们将两张图重叠在一起做一个对比。

<img src="/images/2014-05-11-getting-started-with-implementations-of-script-based-animations/3.png" class="img-responsive" alt="">

在真实世界的时间进行到`x0`的时候，动画进程原本应该进行到`y0`，在进行变换之后，只进行到`y1`。到最后，百川归海，两条线交汇于点(1, 1)。这里，`y = x * x`是**变换函数（easing function）**。

我们修改一下上面的例子，让动画变成非线性的。

{%highlight javascript%}
    function ease(time) {
      return time * time;
    }

    /**
     * 执行一步动画（更新属性）
     */
    function _animLeft() {
      var pos = (now() - begin) / duration;
      if (pos >= 1.0) {
        return false;
      }
      pos = ease(pos);
      return !!(el.style.left = (start + (end - start) * pos) + "px");
    }
{%endhighlight%}

[JSBin](http://jsbin.com/sigoq/2/edit)

我们可以在jQuery的代码中看到这样的函数。

{%highlight javascript%}
    jQuery.easing = {
      linear: function( p ) {
        return p;
      },
      swing: function( p ) {
        return 0.5 - Math.cos( p * Math.PI ) / 2;
      }
    };
{%endhighlight%}

因此，你可以往jQuery.easing里面添加easing function，使得jQuery支持新的动画速率控制方法。注意，easing function的定义域和值域必须都为\[0, 1\]。

{%highlight javascript%}
    jQuery.easing.myEasing = function( p ) { return ... }
{%endhighlight%}

## 总结
本文介绍了JavaScript动画的最基本的原理。

JavaScript动画实质上也是通过操作CSS去执行动画。动画的时间进程可以决定动画的效果进程。通过操作真实世界的时间进程和动画的时间进程之间的关系，我们可以将线性动画变换成非线性的动画。
