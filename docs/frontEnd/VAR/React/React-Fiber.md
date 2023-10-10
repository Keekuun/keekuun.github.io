---
title: React fiber
date: 2020-11-17
sidebar: auto
categories: 
- React
- 前端
tags: 
- JS
- React
---
# React fiber

> [React Fiber架构](https://zhuanlan.zhihu.com/p/37095662)

+ React16.x 为什么要对生命周期钩子大换血

React将虚拟DOM的更新过程划分两个阶段，reconciler阶段与commit阶段。reconciler阶段对应早期版本的diff过程，commit阶段对应早期版本的patch过程。

一些迷你React，如preact会将它们混合在一起，一边diff一边patch(幸好它使用了Promise.then来优化，确保每次只更新一个组件) 。

有些迷你React则是通过减少移动进行优化，于是绞尽脑汁，用上各种算法，最短编辑距离，最长公共子序列，最长上升子序列。。。

其实基于算法的优化是一种绝望地优化，就类似玛雅文明因为找不到铜矿一直停留于石器时代，诞生了伟大的工匠精神把石器打磨得美伦美奂。


之所以这么说，因为diff算法都用于组件的新旧children比较，children一般不会出现过长的情况，有点大炮打蚊子。况且当我们的应用变得非常庞大，页面有上万个组件，要diff这么多组件，再卓绝的算法也不能保证浏览器不会累趴。因为他们没想到浏览器也会累趴，也没有想到这是一个长跑的问题。如果是100米短跑，或者1000米竞赛，当然越快越好。如果是马拉松，就需要考虑到保存体力了，需要注意休息了。性能是一个系统性的工程。

在我们的代码里面，休息就是检测时间然后断开Fiber链。

updateFiberAndView里面先进行updateView，由于节点的更新是不可控，因此全部更新完，才检测时间。并且我们完全不用担心updateView会出问题，因为updateView实质上是在batchedUpdates中，里面有try catch。而接下来我们基于DFS更新节点，每个节点都要check时间，这个过程其实很害怕出错的， 因为组件在挂载过程中会调三次钩子/方法（constructor, componentWillMount, render）， 组件在更新过程中会调4次钩子 （componentWillReceiveProps, shouldUpdate, componentWillUpdate）, 总不能每个方法都用try catch包起来，这样会性能很差。而constructor, render是不可避免的，于是对三个willXXX动刀了。

在早期版本中，componentWillMount与componentWillReceiveProps会做内部优化，执行多次setState都会延后到render时进行合并处理。因此用户就肆意setState了。这些willXXX还可以让用户任意操作DOM。 操作DOM会可能reflow，这是官方不愿意看到的。于是官方推出了getDerivedStateFromProps，让你在render设置新state，你主要返回一个新对象，它就主动帮你setState。由于这是一个静态方法，你不能操作instance，这就阻止了你多次操作setState。由于没有instance,也就没有http://instance.refs.xxx，你也没有机会操作DOM了。这样一来，getDerivedStateFromProps的逻辑应该会很简单，这样就不会出错，不会出错，就不会打断DFS过程。

getDerivedStateFromProps取代了原来的componentWillMount与componentWillReceiveProps方法，而componentWillUpdate本来就是可有可无，以前完全是为了对称好看。

在即使到来的异步更新中，reconciler阶段可能执行多次，才执行一次commit，这样也会导致willXXX钩子执行多次，违反它们的语义，它们的废弃是不可逆转的。

在进入commit阶段时，组件多了一个新钩子叫getSnapshotBeforeUpdate，它与commit阶段的钩子一样只执行一次。

## element、fiber、dom关系

+ element 是 React 视图层在代码层级上的表象，也就是开发者写的 jsx 语法，写的元素结构，都会被创建成 element 对象的形式。上面保存了 props ， children 等信息。 

+ DOM 是元素在浏览器上给用户直观的表象。

+ fiber 可以说是是 element 和真实 DOM 之间的交流枢纽站，一方面每一个类型 element 都会有一个与之对应的 fiber 类型，element 变化引起更新流程都是通过 fiber 层面做一次调和改变，然后对于元素，形成新的 DOM 做视图渲染。

```markdown

      state、props变化      React.createElement             dom diff        commit
    一次更新 -----> React element ----> 更新element ----> 调和React fiber ---> 更新 ----> 真实dom
```

+ element 与 fiber 之间的对应关系
```js
export const FunctionComponent = 0;       // 对应函数组件
export const ClassComponent = 1;          // 对应的类组件
export const IndeterminateComponent = 2;  // 初始化的时候不知道是函数组件还是类组件 
export const HostRoot = 3;                // Root Fiber 可以理解为跟元素 ， 通过reactDom.render()产生的根元素
export const HostPortal = 4;              // 对应  ReactDOM.createPortal 产生的 Portal 
export const HostComponent = 5;           // dom 元素 比如 <div>
export const HostText = 6;                // 文本节点
export const Fragment = 7;                // 对应 <React.Fragment> 
export const Mode = 8;                    // 对应 <React.StrictMode>   
export const ContextConsumer = 9;         // 对应 <Context.Consumer>
export const ContextProvider = 10;        // 对应 <Context.Provider>
export const ForwardRef = 11;             // 对应 React.ForwardRef
export const Profiler = 12;               // 对应 <Profiler/ >
export const SuspenseComponent = 13;      // 对应 <Suspense>
export const MemoComponent = 14;          // 对应 React.memo 返回的组件
```

## fiber node属性
```js
function FiberNode(){

  this.tag = tag;                  // fiber 标签 证明是什么类型fiber，标记不同组件类型，如函数组件、类组件 ...
  this.key = key;                  // key调和子节点时候用到。
  this.elementType = null;         // createElement的第一个参数，ReactElement 上的 type  
  this.type = null;                // dom元素是对应的元素类型，比如div，组件指向组件对应的类或者函数。  
  this.stateNode = null;           // 指向对应的真实dom元素，类组件指向组件实例，可以被ref获取。
 
  this.return = null;              // 指向父级fiber
  this.child = null;               // 指向子级fiber
  this.sibling = null;             // 指向兄弟fiber 
  this.index = 0;                  // 索引，一般如果没有兄弟节点的话是0 当某个父节点下的子节点是数组类型的时候会给每个子节点一个 index，index 和 key 要一起做 diff

  this.ref = null;                 // ref指向，ref函数，或者ref对象。

  this.pendingProps = pendingProps;// 新的 props，在一次更新中，代表element创建
  this.memoizedProps = null;       // 旧的 props，记录上一次更新完毕后的props
  this.updateQueue = null;         // 类组件存放setState更新队列，函数组件存放。fiber 上的更新队列执行一次 setState 就会往这个属性上挂一个新的更新, 每条更新最终会形成一个链表结构，最后做批量更新
  this.memoizedState = null;       // 类组件保存state信息，函数组件保存hooks信息，dom元素为null。对应  memoizedProps，上次渲染的 state，相当于当前的 state，理解成 prev 和 next 的关系
  this.dependencies = null;        // context或是时间的依赖项

  this.mode = mode;                //描述fiber树的模式，表示当前组件下的子组件的渲染方式，比如 ConcurrentMode 模式

  this.effectTag = NoEffect;       // effect标签，用于收集effectList，表示当前 fiber 要进行何种更新（更新、删除等）
  this.nextEffect = null;          // 指向下个需要更新的fiber

  this.firstEffect = null;         // 指向所有子节点里，需要更新的 fiber 里的第一个
  this.lastEffect = null;          // 指向所有子节点中需要更新的 fiber 的最后一个

  this.expirationTime = NoWork;    // 通过不同过期时间，判断任务是否过期， 在v17版本用lane表示。
  this.childExpirationTime = NoWork; // child 过期时间，在v17版本用childLanes表示。
  this.alternate = null;           //双缓存树，指向缓存的fiber。更新阶段，两颗树互相交替。
}
```

## fiber tree
对于每一个 element 都会对应一个 fiber ，每一个 fiber 是通过 `return` ， `child` ，`sibling` 三个属性建立起联系的。

+ `return`： 指向父级 Fiber 节点。
+ `child`： 指向子 Fiber 节点。
+ `sibling`：指向兄弟 fiber 节点。

比如下面的jsx对应的fiber tree：
```js
export default class Index extends React.Component{
    state={ number:666 }
    handleClick=()=>{
        this.setState({
            number:this.state.number + 1
        })
    }
    render(){
        return <div>
            hello，world
            <p > 《React进阶实践指南》 { this.state.number } 👍  </p>
            <button onClick={ this.handleClick } >点赞</button>
        </div>
    }
}      
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bdf7dc554e54197a98bbc9be5b191b2~tplv-k3u1fbpfcp-watermark.awebp)

## fiber更新机制

### 1.初始化：
+ 第一步：创建fiberRoot和rootFiber
  + fiberRoot：首次构建应用， 创建一个 fiberRoot ，作为整个 React 应用的根基。
  + rootFiber： 如下通过 ReactDOM.render 渲染出来的，如上 Index 可以作为一个 rootFiber。一个 React 应用可以有多 ReactDOM.render 创建的 rootFiber ，但是只能有一个 fiberRoot（应用根节点）。
    ```js
        ReactDOM.render(<Index/>, document.getElementById('app'));
    ```
第一次挂载的过程中，会将 fiberRoot 和 rootFiber 建立起关联:
```js
function createFiberRoot(containerInfo,tag){
    /* 创建一个root */
    const root = new FiberRootNode(containerInfo,tag)
    const rootFiber = createHostRootFiber(tag);
    root.current = rootFiber
    return root
}
```

+ 第二步：workInProgress和current
  经过第一步的处理，开始到正式渲染阶段，会进入 begin work 流程，在讲渲染流程之前，要先弄明白两个概念：
    + workInProgress：正在内存中构建的 Fiber 树称为 workInProgress Fiber 树。在一次更新中，所有的更新都是发生在 workInProgress 树上。在一次更新之后，workInProgress 树上的状态是最新的状态，那么它将变成 current 树用于渲染视图。
    + current：正在视图层渲染的树叫做 current 树。
    
接下来会到 rootFiber 的渲染流程，首先会复用当前 current 树（ rootFiber ）的 alternate 作为 workInProgress ，如果没有 alternate （初始化的 rootFiber 是没有 alternate ），那么会创建一个 fiber 作为 workInProgress 。会用 alternate 将新创建的 workInProgress 与 current 树建立起关联。这个关联过程只有初始化第一次创建 alternate 时候进行。
    ```js
    currentFiber.alternate = workInProgressFiber
    workInProgressFiber.alternate = currentFiber
    ```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a7f5a9b77ff45febd8e255fcba1ba3a~tplv-k3u1fbpfcp-watermark.awebp)

+ 第三步：深度调和子节点，渲染视图
  接下来会按照上述第二步，在新创建的 alternates 上，完成整个 fiber 树的遍历，包括 fiber 的创建。

效果:
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cda0522c0c85435494ccf3a3ea587baa~tplv-k3u1fbpfcp-watermark.awebp)

最后会以 workInProgress 作为最新的渲染树，fiberRoot 的 current 指针指向 workInProgress 使其变为 current Fiber 树。到此完成初始化流程。
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/907fb4f6768842438e0df7f083adc4b6~tplv-k3u1fbpfcp-watermark.awebp)

### 2.更新
如果对于上述 demo ，开发者点击一次按钮发生更新，接下来会发生什么呢? 首先会走如上的逻辑，重新创建一颗 workInProgress 树，复用当前 current 树上的 alternate ，作为新的 workInProgress ，由于初始化 rootFiber 有 alternate ，所以对于剩余的子节点，React 还需要创建一份，和 current 树上的 fiber 建立起 alternate 关联。渲染完毕后，workInProgress 再次变成 current 树。

效果：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff00ce5f2db0430c841ea3a01754542e~tplv-k3u1fbpfcp-watermark.awebp)

> **双缓冲树**: React 用 workInProgress 树(内存中构建的树) 和 current (渲染树) 来实现更新逻辑。双缓存一个在内存中构建，一个渲染视图，两颗树用 alternate 指针相互指向，在下一次渲染的时候，直接复用缓存树做为下一次渲染树，上一次的渲染树又作为缓存树，这样可以防止只用一颗树更新状态的丢失的情况，又加快了 DOM 节点的替换与更新。

## 两大阶段：render和commit
render 阶段和 commit 阶段是整个 fiber Reconciler 的核心

### 1.render阶段
+ fiber 的遍历开始—— `workLoop`
```js
function workLoop (){
    while (workInProgress !== null ) {
      workInProgress = performUnitOfWork(workInProgress);
    }
}
```
每一个 fiber 可以看作一个执行的单元，在调和过程中，每一个发生更新的 fiber 都会作为一次 workInProgress 。那么 workLoop 就是执行每一个单元的调度器，如果渲染没有被中断，那么 workLoop 会遍历一遍 fiber 树。 performUnitOfWork 包括两个阶段 beginWork 和 completeWork 。

```js
function performUnitOfWork(){
    next = beginWork(current, unitOfWork, renderExpirationTime);
    if (next === null) {
       next = completeUnitOfWork(unitOfWork);
    }
}
```
`beginWork`：是向下调和的过程。就是由 fiberRoot 按照 child 指针逐层向下调和，期间会执行函数组件，实例类组件，diff 调和子节点，打不同effectTag。

`completeUnitOfWork`：是向上归并的过程，如果有兄弟节点，会返回 sibling兄弟，没有返回 return 父级，一直返回到 fiberRoot ，期间可以形成effectList，对于初始化流程会创建 DOM ，对于 DOM 元素进行事件收集，处理style，className等。

这么一上一下，构成了整个 fiber 树的调和。

+ 向下调和beginWork
```
function beginWork(current,workInProgress){

    switch(workInProgress.tag){
       case IndeterminateComponent:{// 初始化的时候不知道是函数组件还是类组件 
           //....
       }
       case FunctionComponent: {//对应函数组件
           //....
       }
       case ClassComponent:{  //类组件
           //...
       }
       case HostComponent:{
           //...  
       }
       ...
    }
}

// 调和子节点
function reconcileChildren(current,workInProgress){
    if(current === null){  /* 初始化子代fiber  */
        workInProgress.child = mountChildFibers(workInProgress,null,nextChildren,renderExpirationTime)
    }else{  /* 更新流程，diff children将在这里进行。 */
        workInProgress.child = reconcileChildFibers(workInProgress,current.child,nextChildren,renderExpirationTime)
    }
}
```

**beginWork 作用如下**：
+ 对于组件，执行部分生命周期，执行 render ，得到最新的 children 。
+ 向下遍历调和 children ，复用 oldFiber ( diff 算法)。
+ 打不同的副作用标签 effectTag ，比如类组件的生命周期，或者元素的增加，删除，更新。

部分EffectTag
```js
export const Placement = /*             */ 0b0000000000010;  // 插入节点
export const Update = /*                */ 0b0000000000100;  // 更新fiber
export const Deletion = /*              */ 0b0000000001000;  // 删除fiebr
export const Snapshot = /*              */ 0b0000100000000;  // 快照
export const Passive = /*               */ 0b0001000000000;  // useEffect的副作用
export const Callback = /*              */ 0b0000000100000;  // setState的 callback
export const Ref = /*                   */ 0b0000010000000;  // ref
```
+ 向上归并 completeUnitOfWork 

completeUnitOfWork 的流程是自下向上的，那么 completeUnitOfWork 过程主要做写什么呢？

首先 completeUnitOfWork 会将 effectTag 的 Fiber 节点会被保存在一条被称为 effectList 的单向链表中。在 commit 阶段，将不再需要遍历每一个 fiber ，只需要执行更新 effectList 就可以了。
completeWork 阶段对于组件处理 context ；对于元素标签初始化，会创建真实 DOM ，将子孙 DOM 节点插入刚生成的 DOM 节点中；会触发 diffProperties 处理 props ，比如事件收集，style，className 处理。

### 2.commit阶段
既然完成 render 阶段，接下来将进行第二阶段 commit 阶段。commit 阶段做的事情是：

+ 一方面是对一些生命周期和副作用钩子的处理，比如 componentDidMount ，函数组件的 useEffect ，useLayoutEffect ；

+ 另一方面就是在一次更新中，添加节点（ Placement ），更新节点（ Update ），删除节点（ Deletion ），还有就是一些细节的处理，比如 ref 的处理。

**commit 细分可以分为**：

+ Before mutation 阶段（执行 DOM 操作前）；
+ mutation 阶段（执行 DOM 操作）；
+ layout 阶段（执行 DOM 操作后）

**1.Before mutation**：
```js
function commitBeforeMutationEffects() {
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag;
    if ((effectTag & Snapshot) !== NoEffect) {
      const current = nextEffect.alternate;
      // 调用getSnapshotBeforeUpdates
      commitBeforeMutationEffectOnFiber(current, nextEffect);
    }
    if ((effectTag & Passive) !== NoEffect) {
       scheduleCallback(NormalPriority, () => {
          flushPassiveEffects();
          return null;
        });
    }
    nextEffect = nextEffect.nextEffect;
  }
}
```
Before mutation 阶段做的事主要有以下内容：

+ 因为 Before mutation 还没修改真实的 DOM ，是获取 DOM 快照的最佳时期，如果是类组件有 getSnapshotBeforeUpdate ，那么会执行这个生命周期。
+ 会异步调用 useEffect ，在生命周期章节讲到 useEffect 是采用异步调用的模式，其目的就是防止同步执行时阻塞浏览器做视图渲染。

**2.Mutation**
```js
function commitMutationEffects(){
    while (nextEffect !== null) {
        if (effectTag & Ref) { /* 置空Ref */
            const current = nextEffect.alternate;
            if (current !== null) {
                commitDetachRef(current);
            }
        }
        switch (primaryEffectTag) {
            case Placement: {} //  新增元素
            case Update:{}     //  更新元素
            case Deletion:{}   //  删除元素
        }
    } 
}
```
mutation 阶段做的事情有：

+ 置空 ref ，在 ref 章节讲到对于 ref 的处理。
+ 对新增元素，更新元素，删除元素。进行真实的 DOM 操作。

**3.Layout**
```js
function commitLayoutEffects(root){
     while (nextEffect !== null) {
          const effectTag = nextEffect.effectTag;
          commitLayoutEffectOnFiber(root,current,nextEffect,committedExpirationTime)
          if (effectTag & Ref) {
             commitAttachRef(nextEffect);
          }
     }
}
```
Layout 阶段 DOM 已经更新完毕，Layout 做的事情有：

+ commitLayoutEffectOnFiber 对于类组件，会执行生命周期，setState 的callback，对于函数组件会执行 useLayoutEffect 钩子。
+ 如果有 ref ，会重新赋值 ref 。

接下来对 commit 阶段做一个总结，主要做的事就是执行effectList，更新DOM，执行生命周期，获取ref等操作。


**小结**：
+ fiber 的诞生的初衷，以及 fiber 组成，不同种类的 fiber ，fiber 如何建立起联系。
+ fiber 的更新机制，双缓冲树。
+ reconciler 调和过程，以及 render 和 commit 两大阶段。

**调和 + 异步调度 流程总图**:
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/429a103a732e42b69b6cd9a32f1d265a~tplv-k3u1fbpfcp-watermark.awebp)

[如果加载失败CLICK ME](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
<iframe importance="low" height="600" width="100%;" scrolling="no" title="react lifecycle" src="https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>

> [如何阅读源码](https://blog.shenfq.com/posts/2020/%E6%88%91%E6%98%AF%E6%80%8E%E4%B9%88%E8%AF%BB%E6%BA%90%E7%A0%81%E7%9A%84.html)
> [React Fiber问题收录](https://juejin.cn/post/7260016275299975225)
