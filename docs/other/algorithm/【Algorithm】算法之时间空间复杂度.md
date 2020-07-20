---
title: 【Algorithm】算法学习笔记
date: 2020-6-18
categories: 
- 其他
tags: 
- Algorithm
---

# 算法学习笔记



![](E:\blog\images\algorithm\MorphingShapes_615x400.gif)

## 一、时间空间复杂度

### 1. 时间复杂度——大O表示法

![](https://pic4.zhimg.com/80/v2-7e3d504db660e31ba1b932ace381840f_720w.jpg)

> [图：从经典算法题看时间复杂度](https://zhuanlan.zhihu.com/p/73731500)
>
> [如何理解算法时间复杂度的表示法，例如 O(n²)、O(n)、O(1)、O(nlogn) 等？](https://www.zhihu.com/question/21387264)

算法的**时间复杂度**（Time complexity）是一个**函数**，用于定性描述算法的运行时间。一般我们我们评估一个算法都是直接评估它的**最坏的复杂度**。

### 2. 常见时间复杂度

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

