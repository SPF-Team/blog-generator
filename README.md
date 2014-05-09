# SPF Team Blog
这个代码仓库托管SPF前端开发团队的团队博客，所有团队内的成员均可在这里进行创作。

## 安装
博客程序基于[Jekyll](http://jekyllrb.com/)生成，因此你需要先安装Ruby。为了安装Ruby，首先你需要安装[rvm](https://rvm.io/)。

    $ \curl -sSL https://get.rvm.io | bash -s stable

使用rvm安装Ruby 1.9.3（必须安装这个版本才能正常使用本仓库的博客生成程序）。

    $ rvm install 1.9.3
    $ rvm use 1.9.3

进入本代码仓库的目录后，执行

    bundle install
    jekyll serve --watch

就可以在`http://localhost:4000`看到博客站点。**请确认站点在本地运行没有问题之后，再更新到github上。**


## Configuration
Edit: _config.yml (general options), main.css (theme colors &amp; fonts)

```
jekyll-incorporated/
├── _config.yml
├── _assets/
    ├── stylesheets/
        ├── main.scss
```

_Note: when editing _config.yml, you need to restart jekyll to see the changes.__

    
## Publish to Github Pages
1. Add your domain to _CNAME_
2. Edit your repo address at _Rakefile_
    
Run rake task. **NOTE: It will deploy the generated site to _gh-pages_ branch overwriting it**    
``` 
rake site:publish
```

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

