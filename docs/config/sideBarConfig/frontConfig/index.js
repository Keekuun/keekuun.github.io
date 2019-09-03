const utils = require('../../../utils/index.js');
const css = ['CSS动画Demo', 'CSS布局Demo'];
const html = ['HTML-canvas', 'HTML-svg'];
const js = [''];

module.exports = {
    css: [utils.genSiderbar('CSS3技术探究', css)],
    html: [utils.genSiderbar('HTML5技术探究', html)],
    js: [utils.genSiderbar('JS技术探究', js)],
};