---
title: Vite 如何优雅地兼容旧版浏览器？
sidebar: auto
isComment: true
categories: 
- Vue
- 前端
tags: 
- JS
- Vue
- Vite
- 兼容性
---

## Vite 打包策略：如何仅让低版本浏览器加载兼容性代码？

这个问题可以拆解为两个部分：
1.  Vite 如何打包以兼容低版本浏览器？
2.  如何智能地只让低版本浏览器加载兼容性代码，而现代浏览器则加载最优代码？

答案是：**Babel 和 Rollup 本身不会自动处理这个问题，但 Vite 通过一个官方插件 `@vitejs/plugin-legacy` 巧妙地利用了它们，并结合浏览器的原生特性，完美地实现了这个需求。**

这个方案通常被称为 **"Differential Loading" (差异化加载)**。

---

### 核心原理：`script type="module"` 和 `nomodule`

这个方案的基石是 HTML `script` 标签的一个非常聪明的特性组合：

1.  **`<script type="module" src="...">`**:
    *   **现代浏览器** (如新版 Chrome, Firefox, Safari) 能够识别 `type="module"`。它们会下载并执行这个脚本。
    *   **旧版浏览器** (如 IE11) 不认识 `type="module"`，因此会 **直接忽略** 这个 `script` 标签，不会下载也不会执行。

2.  **`<script nomodule src="...">`**:
    *   **现代浏览器** 识别 `type="module"`，因此它们也知道 `nomodule` 的含义，所以它们会 **忽略** 带有 `nomodule` 属性的脚本。
    *   **旧版浏览器** 不认识 `nomodule` 属性，它们会把它当作一个未知的布尔属性，但仍然会正常下载并执行这个脚本。

**结论就是：**

*   **现代浏览器**：加载 `type="module"` 的脚本，忽略 `nomodule` 的脚本。
*   **旧版浏览器**：忽略 `type="module"` 的脚本，加载 `nomodule` 的脚本。

这就实现了一个天然的、无需 JavaScript 判断的浏览器分流机制！

---

### `@vitejs/plugin-legacy` 的工作流程

`@vitejs/plugin-legacy` 就是这个机制的自动化实现者。当你配置了它，在执行 `vite build` 时，它会执行以下一系列操作：

#### 1. 生成两套产物 (Bundles)

插件会并行地构建两套 JavaScript 包：
*   **Modern Bundle (现代包)**: 这是 Vite 的默认行为。它使用 esbuild 进行转换，代码非常现代（比如保留 `const`, `let`, 箭头函数等），体积小，性能高。这是为现代浏览器准备的。
*   **Legacy Bundle (旧版包)**: 这是插件的核心工作。
    *   它会调用 **Babel** 和 `@babel/preset-env`。
    *   根据你设定的 `targets` (例如 `'ie 11'`)，Babel 会将现代 JavaScript 语法（ES6+）**降级转换 (Transpile)** 成 ES5 语法。
    *   它还会自动注入必要的 **Polyfills**（通常通过 `core-js`）来模拟那些旧版浏览器缺失的 API（如 `Promise`, `Symbol` 等）。这些 polyfills **只会** 被包含在旧版包中。

#### 2. 修改 `index.html`

构建完成后，插件会自动修改输出目录 (`dist`) 中的 `index.html` 文件，将这两套脚本都注入进去，并正确地设置 `type="module"` 和 `nomodule` 属性。

---

### 实战演练

让我们来看一个完整的配置和产出示例。

#### 步骤 1: 安装插件

```bash
npm install @vitejs/plugin-legacy -D
# 或者 yarn add @vitejs/plugin-legacy -D
```

#### 步骤 2: 配置 `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'; // 以 Vue 为例
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    vue(),
    legacy({
      // 指定需要兼容的浏览器列表
      // 可以使用 browserslist 格式，例如 'defaults' 或 ['> 0.5%', 'last 2 versions', 'not dead']
      targets: ['ie >= 11'], 
    
      // 是否为旧版浏览器生成额外的 polyfills
      // 'usage' 会根据代码中使用到的 API 按需引入
      polyfills: ['es.promise.finally', 'es/map', 'es/set'],

      // 默认情况下，插件还会为旧版 chunk 生成一个 SystemJS 加载器包装
      // 以支持动态导入 `import()`
      modernPolyfills: true, // 为现代浏览器也生成 polyfill，但会通过 `nomodule` 避免加载
    }),
  ],
});
```

#### 步骤 3: 查看构建产物

假设你的源码 `main.ts` 很简单：
```typescript
// src/main.ts
const main = () => {
  console.log("Hello, Vite!");
};
main();
```

当你运行 `vite build` 后，查看 `dist` 目录：

**`dist` 目录结构 (简化后):**

```
dist/
├── assets/
│   ├── main-a1b2c3d4.js         <-- 现代包 (ESM)
│   └── main-legacy-e5f6g7h8.js   <-- 旧版包 (ES5)
├── index.html
└── ...
```

**`dist/index.html` 文件内容 (关键部分):**

```html
<!DOCTYPE html>
<html>
<head>
  <!-- ... -->
  <!-- 现代浏览器加载这个 -->
  <script type="module" crossorigin src="/assets/main-a1b2c3d4.js"></script>

  <!-- 插件注入的 polyfill 加载逻辑 -->
  <script type="module">
    import "vite/modulepreload-polyfill";
  </script>

  <!-- 旧版浏览器加载这个 -->
  <script nomodule crossorigin id="vite-legacy-polyfill" src="/assets/polyfills-legacy-....js"></script>
  <script nomodule crossorigin id="vite-legacy-entry" src="/assets/main-legacy-e5f6g7h8.js"></script>
</head>
<body>
  <!-- ... -->
</body>
</html>
```

如你所见，插件自动生成了带有 `type="module"` 和 `nomodule` 的 `<script>` 标签。

*   一台装有最新 Chrome 的电脑访问这个页面，只会下载 `main-a1b2c3d4.js`，享受到最快的加载和执行速度。
*   一台 IE11 电脑访问这个页面，会忽略第一个 script，转而下载 `polyfills-legacy-....js` 和 `main-legacy-e5f6g7h8.js`，虽然文件更大、执行稍慢，但页面功能可以正常运行。

### 总结：角色分工

| 工具/技术              | 职责                                                               |
| ---------------------- | ------------------------------------------------------------------ |
| **Vite**               | 构建协调器，默认使用 esbuild 生成高性能的现代包。                      |
| **`@vitejs/plugin-legacy`** | **总指挥**。 orchestrates the entire process. 调用 Babel，生成旧版包，并修改 HTML。 |
| **Babel**              | **转换工**。被插件调用，将现代 JS 语法转换为 ES5。                   |
| **Rollup**             | **打包器**。Vite 在生产构建时底层使用 Rollup，插件通过其 API 来创建不同的构建任务。 |
| **`type=module/nomodule`** | **浏览器原生分流器**。是实现差异化加载的最终魔法。                 |

所以，Babel 和 Rollup 是实现这个目标的**关键工具**，但真正将它们组织起来，实现**自动化差异化加载**的是 **`@vitejs/plugin-legacy`**。你作为开发者，只需要配置好这个插件，就能优雅地同时拥抱未来和兼容过去了。

> [HTMLScriptElement: noModule property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement/noModule)
> 
> [nuxt3 兼容处理](../VAR/Vue/nuxt2-to-nuxt3.md)
> 
> [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy#readme)
