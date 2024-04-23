---
title: NodeJS之npm run xxx 过程
categories:
  - 后端
tags:
  - Node
  - JS
---

比如如下的: `package.json`, 执行 `npm run dev`

```json
{
  "scripts": {
    "dev": "vuepress",
    "pretest": "node pretest.js",
    "test": "node test.js",
    "posttest": "node posttest.js"
  }
}
```

1. 执行 `npm run dev`，读取`package.json` 的scripts 对应的脚本命令`(dev:vuepress`),`vuepress`是个可执行脚本，查找规则是：

+ 先从**当前项目**的`node_modules/.bin`去查找可执行命令`vuepress`
+ 如果没找到就去**全局**的`node_modules` 去找可执行命令`vuepress`
+ 如果还没找到就去**环境变量**查找
+ 再找不到就进行报错

如果成功找到会发现有三个文件：

```
- node_modules/.bin/vuepress // sh 文件
- node_modules/vite/bin/vuepress.CMD // cmd 文件
- node_modules/vite/bin/vuepress.ps1 // ps1 文件
```

因为nodejs 是跨平台的所以可执行命令兼容各个平台

+ `.sh`文件是给Linux unix Macos 使用
+ `.CMD` 给windows的cmd使用
+ `.ps1` 给windows的powerShell 使用

2. 如果 执行 `npm run test`, 那么会依次执行：

```
node pretest.js
node test.js
node posttest.js
```

执行 `npm run test` 命令的时候 `pretest` 会自动先执行，他的生命周期是在 `test`之前，然后执行`test`
命令，然后最后执行 `posttest`

npm 执行命令也有[**生命周期**](https://docs.npmjs.com/cli/v10/using-npm/scripts#life-cycle-scripts)，具体可以参考[官网](https://docs.npmjs.com/cli/v10/using-npm/scripts)

```json
{
  "scripts": {
    "prexxx": "最先执行",
    "xxx": "再执行",
    "postxxx": "最后执行"
  }
}
```

例如：
```js
// pretest.js 内容：
console.log('pre test')

// test.js  内容：
console.log('test')

// posttest.js  内容：
console.log('post test')

// package.json 内容：
`{
  "name": "node_test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "pretest": "node pretest.js",
    "test": "node test.js",
    "posttest": "node posttest.js",

    "prexxx": "node pretest.js",
    "xxx": "node test.js",
    "postxxx": "node posttest.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}`

```

执行：`npm run test` 或者 `npm run xxx` 结果：
```bash
"C:\Program Files\nodejs\npm.cmd" run xxx

> node_test@1.0.0 prexxx
> node pretest.js

pre test

> node_test@1.0.0 xxx
> node test.js

test

> node_test@1.0.0 postxxx
> node posttest.js

post test

```
