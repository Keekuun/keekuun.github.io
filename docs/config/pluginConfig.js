const secretKeyConfig = require('../config/secretKeyConfig.js');
module.exports = {
    // 进度条
    '@vuepress/nprogress': true,
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
        selector: '.content__default img',
        // medium-zoom options here
        // See: https://github.com/francoischalifour/medium-zoom#options
        options: {
            margin: 16
        },
    },
    // 流程图
    'flowchart': true,
    'ribbon': {
        size: 66,     // 彩带的宽度，默认为 90
        opacity: 0.3, // 彩带的不透明度，默认为 0.3
        zIndex: -1    // 彩带的 z-index 属性，默认为 -1
    },
    // PDF
    'vuepress-plugin-export': true,
    // 动态标题
    'dynamic-title': {
        showIcon: "/favicon.ico",
        showText: "(/≧▽≦/)咦！又好了！",
        hideIcon: "/failure.ico",
        hideText: "(●—●)喔哟，崩溃啦！",
        recoverTime: 2000
    },
    // 标签加强
    'vuepress-plugin-boxx': true,
    // 代码复制弹窗插件
    'vuepress-plugin-nuggets-style-copy': {
        copyText: "复制",
        tip: {
            content: "复制成功!"
        }
    },
    // 音乐插件
    'meting': {
        // 网易
        server: "netease",
        // 读取歌单
        type: "playlist",
        mid: "7604629",
        // 不配置该项的话不会出现全局播放器
        aplayer: {
            // 吸底模式
            fixed: true,
            mini: true,
            // 自动播放
            autoplay: true,
            // 歌曲栏折叠
            listFolded:true,
            // 颜色
            theme: '#ff0a87',
            // 播放顺序为随机
            order: 'random',
            // 初始音量
            volume: 0.1,
            // 歌词显示 - 0 -关闭
            lrcType: 3,
        },
        mobile :{
            // 手机端去掉cover图
            cover: false,
        }
    }
};
