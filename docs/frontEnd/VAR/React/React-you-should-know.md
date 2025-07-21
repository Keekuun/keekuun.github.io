# React 知识扫盲

## ref

为什么需要 ref, dom 引用，存储不引起视图更新的数据存储更新

useRef 使用方式，原理是什么

## forwardRef
怎么访问子组件的 ref ?
ref 不能直接通过 props传递，需要使用 forwardRef HOC 模式传入

## Suspense
1. Suspense + lazy 动态加载React组件，可以切分 js bundle做到按需加载
2. Suspense + async 处理异步请求， 新版使用 use（手写 use- github: react18-use） 来处理 异步请求
3. Suspense 捕获Promise 

ali ahooks
https://github.com/streamich/react-use

https://github.com/dai-shi/react18-use

## lazy
异步加载组件（按需加载）

## memo
HOC， 实现原理是什么
react devtools 打开 highlight updates 查看组件更新

## hooks
react-use github 源码学习自定义hooks
+ useState 是 useReducer 的语法糖
+ useMemo
+ useCallback
+ useEffect
+ useLayoutEffect - 浏览器环境
+ useReducer
+ useContext
+ useImperativeHandle 暴露组件内部实例方法

+ useId
+ useTransition
+ useSyncExternalStore


+ 自定义 useIsomorphicLayoutEffect 判断能否使用 useLayoutEffect
    比如 react-native
    const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

## 样式方案
+ 内联样式
+ css modules
+ css in js：styled-components、emotion, 但是 ssr 支持很难
+ tailwindcss


## 状态管理


## react tsconfig 配置


https://github.com/enaqx/awesome-react

https://github.com/typescript-cheatsheets/react

https://github.com/immerjs/immer

https://github.com/typescript-cheatsheets


