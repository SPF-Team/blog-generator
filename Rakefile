require "rubygems"
require "tmpdir"
require 'rake'
require 'yaml'
require 'fileutils'
require 'rbconfig'
require "bundler/setup"
require "jekyll"


# Change your GitHub reponame eg. "kippt/jekyll-incorporated"
GITHUB_REPONAME = "SPF-Team/SPF-Team.github.io"

desc 'create new post or bit. args: type (post, bit), title, future (# of days)'
# rake new type=(bit|post) future=0 title="New post title goes here" slug="slug-override-title"
task :new do
  require 'rubygems'
  require 'chronic'
  
  type = ENV["type"] || "post"
  title = ENV["title"] || "New Title"
  future = ENV["future"] || 0
  slug = ENV["slug"].gsub(' ','-').downcase || title.gsub(' ','-').downcase
 
  if type == "bit"
    TARGET_DIR = "_bits"
  elsif future.to_i < 3
    TARGET_DIR = "_posts"
  else
    TARGET_DIR = "_drafts"
  end
 
  if future.to_i.zero?
    filename = "#{Time.new.strftime('%Y-%m-%d')}-#{slug}.markdown"
  else
    stamp = Chronic.parse("in #{future} days").strftime('%Y-%m-%d')
    filename = "#{stamp}-#{slug}.markdown"
  end
  path = File.join(TARGET_DIR, filename)
  post = <<-HTML
---
layout: post

title: 【这里填文章标题】
subtitle: 【这里填文章副标题】

excerpt: "【这里填文章的摘要，50~100字，注意不要去掉外面的引号】"

author:
  name: 【这里填你的名字】
  email: 【这里填你的email】
  bio: 【这里填你的工作，示例：淘宝UED 前端开发实习工程师】
---

 
HTML
  post.gsub!('TITLE', title).gsub!('DATE', Time.new.to_s).gsub!('TYPE', type)
  File.open(path, 'w') do |file|
    file.puts post
  end
  puts "new #{type} generated in #{path}"
end


# rake build
desc "Build the site"
task :build do
  execute("jekyll build")
end

namespace :site do
  desc "Generate blog files"
  task :generate do
    Jekyll::Site.new(Jekyll.configuration({
      "source"      => ".",
      "destination" => "_site"
    })).process
  end


  desc "Generate and publish blog to gh-pages"
  task :publish => [:generate] do
    Dir.mktmpdir do |tmp|
      cp_r "_site/.", tmp
      Dir.chdir tmp
      system "git init"
      system "git add ."
      message = "Site updated at #{Time.now.utc}"
      system "git commit -m #{message.inspect}"
      system "git remote add origin git@github.com:#{GITHUB_REPONAME}.git"
      system "git push origin master:refs/heads/gh-pages --force"
    end
  end
end
