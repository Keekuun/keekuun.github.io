---
title: React动画
sidebar: auto
categories: 
- React
- 前端
tags: 
- JS
- React
---

## 使用 framer-motion
```bash
npm i framer-motion
```

```jsx
import { motion } from "framer-motion"

export const MyComponent = ({ isVisible }) => (
    <motion.div animate={{ opacity: isVisible ? 1 : 0 }} />
)
```

<iframe width="100%" height="315" src="https://www.youtube.com/embed/SuqU904ZHA4" title="Springy Animated Modals // Framer Motion &amp; React Tutorial for Beginners" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

> [framer-motion](https://www.npmjs.com/package/framer-motion)
> 
> [Framer Motion 官网](https://www.framer.com/motion/)
> 
> [Framer Motion Tutorial](https://fireship.io/lessons/framer-motion-modal/)
