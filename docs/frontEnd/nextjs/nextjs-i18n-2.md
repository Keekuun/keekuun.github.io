---
title: Next.js 国际化（i18n）的动态插槽
sidebar: auto
date: 2025-6-20
categories:
- Next.js
- 前端
tags:
- Next.js
---

在实际应用中，几乎所有的翻译文案都需要动态插入内容，比如用户名、数量、价格、日期等。我们称之为**插值 (Interpolation)** 或 **插槽 (Slots)**。

`next-intl` 默认使用了业界标准的 **ICU Message Format** 语法，它非常强大，不仅能处理简单的变量替换，还能优雅地处理复数、性别、数字和日期格式等复杂场景。

---

### 1. 基础占位符 (Simple Placeholders)

这是最常见的场景，就是把你提到的“单价”、“数量”等动态值插入字符串。

**工作流程:**

1.  在你的 JSON 翻译文件中，使用 `{variableName}` 语法定义占位符。
2.  在调用 `t()` 函数时，传入第二个参数，一个包含这些变量值的对象。

#### 示例：

假设我们要显示一条消息：“购物车中有 5 件商品，总价为 $54.95。”

**`messages/en.json`**
```json
{
  "ShoppingCart": {
    "summary": "You have {quantity} items in your cart. The total price is {price}."
  }
}
```

**`messages/zh.json`**
```json
{
  "ShoppingCart": {
    "summary": "您的购物车中有 {quantity} 件商品，总价为 {price}。"
  }
}
```

**在组件中使用 (例如 `components/CartInfo.tsx`)**

```typescript
// 这个组件可以是服务端或客户端组件
import { useTranslations } from 'next-intl';

interface CartInfoProps {
  quantity: number;
  // 注意：价格格式化最好也通过 i18n 处理，我们稍后会讲
  formattedPrice: string; 
}

export default function CartInfo({ quantity, formattedPrice }: CartInfoProps) {
  const t = useTranslations('ShoppingCart');

  return (
    <p>
      {t('summary', { 
        quantity: quantity, 
        price: formattedPrice 
      })}
    </p>
  );
}

// 使用示例: <CartInfo quantity={5} formattedPrice="$54.95" />
```
`next-intl` 会自动找到对应的 `{quantity}` 和 `{price}` 占位符，并将你传入的值替换进去。

---

### 2. 高级用法 (发挥 ICU 的真正威力)

ICU Message Format 的强大远不止于此。下面是几个能显著提升你 i18n 代码质量的高级实践。

#### a. 处理复数 (Plurals)

不同语言对复数的处理规则完全不同。例如，英文中 1 是单数，其他是复数；而俄语等斯拉夫语系则有更复杂的规则。**切勿在代码中用 `if (count === 1)` 来判断！** ICU 可以在翻译文件层面完美解决这个问题。

**`messages/en.json`**
```json
{
  "ShoppingCart": {
    "itemCount": "You have {count, plural, =0 {no items} one {one item} other {# items}} in your cart."
  }
}
```
*   `{count, plural, ...}`: 声明这是一个复数规则。
*   `=0`: 当 `count` 等于 0 时的文本。
*   `one`: 当 `count` 满足此语言的“单数”规则时的文本。
*   `other`: 其他情况。
*   `#`: 是一个特殊占位符，它会自动显示 `count` 的值。

**`messages/zh.json`** (中文没有单复数变化，但可以保持结构一致)
```json
{
  "ShoppingCart": {
    "itemCount": "您的购物车中有 {count} 件商品。"
  }
}
```

**在组件中使用:**
```typescript
import { useTranslations } from 'next-intl';

export default function CartStatus({ count }: { count: number }) {
  const t = useTranslations('ShoppingCart');

  // 你只需要传递 count，ICU 会自动选择正确的句子
  return <p>{t('itemCount', { count: count })}</p>; 
}

// <CartStatus count={0} />  -> "You have no items in your cart."
// <CartStatus count={1} />  -> "You have one item in your cart."
// <CartStatus count={5} />  -> "You have 5 items in your cart."
```

#### b. 格式化数字和货币 (Number & Currency Formatting)

对于价格，不要手动添加 `$` 或 `¥` 符号。让 `next-intl` 帮你处理，它会根据 `locale` 自动使用正确的货币符号、千位分隔符和小数点。

**`messages/en.json`**
```json
{
  "Product": {
    "price": "Price: {price, number, ::currency/USD}"
  }
}
```

**`messages/zh.json`**
```json
{
  "Product": {
    "price": "价格：{price, number, ::currency/CNY}"
  }
}
```
*   `{price, number, ::currency/USD}`: 将 `price` 变量作为数字格式化，并使用 `USD` 货币样式。

**在组件中使用:**
```typescript
import { useTranslations } from 'next-intl';

export default function ProductPrice({ price }: { price: number }) {
  const t = useTranslations('Product');

  // 直接传递数字，格式化工作交给 i18n
  return <p>{t('price', { price: 54.95 })}</p>;
}

// 当 locale='en' 时 -> "Price: $54.95"
// 当 locale='zh' 时 -> "价格：¥54.95" 
// 它还能处理德语等使用逗号做小数点的场景，例如 €54,95
```

#### c. 插入 React 组件 (Rich Text / 插槽)

这是最强大的功能之一！如果你想在翻译文案中嵌入一个链接 (`<a>`) 或加粗文本 (`<strong>`)，该怎么办？**绝对不要拼接字符串！** 这有安全风险（XSS），而且非常不优雅。

`next-intl` 提供了 `t.rich()` 方法来安全地实现这一点。

**`messages/en.json`**
```json
{
  "User": {
    "terms": "Please accept the <termsLink>Terms and Conditions</termsLink> to continue."
  }
}
```
我们用类似 HTML 标签的语法 `<termsLink>` 包裹了需要成为链接的文本。

**在组件中使用:**
```typescript
'use client'; // 使用 Link 组件，通常需要在客户端组件中

import { useTranslations } from 'next-intl';
import Link from 'next-intl/link'; // 使用 next-intl 的 Link 组件来保持 locale

export default function TermsAgreement() {
  const t = useTranslations('User');

  return (
    <p>
      {t.rich('terms', {
        // key 对应你在 JSON 中定义的 "标签名"
        termsLink: (chunks) => (
          <Link href="/terms" style={{ color: 'blue', textDecoration: 'underline' }}>
            {chunks}
          </Link>
        ),
      })}
    </p>
  );
}
```
*   `t.rich()` 的第二个参数是一个对象，key 是你在翻译文件中定义的标签名 (`termsLink`)。
*   value 是一个函数，它的参数 `chunks` 就是被标签包裹的文本内容（"Terms and Conditions"）。
*   你在这个函数中返回一个 React 组件，`chunks` 作为它的子元素。

这样就实现了**类型安全、XSS 安全**的组件插值，结构清晰，易于维护。

### 总结与最佳实践

1.  **始终使用 ICU Message Format**：它是处理动态内容和本地化复杂性的标准方式。
2.  **将逻辑留在翻译文件中**：尽可能在 `.json` 文件中通过 `plural`、`select` 等规则处理语法差异，而不是在你的 React 代码中写 `if/else`。
3.  **传递原始值**：向 `t()` 函数传递原始的 `number`, `Date` 对象，而不是预格式化的字符串，让 `next-intl` 根据 `locale` 进行最合适的格式化。
4.  **使用 `t.rich()` 处理富文本**：当需要在翻译中嵌入组件（如链接、按钮、图标）时，`t.rich()` 是最安全、最正确的选择。

遵循这些实践，你的国际化方案将非常健壮、可扩展，并且能轻松应对各种复杂的本地化需求。

> https://next-intl.dev/
> 
> https://simplelocalize.io/blog/posts/what-is-icu/#what-is-icu
> 
> https://simplelocalize.io/tools/icu-message-syntax-tester/
