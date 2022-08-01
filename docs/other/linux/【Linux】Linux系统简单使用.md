---
title: 【Linux】Linux系统简单使用
date: 2020-11-30
categories: 
- 其他
tags: 
- Linux
---

## 1. Linux常用命令

> [2万字系统总结，带你实现 Linux 命令自由？](https://juejin.cn/post/6938385978004340744)

### 1.文档型

1.文件操作
+ `ls`： 查看文件列表
+ `ls -la`：查看所有目录以及详细信息
+ `less 文件名`：分页显示文件内容
+ `head 文件名`：显示文件的头几行
+ `tail 文件名`：显示文件的末几行
+ `touch文件名` ：创建文件
+ `cat [-n 显示行号]  文件名` ：查看文件内容
+ `echo  ‘内容’ >> 文件名` ：给文件追加内容
+ `echo ‘内容' > 文件名` ：覆盖文件内容
+ `rm  文件` ：删除文件
+ `rm -r 目录`： 删除目录
+ `rm -rf 文件/目录` ：强制删除
+ `vi 文件` ：进入Vim编辑状态
+ `mkdir [-p 创建多级目录] 目录名` ：创建目录
+ `cp old_file new_file`：拷贝文件
```bash
cp file dir #拷贝文件到dir目录下 
cp file dir/file1 #拷贝文件到dir目录下,并重命名 
cp *.js dir	#把当前目录下所有js文件拷贝到dir目录下
```
+ `mv file dir`：将file移动到dir目录下
```bash
mv new_folder one	 # 将 new_folder 文件夹移动到one目录下
mv *.txt folder	 # 把当前目录下所有 txt 文件移动到 folder 目录下
mv file new_file	 # file 文件重命名为 new_file
```

+ `rm file`：删除 file 文件
```bash
rm f1 f2 f3 # 同时删除 f1 f2 f3 3个文件

# 参数
-i #向用户确认是否删除
-f #文件强制删除
-d #删除空目录
-r #递归删除文件夹，著名的删除操作 rm -rf
```
+ `ln f1 f2`：创建f2为f1的硬链接（同步修改）
+ `ln -s f1 f2`：创建f2为f1的软链接（快捷键）

2.目录操作
+ `cd \` ：目录切换到根目录
+ `pwd`：查看当前所在路径
+ `which 命令`: 查看可执行文件所在路径
+ `du`: 列举目录大小信息
```bash
du
-h # 适合人类阅读的；
-a # 同时列举出目录下文件的大小信息；
-s # 只显示总计大小，不显示具体信息。
```
3.权限
+ `sudo 命令`: 以root身份运行命令
+ `su 用户名`: 切换用户，需要root权限
+ `chown`：改变文件的所有者，需要root权限
```bash
chown lion file.txt	# 把其它用户创建的file.txt转让给lion用户
chown lion:bar file.txt	# 把file.txt的用户改为lion，群组改为bar

# -R 递归设置子目录和子文件， chown -R lion:lion /home/frank 把 frank 文件夹的用户和群组都改为 lion
```
+ `chmod -R 777 /home`：递归地修改文件访问权限

4.权限解读：

```bash
[root@xxx /]# ls -l
total 64
lrwxrwxrwx    1 root root     7 Feb  9 20:18 bin -> usr/bin
dr-xr-xr-x.   5 root root  4096 Jul 21 17:26 boot
drwxr-xr-x   17 root root  2980 Jul  8 14:41 dev
drwxr-xr-x.  91 root root  4096 Aug  1 10:31 etc
drwxr-xr-x.   2 root root  4096 Feb  9 20:18 home
lrwxrwxrwx    1 root root     7 Feb  9 20:18 lib -> usr/lib
-rw-r--r--    1 root root    15 Aug  1 14:24 hello.txt

... ... ...
```
```markdown
其中 drwxr-xr-x 表示文件或目录的权限。让我们一起来解读它具体代表什么？

d ：表示目录，就是说这是一个目录，普通文件是 - ，链接是 l 。
r ：【4】read 表示文件可读。
w ：【2】write 表示文件可写，一般有写的权限，就有删除的权限。
x ：【1】execute 表示文件可执行。
- ：表示没有相应权限。


理解这句权限 d rwx r-x r-x 的意思：

d:【文件属性】它是一个文件夹；
rwx:【所有者】它的所有者具有：读、写、执行权限；
r-x:【群组用户】它的群组用户具有：读、执行的权限，没有写的权限；
r-x:【其他用户】它的其它用户具有：读、执行的权限，没有写的权限。


chmod 640 hello.txt
# 数字权限分析
6 = 4 + 2 + 0 表示所有者具有 rw 权限
4 = 4 + 0 + 0 表示群组用户具有 r 权限
0 = 0 + 0 + 0 表示其它用户没有权限

对应文字权限为：-rw-r-----


# 字母权限分析

u ： user 的缩写，用户的意思，表示所有者。
g ： group 的缩写，群组的意思，表示群组用户。
o ： other 的缩写，其它的意思，表示其它用户。
a ： all 的缩写，所有的意思，表示所有用户。
+ ：加号，表示添加权限。
- ：减号，表示去除权限。
= ：等于号，表示分配权限。

chmod u+rx file	--> 文件file的所有者增加读和运行的权限
chmod g+r file	--> 文件file的群组用户增加读的权限
chmod o-r file	--> 文件file的其它用户移除读的权限
chmod g+r o-r file	--> 文件file的群组用户增加读的权限，其它用户移除读的权限
chmod go-r file	--> 文件file的群组和其他用户移除读的权限
chmod +x file	--> 文件file的所有用户增加运行的权限
chmod u=rwx,g=r,o=- file	--> 文件file的所有者分配读写和执行的权限，群组其它用户分配读的权限，其他用户没有任何权限
```

5.进阶操作
+ `grep`:查找
```markdown
grep text file # text代表要搜索的文本，file代表供搜索的文件

-i 忽略大小写， grep -i path /etc/profile
-n 显示行号，grep -n path /etc/profile
-v 只显示搜索文本不在的那些行，grep -v path /etc/profile
-r 递归查找， grep -r hello /etc ，Linux 中还有一个 rgrep 命令，作用相当于 grep -r

# 实例
[root@xxx ~]# grep path /etc/profile
pathmunge () {
pathmunge /usr/sbin
pathmunge /usr/local/sbin
pathmunge /usr/local/sbin after
pathmunge /usr/sbin after
unset -f pathmunge

# 使用正则
grep -E path /etc/profile --> 完全匹配path
grep -E ^path /etc/profile --> 匹配path开头的字符串
grep -E [Pp]ath /etc/profile --> 匹配path或Path
```
+ `sort`:对文件进行排序
```markdown
sort hello.txt # 对name.txt文件内容进行排序


-o 将排序后的文件写入新文件， sort -o name_sorted.txt name.txt ；
-r 倒序排序， sort -r name.txt ；
-R 随机排序， sort -R name.txt ；
-n 对数字进行排序，默认是把数字识别成字符串的，因此 138 会排在 25 前面，如果添加了 -n 数字排序的话，则 25 会在 138 前面。
```

+ `wc`：`world count`统计单词数目、行数、字符数，字节数等
```markdown
[root@xxx test]# wc hello.txt
# 行：9 单词数：10 字节数：48
9 10 48 hello.txt

-l 只统计行数， wc -l hello.txt
-w 只统计单词数， wc -w hello.txt
-c 只统计字节数， wc -c hello.txt
-m 只统计字符数， wc -m hello.txt
```
+ `uniq`: 删除文件中的重复内容(只能去除连续重复的行数)
```markdown
uniq name.txt # 去除name.txt重复的行数，并打印到屏幕上
uniq name.txt uniq_name.txt # 把去除重复后的文件保存为 uniq_name.txt

-c 统计重复行数， uniq -c name.txt ；
-d 只显示重复的行数， uniq -d name.txt 。
```

+ `cut`剪切
```markdown
cut -c 2-4 name.txt # 剪切每一行第二到第四个字符
```

输出重定向
+ `>`重定向(表示重定向到新的文件)
+ `>>`输出重定向(表示重定向到文件末尾)
+ `2>`输出重定向(标准错误输出)
+ `2>>`输出重定向(标准错误输出（追加到文件末尾）同 >> 相似。)

输入重定向
+ `<`符号用于指定命令的输入
+ `<<`将键盘的输入重定向为某个命令的输入。

```markdown
cat < name.csv # 指定命令的输入为 name.csv

cat name.csv 表示 cat 命令接收的输入是 notes.csv 文件名，那么要先打开这个文件，然后打印出文件内容。
cat < name.csv 表示 cat 命令接收的输入直接是 notes.csv 这个文件的内容， cat 命令只负责将其内容打印，打开文件并将文件内容传递给 cat 命令的工作则交给终端完成。


sort -n << END # 输入这个命令之后，按下回车，终端就进入键盘输入模式，其中END为结束命令（这个可以自定义）

wc -m << END # 统计输入的单词
```

管道
```markdown
cut -d , -f 1 name.csv | sort > sorted_name.txt
# 第一步获取到的 name 列表，通过管道符再进行排序，最后输出到sorted_name.txt

du | sort -nr | head
# du 表示列举目录大小信息
# sort 进行排序,-n 表示按数字排序，-r 表示倒序
# head 前10行文件

grep log -Ir /var/log | cut -d : -f 1 | sort | uniq
# grep log -Ir /var/log 表示在log文件夹下搜索 /var/log 文本，-r 表示递归，-I 用于排除二进制文件
# cut -d : -f 1 表示通过冒号进行剪切，获取剪切的第一部分
# sort 进行排序
# uniq 进行去重
```

进程
+ `w`：快速了解系统中目前有哪些用户登录着，以及他们在干什么
+ `ps`:用于显示当前系统中的进程， ps 命令显示的进程列表不会随时间而更新，是静态的，是运行 ps 命令那个时刻的状态或者说是一个进程快照。
+ `top`：获取进程的动态列表。
+ `kill`: 杀死进程（结束一个进程， kill + PID）
+ `bg`:使一个“后台暂停运行”的进程，状态改为“后台运行”。
+ `fg`:使进程转为前台运行，用法和 bg 命令类似。
+ `jobs`:显示当前终端后台进程状态。
```markdown
[root@xxx test]# w
 15:21:21 up 72 days, 22:51,  1 user,  load average: 0.00, 0.02, 0.00
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
root     pts/0    183.2.223.26     21Jul22  0.00s  0.17s  0.00s w
[root@xxx test]# ps
    PID TTY          TIME CMD
 108772 pts/0    00:00:00 bash
 160515 pts/0    00:00:00 ps

kill 956 # 结束进程号为956的进程
kill 956 957 # 结束多个进程
kill -9 7291 # 强制结束进程
```
守护进程
```markdown

一个运行起来的程序被称为进程。在 Linux 中有些进程是特殊的，它不与任何进程关联，不论用户的身份如何，都在后台运行，这些进程的父进程是 PID 为1的进程， PID 为1的进程只在系统关闭时才会被销毁。它们会在后台一直运行等待分配工作。我们将这类进程称之为守护进程 daemon 。
守护进程的名字通常会在最后有一个 d ，表示 daemon 守护的意思，例如 systemd 、httpd 。

systemd 常用命令：
systemctl start nginx # 启动服务
systemctl stop nginx # 停止服务
systemctl restart nginx # 重启服务
systemctl status nginx # 查看服务状态
systemctl reload nginx # 重载配置文件(不停止服务的情况)
systemctl enable nginx # 开机自动启动服务
systemctl disable nginx # 开机不自动启动服务
systemctl is-enabled nginx # 查看服务是否开机自动启动
systemctl list-unit-files --type=service # 查看各个级别下服务的启动和禁用情况
```

6.文件解压缩

+ `tar`归档
```markdown
归档
tar -cvf sort.tar sort/ # 将sort文件夹归档为sort.tar
tar -cvf archive.tar file1 file2 file3 # 将 file1 file2 file3 归档为archive.tar

-cvf 表示 create（创建）+ verbose（细节）+ file（文件），创建归档文件并显示操作细节；
-tf 显示归档里的内容，并不解开归档；
-rvf 追加文件到归档， tar -rvf archive.tar file.txt ；
-xvf 解开归档， tar -xvf archive.tar 。

压缩
tar -zcvf archive.tar.gz archive/ # 将archive文件夹归档并压缩
tar -zxvf archive.tar.gz # 将archive.tar.gz归档压缩文件解压

```

+ `gzip / gunzip`:“压缩/解压”归档，默认用 gzip 命令，压缩后的文件后缀名为 .tar.gz 。
```markdown
gzip archive.tar # 压缩
gunzip archive.tar.gz # 解压
```

+ `zcat、zless、zmore`查看压缩的文件（`cat less more`查看未压缩文件）

+ `zip/unzip`“压缩/解压” zip 文件（ zip 压缩文件一般来自 windows 操作系统）。
```markdown
# Red Hat 一族中的安装方式
yum install zip 
yum install unzip 

unzip archive.zip # 解压 .zip 文件
unzip -l archive.zip # 不解开 .zip 文件，只看其中内容

zip -r sort.zip sort/ # 将sort文件夹压缩为 sort.zip，其中-r表示递归
```

7.网络
+ `ifconfig`查看 ip 网络相关信息,如果命令不存在的话， 执行命令 yum install net-tools 安装。

+ `host`:ip 地址和主机名的互相转换。
```markdown
安装
yum install bind-utils

[root@xxx ~]# host github.com
baidu.com has address 13.229.188.59

[root@xxx ~]# host github.com
github.com has address 20.205.243.166

```

+ `ssh`连接远程服务器
```markdown
ssh 用户@ip:port

1、ssh root@172.20.10.1:22 # 端口号可以省略不写，默认是22端口
2、输入连接密码后就可以操作远端服务器了

配置 ssh:
全局 ssh 服务端的配置： /etc/ssh/sshd_config ；
全局 ssh 客户端的配置： /etc/ssh/ssh_config（很少修改）；
当前用户 ssh 客户端的配置： ~/.ssh/config 。
```

+ `wget`下载器
wget 非常稳定，如果是由于网络原因下载失败， wget 会不断尝试，直到整个文件下载完毕。

### 2.硬件型

系统：

+ `lsb_release -a` ：查看linux版本

+ `top` ：查看系统CPU资源和内存资源

磁盘

+ `df -Th` ：查看磁盘

进程

+ `ps -ef | grep docker`：查看docker进程
+ `kill -9 2736`：关闭进程2736

服务

+ `service docker status`：查看docker运行状态
+ `service docker stop`：关闭docker
+ `service docker restart`：重启docker
+ `service –status -all `：查看所有状态

网络

+ `ping -c 4 链接`：查看网络连接,发送4个包
+ `ip address`：IP相关信息

### 3.功能型

压缩

+ `tar zcvf 压缩之后文件名 被压缩文件名`：压缩文件

解压

+ `tar -zxvf 压缩包名`：解压`.gz`文件

下载

> [yum、apt-get、wget的区别](https://www.cnblogs.com/zq8421/p/10037532.html)

+ `wget 资源链接`：下载资源
+ `apt-get install nginx `：安装nginx

+ yum: centos(RedHat系列)自带的包管理工具
+ apt-get：Ubuntu(Debian系列)自带的包管理工具
+ wget：两者都可以下载安装的下载工具，作用类似于迅雷

```bash
sudo apt-get update  
sudo apt-get install wget  
wget --version

sudo yum install wget
```

+ yum常用命令
```bash
yum update | yum upgrade # 更新软件包
yum search node # 搜索软件包node
yum install mysql # 安装mysql
yum remove docker # 删除docker 
```

[【使用zsh自动纠错命令】](https://ohmyz.sh/#install)

远程

+ `ssh 用户名@地址`：连接远程服务

> [Linux安装Tomcat完整步骤](https://blog.csdn.net/qq_32218457/article/details/79788800?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-2.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-2.control)
> 
> [对不起，学会这些 Linux 知识后，我有点飘](https://juejin.cn/post/6881755746216706062)
> 
> [windows操作](https://juejin.cn/post/7020574670097219621)
> 
> [电脑效率工具软件](https://juejin.cn/post/6844903602817859598)
