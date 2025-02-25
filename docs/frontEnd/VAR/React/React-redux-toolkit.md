---
title: React-状态管理之redux-toolkit
sidebar: auto
categories:  
- React
- 前端
tags: 
- JS
- React
---

### 状态管理之 Redux Toolkit 入门和实践

Redux Toolkit 是 Redux 的官方推荐工具集，旨在简化 Redux 的使用并解决常见的开发痛点。

#### 1. 安装 Redux Toolkit

首先，你需要安装 Redux Toolkit 及其相关依赖：
```bash
npm install @reduxjs/toolkit react-redux
```


#### 2. 配置 Redux Store

使用 Redux Toolkit 创建和配置 Redux store。Redux Toolkit 提供了 `configureStore` 方法来简化 store 的创建过程。

```typescript
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../features/rootReducer'; // 后续会定义

const store = configureStore({
  reducer: rootReducer,
});

export default store;
```


#### 3. 创建 Slice

Redux Toolkit 使用 `createSlice` 方法来创建 reducer 和 action。`createSlice` 方法会自动生成 action creators 和 action types。

```typescript
// src/features/counter/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```


#### 4. 组合 Reducers

使用 `combineReducers` 方法将多个 reducer 组合成一个根 reducer。

```typescript
// src/features/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import counterReducer from './counter/counterSlice';

const rootReducer = combineReducers({
  counter: counterReducer,
});

export default rootReducer;
```


#### 5. 提供 Redux Store

在 React 应用中使用 `Provider` 组件将 Redux store 提供给整个应用。

```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```


#### 6. 使用 Redux State 和 Dispatch Actions

在 React 组件中使用 `useSelector` 和 `useDispatch` 钩子来访问 Redux state 和 dispatch actions。

```tsx
// src/components/Counter.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../features/counter/counterSlice';

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>Increment by 5</button>
    </div>
  );
};

export default Counter;
```


#### 7. 类型定义

为了确保类型安全，可以为 Redux state 和 action 定义类型。

```typescript
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../features/rootReducer';

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
```
```tsx
// src/components/Counter.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../features/counter/counterSlice';
import { RootState, AppDispatch } from '../app/store';

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>Increment by 5</button>
    </div>
  );
};

export default Counter;
```


#### 8. 中间件和增强功能

Redux Toolkit 默认集成了 `redux-thunk` 中间件，支持异步操作。你还可以添加其他中间件，如 `redux-logger`。

```bash
npm install redux-logger
```
```typescript
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../features/rootReducer';
import logger from 'redux-logger';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
```


#### 9. 实践示例：异步操作

使用 `createAsyncThunk` 创建异步 action，并在 reducer 中处理异步状态。

```typescript
// src/features/counter/counterSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: CounterState = {
  value: 0,
  status: 'idle',
  error: null,
};

export const fetchCount = createAsyncThunk('counter/fetchCount', async (amount: number) => {
  const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${amount}`);
  return response.data.id;
});

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCount.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value += action.payload;
      })
      .addCase(fetchCount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch count';
      });
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```
```tsx
// src/components/Counter.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount, fetchCount } from '../features/counter/counterSlice';
import { RootState, AppDispatch } from '../app/store';

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const status = useSelector((state: RootState) => state.counter.status);
  const error = useSelector((state: RootState) => state.counter.error);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>Increment by 5</button>
      <button onClick={() => dispatch(fetchCount(1))}>
        {status === 'loading' ? 'Loading...' : 'Fetch Count'}
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Counter;
```


### 总结

通过以上步骤，你可以快速入门并实践 Redux Toolkit。Redux Toolkit 提供了简洁的 API 和强大的功能，帮助你更高效地管理应用的状态。遵循这些最佳实践，可以帮助你编写更健壮、更易维护的代码。
