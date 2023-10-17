---
title: 解决React请求竞态bug
date: 2023-10-17
sidebar: auto
categories: 
- React
- 前端
tags: 
- JS
- React
---

## what - 什么是请求竞态？
比如： 在react组件中，组件接收一个`props id`作为请求的参数，获取后端数据更新组件内容：

```jsx
import React, { useEffect, useState } from 'react';

export default function DataDisplayer(props) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://swapi.dev/api/people/${props.id}/`);
      const newData = await response.json();
      setData(newData);
    };

    fetchData();
  }, [props.id]);

  if (data) {
    return <div>{data.name}</div>;
  } else {
    return null;
  }
}

```

如果组件接收的`id`频繁切换，由于网络波动问题，新的`id`已经展示，但是上一次的`fetchData`响应数据晚于当前的`fetchData`响应数据，就会导致当前的id与展示的内容不符。这个现象就是**请求竞态问题**

我们可以使用一个`setTimeout`函数模拟网络超时：
```jsx
export default function DataDisplayer(props) {
  const [data, setData] = useState(null);
  const [fetchedId, setFetchedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(async () => {
        const response = await fetch(
          `https://swapi.dev/api/people/${props.id}/`
        );
        const newData = await response.json();

        setFetchedId(props.id);
        setData(newData);
      }, Math.round(Math.random() * 12000));
    };

    fetchData();
  }, [props.id]);

  if (data) {
    return (
      <div>
        <p style={{ color: fetchedId === props.id ? 'green' : 'red' }}>
          Displaying Data for: {fetchedId}
        </p>
        <p>{data.name}</p>
      </div>
    );
  } else {
    return null;
  }
}
```

在多次切换`id`的时候，之前的响应就很有可能晚于后续的响应，这样就可以促发这个bug了。

> [codesandbox example](https://codesandbox.io/s/beating-async-race-conditions-in-react-7759f?file=/src/DataDisplayer.js)

## how - 解决方案

> 为了方便测试，下面的代码都增加了`setTimeout`延迟响应。

### 1.使用一个标志位清除状态：
```jsx
useEffect(() => {
  let active = true;

  const fetchData = async () => {
    setTimeout(async () => {
      const response = await fetch(`https://swapi.dev/api/people/${props.id}/`);
      const newData = await response.json();
      if (active) {
        setFetchedId(props.id);
        setData(newData);
      }
    }, Math.round(Math.random() * 12000));
  };

  fetchData();
  return () => {
    active = false;
  };
}, [props.id]);
```

### 2.使用[AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)取消请求:
```jsx
useEffect(() => {
  const abortController = new AbortController();

  const fetchData = async () => {
    setTimeout(async () => {
      try {
        const response = await fetch(`https://swapi.dev/api/people/${id}/`, {
          signal: abortController.signal,
        });
        const newData = await response.json();

        setFetchedId(id);
        setData(newData);
      } catch (error) {
        if (error.name === 'AbortError') {
          // Aborting a fetch throws an error
          // So we can't update state afterwards
        }
        // Handle other request errors here
      }
    }, Math.round(Math.random() * 12000));
  };

  fetchData();
  return () => {
    abortController.abort();
  };
}, [id]);
```

这样一来， 只要`id`变化了，就会把上一次请求中的状态清除，保证每次的`id`与响应都匹配。

> [Fixing Race Conditions in React with useEffect](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)
