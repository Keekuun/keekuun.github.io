---
title: React useOptimistic 乐观更新失败回滚方案
date: 2025-08-04
sidebar: auto
categories:
- React
- 前端
tags:
- JS
- React
---

在React中实现乐观更新（Optimistic Updates）时，如果接口调用失败，需要通过以下策略进行回滚：

---

### 一、基础乐观更新模式（带回滚）

React 19 的 `useOptimistic` 返回 `[optimisticState, addOptimisticUpdate]`，第二个参数是一个 reducer，用于描述如何根据“乐观动作”推导新状态。因此需要定义动作类型，并在失败时派发一个显式的回滚动作，避免旧版本 `setState` 写法导致示例错误。

```tsx
import { useState, useOptimistic } from 'react';

type OptimisticAction =
  | { type: 'add'; todo: Todo }
  | { type: 'rollback'; snapshot: Todo[] };

function TodoList({ todos }: { todos: Todo[] }) {
  const [error, setError] = useState<Error | null>(null);

  const [optimisticTodos, updateOptimisticTodos] = useOptimistic(
    todos,
    (state, action: OptimisticAction) => {
      if (action.type === 'add') {
        return [...state, action.todo];
      }
      if (action.type === 'rollback') {
        return action.snapshot;
      }
      return state;
    }
  );

  async function addTodo(newTodo: Todo) {
    // 1. 保存当前快照，确保可以精确回滚
    const rollbackSnapshot = optimisticTodos;

    // 2. 乐观更新UI
    updateOptimisticTodos({ type: 'add', todo: newTodo });

    try {
      // 3. 实际API调用
      const response = await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify(newTodo),
      });
      if (!response.ok) throw new Error('Create todo failed');
    } catch (err) {
      // 4. 失败时回滚
      updateOptimisticTodos({ type: 'rollback', snapshot: rollbackSnapshot });
      setError(err as Error);
    }
  }

  return (
    <>
      {error && <ErrorToast error={error} onDismiss={() => setError(null)} />}
      {/* 使用optimisticTodos渲染列表 */}
    </>
  );
}
```

---

### 二、增强版带重试机制的乐观更新

```tsx
import { useOptimistic, useTransition } from 'react';

function useOptimisticUpdate<T>(initialData: T) {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useOptimistic(initialData);
  const [retryQueue, setRetryQueue] = useState<(() => Promise<void>)[]>([]);

  async function executeWithRetry(
    action: () => Promise<void>,
    optimisticUpdate: (current: T) => T
  ) {
    let rollbackData = data;
    let retryCount = 0;
    const maxRetries = 3;

    const execute = async () => {
      try {
        // 乐观更新
        startTransition(() => {
          setData(optimisticUpdate);
        });

        await action();
      } catch (error) {
        if (retryCount < maxRetries) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          throw error; // 触发重试
        } else {
          // 最终失败时回滚
          startTransition(() => {
            setData(rollbackData);
          });
          throw error;
        }
      }
    };

    try {
      await execute();
    } catch (error) {
      // 加入重试队列
      setRetryQueue(prev => [...prev, execute]);
    }
  }

  // 暴露给组件的API
  return {
    data,
    isPending,
    executeWithRetry,
    retryAll: () => Promise.all(retryQueue.map(fn => fn()))
  };
}
```

---

### 三、与SWR/React Query配合的方案

```tsx
import { useSWRConfig } from 'swr';
import useOptimistic from 'swr/optimistic';

function useOptimisticMutation() {
  const { mutate } = useSWRConfig();
  const [error, setError] = useState<Error | null>(null);

  async function mutateWithRollback(
    key: string,
    asyncUpdate: () => Promise<any>,
    optimisticData: any
  ) {
    // 1. 乐观更新
    mutate(key, optimisticData, false);
  
    try {
      // 2. 执行实际请求
      const result = await asyncUpdate();
    
      // 3. 用实际数据重新验证
      mutate(key, result);
      return result;
    } catch (err) {
      // 4. 回滚到之前状态
      mutate(key);
      setError(err as Error);
      throw err;
    }
  }

  return { mutateWithRollback, error };
}

// 在组件中使用
function EditPost({ postId }) {
  const { data } = useSWR(`/api/posts/${postId}`);
  const { mutateWithRollback } = useOptimisticMutation();

  const handleSave = async (newData) => {
    await mutateWithRollback(
      `/api/posts/${postId}`,
      () => fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify(newData)
      }),
      newData // 乐观更新数据
    );
  };
}
```

---

### 四、完整事务型乐观更新Hook

```tsx
import { useCallback, useState } from 'react';

type OptimisticUpdate<T> = {
  data: T;
  error: Error | null;
  execute: (
    optimisticValue: T,
    asyncAction: () => Promise<void>,
    onRollback?: (error: Error) => void
  ) => Promise<void>;
  reset: () => void;
};

export function useOptimisticUpdate<T>(initialData: T): OptimisticUpdate<T> {
  const [data, setData] = useState<T>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [history, setHistory] = useState<{ data: T; timestamp: number }[]>([]);

  const execute = useCallback(
    async (
      optimisticValue: T,
      asyncAction: () => Promise<void>,
      onRollback?: (error: Error) => void
    ) => {
      // 保存当前状态到历史记录
      setHistory(prev => [...prev, { data, timestamp: Date.now() }]);
    
      // 乐观更新
      setData(optimisticValue);
      setError(null);

      try {
        await asyncAction();
        // 成功时清除历史记录
        setHistory([]);
      } catch (err) {
        // 失败时回滚
        const error = err as Error;
        setError(error);
      
        if (history.length > 0) {
          const lastState = history[history.length - 1];
          setData(lastState.data);
        } else {
          setData(initialData);
        }
      
        onRollback?.(error);
      }
    },
    [data, history, initialData]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setHistory([]);
  }, [initialData]);

  return { data, error, execute, reset };
}
```

---

### 五、生产环境最佳实践

1. **错误恢复UI模式**
```tsx
function SaveButton() {
  const { data, error, execute } = useOptimisticUpdate(initialData);

  const handleClick = async () => {
    await execute(
      newData,
      async () => {
        const response = await fetch('/api/data', {
          method: 'POST',
          body: JSON.stringify(newData)
        });
        if (!response.ok) throw new Error('Save failed');
      },
      (error) => {
        // 自定义回滚逻辑
        analytics.track('rollback_triggered', { error: error.message });
      }
    );
  };

  return (
    <>
      <button onClick={handleClick} disabled={!!error}>
        {error ? 'Retry' : 'Save'}
      </button>
      {error && (
        <div className="error-banner">
          Save failed: {error.message}
          <button onClick={() => execute(...)}>Retry</button>
          <button onClick={reset}>Discard changes</button>
        </div>
      )}
    </>
  );
}
```

2. **性能优化建议**
```tsx
// 使用useTransition避免UI阻塞
const [isPending, startTransition] = useTransition();

const execute = async () => {
  startTransition(() => {
    setData(optimisticValue);
  });

  await asyncAction();
};
```

3. **与后端协作规范**
```tsx
// 理想的后端响应格式
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    recoverable: boolean; // 是否可重试
  };
  metadata?: {
    version?: string; // 用于乐观并发控制
    timestamp?: number;
  };
}
```

---

### 六、不同方案的适用场景

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| `useOptimistic` Hook | React原生支持 | 需要18+版本 | 简单乐观更新 |
| SWR/React Query集成 | 完善的缓存策略 | 需要学习额外库 | 数据获取场景 |
| 自定义事务Hook | 完全控制流程 | 实现复杂度高 | 关键业务操作 |
| Redux中间件方案 | 状态集中管理 | 冗余代码多 | 大型应用 |

---

### 总结

在React中实现带回滚的乐观更新时：

1. **必须保留原始数据**用于回滚
2. **错误处理要区分可恢复/不可恢复错误**
3. **提供清晰的重试机制**给用户
4. **与后端约定错误格式**便于恢复
5. **复杂场景考虑使用状态管理库**

对于关键业务操作（如支付、订单修改），建议使用自定义事务Hook或Redux中间件方案；对于普通数据更新，使用`useOptimistic`或SWR集成就足够。
