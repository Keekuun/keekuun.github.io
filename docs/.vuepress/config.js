const pluginConfig = require('./config/pluginConfig.js');
const headConfig = require('./config/headConfig.js');
const themeConfig = require('./config/themeConfig');

const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
module.exports = {
    title: '前端Jeek',
    // gitee pages必须加上仓库名称
    // base: '/blog/',
    description: '每一个不曾起舞的日子，都是对生命的辜负！',
    locales: {
        '/': {
            lang: 'zh-CN',// 设置语言
        }
    },
    // author
    author: '前端Jeek',
    theme: 'vuepress-theme-reco',
    head: headConfig,
    themeConfig: themeConfig,
    markdown: {
        // 为每行代码增加行号
        lineNumbers: true,
        anchor: {
            permalink: true, permalinkBefore: true, permalinkSymbol: '🌙'
        },
    },
    // 插件
    plugins: pluginConfig,

    chainWebpack: (config) => {
        // 图片处理规则
        config.module
            .rule('images')
            .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
            .use('url-loader')
            .loader('url-loader')
            .options({
                limit: 4096,
                name: 'assets/img/[name].[hash:8].[ext]',
                esModule: false // 解决Vue模板中的图片引用问题
            });

        // 生产环境WebP优化
        if (process.env.NODE_ENV === 'production') {
            config.plugin('imagemin-webp')
                .use(ImageminWebpWebpackPlugin, [{
                    config: [{
                        test: /\.(jpe?g|png)$/,
                        options: {
                            quality: 75
                        }
                    }],
                    overrideExtension: true,
                    detailedLogs: true
                }]);
        }
    },

    // 确保静态资源正确引用
    configureWebpack: {
        output: {
            publicPath: '/'
        }
    }
};
