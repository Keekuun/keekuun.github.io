function throttle1(fn, delay = 500) {
    let oldtime = Date.now()

    return function (...args) {
        let newtime = Date.now();
        if (newtime - oldtime >= delay) {
            fn.apply(null, args)
            oldtime = Date.now()
        }
    }
}

function throttle1(fn, delay = 500) {
    let timer = null

    return function (...args) {
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, args)
            }, delay)
        }
    }
}


function debounce(fn, wait) {
    let timer = null;

    return function (...args) {
        if (timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(() => {
            fn.apply(this, args)
        }, wait)
    }
}


const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    status = PENDING;
    success = null;
    error = null;
    onFulfilledCallbacks = [];
    onRejectedCallbacks = [];

    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }

    resolve = (val) => {
        if (this.status === PENDING) {
            this.status = FULFILLED;
            this.success = val;

            while (this.onFulfilledCallbacks.length) {
                let cb = this.onFulfilledCallbacks.shift();
                cb(val)
            }
        }
    }

    reject = (err) => {
        if (this.status === PENDING) {
            this.status = REJECTED;
            this.error = err;
            while (this.onRejectedCallbacks.length) {
                let cb = this.onFulfilledCallbacks.shift();
                cb(err)
            }
        }
    }

    then = (onFulfilled, onRejected) => {
        const _onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : d => d;
        const _onRejected = typeof onRejected === 'function' ? onRejected : err => (throw err);

        const promise = new MyPromise((resolve, reject) => {
            const fulfilledMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const res = _onFulfilled(this.success)
                        resolvePromise(promise, res, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }

            const rejectedMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const res = _onRejected(this.error)
                        resolvePromise(promise, res, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }

            if (this.status === FULFILLED) {
                fulfilledMicrotask()
            } else if (this.status === REJECTED) {
                rejectedMicrotask()
            } else {
                this.onFulfilledCallbacks.push(fulfilledMicrotask)
                this.onRejectedCallbacks.push(rejectedMicrotask)
            }
        })

        return promise;
    }

    catch = (fn) => {
        return this.then(undefined, fn)
    }

    finally = fn => {
        return this.then(res => {
            MyPromise.resolve(fn()).then(d => d)
        }, err => {
            MyPromise.resolve(fn()).then(() => {
                throw new Error(err)
            })
        })
    }

    static resolve(val) {
        if (val instanceof MyPromise) {
            return val;
        }

        return new MyPromise(res => res(val))
    }

    static reject(err) {
        return new MyPromise((res, rej) => rej(err))
    }

    static all(arr) {
        let ans = [];
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < arr.length; i++) {
                MyPromise.resolve(arr[i]).then(res => {
                    ans[i] = res
                }).catch(e => {
                    reject(e)
                    break;
                })

                if (i === ans.length - 1) {
                    resolve(ans)
                }
            }
        })
    }

    static allSettled(arr) {
        let ans = [];
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < arr.length; i++) {
                MyPromise.resolve(arr[i]).then(res => {
                    ans[i] = {status: FULFILLED, value: res}
                }).catch(err => {
                    ans[i] = {status: REJECTED, value: err}
                })

                if (i === ans.length - 1) {
                    resolve(ans)
                }
            }
        })
    }


    static any(arr) {
        let ans = [];
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < arr.length; i++) {
                MyPromise.resolve(arr[i]).then(res => {
                    resolve(res)
                }).catch(err => {
                    ans[i] = err
                })

                if (i === ans.length - 1) {
                    reject(ans)
                }
            }
        })
    }


    static race(arr) {
        let ans = [];
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < arr.length; i++) {
                MyPromise.resolve(arr[i]).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(res)
                })
            }
        })
    }
}

function resolvePromise(promise, x, resolve, reject) {
    // 如果相等了，说明return的是自己，抛出类型错误并返回
    if (promise === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (typeof x === 'object' || typeof x === 'function') {
        // x 为 null 直接返回，走后面的逻辑会报错
        if (x === null) {
            return resolve(x);
        }

        let then;
        try {
            // 把 x.then 赋值给 then
            then = x.then;
        } catch (error) {
            // 如果取 x.then 的值时抛出错误 error ，则以 error 为据因拒绝 promise
            return reject(error);
        }
    } else {
        // 普通值
        resolve(x)
    }
}

module.exports = MyPromise

/**
 * Creates a Promise that is resolved with an array of results when all of the provided Promises
 * resolve, or rejected when any Promise is rejected.
 * @param values An array of Promises.
 * @returns A new Promise.
 */
Promise.all()
/**
 * Creates a Promise that is resolved with an array of results when all
 * of the provided Promises resolve or reject.
 * @param values An array of Promises.
 * @returns A new Promise.
 */
Promise.allSettled()
/**
 * The any function returns a promise that is fulfilled by the first given promise to be fulfilled, or rejected with an AggregateError containing an array of rejection reasons if all of the given promises are rejected. It resolves all elements of the passed iterable to promises as it runs this algorithm.
 * @param values An array or iterable of Promises.
 * @returns A new Promise.
 */
Promise.any()
/**
 * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
 * or rejected.
 * @param values An iterable of Promises.
 * @returns A new Promise.
 */
Promise.race()

// ids = [1,1,1,2,3,2]
/***
 * ids = [1,1,1,2,3,2]
 * countObj = {
 *     1: 3,
 *     2: 2,
 *     3: 1
 * }
 *
 * */
function deleteProducts(ids, m) {
    let len = ids.length;
    if (m >= len) {
        return 0;
    }

    let countObj = {};
    let diff = 0;
    for (let id of ids) {
        if (countObj[id]) {
            countObj[id] = countObj[id] + 1
        } else {
            countObj[id] = 1;
            diff++;
        }
    }

    let arr = [];
    for(let key in countObj) {
        arr.push([key, countObj[key]])
    }

    // [[3,1], [2,2], [1,3]] // 2
    arr.sort((a,b) => a[1] - b[1]);

    for(let i=0; i<arr.length; i++) {
        if(arr[i][1] <= m) {
            m = m - arr[i][1]; // 1
            diff--;
        } else {
            break;
        }
    }

    return diff;
}

// [4,6,5,3,5,4]  [3,6,4,4,5, 5]
function itemSort(items) {
    const obj = items.reduce((acc, cur) => {
        acc[cur] = (acc[cur] || 0) + 1;
        return acc;
    }, {});

    let arr = [];
    for(let key in obj) {
        arr.push([key, obj[key]])
    }

    return arr.sort((a, b) => {
        if(a[1] === b[1]) {
            return a[0] - b[0]
        } else {
            return a[1] - b[1]
        }
    }).flatMap(d => new Array(+d[1]).fill(+d[0]))
}
