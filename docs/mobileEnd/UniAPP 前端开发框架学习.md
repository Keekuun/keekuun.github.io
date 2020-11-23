---
title: 【UniAPP】UniAPP 前端开发框架学习
sidebar: auto
isComment: true
categories: 
- 移动端
tags: 
- UniAPP
- 跨平台
---

# UniAPP 前端开发框架学习

## 一、UniAPP 介绍

### （1）什么是 UniAPP ？

> uni-app 是一个使用 Vue.js 开发所有前端应用的框架，开发者编写一套代码，可发布到 iOS，Android，H5，以及各种小程序（微信/支付宝/百度/头条/ QQ /钉钉）等多个平台。
>
> uni-app在手，做啥都不愁。甚至不跨端，也是更好 uni-app 的小程序开发框架，更好的 App 跨平台框架，更方便的 H5 开发框架。
>
> 你都可以快速交付，不需要转换开发思维，不需要更改开发习惯。



### （2）为什么要选择 UniAPP ？

> 1. 开发者/案例数量更多
>
> 几十万应用、uni统计月活12亿、70+微信/qq群、更高的百度指数跨端完善度更高，真正落地的提高生产力。
>
> 2. 平台能力不受限
>
> 在跨端的同时，通过条件编译+平台特有API调用，可以优雅的为某平台写个性化代码，调用专有能力而不影响其他平台。支持原生代码混写和原生sdk集成。
>
> 3. 性能体验优秀
>
> 加载新页面速度更快、自动diff更新数据。App端支持原生渲染，可支撑更流畅的用户体验。小程序端的性能优于市场其他框架。
>
> 4. 周边生态丰富
>
> [插件市场](https://ext.dcloud.net.cn/?orderBy=WeekDownload)数千款插件。支持NPM、支持小程序组件和SDK。微信生态的各种sdk可直接用于跨平台App。
>
> 5. 学习成本低
>
> 基于通用的前端技术栈，采用vue语法+微信小程序api，无额外学习成本。
>
> 6. 开发成本低
>
> 不止开发成本，招聘、管理、测试各方面成本都大幅下降。



### （3）UniAPP 功能框架

![img](https://atts.w3cschool.cn/attachments/day_200401/202004011643414413.png)



### （4）UniAPP 开发环境搭建

> 1. 下载开发工具，HBuilderX：
>
>    HBuilderX是通用的前端开发工具，但为`uni-app`做了特别强化。
>
>    下载App开发版，可开箱即用；如下载标准版，在运行或发行`uni-app`时，会提示安装`uni-app`插件，插件下载完成后方可使用。
>
> 2. 创建 uni-app 项目
>
>    选择`uni-app`类型，输入工程名，选择模板，点击创建，即可成功创建。
>
>    uni-app自带的模板有 Hello uni-app ，是官方的组件和API示例。还有一个重要模板是 uni ui项目模板，日常开发推荐使用该模板，已内置大量常用组件。
>
> 3. 运行 uni-app 
>
>    主要包括：浏览器运行、真机运行、小程序运行等
>
> 4. 发布 uni-app
>
>    主要包括：云端原生 APP 、离线原生 APP、H5、各种小程序



### （5）UniAPP 框架简介

**开发规范约定**

> - 页面文件向导[Vue单文件组件（SFC）规范](https://vue-loader.vuejs.org/zh/spec.html)
> - 组件标签靠近小程序规范，详见uni-app组件规范
> - 互连能力（JS API）靠近微信小程序规范，但需要将替换替换 wx 为 uni ，详见uni-app接口规范
> - 数据绑定及事件处理同 Vue.js 规范，同时补充了 App 和页面的生命周期
> - 为兼容多端运行，建议使用 flex 布局进行开发



**资源路径说明**

> template内约会静态资源，如image，video等标签的src属性时，可以使用相对路径或绝对路径，形式如下

```html
<!-- 绝对路径，/static指根目录下的static目录，在cli项目中/static指src目录下的static目录 -->
<image class="logo" src="/static/logo.png"></image>
<image class="logo" src="@/static/logo.png"></image>
<!-- 相对路径 -->
<image class="logo" src="../../static/logo.png"></image>
```

注意

- @初始的绝对路径以及相对路径会通过base64转换规则校验
- 约会的静态资源在非h5平台，均不转为base64。
- H5平台，小于4kb的资源会被转换成base64，其余不转。



> js文件或script标签内（包括renderjs等）日期js文件时，可以使用相对路径和绝对路径，形式如下

```js
// 绝对路径，@指向项目根目录，在cli项目中@指向src目录
import add from '@/common/add.js'
// 相对路径
import add from '../../common/add.js'
```



> css文件或style标签内约会css文件时（scss，less文件同理），可以使用相对路径和绝对路径，形式如下

```css
/* 绝对路径 */
@import url('/common/uni.css');
@import url('@/common/uni.css');
/* 相对路径 */
@import url('../../common/uni.css');
```



> css文件或style标签内引用的图片路径，可以使用相对路径也可以使用绝对路径，形式如下

```css
/* 绝对路径 */
background-image: url(/static/logo.png);
background-image: url(@/static/logo.png);
/* 相对路径 */
background-image: url(../../static/logo.png);
```



## 二、UniAPP 初始化相关配置

### （1）工程目录结构

```
┌─components            uni-app组件目录
│  └─comp-a.vue        可复用的a组件
├─hybrid                存放本地网页的目录
├─platforms             存放各平台专用页面的目录
├─pages                 业务页面文件存放的目录
│  ├─index
│  │  └─index.vue       index页面
│  └─list
│     └─list.vue        list页面
├─static                存放应用引用静态资源（如图片、视频等）的目录，注意：静态资源只能存放于此
├─wxcomponents          存放小程序组件的目录
├─common                公共资源（自建）
├─api                   请求封装（自建）
├─store                 状态管理（自建）
├─main.js               Vue初始化入口文件
├─App.vue               应用配置，用来配置App全局样式以及监听 应用生命周期
├─manifest.json         配置应用名称、appid、logo、版本等打包信息
└─pages.json            配置页面路由、导航条、选项卡等页面类信息
    
```

> 提示
>
> - static下目录的js文件不会被compile-，里面如果有es6的代码，不经过转换直接运行，在手机设备上会报错。
> - css，less/scss等资源同样不要放在static目录下，建议这些公共的资源放在common目录下。



### （2）全局配置 page.json

> `pages.json` 文件用来对 uni-app 进行全局配置，决定页面文件的路径、窗口样式、原生的导航栏、底部的原生tabbar 等。它类似微信小程序中`app.json`的**页面管理**部分。
>
> [官方文档](https://uniapp.dcloud.io/collocation/pages)

| 属性                                                         | 类型         | 必填 | 描述                   |
| :----------------------------------------------------------- | :----------- | :--- | :--------------------- |
| [globalStyle](https://uniapp.dcloud.io/collocation/pages?id=globalstyle) | Object       | 否   | 设置默认页面的窗口表现 |
| [pages](https://uniapp.dcloud.io/collocation/pages?id=pages) | Object Array | 是   | 设置页面路径及窗口表现 |
| [easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom) | Object       | 否   | 组件自动引入规则       |
| [tabBar](https://uniapp.dcloud.io/collocation/pages?id=tabbar) | Object       | 否   | 设置底部 tab 的表现    |
| [condition](https://uniapp.dcloud.io/collocation/pages?id=condition) | Object       | 否   | 启动模式配置           |
| [subPackages](https://uniapp.dcloud.io/collocation/pages?id=subpackages) | Object Array | 否   | 分包加载配置           |
| [preloadRule](https://uniapp.dcloud.io/collocation/pages?id=preloadrule) | Object       | 否   | 分包预下载规则         |



### （3）应用配置 manifest.json

> `manifest.json` 文件是应用的配置文件，用于指定应用的名称、图标、权限等。



### （4）编译配置 vue.config.js

> vue.config.js 是一个可选的配置文件，如果项目的根目录中存在这个文件，那么它会被自动加载，一般用于配置 webpack 等编译选项。[官方文档](https://uniapp.dcloud.io/collocation/vue-config)



### （5）全局样式 uni.scss

> `uni.scss`文件的用途是为了方便整体控制应用的风格。比如按钮颜色、边框风格，`uni.scss`文件里预置了一批scss变量预置。[官方文档](https://uniapp.dcloud.io/collocation/uni-scss)
>
> `uni-app` 官方扩展插件（uni ui）及 [插件市场](https://ext.dcloud.net.cn/) 上很多三方插件均使用了这些样式变量，如果你是插件开发者，建议你使用 scss 预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App。
>
> `uni.scss`是一个特殊文件，在代码中无需 import 这个文件即可在scss代码中使用这里的样式变量。uni-app的编译器在webpack配置中特殊处理了这个 uni.scss，使得每个 scss 文件都被注入这个uni.scss，达到全局可用的效果。如果开发者想要less、stylus的全局使用，需要在vue.config.js中自行配置webpack策略。



### （6）主组件 App.vue

> `App.vue`是uni-app的主组件，所有页面都是在`App.vue`下进行切换的，是页面入口文件。但`App.vue`本身不是页面，这里不能编写视图元素。
>
> 这个文件的作用包括：调用应用生命周期函数、配置全局样式、配置全局的存储globalData
>
> 应用生命周期仅可在`App.vue`中监听，在页面监听无效。



### （7）入口文件 main.js

> `main.js`是uni-app的入口文件，主要作用是初始化`vue`实例、定义全局组件、使用需要的插件如vuex。
>
> [官方文档](https://uniapp.dcloud.io/collocation/main)



## 三、UniAPP 生命周期

> 学习一个工具的目的核心是什么？是为了解决核心业务逻辑问题，业务逻辑很多时候简单的解释一句话：“在合适的时机干合适的事情”，OK！什么是合适的时机呢？简单的说，页面运行过程中，各个阶段的回调函数就是页面中的时机，我们也叫这个为“生命周期钩子函数”，当然，业务中我们也会写到很多「回调」的逻辑，这些回调其实也是咱们自定义的时机，UniAPP 的生命周期钩子函数回调函数有哪些呢？我们来理解一下！
>
> `uni-app` 完整支持 `Vue` 实例的生命周期，同时还新增 [应用生命周期](https://uniapp.dcloud.io/frame?id=应用生命周期) 及 [页面生命周期](https://uniapp.dcloud.io/frame?id=页面生命周期)。

### （1）应用生命周期

| 函数名               | 说明                                                         |
| :------------------- | :----------------------------------------------------------- |
| onLaunch             | 当`uni-app` 初始化完成时触发（全局只触发一次）               |
| onShow               | 当 `uni-app` 启动，或从后台进入前台显示                      |
| onHide               | 当 `uni-app` 从前台进入后台                                  |
| onError              | 当 `uni-app` 报错时触发                                      |
| onUniNViewMessage    | 对 `nvue` 页面发送的数据进行监听，可参考 [nvue 向 vue 通讯](https://uniapp.dcloud.io/use-weex?id=nvue-向-vue-通讯) |
| onUnhandledRejection | 对未处理的 Promise 拒绝事件监听函数（2.8.1+）                |
| onPageNotFound       | 页面不存在监听函数                                           |
| onThemeChange        | 监听系统主题变化                                             |



### （2）页面生命周期

| 函数名                              | 说明                                                         |
| :---------------------------------- | :----------------------------------------------------------- |
| onLoad                              | 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参），参考[示例](https://uniapp.dcloud.io/api/router?id=navigateto) |
| onShow                              | 监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面 |
| onReady                             | 监听页面初次渲染完成。注意如果渲染速度快，会在页面进入动画完成前触发 |
| onHide                              | 监听页面隐藏                                                 |
| onUnload                            | 监听页面卸载                                                 |
| onResize                            | 监听窗口尺寸变化                                             |
| onPullDownRefresh                   | 监听用户下拉动作，一般用于下拉刷新，参考[示例](https://uniapp.dcloud.io/api/ui/pulldown) |
| onReachBottom                       | 页面滚动到底部的事件（不是scroll-view滚到底），常用于下拉下一页数据。具体见下方注意事项 |
| onTabItemTap                        | 点击 tab 时触发，参数为Object，具体见下方注意事项            |
| onShareAppMessage                   | 用户点击右上角分享                                           |
| onPageScroll                        | 监听页面滚动，参数为Object                                   |
| onNavigationBarButtonTap            | 监听原生标题栏按钮点击事件，参数为Object                     |
| onBackPress                         | 监听页面返回                                                 |
| onNavigationBarSearchInputChanged   | 监听原生标题栏搜索输入框输入内容变化事件                     |
| onNavigationBarSearchInputConfirmed | 监听原生标题栏搜索输入框搜索事件，用户点击软键盘上的“搜索”按钮时触发。 |
| onNavigationBarSearchInputClicked   | 监听原生标题栏搜索输入框点击事件                             |
| onShareTimeline                     | 监听用户点击右上角转发到朋友圈                               |
| onAddToFavorites                    | 监听用户点击右上角收藏                                       |



## 四、UniAPP 路由配置及页面跳转

### （1）路由配置

> uni-app 页面路由全部交给**框架**统一管理，开发者需要在[pages.json](https://links.jianshu.com/go?to=https%3A%2F%2Funiapp.dcloud.io%2Fcollocation%2Fpages%3Fid%3Dpages)里配置每个路由页面的路径及页面样式（类似小程序在app.json中配置页面路由）。

````json
"pages": [
		{
			"path": "pages/index",
			"style": {
				"navigationBarTitleText": "金迅教育 · 路由配置",
				"navigationBarBackgroundColor": "#FFFFFF",
				"navigationBarTextStyle": "black",
				"backgroundColor": "#FFFFFF",
				"enablePullDownRefresh": true
			}
		},
		{
			"path": "pages/user",
			"style": {
				"navigationBarTitleText": "金迅教育 · 路由配置",
				"navigationBarBackgroundColor": "#FFFFFF",
				"navigationBarTextStyle": "black",
				"backgroundColor": "#FFFFFF",
				"enablePullDownRefresh": true
			}
		}
]
````



### （2）路由跳转

> `uni-app` 有两种页面路由跳转方式：使用[navigator](https://uniapp.dcloud.io/component/navigator)组件跳转（标签式导航）、调用[API](https://uniapp.dcloud.io/api/router)跳转（编程式导航）
>
> 框架以栈的形式管理当前所有页面， 当发生路由切换的时候，页面栈的表现如下：

| 路由方式   | 页面栈表现                        | 触发时机                                                     |
| ---------- | --------------------------------- | ------------------------------------------------------------ |
| 初始化     | 新页面入栈                        | uni-app 打开的第一个页面                                     |
| 打开新页面 | 新页面入栈                        | 调用 API  `uni.navigateTo`、<br />使用组件 `<navigator open-type="navigate" />` |
| 页面重定向 | 当前页面出栈，新页面入栈          | 调用 API  [uni.redirectTo](https://uniapp.dcloud.io/api/router?id=redirectto) 、<br />使用组件 |
| 页面返回   | 页面不断出栈，直到目标返回页      | 调用 API  [uni.navigateBack](https://uniapp.dcloud.io/api/router?id=navigateback)  、<br />使用组件 、<br />用户按左上角返回按钮、安卓用户点击物理back按键 |
| Tab 切换   | 页面全部出栈，只留下新的 Tab 页面 | 调用 API  [uni.switchTab](https://uniapp.dcloud.io/api/router?id=switchtab) 、<br />使用组件 、<br />用户切换 Tab |
| 重加载     | 页面全部出栈，只留下新的页面      | 调用 API  [uni.reLaunch](https://uniapp.dcloud.io/api/router?id=relaunch) 、<br />使用组件 |



### （3）获取当前页面栈

> getCurrentPages() 函数用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
>  `注意`： getCurrentPages() 仅用于展示页面栈的情况，请勿修改页面栈，以免造成页面状态错误。
>  每个页面实例的方法属性列表如下：

|         方法          |             描述              | 平台说明 |
| :-------------------: | :---------------------------: | :------: |
| page.$getAppWebview() | 获取当前页面的webview对象实例 |  5+App   |
|      page.route       |      获取当前页面的路由       |    -     |

`uni-app` 在 `getCurrentPages()`获得的页面里内置了一个方法 `$getAppWebview()` 可以获取当前页面的webview对象实例，从而获得 webview 的 style、id等属性，也可设置 webview 的 style。



### （4）路由传参与接收

> 说明：页面生命周期的onLoad(）监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）。如：

- 页面 1 传递参数

```csharp
//页面跳转并传递参数
uni.navigateTo({
    url: 'page2?name=liy&message=Hello'
});
```

> url为将要跳转的页面路径 ，路径后可以带参数。参数与路径之间使用`?`分隔，参数键与参数值用`=`相连，不同参数用`&`分隔。如 'path?key1=value2&key2=value2'，path为下一个页面的路径，下一个页面的onLoad函数可得到传递的参数。

- 页面 2 接收参数

```jsx
onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
        console.log(option.name); //打印出上个页面传递的参数。
        console.log(option.message); //打印出上个页面传递的参数。
    }
```

> `注意`：url有长度限制，太长的字符串会传递失败，可使用[窗体通信](https://links.jianshu.com/go?to=https%3A%2F%2Funiapp.dcloud.io%2Fcollocation%2Fframe%2Fcommunication)、[全局变量](https://links.jianshu.com/go?to=https%3A%2F%2Fask.dcloud.net.cn%2Farticle%2F35021)，或`encodeURIComponent`等多种方式解决。



### （5）小程序路由分包配置

> 因小程序有体积和资源加载限制，各家小程序平台提供了分包方式，优化小程序的下载和启动速度。
>
> 所谓的主包，即放置默认启动页面/TabBar 页面，以及一些所有分包都需用到公共资源/JS 脚本；而分包则是根据pages.json的配置进行划分。
>
> 在小程序启动时，默认会下载主包并启动主包内页面，当用户进入分包内某个页面时，会把对应分包自动下载下来，下载完成后再进行展示。此时终端界面会有等待提示。

`````json
"subPackages": [
  	{
			"root": "news",
			"pages": [{
					"path": "index",
					"style": {
						"navigationBarTitleText": "金迅教育 · 新闻中心",
						"navigationBarBackgroundColor": "#FFFFFF",
						"navigationBarTextStyle": "black",
						"backgroundColor": "#FFFFFF"
					}
				}
			]
		},

		{
			"root": "activities",
			"pages": [{
					"path": "index",
					"style": {
						"navigationStyle": "custom",
						"enablePullDownRefresh": true
					}
				},
				{
					"path": "userList",
					"style": {
						"navigationBarTitleText": "金迅教育 · 活动报名",
						"navigationBarBackgroundColor": "#FFFFFF",
						"navigationBarTextStyle": "black",
						"backgroundColor": "#FFFFFF",
						"enablePullDownRefresh": true
					}
				}
			]
		}
]，
// 预下载分包设置
"preloadRule": {
		"pages/index": {
			"network": "all",
			"packages": ["activities"]
		}
}
`````



## 五、运行环境判断与跨端兼容

### [（1）开发环境和生产环境](https://uniapp.dcloud.io/frame?id=开发环境和生产环境)

> `uni-app` 可通过 `process.env.NODE_ENV` 判断当前环境是开发环境还是生产环境。一般用于连接测试服务器或生产服务器的动态切换。

- 在HBuilderX 中，点击“运行”编译出来的代码是开发环境，点击“发行”编译出来的代码是生产环境

```javascript
if(process.env.NODE_ENV === 'development'){
    console.log('开发环境')
}else{
    console.log('生产环境')
}
```



### [（2）判断平台](https://uniapp.dcloud.io/frame?id=判断平台)

> 平台判断有2种场景，一种是在编译期判断，一种是在运行期判断。

- 编译期判断 编译期判断，即条件编译，不同平台在编译出包后已经是不同的代码。详见：[条件编译](https://uniapp.dcloud.io/platform)

```javascript
// #ifdef H5
    alert("只有h5平台才有alert方法")
// #endif
// 如上代码只会编译到H5的发行包里，其他平台的包不会包含如上代码。
```



- 运行期判断 运行期判断是指代码已经打入包中，仍然需要在运行期判断平台，此时可使用 `uni.getSystemInfoSync().platform` 判断客户端环境是 Android、iOS 还是小程序开发工具（在百度小程序开发工具、微信小程序开发工具、支付宝小程序开发工具中使用 `uni.getSystemInfoSync().platform` 返回值均为 devtools）。

```javascript
switch(uni.getSystemInfoSync().platform){
    case 'android':
       console.log('运行Android上')
       break;
    case 'ios':
       console.log('运行iOS上')
       break;
    default:
       console.log('运行在开发者工具上')
       break;
}
```



### [（3）跨端兼容](https://uniapp.dcloud.io/platform?id=跨端兼容)

> uni-app 已将常用的组件、JS API 封装到框架中，开发者按照 uni-app 规范开发即可保证多平台兼容，大部分业务均可直接满足。但每个平台有自己的一些特性，因此会存在一些无法跨平台的情况。
>
> - 大量写 if else，会造成代码执行性能低下和管理混乱。
> - 编译到不同的工程后二次修改，会让后续升级变的很麻烦。
>
> 在 C 语言中，通过 #ifdef、#ifndef 的方式，为 windows、mac 等不同 os 编译不同的代码。 `uni-app` 参考这个思路，为 `uni-app` 提供了条件编译手段，在一个工程里优雅的完成了平台个性化实现。

> 条件编译是用特殊的注释作为标记，在编译时根据这些特殊的注释，将注释里面的代码编译到不同平台。
>
> **写法：**以 #ifdef 或 #ifndef 加 **%PLATFORM%** 开头，以 #endif 结尾。
>
> - \#ifdef：if defined 仅在某平台存在
> - \#ifndef：if not defined 除了某平台均存在
> - **%PLATFORM%**：平台名称

| 条件编译写法                                             | 说明                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| #ifdef **APP-PLUS** 需条件编译的代码 #endif              | 仅出现在 App 平台下的代码                                    |
| #ifndef **H5** 需条件编译的代码 #endif                   | 除了 H5 平台，其它平台均存在的代码                           |
| #ifdef **H5** \|\| **MP-WEIXIN** 需条件编译的代码 #endif | 在 H5 平台或微信小程序平台存在的代码（这里只有\|\|，不可能出现&&，因为没有交集） |

> **%PLATFORM%** **可取值如下：**

| 值                      | 平台                                                         |
| :---------------------- | :----------------------------------------------------------- |
| APP-PLUS                | App                                                          |
| APP-PLUS-NVUE           | App nvue                                                     |
| H5                      | H5                                                           |
| MP-WEIXIN               | 微信小程序                                                   |
| MP-ALIPAY               | 支付宝小程序                                                 |
| MP-BAIDU                | 百度小程序                                                   |
| MP-TOUTIAO              | 字节跳动小程序                                               |
| MP-QQ                   | QQ小程序                                                     |
| MP-360                  | 360小程序                                                    |
| MP                      | 微信小程序/支付宝小程序/百度小程序/字节跳动小程序/QQ小程序/360小程序 |
| QUICKAPP-WEBVIEW        | 快应用通用(包含联盟、华为)                                   |
| QUICKAPP-WEBVIEW-UNION  | 快应用联盟                                                   |
| QUICKAPP-WEBVIEW-HUAWEI | 快应用华为                                                   |



## 六、UniAPP 常用组件

> uni-app 为开发者提供了一系列基础组件，类似 HTML 里的基础标签元素。
>
> 但 uni-app 的组件与 HTML 不同，而是与小程序相同，更适合手机端使用。
>
> 虽然不推荐使用 HTML 标签，但实际上如果开发者写了`div`等标签，在编译到非H5平台时也会被编译器转换为 `view` 标签，类似的还有 `span` 转 `text`、`a` 转`navigator`等，包括css里的元素选择器也会转。但为了管理方便、策略统一，新写代码时仍然建议使用view等组件。
>
> 开发者可以通过组合这些基础组件进行快速开发。 基于内置的基础组件，可以开发各种扩展组件，组件规范与vue组件相同。

案例准备：知心姐姐聊天系统 -  使用组件完成基础布局功能



## 七、UniAPP 常用 API

> `uni-app`的 js API 由标准 ECMAScript 的 js API 和 uni 扩展 API 这两部分组成。标准 ecmascript 的 API 非常多，比如：console、settimeout等等。
>
> `uni-app`的 js 代码，h5 端运行于浏览器中。非 h5 端，Android 平台运行在 v8 引擎中，iOS 平台运行在 iOS 自带的 jscore 引擎中。
>
> 非 H5 端，虽然不支持 window、document、navigator 等浏览器的 js API，但也支持标准 ECMAScript。
>
> 开发者不要把浏览器里的 js 等价于标准 js。
>
> ECMAScript 由 Ecma 国际管理，是基础 js 语法。浏览器基于标准 js 扩充了window、document 等 js API；Node.js 基于标准 js 扩充了 fs 等模块；小程序也基于标准 js 扩展了各种 wx.xx、my.xx、swan.xx 的 API。
>
> 所以 uni-app 的非 H5 端，一样支持标准 js，支持 if、for 等语法，支持字符串、数组、时间等变量及各种处理方法，仅仅是不支持浏览器专用对象。

案例准备：知心姐姐聊天系统 - 录音发送、图片发送及预览，AI 接口请求反馈功能实现



## 八、UniAPP 自定义组件与通信

> 自定义组件的概念，一般放在 components 中
>
> props 父组件向子组件传递数据
>
> emit 子组件向父组件传递数据
>
> slot 父组件向子组件传递文档结构
>
> v-slot 子组件向父组件传递作用域插槽数据
>
> uni 全局事件数据通信

案例准备：老父亲和两个儿子之间的故事



## 九、uniapp-vuex 状态管理

> **概念**：Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。
>
> **应用场景**：Vue多个组件之间需要共享数据或状态。
>
> Vuex有几个核心概念：State、Getter、Mutation、Action、Module。
>
> - State：存储状态数据
> - Getter：从状态数据派生数据，相当于State的计算属性。
> - Mutation：存储用于同步更改状态数据的方法，默认传入的参数为state。
> - Action：存储用于异步更改状态数据，但不是直接更改，而是通过触发Mutation方法实现，默认参数为context。
> - Module：Vuex模块化。
>
>  它们之间的交互关系如下图：
>
> ![img](https://img2018.cnblogs.com/blog/1681559/201905/1681559-20190529203151920-2123222208.png)

案例准备：用户登录、退出态状态管理



## 十、UniAPP 插件市场及 uView UI 插件库

> uniapp 为开发者提供了相当完善的[插件市场](https://ext.dcloud.net.cn/?cat1=2)以方便用户使用，其中具有代表性的就是：[uView UI](https://uviewui.com/)。
>
> uView UI 是 uni-app 生态最优秀的 UI 框架，全面的组件和便捷的工具会让您信手拈来，如鱼得水，下载地址 -  https://ext.dcloud.net.cn/plugin?id=1593，具体的安装使用步骤如下：
>
> 1. `main.js`引入uView库
>
>    ```js
>    / main.js
>    import uView from 'uview-ui';
>    Vue.use(uView);
>    ```
>
> 2. `App.vue`引入基础样式(注意style标签需声明scss属性支持)
>
>    ```css
>    /* App.vue */
>    <style lang="scss">
>    @import "uview-ui/index.scss";
>    </style>
>    ```
>
> 3. `uni.scss`引入全局scss变量文件
>
>    ```css
>    /* uni.scss */
>    @import "uview-ui/theme.scss";
>    ```
>
> 4. `pages.json`配置easycom规则(按需引入)
>
> ```js
> // pages.json
> {
>     "easycom": {
>         // 下载安装的方式需要前面的"@/"，npm安装的方式无需"@/"
>         // 下载安装方式
>         "^u-(.*)": "@/uview-ui/components/u-$1/u-$1.vue"
>         // npm安装方式
>         // "^u-(.*)": "uview-ui/components/u-$1/u-$1.vue"
>     },
>     // 此为本身已有的内容
>     "pages": [
>         // ......
>     ]
> }
> ```

基础体验：使用 Skeleton 骨架屏组件预显示占位

