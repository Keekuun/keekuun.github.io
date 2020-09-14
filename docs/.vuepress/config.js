const pluginConfig = require('../config/pluginConfig.js');
const navConfig = require('../config/navConfig.js');
const sidebarConfig = require('../config/sideBarConfig/index.js');
const headConfig = require('../config/headConfig.js');
const secretKeyConfig = require('../config/secretKeyConfig.js');
module.exports = {
    title: '月上秦少',
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
    themeConfig: {
        // 华为文案
        huawei: true,
        authorAvatar: '/images/avatar.png',
        type: 'blog',
        author: '月上秦少',
        logo: '/images/avatar.png',
        record: 'MIT License',
        startYear: '2018',
        searchMaxSuggestions: 10,
        displayAllHeaders: false, // 不显示所有页面的标题链接，只显示当前页面的标题链接
        // 代码主题配置
        /**
         * support for
         * 'default'
         * 'funky'
         * 'okaidia'
         * 'solarizedlight'
         * 'tomorrow'
         */
        codeTheme: 'tomorrow', // default 'tomorrow'
        // 博客设置
        blogConfig: {
            // 添加分类和标签
            category: {
                location: 5,     // 在导航栏菜单中所占的位置，默认2
                text: '分类' // 默认文案 “分类”
            },
            tag: {
                location: 6,     // 在导航栏菜单中所占的位置，默认3
                text: '标签'      // 默认文案 “标签”
            }
        },
        // 导航栏
        nav: navConfig,
        sidebar: 'auto', //在所有页面中启用自动生成侧栏
        sidebarDepth: 2, // 侧边栏显示2级
        // sidebar: sidebarConfig,
        // 评论(valine)
        valineConfig: {
            appId: secretKeyConfig.valineConfig.appId, // your appId
            appKey: secretKeyConfig.valineConfig.appKey, // your appKey
            placeholder: '欢迎留言！',
            notify: true,
            verify: true,
            avatar: "retro",
            visitor: true,
            recordIP: true
        },

        // algolia: {  // algolia搜索
        //     apiKey: secretKeyConfig.algolia.API_KEY,
        //     appId: secretKeyConfig.algolia.APPLICATION_ID,
        //     indexName:secretKeyConfig.algolia.Indices,
        //     algoliaOptions:{
        //         hitsPerPage: 10,
        //         facetFilters: ''
        //     }
        // },
        lastUpdated: '上次更新',
        // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
        repo: 'zkkysqs/blog',
        // 以下为可选的编辑链接选项
        // 假如文档不是放在仓库的根目录下：
        docsDir: 'docs',
        // 默认是 false, 设置为 true 来启用
        editLinks: true,
        editLinkText: '在 GitHub 上编辑此页',
    },
    markdown: {
        // 为每行代码增加行号
        // lineNumbers: true,
        anchor: {
            permalink: true, permalinkBefore: true, permalinkSymbol: '🌙'
        },
    },
    // 插件
    plugins: pluginConfig,
};
