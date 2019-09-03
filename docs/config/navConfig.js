module.exports = [
    // 添加时间轴导航
    {text: '主页', link: '/', icon: 'reco-home'},
    {
        text: '前端',
        icon: 'reco-home',
        items: [
            {text: 'SEO', link: '/frontEnd/seo/'},
            {
                text: 'HTML', items: [
                    {text: 'HTML基础', link: '/frontEnd/html/'},
                    {text: 'HTML进阶', link: '/frontEnd/html/1'}
                ]
            },
            {
                text: 'CSS', items: [
                    {text: 'CSS基础', link: '/frontEnd/css/'},
                    {text: 'CSS进阶', link: '/frontEnd/css/1'}
                ]
            },
            {
                text: 'JS', items: [
                    {text: 'JS基础', link: '/frontEnd/javascript/'},
                    {text: 'JS进阶', link: '/frontEnd/javascript/1'}
                ]
            },
            {
                text: 'VAR', items: [
                    {text: 'vue', link: '/frontEnd/VAR/vue/'},
                    {text: 'angular', link: '/frontEnd/VAR/angular/'},
                    {text: 'react', link: '/frontEnd/VAR/react/'}
                ]
            },
            {
                text: '移动端', items: [
                    {text: '微信小程序', link: '/mobileEnd/weex/'},
                ]
            },
        ]
    },
    {
        text: '后端',
        icon: 'reco-home',
        items: [
            {
                text: 'Node', items: [
                    {text: 'node基础', link: '/backEnd/node/'},
                    {text: 'node进阶', link: '/backEnd/node/1'}
                ]
            },
            {
                text: 'Java', items: [
                    {text: 'Java基础', link: '/backEnd/java/'},
                    {text: 'Java进阶', link: '/backEnd/java/1'}
                ]
            },
            {
                text: 'Python', items: [
                    {text: 'Python基础', link: '/backEnd/python/'},
                    {text: 'Python进阶', link: '/backEnd/python/1'}
                ]
            },
            {
                text: 'dataBase', items: [
                    {text: 'Mysql', link: '/dataBase/mysql/'},
                    {text: 'Mongodb', link: '/dataBase/mongodb/'}
                ]
            },
        ]
    },
    {
        text: '其他',
        icon: 'reco-home',
        items: [
            {
                text: 'Git', items: [
                    {text: 'Git', link: '/其他技术/git/'},
                ]
            },
            {
                text: 'HTTP', items: [
                    {text: 'HTTP', link: '/其他技术/http/'},
                ]
            },
            {
                text: 'Docker', items: [
                    {text: 'Docker', link: '/其他技术/docker/'},
                ]
            },
            {
                text: 'Maven', items: [
                    {text: 'maven', link: '/其他技术/maven/'},
                ]
            },
        ]
    },
    {text: '时间轴', link: '/timeLine/', icon: 'reco-date'},
    {text: '关于', link: '/about/', icon: 'account_circle'},
];