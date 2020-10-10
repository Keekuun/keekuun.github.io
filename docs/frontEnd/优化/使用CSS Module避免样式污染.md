---
title: 【优化】使用CSS Module避免样式污染
date: 2020-09-24
sidebar: 'auto'
categories: 
- 前端
tags: 
- React
- 优化
publish: true

---

# 使用CSS Module避免样式污染

> **背景**：React老项目没有使用[【CRA】](https://zh-hans.reactjs.org/docs/create-a-new-react-app.html#create-react-app)创建，使用的自定义的webpack，样式都是采用普通CSS方式，导致很容易造成全局样式污染。
>
> **需求**：在兼容老页面的基础上，新的页面采用[【**css module**】](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)方式避免样式污染。

## 1.React中引入CSS方式

### 1.1 一般方式

`APP.tsx`:

```tsx {2,6}
import React from 'react';
import './App.scss';

function App() {
  return (
    <div className="container" />
  );
}

export default App;
```

`App.scss`:

```scss
.container {
    color: red;
    text-align: center;
}
```

### 1.2 使用CSS Module

`APP.tsx`:

```tsx {3,8}
import React from 'react';
// 导入CSS Module定义的CSS对象
import styles from './App.module.scss';

function App() {
  return (
    {/*使用CSS Module属性*/}
    <div className={styles.container} />
  );
}

export default App;
```

`App.module.scss`:

```scss
.container {
    color: red;
    text-align: center;
}
```

编译后显示：

```html
<div class="container--1g20Q"></div>
```

上面代码中，我们将样式文件`App.module.scss`输入到`style`对象，然后当做变量的方式引用`style.container`作为`class`类名。

## 2.CSS Module原理

CSS Module配置极其简单，其原理简单：通过将CSS文件以模块的形式引入（类似于js中的对象），将CSS

中定义的类名当作变量赋值给jsx即可。

当webpack解析时，会将CSS Module的类名计算或拼接一个唯一的hash值，从而避免样式的污染。

## 3.配置webpack

> [webpack解析less或sass](https://docs.zkkysqs.top/other/webpack/Webpack%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%E4%B9%8B%E5%9F%BA%E7%A1%80%E5%BA%94%E7%94%A8.html#_2-2-解析less或sass)
>
> [【Webpack4】CSS 配置之 postcss-loader](https://juejin.im/post/6844904017802297352)

`webpack.config.js`：

```js
const cssLoaders = [
  "style-loader", 
  "css-loader",
  { 
      "postcss-loader",
      options: [ 
          require('autoprefixer')
      ]
  },
  "sass-loader",
];
// CSS Module
const cssModuleLoaders = [
  "style-loader",
  {
    loader: "css-loader",
    options: {
      modules: {
        // class命名规则
        /**
         * localIdentName格式说明
         * path: 路径
         * name: css文件名
         * local: 类名
         * hash: 16位字符串
         '[path][name]__[local]--[hash:base64:5]'
         .src-styles-main__world-grid--R7u-K
         ---------------  ----------  -----
         path,name     local      hash
         * */
        mode: "local",
        localIdentName: "[name]__[local]--[hash:base64:5]",
      },
    },
  },
  "postcss-loader",
  "sass-loader",
];

module.exports = {
  entry: './src/index.tsx',
  mode: devMode ? 'development' : 'production',
  devtool: devMode ? 'cheap-source-map' : 'hidden-source-map',
  output: {
    // 开发模式不用hash
    filename: devMode ? 'js/[name].js' : 'js/[name].[chunkhash:8].js',
    path: config.output,
    publicPath: config.publicPath
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      // 支持 sass
      {
        test: /\.module\.(scss|sass)$/, use: cssModuleLoaders,
      },
      // 普通方式，不使用css module
      {
        test: /\.scss$/, exclude: /\.module\.(scss|sass)$/, use: cssLoaders,
      },  
      // 支持 css
      {
        test: /\.css$/, use: cssLoaders,
      }, 
    ]
  },
}
```

Loaders解析顺序是从后向前，解析顺序：

+ `sass-loader`：解析`sass|scss`为css。
+ `postcss-loader`：添加浏览器前缀，压缩 CSS等。
+ `css-loader`：用于加载`css`文件，并且转换成`commonjs`对象。
+ `style-loader`：将样式通过`<style>`标签插入到head中。

注意：`{test: /\.scss$/, exclude: /\.module\.(scss|sass)$/, use: cssLoaders}`，（注意顺序，放在后面）由于之前的老页面使用了普通的方式，我们还得保持原来的方式可用，这里进行了剔除。

## 3.解析ts报错

配置完上述步骤，如果不出意料的话，会爆出`TS2307: Cannot find module './index.module.scss'.`的错误：

在项目中增加`css.module.d.ts`声名：

```ts
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.less" {
  const classes: { [key: string]: string };
  export default classes;
}

```

## 4.CRA使用CSS Module

> [添加 CSS Modules 样式表](https://www.html.cn/create-react-app/docs/adding-a-css-modules-stylesheet/)

## 5.踩坑记录

由于项目管理不规范，之前新入职的同学，不熟悉项目，随意命名，比如：使用普通的css方式引入时，有一个文件被命名为`a.module.scss`，然后在`tsx`文件里面使用`impoort './a.module.scss'`。

在未使用css module之前是正常的，但是引入css module之后发现style没有加载出来，这时就需要去一一排查了，然后把文件命名为`a.scss`即可。

不过，一般这种很少出现吧。
