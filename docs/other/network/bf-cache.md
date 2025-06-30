---
title: 浏览器缓存-BFCache（往返缓存 / Back/Forward Cache）
sidebar: auto
date: 2025-06-30
categories: 
- 浏览器缓存
tags:
- BFCache
---


> 本文深入浅出地讲解 BFCache（往返缓存 / Back/Forward Cache）。这是一个能够极大提升用户体验，特别是移动端体验的关键性能优化技术。

---

### 从浅入深，理解 BFCache

#### 1. 什么是 BFCache？它解决了什么问题？

想象一个常见的场景：

*   你正在手机上浏览一个商品列表页（页面A）。
*   你滚动了很久，找到了一个感兴趣的商品，点击进入了商品详情页（页面B）。
*   看完后，你点击了浏览器的“后退”按钮，想回到刚才的列表页（页面A）。

**没有 BFCache 的情况：**
浏览器会重新加载整个页面A。这意味着：
*   重新请求 HTML、CSS、JS 文件。
*   重新执行 JavaScript，重新渲染 DOM。
*   **你之前滚到的位置丢失了！** 你回到了列表页的顶部，需要重新滚动查找。
*   整个过程很慢，有明显的白屏时间，体验非常糟糕。

**有了 BFCache 的情况：**
当你离开页面A时，现代浏览器会像拍“快照”一样，将整个页面的状态（包括 DOM 树、JavaScript 堆内存、滚动位置等）完整地保存在内存中。

当你点击“后退”按钮时，浏览器会直接从内存中恢复这个“快照”，而不是重新加载。这意味着：
*   页面几乎是**瞬时**恢复。
*   **你之前滚到的位置、填写了一半的表单数据、JS中的变量状态都完美保留。**
*   用户体验如丝般顺滑。

**核心比喻：**
*   **普通加载** = 关掉电脑再重新开机。
*   **BFCache** = 让电脑进入“睡眠”模式，然后瞬间唤醒。

---

#### 2. BFCache 的工作原理和生命周期事件

要利用好 BFCache，我们必须理解它引入的两个关键页面生命周期事件：`pageshow` 和 `pagehide`。这两个事件是为了取代旧的、会破坏 BFCache 的 `load` 和 `unload` 事件而设计的。

##### **`pagehide` 事件**

*   **触发时机**：当用户即将离开当前页面时触发。
*   **关键属性**：事件对象 `event` 中包含一个布尔值 `persisted`。
    *   `event.persisted === true`：表示页面**正在被存入 BFCache**，未来有可能被恢复。
    *   `event.persisted === false`：表示页面**不会被缓存**，将被正常卸载。

##### **`pageshow` 事件**

*   **触发时机**：当用户进入或返回到当前页面时触发。它在传统的 `load` 事件之后触发。
*   **关键属性**：事件对象 `event` 中也包含一个布尔值 `persisted`。
    *   `event.persisted === true`：表示页面是**从 BFCache 中恢复**的。这时 `load` 事件不会触发！
    *   `event.persisted === false`：表示页面是**首次加载**（或浏览器不支持 BFCache）。

##### **代码示例 (TypeScript)**

```typescript
window.addEventListener('pageshow', (event: PageTransitionEvent) => {
  if (event.persisted) {
    // 页面从 BFCache 中恢复
    console.log('This page was restored from the BFCache.');
    // 在这里执行恢复后需要更新的逻辑，比如重新请求实时数据
    refreshRealTimeData();
  } else {
    // 页面是首次加载
    console.log('This page was loaded normally.');
  }
});

window.addEventListener('pagehide', (event: PageTransitionEvent) => {
  if (event.persisted) {
    // 页面即将进入 BFCache
    console.log('This page will be saved in the BFCache.');
    // 在这里可以做一些清理工作，但不能是破坏性的
  } else {
    // 页面将被正常卸载
    console.log('This page will be unloaded.');
  }
});

function refreshRealTimeData() {
  console.log('Fetching fresh data because the page was restored...');
  // 例如：fetch('/api/latest-news').then(...)
}
```

---

#### 3. 为什么我的页面无法进入 BFCache？

这是最关键的实践部分。很多时候我们的页面无法享受 BFCache 带来的好处，通常是因为包含了一些“不兼容”的特性。

**导致 BFCache 失效的常见原因：**

1.  **`unload` 事件监听器：** 这是**头号杀手**。任何在 `window` 上注册的 `unload` 事件都会让浏览器放弃缓存该页面。因为浏览器无法保证 `unload` 里的代码执行后，页面还能被安全地恢复。
    *   **解决方案**：**永远用 `pagehide` 代替 `unload`**。如果你使用的第三方库（比如一些旧的统计脚本）还在用 `unload`，请联系其开发者更新或寻找替代品。

2.  **`Cache-Control: no-store` HTTP 头：** 如果页面响应头中包含 `Cache-Control: no-store`，浏览器会遵从这个指令，不缓存页面。
    *   **注意**：`no-cache` 通常不影响 BFCache，但 `no-store` 会。

3.  **未关闭的连接：**
    *   **WebSocket** 或 **WebRTC** 连接。
    *   **IndexedDB** 事务。
    *   **`fetch` 或 `XMLHttpRequest`** 仍在进行中。
    *   **解决方案**：在 `pagehide` 事件中，妥善关闭这些连接或请求。

4.  **需要用户授权的 API：** 如果页面正在使用摄像头、麦克风或地理位置等需要用户授权的 API，通常无法被缓存。

5.  **`window.opener` 引用：** 如果页面是通过 `window.open` 打开的，并且保留了对父窗口（`window.opener`）的引用，可能会阻止 BFCache。使用 `rel="noopener"` 可以解决这个问题。

**如何检查 BFCache 是否生效？**

**Chrome DevTools** 是你的好朋友：
1.  打开开发者工具 (`F12`)。
2.  进入 `Application` (应用) 面板。
3.  在左侧导航栏找到 `Background services` (后台服务) 下的 `Back/forward cache`。
4.  点击 `Run Test` 按钮。DevTools 会模拟一次往返导航，并告诉你页面是否成功进入 BFCache。如果失败，它会明确列出原因（`Reasons`），例如 "Unload handler"。




---

### 结合实际开发

#### 场景一：H5 开发（如电商、新闻应用）

**问题：** 在一个商品列表页，用户向下滚动了很多，然后进入详情页，再返回。我们希望用户能回到原来的位置，但同时，列表页的某些信息（如库存、最新价格）可能已经过时了。

**解决方案：**

1.  **确保 BFCache 生效**：检查代码，确保没有使用 `unload` 事件，并且没有其他阻止 BFCache 的因素。
2.  **在 `pageshow` 事件中更新数据**：利用 `event.persisted` 来判断页面是否从缓存中恢复。如果是，就发起一个轻量级的数据请求来更新关键信息，同时保留用户的滚动位置。

**示例代码 (TypeScript):**

```typescript
// 在商品列表页的 JS 中
class ProductListPage {
  constructor() {
    this.init();
  }

  init() {
    this.loadInitialData();
    window.addEventListener('pageshow', this.handlePageShow.bind(this));
  }

  handlePageShow(event: PageTransitionEvent) {
    // 只有当页面从 BFCache 恢复时，才执行此逻辑
    if (event.persisted) {
      console.log('Page restored from BFCache. Refreshing stock levels.');
      this.refreshStockLevels();
    }
  }

  loadInitialData() {
    // 首次加载时获取完整数据
    console.log('Loading initial product list...');
  }

  refreshStockLevels() {
    // 发起一个API请求，只获取最新的库存和价格信息
    // fetch('/api/products/stock-updates').then(...)
    // 成功后，只更新DOM中对应的库存和价格部分，不重新渲染整个列表
    // 这样用户的滚动位置和其他状态都得以保留
  }
}

new ProductListPage();
```

#### 场景二：WebView 混合开发 (Hybrid App)

在混合应用中，前端页面运行在 Native App 提供的 WebView（如 iOS 的 WKWebView，Android 的 Chrome WebView）中。

**BFCache 在 WebView 中的表现：**
*   现代的 WebView 已经很好地支持 BFCache。其行为和标准浏览器基本一致。
*   当用户在 WebView 内的页面之间进行前进/后退时，BFCache 会起作用。
*   **注意**：当用户从 WebView **返回到 Native 界面**时，WebView 实例本身可能会被销毁或进入后台，这不属于 BFCache 的范畴。BFCache 只管理 WebView 内部的浏览历史。

**问题：** 一个 WebView 页面依赖 Native 提供的数据。当页面从 BFCache 恢复时，这些数据可能已经因为某些 Native 操作而变得陈旧。

**解决方案：**
建立一个通信机制，在 WebView 重新变为可见时，由 Native 主动通知 H5 页面进行数据刷新。

1.  **Native 端**：监听 WebView 的生命周期（如 `viewWillAppear` on iOS）。当 WebView 即将再次显示时，执行一段 JS 代码来通知 H5 页面。
    ```java
    // Android 示例
    // webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('native-wakeup'))", null);
    ```

2.  **H5 端**：除了监听 `pageshow` 事件，也监听来自 Native 的自定义事件。

**示例代码 (TypeScript):**

```typescript
class HybridPage {
  constructor() {
    this.initListeners();
  }

  initListeners() {
    // 监听 BFCache 恢复
    window.addEventListener('pageshow', (event: PageTransitionEvent) => {
      if (event.persisted) {
        console.log('Restored from BFCache, checking for native updates.');
        this.requestDataFromNative();
      }
    });
  
    // 监听来自 Native 的唤醒通知
    window.addEventListener('native-wakeup', () => {
        console.log('Woken up by native, refreshing data.');
        this.requestDataFromNative();
    });
  }

  requestDataFromNative() {
    // 通过 JSBridge 调用 Native 方法获取最新数据
    // bridge.call('getUserInfo', (userInfo) => { this.updateUI(userInfo); });
    console.log('Requesting fresh data from Native host...');
  }

  updateUI(data: any) {
    // 更新页面内容
  }
}

new HybridPage();
```

### 总结与最佳实践

1.  **拥抱 `pageshow` 和 `pagehide`**：这是利用 BFCache 的基石。
2.  **告别 `unload`**：彻底从你的代码和依赖中移除它。
3.  **善用 DevTools**：定期检查关键页面的 BFCache 兼容性，并根据提示进行修复。
4.  **处理陈旧数据**：在 `pageshow` 事件（当 `event.persisted` 为 `true` 时）中，智能地更新页面所需的核心数据。
5.  **管理好连接**：在 `pagehide` 中清理 WebSocket、XHR 等资源，为页面进入 BFCache 做好准备。

掌握 BFCache 是现代前端工程师提升用户体验的必备技能。它能以极低的成本带来巨大的性能提升，尤其是在网络环境不佳的移动端。
