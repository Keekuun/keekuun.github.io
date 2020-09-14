const fs = require('fs');
const path = require('path');

const utils = {
    genSiderbar: function (title, children = [''], collapse = true, sidebarDepth = 3) {
        return {
            title,
            collapse,
            sidebarDepth,
            children
        }
    },
    getBlogDir: async function (dir) {
        // 获取子文件目录
        const childDirs = await fs.promises.readdir(dir, { encoding: 'utf-8' });
        // 获取子目录下的文件 [{node: [blog1, blog2], java: [blog1, blog2]}]
       return await Promise.all(childDirs.map(async childDir => {
           // 获取blog文件名
            let blog = await fs.promises.readdir(path.join(dir, childDir), { encoding: 'utf-8' });
            // 过滤掉readme并去掉文件后缀.md
            blog = blog.filter(name => !/readme/i.test(name)).map(name => name.slice(0, -3));
            return {
                [childDir]: utils.genSiderbar(`${childDir}学习笔记`, blog),
            }
        }));
    }
};

module.exports = utils;
