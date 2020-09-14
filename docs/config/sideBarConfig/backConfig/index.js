// const path = require('path');
const utils = require('../../../utils/index.js');
// const dir = path.join(__dirname, '../../../backEnd');

// utils.getBlogDir(dir).then(res => {
//     let blogDir = {};
//     res.forEach(d => {
//         blogDir = { ...blogDir, ...d };
//     });
//     return blogDir;
// });
// 怎么exports异步回调的值
const node =  [
    'Express框架学习笔记',
    'NodeJS之Buffer模块学习笔记',
    'NodeJS之child_process模块学习笔记',
    'NodeJS之cluster模块学习笔记',
    'NodeJS之console模块学习笔记',
    'NodeJS之events模块学习笔记',
    'NodeJS之fs模块学习笔记',
    'NodeJS之global全局变量学习笔记',
    'NodeJS之HelloWorld',
    'NodeJS之HTTP模块学习笔记',
    'NodeJS之MD5加密',
    'NodeJS之module模块学习笔记',
    'NodeJS之net模块学习笔记',
    'NodeJS之os模块学习笔记',
    'NodeJS之path模块学习笔记',
    'NodeJS之process模块学习笔记',
    'NodeJS之querystring模块学习笔记',
    'NodeJS之stream模块学习笔记',
    'NodeJS之timer模块学习笔记',
    'NodeJS之url模块学习笔记',
    'NodeJS之util实用工具模块学习笔记',
    'NodeJS之web-socket和Socket框架',
    'NodeJS之zlib压缩模块学习笔记',
    'NodeJS之操作MongoDB数据库',
    'NodeJS之设置Cookie和Session',
    'NodeJS简介'
];

module.exports = {
    node: [utils.genSiderbar('node学习笔记', node)],
};
