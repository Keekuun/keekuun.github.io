---
title: 【工具】录一些实用的ts工具函数
date: 2020-12-21
sidebar: auto
categories: 
- 其他
tags:
- ts
---

# 记录一些实用的ts工具函数

## 1.数组对象按key去重

```ts
export function uniqueArrObjByKey<T>(arr: T[], key?: keyof T): T[] {
  if (!key) {
    return [...new Set(arr)];
  }

  const res: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    const has = res.some(d => d[key] === arr[i][key]);
    if (!has) {
      res.push(arr[i]);
    }
  }

  return res;
}
```
