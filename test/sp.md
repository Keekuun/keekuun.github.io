## 测试题一

### 1.写一个空间复杂度为 O(1)的快速排序

```js
// 非原地排序算法 Time O(nlog(n))  Space O(1)
function quickSort(arr) {
    if (arr.length < 2) return arr;

    let pivot = arr.pop();
    let left = [], right = [];

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i])
        } else {
            right.push(arr[i])
        }
    }

    return [...quickSort(left), pivot, ...quickSort(right)]
}
```

```js
// 原地排序算法 Time O(nlog(n)) Space O(1)
function quickSort(arr) {
    function sort(arr, left, right) {
        if (left >= right) return;

        // 一次快排
        // const index = partition1(arr, left, right);
        // const index = partition2(arr, left, right);

        // 切分 [left, right] = [left, index - 1] + [index] + [index + 1, right]
        // sort(arr, left, index - 1);  // 将左半部分arr[left .. index-1]排序
        // sort(arr, index + 1, right); // 将左半部分arr[index+1.. right]排序

        // 三路快排
        const {lt, gt} = partition3(arr, left, right);
        sort(arr, left, lt - 1);
        sort(arr, gt + 1, right);
    }

    /**
     * 排序关键:切分
     * 1.对于某个 index，arr[index] 已经排定；
     * 2.arr[left] 到 arr[index-1] 中的所有元素都不大于 arr[index]；
     * 3.arr[index+1] 到 arr[right] 中的所有元素都不小于 arr[index]。
     * */
    // 1.左右双指针法
    function partition1(arr, begin, end) {
        // 基准数据
        let pivot = arr[end];
        let left = begin;
        let right = end;
        while (left < right) {
            // 从前向后扫描,直到找到一个大于pivot的值
            while (left < right && arr[left] <= pivot) {
                left++;
            }
            // 从后往前扫描，直到找到一个小于pivot的值
            while (left < right && arr[right] >= pivot) {
                right--;
            }
            // 然后交换
            if (left < right) {
                [arr[left], arr[right]] = [arr[right], arr[left]]
            }
        }

        // 此时left >= right，一趟快速排序完成，这时将arr[end]和array[left]的值进行一次交换。
        [arr[left], arr[end]] = [arr[end], arr[left]]
        return left;
    }

    // 2.挖坑法
    function partition2(arr, begin, end) {
        let pivot = arr[end];
        let left = begin;
        let right = end;

        while (left < right) {
            while (left < right && arr[left] <= pivot) {
                left++
            }
            arr[right] = arr[left];
            while (left < right && arr[right] >= pivot) {
                right--
            }
            arr[left] = arr[right];
        }
        arr[right] = pivot;
        return right;
    }

    // 3.三路快排
    function partition3(arr, begin, end) {
        let pivot = arr[begin];
        let lt = begin;
        let i = begin + 1;
        let gt = end;

        while (i <= gt) {
            if (arr[i] < pivot) {
                [arr[i], arr[lt]] = [arr[lt], arr[i]];
                i++;
                lt++;
            } else if (arr[i] > pivot) {
                [arr[i], arr[gt]] = [arr[gt], arr[i]];
                gt--;
            } else {
                i++;
            }
        }
        // 现在 arr[left..lt-1] < pivot = arr[lt..gt] < arr[gt+1..right]成立
        return {lt, gt}
    }

    sort(arr, 0, arr.length - 1)
    return arr;
}
```

### 2.手写 删除链表的第 k 个节点

### 3.手写 Funtion.prototype.bind

### 4.手写 instanceof(a, b)

### 5.实现大数相加： add('294732947329847328947328947382', '11') // 返回'294732947329847328947328947393'

### 6.解释浏览器缓存

### 7.网络分层，知道多少？ 解释 https / TCP ，自己知道多深说多深

### 8.跨域的方案解释一遍 （CORS, POST Massage, jsonP, 反向代理

### 9.解释简单请求和非简单请求？ 跨域如何带上cookie？

### 10.React 事件系统理解，尽量多看一些文章去理解透彻

### 11.React事件阻止冒泡

```jsx
import React from 'react';

class Demo extends React.Component {
    componentDidMount() {
        this.parent.addEventListener('click', (e) => {
            console.log('dom parent');
        })

        this.child.addEventListener('click', (e) => {
            console.log('dom child');
            // 1.加了这个之后会怎么样 ？ e.stopPropagation()
        })

        document.addEventListener('click', (e) => {
            console.log('document');
        })
    }

    childClick = (e) => {
        console.log('react child')
        // 2.加了这个之后又会怎么样 ？ e.stopPropagation()*
    }

    parentClick = (e) => {
        console.log('react parent');
    }

    render() {
        return (
            <div onClick={this.parentClick} ref={ref => this.parent = ref}>
                <div onClick={this.childClick} ref={ref => this.child = ref}>
                    test
                </div>
            </div>
        )
    }
}
```

\- React.useEffect 和 useLayoutEffect 的执行顺序

\```js

const App = () => {

const [count, setCount] = React.useState(0);

React.useLayoutEffect(() => {

console.log('1')

​

return () => {

console.log('2')

}

}, [count])

React.useEffect(() => {

console.log('3')

​

return () => {

console.log('4')

}

}, [count]);

return (

      <div onClick={() => setCount(2)}>{count}</div>

);

}

ReactDOM.render(<App/>, document.getElementById('app'));

\```

// 顺序应该是 2 => 1 => 画面变成2 => 4 => 3

\#### 二面

\- 解释箭头函数 和 this 指向

\```js

var a = 99

var obj = {

a: 1024,

say: () => console.log(this.a)

}

obj.say() *// 打印的是？*

obj.say.apply({a: 8989}) *// 打印的是 ？*

考察类型转化

var obj = {a：1}

var foo = {}

foo[obj] = true

Object.keys(foo) *// 返回的是什么？*

\```

接着吹项目，吹比。。。。 40分钟完事

### undefined

\#### 一面

\- http 302 301 307 的区别

\- 301 和 302 哪个对 seo 更友好（301）

\- 跨域是什么、如何解决

\- jsonp 有什么缺点

\- base64和外链的应用场景，各自的优缺点

\- http缓存机制

\- https 的握手过程

\- set/map 的区别

\- hook 的局限性

\- setState 和 hook 的区别

\- decorator 的作用，编译后是什么样子的

\- symbol 是什么，一般用来做什么

\- csrf 是什么，如何防范

\- sql注入是什么，如何防范

\- react 调用 setState 之后发生什么

\- nodejs 事件循环机制

\- pm2原理，有哪些模式（cluster fork）

\- docker 和 k8s 有了解多少

\- 移动端一个元素的拖动，如何实现和优化（节流，改变位置）

\- for in / for of 看代码输出

\- 描述链表的反转如何实现，复杂度多少

\- 实现 instanceof

\- 实现一个对象被 for of 遍历

\- 实现链表的添加、删除。复杂度是多少

\#### 二面

\- 给两段效果上都可以实现继承的代码，说出差异

\```js

function child() {}

function parent() {}

child.prototype.__proto__ = parent.prototype

child.prototype = new parent()

\```

\- this 输出问题

\- 如何监听 html 外链资源加载失败

\- Mutation Observer、Intersection Observer 使用场景

\- 127.0.0.1 和 0.0.0.0 差别（一个只能通过 localhost ，另一个可以通过本机 ip 或者 localhost 都可以）

\- 利用 Promise js sleep 函数实现

\- jsx 转换后是什么样子的

\- redux compose 函数是做什么的，中间件呢

\- redux-sage 是什么，和 redux-thunk 有什么区别

\- dva 了解吗

\- umi.js 有用过吗

\- req.pipe(res)

\- stream 如何处理数据消费和数据生产的速率不一致问题

\- writeable stream drain 事件是做什么的（这是和一个控制读写速率有关的事件）

### undefined

\#### 一面

\- 说出打印结果

\- 手写原型链继承

\- 实例属性和原型属性的区别

\- instancef 的原理

\- 浏览器缓存

\- Service Worker 大小大概是30Gb，如果用户硬盘没有那么大怎么办

\- Service Worker 的大小和强缓存、协商缓存的大小是一起计算的还是分开计算

\- Push Cache 的具体处理方式

\- HTTP2 的优缺点

\- HTTP2 有没有可能比 HTTP1 还要更慢

\- var、let、const 的区别

\- 说出打印结果

\```js

*// 任务*

*// 面试官提出的问题将出现在这里。*

​

*// 写出下面这段代码打印的结果*

async function async1() {

console.log('async1 start');

await async2();

console.log('async1 end');

}

​

async function async2() {

console.log('async2 start');

}

​

console.log('script start');

​

setTimeout(function() {

console.log('setTimeout');

}, 0);

​

async1();

​

new Promise(function(*resolve*) {

console.log('promise1');

resolve();

}).then(function() {

console.log('promise2');

}).then(function() {

console.log('promise3');

});

​

console.log('script end');

\```

\- webpack

常用插件

\- 如果有一个工程打包特别大，如何进行优化

\- cjs 和 esm 模块化的区别

\- es6+ 有哪些新的语法

\- 跨域解决方案

\- 说一下 CORS 中的预请求

\- xss 和 csrf

\- 用户信息存储的方式

\- React 性能优化的方式

\- 实现一个节流函数

要求初次执行的时候立刻执行

\#### 二面

\- 自我介绍

\- 介绍一下你们的组件库

\- 有哪个组件最让你印象深刻

\- 这个组件的原理介绍一下

\- 这个组件有做兼容性处理吗

\- 说出以下代码的输出

\```html

<body>

  <div id="box">


<a href="javascript:console.log(1)" id="anchor">Click</a>

  </div>

</body>

\```

\```js

var box = document.getElementById('box')

var anchor = document.getElementById('anchor')

anchor.addEventListener('click', function() {

console.log(2)

})

box.addEventListener('click', function() {

console.log(3)

}, true)

box.addEventListener('click', function() {

console.log(4)

})

\```

\- let a = "abc"，解释器在解释在这句话的过程中，内存发生的变化，比如内存放在哪里，申请了多大的内存

\- 介绍一下 esm 和 cjs 的差异

\- 介绍一下前端安全问题

\- 假设有一个页面需要实现下拉无限滚动加载，如何实现和优化

\- 笔试题

\```js

*// 实现如下这样的函数`f()`，要求调用深度不限。(考察点：对 JS 对象化的理解)*

*// f(1).val === 1*

*// f(1)(2).val === 3*

*// f(1)(2)(3).val === 6*

*// f(10)(100)(1000)(10000).val === 11110*

*// f(a0)(a1)(a2)...(an).val === a0 + a1 + a2 +...+ an*

\```