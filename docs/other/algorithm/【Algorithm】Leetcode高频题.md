---
title: 【Algorithm】算法训练题
sidebar: auto
date: 2021-08-01
categories:
- 算法
tags:
- 算法

---

# 1. [Flood Fill算法](https://mp.weixin.qq.com/s/Y7snQIraCC6PRhj9ZSnlzw)

  > [leetcode-颜色填充](https://leetcode-cn.com/problems/color-fill-lcci/)

```
颜色填充
  输入：
  image = [
            [1, 1, 1],
            [1, 1, 0],
            [1, 0, 1]
          ]
  已知： sr = 1, sc = 1, newColor = 2
  输出：
          [
            [2, 2, 2],
            [2, 2, 0],
            [2, 0, 1]
          ]     

  解析：
    坐标（sr,sc） = (1,1),在图像的正中间，与其相连的所有符合条件的像素点的颜色都被更改为2。
    注意，右下角的像素没有被更改为2，因为它不是上下左右四个方向与初始点相连的像素点
```

```js
/**
 * @param {number[][]} image
 * @param {number} sr
 * @param {number} sc
 * @param {number} newColor
 * @return {number[][]}
 */
var floodFill = function(image, sr, sc, newColor) {
          if(!image) return;
          let originColor = image[sr][sc];
          fill(image, sr, sc, originColor, newColor);
          return image;
        };

function fill(image, sr, sc, originColor, newColor) {
    // 出界
    if(!isValid(image, sr, sc)) return;
    // 碰壁
    if(image[sr][sc] !== originColor) return;
    // 已访问过
    if(image[sr][sc] === -1) return;
    // 打标记
    image[sr][sc] = -1;
    fill(image, sr - 1, sc, originColor, newColor);
    fill(image, sr + 1, sc, originColor, newColor);
    fill(image, sr, sc - 1, originColor, newColor);
    fill(image, sr, sc + 1, originColor, newColor);
    // 回溯
    image[sr][sc] = newColor;
}

function isValid(image, sr, sc) {
    return sr >= 0 && sr <image.length && sc >= 0 && sc < image[0].length;
}
```

# 2.[团灭 LeetCode 股票买卖问题](https://mp.weixin.qq.com/s/lQEj_K1lUY83QtIzqTikGA)

```markdown
                       

        |----------- buy ----------->
        |                           |
        rest                        rest
    [0]<-->[0]                  [1]<-->[1]
        |                           |
        |<----------- sell ---------|   

    [第i天][持有k只股票][不买卖]    =     max([第i-1天][持有k只股票][不买卖]， [第i-1天][持有k-1只股票][卖一只])  
            dp[i][k][0]         =     max(dp[i-1][k][0],                dp[i-1][k][1] + prices[i])

    [第i天][持有k只股票][买卖]    =     max([第i-1天][持有k只股票][不买卖]， [第i-1天][持有k-1只股票][买一只])  
            dp[i][k][1]         =     max(dp[i-1][k][1],                dp[i-1][k-1][0] - prices[i])
```
## 2.1 [买卖股票的最佳时机 K=1](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/)

```markdown
给定一个数组 prices ，它的第i 个元素prices[i] 表示一支给定股票第 i 天的价格。

你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。

返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。
```
```js
/**
 * @param {number[]} prices
 * @return {number}
 */

// 最低点买入，最高点卖出
var maxProfit = function(prices) {
  if(!prices || !prices.length < 2) return 0;

  let minPrice = prices[0];
  let ans = 0;

  for(let i=0; i<prices.length; i++) {
    if(prices[i] < minPrice) {
      minPrice = prices[i];
    }

    ans = Math.max(ans, prices[i] - minPrice);
  }

  return ans;
};
```

## 2.2 [买卖股票的最佳时机 II k=Infinity](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/)
```markdown
给定一个数组 prices ，其中prices[i] 是一支给定股票第 i 天的价格。

设计一个算法来计算你所能获取的最大利润。你可以尽可能地完成更多的交易（多次买卖一支股票）。

注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）
```
```js
// 1.贪心
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    if(!prices || prices.length < 2) return 0;
    
    let ans = 0;
    for(let i=1; i<prices.length; i++) {
        if(prices[i] > prices[i-1]) {
            ans += prices[i] - prices[i-1];
        }
    }
    return ans;
};

// 2.动态规划
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
  if(!prices || prices.length < 2) return 0;

  let dp = new Array(prices.length).fill(0).map(d => new Array(2).fill(0));
  dp[0][0] = 0;
  dp[0][1] = -prices[0];
  for(let i=1; i<prices.length; i++) {
    dp[i][0] = Math.max(dp[i-1][0], dp[i-1][1] + prices[i]);
    dp[i][1] = Math.max(dp[i-1][0] - prices[i], dp[i-1][1]);
  }

  return dp[prices.length - 1][0];
};
```
## 2.3 [买卖股票的最佳时机 III k=2](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iii/)
```markdown

给定一个数组，它的第 i 个元素是一支给定的股票在第 i 天的价格。

设计一个算法来计算你所能获取的最大利润。你最多可以完成 两笔 交易。

注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
```

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    if(!prices || prices.length < 2) return 0;
    
    let res = 0;
    // 第一天 [交易0次，交易1次，交易2次] k
    // [没有股票，有股票] 0/1
    let profit = [[[0, -prices[0]], [0, -prices[0]], [0, 0]]];
    // DP方程 MP[i][j][k] 第i天，持有1股，买卖2次
    for (var i = 1; i < prices.length; i++) {
      // 初始化值，买卖2次, [没有股票，有股票] 0/1
      profit.push([[0, 0], [0, 0], [0, 0]])

      // 未做交易
      profit[i][0][0] = profit[i - 1][0][0];
      profit[i][0][1] = Math.max(profit[i - 1][0][1], profit[i - 1][0][0] - prices[i]);
      // 交易1次
      profit[i][1][0] = Math.max(profit[i - 1][1][0], profit[i - 1][0][1] + prices[i]);
      profit[i][1][1] = Math.max(profit[i - 1][1][1], profit[i - 1][1][0] - prices[i]);
      // 交易2次
      profit[i][2][0] = Math.max(profit[i - 1][2][0], profit[i - 1][1][1] + prices[i]);
    }
    // 求最大值
    let end = prices.length - 1;
    res = Math.max(profit[end][0][0], profit[end][1][0], profit[end][2][0]);
    return res;
};


/**
 * @param {number[]} prices
 * @return {number}
 */
/**
 对于任意一天考虑四个变量:
 buy1: 在该天第一次买入股票可获得的最大收益
 sell1: 在该天第一次卖出股票可获得的最大收益
 buy2: 在该天第二次买入股票可获得的最大收益
 sell2: 在该天第二次卖出股票可获得的最大收益
 分别对四个变量进行相应的更新, 最后secSell就是最大
 收益值(secSell >= fstSell)
 **/
var maxProfit = function(prices) {
  let buy1 = -Infinity, sell1 = 0;
  let buy2 = -Infinity, sell2 = 0;

  for(let p of prices) {
    buy1 = Math.max(buy1, -p);
    sell1 = Math.max(sell1, buy1 + p);
    buy2 = Math.max(buy2, sell1-p);
    sell2 = Math.max(sell2, buy2 + p);
  }

  return sell2;
};
```

## 2.4 [买卖股票的最佳时机 IV k=k](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iv/)
```markdown
给定一个整数数组 prices ，它的第 i 个元素 prices[i] 是一支给定的股票在第 i 天的价格。

设计一个算法来计算你所能获取的最大利润。你最多可以完成 k 笔交易。

注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
```


## 2.5 [买卖股票的最佳时机含手续费 k=1,fee](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/)
```markdown
给定一个整数数组 prices，其中第 i 个元素代表了第 i 天的股票价格 ；整数 fee 代表了交易股票的手续费用。

你可以无限次地完成交易，但是你每笔交易都需要付手续费。如果你已经购买了一个股票，在卖出它之前你就不能再继续购买股票了。

返回获得利润的最大值。

注意：这里的一笔交易指买入持有并卖出股票的整个过程，每笔交易你只需要为支付一次手续费。
```

## 2.6 [最佳买卖股票时机含冷冻期 k=Infinity, cd](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/)

```markdown
给定一个整数数组，其中第 i 个元素代表了第 i 天的股票价格 。​

设计一个算法计算出最大利润。在满足以下约束条件下，你可以尽可能地完成更多的交易（多次买卖一支股票）:

你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
卖出股票后，你无法在第二天买入股票 (即冷冻期为 1 天)。
```

> [手撕力扣高频面试题](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MzAxODQxMDM0Mw==&scene=1&album_id=1318896187793260544&count=3#wechat_redirect)
