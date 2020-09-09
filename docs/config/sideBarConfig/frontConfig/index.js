const utils = require('../../../utils/index.js');
const css = ['【CSS】CSS揭秘学习笔记'];
const html = [''];
const js = ['JS设计模式学习笔记'];
const es6 = [
    'ES6-数组方法及其实现',
    'ES6-字符串方法及其实现',
    'ES6-对象方法及其实现',
    'ES6-新增数据类型及其实现',
    'ES6-promise学习及手写promise',
    'ES6-async&await语法糖',
    'ES6-生成器及其实现',
    'ES6-面向对象编程',
];
const vue = ['Vue-学习笔记'];
const react = ['React-学习笔记'];
const angular = ['Angular-学习笔记'];
module.exports = {
    css: [utils.genSiderbar('CSS3技术探究', css)],
    html: [utils.genSiderbar('HTML5技术探究', html)],
    js: [utils.genSiderbar('JS设计模式', js), utils.genSiderbar('ES6', es6)],
    VAR: [utils.genSiderbar('Vue学习笔记', vue)],
};