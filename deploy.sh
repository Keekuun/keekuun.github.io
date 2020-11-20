#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 发布到自定义域名
echo 'docs.zkkysqs.top' > CNAME

git init
git add -A
git commit -m ':rocket: deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:zkkysqs/blog.git master:gh-pages
#git push -f git@gitee.com:keekuun/blog.git master:gh-pages


# coding
#echo 'docs.zkkysqs.top' > CNAME
#git add -A
#git commit -m 'deploy'
#git push -f git@e.coding.net:keekuun/notes/blog.git master:gh-pages # 发布到coding

#回到上级目录
cd -
