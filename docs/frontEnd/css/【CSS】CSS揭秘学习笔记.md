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

 + [CSS 背景与边框](http://w3.org/TR/css-backgrounds)

 + [选择符](http://w3.org/TR/selectors)

 + [可缩放矢量图形（SVG）](http://w3.org/TR/SVG)

 + [CSS 语法](http://w3.org/TR/css-syntax-3)

 + [CSS 层叠与继承](http://w3.org/TR/css-cascade-3)

 + [CSS 颜色](http://w3.org/TR/css3-color)

 + [选择符](http://w3.org/TR/selectors)

 + [CSS 背景与边框](http://w3.org/TR/css3-background)

 + [CSS 值与单位](http://w3.org/TR/css-values-3)

 + [CSS 文本排版](http://w3.org/TR/css-text-3)

 + [CSS 文本装饰效果](http://w3.org/TR/css-text-decor-3)

 + [CSS 字体](http://w3.org/TR/css3-fonts)

 + [CSS 基本 UI 特性](http://w3.org/TR/css3-ui)

 + [CSS 变形](http://w3.org/TR/css-transforms-1)

 + [图像混合效果](http://w3.org/TR/compositing-1)

 + [滤镜效果](http://w3.org/TR/filter-effects-1)

 + [CSS 遮罩](http://w3.org/TR/css-masking-1)

 + [CSS 伸缩盒布局](http://w3.org/TR/css-flexbox-1)

 + [CSS 网格布局](http://w3.org/TR/css-grid-1)

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

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="css,result" data-user="keekuun" data-slug-hash="KKVbPvg" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-简单的饼图（SVG）">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/KKVbPvg">
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

### 4.毛玻璃效果（filter：blur）

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="mdVaLgK" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-毛玻璃效果(filter:blur)">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/mdVaLgK">
  CSS3-毛玻璃效果(filter:blur)</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 5.折角效果

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="xxVGYXL" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-折角效果">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/xxVGYXL">
  CSS3-折角效果</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 五、字体排版

### 1.连字符断行

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="JjXdpVv" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-连字符断行">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/JjXdpVv">
  CSS3-连字符断行</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 2. 插入换行

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="GRZJxaj" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-插入换行">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/GRZJxaj">
  CSS3-插入换行</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 3.文本行的斑马条纹

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="XWdbqrO" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-文本行的斑马条纹">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/XWdbqrO">
  CSS3-文本行的斑马条纹</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 4.调整tab的宽度

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="LYNVmEY" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-调整Tab的宽度">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/LYNVmEY">
  CSS3-调整Tab的宽度</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 5.连字

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="LYNVmpE" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-连字">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/LYNVmpE">
  CSS3-连字</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 6.华丽的&符号

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="VwaLxja" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-华丽的&amp;amp;符号">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/VwaLxja">
  CSS3-华丽的&amp;符号</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 7.自定义下划线

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="XWdbqRL" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-自定义下划线">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/XWdbqRL">
  CSS3-自定义下划线</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 8.现实中的文字效果

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="WNwvJLY" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-现实中的文字效果">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/WNwvJLY">
  CSS3-现实中的文字效果</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 9.环形文字

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="WNwvJVP" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-环形文字">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/WNwvJVP">
  CSS3-环形文字</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 六、用户体验

### 1.选择合适的鼠标光标

```scss
// 提示禁用状态
:disabled, [disabled], [aria-disabled="true"] {
	cursor: not-allowed;
}

// 隐藏鼠标光标
video {
	cursor: url('transparent.gif');
	cursor: none;
}
```

### 2.扩大可点击区域

```scss
button {
    position: relative;
    /* [其余样式] */
}
// 向外扩张了10px
button::before {
	content: '';
	position: absolute;
	top: -10px; 
    right: -10px;
	bottom: -10px; 
    left: -10px;
}
```

### 3.自定义复选框

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="jOqbPgW" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-自定义复选框">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/jOqbPgW">
  CSS3-自定义复选框</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 4.通过阴影来弱化背景

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="RwaWWom" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-通过阴影来弱化背景">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/RwaWWom">
  CSS3-通过阴影来弱化背景</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 5.通过模糊来弱化背景

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="keekuun" data-slug-hash="QWNjjOd" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-通过模糊来弱化背景">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/QWNjjOd">
  CSS3-通过模糊来弱化背景</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 6.滚动提示

> https://www.zhangxinxu.com/wordpress/2019/06/better-css-scroll-indicator/

+ 简单效果

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="MWyaypY" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-滚动提示">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/MWyaypY">
  CSS3-滚动提示</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

+ 背景渐变效果

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="keekuun" data-slug-hash="RwaWdbe" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-滚动提示（背景渐变）">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/RwaWdbe">
  CSS3-滚动提示（背景渐变）</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

+ 滚动条效果

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="keekuun" data-slug-hash="QWNjoWw" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-滚动提示（滚动条）">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/QWNjoWw">
  CSS3-滚动提示（滚动条）</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 7.交互式的图片对比控件

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="KKzdERW" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-图片对比（纯CSS控件）">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/KKzdERW">
  CSS3-图片对比（纯CSS控件）</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="yLOYwmp" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-图片对比（range控件）">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/yLOYwmp">
  CSS3-图片对比（range控件）</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 七、结构和布局

### 1.自适应内部元素

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="xxVZOma" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-自适应内部元素">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/xxVZOma">
  CSS3-自适应内部元素</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 2.精确控制表格列宽

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="keekuun" data-slug-hash="YzqwdZK" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-精确控制表格列宽">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/YzqwdZK">
  CSS3-精确控制表格列宽</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 3.根据兄弟元素的数量设置样式

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="LYNGMzK" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-根据兄弟元素的数量设置样式">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/LYNGMzK">
  CSS3-根据兄弟元素的数量设置样式</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="poygqQK" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-根据兄弟元素的数量设置样式（二）">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/poygqQK">
  CSS3-根据兄弟元素的数量设置样式（二）</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 4.满幅的背景、定宽的内容

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="RwarEdG" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-满幅的背景、定宽的内容">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/RwarEdG">
  CSS3-满幅的背景、定宽的内容</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 5.水平垂直居中

> https://www.jianshu.com/p/c78fa42e6e78

+ 基于绝对定位的解决方案

```scss
main {
    position: absolute;
    top: 50%;
    left:50%;
    margin-top: -5em;  // height的一半
    margin-left: -3em; // width的一半
    width: 6em;
    height: 10em;
}
```

```scss
main {
    position: absolute;
    top: calc(50% - 5em);
    left:calc(50% - 3em);
    width: 6em;
    height: 10em;
}
```

```scss
main {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
```

+ 基于视口(模态框的定位方式)

```scss
main {
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -3em; /* 6/2 = 3 */
	margin-left: -9em; /* 18/2 = 9 */
	width: 18em;
	height: 6em;
}
```

```scss
main {
	width: 18em;
	padding: 1em 1.5em;
	margin: 50vh auto 0;
	transform: translateY(-50%);
}
```

+ 基于 Flexbox

```scss
body {
	display: flex;
	min-height: 100vh;
	margin: 0;
}
main {
	margin: auto;
}
```

```scss
main {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 18em;
	height: 10em;
}
```

### 6.紧贴底部的页角

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="keekuun" data-slug-hash="YzqrygB" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-紧贴底部的页角（粘连定位）">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/YzqrygB">
  CSS3-紧贴底部的页角（粘连定位）</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 八、过渡与动画

### 1.缓动效果

+ 弹跳动画

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="keekuun" data-slug-hash="YzqrygB" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-紧贴底部的页角（粘连定位）">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/YzqrygB">
  CSS3-紧贴底部的页角（粘连定位）</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

+ 弹性过渡

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="PoNJZqq" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-动画-缓动效果-弹性过渡">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/PoNJZqq">
  CSS3-动画-缓动效果-弹性过渡</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 2.逐帧效果

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="MWyEKmQ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-动画-逐帧动画-loading">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/MWyEKmQ">
  CSS3-动画-逐帧动画-loading</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 3.闪动效果

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="XWdeXzP" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-动画-闪烁效果">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/XWdeXzP">
  CSS3-动画-闪烁效果</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 4.打字动画

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="xxVXZWB" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-动画-打字效果">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/xxVXZWB">
  CSS3-动画-打字效果</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 5.状态平滑的动画

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="xxVXZje" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-动画-状态平滑">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/xxVXZje">
  CSS3-动画-状态平滑</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 6.沿环形路径平移的动画

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="BaKwjqR" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3动画-圆形转动1">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/BaKwjqR">
  CSS3动画-圆形转动1</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="keekuun" data-slug-hash="QWNqyVO" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS3-动画-圆形转动2">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/QWNqyVO">
  CSS3-动画-圆形转动2</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

> “ transform-origin 只是一个语法糖而已。实际上你总是可以用translate() 来代替它。”	——Aryeh Gregor

每个 transform-origin 都是可以被两个translate() 模拟出来的。比如，下面两段代码实际上是等效的：

```css
div {
    transform: rotate(30deg);
	transform-origin: 200px 300px;
}

div {
    transform: translate(200px, 300px) rotate(30deg) translate(-200px, -300px);
    transform-origin: 0 0;
}
```

