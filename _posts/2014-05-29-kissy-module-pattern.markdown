---
layout: post

title: "KISSY On The Way (1) - Module Pattern"
subtitle: "让你更好地认识KISSY"

excerpt: "本文介绍KISSY 1.4中的模块机制，以及组织多页面应用的JS脚本"

author:
  name: 子回
  email: webmaster@leapoahead.com
  bio: 前端开发工程师
---

## 简介
KISSY是一款跨终端、模块化、高性能、使用简单的JavaScript框架。除了完备的工具集合如DOM、Event、Ajax、Anim等，它还提供了经典的面向对象、动态加载、性能优化解决方案。作为一款全终端支持的JavaScript框架，KISSY为移动终端做了大量适配和优化，让你的程序在全终端均能流畅运行。

本文介绍KISSY中提供的模块化方案，并且阐述如何利用KISSY的模块化方案构建多页面的站点。内容主要为以下几个部分

- [模块化JavaScript](#模块化JavaScript)
- [KISSY模块](#KISSY模块)
- [组织多页面应用](#组织多页面应用)

其中第一个部分“模块化JavaScript"是老生常谈的问题。但是鉴于读者来自不同的技术背景，我在这里还是会阐述这个内容。如果你觉得你不需要看这一部分内容，你可以很轻松地跳过它。

<div id="模块化JavaScript"></div>
## 模块化JavaScript
在现代Web应用中，HTML负责定义页面的骨架，CSS负责定义页面的样式，JavaScript负责定义页面的动态交互效果。一开始的时候，人们经常把页面的全部JavaScript代码直接写写在页面的`script`标签当中。到后来，应用体积越来越大，为了让页面代码更易于维护，也为了让多个页面可以重用代码，人们开始将JavaScript代码分离到单独的文件中。当一个页面需要使用某段JavaScript代码功能时，可以通过`script`标签的`src`属性引用这个代码文件。

{%highlight html%}
<script src="external.js"></script>
{%endhighlight%}

为了更好地组织这些外部JS文件，模块化JS的方法就应运而生了。一个JS模块是一个封装好的功能单元，当一个页面需要这个功能时，可以通过模块的名称来调用它。

例如“MyYahoo”的[首页](http://my.yahoo.com)（如下图）。

![MyYahoo首页](http://ww2.sinaimg.cn/mw690/6aadf779gw1egv02kzw75j21k00xwqfn.jpg)

最左上角的“天气”就是一个模块，我们假设它封装在`weather.js`中，它的模块名为`srv-weather`。最右上角的广告也是一个模块，假设它封装在`ad.js`中，它的模块名为`srv-ad`。那么页面就可以通过模块名调用这两个模块：

{%highlight html%}
<script>
    // 伪代码
    Framework.use(['weather', 'ad'], function(weather, ad) {
        weather.render(...); // 使用weather模块
        ad.render(...); // 使用ad模块
    });
</script>
{%endhighlight%}

可以看到，模块化的JavaScript具有下面的好处：

1. 模块保持高度独立，代码的耦合度低
2. 代码可重用度高
3. 创建匿名函数作为模块逻辑代码运行的scope（域），防止污染全局变量。

模块化的思想在生活中无处不在。比如在做录音的后期处理的时候，当录音师需要对人声添加混响，那么他就可以在Cubase（一个可以进行音频处理的软件）中对人声轨调用混响模块。他还可以对另一个声轨（比如小提琴声轨）添加混响，操作的方法也是直接调用混响模块。在这个过程中，混响模块是可以被多次调用的，达到了重用的目的。

<div id="KISSY模块"></div>
## KISSY模块
KISSY中提供了完备的模块化支持。接下来我们先从介绍如何编写一个简单的模块开始。在做所有的事情之前，你需要引用KISSY的seed文件（种子文件），它包含KISSY的核心功能。这个文件在淘宝CDN上，你可以直接使用。

{%highlight html%}
<script src="http://g.tbcdn.cn/kissy/k/1.4.3/seed.js"></script>
{%endhighlight%}

#### 编写简单的模块
你可以通过`KISSY.add`新增一个模块，并将它放在一个文件中。这里假设我们要添加一个登陆框UI组件的模块，这个模块的路径为`ui/login-form.js`。

{%highlight javascript%}
// login-form.js
(function(S) {
    S.add(function(S, Node) {
        function LoginForm() {};
        // ... More code
        return LoginForm; 
    }, {
        requires: ['node']
    });
})(KISSY);
{%endhighlight%}

这里创建了一个匿名的模块。一般情况下，我们创建的模块都是匿名的。模块的名字一般就是该模块文件的相对路径去掉`.js`的扩展名。例如在这个例子中，我们的模块名称就是`ui/login-form`。

第一个参数就是我们的模块逻辑，在这里我们返回`LoginForm`类。这个类封装了我们模块的一些逻辑，比如渲染界面、事件处理等。

第二个参数定义一些跟这个模块有关的参数，这里我们通过`requires`配置选项来指定这个模块的依赖模块（dependencies），KISSY会为我们自动加载这些依赖模块。这里的`node`模块是KISSY内置的一个模块，主要用于DOM操作。[文档](http://docs.kissyui.com/1.4/docs/html/api/node/index.html)

#### 模块放哪里？
一般情况下，当你引用模块`a/b/c`的时候，KISSY会在`http://g.tbcdn.cn/kissy/k/1.4.3/a/b/c.js`找这个模块。其中，`http://g.tbcdn.cn/kissy/k/1.4.3`是一个基地址。你可以通过`KISSY.config`修改基地址。[文档](http://docs.kissyui.com/1.4/docs/html/api/loader/config.html)

{%highlight javascript%}
KISSY.config({
    base: "http://localhost/scripts/" 
});
{%endhighlight%}

这样，如果加载模块`ui/login-form`，那么KISSY将会在`http://localhost/scripts/ui/login-form.js`找到这个模块。

#### 使用模块
通过`KISSY.use`可以创建一个封闭的沙盒，你可以包含一些依赖的模块。比如，我要创建一个登录的页面，那么在这个页面上我们就需要引入`ui/login-form`这个模块。

{%highlight javascript%}
(function(S) {
    KISSY.use('login-form', function(S, LoginForm) {
        (new LoginForm()).render(...);
        // ... More code
    });
})(KISSY);
{%endhighlight%}

第一个参数指定所有的依赖模块的名字，并由半角逗号隔开。第二个参数是我们的匿名函数（沙盒），第一个参数传入的是`KISSY`对象自身，接下来是所有的依赖模块返回的对象。

如果你还记得，我们刚才编写的`login-form`模块返回了一个类`LoginForm`。因此，在这里，我们只需实例化这个类，并通过这个实例对象往页面上添加我们的登陆框（这里假设用了`render`方法来添加登陆框）。

#### Combo!
一般而言，一个页面上可能需要十多个模块。这十多个模块中，有的是你要的模块，有的是你要的模块的依赖模块，有的是依赖模块的依赖模块……

那么，如果让浏览器加载这么多的模块，必然会产生很多的HTTP请求。如果HTTP请求太多，将会严重拖慢页面的加载进度。

一般情况下，我们一般采取本地编译的方法。通过本地编译，将所有模块合并成一个文件，并根据文件的路径赋予每个模块名称。如果这样做，HTTP请求的数量就会大大减少。但是这个方法存在一个问题，就是会让人心情不好。

KISSY支持向服务器传送一串参数，代表请求的所有模块名，并由服务器来动态合并这些文件，并放到CDN（内容分发网络）上。要做到这一点，只需要在加载`seed.js`的时候，在`script`标签上加上`data-config="{combine:true}"`属性，KISSY就会自动切换成让服务器合并文件的方式了。

{%highlight html%}
<script src="http://g.tbcdn.cn/kissy/k/1.4.3/seed.js" data-config="{combine:true}"></script>
{%endhighlight%}

这时候，如果你观察网络传输面板（Chrome中通过开发者工具可以打开），会看到你的页面只发出了一个到`g.tbcdn.cn`的请求。请求的URL是类似`http://g.tbcdn.cn/kissy/k/1.4.3/??node.js,dom/base.js,event/dom/base.js`的形式，后面的参数即需要合并的模块文件。

Combo是需要服务器端（或者CDN）支持的，实现一个支持Combo的简单服务器应用并不难，这里我们不再多阐述。如果你使用过[Koa](https://github.com/koajs/koa)，那么你可以用它来做静态资源服务器。配合我所编写的一个中间件[koa-combo](https://github.com/tjwudi/koa-combo)，以及koa的cache中间件，就可以搭建一个支持combo的静态资源服务器。

#### 包
有的时候，所有的模块并不在一个域名下面。回想一下，在常见的程序设计语言（如Java中），我们经常需要创建“命名空间”，或者说“包”。比如，在Java中，类`A`在包`com.zihui.pkg1`下，类`B`在包`com.zijue.pkg2`下，那么在引用类`A`的时候，我们需要使用它的包名+类名来访问它，即`com.zihui.pkg1`，引用类`B`时，我们使用`com.zihui.pkg2`来访问它。

KISSY中提供了类似的机制，也叫做包机制。假设我们有一个模块`ui/login-form`，基地址为`http://g.tbcdn.cn/common`。另一个模块`ui/dynamic-nav`，基地址为`http://ju.tbcdn.cn/common`。那么我们为这两个基地址定义两个包。

{%highlight javascript%}
KISSY.config({
    packages:{
        "g": { base: 'http://g.tbcdn.cn/common/' },
        "ju": { base: 'http://ju.tbcdn.cn/common/' }
    }
});
{%endhighlight%}

那么我们就可以通过`g/ui/login-form`访问原来的`ui/login-form`模块，通过`ju/ui/dynamic-nav`访问原来的`ui/dynamic-nav`。

<div id="组织多页面应用"></div>
## 组织多页面应用

> 自古华山一条路？No！条条大路通罗马！

通过模块化的JS代码，可以很轻松地构建大型的应用程序。构建多页面大型应用程序的方式有很多种方式，这里我们介绍其中比较常见的一种。

#### 功能模块与页面模块
我们刚才谈到的一个个独立的模块都是功能模块。比如天气模块，日历模块，登陆表单模块等。

页面的脚本也可以做成模块，我们称为页面模块。**页面模块封装一类页面的交互功能**。这里我们拿聚划算的活动页面做为例子。[聚划算](http://ju.taobao.com)经常会举办一些团购活动，一些活动会有对应的主页。比如[这个活动](http://ju.taobao.com/jusp/xueguolieche/tp.htm)和[这个活动](http://ju.taobao.com/jusp/jiancaijicai/tp.htm)（这些页面不一定存在，因为你在看这篇文章的时候，它们可能已经下线了）。

我们可以观察到，在聚划算的活动页面中，有不少可以重用的模块。比如商品的展示卡片模块（如下图）。

![聚划算商品展示模块](http://ww4.sinaimg.cn/mw690/6aadf779gw1egvbun9stdj21i60iitfy.jpg)

除了商品展示模块经常在活动页面**出没**外，还有不少的其他组件以及页面特效。因此，大部分的活动页面的交互功能是一样的。我们可以为活动页面专门编写一个模块，这个模块适用于所有的活动页面。聚划算的活动页面模块[在这里](http://g.tbcdn.cn/ju/jsp/1.0.27/??pages/activity/index.js)。

页面模块在一般情况下就是加载页面需要的功能模块，并且再加一些页面的交互逻辑代码。聚划算活动页面中，加载页面模块的代码如下：

{%highlight javascript%}

S.config({
   packages: [
      {
          name: "pages",
          path: "http://g.tbcdn.cn/ju/jsp/1.0.27",
          charset: "utf-8",
          debug : true
      },
      {
          name: "mods",
          path: "http://g.tbcdn.cn/ju/jsp/1.0.27",
          charset: "utf-8",
          debug : true
      }
  ]
});

KISSY.ready(function (S) {
    S.use('pages/activity/index', function (S, Init) {
        new Init();
    });
});

{%endhighlight%}

页面上定义了两个包，`pages`包和`mods`包。他们的基地址是一样的，但是为了包名更加具有实际意义，还是将其分成了两个包。最后，我们通过加载`pages/activity/index`模块（也就是刚才我们给出的那个页面模块）给页面加上交互功能。


## 总结
模块化解耦合是软件工程上一个常用的功能组织方式。通过将功能模块化，我们的代码能获得更好的可维护性，也易于测试。
