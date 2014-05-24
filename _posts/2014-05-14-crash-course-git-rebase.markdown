---
layout: post

title: "Git速成班: git rebase"

excerpt: "git rebase是经常被开发者忽略的功能，它允许我们在本地开发新功能的时候，能够创建出更整齐、漂亮的commit log。"

author:
  name: 子回
  email: webmaster@leapoahead.com
  bio: 前端开发工程师
---

## 简介
在Git中，用两种方法将两个不同的branch合并。一种是通过`git merge`，一种是通过`git rebase`。然而，大部分人都习惯于使用`git merge`，而忽略`git rebase`。本文将介绍`git rebase`的原理、使用方式及应用范围。

## git merge 做些什么
当我们在开发一些新功能的时候，往往需要建立新的branch。（图片来源于[git-scm.com](http://git-scm.com/)）

<img src="http://git-scm.com/figures/18333fig0327-tn.png" alt="" class="img-responsive">

在上图中，每一个绿框均代表一个commit。除了c1，每一个commit都有一条有向边指向它在当前branch当中的上一个commit。

图中的项目，在c2之后就开了另外一个branch，名为`experiment`。在此之后，`master`下的修改被放到c4 commit中，`experiment`下的修改被放到c3 commit中。

如果我们使用`merge`合并两个分支

    $ git checkout master
    $ git merge experiment

得到的commit log如下图所示

<img src="http://git-scm.com/figures/18333fig0328-tn.png" alt="" class="img-responsive">

我们看到，`merge`所做的事情实际上是：

1. 首先找到`master`和`experiment`中最新的commit的最近公共祖先，在这里就是`c4`和`c3`的最近公共祖先`c2`。
2. 将`experiment`分支上在`c2`以后的所有commit合并成一个commit，并与`master`合并
3. 如有合并冲突（两个分支修改了同一个文件），首先人工去除重复。
4. 在master上产生合并后的新commit

## git rebase做些什么
`rebase`所做的事情也是合并两个分支，但是它的方式略有不同。基于上例描述，`rebase`的工作流程是

1. 首先找到`master`和`experiment`中最新的commit的最近公共祖先，在这里就是`c4`和`c3`的最近公共祖先`c2`。
2. 将`experiment`分支上在`c2`以后的所有commit**全部移动到**`master`分支的最新commit之后，在这里就是把`c3`移动到`c4`以后。

<img src="http://git-scm.com/figures/18333fig0329-tn.png" alt="" class="img-responsive">

由于git的每一个commit都只存储相对上一个commit的变化（或者说是差值，delta）。我们通过移动c3到`master`，代表着在`master`上进行c3相应的修改。为了达成这一点，只需在`experiment`分支上`rebase master`

    $ git checkout experiment
    $ git rebase master

需要注意的是，`rebase`并不是直接将c3移动到master上，而是创建一个副本。我们可以通过实际操作发现这一点。在`rebase`前后，c3的hash code是不一样的。

`rebase`前的commit log是

    * 1b4c6d6 (master) <- c4
    | * 66c417b (experiment) <- c3
    |/  
    *   972628d

`rebase`后的commit log是

    * d9eeb1a - (experiment) <- c3'
    * 1b4c6d6 - (master) <- c4
    * 972628d

可以发现c3的hash code从`66c417b`变到了`d9eeb1a`。

在这之后，我们只需要在`master`上进行一次前向合并(fast-forward merge)

    $ git checkout master
    $ git merge experiment

<img src="http://git-scm.com/figures/18333fig0330-tn.png" alt="" class="img-responsive">

`rebase`之后的commit log呈线性，更加清晰。此时如果experiment分支不再被需要，我们可以删除它。

    $ git branch -d experiment

## 何时使用
我们一般只在本地开发的时候`rebase`一个自己写出来的branch。

谨记，**千万不要rebase一个已经发布到远程git服务器的分支**。例如，你如果将分支`experiment`发布到了GitHub，那么你就不应该将它`rebase`到`master`上。因为如果你将它`rebase`到`master`上，将对其他人造成麻烦。

## 总结
`git rebase`帮助我们避免`merge`带来的复杂commit log，允许以线性commit的形式进行分支开发。

更多有关`git rebase`的更多用法，见[这篇文章](http://git-scm.com/book/en/Git-Branching-Rebasing)。