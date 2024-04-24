module.exports = [
    // 添加时间轴导航
    {text: '主页', link: '/', icon: 'reco-home'},
    {
        text: '前端',
        icon: 'reco-api',
        link: '/categories/前端/',
        items: [
            {
                text: '前端基础', items: [
                    // {text: 'HTML', link: '/tag/HTML/'},
                    {text: 'CSS', link: '/tag/CSS/'},
                    {text: 'JS', link: '/tag/JS/'},
                    {text: 'TS', link: '/tag/TS/'},
                ],
            },

            {
                text: 'VAR', items: [
                    {text: 'vue', link: '/categories/Vue/'},
                    // {text: 'angular', link: '/tag/Angular/'},
                    {text: 'react', link: '/categories/React/'}
                ]
            },
            {
                text: '移动端', items: [
                    {text: 'miniProgram', link: '/categories/移动端/'},
                    {text: 'flutter', link: '/categories/flutter/'},
                ],
            },
        ]
    },
    {
        text: '后端',
        icon: 'reco-coding',
        link: '/categories/后端/',
        items: [
            {
                text: '', items: [
                    {text: 'node', link: '/backEnd/node/'},
                ]
            },
            {
                text: '', items: [
                    {text: 'golang', link: '/backEnd/go/'},
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
                text: '', items: [
                    {text: 'Leetcode', link: 'https://leetcode-cn.com/u/zkkysqs/'},
                    {text: 'Nowcoder', link: 'https://www.nowcoder.com/profile/9027587'},
                ],
            },
            {
                text: '', items: [
                    {text: '网络编程', link: 'https://www.bookstack.cn/read/tcp-udp-ip/1.md'},
                ],
            },
            {
                text: '', items: [
                    {text: 'Google Developer', link: 'https://developers.google.com/web/fundamentals/performance/get-started'},
                    {text: 'Chrome DevTools', link: 'https://developers.google.cn/web/tools/chrome-devtools/'},
                ],
            },
            {
                text: '', items: [
                    {text: 'Vue', link: 'https://vue3js.cn/'},
                    {text: 'Angular', link: 'https://angular.io/docs'},
                    {text: 'React', link: 'https://react.dev/'},
                    {text: 'NextJS', link: 'https://nextjs.org/docs'},
                    {text: 'NodeJS', link: 'https://nodejs.org/en/docs'},
                ],
            },
            // {
            //     text: '', items: [
            //         {text: 'Geekbang', link: 'https://time.geekbang.org/dashboard/course'},
            //         {text: 'Kaikeba', link: 'https://learn.kaikeba.com/home'},
            //     ],
            // },
            {
                text: '', items: [
                    // {text: 'Reading', link: 'http://lxqnsys.com/pdf/'},
                    {text: 'Awesome Books', link: 'https://github.com/guanpengchn/awesome-books'},
                    {text: 'Programming Books', link: 'https://github.com/EbookFoundation/free-programming-books/blob/master/books/free-programming-books-zh.md'},
                ],
            },
            {
                text: '', items: [
                    {text: 'Docschina', link: 'https://docschina.org/'},
                    {text: 'Tool', link: 'https://tool.lu/'},
                ],
            },
        ]
    },
    {text: '流月', link: '/timeLine/', icon: 'reco-date'},
];
