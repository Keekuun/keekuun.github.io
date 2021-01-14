---
title: 【Algorithm】算法训练题
sidebar: auto
date: 2020-10-21
categories: 
- 算法
tags:
- 算法
---

# 算法训练

## 一、[位运算](https://leetcode-cn.com/tag/bit-manipulation/)

### 1.[位1的个数](https://leetcode-cn.com/problems/number-of-1-bits/)

## 二、[数组](https://leetcode-cn.com/tag/array/)

### 1.[合并两个有序数组](https://leetcode-cn.com/problems/merge-sorted-array/)

### 2.[最小路径和](https://leetcode-cn.com/problems/minimum-path-sum/)

### 3.[两数之和](https://leetcode-cn.com/problems/two-sum/)

### 4.[两数之和 II](https://leetcode-cn.com/problems/two-sum-ii-input-array-is-sorted/)

### 5.[三数之和](https://leetcode-cn.com/problems/3sum/)

### 6.[四数之和](https://leetcode-cn.com/problems/4sum/)

### 7.[滑动窗口的最大值](https://leetcode-cn.com/problems/hua-dong-chuang-kou-de-zui-da-zhi-lcof/)

### 8.[最长上升子序列](https://leetcode-cn.com/problems/longest-increasing-subsequence/)

### 9.[最长公共前缀](https://leetcode-cn.com/problems/longest-common-prefix/)

### 10.[最长公共子序列](https://leetcode-cn.com/problems/longest-common-subsequence/)

### 11.[乘积最大子数组](https://leetcode-cn.com/problems/maximum-product-subarray/)

## 三、[链表](https://leetcode-cn.com/tag/linked-list/)

### 1.[反转链表](https://leetcode-cn.com/problems/reverse-linked-list/)

### 2.[反转链表 II](https://leetcode-cn.com/problems/reverse-linked-list-ii/)

### 3.[旋转链表](https://leetcode-cn.com/problems/rotate-list/)

### 4.[合并两个有序链表](https://leetcode-cn.com/problems/merge-two-sorted-lists/)

### 5.[环形链表](https://leetcode-cn.com/problems/linked-list-cycle/)

### 6.[环形链表 II](https://leetcode-cn.com/problems/linked-list-cycle-ii/)

### 7.[两个链表的第一个公共节点](https://leetcode-cn.com/problems/liang-ge-lian-biao-de-di-yi-ge-gong-gong-jie-dian-lcof/)

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function(headA, headB) {
    if(!headA || !headB) return null;

    var n1 = headA;
    var n2 = headB;
    while(n1 != n2) {
        n1 = n1 == null ? headB : n1.next;
        n2 = n2 == null ? headA : n2.next;
    }

    return n1;

};
```




## 四、[栈](https://leetcode-cn.com/tag/stack/)

### 1.[有效的括号](https://leetcode-cn.com/problems/valid-parentheses/)

### 2.[每日温度](https://leetcode-cn.com/problems/daily-temperatures/)

### 3.[逆波兰表达式求值](https://leetcode-cn.com/problems/evaluate-reverse-polish-notation/)

### 4.[接雨水](https://leetcode-cn.com/problems/trapping-rain-water/)


## 五、[队列](https://leetcode-cn.com/tag/queue/)

### 1.[设计循环队列](https://leetcode-cn.com/problems/design-circular-queue/)

### 2.[设计循环双端队列](https://leetcode-cn.com/problems/design-circular-deque/)

## 六.队列和广度优先搜索（BFS）

### 1.[完全平方数](https://leetcode-cn.com/problems/perfect-squares/solution/xiang-xi-tong-su-de-si-lu-fen-xi-duo-jie-fa-by--51/)

### 2.[路径总和](https://leetcode-cn.com/problems/path-sum/)

### 3.[二叉树的层序遍历](https://leetcode-cn.com/leetbook/read/data-structure-binary-tree/xefh1i/)


## 七、[树](https://leetcode-cn.com/tag/tree/)

### 1.[二叉树的前序遍历](https://leetcode-cn.com/leetbook/read/data-structure-binary-tree/xeywh5/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function(root) {
    var res = [];
    preOrder(root, res);

    return res;
};

var preOrder = function(root, res) {
    if(!root) return;
    // 根 - 左 - 右
    res.push(root.val);
    preOrder(root.left, res);
    preOrder(root.right, res);
}
```



### 2.[二叉树的中序遍历](https://leetcode-cn.com/leetbook/read/data-structure-binary-tree/xecaj6/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    var res = [];
    inOrder(root, res);

    return res;
};

var inOrder = function(root, res) {
    if(!root) return;
    // 左 - 根 - 右
    inOrder(root.left, res);
    res.push(root.val);
    inOrder(root.right, res);
}
```



### 3.[二叉树的后序遍历](https://leetcode-cn.com/leetbook/read/data-structure-binary-tree/xebrb2/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function(root) {
    var res = [];
    postOrder(root, res);

    return res;
};

var postOrder = function(root, res) {
    if(!root) return;
    // 左 - 右 - 根
    postOrder(root.left, res);
    postOrder(root.right, res);
    res.push(root.val)
}
```



### 4.[二叉树的层序遍历](https://leetcode-cn.com/leetbook/read/data-structure-binary-tree/xefh1i/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
    var res = [];
    // 广度优先遍历
    bfs(root, res);

    return res;
};

var bfs = function(root, res) {
    if(!root) return;
    // 根入队列
    var queue = [root];

    while(queue.length > 0) {
        // 记录size
        var size = queue.length;
        // 保存当前层数据
        var data = [];
        // 此处使用size，不要使用queue.length,因为他是一直变化的
        for(var i=0; i < size; i++) {
            // 出队列
            var cur = queue.shift();
            // 保存数据
            data.push(cur.val);
            // 左子树入队列
            if(cur.left) queue.push(cur.left);
            // 右子树入队列
            if(cur.right) queue.push(cur.right);
        }

        res.push(data);
    }
}
```



### 5.[二叉树的最大深度](https://leetcode-cn.com/leetbook/read/data-structure-binary-tree/xoh1zg/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
    if(!root) return 0;

    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right))
};
```



### 6.[对称二叉树](https://leetcode-cn.com/leetbook/read/data-structure-binary-tree/xoxzgv/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {
    if(!root) return true;

    return helper(root.left, root.right);
};

// 判断左右节点是否对称
var helper = function(root1, root2) {
    // 都不存在
    if(!root1 && !root2) return true;
    // 有一个不存在
    if(!root1 || !root2) return false;
    // 都存在，值不同
    if(root1.val !== root2.val) return false;
    // 都存在，值相同,继续比较子节点
    return helper(root1.left, root2.right) && helper(root1.right, root2.left);
}
```



### 7.[验证二叉搜索树](https://leetcode-cn.com/problems/validate-binary-search-tree/)

+ 递归：

  ```js
  /**
   * Definition for a binary tree node.
   * function TreeNode(val) {
   *     this.val = val;
   *     this.left = this.right = null;
   * }
   */
  /**
   * @param {TreeNode} root
   * @return {boolean}
   */
  var isValidBST = function(root) {
      return helper(root, -Infinity, Infinity);
  };
  
  var helper = function(root, lower, higher) {
      if(!root) return true;
      if(root.val <= lower || root.val >= higher) return false;
      // 维护这个最值，左节点的最大值为root.val；右节点的最小值为root.val
      return helper(root.left, lower, root.val) && helper(root.right, root.val, higher);
  }
  ```

+ 迭代：中序遍历二叉搜索树的结果序列是一个升序序列

  ```js
  /**
   * Definition for a binary tree node.
   * function TreeNode(val) {
   *     this.val = val;
   *     this.left = this.right = null;
   * }
   */
  /**
   * @param {TreeNode} root
   * @return {boolean}
   */
  var isValidBST = function(root) {
     // 中序遍历
     let inorder = -Infinity;
     let stack = [];
  
     while(root !== null || stack.length) {
         // 先遍历左子树
         while(root !== null) {
             stack.push(root);
             root = root.left;
         }
         // 左子树出栈
         root = stack.pop();
          // 如果中序遍历得到的节点的值小于等于前一个 inorder，说明不是二叉搜索树
         if(root.val <= inorder) return false;
         inorder = root.val;
         root = root.right;
     }
     return true;
  };
  ```

  

### 8.[二叉搜索树的最近公共祖先](https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
        //如果根节点和p,q的差相乘是正数，说明这两个差值要么都是正数要么都是负数，也就是说
        //他们肯定都位于根节点的同一侧，就继续往下找
        while ((root.val - p.val) * (root.val - q.val) > 0) {
            root = p.val < root.val ? root.left : root.right;
        }
        //如果相乘的结果是负数，说明p和q位于根节点的两侧，如果等于0，说明至少有一个就是根节点
        return root;
};
```



### 9.[二叉树的最近公共祖先](https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-tree/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
    if(root === null || root === p || root === q) return root;
    
    // 分别在left和right中找p和q的公共祖先
    var left = lowestCommonAncestor(root.left, p, q);
    var right = lowestCommonAncestor(root.right, p, q);
    
    //如果left为空，说明这两个节点在cur结点的右子树上，我们只需要返回右子树查找的结果即可
    if(left === null) return right;
    //同理
    if(right === null) return left;
    
	//如果left和right都不为空，说明这两个节点一个在root的左子树上一个在root的右子树上，
    //我们只需要返回root结点即可。	
    return root;

};
```



### 10.[平衡二叉树](https://leetcode-cn.com/problems/ping-heng-er-cha-shu-lcof/)

### 11.[路径总和](https://leetcode-cn.com/problems/path-sum/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} sum
 * @return {boolean}
 */
var hasPathSum = function(root, sum) {
    if(!root) return false;

    if(!root.left && !root.right && root.val === sum) return true;

    return hasPathSum(root.left, sum - root.val) || hasPathSum(root.right, sum - root.val);
};
```



### 12.[从中序与后序遍历序列构造二叉树](https://leetcode-cn.com/leetbook/read/data-structure-binary-tree/xo98qt/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var buildTree = function(inorder, postorder) {
    return helper(inorder, postorder, 0, inorder.length - 1, 0, postorder.length - 1);
};

var helper = function(inorder, postorder, inorderStart, inorderEnd, postorderStart, postorderEnd) {
    // 判断越界
    if(inorderStart > inorderEnd || postorderStart > postorderEnd) return null;

    // 根节点
    const rootVal = postorder[postorderEnd];
    const root = new TreeNode(rootVal);
    // 判断是不是只有一个节点
    if(postorderStart === postorderEnd) return root;

    // **在inorder中找到root对应的index将inorder分为左右两个子节点**
    const rootIndex = inorder.indexOf(rootVal);

    root.left = helper(inorder, postorder, inorderStart, rootIndex - 1, postorderStart, postorderStart + ((rootIndex - 1) - inorderStart)); // ((rootIndex - 1) - inorderStart) 即左子树的长度

    root.right = helper(inorder, postorder, rootIndex + 1, inorderEnd, postorderEnd - 1 - (inorderEnd - (rootIndex + 1)), postorderEnd - 1); // (inorderEnd - (rootIndex + 1)) 即右子树的长度

    return root;
}
```



### 13.[从前序与中序遍历序列构造二叉树](https://leetcode-cn.com/leetbook/read/data-structure-binary-tree/xoei3r/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(preorder, inorder) {
    return helper(preorder, inorder, 0, preorder.length - 1, 0, inorder.length - 1);
};

var helper = function(preorder, inorder, preorderStart, preorderEnd, inorderStart, inorderEnd) {
    // 判断越界
    if(preorderStart > preorderEnd || inorderStart > inorderEnd) return null;
    
    // 根节点
    const rootVal = preorder[preorderStart];
    const root = new TreeNode(rootVal);

    // 判断preorder是不是只有一个节点
    if(preorderStart === preorderEnd) return root;
    // **在中序遍历中找到rootIndex,将inorder分为左右两个子节点**
    const rootIndex = inorder.indexOf(rootVal);

    root.left = helper(preorder, inorder, preorderStart + 1, preorderStart + 1 + ((rootIndex - 1) - inorderStart), inorderStart, rootIndex - 1); // (rootIndex - 1) - inorderStart)即左子树长度

    root.right = helper(preorder, inorder,(preorderEnd - (inorderEnd - (rootIndex + 1))),preorderEnd, rootIndex + 1, inorderEnd); // (inorderEnd - (rootIndex + 1)) 即右子树长度

    return root;
}
```

### 14.[从前序和后序遍序列历构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-postorder-traversal/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {number[]} pre
 * @param {number[]} post
 * @return {TreeNode}
 */
var constructFromPrePost = function(pre, post) {
    return helper(pre, post, 0, pre.length - 1, 0, post.length - 1);
};

var helper = function(pre, post, preStart, preEnd, postStart, postEnd) {
    // 判断越界
    if(preStart > preEnd || postStart > postEnd) return null;

    // 根节点
    const rootVal = pre[preStart];
    const root = new TreeNode(rootVal);

    // 判断是不是只有一个节点
    if(preStart === preEnd) return root;

    // 先在preorder中找到左子树的leftRootVal
    const leftRootVal = pre[preStart + 1];
    // **然后在post中找到leftRootIndex, 然后根据这个index将post分为左右两个子节点**
    const index = post.indexOf(leftRootVal);

    root.left = helper(pre, post, preStart + 1, preStart + 1 + (index - postStart) , postStart, index); // (index - postStart) 即左子树长度
    root.right = helper(pre, post, (preEnd - (postEnd - 1 - (index + 1))), preEnd, index + 1, postEnd - 1);  // (postEnd - 1 - (index + 1))即右子树长度

    return root;
}
```

> [“看我就够了”三种遍历方式构造二叉树的通解](https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/solution/kan-wo-jiu-gou-liao-san-chong-bian-li-fang-shi-g-2/)

### 15.[二叉搜索树转为单链表](https://leetcode-cn.com/problems/binode-lcci/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
// 正确解法1
var convertBiNode1 = function(root) {
    let head = new TreeNode(null);
    let pre = head;
    var inOrder = function(root) {
        if(!root) return;
        // 左 - 右 - 根
        inOrder(root.left);
        root.left = null;
        pre.right = root;
        pre = root;
        inOrder(root.right);
    }
    inOrder(root);
    return head.right;
};

// 将inOrder提取出来：
// 错误解法
var convertBiNode = function(root) {
    let head = new TreeNode(null);
    let pre = head;
    inOrder(root, pre);
    return head.right;
};

var inOrder = function(root, pre) {
        if(!root) return;
        // 左 - 根 - 右 
        inOrder(root.left, pre);

        root.left = null;
        pre.right = root;
        pre = root;

        inOrder(root.right, pre);
    }

// 正确解法2
var convertBiNode2 = function(root) {
    let head = new TreeNode(null);
    inOrder(root, head);
    return head.right;
};

var pre;
var inOrder = function(root, head) {
        if(!root) return;
    
    	pre = head;
        // 左 - 根 - 右 
        inOrder(root.left, pre);

        root.left = null;
        pre.right = root;
        pre = root;

        inOrder(root.right, pre);
    }

// 正确解法3
var convertBiNode = function(root) {
    let head = new TreeNode(null);
    inOrder(root, head);
    return head.right;
};

// var pre;
var inOrder = function(root, pre) {
        if(!root) return pre;
        // 左 - 根 - 右 
        pre = inOrder(root.left, pre);

        root.left = null;
        pre.right = root;
        pre = root;

        pre = inOrder(root.right, pre);

        return pre;
    }
```



### 16.[二叉树转为单链表](https://leetcode-cn.com/problems/flatten-binary-tree-to-linked-list/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function(root) {
    let pre = new TreeNode();;

    var preOrder = function(root) {
        if(!root) return;
        let left = root.left;
        let right = root.right;

        root.left = null;
        pre.right = root;
        pre = root;

        preOrder(left);
        preOrder(right);
    }
    
    // 调用
    preOrder(root);
    
    root = pre.right;
};
```



### 17.[二叉搜索树转为双向链表](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-yu-shuang-xiang-lian-biao-lcof/)

+ 思路：先中序遍历二叉树，在将结果转为循环双向链表

  ```js
  /**
   * // Definition for a Node.
   * function Node(val,left,right) {
   *    this.val = val;
   *    this.left = left;
   *    this.right = right;
   * };
   */
  /**
   * @param {Node} root
   * @return {Node}
   */
  var treeToDoublyList = function(root) {
      if(!root) return root;
      
      let res = [];
  
      inOrder(root, res);
  
      // 方式一：
      // var head = res[0];
      // var tail = res[res.length - 1];
      // tail.right = head;
      // head.left = tail;
      // for(var i=1; i < res.length; i++) {
      //     // 更改left和right指向
      //     head.right = res[i];
      //     res[i].left = head;
      //     head = res[i];
      // }
      
      // 方式二：
      // var pre = null;
      // var head = null;
  
      // for(var i=0; i < res.length; i++) {
      //    if(pre) {
      //       // 更改left和right指向
      //        pre.right = res[i];
      //        res[i].left = pre;
      //    } else {
      //        head = res[i]
      //    }
      //    pre = res[i];
      //}
      
      // 方式三：
      var pre = res[0];
      var head = res[0];
      
      for(var i=1; i < res.length; i++) {
          // 更改left和right指向
          pre.right = res[i];
          res[i].left = pre;
          
          pre = res[i];
      }
      
      // 循环完毕，pre指向了最后一个节点
      // 处理首尾节点
      pre.right = head;
      head.left = pre;
  
      return res[0];
  };
  
  var inOrder = function(root, res) {
      if(!root) return;
      var left = root.left;
      var right = root.right;
      // 左 - 根 - 右
      inOrder(left, res);
      res.push(root);
      inOrder(right, res);
  }
  ```

+ 改进：在中序遍历的过程中把二叉树转为双向链表，然后再处理首尾链表，转为循环双向链表

  ```js
  /**
   * // Definition for a Node.
   * function Node(val,left,right) {
   *    this.val = val;
   *    this.left = left;
   *    this.right = right;
   * };
   */
  /**
   * @param {Node} root
   * @return {Node}
   */
  var treeToDoublyList = function(root) {
      if(!root) return root;
      
      let pre = null;
      let head = null;
  
      var inOrder = function(cur) {
          if(!cur) return;
          
          // 左 - 根 - 右
          inOrder(cur.left);
          
          // 修改为链表
          if(pre) {
              pre.right = cur;
              cur.left = pre;
          } else {
              // 记录第一个节点
              head = cur;
          }
          // 保存当前节点
          pre = cur;
  
          inOrder(cur.right);
  	}
      
      inOrder(root);
      head.left = pre;
      // 此时pre指向了最后一个节点
      pre.right = head;
  
      return head;
  };
  ```

  

### 18.[有序链表转换二叉搜索树](https://leetcode-cn.com/problems/convert-sorted-list-to-binary-search-tree/)

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {ListNode} head
 * @return {TreeNode}
 */
var sortedListToBST = function(head) {
    // 链表为空
    if(!head) return null;

    // 链表只有一个节点
    if(!head.next) return new TreeNode(head.val);

    // 找到中继节点
    var pre = head; // pre慢slow一步
    // slow每次走一步 fast每次走两步，当fast走到终点时，slow刚好在中途
    var slow = head.next;
    var fast = head.next.next;

    while(fast && fast.next) {
        pre = pre.next;
        slow = slow.next;
        fast = fast.next.next;
    }

    // 此时pre的下一个节点就是中继节点slow，将其打断把链表一分为二
    pre.next = null;

    // 将中继节点作为树根节点
    var root = new TreeNode(slow.val);
    // 左子树开始节点
    var left = head;
    // 右子树开始节点
    var right = slow.next;

    root.left = sortedListToBST(left);
    root.right = sortedListToBST(right);

    return root;
};
```



## 八、[动态规划](https://leetcode-cn.com/tag/dynamic-programming/)

### 1.[编辑距离](https://leetcode-cn.com/problems/edit-distance/)

### 2.[滑动窗口最大值](https://leetcode-cn.com/problems/sliding-window-maximum/)

### 3.[滑动窗口中位数](https://leetcode-cn.com/problems/sliding-window-median/)

### 4.[最长上升子序列](https://leetcode-cn.com/problems/longest-increasing-subsequence/)

### 5.[剪绳子](https://leetcode-cn.com/problems/jian-sheng-zi-lcof/)

### 6.[剪绳子 II](https://leetcode-cn.com/problems/jian-sheng-zi-ii-lcof/)

### 7.[有效的字母异位词](https://leetcode-cn.com/problems/valid-anagram/)

### 8.[N 皇后](https://leetcode-cn.com/problems/n-queens/)

### 9.[N皇后 II](https://leetcode-cn.com/problems/n-queens-ii/)

### 10.[买卖股票的最佳时机](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/)

### 11.[买卖股票的最佳时机 II](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/)

### 12.[买卖股票的最佳时机 III](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iii/)

### 13.[买卖股票的最佳时机 IV](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iv/)

### 14.[买卖股票的最佳时机含手续费](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/)

### 15.[最佳买卖股票时机含冷冻期](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/)

### 16.[打家劫舍](https://leetcode-cn.com/problems/house-robber/)

### 17.[打家劫舍 II](https://leetcode-cn.com/problems/house-robber-ii/)

### 18.[打家劫舍 III](https://leetcode-cn.com/problems/house-robber-iii/)

### 19.[岛屿数量](https://leetcode-cn.com/problems/number-of-islands/)

### 20.[零钱兑换](https://leetcode-cn.com/problems/coin-change/)

### 21.[零钱兑换 II](https://leetcode-cn.com/problems/coin-change-2/)

### 22.[有效的数独](https://leetcode-cn.com/problems/valid-sudoku/)

### 23.[路径总和](https://leetcode-cn.com/problems/path-sum/)

### 24.[路径总和 III](https://leetcode-cn.com/problems/path-sum-iii/)


## 八、其他
### 1.[斐波那契数列](https://www.nowcoder.com/practice/aa8ffe28ec7c4050b2aa8bc9d26710e9?tpId=2&tqId=10852&rp=1&ru=%2Factivity%2Foj&qru=%2Fta%2Ffront-end%2Fquestion-ranking)
```js
function fibonacci(n) {
    return help(n,1,1)
}

// 尾递归优化
function help(n,a,b) {
    if (n <= 2) {
        return b;
    }
    return help(n - 1, b, a+b);
}
```
> 真正实现尾递归优化，只是改写代码优化还不够，还需要编译器或解释器的支持才行

> [尾递归优化原理](https://cloud.tencent.com/developer/article/1553486)

> [leetcode高频题精选](https://segmentfault.com/a/1190000037466967)
>
> [【LeetCode】代码模板，刷题必会](https://blog.csdn.net/fuxuemingzhu/article/details/101900729)


