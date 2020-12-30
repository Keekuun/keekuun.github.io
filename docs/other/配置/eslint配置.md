---
title: 【配置】ESLint配置
date: 2020-12-24
sidebar: auto
categories: 
- 其他
tags: 
- ESLint
- 配置
---


> 背景：临近年尾，忙里偷闲，查看不同项目的代码，发现，代码格式五花八门。每个coder都有自己的编码规范，导致阅读他人代码不易。虽然几乎每个项目都配置了ESLint，但我发现有些差异，并没有统一。而且，由于IDE不一样，有webstrom有vscode,我发现用不同的IDE打开同一个项目，eslint检测也会不一致。。。遂研究一番ESLint。。。规范代码风格提高代码质量以及可维护性

# ESLint配置
[【eslint官网】](https://eslint.bootcss.com/)

+ ESLint 使用 [Espree](https://github.com/eslint/espree) 解析 JavaScript(生成AST)。
```js
const espree = require("espree");

const ast = espree.parse(code);
```
+ ESLint 使用 AST 去分析代码中的模式
+ ESLint 是完全插件化的。每一个规则都是一个插件并且你可以在运行时添加更多的规则。

> 推荐阅读：[ESLint 工作原理探讨](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651230875&idx=1&sn=092211db96adfc85a26b457f7e9421a0&chksm=bd494b1f8a3ec20902ad0df7d6a3735b536fe585086abc9035fe24d69549bb4c81cf88658515&mpshare=1&scene=1&srcid=0104C1J16lllbEgkIyFIFJmp#rd)
>
>[平庸前端码农之蜕变 — AST](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651230568&idx=1&sn=1f6f1de7316f7a57c3209b6faa1ed9a4&chksm=bd4948ec8a3ec1fa5f6e27d82aa367e3003da92182b06d2b4b885693b318f1b08049c380ea68&scene=21#wechat_redirect)
>
>[AST抽象语法树——最基础的javascript重点知识](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651230664&idx=1&sn=595511aae2a2ce6460e8ab6949e862bf&chksm=bd49484c8a3ec15ab00728d75d8447e176067b0a087150c169a59c6f1902e2705cb7f4351fae&scene=21#wechat_redirect)

## 1.ESLint安装和初始化

> 前提：Nodejs版本>6.14, npm版本>3

+ 安装
```bash
npm install eslint --save-dev
```
+ 生成配置文件
```bash
./node_modules/.bin/eslint --init

# 或者使用npx
npx eslint --init
```
运行 `eslint --init` 之后，.`eslintrc` 文件会在你的文件夹中自动创建,可以选择生成`.js`、`.json`或`.yaml`格式的文件,比如：`.eslintrc.js`
```js
module.exports = {
    "env": { // 开启环境
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [ // 
        // 所有在 规则页面 被标记为 “√” 的规则将会默认开启https://eslint.bootcss.com/docs/rules/
        "eslint:recommended",
        // 使用eslint-plugin-react
        "plugin:react/recommended",
        // 使用typescript推荐
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [ // 插件
        "react",
        "@typescript-eslint"
    ],
    "rules": {
        // 此处配置eslint规则
        "quotes": ["error", "single"],
        "no-alert": "warn",
    },
    "overrides": [ // 针对某些文件覆盖规则
        {
          "files": ["*-test.js","*.spec.js"],
          "rules": {
            "no-unused-expressions": "off"
          }
        }
    ]
};
```

## 2.ESLint规则和配置方法

### 2.1 ESLint规则格式
```js

module.exports = {
    "rules": {
        // 规则名称：[等级，规则选项]
        "quotes": ["error", "single"]
    }
}
```

```js
module.exports = {
    parser: {},     // 解析器
    extends: [],    // 继承的规则 [扩展]
    plugins: [],    // 插件
    rules: {}       // 规则
};
```

+ 规则分为三个等级：`off(0)`关闭；`warn(1)`警告、`error(2)`强制

+ 在ESLint配置文件中配置rules，对应不同类型的规则。

+ 行内规则，需要写在`/* eslint 规则名称：[等级，规则选项]*/`之中:

```js
/*eslint quotes: ["error", "double"]*/

var single = 'single';
var unescaped = 'a string containing "double" quotes';
var backtick = `back\ntick`; // you can use \n in single or double quoted strings
```

### 2.2 ESLint检测文件

+ 对单行检测:
```js
/*eslint quotes: ["error", "double"]*/
var single = 'single';
```


+ 对单个文件进行检测，配置好`.eslintrc`文件，并执行：
```bash
npx eslint 文件名
```

+ 全局配置ESLint
``bash
npm install eslint -g
``
安装好依赖包之后，需要编写全局`.eslintrc`文件。


### 2.3 ESLint 支持几种格式的配置文件：

+ JavaScript - 使用 .eslintrc.js 然后输出一个配置对象。
+ YAML - 使用 .eslintrc.yaml 或 .eslintrc.yml 去定义配置的结构。
+ JSON - 使用 .eslintrc.json 去定义配置的结构，ESLint 的 JSON 文件允许 JavaScript 风格的注释。
+ (弃用) - 使用 .eslintrc，可以使 JSON 也可以是 YAML。
+ package.json - 在 package.json 里创建一个 eslintConfig属性，在那里定义你的配置。

如果同一个目录下有多个配置文件，ESLint 只会使用一个。优先级顺序如下：
+ 1.`.eslintrc.js`
+ 2.`.eslintrc.yaml`
+ 3.`.eslintrc.yml`
+ 4.`.eslintrc.json`
+ 5.`.eslintrc`
+ 6.`package.json`

### 2.4忽略ESLint
+ 针对单行代码：

这样：
```js
/* eslint-disabled quotes */
var single = 'hello';
```

这样：
```js
// eslint-disabled-next-line quotes
var single = 'hello';
```

或者这样：
```js
/* eslint quotes: off */
var single = 'hello';
```

+ 针对某个规则:直接`off`
```js
module.exports = {
    "rules": {
        // 规则名称：[等级，规则选项]
        "quotes": "off"
    }
}
```

+ 针对某些文件：

通过在项目根目录创建一个 `.eslintignore` 文件告诉 ESLint 去忽略特定的文件和目录。`.eslintignore` 文件是一个纯文本文件，其中的每一行都是一个 glob 模式表明哪些路径应该忽略检测。例如，以下将忽略所有的 JavaScript 文件：

```text
**node_modules/**
**/*.js
```

## 3.ESLint修复

### 3.1 手动修复
```bash
eslint --fix [file.js][dir]
```

配置`package.json`：
```json
{
    "scripts":  {
     "lint-fix": "eslint --fix"
    }
}
```

```bash
npm run lint-fix
```

### 3.2 vscode保存即修复
+ 在Vscode安装`ESLint`、`Prettier-Code`、`formatter`插件。

配置setting:
```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    {
      "language": "typescript",
      "autoFix": true
    },
    {
      "language": "typescriptreact",
      "autoFix": true
    }
  ],
  "eslint.autoFixOnSave": true
}
```
[vscode eslint+prettier+vuter 代码自动格式化](https://blog.csdn.net/weixin_36222137/article/details/80040758?utm_medium=distribute.pc_relevant_t0.none-task-blog-searchFromBaidu-1.control&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-searchFromBaidu-1.control)

## 4. [ESLint](https://eslint.org/)实践

### 4.1 为react-ts项目配置eslint
```sh
# 安装依赖
yarn add eslint --dev

# 初始化配置
npx eslint --init
```

示例：`react-ts`项目[`eslint`配置文件](https://cn.eslint.org/docs/user-guide/configuring)`.eslinttrc.json`：

```js
{
module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    jsx: true,
    useJSXTextNode: true,
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        endOfLine: 'auto',
        trailingComma: 'es5',
      },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
        varsIgnorePattern: 'Example|Demo',
      },
    ],
    quotes: ['error', 'single'],
    semi: 'off',
    'comma-dangle': 'off',
  },
};
}

```

> [React with TypeScript: Best Practices](https://www.sitepoint.com/react-with-typescript-best-practices/)

有些文件不需要`eslint`检测，可以加入`.eslintignore`配置文件中。

配置`ESLint`目的是为了代码规范化和统一化，那么如何落地呢？

### 4.2 和`CI/CD`集成（生产阶段）

  ![CI/CD集成ESLint](../../../images/webpack/CI-CD.jpg)

  ```bash
  yarn add husky -D
  ```

  `package.json`增加:

```json
{
  "script": {
    "precommit": "lint-staged"
  },
  "lint-staged": {
    "src/**/*.{ts,tsx}": ["eslint --fix", "git add"]
  }
}
```

### 4.3 和`webpack`集成（开发阶段）

使用`eslint-loader`，构建时检查规范：

```sh
yarn add eslint-loader -D
```

配置`webpack`：

```js
module.exports = {
  module: {
      rules: [
          {
              test:/\.jsx?$/,
              exclude: /node_modules/,
              use: [
                  'babel-loader',
                  'eslint-loader'
              ]
          },
          {
              test:/\.tsx?$/,
              exclude: /node_modules/,
              use: [
                  'ts-loader',
                  'eslint-loader'
              ]
          }
      ]
  }
}
```
