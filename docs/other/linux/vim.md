---
title: Vim编辑器简单使用
date: 2020-11-29
categories: 
- 其他
tags: 
- Linux
- Vim
---

+ [Vim 编辑器操作](https://juejin.cn/post/6938385978004340744#heading-163)
+ [Vim 修行之路](https://harttle.land/vim-practice.html)

## 交互模式：默认模式
```bash
vim hello.txt # 默认进入
```
+ 在这个模式下，你不能输入文本；
+ 它可以让我们在文本间移动，删除一行文本，复制黏贴文本，跳转到指定行，撤销操作，等等。

### 1.基本操作

+ 行首：0 或 Home
+ 行尾：$ 或 End
+ 单词移动：w
+ 上下左右：方向键
+ 退出：冒号 + q
+ 保存并退出 `:wq`  或 `:x` ；
+ 不保存且退出 `:q!` 。


### 2.删除
+ 删除字符：x
+ 删除多个字符： 数字 + x
+ 删除光标所在行：dd
+ 删除多行：数字 + dd
+ 删除一个单词：光标在单词首位， dw
+ 删除多个单词： 数字 + dw
+ 从光标所在位置删除至行首： d0 (d + Home)
+ 从光标所在位置删除至行末： d$ (d + End)

### 3.复制y
+ 复制行：按两次 y 会把光标所在行复制到内存中，和 dd 类似， dd 用于“剪切”光标所在行。
+ 复制单词： yw 会复制一个单词。
+ 复制到行末： y$ 是复制从光标所在处到行末的所有字符。
+ 复制到行首： y0  是复制光标所在处到行首的所有字符。

### 4.粘贴p
如果之前用 dd 或者 yy 剪切复制过来的，可以使用 p 来粘贴。同样也可以使用 数字+p 来表示复制多次。

### 5.替换r
在交互模式下，将光标置于想要替换的字符上。按下 r 键，接着输入你要替换的字符即可。

### 6.撤销u
如果要撤销最近的修改，只需要按下 u 键，如果想要撤销最近四次修改，可以按下4，再按下 u 。

### 7.重做
取消撤销，也就是重做之前的修改使用 ctrl + r 。

### 8.跳到指定行
```markdown
跳转到指定行： 数字+gg ，例如 7gg ，表示跳转到第7行。
要跳转到最后一行，按下 G 。
要跳转到第一行，按下 gg 。
```

### 9.查找`/`
处于交互模式下，按下 / 键，那么就进入查找模式，输入你要查找的字符串，然后按下回车。光标就会跳转到文件中下一个查找到的匹配处。如果字符串不存在，那么会显示 "pattern not found" 。

n 跳转到下一个匹配项；
N 跳转到上一个匹配项。

[注意] 用斜杠来进行的查找是从当前光标处开始向文件尾搜索，如果你要从当前光标处开始，向文件头搜索则使用 ? ，当然也可以先按下 gg 跳转到第一行在进行全文搜索。

### 10.查找并替换`/old/new`

1.语法
`:s/旧字符串/新字符串`

2.替换光标所在行第一个匹配的字符串：
`:s/one/two`

3.替换光标所在行所有旧字符串为新字符串：
`:s/旧字符串/新字符串/g`

4.替换第几行到第几行中所有字符串：
`:n,m s/旧字符串/新字符串/g`

实例
`:2,4 s/one/two/g`

5.全文替换
`:%s/旧字符串/新字符串/g`

## 插入模式
在交互模式下，按键`i`（ i、I、a、A、o、O 都可以进入插入模式，只是所处的位置不同），退出这种模式，只需要按下 Esc 键。

+ i, I 进入输入模式 Insert mode ： i 为“从目前光标所在处输入”， I 为“在目前所在行的第一个非空格符处开始输入”；
+ a, A 进入输入模式 Insert mode ： a 为“从目前光标所在的下一个字符处开始输入”， A 为“从光标所在行的最后一个字符处开始输入”；
+ o, O 进入输入模式 Insert mode ： o 为“在目前光标所在的下一行处输入新的一行”； O 为在目前光标所在处的上一行输入新的一行。


## 命令模式
即底线命令模式，这个模式下可以运行一些命令例如“退出”，“保存”，等动作。
也可以用这个模式来激活一些 Vim 配置，例如语法高亮，显示行号，等。甚至还可以发送一些命令给终端命令行，例如 ls、cp

`:`为了进入命令模式，首先要进入交互模式，再按下冒号键。

## 可视模式
前面只讲了 Vim 的三种模式，其实还有一种模式叫做可视模式。
进入它的三种方式（都是从交互模式开始）：

v 字符可视模式，进入后配合方向键选中字符后，然后再按 d 键可以删除选中。
V 行可视模式，进入后光标所在行默认被选中，然后再按 d 键可以删除所在行。
Ctrl + v 块可视模式，它是可视模式最有用的功能了，配合 d  和 I 键可以实现删除选中的内容和插入内容。

同时选中多行，并在选中行头部插入内容的具体操作步骤：
1. ctrl + v 进入块可视模式
2. 使用方向键进行选中（上下左右）假设选中5行
3. 输入 I 键进行多行同时插入操作
4. 插入完成后连续按两下 esc 键，实现多行同时插入相同字符
   复制代码
   进入可视模式之后的操作键：

d 键，表示删除选中；
I 键，表示在选中之前插入；
u 键，表示选中变为小写；
U 键，表示选中变为大写；

## [vim配置](https://www.freecodecamp.org/news/vimrc-configuration-guide-customize-your-vim-editor/)
```bash
$ touch ~/.vimrc
```

```
" Set shift width to 4 spaces.
set shiftwidth=4

" Set tab width to 4 columns.
set tabstop=4

" Use space characters instead of tabs.
set expandtab

" Do not save backup files.
set nobackup

" Do not let cursor scroll below or above N number of lines when scrolling.
set scrolloff=10

" Do not wrap lines. Allow long lines to extend as far as the line goes.
set nowrap

" While searching though a file incrementally highlight matching characters as you type.
set incsearch

" Ignore capital letters during search.
set ignorecase

" Override the ignorecase option if searching for capital letters.
" This will allow you to search specifically for capital letters.
set smartcase

" Show partial command you type in the last line of the screen.
set showcmd

" Show the mode you are on the last line.
set showmode

" Show matching words during a search.
set showmatch

" Use highlighting when doing a search.
set hlsearch

" Set the commands to save in history default number is 20.
set history=1000
```
