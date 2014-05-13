# SPF Team Blog
这个代码仓库托管SPF前端开发团队的团队博客，所有团队内的成员均可在这里进行创作。

## 索引

- [我们是谁](#我们是谁)
- [安装](#安装)
- [文章编写流程](#文章编写流程)

## 我们是谁
SPF团队是一个Web前端开发团队，由2014年一同进入阿里巴巴集团的实习前端工程师组成。

## 安装
博客程序基于[Jekyll](http://jekyllrb.com/)生成，因此你需要先安装Ruby。这一步在Mac/Linux下和Windows下略有差别。

####Mac/Linux
为了安装Ruby，首先你需要安装[rvm](https://rvm.io/)。

    $ \curl -sSL https://get.rvm.io | bash -s stable

使用rvm安装Ruby 1.9.3（必须安装这个版本才能正常使用本仓库的博客生成程序）。

    $ rvm install 1.9.3
    $ rvm use 1.9.3

安装和使用rvm的时候可能会遇到一些问题（比如可能会出现rvm cannot be used as a command之类的问题），在这里我们不多赘述。一些常见的问题都可以在Google上找到答案。


####Windows
Windows下有集成好的Ruby安装包[Rubyinstaller](http://rubyinstaller.org/downloads/)。请务必选择1.9.3版本，并且在安装时记住勾选添加环境变量。另外在1.9.2之后的Rubyinstaller中已经内置了gem的安装，所以我们也不需要专门去安装gem。

接下来，在Windows下你还需要安装[DevKit](http://rubyinstaller.org/downloads/)才能正常使用gem。DevKit就在当前下载页面的下方，请选择和Ruby1.9.3对应的版本下载并解压。然后执行。

    $ cd devkit
    $ ruby dk.rb init
    $ ruby dk.rb install

####相同部分
接下来你需要安装bundler（如果失败，请尝试用`sudo`进行安装）

    $ gem install bundler

接下来将[SPF-Team/blog-generator](https://github.com/SPF-Team/blog-generator) clone到本地

    $ git clone git@github.com:SPF-Team/blog-generator.git

接下来即可在本地部署博客
    
    $ cd blog-generator
    $ bundle install

运行下面的命令运行本地服务器

    $ jekyll serve --watch

就可以在`http://localhost:4000`看到博客站点。

如果有NodeJS环境，在运行`npm install`安装所需要的包后，有如下指令可以使用：
* 使用命令`grunt init`进行安装，提交前请使用这个命令初始化
* 使用命令`grunt server`编译并启动服务器
* 如果只需要编译生成`_site`文件夹而不启动服务器，可以使用`grunt`或者`grunt build`命令进行编译

## 文章编写流程

#### 创建新文章
创建一个新文章，运行

    $ rake new title="文章标题" slug="标题英文缩写"

其中slug参数是必须填写的，并且必须由**小写英文字母或者短线`-`**组成。slug将决定你的博客发布后的url地址。例如，当你设置`slug="my-post"`后，你的博客地址将是`http://yourhost/path/to/post/my-post`。  
新生成的文章将被生成到_posts文件夹下，格式为`YY-mm-dd-slug.md`。打开后会看到生成的新文章，内容初始为：

    ---
    layout: post

    title: [Your post title here]
    subtitle: [Your post sub-title here]

    excerpt: "[Your post excerpt here, do not remove the wrapping quotes.]"

    author:
      name: [Your name here]
      email: [Your email here]
      bio: [Your job here]
    ---

其中每一项对应一些该文章的属性。

- title：文章标题
- subtitle：文章小标题
- excerpt：文章摘要（50到100字为宜），请注意不要去掉双引号。
- author.name：你的名字
- author.email：你的email（将影响你的头像显示，默认采用你gravatar上的头像）
- author.bio：你的个人职位（举例：淘宝UED 实习前端工程师）

示例如下

    ---
    layout: post

    title: 有关JavaScript性能优化的一些实验
    subtitle: 基于现有流行框架的总结

    excerpt: "在这篇文章中，我将通过剖析现有流行JS框架的实现，以及评测现有流行JS框架的性能，探讨一些有关JavaScript性能优化的问题。"

    author:
      name: 伯周
      email: webmaster@leapoahead.com
      bio: 淘宝UED 实习前端工程师
    ---

####发布文章
在确保你的文章可以正常显示后（通过本地运行`jekyll serve --watch`并访问http://127.0.0.1:4000），就可以将文章发布。为了发布文章，你只需要在`blog-generator`根目录下执行

    $ sh deploy.sh  # 如果是Windows系统，请打开deploy.sh文件，逐条执行里面的命令

**请确认站点在本地运行没有问题之后，再更新到github上。**

如果使用NodeJS环境的话，本地运行`grunt server`后能够正常访问http:/localhost:4000/，可以通过grunt publish发布文章了

####修改文章
如果你想要修改以前发布过的文章，只需要找到文章对应的markdown文件（在_posts目录下），进行相应的修改后，再次发布即可。

## 文章编写帮助

#### 添加本地图片
添加本地图片是在编译文章前需要完成的事情。你只需要将图片放到[blog-generator](https://github.com/SPF-Team/blog-generator)的`/images`目录下。编译后，这个图片就会被放到站点根目录下的`/images`目录下。

#### 其他帮助
请参考[伯周](http://github.com/tjwudi)编写的[博客风格指南](http://spf-team.github.io/2014/05/09/spf-intro/)。
