@echo off

echo building...
call build.bat
echo building-complete.

cd docs/.vuepress/dist

git init
git config user.name keekuun
git config user.email zkkysqs@outlook.com
git add -A
git commit -m "%date% %time% auto-deploy"
REM 静默推送的话可在地址里填入username和password,如
REM git remote add origin https://username:password@gitee.com/username/repo.git
git remote add origin https://gitee.com/keekuun/blog.git
git pull
git push --force origin HEAD:gh-pages
echo "Gitee Pages Deploy Complete!"

REM 部署完上面的 Gitee Pages
REM 需要删除 .git 文件夹
REM 以备部署 GitHub Pages 再次初始化时用
rmdir /s /q "%cd%/.git"

git init
git config user.name zkkysqs
git config user.email zkkysqs@outlook.com
git add -A
git commit -m "%date% %time% auto-deploy"
REM 静默推送的话可在地址里填入username和password,如
REM git remote add origin https://username:password@github.com/username/repo.git
git remote add origin https://github.com/zkkysqs/blog.git
git pull
git push --force origin HEAD:gh-pages
echo "GitHub Pages Deploy Complete!"

REM To delete the dist folder
cd ..
echo delete-directory: "%cd%/dist"
rmdir /s /q "%cd%/dist"
cd..
cd..
echo Auto-Deploy-Complete!
pause
