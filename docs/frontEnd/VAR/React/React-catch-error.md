---
title: React 19 如何进行异常捕获
date: 2025-7-20
sidebar: auto
categories:
- React
- 前端
tags:
- JS
- React
---

# React 如何进行异常捕获

[[toc]]
本文介绍React 最新版（19）中各类错误捕获的完整方案，涵盖从组件级到全局的错误处理：

---

## **一、组件级错误捕获（Error Boundary）**
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    logErrorToService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI error={this.state.error} />;
    }
    return this.props.children;
  }
}

// 使用方式
<ErrorBoundary>
  <UnstableComponent />
</ErrorBoundary>
```

**适用场景**：组件渲染时同步/异步错误、生命周期方法错误

---

## **二、应用级全局捕获**
```jsx
// 1. 全局事件监听（适用于非React错误）
window.addEventListener('error', (event) => {
  event.preventDefault();
  sendToMonitoring(event.error);
});

// 2. 未捕获的Promise rejection
window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
  trackPromiseError(event.reason);
});

// 3. React 19新增的根错误捕获
const root = createRoot(container, {
  onUncaughtError: (error, componentStack) => {
    logCrash(error, { stack: componentStack });
  }
});
```

**适用场景**：全局JS错误、未处理的Promise rejection、渲染边界外的错误

---

## **三、数据获取错误处理**
```jsx
// 1. 使用Suspense + Error Boundary
<ErrorBoundary>
  <Suspense fallback={<Loader />}>
    <AsyncDataComponent />
  </Suspense>
</ErrorBoundary>

// 2. 使用React 19的use() Hook
function DataLoader() {
  try {
    const data = use(fetchData());
    return <Display data={data} />;
  } catch (error) {
    return <ErrorRetry message={error.message} />;
  }
}
```

**适用场景**：API请求失败、GraphQL错误、数据加载异常

---

## **四、资源加载错误**
```jsx
// 1. 图片/脚本等静态资源
<img 
  src="image.png" 
  onError={(e) => { 
    e.target.src = 'fallback.png'; 
    logResourceError('image', e.target.src);
  }} 
/>

// 2. 动态import组件
const Component = React.lazy(() => import('./Component')
  .catch(error => ({ 
    default: () => <ErrorPage code="MODULE_NOT_FOUND" /> 
  })));
```

**适用场景**：CDN资源加载失败、动态import错误

---

## **五、事件处理器错误**
```jsx
// 1. 使用try/catch
const handleClick = async () => {
  try {
    await submitForm();
  } catch (error) {
    showToast(error.message);
    captureUserActionError(error);
  }
};

// 2. 高阶函数封装
function withErrorHandling(fn) {
  return (...args) => {
    try {
      return fn(...args);
    } catch (error) {
      logInteractionError(error);
    }
  };
}
```

**适用场景**：用户交互逻辑错误、事件回调异常

---

## **六、类型错误预防（TypeScript）**
```tsx
// 1. 严格类型校验
interface Props {
  userId: string;  // 必须提供
  data?: DataType; // 可选
}

// 2. 新!非空断言
function User({ user }: { user: UserType! }) {
  return <div>{user.name}</div>; // 确保user不为null
}

// 3. React 19增强的useState类型
const [count, setCount] = useState<number>(0); // 必须初始化
```

**适用场景**：props类型错误、状态类型不匹配

---

## **七、错误监控集成**
```jsx
// 1. 错误上报服务封装
export logError = (error, metadata = {}) => {
  Sentry.captureException(error, { 
    tags: { 
      react_version: React.version,
      ...metadata 
    } 
  });
};

// 2. 全局错误边界（建议在根组件使用）
<ErrorBoundary 
  fallback={<GlobalErrorPage />}
  onError={logError}
/>
```


---

## **错误处理策略对比表**
| 错误类型         | 捕获方案                      | 恢复策略                  |
|------------------|-----------------------------|--------------------------|
| **组件渲染错误** | Error Boundary              | 显示备用UI               |
| **异步代码错误** | try/catch + Error Boundary  | 重试机制/降级内容        |
| **资源加载失败** | onError事件                 | 加载备用资源             |
| **网络请求错误** | 拦截器 + Suspense           | 重试/离线缓存            |
| **类型系统错误** | TypeScript严格模式          | 编译时阻断               |
| **全局未捕获错误**| window.error事件监听        | 记录日志/通知用户        |

---

## **React 19 新增特性**
1. **Root Error Handling**
   ```js
   createRoot(container, {
     onUncaughtError: (error, info) => {}
   });
   ```

2. **Error Recovery Hooks**
   ```jsx
   useErrorRecovery(() => retryFunction());
   ```


建议结合 Sentry/BrowserStack 等工具实现完整的错误监控体系。对于关键业务场景，建议实施多层错误防御策略。