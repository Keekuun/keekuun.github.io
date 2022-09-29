# 观察者模式(observer)

观察者模式：定义了对象间一种**一对多**的依赖关系，当目标对象 Subject 的状态发生改变时，所有依赖它的对象 Observer 都会得到通知。

+ 一个目标者对象 Subject，拥有方法：添加 / 删除 / 通知 Observer；

+ 多个观察者对象 Observer，拥有方法：接收 Subject 状态变更通知并处理；

+ 目标对象 Subject 状态变更时，通知所有 Observer。

+ Subject 可以添加一系列 Observer， Subject 负责维护与这些 Observer 之间的联系。

```js
// 目标者
class Subject {
    constructor() {
        // 保存观察者
        this.observers = [];
    }

    // 添加
    add(observer) {
        this.observers.push(observer)
    }

    // 删除
    remove(observer) {
        this.observers = this.observers.filter(ob => ob !== observer)
    }

    // 通知
    notify() {
        this.observers.forEach(ob => {
            ob.update();
        })
    }
}


// 观察者
class Observer {
    constructor(name) {
        this.name = name;
    }

    update() {
        console.log(this.name + ': 收到消息了')
    }
}

// 实例化目标者
let subject = new Subject();

// 实例化两个观察者
let obs1 = new Observer('前端');
let obs2 = new Observer('后端');

// 向目标者添加观察者
subject.add(obs1);
subject.add(obs2);

// 发出通知
subject.notify();
```

优缺点：

+ 优点：降低耦合，两者都专注于自身功能；

+ 缺点：所有观察者都能收到通知，无法过滤筛选；

# 发布订阅模式（Publisher && Subscriber）

发布订阅模式：基于一个事件（主题）通道，希望接收通知的对象 Subscriber 通过自定义事件订阅主题，被激活事件的对象 Publisher 通过发布主题事件的方式通知各个订阅该主题的 Subscriber 对象。

node中的 EventEmitter 采用的正是发布-订阅模式。

```js
class EventEmitter {
    constructor() {
        // 保存多个
        this.events = {};
    }

    // 订阅
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = []
        } else {
            this.events[eventName].push(callback)
        }
    }

    // 促发
    emit(eventName, ...args) {
        this.events[eventName] && this.events[eventName].forEach(f => f.apply(this, args))
    }
    
    // 取消
    off(eventName, callback) {
        if(this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(f => f !== callback)
        }
    }
    
    // 只订阅一次
    once(eventName, callback) {
        const fn = (...args) => {
            callback.apply(this, args);
            // 执行完之后就删除
            this.off(eventName, callback)
        }
        this.on(eventName, fn)
    }
}


```

优缺点：

+ 优点：解耦更好，细粒度更容易掌控；

+ 缺点：不易阅读，额外对象创建，消耗时间和内存（很多设计模式的通病）

发布-订阅模式 其实是 观察者模式 的一种变形，区别在于：发布-订阅模式 在观察者模式的基础上，在目标和观察者之间增加了一个调度中心。

