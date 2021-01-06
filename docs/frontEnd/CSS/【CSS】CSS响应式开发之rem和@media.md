---
title: 【CSS】CSS响应式开发之rem和@media
date: 2020-12-24
sidebar: auto
categories: 
- 前端
tags: 
- CSS
- 响应式
- 移动端
---

# rem和媒体查询适配方案

## 1.rem & em 介绍

+ 案例：

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="html,result" data-user="keekuun" data-slug-hash="bGbooYr" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-em&amp;amp;rem">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/bGbooYr/">
  CSS3-em&amp;rem</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

+ 理解rem和em

<iframe height="265" style="width: 100%;" scrolling="no" title="CSS3-理解rem和em" src="https://codepen.io/keekuun/embed/pMebBg?height=265&theme-id=light&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/keekuun/pen/pMebBg'>CSS3-理解rem和em</a> by Keekuun
  (<a href='https://codepen.io/keekuun'>@keekuun</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

+ 总结：
	- em 是相对父元素字体大小
	- rem 是相对根元素字体大小(r: root即根元素-html)
	
## 2.流式布局（百分比）的缺点
+ 只能达到宽度的适配
+ 内容没有自适应改变
+ 高度也没有自适应改变

## 3.rem适配方案的优点
+ 达到高度和宽度自适应
+ 内容可自适应
+ 等比缩放

## 4.rem + 流式布局 二者结合
+ 总体布局上面使用百分比
+ 具体内容（如： 文字大小，图片大小等）使用rem

## 5.rem适配不同的设备要点
+ 设计稿基于某一个主流设备，比如：640px或者750px
+ 基准值对应，比如：750px设计稿，假设基准值为100px，即750px设备下html的font-size：100px; 即1rem=100px；
+ 在设计稿psd图量尺寸取得是px，通过基准值转为rem单位
+ 设备的尺寸：320px,360px,384px,400px;414px,480px,540px,640px,720px,750px
+ 每一个设备都有对应的font-size大小
+ 页面所有的px单位要转化为rem单位

例如：
```
@media(min-width: 720px) {
	html {
		font-size: 720 / 750 * 100px;
	}
}
@media(min-width: 750px) {
	html {
		font-size: 100px;
	}
}

。。。
```

探究市场上的设备尺寸：
```
设备尺寸320px,360px,375px,384px,400px;414px,424px,432px,480px,540px,600px,640px,720px,750px,768px,800px,1024px,1280px,1366px,1440px,1500px,1680px,1920px,2560px
```
从移动端到PC端形形色色的设备眼花缭乱，苦的还是web开发人员。。。
想想如果要适配这么多设备，光媒体查询也要写10几种。。。泪目。。。

世上本没有路，走的人多了，便有了路 --- 鲁迅

互联网的世界从来不缺乏解决方案，只要那啥管够... 咳，什么？ 我说的是给我提供双面屏就好！

## 6.使用css预编译语言之less
+ tips:
``` html
<!-- 在head中引入less.min.js可以直接在浏览器中将less编译成css -->
<!-- type="text/less" 不可缺少-->
<link rel="stylesheet" type="text/less" href="less/index.less"> <!-- less文件 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/less.js/3.9.0/less.min.js"></script>
```
1. 初探：
```less
// 1.定义变量
@psdWidth: 750px; // 设计图基准设备尺寸
@baseSize: 100px; // 设计基准
@bs: 100rem; // 带上单位便于运算

// 2.定义函数
.adapterFunc(@deviceWidth: 750px) {
	@media (min-width: @deviceWidth) {
		html {
			font-size: @deviceWidth / @psdWidth * @baseSize;
		}
	}
}

// 3.调用函数
.adapterFunc(320px); // Apple iPhone 5 320 × 568
.adapterFunc(360px); // Google Nexus 5 360 × 640 
.adapterFunc(375px); // Apple iPhone 6 375 × 667 
.adapterFunc(384px); // Google Nexus 4 381x640
.adapterFunc(411px); // Google Nexus 6 411x731
.adapterFunc(414px); // Apple iPhone 6 414x736 
.adapterFunc(432px); // Nokia Lumia 1520 432x768
.adapterFunc(480px); // Amazon Kindle Fire HD 7" 480x800
.adapterFunc(540px);
.adapterFunc(600px);
.adapterFunc(640px);
.adapterFunc(720px); // Microsoft Surface Pro 720x1280
.adapterFunc(768px); // Apple iPad Air 768x1024
.adapterFunc(800px); //  Apple MacBook Air 13.3'' 800 × 1280
.adapterFunc(1024px); // Apple iPad Pro 12.9'' 1024x1366
.adapterFunc(1280px); // Google Chromebook Pixel 1280x850
.adapterFunc(1366px); // 主流设备 1366x768
.adapterFunc(1440px); // Apple MacBook Air 13.3'' 1440x900
.adapterFunc(1500px); // Microsoft Suface Book 1500x1000
.adapterFunc(1680px); // Apple MacBook Pro 15.4'' 1680x1050
.adapterFunc(1920px); // 主流设备 1920x1080
.adapterFunc(2560px); // Apple iMac 2560x1440
```
虽然简化了媒体查询，但还是很繁琐,需要调用十几次。

2. 简化：
```less
/* 
* less内置函数:
* length(@deviceWidthList) 获取数组的长度
* extract(@deviceWidthList, 1) 获取数组第一个元素
**/

// 1.定义变量
@psdWidth: 750px; // 设计图基准设备尺寸
@baseSize: 100px; // 设计基准
@bs: 100rem; // 带上单位便于运算
// 设备尺寸
@deviceWidthList: 320px,360px,375px,384px,400px,414px,424px,432px,480px,540px,600px,640px,720px,750px,768px,800px,1024px,1280px,1366px,1440px,1500px,1680px,1920px,2560px; 

// 2.改进上面的方法：@index-表示数组的序号 when(条件)-当满足条件时才调用
.adapterFunc(@index: 1) when (@index <= length(@deviceWidthList)) {
	@media (min-width: extract(@deviceWidthList, @index)) {
		html {
			font-size: extract(@deviceWidthList, @index) / @psdWidth * @baseSize;
		}
	}
	// 递归调用
	.adapterFunc(@index + 1)
}
// 只需调用一次
.adapterFunc()
```
> 注意数组“@deviceWidthList”中设备尺寸必须按照从小到大排序，否则样式不会生效，会被覆盖。

## 7.使用css预编译语言之scss
```scss
// 1.定义变量
$psdWidth: 750px; // 设计图基准设备尺寸
$baseSize: 100px; // 设计基准
$bs: 100rem; // 带上单位便于运算
// 设备尺寸
$deviceWidthList: 320px, 360px, 375px, 384px, 400px, 414px, 424px, 432px, 480px,
540px, 600px, 640px, 720px, 750px, 768px, 800px, 1024px, 1280px, 1366px, 1440px,
1500px, 1680px, 1920px, 2560px;

// 2.改进上面的方法：
@mixin adapterFunc() {
  @each $deviceWidth in $deviceWidthList {
    @media (min-width: $deviceWidth) {
      html {
        font-size: $deviceWidth / $psdWidth * $baseSize;
      }
    }
  }
}
// 只需调用一次
@include adapterFunc();
```

<iframe height="265" style="width: 100%;" scrolling="no" title="CSS3-使用css预编译语言之scss定义rem适配方案" src="https://codepen.io/keekuun/embed/RwGLOrJ?height=265&theme-id=light&default-tab=css,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/keekuun/pen/RwGLOrJ'>CSS3-使用css预编译语言之scss定义rem适配方案</a> by Keekuun
  (<a href='https://codepen.io/keekuun'>@keekuun</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## 8.移动端适配方案：viewport
+ 伸缩容器的适配：flex
+ 流式布局的适配：百分比
+ 响应式布局：媒体查询（在超小屏幕时使用的还是流式布局）
+ rem适配方式：rem单位用在内容的高宽自适应，一般与流式布局和伸缩布局结合
