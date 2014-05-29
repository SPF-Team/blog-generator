git add . -A
git commit -m "Regular commit"
git push origin master
bundle exec rake site:publish
