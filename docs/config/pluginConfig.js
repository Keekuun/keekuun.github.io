module.exports = {
    // Service Worker 的配置
    '@vuepress/pwa': {
        serviceWorker: true,
        updatePopup: {
            message: "发现新内容可用!",
            buttonText: "刷新"
        }
    },
    // '@vuepress/google-analytics': {
    //     'ga': 'UA-00000000-0' // UA-00000000-0
    // },
    // 图片放大
    '@vuepress/medium-zoom': true,
    // 流程图
    'flowchart': true,
};