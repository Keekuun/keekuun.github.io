---
title: 【CSS】CSS兼容性合集
date: 2020-12-23
sidebar: auto
categories: 
- 前端
tags: 
- CSS
---

# CSS兼容性合集

>为了提高工作效率，不在CSS兼容性上重复走弯路，故记录开发中遇到的CSS兼容性问题

## 1.去除IE Input文本输入框删除图标
```css
input::-ms-clear{display: none;}
```
## 2.去除IE Input密码框小眼睛
```css
input::-ms-reveal{display: none;}
```

## 3.文本溢出处理
### 3.1 -webkit-line-clamp多行文字截断（不兼容IE）
+ 单行文本截断：
<iframe height="265" style="width: 100%;" scrolling="no" title="单行文本截断" src="https://codepen.io/keekuun/embed/gNEJOJ?height=265&theme-id=light&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/keekuun/pen/gNEJOJ'>单行文本截断</a> by Keekuun
  (<a href='https://codepen.io/keekuun'>@keekuun</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

+ 多行文本截断：
<iframe height="265" style="width: 100%;" scrolling="no" title="-webkit-line-clamp多行文字截断" src="https://codepen.io/keekuun/embed/WqmBpx?height=265&theme-id=light&default-tab=css,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/keekuun/pen/WqmBpx'>-webkit-line-clamp多行文字截断</a> by Keekuun
  (<a href='https://codepen.io/keekuun'>@keekuun</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

+ 使用scss定义mixin: 
```scss
// 多行文本省略显示
@mixin multiLineWithDot($lineCount: 1, $lineHeight: 16px) {
 @if $lineCount < 2 {
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
 } @else {
   line-height: $lineHeight;
   height: $lineHeight * $lineCount;
   overflow: hidden;
   display: -webkit-box;
   text-overflow: ellipsis;
   -webkit-box-orient: vertical;
   -webkit-line-clamp: $lineCount;
 }
}

//使用：
.text-overflow-ellipsis {
 max-width: 120px;
 @include multiLineWithDot(1);
}
```
### 3.2 定位元素实现多行文本截断：
<iframe height="265" style="width: 100%;" scrolling="no" title="定位元素实现多行文本截断" src="https://codepen.io/keekuun/embed/EBMzLp?height=265&theme-id=light&default-tab=css,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/keekuun/pen/EBMzLp'>定位元素实现多行文本截断</a> by Keekuun
  (<a href='https://codepen.io/keekuun'>@keekuun</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### 3.3 float特性实现多行文本截断：
<iframe height="265" style="width: 100%;" scrolling="no" title="float特性实现多行文本截断" src="https://codepen.io/keekuun/embed/OeqYaN?height=265&theme-id=light&default-tab=css,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/keekuun/pen/OeqYaN'>float特性实现多行文本截断</a> by Keekuun
  (<a href='https://codepen.io/keekuun'>@keekuun</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## 4.解决inline元素之间的空白
<iframe height="265" style="width: 100%;" scrolling="no" title="CSS3-解决inline元素之间的空白" src="https://codepen.io/keekuun/embed/gOORJNV?height=265&theme-id=light&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/keekuun/pen/gOORJNV'>CSS3-解决inline元素之间的空白</a> by Keekuun
  (<a href='https://codepen.io/keekuun'>@keekuun</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## 5.input框placeholder样式
```css
  ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    font-size: 14px;
    color: #999;
  }

  ::-moz-placeholder { /* Mozilla Firefox */
    font-size: 14px;
    color: #999;
  }
  :-ms-input-placeholder { /* Internet Explorer 10-11 */
    font-size: 14px;
    color: #999;
  }
```

## 6.自定义滚动条样式scrollbar
```scss
.my-scroll,
.my-scroll * {
	//滚动条样式（只适用于chrome浏览器）
	&::-webkit-scrollbar {
		/* 滚动条整体样式 */
		width: 10px;
		padding-right: 6px;
		border-radius: 5px;
	}

	&::-webkit-scrollbar-track {
		/* 滚动条里面轨道 */
		background-color: #f1f1f1;
		border-radius: 5px;
	}

	&::-webkit-scrollbar-thumb {
		/* 滚动条里面小方块 */
		background: #d2d2d2;
		border-radius: 5px;
	}
}
```

<iframe height="265" style="width: 100%;" scrolling="no" title="CSS3-chrome浏览器滚动条样式" src="https://codepen.io/keekuun/embed/yLyXjrb?height=265&theme-id=light&default-tab=css,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/keekuun/pen/yLyXjrb'>CSS3-chrome浏览器滚动条样式</a> by Keekuun
  (<a href='https://codepen.io/keekuun'>@keekuun</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## 7.video录频有噪音怎么处理？
[`muted`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video): 布尔属性，指明了视频里的音频的默认设置。设置后，**音频会初始化为静音**。默认值是false,意味着视频播放的时候音频也会播放 。
```html
<video 
        src="videofile.ogg"
        poster="posterimage.jpg"
        autoplay
<!--        禁止播放-->
        muted
        controls 
>
  抱歉，您的浏览器不支持内嵌视频，不过不用担心，你可以 <a href="videofile.ogg">下载</a>
  并用你喜欢的播放器观看!
</video>
```
