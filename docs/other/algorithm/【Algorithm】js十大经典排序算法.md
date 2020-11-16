> https://www.cnblogs.com/jztan/p/12273671.html
> https://www.jianshu.com/p/a28db3d3cc18
## 冒泡排序
### 1.常规冒泡排序
```js
function bubbleSort(data) {
    if(data.length < 2) return data;
    for(let i=0;i<data.length;i++) {
        for(let j=0;j<data.length - 1 - i; j++) {
            if(data[j] > data[j+1]) {
                [data[j], data[j+1]] = [data[j+1], data[j]];
            }   
        }   
    }
    return data;
}
```

### 2.改进冒泡排序-标志位

```js
function bubbleSort(data) {
    if(data.length < 2) return data;
    let len = data.length;
  	let flag;
    for(let i=0;i<len;i++) {
        flag = false
        for(let j=0; j<len -i -1; j++) {
            if(data[j]>data[j+1]) {
                [data[j], data[j+1]] = [data[j+1], data[j]];
                // 交换了
                flag = true;
            }
        }
        // 如果没有发生交换，则退出循环
        if(flag) break;
    }
    return data
}
```



### 2.改进冒泡排序-双向

```js
function bubbleSort(data) {
    if(data.length < 2) return data;
    let left = 0;
    let right = data.length - 1;
    
    while(left < right) {
        for(let i=left;i<right;i++) {
            if(data[i] > data[i+1]) {
                [data[i], data[i+1]] = [data[i+1], data[i]];
            }  
        }
        right--;
        for(let i=right;i>left;i--) {
            if(data[i] < data[i-1]) {
                [data[i], data[i-1]] = [data[i-1], data[i]];
            }  
        }
        left++;
    }
    return data;
}
```

## 选择排序
```js
function selectionSort(data) {
    if(data.length < 2) return data;
    let minIndex = 0;
    for(let i=0;i<data.length-1;i++) {
        minIndex = i;
        for(let j=i+1;j<data.length;j++) {
            if(data[j] < data[minIndex]) {
                minIndex = j;
            }
        }
        [data[i], data[minIndex]] = [data[minIndex], data[i]];
    }
    return data;
}
```

## 快速排序
```js
function quickSort(data) {
    if(data.length < 2) return data;
    // 提出最后一个作为基准
    let pivot = data.pop();
    
    // 将data分为基准两侧的
    let left = [];
    let right = [];
    for(let i=0;i<data.length;i++) {
        if(data[i] < pivot) {
            left.push(data[i]);
        } else {
            right.push(data[i])
        }
    }

    // 递归调用 [基准左侧， 基准， 基准右侧]
    return [...quickSort(left), pivot, ...quickSort(right)];
}
```
