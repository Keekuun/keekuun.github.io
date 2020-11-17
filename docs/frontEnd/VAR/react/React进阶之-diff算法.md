> [diff 算法的进化](https://blog.shenfq.com/2019/%E8%99%9A%E6%8B%9F-dom-%E5%88%B0%E5%BA%95%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F/#diff-%E7%AE%97%E6%B3%95%E7%9A%84%E8%BF%9B%E5%8C%96)

## DOM 树的遍历
![](https://file.shenfq.com/FsioVJQiRylzBQN3quCjf2H0s287.gif)

```js
function diff (oldNode, newNode) {
  const patches = [];
  walk(oldNode, newNode, patches, 0); // 进行深度优先遍历 
  return patches;
}

function walk(oldNode, newNode, patches, index) {
  if (newNode === oldNode) {
    return
  }
  
  const patch = { type: 'update', vNode: newNode };
  
  const oldChildren = oldNode.children;
  const newChildren = newNode.children;
  const oldLen = oldChildren.length;
  const newLen = newChildren.length;
  const len = oldLen > newLen ? oldLen : newLen;
  // 找到对应位置的子节点进行比对 
  for (let i = 0; i < len; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];
    index++;
    // 相同节点进行比对 
    walk(oldChild, newChild, patches, index);
    if (isArray(oldChild.children)) {
      index += oldChild.children.length;
    }
  }
  
  if (patch) {
    patches[index] = patch;
  }
}
```

## VDOM 节点的对比
上面代码只是对 VDOM 进行了简单的**深度优先遍历**，在遍历中，还需要对每个 VDOM 进行一些对比，具体分为以下几种情况：

+ 1.旧节点不存在，插入新节点；新节点不存在，删除旧节点
+ 2.新旧节点如果都是 VNode，且新旧节点 tag 相同
    + 对比新旧节点的属性
    + 对比新旧节点的子节点差异，通过 key 值进行重排序，key 值相同节点继续向下遍历
+ 3.新旧节点如果都是 VText，判断两者文本是否发生变化
+ 4.其他情况直接用新节点替代旧节点
