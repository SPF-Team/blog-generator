# SPF Team Blog
这个代码仓库托管SPF前端开发团队的团队博客，所有团队内的成员均可在这里进行创作。

## 我们是谁
SPF团队是一个Web前端开发团队，由2014年一同进入阿里巴巴集团的实习前端工程师组成。

## 安装
博客程序基于[Jekyll](http://jekyllrb.com/)生成，因此你需要先安装Ruby。为了安装Ruby，首先你需要安装[rvm](https://rvm.io/)。

    $ \curl -sSL https://get.rvm.io | bash -s stable

使用rvm安装Ruby 1.9.3（必须安装这个版本才能正常使用本仓库的博客生成程序）。

    $ rvm install 1.9.3
    $ rvm use 1.9.3

接下来你需要安装bundler（如果失败，请尝试用`sudo`进行安装）

    $ gem install bundler

接下来将[SPF-Team/blog-generator](https://github.com/SPF-Team/blog-generator) clone到本地

    $ git clone git@github.com:SPF-Team/blog-generator.git

接下来即可在本地部署博客
    
    $ cd blog-generator
    $ bundle install

运行下面的命令运行本地服务器

    $ jekyll serve --watch

就可以在`http://localhost:4000`看到博客站点。接下来，你可以根据[文章编写流程](#文章编写流程)编写新的文章。在确保你的文章可以正常显示后，就可以将其生成后发布。在`blog-generator`根目录下执行

    $ sh deploy.sh  # 如果是Windows系统，请打开deploy.sh文件，逐条执行里面的命令

**请确认站点在本地运行没有问题之后，再更新到github上。**


## 文章编写流程


## Usage examples

* Adroll Engineering http://tech.adroll.com/
* Brace.io blog http://blog.brace.io/
* Spark.io blog http://blog.spark.io/
* Department of Better Technology http://blog.dobt.co/

## Authors

Originally build for [sendtoinc.com](https://sendtoinc.com), your workspace for sharing and organizing knowledge

**Karri Saarinen**

+ [http://twitter.com/karrisaarinen](http://twitter.com/karrisaarinen)
+ [http://github.com/ksaa](http://github.com/ksaa)

**Jori Lallo**

+ [http://twitter.com/jorilallo](http://twitter.com/jorilallo)
+ [http://github.com/jorde](http://github.com/jorilallo)

## Todo:

+ Documentation
+ Less config files
+ Better deploy scripts

## Copyright and license

Copyright 2013 Kippt Inc. under [The MIT License ](LICENSE)

