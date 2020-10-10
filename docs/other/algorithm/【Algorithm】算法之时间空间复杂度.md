---

title: 【Algorithm】数据结构和算法学习笔记
date: 2020-6-18
categories: 
- 算法
tags: 
- Algorithm
---

# 数据结构和算法学习笔记

**掌握数据结构和算法，不管对于阅读框架源码，还是理解其背后的设计思想，都是非常有用的。**

![](../../../images/algorithm/MorphingShapes_615x400.gif)

## 一、数据结构和算法

从广义上讲，**数据结构**就是指一组**数据的存储结构**。**算法**就是**操作数据**的一组方法。

从狭义上讲，是指某些著名的数据结构和算法，比如队列、栈、堆、二分查找、动态规划等。

数据结构是为算法服务的，算法要作用在特定的数据结构之上。

## 二、时间空间复杂度

> 复杂度分析是整个算法学习的精髓，只要掌握了它，数据结构和算法的内容基本上就掌握了一半。

### 1. 时间复杂度——大O表示法

![](https://pic4.zhimg.com/80/v2-7e3d504db660e31ba1b932ace381840f_720w.jpg)

> [图：从经典算法题看时间复杂度](https://zhuanlan.zhihu.com/p/73731500)
>
> [如何理解算法时间复杂度的表示法，例如 O(n²)、O(n)、O(1)、O(nlogn) 等？](https://www.zhihu.com/question/21387264)

算法的**时间复杂度**（Time complexity）是一个**函数**，用于定性描述算法的运行时间。一般我们我们评估一个算法都是直接评估它的**最坏的复杂度**。

```js
function sumN(n) {
    let sum = 0;
    let i=1;
    for(;i<=n;i++) {
        sum += i;
    }
    return sum;
}
```

假设每行代码执行的时间都一样为K，那么总时间：T(n) = (2 + n + n)*K = f(n) * K，即所有代码的执行时间 T(n) 与每行代码的执行次数n成正比。我们可以把这个规律总结成一个公式：

```
T(n) = O(f(n))

T(n) - 代码执行的时间
n - 数据规模的大小
f(n) - 每行代码执行的次数总和
O - 表示代码的执行时间 T(n) 与 f(n) 表达式成正比
```

### 2.时间复杂度分析

+ 只关注循环执行次数最多的一段代码
+ 加法法则：总复杂度等于量级最大的那段代码的复杂度
+ 乘法法则：嵌套代码的复杂度等于嵌套内外代码复杂度的乘积

  大 O 这种复杂度表示方法只是表示一种变化趋势。我们通常会忽略掉公式中的常量、低阶、系数，只需要记录一个**最大阶的量级**就可以了。所以，我们在分析一个算法、一段代码的时间复杂度的时候，也只关注循环执行次数最多的那一段代码就可以了。这段核心代码执行次数的 n 的量级，就是整段要分析代码的时间复杂度。

即时间复杂度分析只需要关注复杂度量级最高的那部分即可。

### 3. 常见时间复杂度

> [维基百科：时间复杂度](https://zh.wikipedia.org/wiki/%E6%97%B6%E9%97%B4%E5%A4%8D%E6%9D%82%E5%BA%A6)

| 度量级     | 大 *O* 表示                                          |
| ---------- | ---------------------------------------------------- |
| 常量阶     | ![O(1)](https://juejin.im/equation?tex=O(1))         |
| 对数阶     | ![O(logN)](https://juejin.im/equation?tex=O(logN))   |
| 线性阶     | ![O(N)](https://juejin.im/equation?tex=O(N))         |
| 线性对数阶 | ![O(NlogN)](https://juejin.im/equation?tex=O(NlogN)) |
| 平方阶     | ![O(N^2)](https://juejin.im/equation?tex=O(N%5E2))   |
| 立方阶     | ![O(N^3)](https://juejin.im/equation?tex=O(N%5E3))   |
| 指数阶     | ![O(2^n)](https://juejin.im/equation?tex=O(2%5En))   |
| 阶乘阶     | ![O(N!)](https://juejin.im/equation?tex=O(N!))       |

一般情况下，只要算法中不存在循环语句、递归语句，即使有成千上万行的代码，其时间复杂度也是Ο(1)。

在对数阶时间复杂度的表示方法里，我们忽略对数的“底”，统一表示为 O(logn)

### 4.空间复杂度分析

时间复杂度的全称是渐进时间复杂度，表示算法的执行时间与数据规模之间的增长关系。

类比一下，空间复杂度全称就是渐进空间复杂度（asymptotic space complexity），表示算法的存储空间与数据规模之间的增长关系。

常见的空间复杂度就是 O(1)、O(n)、O(n )，像 O(logn)、O(nlogn) 这样的对数阶复杂度平时都用不到。而且，空间复杂度分析比时间复杂度分析要简单很多。

### 5.最好、最坏、平均、均摊时间复杂度

分析下面函数的时间复杂度：

```js
function find(arr, x) {
    let i=0;
    let index = -1;
    let len = arr.length;
    for(;i<len;i++) {
        if(arr[i]===x) {
            index = i;
        }
    }
    return pos;
}
```

这段代码要实现的功能是，在一个无序的数组（array）中，查找变量x 出现的位置。如果没有找到，就返回 -1。这段代码的复杂度是 O(n)，其中，n 代表数组的长度。

我们在数组中查找一个数据，并不需要每次都把整个数组都遍历一遍，因为有可能中途找到就可以提前结束循环了。但是，这段代码写得不够高效。我们可以这样优化一下这段查找代码:

```js {8}
function find(arr, x) {
    let i=0;
    let index = -1;
    let len = arr.length;
    for(;i<len;i++) {
        if(arr[i]===x) {
            index = i;
            break;
        }
    }
    return pos;
}
```

因为，要查找的变量 x 可能出现在数组的任意位置。如果数组中第一个元素正好是要查找的变量 x，那就不需要继续遍历剩下的 n-1 个数据了，那时间复杂度就是 O(1)。但如果数组中不存在变量 x，那我们就需要把整个数组都遍历一遍，时间复杂度就成了 O(n)。所以，不同的情况下，这段代码的时间复杂度是不一样的。

+ **最好情况时间复杂度**（best case time complexity）：在最理想的情况下，执行这段代码的时间复杂度

+ **最坏情况时间复杂度**（worst case time complexity）：在最糟糕的情况下，执行这段代码的时间复杂度

+ **平均情况时间复杂度**（average case time complexity）：加权平均时间复杂度或者期望时间复杂度（与概率相关）

+ **均摊时间复杂度**（amortized time complexity）：均摊时间复杂度就是一种特殊的平均时间复杂度

## 三、数组

> 数组访问速度快

数组（Array）是一种线性表数据结构。它用一组连续的内存空间，来存储一组具有相同类型的数据。它具有连续的内存空间，可以进行“**随机访问**”。但有利就有弊，比如要想在数组中删除、插入一个数据，为了保证连续性，就需要做大量的数据搬移工作。

**线性表**（Linear List）。顾名思义，线性表就是数据排成像一条线一样的结构。每个线性表上的数据最多只有前和后两个方向。其实除了数组，链表、队列、栈等也是线性表结构。

![Linear List](../../../images/algorithm/linear-list.png)

**非线性表**，比如二叉树、堆、图等。之所以叫非线性，是因为，在非线性表中，数据之间并不是简单的前后关系。

![No Linear List](../../../images/algorithm/no-linear-list.png)

一般认为：“链表适合插入、删除，时间复杂度 O(1)；数组适合查找，查找时间复杂度为O(1)”。

这种表述是不准确的，数组是适合查找操作，但是查找的时间复杂度并不为O(1)。即便是排好序的数组，你用二分查找，时间复杂度也是 O(logn)。所以，正确的表述应该是，数组支持随机访问，根据下标随机访问的时间复杂度为 O(1)。

## 四、[链表](https://leetcode-cn.com/tag/linked-list/)

> 插入和删除速度快

数组需要一块连续的内存空间来存储，对内存的要求比较高。

链表恰恰相反，它并不需要一块连续的内存空间，它通过“指针”将一组零散的内存块串联起来使用。

![](../../../images/algorithm/array-linklist.png)



链表通过指针将一组零散的内存块串联在一起。其中，我们把内存块称为链表的“结点”。为了将所有的结点串起来，每个链表的结点除了存储数据之外，还需要记录链上的下一个结点的地址。如图所示，我们把这个记录下个结点地址的指针叫作**后继指针next**。

习惯性地把第一个结点叫作**头结点**，把最后一个结点叫作**尾结点**。其中，**头结点用来记录链表的基地址**。有了它，我们就可以遍历得到整条链表。而尾结点特殊的地方是：指针不是指向下一个结点，而是指向一个空地址 NULL，表示这是链表上最后一个结点。

与数组一样，链表也支持数据的查找、插入和删除操作，而且很高效：

![](../../../images/algorithm/insert-remove-link.png)

链表随机访问的性能没有数组好，需要 O(n) 的时间复杂度。因为链表中的数据并非连续存储的，所以无法像数组那样，根据首地址和下标，通过寻址公式就能直接计算出对应的内存地址，而是需要根据指针一个结点一个结点地依次遍历，直到找到相应的结点。

最常见的链表结构，它们分别是：单链表、双向链表和循环链表。

### 1.单链表

![](../../../images/algorithm/single-link-list.png)

### 2.循环链表

循环链表是一种特殊的单链表。实际上，循环链表也很简单。它跟单链表唯一的区别就在尾结点。

我们知道，单链表的尾结点指针指向空地址，表示这就是最后的结点了。而循环链表的尾结点指针是指向链表的头结点。从循环链表图中，你应该可以看出来，它像一个环一样首尾相连，所以叫作“循环”链表。

![](../../../images/algorithm/cycle-link-list.png)

和单链表相比，循环链表的优点是从链尾到链头比较方便。当要处理的数据具有环型结构特点时，就特别适合采用循环链表。比如著名的[约瑟夫问题](https://www.nowcoder.com/questionTerminal/41c399fdb6004b31a6cbb047c641ed8a)。尽管用单链表也可以实现，但是用循环链表实现的话，代码就会简洁很多。

### 3.双向链表

单向链表只有一个方向，结点只有一个后继指针 next 指向后面的结点。而双向链表，顾名思义，它支持两个方向，每个结点不止有一个后继指针 next 指向后面的结点，还有一个前驱指针 prev 指向前面的结点。

![](../../../images/algorithm/double-link-list.png)

从图中可以看出，双向链表需要额外的两个空间来存储**后继结点**和**前驱结点**的地址。所以，如果存储同样多的数据，双向链表要比单链表占用更多的内存空间。虽然两个指针比较浪费存储空间，但可以支持双向遍历，这样也带来了双向链表操作的灵活性。

从结构上来看，双向链表可以支持 O(1) 时间复杂度的情况下找到前驱结点，正是这样的特点，也使双向链表在某些情况下的插入、删除等操作都要比单链表简单、高效。

### 4.双向循环链表

![](../../../images/algorithm/double-cycle-link.png)

### 5.数组VS链表

| 时间复杂度 | 数组 | 链表 |
| ---------- | ---- | ---- |
| 插入删除   | O(n) | O(1) |
| 随机访问   | O(1) | O(n) |

### 6.JS实现链表

#### 6.1 单链表

单链表中的节点应该具有两个属性：val 和 next。val 是当前节点的值，next 是指向下一个节点的指针/引用。如果要使用双向链表，则还需要一个属性 prev 以指示链表中的上一个节点。

```js
// 定义节点类
class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}
// 定义链表类
class LinkedList {
    constructor(){
        this.head = null;
        this.length = 0;
    }
    append(val) {}
    insert(position,val) {}
    indexOf(val){}
    removeAt(position){}
    isEmpty(){}
    size(){}
    toString(){}
    getHead(){}
    getTail(){}
}
```



需要实现的方法：

+ [x] `append(element)` ：向列表尾部添加一个新的项。
+ [x] insert(position, val) ：向列表的特定位置插入一个新的项。
+ [x] `remove(val)` ：从列表中移除一项。
+ [x] `indexOf(val)` ：返回元素在列表中的索引。如果列表中没有该元素则返回 -1 。
+ [x] `removeAt(position)` ：从列表的特定位置（从0开始，0表示第一个元素）移除一项。
+ [x] `isEmpty()` ：如果链表中不包含任何元素，返回 true ，如果链表长度大于0则返回 false 。
+ [x] `size()` ：返回链表包含的元素个数。与数组的 length 属性类似。
+ [x] `toString()` ：由于列表项使用了 Node 类，就需要重写继承自JavaScript对象默认的toString 方法，让其只输出元素的值。
+ [x] `getHead()` ：获取head
+ [ ] `getTail()`：获取tail

```js
// 定义节点类
class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}
// 定义链表类
class LinkedList {
    constructor(){
        this.head = null;
        this.length = 0;
    }
    
    // 向链表尾部追加元素
    append(val) {
        let node = new Node(val);
        let current = null;
        if(this.head === null) {
            // 链表中第一个节点
            this.head = node;
        } else {
            current = this.head;
            // 循环列表，直到找到最后一项
            while(current.next) {
                current = current.next;
            }
            //找到最后一项，将其next赋为node，建立链接
            current.next = node;
        }
        return ++this.length;
    }
    // 从链表中移除第几个元素
    removeAt(position) {
        // 检查越界值
        if(position > -1 && position < this.length) {
            let current = this.head;
            let previous = null;
            // 移除第一项
            if(position === 0) {
                this.head = current.next;
            } else {
                // 从head顺延找到目标
                while(position--) {
                   previous = current;
                   current = current.next;
                }
                // 将previous与current的下一项链接起来：跳过current，从而移除它
                previous.next = current.next
            }
            // 更新size
            this.length--;
            return current.val;
        } else {
            return null;
        }
    }
    // 向列表的任意位置插入一个新的项
    insert(position, val) {
        // 检查越界值
        if(position >= 0 && position <= this.length) {
            let node = new Node(val);
            let current = this.head;
            let previous = null;
            
            // 在第一个位置添加
            if(position === 0) {
                node.next = current;
                this.head = node;
            } else {
                // 在其他位置添加
                while(--position) {
                    previous = current;
                    current = current.next;
                }
                
                node.next = current;
                previous.next = node;
            }
            this.length++;
            return true;
        } else {
           // 更新size
            return false;
        }
    }
    // toString 方法会把 LinkedList 对象转换成一个字符串
    toString() {
        let current = this.head;
        let str = current ? current.val : '';
        while(current && current.next) {
            current = current.next;
            str += '->' + current.val;
        }
        return str;
    }
    
    // indexOf 方法接收一个元素的值，如果在列表中找到它，就返回元素的位置，否则返回 -1 
    indexOf(val) {
        let current = this.head;
        let index = 0;
        while(current) {
            if(val === current.val) {
                return index;
            }
            current = current.next;
            index++;
        }
        return -1;
    }
    // remove删除一个指定的元素值
    remove(val) {
        let index = this.indexOf(val);
        return this.removeAt(index);
    }
    
    // isEmpty判空
    isEmpty() {
        return this.length === 0;
    }
    // size返回长度
    size() {
        return this.length;
    }
    // getHead获取head
    getHead(){
        return this.head;
    }
}
```

测试一波：

```js
let lk = new LinkedList();
lk.append(1); // 1
lk.append(2); // 2
lk.insert(0,0); // true
lk.toString(); // '0->1->2'
lk.getHead(); // Node {val: 0, next: Node}
lk.size(); // 3
lk.isEmpty(); // false

lk.indexOf(0); // 0
lk.indexOf(4); // -1

lk.remove(0);
lk.toString(); // '1->2'

```

#### 6.2 双向链表

双向链表和普通链表的区别在于，在链表中，一个节点只有链向下一个节点的链接，而在双向链表中，链接是双向的：一个链向下一个元素，另一个链向前一个元素。

```js
// 定义节点类
class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
        // 增加prev
        this.prev = null;
    }
}
// 定义链表类
class DoubleLinkedList {
    constructor(){
        this.head = null;
        // 增加tail
        this.tail = null;
        this.length = 0;
    }
    
    // 向链表尾部追加元素
    append(val) {
        let node = new Node(val);
        let current = null;
        if(this.head === null) {
            // 链表中第一个节点
            this.head = node;
            // 新增
            this.tail = node;
        } else {
            //找到最后一项，将其next赋为node，建立链接
            current = this.tail;
            current.next = node;
            node.prev = current;
            this.tail = node;
        }
        return ++this.length;
    }
    // 从链表中移除第几个元素
    removeAt(position) {
        // 检查越界值
        if(position > -1 && position < this.length) {
            let current = this.head;
            let previous = null;
            // 移除第一项
            if(position === 0) {
                this.head = current.next;
                //如果只有一项，更新tail //新增的
                if(this.length===1) {
                    this.tail = null;
                } else {
                    this.head.prev = null;
                }
                //最后一项 //新增的
            } else if(position === this.length -1) {
                current = this.tail;
                this.tail = current.prev;
                this.tail.next = null;
            } else {
                // 从head顺延找到目标
                while(--position) {
                   previous = current;
                   current = current.next;
                }
                // 将previous与current的下一项链接起来：跳过current，从而移除它
                previous.next = current.next;
                current.next.prev = previous; //新增的
            }
            // 更新size
            this.length--;
            return current.val;
        } else {
            return null;
        }
    }
    // 向列表的任意位置插入一个新的项
    insert(position, val) {
        // 检查越界值
        if(position > -1 && position <= this.length) {
            let node = new Node(val);
            let current = this.head;
            let previous = null;
            
            // 在第一个位置添加
            if(position === 0) {
            	if (!this.head){ //新增的
				  this.head = node;
				  this.tail = node;
                } else {
                    node.next = current;
                    current.prev = node;//新增的
                	this.head = node;
                }
                
            } else if (position === length) {
                current = this.tail;
                current.next = node;
                node.prev = current;
                this.tail = node;
            } else {
                // 在其他位置添加
                while(position--) {
                    previous = current;
                    current = current.next;
                }
                
                node.next = current;
                previous.next = node;
                // 新增的
                current.prev = node;
                node.prev = previous;
            }
            this.length++;
            return true;
        } else {
           // 更新size
            return false;
        }
    }
    // toString 方法会把 LinkedList 对象转换成一个字符串
    toString() {
        let current = this.head; // 有可能为null
        let str = current ? current.val : '';
        while(current && current.next) {
            current = current.next;
            str += '->' + current.val;
        }
        return str;
    }
    
    // indexOf 方法接收一个元素的值，如果在列表中找到它，就返回元素的位置，否则返回 -1 
    indexOf(val) {
        let current = this.head;
        let index = 0;
        while(current) {
            if(val === current.val) {
                return index;
            }
            current = current.next;
            index++;
        }
        return -1;
    }
    // remove删除一个指定的元素值
    remove(val) {
        let index = this.indexOf(val);
        return this.removeAt(index);
    }
    
    // isEmpty判空
    isEmpty() {
        return this.length === 0;
    }
    // size返回长度
    size() {
        return this.length;
    }
    // getHead获取head
    getHead(){
        return this.head;
    }
    // getTail获取tail
    getTail(){
        return this.tail;
    }
}
```

## 五、[栈](https://leetcode-cn.com/tag/stack/)

### 1.栈的引出：如何实现浏览器的前进和后退功能？

浏览器的前进、后退功能，我想你肯定很熟悉吧？

假设你是 Chrome 浏览器的开发工程师，你会如何实现这个功能呢？

—— 使用栈来实现：

我们使用两个栈，X 和 Y，我们把首次浏览的页面依次压入栈 X，当点击后退按钮时，再依
次从栈 X 中出栈，并将出栈的数据依次放入栈 Y。当我们点击前进按钮时，我们依次从栈Y 中取出数据，放入栈 X 中。当栈 X 中没有数据时，那就说明没有页面可以继续后退浏览了。当栈 Y 中没有数据，那就说明没有页面可以点击前进按钮浏览了。

### 2.如何理解“栈”？

一般会把队列和栈放一起比较，前者先进先出（FIFO），后者先进后出（LIFO）。

![](https://pic.leetcode-cn.com/691e2a8cca120acb18e77379c7cd7eec3835c8c102d1c699303f50accd1e09df-%E5%87%BA%E5%85%A5%E6%A0%88.gif)

从栈的操作特性上来看，栈是一种“操作受限”的线性表，只允许在一端插入和删除数据。我们可以使用数组或链表替代栈，但是两者暴露了太多接口，意味着更灵活，有时候更灵活反而导致容易出错，不可控。存在即合理，栈自然有它的用武之地。

当某个数据集合只涉及在一端插入和删除数据，并且满足后进先出、先进后出的特性，我们就应该首选“栈”这种数据结构。

### 3.JS实现栈

```js
class Stack {
    constructor() {
        this.length = 0;
    }
    
    
}
```

## 六、队列

### 1.如何理解“队列”？

队列这个概念非常好理解。你可以把它想象成排队买票，先来的先买，后来的人只能站末尾，不允许插队。先进者先出，这就是典型的“队列”。先进先出（FIFO）

![](https://pic.leetcode-cn.com/44b3a817f0880f168de9574075b61bd204fdc77748d4e04448603d6956c6428a-%E5%87%BA%E5%85%A5%E9%98%9F.gif)

我们知道，栈只支持两个基本操作：入栈 push()和出栈 pop()。

队列跟栈一样，也是一种操作受限的线性表数据结构。最基本的操作也是两个：入队 enqueue()，放一个数据到队列尾部；出队 dequeue()，从队列头部取一个元素。

> 秘诀：“吃多了拉就是队列，吃多了吐就是栈”

### 2.JS实现简单队列

跟栈一样，队列可以用数组来实现，也可以用链表来实现。用数组实现的栈叫作顺序栈，用链表实现的栈叫作链式栈。同样，用数组实现的队列叫作顺序队列，用链表实现的队列叫作链式队列。

```js
class Queue {
    constructor() {
        this.data = [];
    }
    
    // 入队列
    enqueue(value) {
       this.data.push(value);
        return true;
    }
    // 出队列
    dequeue() {
        if(this.data.length > 0) {
            this.data.shift();
        	return true;  
        }
		return false
    }
    // 获取队列头部
    head() {
        return this.data[0];
    }
    // 获取队列尾部
    tail() {
        return this.data[this.data.length - 1];
    }
    // 判空
    isEmpty() {
        return this.data.length === 0;
    }
    // 获取长度
    size() {
        return this.data.length
    }
}
```

### 3.JS实现循环队列

循环队列是一种线性数据结构，其操作表现基于 FIFO（先进先出）原则并且队尾被连接在队首之后以形成一个循环。它也被称为“环形缓冲器”。