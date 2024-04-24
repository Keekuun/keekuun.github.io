# 源码阅读准备工作

## 1.看[react官方仓库](https://github.com/facebook/react)README.md

> Contributing Guide
> 
> Read our [contributing guide](https://legacy.reactjs.org/docs/how-to-contribute.html) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to React.

步骤如下：
+ 下载源码：`git clone https://github.com/facebook/react.git`
+ 安装依赖：`yarn` (贡献指南中使用yarn, 我们也使用这个)
+ 查看`package.json`文件中的`script`, 可以看到大量的脚本命令
+ 尝试: `yarn build`，发现报错，需要java环境

> 安装环境，过程中安装了jdk8，报错：`java.lang.UnsupportedClassVersionError`
> 
> 相关信息：`java.lang.UnsupportedClassVersionError: com/google/javascript/jscomp/CommandLineRunner has been compiled by a more recent version of the Java Runtime (class file version 55.0), this version of the Java `
>
> 关键信息`class file version 55.0`： java 版本需要jdk11，卸载重装jdk11
> 
> to be continue ...

官方推荐步骤：
```bash
cd ~/path_to_your_react_clone/
yarn build react/index,react/jsx,react-dom/index,scheduler --type=NODE

cd build/node_modules/react
yarn link
cd build/node_modules/react-dom
yarn link

cd ~/path/to/your/project
yarn link react react-dom
```
