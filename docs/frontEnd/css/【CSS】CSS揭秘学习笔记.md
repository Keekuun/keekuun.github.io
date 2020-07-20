---
title: 【CSS】CSS揭秘学习笔记
date: 2020-7-14
categories: 
- 前端
tags: 
- CSS
---
# CSS揭秘学习笔记

## 一、序言

### 1.工具函数

原文：

```js
function $$(selector, context) {
	context = context || document;
	var elements = context.querySelectorAll(selector);
	return Array.prototype.slice.call(elements);
}
```

ES6：

```js
function $$(selector, context=document) {
    if(!context.querySelectorAll) throw new Error(`${context} does not have 'querySelectorAll' methods in its prototype`);
    return Array.from(context.querySelectorAll(selector));
}
```

### 2.规范文档

[CSS 背景与边框](http://w3.org/TR/css-backgrounds)

 [选择符](http://w3.org/TR/selectors)

 [可缩放矢量图形（SVG）](http://w3.org/TR/SVG)



 [CSS 语法](http://w3.org/TR/css-syntax-3)

 [CSS 层叠与继承](http://w3.org/TR/css-cascade-3)

 [CSS 颜色](http://w3.org/TR/css3-color)

 [选择符](http://w3.org/TR/selectors)

 [CSS 背景与边框](http://w3.org/TR/css3-background)

 [CSS 值与单位](http://w3.org/TR/css-values-3)

 [CSS 文本排版](http://w3.org/TR/css-text-3)

 [CSS 文本装饰效果](http://w3.org/TR/css-text-decor-3)

 [CSS 字体](http://w3.org/TR/css3-fonts)

 [CSS 基本 UI 特性](http://w3.org/TR/css3-ui)



 [CSS 变形](http://w3.org/TR/css-transforms-1)

 [图像混合效果](http://w3.org/TR/compositing-1)

 [滤镜效果](http://w3.org/TR/filter-effects-1)

 [CSS 遮罩](http://w3.org/TR/css-masking-1)

 [CSS 伸缩盒布局](http://w3.org/TR/css-flexbox-1)

 [CSS 网格布局](http://w3.org/TR/css-grid-1)

## 二、背景与边框

### 1.半透明边框

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="QWyVaQy" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-半透明边框">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/QWyVaQy">
  CSS3-半透明边框</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
### 2.多重边框

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="GRoBaGr" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-多重边框">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/GRoBaGr">
  CSS3-多重边框</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
### 3.背景定位

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="ExPpzBx" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-背景定位">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/ExPpzBx">
  CSS3-背景定位</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
### 4.边框内圆角

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="rNxrExB" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-边框内圆角">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/rNxrExB">
  CSS3-边框内圆角</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
### 5.条纹背景

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="NWxBVXw" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-条纹背景">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/NWxBVXw">
  CSS3-条纹背景</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
### 6.网格背景

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="dyGqJeg" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-网格背景">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/dyGqJeg">
  CSS3-网格背景</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
<iframe src="https://bennettfeely.com/gradients/" height="600px"></iframe>
> https://bennettfeely.com/gradients/

### 7.伪随机背景

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="wvMEyoo" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-伪随机背景">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/wvMEyoo">
  CSS3-伪随机背景</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
### 8.图像边框

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="mdVGxGx" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-图像边框">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/mdVGxGx">
  CSS3-图像边框</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 三、各种形状

### 1.自适应椭圆

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="css,result" data-user="keekuun" data-slug-hash="RwrePzR" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-自适应椭圆">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/RwrePzR">
  CSS3-自适应椭圆</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 2.平行四边形

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="css,result" data-user="keekuun" data-slug-hash="KKVGpOe" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-平行四边形">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/KKVGpOe">
  CSS3-平行四边形</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 3.菱形图片

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="keekuun" data-slug-hash="jOWebbK" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-菱形图片">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/jOWebbK">
  CSS3-菱形图片</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 4.切角效果

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="wvMYGNe" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-切角效果">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/wvMYGNe">
  CSS3-切角效果</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 5.梯形标签页

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="GRoYwVQ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-梯形标签页">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/GRoYwVQ">
  CSS3-梯形标签页</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

> [外圆角选项卡](https://www.zhangxinxu.com/study/201903/css-idea/shape-hollow.php?aside=0&kind=3)

### 6.简单的饼图

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="eYJPxdG" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-简单的饼图">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/eYJPxdG">
  CSS3-简单的饼图</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

SVG：

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="ZEQVzJK" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-简单的饼图（SVG）">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/ZEQVzJK">
  CSS3-简单的饼图（SVG）</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 四、视觉效果

> [CSS创意与视觉表现](https://www.zhangxinxu.com/study/201903/css-idea/)

### 1. 单侧投影

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="pogqzdN" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-单侧投影">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/pogqzdN">
  CSS3-单侧投影</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 2.不规则投影（滤镜）

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="wvMRaaL" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-不规则投影（滤镜）">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/wvMRaaL">
  CSS3-不规则投影（滤镜）</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 3.染色效果

+ 滤镜实现：

  > [纯CSS图片滤镜项目CSSgram简介](https://www.zhangxinxu.com/wordpress/2019/06/css-filters-cssgram/)
  >
  > [CSS filter滤镜任意色值转换工具](https://we-blog.gitee.io/fe/colorz/)

  <p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="QWyzGBE" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-染色效果（滤镜）">
    <span>See the Pen <a href="https://codepen.io/keekuun/pen/QWyzGBE">
    CSS3-染色效果（滤镜）</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
    on <a href="https://codepen.io">CodePen</a>.</span>
  </p>
  <script async src="https://static.codepen.io/assets/embed/ei.js"></script>

+ 混合模式实现

  > [深入理解CSS mix-blend-mode滤色screen混合模式](https://www.zhangxinxu.com/wordpress/2019/05/css-mix-blend-mode-screen/)

  <p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="ExPGNOL" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-染色效果（混合模式）">
    <span>See the Pen <a href="https://codepen.io/keekuun/pen/ExPGNOL">
    CSS3-染色效果（混合模式）</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
    on <a href="https://codepen.io">CodePen</a>.</span>
  </p>
  <script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 4.毛玻璃效果

### 5.折角效果