---
title: React19 版本主要有那些更新
date: 2025-7-20
sidebar: auto
categories:
- React
- 前端
tags:
- JS
- React
---

[[toc]]

## **一、核心架构升级**
### 1. **Server Components（服务端组件）正式支持**
- 原生支持组件级流式 SSR
- 新增 `server` 和 `client` 编译指令
```jsx
'use server';
function ServerButton() { /* 仅在服务端执行 */ }
```

### 2. **React Compiler编译器优化**
- React Compiler 旨在通过编译时优化 React 代码，提升运行时性能。
    - 自动优化组件重渲染，替代手动 `useMemo`/`useCallback`
    - 编译时静态分析依赖关系
    - 示例效果：减少 30-50% 不必要的渲染

## **二、新 Hook API**

### 1. **use() Hook**
- 统一异步资源读取方式，支持：
- Promises
- Context
- 数据加载
```jsx
const data = use(fetch('/api/data'));
```

### 2. **useActionState**
- 合并 `useFormState` + `useFormStatus`
- 完整状态管理：
```jsx
const [state, action, isPending] = useActionState(async (prevState, formData) => {
 const res = await submitForm(formData);
 return res.data;
}, initialState);
```

### 3. `useOptimistic`
**用途**：实现乐观更新（即在等待服务器响应前先更新UI）

#### 核心特性：
```jsx
const [optimisticState, addOptimistic] = useOptimistic(
  baseState,
  (currentState, optimisticValue) => {
    // 返回新的乐观状态
    return [...currentState, optimisticValue];
  }
);
```


#### 完整示例：
```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (currentTodos, newTodo) => [...currentTodos, { ...newTodo, _pending: true }]
  );

  const addTodo = async (text) => {
    const newTodo = { id: Date.now(), text };
    addOptimisticTodo(newTodo); // 立即显示
    
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ text })
      });
      setTodos(await response.json());
    } catch {
      // 回滚 optimistic update
      setTodos(todos);
    }
  };

  return (
    <div>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id} className={todo._pending ? 'pending' : ''}>
            {todo.text}
            {todo._pending && ' (保存中...)'}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## **三、渲染系统改进**
### 1. **自动批量更新增强**
- 覆盖所有场景（包括异步代码、timeouts）
- 手动退出需用 `flushSync`

### 2. **新的渲染返回值**
- 支持返回普通对象、Map、Set
- 不再强制要求 `key` 属性

### 3. **hydration 错误处理**
- 新增 `onRecoverableError` 回调
- 更清晰的客户端-服务端不匹配警告

## **四、开发者体验**
### 1. **调试工具升级**
- 组件树性能火焰图
- 并发模式渲染优先级可视化

### 2. **TypeScript 5.0+ 深度集成**
- 组件 props 自动推导
- 更严格的 `useState` 类型约束
   ```tsx
   const [count, setCount] = useState<number>(); // 必须提供初始值或明确undefined
   ```


### 3. **错误边界增强**
- 支持错误原因追踪
- 组件级错误恢复尝试

---

## **五、破坏性变更**
### 1. **移除的 API**
- `React.children` 方法
- `unstable_createRoot`（直接使用 `createRoot`）

### 2. **严格模式新行为**
- 开发环境下组件卸载/重新挂载逻辑调整
- 模拟生产环境渲染更准确

### 3. **最低浏览器要求**
- 完全放弃 IE11 支持
- 需要现代浏览器原生支持 ES2017+

---

## **六、生态系统适配**
| 工具          | 适配要求                     |
|---------------|----------------------------|
| Next.js 15+   | 必须更新以支持 RSC 新规范    |
| Redux Toolkit | 需要 2.0+ 版本兼容新上下文系统 |
| Jest 30+      | 新增 React Compiler 转换插件 |

---

## **七、完整迁移指南**建议参考：
1. 官方升级工具：`npx react-codemod@latest`
2. 逐步迁移策略文档
3. 兼容性检查工具包`react-compat-check`


> [React 19 is now stable!](https://react.dev/blog/2024/12/05/react-19)