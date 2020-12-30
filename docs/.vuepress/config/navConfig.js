module.exports = [
    // 添加时间轴导航
    {text: '主页', link: '/', icon: 'reco-home'},
    {
        text: '前端',
        icon: 'reco-api',
        link: '/categories/前端/',
        items: [
            {
                text: '', items: [
                    // {text: 'HTML', link: '/tag/HTML/'},
                    {text: 'CSS', link: '/tag/CSS/'},
                    {text: 'JS', link: '/tag/JS/'},
                ],
            },

            {
                text: '', items: [
                    {text: 'vue', link: '/tag/Vue/'},
                    // {text: 'angular', link: '/tag/Angular/'},
                    {text: 'react', link: '/tag/React/'}
                ]
            },
            {
                text: '', items: [
                    {text: '移动端', link: '/categories/移动端/'},
                ],
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
            {text: '算法', link: '/tag/算法/'},
            {text: '工程化', link: '/tag/工程化/'},
            {text: '测试', link: '/tag/测试/'},
            {text: '优化', link: '/tag/优化/'},
            {text: '配置', link: '/tag/配置/'},
            {text: 'webpack', link: '/tag/webpack/'},
            {text: 'Git', link: '/tag/Git/'},
        ]
    },
    {
        text: '资源',
        icon: 'reco-blog',
        items: [
            {
                text: '算法', items: [
                    {text: 'Leetcode', link: 'https://leetcode-cn.com/u/zkkysqs/'},
                    {text: '牛客网', link: 'https://www.nowcoder.com/profile/9027587'},
                ],
            },
            {
                text: '前端', items: [
                    {text: 'Vue3生态技术内幕', link: 'https://www.yuque.com/hugsun/vue3'},
                    {text: 'Node.js与前端架构实践', link: 'https://www.yuque.com/hugsun/node'},
                ],
            },
            {
                text: '学习', items: [
                    {text: '极客时间', link: 'https://time.geekbang.org/dashboard/course'},
                    {text: '开课吧', link: 'https://learn.kaikeba.com/home'},
                ],
            },
            {
                text: '书籍', items: [
                    {text: '七里香', link: 'http://lxqnsys.com/pdf/'},
                    {text: 'awesome-books', link: 'https://github.com/guanpengchn/awesome-books'},
                ],
            }
        ]
    },
    {text: '流月', link: '/timeLine/', icon: 'reco-date'},
];
