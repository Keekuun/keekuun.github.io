const utils = require('../../../utils/index.js');
const css = [''];
const html = [''];
const js = ['JS设计模式学习笔记'];

module.exports = {
    css: [utils.genSiderbar('CSS3技术探究', css)],
    html: [utils.genSiderbar('HTML5技术探究', html)],
    js: [utils.genSiderbar('JS技术探究', js)],
};