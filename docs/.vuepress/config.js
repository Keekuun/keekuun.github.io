const pluginConfig = require('./config/pluginConfig.js');
const headConfig = require('./config/headConfig.js');
const themeConfig = require('./config/themeConfig');
module.exports = {
    title: '月上秦少',
    base: '/blog/',
    description: '每一个不曾起舞的日子，都是对生命的辜负！',
    locales: {
        '/': {
            lang: 'zh-CN',// 设置语言
        }
    },
    // author
    author: '月上秦少',
    theme: 'vuepress-theme-reco',
    head: headConfig,
    themeConfig: themeConfig,
    markdown: {
        // 为每行代码增加行号
        lineNumbers: true,
        anchor: {
            permalink: true, permalinkBefore: true, permalinkSymbol: '🌙'
        },
    },
    // 插件
    plugins: pluginConfig,
};
