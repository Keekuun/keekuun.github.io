---
title: cherry-pick和rebase的使用
sidebar: auto
date: 2021-10-25
categories:
- 其他
tags:
- Git
---

## cherry-pick 操作

cherry-pick 的作用在于把一个分支上的commit应用到另外一个分支上，感觉上和git merge 作用差不多，但cherry-pick可以选一个分支中一个或者几个commit来应用提交到另外一个分支，操作单元是commit 不是branch。

比如：当前在feature分支下的修改要合并到test分支上，只想把特定的一些commit合并过去：

```shell
# 合test分支
git add .

git commit -m "feat: xx"

git push

git log // 查看commit hash值 adc34342321

git checkout test // master test

git cherry-pick hash值1 hash值2 hash值3 ...

git pull --rebase

git push
```

### rebase操作

```shell
#  发布
git log # 查看日志

git rebase --abort # 取消rebase操作

git rebase -i hash值 # 本次特性分支未提交时的commit hash值

# 此时进入commit msg编辑器，i进入编辑操作，除了第一个commit msg不修改，把每行前面的单词替换为s
# esc 退出编辑操作，然后 ：wq保存

git reflog # 查看

git pull public master --rebase

git push -f

```

+ rebase注意事项

rebase过程中也会出现冲突

解决冲突后，使用`git add`添加，然后执行

`git rebase --continue`

接下来Git会继续应用余下的补丁

任何时候都可以通过如下命令终止rebase，分支会恢复到rebase开始前的状态

`git rebase --abort`

> [git cherry-pick 教程](http://www.ruanyifeng.com/blog/2020/04/git-cherry-pick.html)
> 
> [Git进阶之cherry-pick、rebase](https://juejin.cn/post/6995350132812152869)
> 
> [使用git rebase合并多次commit](https://github.com/zuopf769/how_to_use_git/blob/master/%E4%BD%BF%E7%94%A8git%20rebase%E5%90%88%E5%B9%B6%E5%A4%9A%E6%AC%A1commit.md)
