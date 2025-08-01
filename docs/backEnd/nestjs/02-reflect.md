---
title: nestjs基础之Reflect
date: 2025-03-6
categories:
    - 后端
    - nestjs
tags:
    - nestjs
    - node
    - ES6
    - reflect
---

## [Reflect](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
+ ES6引入的内置对象、不是函数，无法`new`，提供反射方法（这些方法之前分散在Object或Function上）
+ 和 `Proxy`一样，`Reflect`也可以拦截`Object`原生的操作，`Reflect`方法与`Proxy`方法一一对应

### Reflect Api
+ `Reflect.get(target, propertyKey[, receiver])` 获取属性,类似于 `target[name]`
+ `Reflect.set(target, propertyKey, value[, receiver])` 设置属性, 类似于 `target[name] = value`。返回一个`Boolean`，如果设置成功，返回`true`
+ `Reflect.has(target, propertyKey)` 判断属性是否存在， 类似于 `in`操作符。返回一个`Boolean`，如果存在返回`true`
+ `Reflect.deleteProperty(target, propertyKey)` 删除属性，类似于 `delete target[name]`。 返回一个`Boolean`，如果删除成功，返回`true`
+ `Reflect.defineProperty(target, propertyKey, attributes)` 定义属性，类似于 `Object.defineProperty`。 返回一个`Boolean`，如果定义成功，返回`true`
+ `Reflect.getOwnPropertyDescriptor(target, propertyKey)` 获取属性描述符， 类似于 `Object.getOwnPropertyDescriptor`。返回一个属性描述符对象，如果属性不存在，返回`undefined`
+ `Reflect.getPrototypeOf(target)` 获取原型， 类似于 `Object.getPrototypeOf`。返回一个对象，如果对象没有原型，返回`null`
+ `Reflect.setPrototypeOf(target, prototype)` 设置原型， 类似于 `Object.setPrototypeOf`。返回一个`Boolean`，如果设置成功，返回`true`
+ `Reflect.apply(target, thisArgument, argumentsList)` 调用函数，类似于 `Function.prototype.apply`。返回一个函数执行结果
+ `Reflect.construct(target, argumentsList[, newTarget])` 构造函数，类似于 `new target(...argumentsList)`。返回一个对象
+ `Reflect.ownKeys(target)` 获取对象所有键， 类似于 `Object.getOwnPropertyNames`。返回一个数组，包含对象所有键
+ `Reflect.isExtensible(target)` 判断对象是否可扩展， 类似于 `Object.isExtensible`。返回一个`Boolean`，如果对象可扩展，返回`true`
+ `Reflect.preventExtensions(target)` 阻止对象扩展， 类似于 `Object.preventExtensions`。返回一个`Boolean`，如果对象可扩展，返回`true`

## [reflect-metadata](https://rbuckton.github.io/reflect-metadata/)
`reflect-metadata`是用于TS和ECMA的元数据反射库，通过提供对元数据定义和检查的支持，简化了装饰器的使用，可以在类、属性、方法上进行元数据操作。

安装：
```bash
pnpm install reflect-metadata
```

它提供了一些装饰器，用于在运行时对类、属性、方法进行元数据操作，如：
+ `Reflect.metadata(metadataKey: any, metadataValue: any): {(target: Function): void;(target: Object, propertyKey: string | symbol): void;}`：用于设置元数据信息，参数为键值对，键为元数据名称，值为元数据值
+ `Reflect.defineMetadata(metadataKey: any, metadataValue: any, target: Object, propertyKey?: string | symbol): void`：用于定义元数据信息，参数为键值对，键为元数据名称，值为元数据值
+ `Reflect.getMetadata(metadataKey: any, target: Object): any`：用于获取元数据信息，参数为元数据名称和目标对象（类、属性、方法等）
+ `Reflect.getOwnMetadata(metadataKey: any, target: Object): any`：用于获取目标对象的元数据信息，参数为元数据名称和目标对象（类、属性、方法等）
+ `Reflect.getMetadataKeys(target: Object, propertyKey?: string | symbol): any[]`：用于获取目标对象的元数据键，参数为目标对象（类、属性、方法等）
+ `Reflect.hasMetadata(metadataKey: any, target: Object, propertyKey?: string | symbol): boolean`：用于判断目标对象是否具有指定元数据键，参数为目标对象（类、属性、方法等）和元数据键
+ `Reflect.hasOwnMetadata(metadataKey: any, target: Object, propertyKey?: string | symbol): boolean`：用于判断目标对象是否具有指定元数据键，参数为目标对象（类、属性、方法等）和元数据键
+ `Reflect.deleteMetadata(metadataKey: any, target: Object, propertyKey?: string | symbol): boolean`：用于删除目标对象的元数据键，参数为目标对象（类、属性、方法等）和元数据键

```ts
import "reflect-metadata"

class MyClass {
    @Reflect.metadata("private", true)
    private readonly myProperty: string
    constructor(myProperty: string) {
        this.myProperty = myProperty
    }

    @Reflect.metadata("customKey", 'customValue')
    myMethod() {
        console.log(this.myProperty)
    }
}

const myClass = new MyClass("Hello World")
myClass.myMethod()

console.log(Reflect.getMetadata("customKey", myClass, "myMethod")) // 输出：customValue
console.log(Reflect.getMetadata("private", myClass, "myProperty")) // 输出：true
console.log(Reflect.ownKeys(myClass)) // 输出：[ 'myProperty' ]
console.log(Reflect.getMetadataKeys(myClass)) // 输出：[]
```
