const navConfig = require('./navConfig.js');
const secretKeyConfig = require('./secretKeyConfig.js');
module.exports = {
    // 默认值是 true 。设置为 false 来禁用所有页面的 下一篇 链接
    nextLinks: true,
    // 默认值是 true 。设置为 false 来禁用所有页面的 上一篇 链接
    prevLinks: true,
    // 华为文案
    huawei: true,
    authorAvatar: '/images/avatar.png',
    type: 'blog',
    author: '月上秦少',
    logo: '/images/avatar.png',
    record: 'MIT License',
    startYear: '2018',
    searchMaxSuggestions: 10,
    displayAllHeaders: true, // 不显示所有页面的标题链接，只显示当前页面的标题链接
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
    // 启用页面滚动效果
    smoothScroll: true,
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
    sidebarDepth: 3, // 侧边栏显示2级
    // 评论(valine)
    valineConfig: {
        appId: secretKeyConfig.valineConfig.appId, // your appId
        appKey: secretKeyConfig.valineConfig.appKey, // your appKey
        placeholder: '欢迎留言！',
        notify: true,
        verify: true,
        avatar: 'monsterid',
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
    repo: 'https://gitee.com/keekuun/blog',
    // 以下为可选的编辑链接选项
    // 假如文档不是放在仓库的根目录下：
    docsDir: 'docs',
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    editLinkText: '在 Gitee 上编辑此页',
};
