---
title: 【Vue】Vue使用Animate动画库
sidebar: auto
date: 2019-7-18
isComment: true
categories: 
- 前端
- Vue
tags: 
- JS
- Vue
---

### 1. [Demo1](https://codepen.io/keekuun/pen/xvKOLp)：使用`Vue`组件`transition`并自定义简单动画
+ 1.创建Vue实例
```vue
const vm = new Vue({
	data: {
		msg: '赤橙黄绿青蓝紫',
		flag: true,
	},
	methods: {
		// 定义动画生命周期钩子对应执行函数
		beforeEnter(el) {
			console.log('动画进入之前！');
			this.msg = "赤";
			el.style.background = 'red';
		},
		enter(el) {
			console.log('动画进入！');
			this.msg = "橙";
			el.style.background = 'orange';
		},
		afterEnter(el) {
			console.log('动画进入之后！');
			this.msg = "黄";
			el.style.background = 'yellow';
		},
		beforeLeave(el) {
			console.log('动画离开之前！');
			this.msg = "绿";
			el.style.background = 'green';
		},
		leave(el) {
			console.log('动画离开！');
			this.msg = "青";
			el.style.background = 'cyan';
		},
		afterLeave(el) {
			console.log('动画离开之后！');
			this.msg = "蓝";
			el.style.background = 'blue';
}
	}
}).$mount('#app'); 
```
# 2.在`html`中将需要加动画的元素放在`transiton`标签中,并且给该标签定义一个`name`属性
```html
<div id="app" class="container text-center">
	<button @click="flag=!flag" class="btn btn-warning">展示动画效果</button>

	<!-- 	transition生命周期钩子 -->
	<transition name="v"
							@before-enter="beforeEnter" 
							@enter="enter" 
							@after-enter="afterEnter" 
							@before-leave="beforeLeave" 
							@leave="leave" 
							@after-leave="afterLeave">
		<!-- <transition>标签有name属性，在设置css时，要加上'.name属性值-。。。' -->
		<!-- 必须将需要动画操作的元素放在<transiton>标签里面 -->
		<p v-show="flag" class="h3 text-muted">{{msg}}</p>
	</transition>
</div>
```

+ 3.定义`CSS`动画，使用特殊的类名
```css3
/* 定义动画：.name属性-。。。*/
.v-enter-active,
.v-leave-active {
	transition: all 3s ease;
}

.v-enter-active {
	opacity: 1;
	width: 200px;
	height: 200px;
}

.v-leave-active {
	opacity: .5;
	width: 50px;
	height: 50px;
}

/* .-enter需要放在.-enter-active的后面 */
.v-enter {
	opacity: .5;
	width: 50px;
	height: 50px;
}
```
查看代码效果：[Demo1](https://codepen.io/keekuun/pen/xvKOLp)
>这里的`v-...`中的`v`即`<transition name="v"`里面的`name`属性值。

> Learn More：
[官方：Vue内置组件-transition](https://cn.vuejs.org/v2/api/#transition)
[官方：进入/离开 & 列表过渡](https://cn.vuejs.org/v2/guide/transitions.html)


### 2. [Demo2](https://codepen.io/keekuun/pen/VoZPzG?editors=1010)：使用`Vue`组件`transition`并结合第三方库[Animate.css](https://daneden.github.io/animate.css/)
![Demo2](https://upload-images.jianshu.io/upload_images/16584865-b57578aefbab3eab.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
+ 引入[Animate.css](https://daneden.github.io/animate.css/)
```
 npm install animate.css --save
// 或者：
<head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css">
</head>
```
+ 在html中使用
```html
<div class="animation" v-for="(value, index) in animations">
		<div class="wrap"> 
<!-- 			div.wrap使这一块区域形成BFC，与其他区域互不影响。 -->
			<transition :enter-active-class="'animated delay-1s ' + value" :leave-active-class="'animated ' + value">
			<p v-show="flags[index].show" :style="{background: colors[index % colors.length]}" @mouseenter="enter(index)" @mouseout="out(index)" :title="value">{{value}}</p>
		</transition>
	</div>
```
查看代码及效果： [Demo2](https://codepen.io/keekuun/pen/VoZPzG?editors=1010)

### 3.遇到的坑
+ 1.在`Vue`中，使用`v-show`绑定数组中的value，修改数组的值之后，页面并不会实时渲染。
解决方式：
1.将数组值存在数组对象中（Demo2使用此方式解决）
2.使用`Vue.$set`方法。

问题原因详细解释：
1. [vue中遇到的坑 --- 变化检测问题（数组相关）](https://www.cnblogs.com/zhuzhenwei918/p/6893496.html)

2. [官方解释:深入响应式原理]([https://cn.vuejs.org/v2/guide/reactivity.html](https://cn.vuejs.org/v2/guide/reactivity.html)
)

+  2.使用`Animate.css`在`chrome浏览中没有动画效果:
[https://stackoverflow.com/questions/56022493/animate-css-is-not-working-in-chrome-latest-versionversion-above-73](https://stackoverflow.com/questions/56022493/animate-css-is-not-working-in-chrome-latest-versionversion-above-73)

解决方式：
+ 1.`win + R`
+ 2.Enter: `%windir%\system32\SystemPropertiesPerformance.exe`
+ 3.选中第一行,确认
`让Windows选择计算机的最佳设置`
（Let Windows choose what's best for my computer）
