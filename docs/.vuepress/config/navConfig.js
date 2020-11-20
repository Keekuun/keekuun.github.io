module.exports = [
    // 添加时间轴导航
    {text: '主页', link: '/', icon: 'reco-home'},
    {
        text: '前端',
        icon: 'reco-api',
        link: '/categories/前端/',
        items: [
            {
                text: '基础', items: [
                    // {text: 'HTML', link: '/tag/HTML/'},
                    {text: 'CSS', link: '/tag/CSS/'},
                    {text: 'JS', link: '/tag/JS/'},
                ],
            },

            {
                text: '框架', items: [
                    {text: 'vue', link: '/tag/Vue/'},
                    // {text: 'angular', link: '/tag/Angular/'},
                    {text: 'react', link: '/tag/React/'}
                ]
            },
        ]
    },
    {
        text: '后端',
        icon: 'reco-coding',
        link: '/categories/后端/',
        // items: [
        //     {
        //         text: 'Node', items: [
        //             {text: 'node基础', link: '/backEnd/node/'},
        //         ]
        //     },
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
        // ]
    },
    {
        text: '其他',
        icon: 'reco-other',
        link: '/categories/其他/',
        items: [
            {text: 'Git', link: '/tag/Git/'},
            {text: '算法', link: '/tag/Algorithm/'},
            {text: '面试', link: '/tag/面试/'},
        ]
    },
    {text: '流月', link: '/timeLine/', icon: 'reco-date'},
];
