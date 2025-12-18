---
title: Label Studio Editor 国际化(i18n)实现指南
date: 2025-12-01
isComment: true
categories: 
- Label Studio
tags: 
- Label Studio
- i18n
---

# Label Studio Editor 国际化(i18n)实现指南

## 目录

- [概述](#概述)
- [架构设计](#架构设计)
- [快速开始](#快速开始)
- [核心配置](#核心配置)
- [使用方法](#使用方法)
- [翻译文件管理](#翻译文件管理)
- [最佳实践](#最佳实践)
- [常见场景](#常见场景)
- [语言切换](#语言切换)
- [故障排除](#故障排除)
- [扩展新语言](#扩展新语言)

---

## 概述

Label Studio Editor 使用 **react-i18next** 库实现国际化功能，当前支持：
- **英语 (en)** - 默认语言
- **简体中文 (zh)** - 中文翻译

### 技术栈

- **i18next**: 核心 i18n 框架
- **react-i18next**: React 集成层
- **i18next-browser-languagedetector**: 自动语言检测

### 特性

✅ 自动语言检测（基于浏览器、Cookie、URL 参数等）  
✅ TypeScript 类型安全支持  
✅ 动态语言切换  
✅ 命名空间支持  
✅ 插值和变量替换  
✅ HTML 内容支持（使用 Trans 组件）  

---

## 架构设计

### 文件结构

```
web/libs/editor/src/i18n/
├── index.ts                    # i18n 初始化和配置
├── LanguageSwitcher.tsx        # 语言切换组件
├── LanguageSwitcher.css        # 样式文件
├── react-i18next.d.ts          # TypeScript 类型声明
└── locales/                    # 翻译文件目录
    ├── en/
    │   └── translations.ts     # 英文翻译
    └── zh/
        └── translations.ts     # 中文翻译
```

### 工作流程

```
┌─────────────────────────────────────────────────────────────┐
│                    应用启动                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              i18n 初始化 (index.ts)                          │
│  - 加载语言检测器                                              │
│  - 注入 React i18next                                        │
│  - 加载翻译资源                                                │
│  - 配置检测顺序和缓存                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                语言检测                                       │
│  检测顺序:                                                    │
│  1. URL 查询参数 (?lng=zh)                                   │
│  2. Cookie                                                  │
│  3. localStorage                                            │
│  4. 浏览器语言设置                                             │
│  5. HTML tag                                                │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│            组件中使用翻译                                      │
│  - useTranslation() Hook                                    │
│  - i18n.t() 直接调用                                          │
│  - <Trans> 组件                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 快速开始

### 1. 在组件中使用 Hook

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <button onClick={() => i18n.changeLanguage('zh')}>
        切换到中文
      </button>
    </div>
  );
};
```

### 2. 直接使用 i18n 实例

```tsx
import i18n from 'i18next';

// 在非组件代码中使用
const message = i18n.t('welcome_message');

// 在事件处理器中使用
const handleClick = () => {
  alert(i18n.t('click_alert'));
};
```

### 3. 使用 Trans 组件处理 HTML

```tsx
import { Trans } from 'react-i18next';

// 翻译文件中：
// "del_anno_desc": "这将<strong>删除所有现有区域</strong>。确定要删除吗？<br />此操作无法撤销。"

<Trans i18nKey="del_anno_desc" />
```

---

## 核心配置

### i18n 初始化配置 (`index.ts`)

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ZH from './locales/zh/translations'
import EN from './locales/en/translations'

i18n
  // 注入 language-detector 插件，自动检测语言
  .use(LanguageDetector)
  // 注入 initReactI18next 实例，将 i18n 实例传递给 react-i18next
  .use(initReactI18next)
  // 初始化 i18next
  .init({
    // 支持的语言列表
    supportedLngs: ['en', 'zh'],

    // 默认语言（当检测失败时使用）
    fallbackLng: 'en',

    // 强制指定语言（会覆盖自动检测）
    // lng: 'zh',

    // 默认的命名空间
    ns: 'translation',
    defaultNS: 'translation',

    // 配置 language-detector
    detection: {
      // 检测顺序（从前到后依次尝试）
      order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      // 缓存用户选择的语言到哪里
      caches: ['cookie'],
    },

    // 翻译资源
    resources: {
      zh: {
        translation: ZH
      },
      en: {
        translation: EN
      },
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

### 配置参数详解

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `supportedLngs` | 支持的语言代码列表 | `['en', 'zh']` |
| `fallbackLng` | 回退语言（检测失败时使用） | `'en'` |
| `lng` | 强制指定语言（覆盖自动检测） | `undefined` |
| `ns` | 命名空间 | `'translation'` |
| `defaultNS` | 默认命名空间 | `'translation'` |
| `detection.order` | 语言检测顺序 | 见上方配置 |
| `detection.caches` | 语言缓存位置 | `['cookie']` |
| `react.useSuspense` | 使用 React Suspense | `true` |
| `interpolation.escapeValue` | 是否转义插值 | `false` |

---

## 使用方法

### 1. useTranslation Hook (推荐)

**基本用法：**

```tsx
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <p>{t('settings')}</p>
      <p>当前语言: {i18n.language}</p>
    </div>
  );
};
```

**带插值的翻译：**

```tsx
// 翻译文件中: "time_ago": "{time} ago"
const { t } = useTranslation();

<span>{t('time_ago', { time: '5 minutes' })}</span>
// 输出: "5 minutes ago"
```

**多个变量替换：**

```tsx
// 翻译文件中: "by_name": "by {name}"
<span>{t('by_name', { name: 'John' })}</span>
// 输出: "by John"
```

### 2. i18n.t() 直接调用

适用于非组件代码（工具函数、事件处理器等）：

```tsx
import i18n from 'i18next';

// 在对象中使用
const actions = [
  {
    label: i18n.t('delete'),
    onClick: handleDelete
  },
  {
    label: i18n.t('cancel'),
    onClick: handleCancel
  }
];

// 在条件语句中使用
const message = isGroundTruth 
  ? i18n.t('unset_as_truth') 
  : i18n.t('set_as_truth');

// 在提示中使用
<Tooltip title={i18n.t('skipped')}>
  <Icon />
</Tooltip>
```

### 3. Trans 组件

用于包含 HTML 标签的翻译：

```tsx
import { Trans } from 'react-i18next';

// 翻译文件中：
// "del_anno_desc": "这将<strong>删除所有现有区域</strong>。确定要删除吗？<br />此操作无法撤销。"

// 使用方式：
<Modal>
  <Trans i18nKey="del_anno_desc" />
</Modal>
```

**支持的 HTML 标签：**
- `<strong>` - 粗体
- `<br />` - 换行
- `<em>` - 斜体
- 其他安全的 HTML 标签

### 4. 语言切换

```tsx
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng).then(() => {
      // 语言切换后的回调
      window.location.reload(); // 可选：刷新页面
    });
  };
  
  return (
    <select 
      value={i18n.language} 
      onChange={(e) => changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="zh">简体中文</option>
    </select>
  );
};
```

---

## 翻译文件管理

### 文件组织结构

翻译文件按语言组织，每个语言一个目录：

```typescript
// locales/en/translations.ts
const EN_TRANSLATIONS = {
  // 分类 1: 编辑器设置
  settings: "Settings",
  general: "General",
  hotkeys: "Hotkeys",
  
  // 分类 2: 操作按钮
  delete: "Delete",
  cancel: "Cancel",
  submit: "Submit",
  
  // 分类 3: 提示信息
  pls_confirm_del: "Please confirm you want to delete this annotation",
  
  // ... 更多翻译
};

export default EN_TRANSLATIONS;
```

### 翻译文件最佳实践

#### 1. 使用语义化的键名

✅ **推荐：**
```typescript
{
  delete_annotation: "Delete Annotation",
  confirm_delete: "Confirm Delete",
  delete_success: "Successfully deleted"
}
```

❌ **不推荐：**
```typescript
{
  btn1: "Delete Annotation",
  msg1: "Confirm Delete",
  text1: "Successfully deleted"
}
```

#### 2. 按功能模块组织

```typescript
const EDITOR_SETTINGS = {
  enableHotkeys_newUI_title: 'Labeling hotkeys',
  enableHotkeys_newUI_description: 'Enables quick selection of labels',
  // ... 更多设置相关的翻译
};

const KEY_MAP = {
  audio_back_description: "Back for one second",
  audio_playpause_description: "Play/pause",
  // ... 更多快捷键描述
};

const ANNOTATION_HISTORY_REASON = {
  accepted: "Accepted",
  rejected: "Rejected",
  // ... 更多历史原因
};

// 导出时合并
const EN_TRANSLATIONS = {
  ...EDITOR_SETTINGS,
  ...KEY_MAP,
  ...ANNOTATION_HISTORY_REASON,
  // ... 其他翻译
};
```

#### 3. 保持键名一致性

英文和中文翻译文件使用**相同的键名**：

```typescript
// locales/en/translations.ts
{
  delete: "Delete",
  cancel: "Cancel"
}

// locales/zh/translations.ts  
{
  delete: "删除",
  cancel: "取消"
}
```

#### 4. 使用注释标注来源

```typescript
const EN_TRANSLATIONS = {
  // AnnotationButton.tsx
  unresolved_comments: "Unresolved Comments",
  all_comments_resolved: "All Comments Resolved",
  
  // Settings.jsx
  settings: "Settings",
  shortcut: "Shortcut",
  
  // Controls.jsx
  skip: "Skip",
  submit: "Submit",
};
```

### 翻译文件示例

**完整示例 - 英文 (`locales/en/translations.ts`)：**

```typescript
const EDITOR_SETTINGS = {
  enableHotkeys_newUI_title: 'Labeling hotkeys',
  enableHotkeys_newUI_description: 'Enables quick selection of labels using hotkeys',
  enableHotkeys_description: 'Enable labeling hotkeys',
  
  showLabels_newUI_title: 'Show region labels',
  showLabels_newUI_description: 'Display region label names',
  showLabels_description: 'Show labels inside the regions',
};

const EN_TRANSLATIONS = {
  ...EDITOR_SETTINGS,
  
  // Common actions
  delete: "Delete",
  cancel: "Cancel",
  submit: "Submit",
  update: "Update",
  save: "Save",
  
  // Messages
  pls_confirm_del: "Please confirm you want to delete this annotation",
  no_changes_made: "No changes were made",
  
  // Time
  time_ago: "{time} ago",
  by_name: "by {name}",
};

export default EN_TRANSLATIONS;
```

**对应的中文翻译 (`locales/zh/translations.ts`)：**

```typescript
const EDITOR_SETTINGS = {
  enableHotkeys_newUI_title: '标注快捷键',
  enableHotkeys_newUI_description: '允许使用快捷键快速选择标签',
  enableHotkeys_description: '启用标注快捷键',
  
  showLabels_newUI_title: '显示区域标签',
  showLabels_newUI_description: '展示区域的标签名称',
  showLabels_description: '在区域内显示标签',
};

const ZH_TRANSLATIONS = {
  ...EDITOR_SETTINGS,
  
  // 通用操作
  delete: "删除",
  cancel: "取消",
  submit: "提交",
  update: "更新",
  save: "保存",
  
  // 提示信息
  pls_confirm_del: "请确认是否要删除此标注",
  no_changes_made: "没有进行任何更改",
  
  // 时间
  time_ago: "{time}前",
  by_name: "由{name}创建",
};

export default ZH_TRANSLATIONS;
```

---

## 最佳实践

### 1. 选择合适的使用方式

| 场景 | 推荐方式 | 原因 |
|------|---------|------|
| React 组件内 | `useTranslation()` | 自动响应语言变化 |
| 事件处理器 | `i18n.t()` | 简单直接 |
| 工具函数 | `i18n.t()` | 可在非组件代码中使用 |
| 包含 HTML | `<Trans>` | 安全渲染 HTML 内容 |
| Modal/Tooltip | `i18n.t()` | 适合动态内容 |

### 2. 避免硬编码文本

❌ **不推荐：**
```tsx
<button>Delete</button>
<p>Please confirm</p>
```

✅ **推荐：**
```tsx
<button>{t('delete')}</button>
<p>{t('pls_confirm')}</p>
```

### 3. 复用翻译键

```typescript
// 同一个操作在多个地方使用相同的翻译键
{
  delete: "Delete",  // 在按钮、菜单、确认框等处复用
  cancel: "Cancel",  // 在所有取消操作中复用
}
```

### 4. 处理复数形式

虽然当前实现不支持复数，但可以使用不同的键：

```typescript
{
  region: "region",           // 单数
  regions: "regions",         // 复数
  region_selected: "{num} Regions are selected"  // 带数量
}
```

### 5. 变量命名规范

在插值中使用有意义的变量名：

```typescript
// ✅ 推荐
{
  time_ago: "{time} ago",
  by_name: "by {name}",
  max_items: "Maximum {num} items"
}

// ❌ 不推荐
{
  time_ago: "{0} ago",
  by_name: "by {1}",
  max_items: "Maximum {x} items"
}
```

---

## 常见场景

### 场景 1: 按钮和操作

```tsx
import i18n from 'i18next';

const actions = [
  {
    label: i18n.t('delete'),
    icon: IconTrash,
    onClick: handleDelete
  },
  {
    label: i18n.t('cancel'),
    icon: IconCancel,
    onClick: handleCancel
  }
];
```

### 场景 2: 确认对话框

```tsx
import i18n from 'i18next';
import { Trans } from 'react-i18next';

confirm({
  title: i18n.t('del_anno_title'),
  body: <Trans i18nKey="del_anno_desc" />,
  okText: i18n.t('delete'),
  cancelText: i18n.t('cancel'),
  onOk: handleDelete
});
```

### 场景 3: 条件渲染

```tsx
const title = isGroundTruth 
  ? i18n.t('unset_as_truth') 
  : i18n.t('set_as_truth');

<Tooltip title={title}>
  <Button />
</Tooltip>
```

### 场景 4: 列表渲染

```tsx
const { t } = useTranslation();

const menuItems = [
  { key: 'settings', label: t('settings') },
  { key: 'hotkeys', label: t('hotkeys') },
  { key: 'layout', label: t('layout') }
];

return (
  <Menu>
    {menuItems.map(item => (
      <MenuItem key={item.key}>{item.label}</MenuItem>
    ))}
  </Menu>
);
```

### 场景 5: 动态内容

```tsx
const { t } = useTranslation();

// 使用插值
<TimeAgo>
  {t('time_ago', { time: '5 minutes' })}
</TimeAgo>

// 多个变量
<span>
  {t('by_name', { name: username })}
</span>
```

### 场景 6: Toast 消息

```tsx
import { useToast } from '@humansignal/ui';
import i18n from 'i18next';

const toast = useToast();

toast.show({
  message: i18n.t('anno_copied'),
  type: ToastType.info
});
```

---

## 语言切换

### LanguageSwitcher 组件

编辑器提供了内置的语言切换组件：

```tsx
import LanguageSwitcher from './i18n/LanguageSwitcher';

<LanguageSwitcher />
```

**功能特性：**
- 下拉选择器样式
- 切换前显示确认对话框
- 自动保存语言偏好到 Cookie
- 切换后重新加载页面

### 组件实现

```tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from "antd";

const languages = [
  { code: 'en', lang: 'English' },
  { code: 'zh', lang: '简体中文' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    Modal.confirm({
      title: i18n.t('switch_lng_title'),
      content: i18n.t('switch_lng_info'),
      okText: i18n.t('confirm'),
      cancelText: i18n.t('cancel'),
      onOk() {
        i18n.changeLanguage(lng).then(() => {
          window.location.reload()
        })
      },
    });
  };

  return (
    <div className="language-switcher">
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-switcher__select"
      >
        {languages.map((lng) => (
          <option key={lng.code} value={lng.code}>
            {lng.lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
```

### 自定义语言切换

如果需要自定义切换逻辑：

```tsx
import { useTranslation } from 'react-i18next';

const CustomLanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  const handleSwitch = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      // 可选：保存到后端
      await saveUserPreference({ language: lng });
      // 可选：刷新页面
      window.location.reload();
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };
  
  return (
    <div>
      <button onClick={() => handleSwitch('en')}>English</button>
      <button onClick={() => handleSwitch('zh')}>中文</button>
    </div>
  );
};
```

---

## TypeScript 支持

### 类型声明文件

编辑器使用 TypeScript 类型声明来提供自动补全和类型检查：

**`react-i18next.d.ts`：**

```typescript
import 'react-i18next';
import translation from './locales/en/translations.ts';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof translation;
    };
  }
}
```

### 类型安全的好处

✅ 翻译键的自动补全  
✅ 编译时错误检查  
✅ 重构时自动更新  
✅ IDE 支持跳转到定义  

### 使用示例

```tsx
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { t } = useTranslation();
  
  // ✅ TypeScript 会提示可用的键
  t('settings')
  
  // ❌ TypeScript 会报错（键不存在）
  t('non_existent_key')
  
  return <div>{t('settings')}</div>;
};
```

---

## 故障排除

### 问题 1: 翻译不生效

**症状：** 显示翻译键而不是翻译后的文本

**可能原因：**
1. 翻译键在翻译文件中不存在
2. 语言代码不匹配
3. i18n 未正确初始化

**解决方案：**

```typescript
// 1. 检查翻译键是否存在
console.log(i18n.t('your_key'));

// 2. 检查当前语言
console.log(i18n.language);

// 3. 检查资源是否加载
console.log(i18n.getResourceBundle('zh', 'translation'));
```

### 问题 2: 语言切换不生效

**症状：** 调用 `changeLanguage()` 后界面没有更新

**可能原因：**
1. 使用 `i18n.t()` 而不是 `useTranslation()`
2. 组件没有响应语言变化

**解决方案：**

```tsx
// ❌ 不会响应语言变化
const Component = () => {
  const label = i18n.t('label');
  return <div>{label}</div>;
};

// ✅ 会响应语言变化
const Component = () => {
  const { t } = useTranslation();
  return <div>{t('label')}</div>;
};
```

### 问题 3: HTML 标签显示为文本

**症状：** `<strong>` 等标签以纯文本形式显示

**解决方案：**

使用 `<Trans>` 组件而不是 `t()` 函数：

```tsx
// ❌ HTML 标签会被转义
<div>{t('message_with_html')}</div>

// ✅ 正确渲染 HTML
<div><Trans i18nKey="message_with_html" /></div>
```

### 问题 4: 插值变量不起作用

**症状：** `{time}` 等占位符原样显示

**解决方案：**

确保传递正确的参数对象：

```tsx
// ❌ 缺少参数
t('time_ago')

// ✅ 传递参数对象
t('time_ago', { time: '5 minutes' })
```

### 问题 5: Cookie 语言设置不生效

**症状：** 设置了 Cookie 但语言仍然不对

**检查项：**
1. Cookie 名称是否正确（默认为 `i18next`）
2. Cookie 值格式是否正确（如 `en` 或 `zh`）
3. 检测顺序中 Cookie 的优先级

**调试方法：**

```javascript
// 查看 Cookie
document.cookie.split(';').find(c => c.includes('i18next'))

// 强制设置语言（跳过检测）
i18n.changeLanguage('zh');
```

---

## 扩展新语言

### 步骤 1: 创建翻译文件

```bash
# 创建新语言目录
mkdir -p web/libs/editor/src/i18n/locales/fr

# 创建翻译文件
touch web/libs/editor/src/i18n/locales/fr/translations.ts
```

### 步骤 2: 编写翻译内容

```typescript
// locales/fr/translations.ts
const FR_TRANSLATIONS = {
  // 从英文翻译文件复制所有键
  settings: "Paramètres",
  general: "Général",
  hotkeys: "Raccourcis",
  delete: "Supprimer",
  cancel: "Annuler",
  submit: "Soumettre",
  // ... 所有其他翻译
};

export default FR_TRANSLATIONS;
```

### 步骤 3: 更新 i18n 配置

```typescript
// i18n/index.ts
import FR from './locales/fr/translations';

i18n.init({
  supportedLngs: ['en', 'zh', 'fr'],  // 添加新语言
  
  resources: {
    en: { translation: EN },
    zh: { translation: ZH },
    fr: { translation: FR },  // 添加新资源
  },
  
  // ... 其他配置
});
```

### 步骤 4: 更新语言切换器

```typescript
// LanguageSwitcher.tsx
const languages = [
  { code: 'en', lang: 'English' },
  { code: 'zh', lang: '简体中文' },
  { code: 'fr', lang: 'Français' },  // 添加新语言选项
];
```

### 步骤 5: 更新 TypeScript 类型

如果需要类型支持，更新类型声明：

```typescript
// react-i18next.d.ts
import frTranslation from './locales/fr/translations.ts';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof translation;
      // 或者使用联合类型支持多语言
      // translation: typeof translation | typeof frTranslation;
    };
  }
}
```

### 步骤 6: 测试新语言

```typescript
// 测试切换到新语言
i18n.changeLanguage('fr');

// 验证翻译
console.log(i18n.t('settings')); // 应该输出: "Paramètres"
```

---

## 翻译检查清单

在添加或修改翻译时，使用此清单确保质量：

### 翻译完整性

- [ ] 所有英文翻译键都有对应的中文翻译
- [ ] 没有遗漏的翻译键
- [ ] 变量占位符（如 `{name}`）在所有语言中保持一致
- [ ] HTML 标签在所有语言中保持一致

### 代码质量

- [ ] 使用语义化的键名
- [ ] 按功能模块组织翻译
- [ ] 添加了注释说明来源
- [ ] 没有硬编码的文本字符串
- [ ] TypeScript 类型检查通过

### 用户体验

- [ ] 翻译准确、自然
- [ ] 符合目标语言的习惯用法
- [ ] 长度合适，不会破坏 UI 布局
- [ ] 专业术语使用一致

### 功能测试

- [ ] 语言切换正常工作
- [ ] 所有页面翻译正确显示
- [ ] 动态内容（插值）正常工作
- [ ] HTML 内容正确渲染

---

## 性能优化

### 1. 按需加载翻译

对于大型应用，可以考虑按需加载翻译资源：

```typescript
// 使用 i18next-http-backend
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });
```

### 2. 缓存翻译

当前配置已将语言选择缓存到 Cookie：

```typescript
detection: {
  caches: ['cookie'],
}
```

### 3. 避免不必要的重新渲染

```tsx
// ❌ 每次都会创建新对象
const { t } = useTranslation();
const options = { time: Date.now() };
return <div>{t('time_ago', options)}</div>;

// ✅ 使用 useMemo 缓存
const { t } = useTranslation();
const options = useMemo(() => ({ time: Date.now() }), []);
return <div>{t('time_ago', options)}</div>;
```

---

## 附录

### A. 完整的 API 参考

#### useTranslation()

```typescript
const { t, i18n, ready } = useTranslation(namespace?, options?);
```

**返回值：**
- `t`: 翻译函数
- `i18n`: i18next 实例
- `ready`: 翻译是否已加载完成

#### t() 函数

```typescript
t(key: string, options?: object): string
```

**参数：**
- `key`: 翻译键
- `options`: 可选参数对象（插值变量等）

#### i18n 实例方法

- `changeLanguage(lng: string): Promise<TFunction>`
- `language: string` - 当前语言
- `languages: string[]` - 可用语言列表
- `getResourceBundle(lng, ns): object` - 获取资源

### B. 常用翻译键参考

```typescript
// 通用操作
delete, cancel, submit, update, save, reset, undo, redo

// 状态
draft, submitted, saved, skipped, accepted, rejected

// 时间
created, started, updated, time_ago, by_name

// 区域
regions, labels, region_selected, no_region_selected

// 设置
settings, general, hotkeys, layout, shortcut, description

// 消息
pls_confirm_del, no_changes_made, are_sure, yes, no
```

### C. 相关资源

- [i18next 官方文档](https://www.i18next.com/)
- [react-i18next 文档](https://react.i18next.com/)
- [i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languageDetector)

---

## 总结

Label Studio Editor 的国际化系统提供了：

🌍 **灵活的语言支持** - 易于扩展新语言  
🎯 **类型安全** - TypeScript 支持  
🚀 **高性能** - 自动缓存和优化  
🛠️ **开发友好** - 简单的 API 和清晰的文件结构  

遵循本文档的指导，您可以：
- 快速在组件中实现国际化
- 维护和扩展翻译内容
- 添加新的语言支持
- 解决常见的国际化问题

如有任何问题或建议，请参考源码或提交 Issue。
