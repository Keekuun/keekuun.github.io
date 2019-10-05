module.exports = [
    // 添加时间轴导航
    {text: '主页', link: '/', icon: 'reco-home'},
    {
        text: '前端',
        icon: 'reco-api',
        items: [
            {
                text: '基础', items: [
                    {text: 'HTML', link: '/frontEnd/html/'},
                    {text: 'CSS', link: '/frontEnd/css/'},
                    {text: 'JS', link: '/frontEnd/javascript/'},
                ]
            },

            {
                text: '框架', items: [
                    {text: 'vue', link: '/frontEnd/VAR/vue/'},
                    {text: 'angular', link: '/frontEnd/VAR/angular/'},
                    {text: 'react', link: '/frontEnd/VAR/react/'}
                ]
            },
        ]
    },
    {
        text: '后端',
        icon: 'reco-coding',
        items: [
            {
                text: 'Node', items: [
                    {text: 'node基础', link: '/backEnd/node/'},
                ]
            },
            // {
            //     text: 'Java', items: [
            //         {text: 'Java基础', link: '/backEnd/java/'},
            //         {text: 'Java进阶', link: '/backEnd/java/1'}
            //     ]
            // },
            // {
            //     text: 'Python', items: [
            //         {text: 'Python基础', link: '/backEnd/python/'},
            //         {text: 'Python进阶', link: '/backEnd/python/1'}
            //     ]
            // },
            // {
            //     text: 'DataBase', items: [
            //         {text: 'Mysql', link: '/dataBase/mysql/'},
            //         {text: 'Mongodb', link: '/dataBase/mongodb/'}
            //     ]
            // },
        ]
    },
    {
        text: '其他',
        icon: 'reco-other',
        items: [
            {text: 'Git', link: '/其他技术/git/'},
            {text: 'HTTP', link: '/其他技术/http/'},
            // {text: 'Docker', link: '/其他技术/docker/'},
            // {text: 'maven', link: '/其他技术/maven/'},
        ]
    },
    {text: '流月', link: '/timeLine/', icon: 'reco-date'},
];
