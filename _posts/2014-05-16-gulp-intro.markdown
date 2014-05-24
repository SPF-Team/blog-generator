---
layout: post

title: 新型自动化构建工具gulp
subtitle: 让自动化构建飞起来

excerpt: "本文介绍新型自动化构建工具gulp的使用方法。"

author:
  name: 子回
  email: webmaster@leapoahead.com
  bio: 前端开发工程师
---

## 声明
本文翻译自[Getting started with gulp](http://markgoodyear.com/2014/01/getting-started-with-gulp/)，本人翻译时进行了必要的改动。

## gulp简介

说到JavaScript自动化构建工具，大家都会想到ant和grunt。今天向大家介绍一个新的工具，[gulp](https://github.com/gulpjs/gulp?source=cc)。使用gulp将避免像使用grunt一样书写很多的配置代码，学习起来更加的快捷。

gulp使用node.js的stream API（流）执行自动化构建任务。使用流的好处就是不用每执行一个任务都要读写一次文件，在接下来的例子中，我将给你展示这点所带来的巨大好处。你可以使用gulp输入一个文件，将文件流pipe到一些插件中进行操作，然后写出到文件。  
在grunt中，你需要为每个插件书写输入文件，再书写输出文件。这样的话非常的不方便，特别是在项目文件结构变动的时候。下面的代码很能说明这个问题，这段代码是Gruntfile中的一个片段，它将Sass代码编译后传入autoprefixer进行自动前缀修饰。

{%highlight javascript%}
sass: {
  dist: {
    options: {
      style: 'expanded'
    },
    files: {
      'dist/assets/css/main.css': 'src/styles/main.scss',
    }
  }
},

autoprefixer: {
  dist: {
    options: {
      browsers: [
        'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
      ]
    },
    src: 'dist/assets/css/main.css',
    dest: 'dist/assets/css/main.css'
  }
},

grunt.registerTask('styles', ['sass', 'autoprefixer']);
{%endhighlight%}

正如你所见，使用grunt需要分别配置每个插件，并且定义每个插件的输入输出文件地址。有些根本就是不需要的中间文件，也会产生。比如上面的代码中，sass编译后的文件要让autoprefixer读入，那么又要在autoprefixer中去设置一次。

那么如果用gulp则怎么做呢？你看到代码一定会大吃一惊。

{%highlight javascript%}
gulp.task('sass', function() {
  return gulp.src('src/styles/main.scss')
    .pipe(sass({ style: 'compressed' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/assets/css'))
});
{%endhighlight%}

用gulp，我们只需要读入一次文件，并将其内容通过流管道"流经"gulp的插件，之后输出到指定位置。看到这里，我就不信你不兴奋。那么就让我们开始着手学习使用gulp吧。

## 安装gulp
我们首先需要安装gulp，通过npm可以安装：

{%highlight bash%}
$ npm install gulp -g
{%endhighlight%}

这样我们就在系统全局安装了gulp，方便我们在CLI中调用它。接下来我们还需要在项目中安装gulp，并将其存到`package.json`中

{%highlight bash%}
$ npm install gulp --save-dev
{%endhighlight%}

这样安装gulp后，还会把它加入到`package.json`的`devDependencies`记录里。

## 安装插件

上面看到的sass和autoprefixer都是gulp的插件，在这里我们列出常用的几个插件：

- Sass compile (gulp-ruby-sass)
- Autoprefixer (gulp-autoprefixer)
- Minify CSS (gulp-minify-css)
- JSHint (gulp-jshint)
- Concatenation (gulp-concat)
- Uglify (gulp-uglify)
- Compress images (gulp-imagemin)
- LiveReload (gulp-livereload, requires tiny-lr)
- Clean files for a clean build (gulp-clean)
- Caching of images so only changed images are compressed (gulp-cache)
- Notify of changes (gulp-notify)

完整的插件列表可以在文章开头给出的gulp的github主页找到。要安装上述插件，运行下面的命令

{%highlight bash%}
$ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-clean gulp-notify gulp-rename gulp-livereload tiny-lr gulp-cache --save-dev
{%endhighlight%}

## 加载插件

接下来，我们在项目的根目录创建gulpfile.js并加载这些插件。

{%highlight javascript%}
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();
{%endhighlight%}

哇塞！这看起来比grunt要写的还多嘛……LZ骗人T_T……

我没有骗你们，gulp的插件和grunt有一些小小的不同，gulp的每个插件执行的任务非常单一，都是专注于做好一件事情。比如，grunt的imagemin插件利用caching来避免重复压缩同样的文件，而gulp不一样，在gulp中cache插件与压缩插件是两个插件，而不像grunt一样一个插件包办两件事情。

当然了，我们也可以自动去加载这些插件，不必要每次都要写这一长串（其实你也不会用到这么多）。如果对自动加载插件感兴趣，[请点这里](https://github.com/jackfranklin/gulp-load-tasks)。  

注意下，LiveReload这个插件应该有不少人可以猜出来是用来做即时开发的，也就是页面会随着代码变化而变化，但是他还需要额外的工具`tiny-lr`支持。更多的信息，则需要去阅读其github主页的文档哦。

## 实战！创建任务
这次我们的任务是编译Sass代码，进行autoprefix，然后minify。

{%highlight javascript%}
gulp.task('styles', function() {
  return gulp.src('src/styles/main.scss')
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Styles task complete' }));
});
{%endhighlight%}

我们来一步步地看这份代码。

{%highlight javascript%}
gulp.task('taskname', function() { ... } )
{%endhighlight%}

定义一个任务，第一个参数给出的是任务名，第二个参数的函数即任务的主体。给出任务名以后，就可以在CLI下面直接运行`$  taskname`来执行某项具体任务，如果执行`$ gulp`则运行`default`任务。（这点跟grunt是一样的）  

{%highlight javascript%}
return gulp.src('src/styles/main.scss')
{%endhighlight%}

这是一个API——`gulp.src`，在这里我们可以定义输入文件（看src的字面意思便知）。它支持glob通配符，因此也可以是类似`/**/*.scss`的文件名输入。这样的话将会处理多个文件。 

{%highlight javascript%}
.pipe(sass({ style: 'expanded' }))
{%endhighlight%}

利用`.pipe(plugin)`将文件通过流管道"流通"，`plugin`即前面加载的任何插件。插件的参数一般都可以在他们的github主页找到。

{%highlight javascript%}
.pipe(gulp.dest('dist/assets/css'));
{%endhighlight%}

`gulp.dest`这个API负责输出文件。这点很酷，我们可以在这中间输出文件多次（比如上面代码中的两次文件输出）。有时候同时需要非minify的版本和minify的版本，这个时候这样的特性就派上用场了。我建议大家看一次[gulp的API文档](https://github.com/gulpjs/gulp/blob/master/docs/API.md)，才能对其功能有所了解。英文并不可怕！它很好读懂。想要了解其他的插件的使用方式，也都可以在他们的github主页找到！

## default任务

我们如果在cli运行`$ gulp`就可以启动default任务。在default任务中尽量不要动项目代码，而是通过`gulp.start` API启动其他的任务。这样可以让我们的gulpfile更好维护。我们都是工程师，都喜欢干净，整洁，符合规范的东西。

{%highlight javascript%}
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});
{%endhighlight%}

## 大观
我们来看一个比较完整的gulpfile，并且拿一个gruntfile作对比。它们两个分别都实现了相同的任务功能。看看，你喜欢哪个？别忘了告诉我：）

{%highlight javascript%}
// gulpfile.js
// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();
 
// Styles
gulp.task('styles', function() {
  return gulp.src('src/styles/main.scss')
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});
 
// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});
 
// Images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});
 
// Clean
gulp.task('clean', function() {
  return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {read: false})
    .pipe(clean());
});
 
// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});
 
// Watch
gulp.task('watch', function() {
 
  // Listen on port 35729
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err)
    };
 
    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles']);
 
    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);
 
    // Watch image files
    gulp.watch('src/images/**/*', ['images']);
 
  });
 
});
{%endhighlight%}

{%highlight javascript%}
// Gruntfile.js
/*!
 * Grunt
 * $ npm install grunt-contrib-uglify grunt-autoprefixer grunt-contrib-cssmin grunt-contrib-imagemin grunt-contrib-sass grunt-contrib-watch grunt-contrib-concat grunt-contrib-clean grunt-contrib-jshint grunt-notify --save-dev
 */
 
module.exports = function(grunt) {
 
  grunt.initConfig({
 
    // Sass
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'dist/styles/main.css': 'src/styles/main.scss'
        }
      }
    },
 
    // Autoprefix
    autoprefixer: {
      options: {
        browsers: [
          'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
        ]
      },
      dist: {
        src: 'dist/styles/main.css'
      }
    },
 
    // CSS minify
    cssmin: {
      dist: {
        files: {
          'dist/styles/main.min.css': 'dist/styles/main.css'
        }
      }
    },
 
    // JShint
    jshint: {
      files: ['src/scripts/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
 
    // Concat
    concat: {
      js: {
        src: ['src/scripts/**/*.js'],
        dest: 'dist/scripts/main.js'
      },
    },
 
    // Uglify
    uglify: {
      dist: {
        src: 'dist/scripts/main.js',
        dest: 'dist/scripts/main.min.js'
      },
    },
 
    // Imagemin
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3,
          progressive: true,
          interlaced: true
        },
        files: [{
          expand: true,
          cwd: 'src/images',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/images'
        }]
      }
    },
 
    // Clean
    clean: {
      build: ['dist/styles', 'dist/scripts', 'dist/images']
    },
 
    // Notify
    notify: {
      styles: {
        options: {
          message: 'Styles task complete',
        }
      },
      scripts: {
        options: {
          message: 'Scripts task complete',
        }
      },
      images: {
        options: {
          message: 'Images task complete',
        }
      },
    },
 
    // Watch
    watch: {
      styles: {
        files: 'src/styles/**/*.scss',
        tasks: ['sass', 'autoprefixer', 'cssmin', 'notify:styles'],
      },
      scripts: {
        files: 'src/scripts/**/*.js',
        tasks: ['concat', 'uglify', 'notify:scripts'],
      },
      images: {
        files: 'src/images/**/*',
        tasks: ['imagemin', 'notify:images'],
      },
      livereload: {
        options: { livereload: true },
        files: [
          'dist/styles/**/*.css',
          'dist/scripts/**/*.js',
          'dist/images/**/*'
        ]
      }
    }
  });
 
  // Default task
  grunt.registerTask('default', [
    'jshint',
    'clean',
    'concat',
    'uglify',
    'sass',
    'autoprefixer',
    'cssmin',
    'imagemin'
  ]);
 
  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-notify');
 
};
{%endhighlight%}

我想就我个人而言，gulp更具有描述性，更符合我们的思维方式。符合思维方式的东西用起来一定是易于维护的。

# 总结
gulp和grunt、ant，孰优孰劣，由你定夺。但是总是多了一条路让人选择，而且确实看着就让人兴奋。