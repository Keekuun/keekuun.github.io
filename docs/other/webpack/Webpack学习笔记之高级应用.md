title: 【Webpack】Webpack学习笔记之高级应用
date: 2020-5-28
categories: 
- 其他
tags: 
- webpack

# Webpack学习笔记之高级应用

## 1. 自动清理构件目录

每次构建的时候不会自用清理目录，会造成构件的输出目录`output`文件越来越多。需要每次执行`rm -rf ./dist`来手动清理。

使用`clean-webpack-plugin`实现自动清理之前的构建文件：

```js
const path = require('path');
// 默认删除output指定的输出目录
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    output: {
        filenma: '[name]_[chunkhash:8].js',
        path: path.join(__dirname, 'dist'),
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
}
```

安装`yarn add clean-webpack-plugin -D`

## 2.PostCSS插件autoprfixer自动补齐CSS3前缀

![](E:\blog\images\webpack\precss-browser.png)

为了兼容各种浏览器，需要手动添加css前缀，例子：

```css
.box {
    -moz-border-radius: 10px;
    -webkit-border-radius: 10px;
    border-radius: 10px;
}
```

实现自动添加css前缀：

使用`autoprefixer`插件，它根据[Can I Use](https://caniuse.com/)规则来实现自动补全css前缀。需要结合`postcss-loader`

```js
module.exports = {
    module: {
        rules: [
            {
                test:/.\less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            pluguins:() => [
                                require('autoprefixer')({
                                    // 指定兼容的浏览器最低版本
                                    browsers:['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    }
                ]
            }
        ]
    }
}
```

安装依赖：

```sh
yarn add postcss-loader autoprefixed -D
```

## 3.CSS单位PX自动转为rem

![移动端浏览器分辨率](E:\blog\images\webpack\mobile-screen.png)移动端设备分辨率五花八门，为了适应移动端设备，`CSS3`引入了rem单位（相对于`root`的`font-size`大小），配合媒体查询（`@media`）来实现移动端适配。

> 摘自[移动端适配](https://blog.csdn.net/tcf_jingfeng/article/details/80803083)

```css
@media (min-width: 240px) {
    html {
        font-size: 32px;
    }
}
@media (min-width: 320px) {
    html {
        font-size: 42.66667px;
    }
}
@media (min-width: 360px) {
    html {
        font-size: 48px;
    }
}
@media (min-width: 375px) {
    html {
        font-size: 50px;
    }
}
@media (min-width: 384px) {
    html {
        font-size: 51.2px;
    }
}
```

通过这种方案，然后计算出某一个分辨率下的`rem`单位完成适配。但是计算`rem`也会耗时。

借助`px2rem-loader`实现自动转换为`rem`单位：

```js
module.exports = {
    module: {
        rules: [
            {
                test:/.\less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'px2rem-loader',
                        options: {
                            // 1rem = 75px
                            remUnit: 75,
                            // rem小数点位数
                            remPrecision: 8
                        }
                    }
                ]
            }
        ]
    }
}
```

页面渲染时计算根元素的`font-size`的值（自动转换`px`到`rem`）。然后借助[`lib-flexible`库](https://github.com/amfe/lib-flexible)，自动完成其他分辨率下的适配（`@media`的工作）。

在 `index.html`页面下添加：

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
<script src="./node_modules/amfe-flexible/index.js"></script>
```

安装依赖：

```sh
# px ---> rem
yarn add px2rem-loader -D
# @media实现媒体查询
yarn add amfe-flexible -D
```

## 4.内联css、js等资源

### 4.1 内联的意义

+ 代码层面：
  + 页面框架的初始化脚本
  + 上报相关打点
  + css内联避免页面闪动
+ 请求层面：减少HTTP网络请求
  + 小图片或者字体内联（`url-loader`）

### 4.2 HTML和JS的内联

安装依赖`yarn add raw-loader --D`

+ `raw-loader`内联HTML：

  ```html
  // 使用html-webpack-plugin默认引擎是ejs
  <script>${require('raw-loader!babel-loader!./meta.html')}</script>
  ```

+ `raw-loader`内联JS：

  ```html
  <script>${require('raw-loader!babel-loader!../node_modules/lib-flexible/flexible.js')}</script>
  ```

  

### 4.3 CSS的内联

+ 1.借助`style-loader`:

  ```js
  module.exports = {
      module: {
          rules: [
              {
                  test: /\.scss$/,
                  use: [
                      {
                          loader: 'style-loader',
                          options: {
                              // 将样式插入到<head>中
                              insertAt: 'top',
                              // 将所有的style标签合并成一个
                              singleton: true
                          }
                      },
                      'css-loader',
                      'sass-loader'
                  ],
              },
          ],
      },
  },
  ```

+ 2.借助[`html-inline-css-webpack-plugin`](https://github.com/Runjuu/html-inline-css-webpack-plugin)

  安装依赖`yarn add html-inline-css-webpack-plugin -D`

  ```js
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
  
  module.exports = {
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new HtmlWebpackPlugin(),
      new HTMLInlineCSSWebpackPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader"
          ]
        }
      ]
    }
  }
  ```

## 5. 多页面（MPA）打包

多页面（MPA：multi page application）：每次页面跳转的时候，后台服务器都会返回一个新的html文档，这种页面就是多页面应用。（解耦业务、SEO友好）

多页面打包，之前是每个页面对应一个`entry`和一个`html-webpack-plugin`，缺点是每次新增或删除页面需要改`webpack`配置。

可以通过动态获取`entry`和设置`html-webpack-plugin`数量，来实现多页面自动打包配置：

利用[`glob.sync`](https://github.com/isaacs/node-glob)，约定每个目录下的入口文件为`index.js`：

```js
entry: glob.sync(path.join(__dirname, './src/*/index.js'))
```

```js
const glob = require('glob')

const setMPA = () => {
    const entry  = {}
    const htmlWebpackPlugins= []

    // 获取entry入口文件
    const entryFiles = glob.sync(path.join(__dirname,'./src/*/index.js'))
    console.log(entryFiles)

    Object.keys(entryFiles).map(
        (index) => {
            const entryFile = entryFiles[index]
            const match = entryFile.match(/src\/(.*)\/index\.js/)
            const pageName = match && match[1]

            entry[pageName] = entryFile
            htmlWebpackPlugins.push(
                new HtmlWebpackPlugin({
                    template: path.join(__dirname, `src/${pageName}/index.html`),
                    filename: `${pageName}.html`,
                    chunks: [pageName],
                    inject: true,
                    minify: {
                        html5: true,
                        collapsableWhitespace: true,
                        preserveLineBreaks: false,
                        minifyJS: true,
                        minifyCSS: true,
                        removeComments: true
                    }
                })
            )
        }
    )

    return {
        entry,
        htmlWebpackPlugins
    }
}
const { entry, htmlWebpackPlugins } = setMPA()

module.exports = {
    entry: entry,
    plugins: [
        htmlWebpackPlugins
    ]
}
```

## 6.开启`sourcemap`

+ 作用：通过`soucemap`定位源代码，提高调试效率

+ 应用：开发环境开启，生产环境关闭（避免源代码泄漏）。线上排查问题的时候可以将`sourcemap`上传到错误监控系统或者借助`fundebug`。

+ 启动`sourcemap`配置

  ```js
  // webpack.dev.js开发环境开启source-map
  module.exports = {
       devtool: 'source-map'
  }
  ```

+ source map 类型

  | [devtool](https://www.webpackjs.com/configuration/devtool/) | 首次构建 | 二次构建 | 是否适合生产环境 | 可以定位的代码                   |
  | ----------------------------------------------------------- | -------- | -------- | ---------------- | -------------------------------- |
  | `(none)`                                                    | 非常快速 | 非常快速 | yes              | 打包后的代码                     |
  | `eval`                                                      | 非常快速 | 非常快速 | no               | `webpack`生产的一个个模块代码    |
  | `cheap-source-map`                                          | 比较快   | 中等     | no               | 经过loader转换过的代码（仅限行） |
  | `source-map`                                                | 慢       | 慢       | no               | 原始源代码                       |

## 7.提取公共资源

### 7.1 基础库的分离

+ 目的：将`react`、`react-dom`基础包通过`cdn`引入，不打入`bundle`中。

+ 思路：使用`html-webpack-externals-plugin`

  例如：不打包`react`和`react-dom`而是替换为`cdn`（插入到`<head>`中）。

  ```js
  const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
  
  module.exports = {
      ...
      plugins: [
          new HtmlWebpackExternalsPlugin({
              externals: [
                  {
                      module: 'react',
                      entry: 'https://unpkg.com/react@16/umd/react.production.min.js',
                      global: 'React'
                  },
                                  {
                      module: 'react-dom',
                      entry: 'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js',
                      global: 'ReactDom'
                  }
              ]
          })
      ]
      ...
  }
  ```

### 7.2 公共脚本的分离

+ 利用[`SplitChunksPlugin`](https://www.webpackjs.com/plugins/split-chunks-plugin/)：这个是`webpack4`内置的插件，替换`CommonsChunkPlugin`插件(废弃)。

+ `chunks`参数说明：

  + `async`：对异步引入的库进行分离（默认）
  + `initial`：对同步引入的库进行分离
  + `all`：对所有的引入的库进行分离（推荐）

+ 所有参数如下：

  ```js
  module.exports = {
      optimization: {
          splitChunks: {
              // 异步
              chunks: 'async',
              minSize: 30000,
              minChunks: 1,
              maxAsyncRequsets: 5,
              maxInitialRequsets: 3,
              automaticNameDelimiter: '~',
              name: true,
              cacheGroups: {
                  vendors: {
                      test: /[\\/]node_modules[\\/]/,
                      priority: -10
                  }
              },
              default: {
              	minChunks: 2,
              	priority: -20,
              	reuseExistingChunk: true
      		}
          }
      }
  }
  ```

+ 利用`SplitChunksPlugin`分离基础包：比如分离`react`和`react-dom`，打包为`vendors`文件

  ```js
  module.exports = {
      optimization: {
          splitChunks: {
              cacheGroups: {
                  commons: {
                      // 匹配react和react-dom
                      test: /(react|react-dom)/,
                      // 单独打包后的文件名
                      name: 'vendors',
                      chunks: 'all'
                  }
              },
          }
      }
  }
  ```

+ 利用`SplitChunksPlugin`分离公共文件：

  ```js
  module.exports = {
      optimization: {
          splitChunks: {
              // 分离包体积的最小值
              minSize: 0
              cacheGroups: {
                  commons: {
                      // 匹配react和react-dom
                      test: /(react|react-dom)/,
                      // 单独打包后的文件名
                      name: 'vendors',
                      chunks: 'all',
              		// 公共文件引入最小次数
              		minChunks: 2
                  }
              },
          }
      }
  }
  ```

### 7.3 进一步分包：预编译资源模块

+ 思路： 将`react`、`react-dom`、`redux`、`react-redux`基础包和业务包打包成一个文件

+ 方法：使用`DLLPlugin`进行分包，`DLLReferencePlugin`对`manifest.json`引用

  `webpack.dll.js`：

  ```js
  const path = require('path');
  const webpack = require('webpack');
  
  module.exports = {
      resolve: {
          extensions: ['.js', '.jsx', '.json', '.less', '.css'],
          modules: [__dirname, 'node_modules']
      },
      entry: {
          // 基础包
          library: [
              'react',
              'react-dom',
              'redux',
              'react-redux'
          ],
          // 业务包
          vendor: [
              './xx/index.js'
          ]
      },
      output: {
          filename: '[name].dll.js',
          path: path.resolve(__dirname, './build/library'),
          library: '[name]_[fullhash]'
      },
      plugins: [
          new webpack.DLLPlugin({
              context: __dirname,
              name: '[name]_[fullhash]',
              path: './build/library/[name].json'
          }),
      ]
  }
  ```

  使用DLLReferencePlgin引用manifest.json，在webpack.prod.js中引入：

  ```js
  module.exports = {
      plugins: [
          new webpack.DLLPlugin({
              manifest: require('./build/library/library.json')
          })
      ]
  }
  ```

  引入效果：

  ```html
  ....
  </div>
  <script scr="/build/library/library.dll.js"></script>
  ···
  ```

  

## 8.`Tree Shaking`使用与原理

### 8.1 `Tree Shaking`使用

+ 问题：1个模块中可能有多个方法，只要其中的某个方法被使用了，则整个文件都会被打包到`bundle`文件里面去
+ 解决：`tree shaking`就是只把用到的方法打包到`bundle`，没用到的方法会在`uglify`阶段剔除。
+ 使用：`webpack`默认支持`tree shaking`，在`.bablerc`里面设置`moduls:false`即可**（`mode:production`下默认支持`tree shaking`）**
+ 前提：必须是`ES6`的语法，`commonjs`不支持。

### 8.2 `Tree Shaking`原理 

+ [DEC](https://en.wikipedia.org/wiki/Dead_code_elimination)： 即`DEC（Dead Code Elimination）`，剔除无效代码
  + 代码不会被执行，不可到达
  + 代码执行的结果不会被用到
  + 代码只会影响死变量（只写不读）

+ [`webpack tree-shaking`](https://www.webpackjs.com/guides/tree-shaking/)原理——利用`ES6`模块的特点（在`uglify`阶段删除无用代码)：
  
  + 只能作为模块顶层的语句出现
  + `import`的模块名只能是字符串常量
  + `import binding`是`immutable`的
  
+ 剔除无用的`CSS`：

  + 1.[`PurgecssPlugin`](https://www.npmjs.com/package/purgecss-webpack-plugin)： 遍历代码，识别已经用到的`CSS class`。需要和`mini-css-extract-plugin`配合使用

    ```js
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    const PurgecssPlugin = require('purgecss-webpack-plugin');
    
    const PATHS = {
        src: path.join(__dirname, 'src');
    }
    
    module.exports = {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin,
                        'css-loader'
                    ]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css'
            }),
            new PurgecssPlugin({
                paths: glob.sync(`${PATHS.src}/**/*`, {nodir: true})
            })
        ]
    }
    ```

    

  + 2.`uncss`： `HTML`需要通过`jsdom`加载，所有的样式通过`PostCSS`解析，通过`document.querySelector`来识别在`html`文件里面不存在的选择器

## 9.Scope Hoisting减少闭包

![](E:\blog\images\webpack\module-transfer.png)

上图中代码经过`webpack`打包之后会给模块加上一层函数包裹，`import`会被转换成`__webpack_require`（用来加载模块）。打包的结果是一个`IIFE`（自执行的匿名闭包函数）

+ 问题：打包之后存在大量闭包代码，如果大量函数闭包包裹代码，会导致体积增大（模块越多越明显），运行代码时创建的函数作用域变多，内存开销变大。

+ `Scope Hoisting`原理：将所有模块的代码按照引用顺序放在一个函数作用域里面，然后适当的重命名一些变量以防止变量名冲突。从而减少函数声明代码和内存开销。

+ 使用：借助`ModuleConcatenationPlugin`插件实现。（`webpack`的[`mode`](https://webpack.js.org/configuration/mode/):`production`时默认开启），必须是`ES6`语法，`CommonJS`不支持。

  ```js
  plugins:[new webpack.optimize.ModuleConcatenationPlugin]
  ```

## 10.代码分割

### 10.1 代码分割的意义

对于打的web应用来讲，将所有的代码都放在一个文件中显然是不够有效的，特别是当你的某些代码块是在某些特殊的时候才会被使用到。`webpack`有一个功能就是将你的代码分割成chunks(语块)，当代码运行到需要他们的时候再进行加载。

![代码分割](E:\blog\images\webpack\code-splitting.png)

适用场景：

+ 抽离相同代码到一个共享模块。
+ 脚本懒加载，使得初始下载的代码更小。

### 10.2 懒加载JS脚本

+ `CommonJS`: `require.ensure`

+ `ES6`：动态`import`(需要`babel`转换)

安装依赖：

```sh
yarn add @babel/plugin-syntax-dynamic-import -D
```

`.babelrc`中增加插件：

```js
{
    "plugins": ["@babel/plugin-syntax-dynamic-import"]
}
```

## 11. 使用[ESLint](https://eslint.org/)

```sh
# 安装依赖
yarn add eslint --dev

# 初始化配置
npx eslint --init
```

比如：`react-ts`项目[`eslint`配置文件](https://cn.eslint.org/docs/user-guide/configuring)`.eslinttrc.json`：

```json
{
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "react-app",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  "plugins": ["react", "@typescript-eslint", "prettier"],
  "env": {
    "browser": true,
    "jasmine": true,
    "jest": true
  },
  "rules": {
    "prettier/prettier": ["error", {
      "singleQuote": true,
      "trailingComma": "es5",
      "printWidth": 120,
      "endOfLine": "auto"
    }],
    "@typescript-eslint/interface-name-prefix": ["error", "always"],
    "@typescript-eslint/explicit-member-accessibility": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "jsx-a11y/anchor-is-valid": 0
  },
  "parser": "@typescript-eslint/parser"
}

```

有些文件不需要`eslint`检测，可以加入`.eslintignore`配置文件中。

配置`ESLint`目的是为了代码规范化和统一化，那么如何落地呢？

+ 和`CI/CD`集成（生产阶段）

  ![CI/CD集成ESLint](E:\blog\images\webpack\CI-CD.jpg)

  ```js
  yarn add husky -D
  ```

  `package.json`增加`npm script`:

  ```json
  "scripts":{
      "precommit": "lint-staged",
      "eslint": "eslint --fix"
  },
  "lint-staged": {
      "linters": {
          "*.{js,ts,scss}":["eslint --fix", "git add"]
      }
  }
  ```

+ 和`webpack`集成（开发阶段）

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
                  test:/\.js$/,
                  exclude: /node_modules/,
                  use: [
                      'babel-loader',
                      'eslint-loader'
                  ]
              }
          ]
      }
  }
  ```

## 12.打包库和组件

+ demo：实现一个大整数加法库的打包及发布

  + 需要打包压缩版和非压缩版

  + 支持 `AMD/CJS/ESM` 模块引入

    ```js
    // AMD方式
    require(['large-number'], function(large-number){
        largeNumber.add('999', '1');
    })
    
    // CJS
    const largeNumber = require('large-number');
    largeNumber.add('999', '1');
    
    //ESM
    import * as largeNumber from 'large-number';
    largeNumber.add('999', '1');
    ```

  + 通过`cdn`直接引入：

    ```html
    <!doctype html>
    <html>
        <script src="https://unpkg.com/large-number.js"></script>
    </html>
    ```

    

+ 打包输出的库名称：

  + 未压缩版：`large-number.js`

  + 压缩版：`large-number.min.js`

    ```
    |-/dist
    	|-large-number.js
    	|-large-number.min.js
     |-webpack.config.js
     |-package.josn
     |-index.js 入口文件
     |-/src
     	|-index.ts 源码实现处
    ```

+ 配置`webpack`：

  + library：指定库的全局变量
  + [libraryTarget](https://webpack.js.org/configuration/output/#outputlibrarytarget)：支持库引入的方式（`AMD/CJS/ESM` ： `'umd'`)

  ```js
  const path = require('path');
  const TerserPlugin = require('terser-webpack-plugin');
  
  module.exports = {
      entry: {
          'large-number': './src/index.ts',
          'large-number.min': './src/index.ts'
      },
      output: {
          filename: '[name].js',
          library: 'largeNumber',
          libraryExport: 'default',
          libraryTarget: 'umd',
          path: path.resolve(__dirname, 'dist'),
      },
      resolve: {
          extensions: [ '.tsx', '.ts', '.js' ],
      },
      // 配置typescript
      module: {
          rules: [
              {
                  test: /\.tsx?$/,
                  use: 'ts-loader',
                  exclude: /node_modules/,
              },
          ],
      },
      // 指定*.min才压缩
      mode: 'none', // 关闭production模式
      optimization: {
          minimize: true,
          minimizer: [
              new TerserPlugin({
                  include: /\.min\.js$/,
                  parallel: true, // 开启并行压缩
                  cache: true // 开启缓存
              })
          ]
      }
  };
  ```

+ 设置入口文件：`package.json`的`main`字段设为`index.js`，配置入口文件`index.js`

  ```json
  if (process.env.NODE_ENV === 'production'){
      module.exports = require('./dist/large-number.min.js')
  } else {
       module.exports = require('./dist/large-number.js')
  }
  ```

  

+ 实现`./src/index.ts`：

  ```js
  /**
   * function add: 实现两个大数（字符串）相加
   * @param a: string
   * @param b: string
   * return: string
   * */
  export default function add(a: string, b: string): string {
    // 字符串的index
    let i = a.length - 1;
    let j = b.length - 1;
    // 相加的结果
    let result = '';
    // 进位标志
    let carry = 0;
  
    // 开始循环遍历
    while(i >= 0 || j >= 0) {
      // a、b对应位数上的初始化值
      let x = 0;
      let y = 0;
      let sum;
  
      if(i >= 0) {
        x = +a[i];
        i--;
      }
      if(j >= 0) {
        y = +b[j];
        j--;
      }
  
      // 求和
      sum = x + y + carry;
  
      if(sum >= 10) {
        carry = 1;
        sum -= 10;
      } else {
        carry = 0;
      }
  
    // 第一次 0 + ''
      result = sum + result;
    }
  
    // 字符串拼接
    if(carry) {
      result = carry + result;
    }
  
    return result;
  }
  
  ```
  
  

## 13. SSR打包方案

### 13.1 服务端渲染（SSR）概念

`SSR`：服务端渲染，有服务端准备好所有的`html`资源（`css`、`js`、`data`、图片等），浏览器直接渲染`html`。

**服务端渲染（SSR）核心——减少请求**

|          | 客户端渲染                                     | 服务端渲染                    |
| -------- | ---------------------------------------------- | ----------------------------- |
| 请求     | 多个请求（`html`、`css`、`data`、`js`等 ）     | 1个请求                       |
| 加载过程 | `HTML` 等相关资源串行加载                      | 1个请求返回`HTML`所有相关资源 |
| 渲染     | 前端渲染                                       | 服务端渲染                    |
| 可交互   | 图片等静态资源加载完成，`JS`逻辑执行完成可交互 | 同客户端渲染                  |

### 13.2 服务端渲染（SSR）实现

> [SSR服务端渲染DEMO](https://github.com/Keekuun/geektime-webpack-course/tree/master/code/chapter03/my-project)

+ 服务端：
  + 使用`react-dom/server`的`renderToString`方法将`React`组件渲染字符串
  + 服务端路由返回对应的模板
+ 客户端
  + 打包出针对服务端的组件

+ `webpack ssr`打包问题：
  + 1.浏览全局变量（`NodeJS`中没有`document`和`window`）
    + 组件适配：将不兼容的组件根据打包环境进行适配
    + 请求适配：将`fetch`或`ajax`发送的请求方法改写为`isomorphic-fetch`或`axios`
  + 2.样式问题（`NodeJS`无法解析`CSS`）
    + 方案一：服务端打包通过`ignore-loader`忽略`css`的解析
    + 方案二：将`style-loader`替换为`isomorphic-style-loader`

## 14.`webpack`通用配置设计

### 14.1  构件配置抽离成`npm`包的意义

+ 通用性
  + 业务开发者无需关注构建配置
  + 统一团队构件脚本

+ 可维护性
  + 构件配置合理的拆分
  + `README`文档、`CHANGELOG`文档等
+ 质量
  + 冒烟测试、单元测试、测试覆盖率等
  + CI/CD持续集成

### 14.2 构件配置管理的可选方案

+ 通过多个配置文件管理不同环境的构件， 对`webpack --config`参数进行控制
+ 将构建配置设计成一个库，比如：`hjs-webpack`、`Neutrino`、`webpack-blocks`
+ 抽成一个工具进行管理，比如： `create-react-app`、`kyt`、`nwb`
+ 将所有的配置放在一个文件，通过`--env`参数控制分支选择

### 14.3 构建配置包的设计

通过多个配置文件管理不同环境的`webpack`配置

+ 基础配置：`webpack.base.js`
+ 开发环境： `webpack.dev.js`
+ 生产环境：`webpack.prod.js`
+ `SSR`环境：`webpack.ssr.js`
+ ···

抽离成一个`npm`包统一管理：

+ 规范：`Git commit`日志、`README`、`ESLint`规范、`Semver`规范
+ 质量：冒烟测试、单元测试、测试覆盖率和CI/CD

通过`webpack-merge`组合配置：

```js
const merge = require('webpack-merge');

// merge({a:[1],b:5,c:20},{a:[2],b:10,d:33})
// {a:[1,2],b:10,c:20,d:33}

const baseConfig = require('./webpack.base.js');
const devConfig = {
    // webpack配置
    plugins：[],
    module: {}
	...
}

// 合并配置
module.exports = merge(baseConfig, devConfig);
```

### 14.4 功能模块设计

![webpack功能模块设计](E:\blog\images\webpack\common-module-design.png)

### 14.5 功能目录设计

![](E:\blog\images\webpack\directory-design.png)

### 14.5 代码实现

+ `webpack.base.js`：

  ```js
  'use strict';
  
  const glob = require('glob');
  const path = require('path');
  const webpack = require('webpack');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');
  const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
  const Autoprefixer = require('autoprefixer');
  
  // 多页面打包配置
  const setMPA = () => {
      const entry = {};
      const htmlWebpackPlugins = [];
      const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
  
      Object.keys(entryFiles)
          .map((index) => {
              const entryFile = entryFiles[index];
              // '/Users/cpselvis/my-project/src/index/index.js'
  
              const match = entryFile.match(/src\/(.*)\/index\.[js|tsx?]/);
              const pageName = match && match[1];
  
              entry[pageName] = entryFile;
              htmlWebpackPlugins.push(
                  new HtmlWebpackPlugin({
                      template: path.join(__dirname, `src/${pageName}/index.html`),
                      filename: `${pageName}.html`,
                      chunks: [pageName],
                      inject: true,
                      minify: {
                          html5: true,
                          collapseWhitespace: true,
                          preserveLineBreaks: false,
                          minifyCSS: true,
                          minifyJS: true,
                          removeComments: false
                      }
                  })
              );
          });
  
      return {
          entry,
          htmlWebpackPlugins
      }
  }
  
  const { entry, htmlWebpackPlugins } = setMPA();
  
  module.exports = {
      entry: entry,
      output: {
          path: path.join(__dirname, 'dist'),
          filename: '[name].js'
      },
      resolve: {
          extensions: [ '.tsx', '.ts', '.js' ],
      },
      module: {
          rules: [
              {
                  test: /.js$/,
                  use: 'babel-loader'
              },
              {
                  test: /\.tsx?$/,
                  use: 'ts-loader',
                  exclude: /node_modules/,
              },
              {
                  test: /.css$/,
                  use: [
                      'style-loader',
                      'css-loader'
                  ]
              },
              {
                  test: /.less$/,
                  use: [
                      'style-loader',
                      'css-loader',
                      'less-loader',
                      // 自动补齐css前缀
                      {
                          loader: 'postcss-loader',
                          options: {
                              pluguins:() => [
                                  Autoprefixer({
                                      // 指定兼容的浏览器最低版本
                                      browsers:['last 2 version', '>1%', 'ios 7']
                                  })
                              ]
                          }
                      }
                      // 将px ---> rem
                       {
                          loader: 'px2rem-loader',
                          options: {
                              // 1rem = 75px
                              remUnit: 75,
                              // rem小数点位数
                              remPrecision: 8
                          }
                      }
                  ]
              },
              {
                  test: /.(png|jpg|gif|jpeg)$/,
                  use: [
                      {
                          loader: 'url-loader',
                          options: {
                              limit: 10240
                          }
                      }
                  ]
              },
              {
                  test: /.(woff|woff2|eot|ttf|otf)$/,
                  use: 'file-loader'
              }
          ]
      },
      plugins: [
          // 目录清理
          new CleanWebpackPlugin(),
          // 命令行显示优化
          new FriendlyErrorsWebpackPlugin(),
          // 错误监控
          function handleErrorPlugin() {
              this.hooks.done.tap('done', (stats) => {
                  if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1)
                  {
                      // eslint-disabled-next-line
                      console.log('build error');
                      process.exit(1);
                  }
              })
          }
      ].concat(htmlWebpackPlugins),
  	stats: 'errors-only'
  };
  ```

  

+ `webpack.dev.js`：

  ```js
  'use strict';
  
  const webpack = require('webpack');
  const merge = require('webpack-merge');
  // 导入webpack.base.js
  const baseConfig = require('./webpackbase.js');
  
  const devConfig = {
      mode: 'development',
      plugins: [
          // 热更新
          new webpack.HotModuleReplacementPlugin(),
      ],
      devServer: {
          contentBase: './dist',
          hot: true,
          stats: 'errors-only'
      },
      devtool: 'cheap-source-map'
  };
  
  module.exports = merge(baseConfig, devConfig);
  ```

  

+ `webpack.prod.js`：

  ```js
  'use strict';
  
  const webpack = require('webpack');
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
  const cssnano =require('cssnano');
  const merge = require('webpack-merge');
  // 导入webpack.base.js
  const baseConfig = require('./webpackbase.js');
  
  const prodConfig = {
      mode: 'production',
      plugins: [
          new MiniCssExtractPlugin({
              filename: '[name]_[contenthash:8].css'
          }),
          // 压缩CSS
          new OptimizeCSSAssetsPlugin({
              assetNameRegExp: /\.css$/g,
              cssProcessor: cssnano
          }),
          // 分离基础库
          new HtmlWebpackExternalsPlugin({
              externals: [
                {
                  module: 'react',
                  entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
                  global: 'React',
                },
                {
                  module: 'react-dom',
                  entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
                  global: 'ReactDOM',
                },
              ]
          }),    
      ],
      // 提取公共资源包
      optimization: {
           splitChunks: {
               minSize: 0,
               cacheGroups: {
                   commons: {
                       name: 'commons',
                       chunks: 'all',
                       minChunks: 2
                   }
               }
           }
       }
      stats: 'errors-only'
  };
  
  module.exports = merge(baseConfig, prodConfig);
  ```

  

+ `webpack.ssr.js`：

  ```js
  'use strict';
  
  const webpack = require('webpack');
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
  const cssnano =require('cssnano');
  const merge = require('webpack-merge');
  // 导入webpack.base.js
  const baseConfig = require('./webpackbase.js');
  
  const ssrConfig = {
      mode: 'none',
      module: {
          rules: [
              {
                  test: /\.css$/,
                  use: 'ignore-loader'
              },
              {
                  test: /\.less$/,
                  use: 'ignore-loader'
              },
          ]
      },
      plugins: [
          new MiniCssExtractPlugin({
              filename: '[name]_[contenthash:8].css'
          }),
          // 压缩CSS
          new OptimizeCSSAssetsPlugin({
              assetNameRegExp: /\.css$/g,
              cssProcessor: cssnano
          }),
          // 分离基础库
          new HtmlWebpackExternalsPlugin({
              externals: [
                {
                  module: 'react',
                  entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
                  global: 'React',
                },
                {
                  module: 'react-dom',
                  entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
                  global: 'ReactDOM',
                },
              ]
          }),    
      ],
      stats: 'errors-only'
  };
  
  module.exports = merge(baseConfig, ssrConfig);
  ```

## 15.冒烟测试——保证构件成功

+ **冒烟测试**（`smoke testing`）：指对提交测试的软件在进行详细深入的测试之前而进行的预测试，预测试的主要目的是暴露导致软件需要重新发布的基本功能失效等严重问题（保证基本功能可以，流程行得通）。

+ 判断构件是否成功：

  ```js
  const path = require('path');
  const webpack = require('webpack');
  const rimraf = require('rimraf');
  const Mocha = require('mocha');
  
  const mocha = new Mocha({
      timeout: '10000ms',
  });
  
  process.chdir(__dirname);
  
  rimraf('./dist', () => {
      const prodConfig = require('../../lib/webpack.prod.js');
      webpack(prodConfig, (err, stats) => {
          if(err) {
              console.log(err);
              return;
          }
          
          console.log(stats.toString({
              color: true,
              modules: false,
              children: false,
              chunks: false,
              chunkModules: false
          }));
          
          console.log('\n' + 'Compile success, begin test')
      })
  })
  ```

+ [编写测试用例](https://github.com/Keekuun/geektime-webpack-course/blob/master/code/chapter04/my-project/builder-webpack/test/smoke/index.js)

  ```js
  const glob = require('glob-all');
  
  describe('checking generated file exists', function() {
      it('should generate html files', function(done) {
          const files = glob.sync(
          	[
                  './dist/index.html',
                  './dist/search.html'
              ]
          );
          if (files.length > 0) {
              done();
          } else {
              throw new Error('No html files found!')
          }
      });
      it('should generate js&css files', function(done) {
          const files = glob.sync(
          	[
                  './dist/index_*.js',
                  './dist/search_*.js',
                  './dist/index_*.css',
                  './dist/search_*.css',
              ]
          );
          if (files.length > 0) {
              done();
          } else {
              throw new Error('No files found!')
          }
      });
  })
  ```

## 16. 单元测试和测试覆盖率

### 16.1 单元测试

+ 技术选型：`Mocha` + `Chai`

+ 测试代码：`describe`, `it`, `expect`

+ 测试命令：`mocha add.test.js`

  `add.test.js`

  ```js
  const expect = require('chai').expect;
  
  const add = require('../src/add.js');
  
  describe('use expect: src/add.js', () => {
      it('add(1, 2) === 3', () => {
          expect(add(1,2).to.equal(3));
      });
  });
  ```

+ [webpack打包测试](https://github.com/Keekuun/geektime-webpack-course/blob/master/code/chapter04/my-project/builder-webpack/test/unit/webpack-base-test.js)

  ```js
  const assert = require('assert');
  
  describe('webpack.base.js test case', () => {
      const baseConfig = require('../../lib/webpack.base.js')
  
      it('entry', () => {
          assert.equal(baseConfig.entry.index, '/Users/cpselvis/my-project/builder-webpack/test/smoke/template/src/index/index.js');
          assert.equal(baseConfig.entry.search, '/Users/cpselvis/my-project/builder-webpack/test/smoke/template/src/search/index.js');
      });
  });
  ```

  `package.json`：

  ```json
  {
      "scripts": {
     	 	"test": "./node_modules/./bin/_mocha"
  	}
  }
  ```

### 16.2 测试覆盖率-[istanbul](https://github.com/gotwarlost/istanbul)

+ 安装依赖：

  ```sh
  yarn add -g istanbul
  ```

+ 查看测试覆盖率

  ```sh
  istanbul cover test.js
  ```

  

## 17.CI/CD持续集成

**1.作用**：

+ 快速发现错误
+ 防止分支大幅偏离主干
+ 核心措施： 代码集成到主干之前，必须通过自动化测试。只要一个测试用力失败，就不能集成。

**2.技术选型**

+ [**travis**](https://docs.travis-ci.com/)：`.travis.yml`配置入下

  ```yaml
  language: node_js
  
  sudo: false
  
  cache: # 开启缓存
  	apt: true
  	directorirs:
  		- node_modules
      
  node_js: stable  # 设置对应的版本
      
  install:
      - npm install -D # 安装构建器依赖
      - cd ./test/template-project
      - npm install -D # 安装模板项目依赖
      - cd ../../../
      	
   script:
     	- npm test
  ```

+ [登陆travis](https://travis-ci.com/getting_started)： 使用github账号登录，在https://travis-ci.org/account/repositories为项目启动，并在项目根目录下新增上述`.travis.yml`文件。

  

+ [**jenkins**](https://www.jenkins.io/)

## 18.发布[npm包](https://www.npmjs.com/login)

+ 登陆用户： `npm login`

+ 升级版本：

  + 升级补丁版本号：`npm version patch`
  + 升级小版本号：`npm version minor`
  + 升级大版本号：`npm version major`

+ 发布之前：`git tag 版本号`

+ 发布版本：`npm publish`

+ 版本信息说明：遵守`semever`规范（避免出现循环依赖，减少依赖冲突）

  1. 版本通常由三维组成，形如`X.Y.Z`。`x`主版本号（当你做了不兼容的API修改）`Y`次版本号（当你做了向下兼容的功能性新增）`Z`修订号（当你做了向下兼容的问题修正）
  2. 版本是严格递增的`16.2.0` → `16.3.0`→`16.3.1`。
  3. 在发布重要版本时，可以发布`alpha`（内部测试版，一般不向外部发布，会有很多BUG，一般只有测试人员使用），`beta`（测试版本，这个阶段会一直加入新的功能，在alpha版之后推出）、`rc`（Release Candidate系统平台上的就是发行候选版本。RC版不会再加入新的功能了，主要着重除错）等先行版本。
  4. 先行版本号格式：`修订版本号 - [rc|beta|appha].[0-9A-Za-z] `。比如`16.3.0-rc.3` 、`16.0.4-beta.4`

  

## 19. git commit规范和changelog

### 19.1 git commit 规范

良好的`git commit` 规范优势：

+ 加快`code review`的流程
+ 根据`git commit`的元数据生成`changelog`
+ 后续维护者可以知道`feature`被修改的原因

技术方案：

+ 统一团队git commit的日至标准，便于后续代码review和版本发布

+ 使用angular的git commit 日志作为基本规范：”提交类型： 提交信息“。

  ```
  docs: 更新CHANGELOG文档
  ```

  

  | 提交类型<type> | 说明                                                      |
  | -------------- | --------------------------------------------------------- |
  | feat           | 新增feature                                               |
  | fix            | 修复bug                                                   |
  | docs           | 紧急修改了文档，比如`READNE`、`CHENGELOG`、`CONTRIBUTE`等 |
  | style          | 紧急修改了空格、格式缩进、逗号等，不修改代码逻辑          |
  | refactor       | 代码重构，没有加新功能或者修复bug                         |
  | perf           | 优化相关，比如提升性能、体验                              |
  | test           | 测试用例，包括单元测试、集成测试等                        |
  | chore          | 改变构件流程或者增加依赖、工具等                          |
  | revert         | 回滚到上一个版本                                          |

+ 本地开发阶段增加`precommit`钩子：

  ```sh 
  yarn add husky -S
  ```

  配置`packagejson`：

  ```json 
  {
   "script": {
       "commitmsg": "validate-commiyt-msg", 
       "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r O"
   }   
  }
  ```

  

### 19.2 changelog的生成：

+ 日志提交时有好的类型选择提示： 使用commitize工具

+ 不符合要求格式的日志拒绝提交的保证机制： 使用validat-commit-msg工具 + 需要同时在客户端、gitlab server hook做

+ 统一changelog文档信息生成： 使用conventional-changelog-cli工具

  ```sh
  yarn add conventional-changelog-cli -S
  yarn add validat-commit-msg -S
  ```

  配置`packagejson`：

  ```json
  {
   "script": {
       // 保证commit规范
       "commitmsg": "validate-commiyt-msg",
       // changelog生成
       "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r O"
   }   
  }
  ```

  