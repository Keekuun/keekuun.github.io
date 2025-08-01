---
title: React SPA i18n国际化方案
date: 2025-07-12
sidebar: auto
categories: 
- React
- 前端
tags: 
- React
- i18n
---

方案总览：
*   **成熟稳定**：`i18next` 是最流行、功能最强大的 i18n 框架之一。
*   **React 友好**：`react-i18next` 提供了 Hooks (`useTranslation`) 和组件 (`Trans`)，完美融入 React 开发模式。
*   **可扩展性强**：支持插件，如自动语言检测、懒加载翻译文件等。
*   **类型安全**：我们将利用 TypeScript 来确保翻译键的正确性，杜绝拼写错误。

---

## 步骤指南：

我们将按照以下步骤进行：

1.  **安装依赖**
2.  **创建翻译文件**
3.  **配置 i18next**
4.  **在 React 应用根目录中集成**
5.  **在组件中使用翻译**
6.  **创建语言切换器**
7.  **(推荐) 配置类型安全**

### 第 1 步：安装依赖库

我们需要安装核心库以及一些非常有用的插件：
*   `i18next`: i18n 核心框架。
*   `react-i18next`: 连接 i18next 和 React 的桥梁。
*   `i18next-browser-languagedetector`: 自动检测用户浏览器语言的插件。
*   `i18next-http-backend`: 从服务器懒加载翻译文件的插件，能有效减小初始包体积。
*   `i18next-icu`: 使用 ICU 语法定义复杂文本(处理单复数、货币等)

```bash
# 使用 npm
npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend i18next-icu

# 或者使用 yarn
yarn add i18next react-i18next i18next-browser-languagedetector i18next-http-backend i18next-icu

# 或者使用 pnpm
pnpm add i18next react-i18next i18next-browser-languagedetector i18next-http-backend i18next-icu
```

### 第 2 步：创建翻译文件

一个良好的项目结构至关重要。我们通常在 `public` 目录下创建 `locales` 文件夹，这样翻译文件就不会被打包进 JS bundle，而是作为静态资源按需加载。

**项目结构:**
```
/public
  /locales
    /en            <-- 英语
      translation.json
    /zh-CN         <-- 简体中文
      translation.json
/src
  /components
  App.tsx
  main.tsx
  i18n.ts          <-- i18n 配置文件
  ...
```

**`public/locales/en/translation.json`**:
```json
{
  "welcome_message": "Welcome to React",
  "app_title": "My Awesome App",
  "learn_react": "Learn <strong>React</strong> Now",
  "user_greeting": "Hello, {{name}}!"
}
```

**`public/locales/zh-CN/translation.json`**:
```json
{
  "welcome_message": "欢迎来到 React",
  "app_title": "我的超赞应用",
  "learn_react": "现在就学习 <strong>React</strong>",
  "user_greeting": "你好, {{name}}!"
}
```
> **注意**:
> *   `{{name}}` 是变量插值的语法。
> *   `<strong>` 标签用于演示如何在翻译中嵌入 HTML。

### 第 3 步：配置 i18next (`src/i18n.ts`)

这是 i18n 设置的核心文件。

```typescript
// src/i18n.ts
import i18n from 'i18next';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(ICU)
  // 注入 http-backend 插件，用于懒加载翻译文件
  .use(HttpApi)
  // 注入 language-detector 插件，自动检测语言
  .use(LanguageDetector)
  // 注入 initReactI18next 实例，将 i18n 实例传递给 react-i18next
  .use(initReactI18next)
  // 初始化 i18next
  .init({
    // 支持的语言列表
    supportedLngs: ['en', 'zh-CN'],
  
    // 默认语言
    fallbackLng: 'en',
  
    // 默认的命名空间（通常一个应用有一个 'translation' 就够了）
    ns: 'translation',
    defaultNS: 'translation',

    // 配置 language-detector
    detection: {
      // 检测顺序
      order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      // 缓存用户选择的语言到哪里
      caches: ['cookie'],
    },

    // 配置 http-backend
    backend: {
      // 翻译文件的加载路径
      // lng: 语言, ns: 命名空间
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // react-i18next 的特定配置
    react: {
      // 由于翻译文件是懒加载的，需要 Suspense
      useSuspense: true,
    },
  
    // 关闭插值转义，因为 React 默认已经防御了 XSS
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

### 第 4 步：在 React 应用根目录中集成

在 `main.tsx` (或 `index.tsx`) 中，我们需要导入配置文件，并使用 React 的 `Suspense` 组件来处理翻译文件的异步加载。

```typescript
// src/main.tsx
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 导入 i18n 配置文件，这会执行初始化
import './i18n'; 

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* 
      Suspense 用于在翻译文件加载完成前显示一个后备 UI。
      这是懒加载模式下的必需品。
    */}
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);

```

#### 第 5 步：在组件中使用翻译

现在，我们可以在任何组件中使用 `useTranslation` hook 来获取翻译函数 `t` 和 i18n 实例。

+ 函数组件：
```typescript
// src/App.tsx
import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher'; // 我们稍后会创建这个组件

function App() {
  // 从 hook 中获取 t (翻译函数) 和 i18n (i18next 实例)
  const { t } = useTranslation();
  const userName = "Alice";

  return (
    <div>
      <header>
        {/* 创建语言切换器 */}
        <LanguageSwitcher />
        <h1>{t('app_title')}</h1>
      </header>
      <main>
        <h2>{t('welcome_message')}</h2>
      
        {/* 使用变量插值 */}
        <p>{t('user_greeting', { name: userName })}</p>

        {/* 
          对于包含 HTML 标签的复杂翻译，使用 Trans 组件是最佳实践。
          它既能安全地渲染 HTML，又能保持翻译文本的完整性。
        */}
        <p>
          <Trans i18nKey="learn_react">
            Learn <strong>React</strong> Now
          </Trans>
        </p>
      </main>
    </div>
  );
}

export default App;
```

+ 类组件：
```typescript
 // MyComponent.js
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

class MyComponent extends Component {
  render() {
    const { t, i18n } = this.props;

    // 切换语言的方法
    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
    };

    return (
      <div>
        <h1>{t('welcome')}</h1>
        <p>{t('description', { appName: 'MyApp' })}</p>
        <p>{t('message', { name: 'Alice', numPhotos: 3 })}</p>

    <button onClick={() => changeLanguage('en')}>English</button>
    <button onClick={() => changeLanguage('zh')}>中文</button>
    </div>
  );
  }
}

// 使用 withTranslation 高阶组件包装组件
export default withTranslation()(MyComponent);
```

ICU 格式示例：

在翻译文件中使用 ICU 语法定义复杂文本, 例如处理英语单复数：
```json
{
  "message": "{name} has {numPhotos, plural, =0 {no photos.} =1 {one photo.} other {# photos.}}"
}
```

> [ICU Message Syntax Tester](https://simplelocalize.io/tools/icu-message-syntax-tester/)

#### 第 6 步：创建语言切换器

这个组件允许用户手动更改应用的语言。

```typescript
// src/components/LanguageSwitcher.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', lang: 'English' },
  { code: 'zh-CN', lang: '简体中文' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      {languages.map((lng) => (
        <button
          key={lng.code}
          // 高亮当前语言的按钮
          style={{ fontWeight: i18n.language === lng.code ? 'bold' : 'normal' }}
          onClick={() => changeLanguage(lng.code)}
          // 禁用当前已选语言的按钮
          disabled={i18n.language === lng.code}
        >
          {lng.lang}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
```

#### 第 7 步：(强烈推荐) 配置类型安全

这是提升开发体验和代码健壮性的关键一步！我们将让 TypeScript 知道我们有哪些翻译键。

1.  在 `src` 目录下创建一个类型声明文件 `react-i18next.d.ts`。

2.  在该文件中添加以下内容：

```typescript
// src/react-i18next.d.ts
import 'react-i18next';
// 导入你的默认命名空间（通常是 translation）的 JSON 文件类型
import translation from '../public/locales/en/translation.json';

// 声明模块来扩展 react-i18next 的类型
declare module 'react-i18next' {
  // 扩展 CustomTypeOptions 接口
  interface CustomTypeOptions {
    // 定义默认命名空间
    defaultNS: 'translation';
    // 定义资源类型，让 ts 知道我们的翻译键
    resources: {
      translation: typeof translation;
    };
  }
}
```

**现在，你的 `t` 函数就拥有了智能提示和类型检查！**



如果你在代码中写了 `t('welcome_mesage')` (拼写错误)，TypeScript 会立刻报错，从而在开发阶段就帮你捕获了 bug。

---

## 总结

现在已经为 React SPA 成功集成了一个功能完备、可扩展且类型安全的 i18n 系统。

**关键点**：
*   **库**：`react-i18next` + `i18next` 是黄金搭档。
*   **结构**：将翻译文件放在 `public/locales` 中，利用 `i18next-http-backend` 按需加载。
*   **配置**：在 `i18n.ts` 中集中管理配置，包括语言检测和后备逻辑。
*   **集成**：在 `main.tsx` 中使用 `Suspense` 包裹 App。
*   **使用**：
    *   `useTranslation` Hook 用于简单文本和变量。
    *   `Trans` 组件用于包含 JSX/HTML 的复杂文本。
*   **类型安全**：通过 `react-i18next.d.ts` 声明文件，获得无与伦比的开发体验。
