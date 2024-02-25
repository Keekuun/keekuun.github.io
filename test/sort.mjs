import {genRandomNumArr, testFunc} from "./tool.mjs"

function bubbleSort(data) {
  if (data.length < 2) return data;
  let left = 0;
  let right = data.length - 1;

  while (left < right) {
    let flag = true

    for (let i = left; i < right; i++) {
      if (data[i] > data[i + 1]) {
        [data[i], data[i + 1]] = [data[i + 1], data[i]];
        flag = false
      }
    }
    console.log('[after left]:', data.toString())
    // 最右边已经是最大的了
    right--;
    for (let i = right; i > left; i--) {
      if (data[i] < data[i - 1]) {
        [data[i], data[i - 1]] = [data[i - 1], data[i]];
        flag = false
      }
    }
    // 最左边已经时最小的了
    console.log('【after right】:', data.toString())
    left++;

    if (flag) break;
  }
  return data;
}

// testFunc(bubbleSort)

function optimizedSelectionSort(nums) {
  let n = nums.length

  let left = 0
  let right = n - 1

  while (left < right) {
    let minIndex = left
    let maxIndex = right

    for (let i = left; i <= right; i++) {
      if (nums[i] < nums[minIndex]) minIndex = i
      if (nums[i] > nums[maxIndex]) maxIndex = i
    }

    console.log('[left交换前-nums]:', nums.toString())
    console.log('[left交换前-minIndex]:', minIndex)
    console.log('[left交换前]-maxIndex:', maxIndex)
    console.log('[left交换前-left]:', left)
    console.log('[left交换前]-right:', right)

    if (minIndex !== left) {
      [nums[minIndex], nums[left]] = [nums[left], nums[minIndex]]
    }

    console.log('[left交换后-nums]:', nums.toString())
    console.log('[left交换后-minIndex]:', minIndex)
    console.log('[left交换后]-maxIndex:', maxIndex)
    console.log('[left交换后-left]:', left)
    console.log('[left交换后]-right:', right)

    // 如果最大的在左边，由于上一步已经把左边的交换了，所以需要修正
    if (maxIndex === left) {
      maxIndex = minIndex;
    }

    console.log('[maxIndex修复后-nums]:', nums.toString())
    console.log('[maxIndex修复后-minIndex]:', minIndex)
    console.log('[maxIndex修复后]-maxIndex:', maxIndex)
    console.log('[maxIndex修复后-left]:', left)
    console.log('[maxIndex修复后]-right:', right)

    if (maxIndex !== right) {
      [nums[maxIndex], nums[right]] = [nums[right], nums[maxIndex]]
    }

    console.log('[right交换后-nums]:', nums.toString())
    console.log('[right交换后-minIndex]:', minIndex)
    console.log('[right交换后]-maxIndex:', maxIndex)
    console.log('[right交换后-left]:', left)
    console.log('[right交换后]-right:', right)

    left++
    right--
  }

  return nums
}

// testFunc(optimizedSelectionSort)

// console.log(optimizedSelectionSort([96, 9, 55, 40, 88, 50, 28, 30, 90, 52]))

function selectionSort1(nums) {
  let n = nums.length

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i

    for (let j = i + 1; j < n; j++) {
      if (nums[j] < nums[minIndex]) {
        minIndex = j
      }
    }

    [nums[minIndex], nums[i]] = [nums[i], nums[minIndex]]
  }

  return nums
}

function selectionSort2(nums) {
  let n = nums.length
  let left = 0;
  let right = n - 1

  while (left < right) {
    let minIndex = left

    for (let i = left + 1; i <= right; i++) {
      if (nums[i] < nums[minIndex]) {
        minIndex = i
      }
    }

    if (minIndex !== left) {
      [nums[minIndex], nums[left]] = [nums[left], nums[minIndex]]
    }

    left++
  }

  return nums
}

function selectionSort3(nums) {
  let left = 0
  let right = nums.length - 1

  while (left < right) {
    let minIndex = left
    let maxIndex = right

    for (let i = left; i <= right; i++) {
      if (nums[i] < nums[minIndex]) {
        minIndex = i
      }
      if (nums[i] > nums[maxIndex]) {
        maxIndex = i
      }
    }

    if (minIndex !== left) {
      [nums[minIndex], nums[left]] = [nums[left], nums[minIndex]]
    }

    if (maxIndex === left) {
      maxIndex = minIndex
    }

    if (maxIndex !== right) {
      [nums[maxIndex], nums[right]] = [nums[right], nums[maxIndex]]
    }

    left++
    right--
  }
}

// testFunc(selectionSort3)


function insertionSort(nums) {
  let n = nums.length
  // 假设前1个数已经有序
  for (let i = 1; i < n; i++) {
    // 取出后续的数插到已排序队列中进来
    // for(let j=i; j>0; j--) {
    //   if(nums[j] < nums[j-1]) {
    //     [nums[j], nums[j - 1]] = [nums[j - 1], nums[j]]
    //   }
    // }

    for (let j = 0; j < i; j++) {
      if (nums[i] < nums[j]) {
        [nums[i], nums[j]] = [nums[j], nums[i]]
      }
    }
  }

  return nums
}

// testFunc(insertionSort)

function bubbleSort1(nums) {
  let n = nums.length

  for (let i = n - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (nums[j] > nums[j + 1]) {
        [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]]
      }
    }
  }

  return nums
}

// testFunc(bubbleSort1)


function mergeSort(nums) {

  // 合并 数组1[left, mid] 数组2[mid+1, right]数组
  function _merge(_nums, left, mid, right) {
    // 临时存放数组
    const temp = new Array(right - left + 1)
    let i = left // 左数组遍历指针
    let j = mid + 1//右数组遍历指针
    let k = 0 // 临时数组指针

    while (i <= mid && j <= right) {
      if (_nums[i] < _nums[j]) {
        temp[k++] = _nums[i++]
      } else {
        temp[k++] = _nums[j++]
      }
    }

    while (i <= mid) {
      temp[k++] = _nums[i++]
    }
    while (j <= right) {
      temp[k++] = _nums[j++]
    }

    for (let t = 0; t < temp.length; t++) {
      _nums[left + t] = temp[t]
    }
  }

  // 区间 [left, right]
  function _sort(_nums, left, right) {
    // 终止条件
    if (left >= right) return

    // 分而治之
    let mid = ~~((left + right) / 2)
    _sort(_nums, left, mid)
    _sort(_nums, mid + 1, right)

    _merge(_nums, left, mid, right)
  }

  _sort(nums, 0, nums.length - 1)
  return nums
}


// testFunc(mergeSort)

function quickSort(nums) {

  // 结果：左子数组任意元素 <= 基准元素 <= 右子数组任意元素
  function _partition(_nums, left, right) {
    // 以nums[left]作为基准
    let i = left
    let j = right

    while (i < j) {
      // 从右往左找到首个小于基准的数
      while (i < j && _nums[j] >= _nums[left]) {
        j--
      }
      // 从左往右找到首个大于基准的数
      while (i < j && _nums[i] <= _nums[left]) {
        i++
      }

      // 交换这两个元素
      [_nums[i], _nums[j]] = [_nums[j], _nums[i]]
    }
    // 将基准数交换至两子数组的分界线
    [_nums[i], _nums[left]] = [_nums[left], _nums[i]]

    return i
  }

  function _sort(_nums, left, right) {
    if (left >= right) return

    const pivotIndex = _partition(_nums, left, right)

    console.log('[pivotIndex]:', pivotIndex)

    _sort(_nums, left, pivotIndex - 1)
    _sort(_nums, pivotIndex + 1, right)
  }

  _sort(nums, 0, nums.length - 1)

  return nums
}

// testFunc(quickSort)

function heapSort(nums) {
  let n = nums.length

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    _siftDown(nums, n, i)
  }

  for (let i = n - 1; i >= 0; i--) {
    _swap(nums, i, 0)
    _siftDown(nums, i, 0)
  }

  function _swap(_nums, i, j) {
    [_nums[i], _nums[j]] = [_nums[j], _nums[i]]
  }

  function _siftDown(_nums, n, i) {
    while(true) {
      let l = 2 * i + 1
      let r = 2 * i + 2
      let ma = i

      if(l < n && _nums[l] > _nums[ma]) {
        ma = l
      }
      if(r < n && _nums[r] > _nums[ma]) {
        ma = r
      }
      if(ma === i) break

      _swap(_nums, ma, i)

      i = ma
    }
  }

  return nums
}

// testFunc(heapSort)