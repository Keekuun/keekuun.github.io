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

```js
/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
var longestCommonSubsequence = function(text1, text2) {
    let len1 = text1.length;
    let len2 = text2.length;

    let dp = new Array(len1 + 1).fill(0).map(d => new Array(len2 + 1).fill(0));

    for(let i=1; i<=len1; i++) {
        for(let j=1; j<=len2; j++) {
            if(text1[i-1] === text2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }

    return dp[len1][len2];
};
```

> [DP Table练习工具](https://alchemist-al.com/algorithms/longest-common-subsequence)

### 11.[乘积最大子数组](https://leetcode-cn.com/problems/maximum-product-subarray/)

### 12.[俄罗斯套娃信封问题【排序+最长上升子序列】](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Frussian-doll-envelopes%2F)

```js

/**
 * @param {number[][]} envelopes
 * @return {number}
 */
var maxEnvelopes = function(envelopes) {
  if (envelopes.length === 1) return 1;
    // 安左侧升序，相同，安右侧降序
    // [1,5],[2,5],[2,4], [3,4]
    envelopes.sort((a, b) => {
        if (a[0] !== b[0]) return a[0] - b[0];
        else return b[1] - a[1];
    });
    let LISArr = [];
    for (let [key, value] of envelopes) {
      LISArr.push(value);
    }
    console.log( LISArr);
    return LIS(LISArr);
};
  // 计算最长上升子序列
function LIS(arr) {
  let dp = [];
  let maxAns = 0;
  for (let i = 0; i < arr.length; i++) {
    dp[i] = 1;
  }
  for (let i = 1; i < arr.length; i++) {
    for (let j = i; j >= 0; j--) {
      if (arr[i] > arr[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
      maxAns = Math.max(maxAns, dp[i]);
    }
  }
  return maxAns;
}
```

### 13.[最长连续递增序列【快慢指针】](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Flongest-continuous-increasing-subsequence%2F)

```js

/**
 * @param {number[]} nums
 * @return {number}
 */
var findLengthOfLCIS = function(nums) {
    if (nums.length === 0) return 0;
    const n = nums.length;
    let left = 0, right = 1;
    let globalMaxLen = 1, maxLen = 1;
    while (right < n) {
        if (nums[right] > nums[left]) maxLen++;
        else {
            maxLen = 1;
        }
        left++;
        right++;
        globalMaxLen = Math.max(globalMaxLen, maxLen);
    }
    return globalMaxLen;
};
```

### 14.[最长连续序列 【哈希表】](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Flongest-consecutive-sequence%2F)

```js

/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function(nums) {
    if (nums.length === 0) return 0;
    const set = new Set(nums);
    const n = nums.length;
    let globalLongest = 1;
    for (let i = 0; i < n; i++) {
        if (!set.has(nums[i] - 1)) {
            let longest = 1;
            let currentNum = nums[i];
            while (set.has(currentNum + 1)) {
                currentNum += 1;
                longest++;
            }
            globalLongest = Math.max(globalLongest, longest);
        }
    }
    return globalLongest;
};
```

### 15.[盛最多水的容器【双指针】](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Fcontainer-with-most-water%2F)

```js

/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    let n = height.length;
    let left = 0, right = n - 1;
    let maxOpacity = 0;
    while (left < right) {
        let res = Math.min(height[left], height[right]) * (right - left);
        maxOpacity = Math.max(maxOpacity, res);
        if (height[left] < height[right]) left++
        else right--;
    }
    return maxOpacity;
};

```

### 16.[删除有序数组中的重复项【快慢指针】](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Fremove-duplicates-from-sorted-array%2F)

```js

/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
  if (nums.length <= 1) return nums.length;
  let lo = 0, hi = 0;
  while (hi < nums.length) {
    while (nums[lo] === nums[hi] && hi < nums.length) hi++;
    if (nums[lo] !== nums[hi] && hi < nums.length) {
      lo++;
      nums[lo] = nums[hi];
    }
    hi++;
  }
  return lo + 1;
};


```

### 17.[和为K的子数组【哈希表】](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Fsubarray-sum-equals-k%2F)

```js

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function(nums, k) {
    let cnt = 0;
    let sum0_i = 0, sum0_j = 0;
    let map = new Map();
    map.set(0, 1);
    for (let i = 0; i <= nums.length; i++) {
        sum0_i += nums[i];
        sum0_j = sum0_i - k;
        console.log('map', sum0_j, map.get(sum0_j))
        if (map.has(sum0_j)) {
            cnt += map.get(sum0_j);
        }
        let sumCnt = map.get(sum0_i) || 0;
        map.set(sum0_i, sumCnt + 1);
    }
    return cnt;
};
```

### 17.[接雨水【双指针】](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Ftrapping-rain-water%2F)

```js

/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
    let ans = 0;
    let left = 0, right = height.length - 1;
    let leftMax = 0, rightMax = 0;
    while (left < right) {
        leftMax = Math.max(leftMax, height[left]);
        rightMax = Math.max(rightMax, height[right]);
        if (height[left] < height[right]) {
            ans += leftMax - height[left];
            ++left;
        } else {
            ans += rightMax - height[right];
            --right;
        }
    }
    return ans;
};


```

### 18.[跳跃游戏(贪心)](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Fjump-game%2F)

```js

/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
    let faster = 0;
    for (let i = 0; i < nums.length - 1; i++) {
        faster = Math.max(faster, i + nums[i]);
        if (faster <= i) return false;
    }
    return faster >= nums.length - 1;
};
```

### 19.[用最少数量的箭引爆气球](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Fminimum-number-of-arrows-to-burst-balloons%2F)

```js

/**
 * @param {number[][]} points
 * @return {number}
 */
var findMinArrowShots = function(points) {
  if(points.length < 1) return 0;

  points.sort((a,b) => a[0] - b[0]);

  let ans = 1;

  for(let i=1; i<points.length; i++) {
    if(points[i][0] > points[i-1][1]) {
      ans++;
    } else {
      points[i][1] = Math.min(points[i][1], points[i-1][1])
    }
  }

  return ans;
};
```

### 20.[合并区间](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Fmerge-intervals%2F)

```js
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
  if(intervals.length < 2) return intervals;
  intervals.sort((a,b) => a[0] - b[0]);

  let ans = [intervals[0]];

  for(let i=1; i<intervals.length; i++) {
    let last = ans[ans.length - 1];
    if(last[1] >= intervals[i][0]) {
      last[1] = Math.max(last[1], intervals[i][1])
    } else {
      ans.push(intervals[i])
    }
  }

  return ans;
};
```

### 21.[在排序数组中查找元素的第一个和最后一个位置](https://leetcode-cn.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

```js

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
    const left = leftBound(nums, target);
    const right = rightBound(nums, target);
    return [left, right];
};
function leftBound(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
        let mid = Math.floor(left + (right - left) / 2);
        if (nums[mid] === target) {
            right = mid - 1;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else if (nums[mid] > target) {
            right = mid - 1;
        }
    }
    if (left >= nums.length || nums[left] !== target) {
        return -1;
    }
    return left;
}
function rightBound(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
        let mid = Math.floor(left + (right - left) / 2);
        if (nums[mid] === target) {
            left = mid + 1;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else if (nums[mid] > target) {
            right = mid - 1;
        }
    }
    if (right < 0 || nums[right] !== target) {
        return -1;
    }
    return right;
}


```



## 三、[链表](https://leetcode-cn.com/tag/linked-list/)

### 1.[反转链表](https://leetcode-cn.com/problems/reverse-linked-list/)

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
    if(!head || !head.next) return head;
    
    let next = head.next;
    let last = reverseList(next);
    next.next = head;
    head.next = null;
    
    return last;
}
```



### 2.[反转链表 II](https://leetcode-cn.com/problems/reverse-linked-list-ii/)

### 3.[旋转链表](https://leetcode-cn.com/problems/rotate-list/)

### 4.[合并两个有序链表](https://leetcode-cn.com/problems/merge-two-sorted-lists/)

### 5.[环形链表](https://leetcode-cn.com/problems/linked-list-cycle/)

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
    if(!head || !head.next) return false;
    
    let slow = head, fast = head;
    
    while(fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if(slow === fatse) return true;
    }
    
    return false;
}
```



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

### 8.[合并k个升序链表](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Fmerge-k-sorted-lists%2F)

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function(lists) {
    if(lists.length === 0) return null;
    
    return mergeArr(lists)
}

// 归并排序
function mergeArr(lists) {
    if(lists.length < 2) return lists[0];
    let index = Math.floor(lists.length / 2);
    const left = mergeArr(lists.slice(0, index));
    const right = mergeArr(lists.slice(index));
    
    return merge(left, right);
}

function merge(l1, l2) {
    if(l1 === null || l2 === null) return l1 || l2;
    
    let head = null, newHead = null;
    
    while(l1 !== null && l2 !== null) {
        if(l1.val < l2.val) {
            if(!head) {
                head = l1;
                newHead = l1;
            } else {
                newHead.next = l1;
                newHead = l1;
            }
            l1 = l1.next
        } else {
            if(!head) {
                head = l2;
                newHead = l2;
            } else {
                newHead.next = l2;
                newHead = l2;
            }
            l2 = l2.next
        }
    }
    
    newHead.next = l1 || l2;
    
    return head;
}
```

### 9.[K个一组翻转链表](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Freverse-nodes-in-k-group%2F)

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var reverseKGroup = function(head, k) {
    let a = head, b = head;
    
    // 先找到第一组k的分界节点
    for(let i=0; i<k; i++) {
        if(b===null) return head;
        b = b.next;
    }
    // 翻转head和分界节点之间的节点b（翻转链表）
    const newHead = reverse(a, b);
    // 继续翻转b之后的节点
    a.next = reverseGroup(b, k);
    return newHead;
}

// 翻转a,b节点之间的节点
function reverse(a, b) {
    let prev = null, cur = a, next;
    
    while(cur !== b) {
        next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;
    }
    
    return prev;
}
```

### 10.[排序链表](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Fsort-list%2F)

```js

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var sortList = function(head) {
    if (head == null) return null;
    let newHead = head;
    return mergeSort(head);
};
function mergeSort(head) {
    if (head.next != null) {
        let slower = getCenter(head);
        let nxt = slower.next;
        slower.next = null;
        const left = mergeSort(head);
        const right = mergeSort(nxt);
        head = merge(left, right);
    }
    return head;
}
function merge(left, right) {
    let newHead = null, head = null;
    while (left != null && right != null) {
        if (left.val < right.val) {
            if (!head) {
                newHead = left;
                head = left;
            } else {
                newHead.next = left;
                newHead = newHead.next;
            }
            left = left.next;
        } else {
            if (!head) {
                newHead = right;
                head = right;
            } else {
                newHead.next = right;
                newHead = newHead.next;
            }
            right = right.next;
        }
    }
    newHead.next = left ? left : right;
    return head;
}
function getCenter(head) {
    let slower = head, faster = head.next;
    while (faster != null && faster.next != null) {
        slower = slower.next;
        faster = faster.next.next;
    }
    return slower;
}

```

### 11.[相交链表](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Fintersection-of-two-linked-lists%2F)

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
    
    let a = headA, b = headB;
    
    while(a !== b) {
       a = a === null ? headB : a.next;
       b = b === null ? headA : b.next;
    }
    
    return a;
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

## 六.[队列和广度优先搜索（BFS）]

### 1.[完全平方数](https://leetcode-cn.com/problems/perfect-squares/solution/xiang-xi-tong-su-de-si-lu-fen-xi-duo-jie-fa-by--51/)

### 2.[路径总和](https://leetcode-cn.com/problems/path-sum/)

### 3.[二叉树的层序遍历](https://leetcode-cn.com/leetbook/read/data-structure-binary-tree/xefh1i/)

### 4.[解数独]
```js
/**
 * @param {string[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solveSudoku = function(/** @type {any} */ board) {
  backtrack(board);
};

/**
 * @param {string | any[]} board
 */
function backtrack(board) {
  for(let i = 0; i < board.length; i++) {
    for(let j = 0; j < board[0].length; j++) {
      if(board[i][j] !== '.') continue;

      for(let k = 1; k <= 9; k++) {
        if(isValid(board, i, j, k.toString())) {
          board[i][j] = k.toString();
          if(backtrack(board)) return true;
          board[i][j] = '.';
        }
      }
      return false;
    }
  }

  return true;
}

/**
 * @param {string | any[]} board
 * @param {number} row
 * @param {number} col
 * @param {string} val
 */
function isValid(board, row, col, val) {
  for(let i = 0; i < 9; i++) {
    if(board[row][i] === val) {
      return false;
    }
  }

  for(let i = 0; i < 9; i++) {
    if(board[i][col] === val) {
      return false;
    }
  }

  const m = Math.floor(row / 3) * 3;
  const n = Math.floor(col / 3) * 3;
  for(let i = m; i < m + 3; i++) {
    for(let j = n; j < n + 3; j++) {
      if(board[i][j] === val) {
        return false;
      }
    }
  }

  return true;
}

```

### 5.迷宫问题
```js
/**
 * @param {number[][]} [grid]
 * @param {number} [row]
 * @param {number} [col]
 */
const grid = [
          [0, 1, 0, 0, 0],
          [0, 1, 0, 1, 0],
          [0, 0, 0, 0, 1],
          [0, 1, 1, 1, 0],
          [0, 0, 0, 0, 0],
        ];
const row = 5;
const col = 5;

function resolveMaze(grid = [], row = 1, col = 1) {
  /** @type {number[][]} */
  const res = [];
  const visited = new Map();
  const direction = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  backtrack(grid, 0, 0);

  /**
     * @param {number[][]} arr
     * @param {number} m
     * @param {number} n
     */
  function backtrack(arr, m, n) {
    // 到达终点
    if(m === row - 1 && n === col - 1) {
      res.push([m, n]);

      for(const item of res) {
        console.log(`(${item[0]},${item[1]})`);
      }
      return true;
    }
    if(m < 0 || n < 0 || m >= row || n >= col || visited.has(`${m},${n}`)){
      return false;
    }
    if(grid[m][n] === 1) return false;

    // 记录
    visited.set(`${m},${n}`, true);
    res.push([m, n]);
    // 做选择
    for(let i = 0; i < direction.length; i++) {
      const _row = m + direction[i][0];
      const _col = n + direction[i][1];
      if(backtrack(grid, _row, _col)) {
        return true;
      }
    }

    // 撤销
    visited.delete(`${m},${n}`);
    res.pop();

    return false;
  }
  return res;
}
```

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

### 19.[搜索树中的 二分查找](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Fsearch-in-a-binary-search-tree%2F)

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
 * @param {number} val
 * @return {TreeNode}
 */
var searchBST = function(root, val) {
    if (root == null) return null;
    if (root.val === val) return root;
    if (root.val > val) {
        return searchBST(root.left, val);
    } else if (root.val < val) {
        return searchBST(root.right, val);
    }
};


```



## 八、[动态规划](https://leetcode-cn.com/tag/dynamic-programming/)

### 1.[编辑距离](https://leetcode-cn.com/problems/edit-distance/)

### 2.[滑动窗口最大值](https://leetcode-cn.com/problems/sliding-window-maximum/)

### 3.[滑动窗口中位数](https://leetcode-cn.com/problems/sliding-window-median/)

### 4.[最长上升子序列](https://leetcode-cn.com/problems/longest-increasing-subsequence/)

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
    if(!nums || !nums.length) return 0;
    let dp = new Array(nums.length).fill(1);
    
    for(let i=0; i<nums.length; i++) {
        for(let j=i; j>=0; j--) {
            if(nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    
    return Math.max(...dp)
}
```



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

```js

/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
  if (amount === 0) return 0;
  let dp = [];
  for (let i = 0; i <= amount; i++) {
    dp[i] = amount + 1;
  }
  dp[0] = 0;
  for (let i = 0; i <= amount; i++) {
    for (let j = 0; j < coins.length; j++) {
      if (i >= coins[j]) {
        dp[i] = Math.min(dp[i - coins[j]] + 1, dp[i])
      }
    }
  }
  return dp[amount] > amount ? -1 : dp[amount];
};
```



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


### 2.字符串加法

```js
function strAdd(a, b) {
    let i = a.toString().trim().length;
    let j = b.toString().trim().length;
    
    let ans = '';
    let carry = 0;
    
    while(i >=0 || j >=0) {
      let sum;
      let x=0, y=0;
      
      if(i>=0) {
          x = +a[i];
          i--;
      }
      
      if(j>=0) {
          y = +b[i];
          j--;
      }
      
      sum = x + y + carry;
      if(sum >= 10) {
          carry = Math.floor(sum / 10);
          sum = sum % 10;
      } else {
          carry = 0;
      }
      
      ans = sum  + ans;
    }
    
    if(carry) {
        ans = carry + ans;
    }
    
    return ans;
}
```


### 3.字符串乘法
```js
function strMul(a, b) {
    a = a.toString().trim();
    b = b.toString().trim();
    
    let m = a.length;
    let n = b.length;
    let arr = new Array(m + n).fill(0);
    
    // 从个位开始相乘
    for(let i=m-1; i>=0; i--) {
        for(let j=n-1; j>=0; j--) {
            let mul = a[i] * b[j];
            let p1 = i + j;
            let p2 = i + j + 1;
            let sum = mul + arr[p2];
            arr[p2] = sum % 10;
            arr[p1] += ~~(sum / 10);
        }
    }
    
    // 去除首位多余的0
    let i=0;
    while(i<arr.length && arr[i]===0) {
        i++;
    }
    
    return arr.slice(i).join('') || '0';
}
```

### 4.[最长回文子串](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Flongest-palindromic-substring%2F)

```js

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    if(s.length < 2) return s;
    let ans = '', max = 0;
    
    for(let i=0; i<s.length; i++) {
        let str1 = palindrome(s, i, i);
        let str2 = palindrom(s, i, i+1);
        ans = max < str1.length ? (str1.length < str2.length ? str2 : str1) : ans;
        max = Math.max(max, str1.length, str2.length);
    }
}

function palindrome(s, l, r) {
    while(l >= 0 && r<s.length && s[l]===s[r]) {
        l--;
        r++;
    }
    
    return s.slice(1+1, r);
}
```

### 5.[最长公共前缀](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Flongest-common-prefix%2F)

```js

/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
    if (strs.length === 0) return "";
    let first = strs[0];
    if (first === "") return "";
    let minLen = Number.MAX_SAFE_INTEGER;
    for (let i = 1; i < strs.length; i++) {
        const len = twoStrLongestCommonPrefix(first, strs[i]);
        minLen = Math.min(len, minLen);
    }
    return first.slice(0, minLen);
};
function twoStrLongestCommonPrefix (s, t) {
    let i = 0, j = 0;
    let cnt = 0;
    while (i < s.length && j < t.length) {
        console.log(s[i], t[j], cnt)
        if (s[i] === t[j])  {
            cnt++;
        } else {
            return cnt;
        }
        i++;
        j++;
    }
    return cnt;
}
```

### 6.[无重复字符的最长子串](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Flongest-substring-without-repeating-characters%2F)

```js

/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
  let window = {};
  let left = 0, right = 0;
  let maxLen = 0, maxStr = '';
  while (right < s.length) {
    let c = s[right];
    right++;
    if (window[c]) window[c]++;
    else window[c] = 1
    while (window[c] > 1) {
      let d = s[left];
      left++;
      window[d]--;
    }
    if (maxLen < right - left) {
      maxLen = right - left;
    }
  }
  return maxLen;
};
```

### 7.[ 最小覆盖子串【滑动窗口】](https://link.juejin.cn/?target=https%3A%2F%2Fleetcode-cn.com%2Fproblems%2Fminimum-window-substring%2F)

```js

/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {
    let need = {}, window = {};
    // 1.记录需要的字符数
    for (let c of t) {
        if (!need[c]) need[c] = 1;
        else need[c]++;
    }
    // 双指针
    let left = 0, right = 0;
    // 记录需要的数量
    let valid = 0, len = Object.keys(need).length;
    // 记录结果
    let minLen = s.length + 1, minStr = '';
    // right指针先走
    while (right < s.length) {
        const d = s[right];
        right++;
        if (!window[d]) window[d] = 1;
        else window[d]++;
        // 2.记录达标的数量
        if (need[d] && need[d] === window[d]) {
            valid++;
        }
        console.log('left - right', left, right);
        // 3.直到刚好满足需求
        while (valid === len) {
            // 更新结果
            if (right - left < minLen) {
                minLen = right - left;
                minStr = s.slice(left, right);
            }
            console.lo
            // 4.缩小范围
            let c = s[left];
            left++;
            window[c]--;
            if (need[c] && window[c] < need[c]) {
                valid--;
            }
        }
    }
    return minStr;
};
```