const secretKeyConfig = require('../config/secretKeyConfig.js');
module.exports = {
    // Service Worker 的配置
    '@vuepress/pwa': {
        serviceWorker: true,
        updatePopup: {
            message: "发现新内容可用!",
            buttonText: "刷新"
        }
    },
    // 谷歌分析
    '@vuepress/google-analytics': {
        ga: secretKeyConfig.googleAnalytics.ga
    },
    // 图片放大
    '@vuepress/medium-zoom': {
        selector: 'img',
        // medium-zoom options here
        // See: https://github.com/francoischalifour/medium-zoom#options
        options: {
            margin: 16
        },
    },
    // 流程图
    'flowchart': true,
};