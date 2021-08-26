function add(a, b) {
    let i = a.toString().trim().length - 1;
    let j = b.toString().trim().length - 1;

    let ans = '';
    let carry = 0;

    while(i>=0 || j>=0) {
        let x = 0;
        let y = 0;
        let sum;

        if(i>=0) {
            x = +a[i];
            i--;
        }
        if(j>=0) {
            y = +b[j];
            j--;
        }

        sum = x + y + carry;
        if(sum >= 10) {
            carry = Math.floor(sum / 10);
            sum = sum % 10;
        } else {
            carry = 0;
        }

        ans = sum + ans;
    }

    if(carry) {
        ans = carry  + ans;
    }

    return ans;
}

function mul(a, b) {
    a = a.toString().trim();
    b = b.toString().trim();
    let m = a.length;
    let n = b.length;

    let res = new Array(m + n).fill(0);

    // 从个位开始相乘
    for(let i=m-1;i>=0;i--) {
        for(let j=n-1;j>=0;j--) {
            let mu = a[i] * b[j];
            console.log(mu);
            let p1 = i + j;
            let p2 = i + j + 1;
            let sum = mu + res[p2];
            res[p2] = sum % 10;
            res[p1] += ~~(sum / 10);
            console.log(sum, res);
        }
    }

    // 去除首位多余的0
    let i=0;
    while(i < res.length && res[i] === 0) {
        i++;
    }

    let ans = res.slice(i).join('');

    return ans || '0';
}


function topK(arr, k) {
    return quickSort(arr).slice(0, k);
}

function quickSort(arr) {
    if(!arr || arr.length < 2) return arr;

    let len = arr.length;
    let pivot = arr.pop();
    let left = [];
    let right = [];

    for(let n of arr) {
        if(n<=pivot) {
            left.push(n)
        } else {
            right.push(n);
        }
    }

    return [...quickSort(left), pivot, ...quickSort(right)]
}

function bubbleSort(arr) {
    if(!arr || arr.length < 2) return arr;

    for(let i=0; i<arr.length; i++) {
        for(let j=0; j<arr.length - 1 - i; j++) {
            if(arr[j] > arr[j + 1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
            }
        }
    }

    return arr;
}

function bubbleSortK(arr, k) {
    if(!arr || arr.length < 2) return arr;

    for(let i=0; i<k; i++) {
        for(let j=0; j<arr.length - 1 - i; j++) {
            if(arr[j] < arr[j + 1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
            }
        }
    }

    return arr.slice(0, k);
}


console.log(mul(34, 78));
