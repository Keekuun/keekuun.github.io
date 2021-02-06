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
                    {text: 'TS', link: '/tag/TS/'},
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
                    {text: 'Vue3', link: 'https://www.yuque.com/hugsun/vue3'},
                    {text: 'vue3js', link: 'https://vue3js.cn/start/'},
                    {text: 'Node', link: 'https://www.yuque.com/hugsun/node'},
                ],
            },
            {
                text: '', items: [
                    {text: 'Geekbang', link: 'https://time.geekbang.org/dashboard/course'},
                    {text: 'Kaikeba', link: 'https://learn.kaikeba.com/home'},
                ],
            },
            {
                text: '', items: [
                    {text: 'Reading', link: 'http://lxqnsys.com/pdf/'},
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
