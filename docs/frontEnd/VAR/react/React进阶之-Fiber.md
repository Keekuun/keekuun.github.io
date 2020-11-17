> [React Fiber架构](https://zhuanlan.zhihu.com/p/37095662)

+ React16.x 为什么要对生命周期钩子大换血

React将虚拟DOM的更新过程划分两个阶段，reconciler阶段与commit阶段。reconciler阶段对应早期版本的diff过程，commit阶段对应早期版本的patch过程。

一些迷你React，如preact会将它们混合在一起，一边diff一边patch(幸好它使用了Promise.then来优化，确保每次只更新一个组件) 。

有些迷你React则是通过减少移动进行优化，于是绞尽脑汁，用上各种算法，最短编辑距离，最长公共子序列，最长上升子序列。。。

其实基于算法的优化是一种绝望的优化，就类似玛雅文明因为找不到铜矿一直停留于石器时代，诞生了伟大的工匠精神把石器打磨得美伦美奂。


<iframe src="http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/" frameborder="0" height=650 width="100%"></iframe>




之所以这么说，因为diff算法都用于组件的新旧children比较，children一般不会出现过长的情况，有点大炮打蚊子。况且当我们的应用变得非常庞大，页面有上万个组件，要diff这么多组件，再卓绝的算法也不能保证浏览器不会累趴。因为他们没想到浏览器也会累趴，也没有想到这是一个长跑的问题。如果是100米短跑，或者1000米竞赛，当然越快越好。如果是马拉松，就需要考虑到保存体力了，需要注意休息了。性能是一个系统性的工程。

在我们的代码里面，休息就是检测时间然后断开Fiber链。

updateFiberAndView里面先进行updateView，由于节点的更新是不可控，因此全部更新完，才检测时间。并且我们完全不用担心updateView会出问题，因为updateView实质上是在batchedUpdates中，里面有try catch。而接下来我们基于DFS更新节点，每个节点都要check时间，这个过程其实很害怕出错的， 因为组件在挂载过程中会调三次钩子/方法（constructor, componentWillMount, render）， 组件在更新过程中会调4次钩子 （componentWillReceiveProps, shouldUpdate, componentWillUpdate）, 总不能每个方法都用try catch包起来，这样会性能很差。而constructor, render是不可避免的，于是对三个willXXX动刀了。

在早期版本中，componentWillMount与componentWillReceiveProps会做内部优化，执行多次setState都会延后到render时进行合并处理。因此用户就肆意setState了。这些willXXX还可以让用户任意操作DOM。 操作DOM会可能reflow，这是官方不愿意看到的。于是官方推出了getDerivedStateFromProps，让你在render设置新state，你主要返回一个新对象，它就主动帮你setState。由于这是一个静态方法，你不能操作instance，这就阻止了你多次操作setState。由于没有instance,也就没有http://instance.refs.xxx，你也没有机会操作DOM了。这样一来，getDerivedStateFromProps的逻辑应该会很简单，这样就不会出错，不会出错，就不会打断DFS过程。

getDerivedStateFromProps取代了原来的componentWillMount与componentWillReceiveProps方法，而componentWillUpdate本来就是可有可无，以前完全是为了对称好看。

在即使到来的异步更新中，reconciler阶段可能执行多次，才执行一次commit，这样也会导致willXXX钩子执行多次，违反它们的语义，它们的废弃是不可逆转的。

在进入commi阶段时，组件多了一个新钩子叫getSnapshotBeforeUpdate，它与commit阶段的钩子一样只执行一次。


>[React 架构的演变 - 从同步到异步](https://blog.shenfq.com/2020/react-%E6%9E%B6%E6%9E%84%E7%9A%84%E6%BC%94%E5%8F%98-%E4%BB%8E%E5%90%8C%E6%AD%A5%E5%88%B0%E5%BC%82%E6%AD%A5/#%E6%97%A7%E7%89%88%E6%9C%AC-setState-%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90)
>
>[React 架构的演变 - 从递归到循环](https://blog.shenfq.com/2020/react-%E6%9E%B6%E6%9E%84%E7%9A%84%E6%BC%94%E5%8F%98-%E4%BB%8E%E9%80%92%E5%BD%92%E5%88%B0%E5%BE%AA%E7%8E%AF/)
>
> [React 架构的演变 - 更新机制](https://blog.shenfq.com/2020/react-%E6%9E%B6%E6%9E%84%E7%9A%84%E6%BC%94%E5%8F%98-%E6%9B%B4%E6%96%B0%E6%9C%BA%E5%88%B6/)
>
>[React 架构的演变 - Hooks 的实现](https://blog.shenfq.com/2020/react-%E6%9E%B6%E6%9E%84%E7%9A%84%E6%BC%94%E5%8F%98-hooks-%E7%9A%84%E5%AE%9E%E7%8E%B0/)
