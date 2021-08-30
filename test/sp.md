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

### 2.1删除链表的第 k 个节点

```js
function ListNode(val) {
    this.val = val;
    this.next = null;
}

function removeKthNodeFromStart(root, k) {
    if (!root || k <= 0) return root;

    if (k === 1) {
        return root.next
    }

    // 处理 K >= 2
    // 获取链表长度
    let len = 1;
    let head = root;
    while (head.next) {
        head = head.next;
        len++;
    }

    // k比len大
    if (k > len) {
        return root;
    }

    // k <= len
    let cur = root;
    while (k > 2) {
        cur = cur.next;
        k--;
    }

    cur.next = cur.next.next;

    return root;
}

function generateLinkedListFromArr(arr) {
    let pre = new ListNode();
    let node = pre;
    for (let n of arr) {
        node.next = new ListNode(n);
        node = node.next;
    }
    this.root = pre.next;
    return pre.next;
}

function printNodeList(root) {
    let str = '';
    let cur = root;
    while (cur) {
        str += cur.val + '>';
        cur = cur.next;
    }

    return str;
}
```

### 2.2.删除链表的倒数第 k 个节点

```js
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function (head, n) {
        let dummy = new ListNode();
        dummy.next = head;
        let slow = dummy;
        let fast = dummy;

        while (n > 0) {
            fast = fast.next;
            n--;
        }

        while (fast && fast.next) {
            fast = fast.next;
            slow = slow.next;
        }

        slow.next = slow.next.next;

        return dummy.next;
    };
```

### 3.1手写 Function.prototype.bind

```js
Function.prototype._bind = function (context, ...args) {
    let that = this;
    return function (..._args) {
        // return that.apply(context, [...args, ..._args])
        return that.call(context, ...args, ..._args)
    }
}
```

### 3.2手写 Function.prototype.call

```js
Function.prototype._call = function (context, ...args) {
    context = context || window;

    let fn = Symbol('fn');
    context[fn] = this;
    let result = context[fn](...args);
    // Reflect.deleteProperty(context, fn);
    delete context[fn]
    return result;
}
```

### 3.3手写 Function.prototype.apply

```js
Function.prototype._apply = function (context, ...args) {
    context = context || window;

    let fn = Symbol('fn');
    context[fn] = this;
    const result = context[fn](args);

    delete context[fn];
    return result;
}
```

### 4.手写 instanceof(a, b)

instanceof 运算符用于测试构造函数的 prototype 属性是否出现在对象原型链中的任何位置

首先 instanceof 左侧必须是对象, 才能找到它的原型链

instanceof 右侧必须是函数, 函数才会有prototype属性

迭代 , 左侧对象的原型不等于右侧的 prototype时, 沿着原型链重新赋值左侧

```js
function _instanceof(left, right) {
    if (!left || !right) return false;

    let R = right.prototype;
    while (true) {
        if (left === null) {
            return false;
        } else if (left.__proto__ === R) {
            return true;
        } else {
            left = left.__proto__
        }
    }
}
```

### 5.实现大数相加： add('294732947329847328947328947382', '11') // 返回'294732947329847328947328947393'

```js
function add(a, b) {
    let lena = a.trim().length;
    let lenb = b.trim().length;

    if (!lena || !lenb) return a.trim() || b.trim();

    let max = lena > lenb ? lena : lenb;
    
    a = a.trim().padStart(max, 0);
    b = b.trim().padStart(max, 0);
    
    let ans = '';
    let sum = 0;
    let carry = 0;
    
    // 从右往左
    for(let i=max-1; i>=0; i--) {
        sum = (+a[i]) + (+b[i]) + carry;
        if(sum >= 10) {
            carry = ~~(sum/10);
            sum = sum % 10;
        }
        
        ans = sum + ans;
        sum = 0;
    }
    
    if(carry) {
        ans = carry + ans;
    }
    
    return ans;
}
```

### 6.解释浏览器缓存
![](https://img-blog.csdn.net/20180603154502698)

**缓存位置**：
- Memory Cache 内存缓存，效率最快
- Disk Cache 磁盘缓存
- Push Cache 推送缓存（HTTP/2）

- Service Worker Cache
Service Worker 借鉴了 Web Worker的 思路，即让 JS 运行在主线程之外，由于它脱离了浏览器的窗体，因此无法直接访问`DOM`。虽然如此，但它仍然能帮助我们完成很多有用的功能，比如`离线缓存`、`消息推送`和`网络代理`等功能。其中的`离线缓存`就是 **Service Worker Cache**。

Service Worker 同时也是 PWA 的重要实现机制

**缓存机制**

1.强缓存

+ expires: http1.0 关键字

    Expires = 时间，HTTP 1.0 版本，缓存的载止时间，允许客户端在这个时间之前不去检查（发请求），Expires 的一个缺点就是，返回的到期时间是服务器端的时间，这样存在一个问题，如果客户端的时间与服务器的时间相差很大，那么误差就很大，所以在HTTP 1.1版开始，使用Cache-Control: max-age=秒替代。

+ cache-control: http1.1关键字（优先级更高）

  + public：表明其他用户也可以利用缓存。（允许代理服务器）
  + private：表明缓存服务器只对特定用户提供资源缓存的服务，对于其他的用户，缓存服务器不会做出响应。（不允许代理服务器）
  + no-cache：表明不缓存过期资源，其实是为了防止拿到过期的资源，**进入协商缓存**。
  + no-store：暗示请求或响应中包含机密信息，是**真正的禁用缓存**。
  + max-age：max-age = 秒，HTTP 1.1版本，资源在本地缓存多少**秒**。

> 如果max-age和Expires同时存在，Cache-Control的max-age优先。

2.协商缓存

+ last-modified: http1.0, 值为GMT时间, 和 if-modified-since 配合使用

    当第一次请求资源时，源服务器响应后返回last-modified值和响应内容，客户端会将响应内容和last-modified一起缓存在本地，第二次请求时会将请求体连同**if-modified-since**（等于last-modified的值）一起发送给服务端，服务端会根据if-modified-since判定资源是否改变，如果没有改变会**响应304**返回一个空的响应体，如果资源改变返回新的内容。

+ etag: http1.1, 值为文件的hash值，和 if-none-match 配合使用

    根据实体内容生成一段hash字符串，标识资源的状态，由服务端产生，资源改变这个值就会改变个人感觉类似于资源的一种抽象映射。请求过程类似于last-modified，不过它作为if-none-match（服务端响应的etag）发送给服务端判断这个值是否与服务端的etag一致看资源是否改变。

**为什么有了last-modified还要有etag？**

+ 某些服务器不能精确得到资源的最后修改时间，这样就无法通过最后修改时间判断资源是否更新

+ 如果资源修改非常频繁，在秒以下的时间内进行修改，而Last-modified只能精确到秒

+ 一些资源的最后修改时间改变了，但是内容没改变，使用ETag就认为资源还是没有修改的


### 7.网络分层，知道多少？ 解释 https / TCP ，自己知道多深说多深

### 8.跨域的方案解释一遍 （CORS, POST Massage, jsonP, 反向代理

### 9.解释简单请求和非简单请求？ 跨域如何带上cookie？
+ 简单请求

不会触发CORS预检的请求称为简单请求，满足以下所有条件的才会被视为简单请求，基本上我们日常开发只会关注前面两点(一般满足前两大条件，就属于简单请求:)

1.使用GET、POST、HEAD其中一种方法
2.只使用了如下的安全首部字段，不得人为设置其他首部字段：
  + Accept
  + Accept-Language
  + Content-Language
  + Content-Type 仅限以下三种
    + text/plain
    + multipart/form-data
    + application/x-www-form-urlencoded
  + HTML头部header field字段：DPR、Download、Save-Data、Viewport-Width、WIdth
  + 请求中的任意XMLHttpRequestUpload 对象均没有注册任何事件监听器；XMLHttpRequestUpload 对象可以使用 XMLHttpRequest.upload 属性访问
  + 请求中没有使用 ReadableStream 对象
  
+ 非简单请求

满足下列之一，就为非简单请求：

1.请求方式：PUT、DELETE

2.自定义头部字段

3.发送json格式数据

4.正式通信之前，浏览器会先发送OPTION请求，进行预检，这一次的请求称为“预检请求”

5.服务器成功响应预检请求后，才会发送真正的请求，并且携带真实数据

> 规范要求，对那些可能对服务器数据产生副作用的 HTTP 请求方法（特别是 GET 以外的 HTTP 请求，或者搭配某些 MIME 类型的 POST 请求），浏览器必须首先使用 OPTIONS 方法发起一个预检请求（preflight request），从而获知服务端是否允许该跨域请求。
>

+ 跨域cookie携带
  
一般来说，对于跨站请求，浏览器是不会发送凭证（HTTP Cookies和验证信息）的。如果要发送带凭证的信息，只需要给XMLHttpRequest设置一个特殊的属性withCredentials = true，通过这种方式，浏览器就允许发送凭证信息。

![](https://user-images.githubusercontent.com/25027560/50205881-c409b080-03a4-11e9-8a57-a2a6d0e1d879.png)

> + [CORS-跨域资源共享笔记](https://github.com/Git-News/Git-News/issues/26)
> + [CORS 简单请求+预检请求（彻底理解跨域）](https://github.com/amandakelake/blog/issues/62)

### 10.React 事件系统理解

+ react的所有事件都挂载在document中
+ 当真实dom触发后冒泡到document后才会对react事件进行处理
+ 所以原生的事件会先执行
+ 然后执行react合成事件
+ 最后执行真正在document上挂载的事件

> +[react独特的事件机制（react-events）](https://blog.csdn.net/fesfsefgs/article/details/108102356?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7Edefault-5.essearch_pc_relevant&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7Edefault-5.essearch_pc_relevant)

> +[一文吃透 react 事件机制原理](https://blog.csdn.net/zz_jesse/article/details/101048417?utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7Edefault-1.essearch_pc_relevant&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7Edefault-1.essearch_pc_relevant)

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
            // 1.加了这个之后会怎么样 ？ 
            // e.stopPropagation()
        })

        document.addEventListener('click', (e) => {
            console.log('document');
        })
    }

    childClick = (e) => {
        console.log('react child')
        // 2.加了这个之后又会怎么样 ？ 
        // e.stopPropagation()
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

+ 不加任何'e.stopPropagation()'，打印结果：
```
"addEventListener child"
"addEventListener parent"
"onClick child"
"onClick parent"
"document"
```

+ A.在this.child.addEventListener中加入'e.stopPropagation()'，打印结果：
```
"addEventListener child"
```

+ B.在childClick中加入'e.stopPropagation()'，打印结果：(和不加一样)
```
"addEventListener child"
"addEventListener parent"
"onClick child"
"onClick parent"
"document"
```

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="mdwVrZN" data-preview="true" data-editable="true" data-user="keekuun" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/keekuun/pen/mdwVrZN">
  React 测试e.stopPropagation()</a> by Keekuun (<a href="https://codepen.io/keekuun">@keekuun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

> +[React 阻止事件冒泡失效](https://blog.csdn.net/dKnightL/article/details/99844659)

### 12. React.useEffect 和 useLayoutEffect 的执行顺序
```jsx
function Demo() {
	const [count, setCount] = React.useState(0);

	React.useEffect(() => {
		console.log("useEffect");

		return () => {
			console.log("useEffect return");
		};
	});

	React.useLayoutEffect(() => {
		console.log("useLayoutEffect");
		return () => {
			console.log("useLayoutEffect return");
		};
	});

	const add = () => {
		const n = count + 1;
		setCount(n);
	};

	console.log('render');
	return (
		<Button type="primary" onClick={add}>
			{count}
		</Button>
	);
}
```
输出结果：
```
"render"
"useLayoutEffect return"
"useLayoutEffect"
"useEffect return"
"useEffect"
```

### 12.1useEffect 和 useLayoutEffect 的区别？
useEffect 在渲染时是异步执行，并且要等到浏览器将所有变化渲染到屏幕后才会被执行。

useLayoutEffect 在渲染时是同步执行，其执行时机与 componentDidMount，componentDidUpdate 一致

### 12.2 对于 useEffect 和 useLayoutEffect 哪一个与 componentDidMount，componentDidUpdate 的是等价的？
useLayoutEffect，因为从源码中调用的位置来看，useLayoutEffect的 create 函数的调用位置、时机都和 componentDidMount，componentDidUpdate 一致，且都是被 React 同步调用，都会阻塞浏览器渲染。

### 12.3 useEffect 和 useLayoutEffect 哪一个与 componentWillUnmount 的是等价的？
同上，useLayoutEffect 的 destroy 函数的调用位置、时机与 componentWillUnmount 一致，且都是同步调用。useEffect 的 destroy 函数从调用时机上来看，更像是 componentDidUnmount (注意React 中并没有这个生命周期函数)。

### 12.4 为什么建议将修改 DOM 的操作里放到 useLayoutEffect 里，而不是 useEffect？
当DOM 已经被修改时，此时浏览器渲染线程依旧处于被阻塞阶段，所以还没有发生回流、重绘过程。由于内存中的 DOM 已经被修改，通过 useLayoutEffect 可以拿到最新的 DOM 节点，并且在此时对 DOM 进行样式上的修改，假设修改了元素的 height，这些修改会和 react 做出的更改一起被一次性渲染到屏幕上，依旧只有一次回流、重绘的代价。

如果放在 useEffect 里，useEffect 的函数会在组件渲染到屏幕之后执行，此时对 DOM 进行修改，会触发浏览器再次进行回流、重绘，增加了性能上的损耗。

> +[深入理解 React useLayoutEffect 和 useEffect 的执行时机](https://blog.csdn.net/yunfeihe233/article/details/106616674/)


### 13.解释箭头函数 和 this 指向

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

## 测试题二

### 1.http 302 301 307 的区别

### 2.301 和 302 哪个对 seo 更友好（301）

### 3.跨域是什么、如何解决

### 4.jsonp 有什么缺点

### 5.base64和外链的应用场景，各自的优缺点

### 6.http缓存机制

### 7.https 的握手过程

### 8.set/map 的区别

### 9.hook 的局限性

### 10.setState 和 hook 的区别

### 11.decorator 的作用，编译后是什么样子的

### 12.symbol 是什么，一般用来做什么

### 13.csrf 是什么，如何防范

### 14.sql注入是什么，如何防范

### 15.react 调用 setState 之后发生什么

### 16.nodejs 事件循环机制

### 17.pm2原理，有哪些模式（cluster fork）

### 18.docker 和 k8s 有了解多少

### 19. 移动端一个元素的拖动，如何实现和优化（节流，改变位置）

### 20. for in / for of 看代码输出

### 21.描述链表的反转如何实现，复杂度多少

### 22.实现 instanceof

### 23.实现一个对象被 for of 遍历

### 24.实现链表的添加、删除。复杂度是多少

### 25.给两段效果上都可以实现继承的代码，说出差异

\```js

function child() {}

function parent() {}

child.prototype.__proto__ = parent.prototype

child.prototype = new parent()

\```

### 26.this 输出问题

### 27.如何监听 html 外链资源加载失败

### 28.Mutation Observer、Intersection Observer 使用场景

### 29. 127.0.0.1 和 0.0.0.0 差别（一个只能通过 localhost ，另一个可以通过本机 ip 或者 localhost 都可以）

### 30.利用 Promise js sleep 函数实现

### 31.jsx 转换后是什么样子的

### 32.redux compose 函数是做什么的，中间件呢

### 33.redux-sage 是什么，和 redux-thunk 有什么区别

### 34.dva 了解吗

### 35.umi.js 有用过吗

### 36.req.pipe(res)

### 37.stream 如何处理数据消费和数据生产的速率不一致问题

### 38.writeable stream drain 事件是做什么的（这是和一个控制读写速率有关的事件）

## 测试题三

\- 说出打印结果

### 1.手写原型链继承

### 2.实例属性和原型属性的区别

### 4.instanceof 的原理

### 5.浏览器缓存

### 6.Service Worker 大小大概是30Gb，如果用户硬盘没有那么大怎么办

### 7.Service Worker 的大小和强缓存、协商缓存的大小是一起计算的还是分开计算

### 8.Push Cache 的具体处理方式

### 9.HTTP2 的优缺点

### 10.HTTP2 有没有可能比 HTTP1 还要更慢

### 11.var、let、const 的区别

### 12.说出打印结果

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

### 13.webpack常用插件

### 14.如果有一个工程打包特别大，如何进行优化

### 15.cjs 和 esm 模块化的区别

### 16. es6+ 有哪些新的语法

### 17.跨域解决方案

### 18.说一下 CORS 中的预请求

### 19.xss 和 csrf

### 20.用户信息存储的方式

### 21.React 性能优化的方式

### 22. 实现一个节流函数
要求初次执行的时候立刻执行

### 23.说出以下代码的输出

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

### 24. let a = "abc"，解释器在解释在这句话的过程中，内存发生的变化，比如内存放在哪里，申请了多大的内存

### 25.介绍一下 esm 和 cjs 的差异

### 26.介绍一下前端安全问题

### 27.假设有一个页面需要实现下拉无限滚动加载，如何实现和优化

### 28.实现如下这样的函数
\```js

*// 实现如下这样的函数`f()`，要求调用深度不限。(考察点：对 JS 对象化的理解)*

*// f(1).val === 1*

*// f(1)(2).val === 3*

*// f(1)(2)(3).val === 6*

*// f(10)(100)(1000)(10000).val === 11110*

*// f(a0)(a1)(a2)...(an).val === a0 + a1 + a2 +...+ an*

\```

> +[面试回顾(高频问题点)](https://github.com/zhaofeihao/no-cross-no-crown/issues/34)