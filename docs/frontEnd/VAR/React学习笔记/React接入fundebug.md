---
title: 【React】React接入fundebug
date: 2019-11-23
sidebar: auto
categories: 
- 前端
tags: 
- React
- 优化
publish: true
---

# React-ts项目接入【fundebug-javascript】捕获异常

> [FunDebug官方文档](https://docs.fundebug.com/notifier/javascript/test.html)

 套用官方的一句话：**及时发现Bug，提高Debug效率** 

## 1.注册账号获取API KEY

FunDebug需要我们注册一个用户，然后获取API KEY，这个key用来接入FunDebug官方平台的。注册新用户会获取一个免费试用的权限。

在接入FunDebug平台时需要`init`：

```tsx
import fundebug from 'fundebug-javascript';
const API_KEY = 'your api key';
fundebug.init({ apikey: API_KEY });
```

## 2.React项目捕获错误

### 2.1 未使用FunDebug

通过`componentDidCatch`定义一个异常捕获函数，专门用来捕获组件的异常：

```jsx
import React from 'react';

export default function catchError<T>(Com: React.ComponentType<T>) {
  return class ErrorBoundary extends React.Component<T, {}> {
    componentDidCatch(error: Error, info: React.ErrorInfo) {
      console.error('页面出错了', error, info);
    }

    render() {
      return <Com {...this.props} />;
    }
  };
}
```

然后在每个页面中将组件传入给异常捕获函数：

```jsx
import { catchError } from 'catchError';

const HomePage = (props: RouteConfigComponentProps<void>) => {
  return <Main {...stores} {...props} />;
};

export default catchError(HomePage);
```

### 2.2 改进异常捕获函数接入FunDebug

 React 16之前的版本，仅需[接入插件](https://docs.fundebug.com/notifier/javascript/integration/npm.html)即可，无需额外配置。 项目React版本>16，需要额外配置：

+ 使用NPM方式安装[fundebug-javascript](https://www.npmjs.com/package/fundebug-javascript)模块，依赖在`package.json`的`dependencies`里，即生产依赖。

  ```bash
  npm install fundebug-javascript -S
  ```

+ 在项目根目录`index`文件里初始化

  ```jsx
  import fundebug from 'fundebug-javascript';
  
  // eslint-disable-next-line 忽略下行代码的tslint检测
  const API_KEY ='your fundebug apikey';
  // 在其他模块加载之前初始化
  fundebug.init({ apikey: API_KEY });
  
  import './public-path';
  import 'react-app-polyfill/ie9';
  import 'react-app-polyfill/stable';
  import './app';
  ```

  为了防止项目ESLint检测的错误`Import in body of module; recorder to top import/first`，即要把`import`语句提到最前面。改进如下：

  新建`fundebug.tsx`

  ```tsx
  import fundebug from 'fundebug-javascript';
  
  // eslint-disable-next-line 忽略下行代码的tslint检测
  const API_KEY ='your fundebug apikey';
  fundebug.init({ apikey: API_KEY });
  ```

  然后在`import`进去：

  ```tsx
  import './fundebug';
  import './public-path';
  import 'react-app-polyfill/ie9';
  import 'react-app-polyfill/stable';
  import './app';
  ```

+ 改进异常捕获函数

  ```tsx
  import React from 'react';
  import fundebug from 'fundebug-javascript';
  
  export default function catchError<T>(Com: React.ComponentType<T>) {
    return class ErrorBoundary extends React.Component<T, {}> {
      componentDidCatch(error: Error, info: React.ErrorInfo) {
          // 将异常notify给FunDebug
        fundebug.notifyError(error, {
          metaData: {
            info,
          },
        });
      }
  
      render() {
        return <Com {...this.props} />;
      }
    };
  }
  ```

### 2.3 使用官方方式

在项目根目录`index`文件里初始化，使用组件的方式：

+ 定义`ErrorBoundary`组件

  ```tsx
  import React from 'react';
  import fundebug from 'fundebug-javascript';
  
  interface IErrorBoundaryProps {
    children?: React.ReactNode;
  }
  
  export default class ErrorBoundary extends React.Component<
    IErrorBoundaryProps
  > {
    state = { hasError: false };
  
    constructor(props: IErrorBoundaryProps) {
      super(props);
    }
  
    componentDidCatch(error: Error, info: React.ErrorInfo) {
      this.setState({ hasError: true });
  
      fundebug.notifyError(error, {
        metaData: {
          info: info,
        },
      });
    }
  
    render() {
      if (this.state.hasError) {
        return null;
      }
  
      return this.props.children;
    }
  }
  ```

+ 使用`ErrorBoundary`组件包裹Root组件,：

  ```tsx
  ReactDOM.render(
      <ErrorBoundary>
          <App />
      </ErrorBoundary>,
      document.getElementById("root")
  );
  ```



这样，我们就成功的将项目接入FunDebug平台了，可以在FunDebug控制台上查看异常情况。
