var path = require("path");
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      clean: ["_site"],
      initClean: ["_site", "publish"]
    },
    jekyll: {
      options: {
        src: "./",
        dest: "_site/"
      },
      build: {
        dist: {}
      },
      server: {
        options: {
          serve: true
        },
        serve: {}
      }
    },

    copy: {
      buildToPublish: {
        files: [{
          expand: true,
          cwd: '_site/',
          src: ['**'],
          dest: 'publish/'
        }]
      }
    },
    gitclone: {
      clone: {
        options: {
          repository: 'git@github.com:SPF-Team/SPF-Team.github.io',
          branch: 'master',
          directory: 'publish'
        }
      }
    },
    'gh-pages': {
      options: {
        base: '_site',
        branch: 'master',
        repo: 'git@github.com:SPF-Team/SPF-Team.github.io',
        user: {
          name: 'SPF-Team',
          email: 'webmaster@leapoahead.com'
        },
        clone: "publish",
        message: '小管家自动提交 @ ' + new Date().toLocaleString(),
        publish: true
      },
      publish: {
        src: ['**'],
      }
    }
  });

  grunt.registerTask('init', ['clean:initClean', 'jekyll:build', 'gitclone']);

  grunt.registerTask('default', ['clean:clean', 'jekyll:build']);

  grunt.registerTask('publish', ['default', 'copy:buildToPublish', 'gh-pages']);

  grunt.registerTask('server', ['clean:clean', 'jekyll:server']);

  grunt.registerTask('build', ['default']);
};