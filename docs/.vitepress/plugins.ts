import { groupIconVitePlugin } from "vitepress-plugin-group-icons";
import viteImagemin from "vite-plugin-imagemin";
import { RssPlugin, RSSOptions } from "vitepress-plugin-rss";
import viteCompression from "vite-plugin-compression";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";

const baseUrl = "";
const RSS: RSSOptions = {
  title: "Jeek Blog",
  baseUrl,
  copyright: "Copyright@Jeek",
};

export function Plugins() {
  return [
    groupIconVitePlugin(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      mozjpeg: { quality: 70 },
      pngquant: { quality: [0.7, 0.8] },
      svgo: {
        plugins: [
          { name: "removeViewBox" },
          { name: "removeEmptyAttrs", active: false },
        ],
      },
    }),
    RssPlugin(RSS), //开启RSS功能
    viteCompression({
      // 配置项
      verbose: true, // 是否在控制台输出压缩结果
      disable: false, // 是否禁用压缩
      threshold: 10240, // 文件大小超过此值时进行压缩，单位为字节
      algorithm: "gzip", // 压缩算法，可选 'gzip' 或 'brotli'
      ext: ".gz", // 压缩后的文件扩展名
    }),
    chunkSplitPlugin({
      // 拆分策略：'default'（默认拆分）、'all-in-one'（合并为一个块）、'unbundle'（不打包）
      strategy: "default",
      // 自定义拆分规则，键为输出文件名，值为匹配文件的正则表达式或字符串数组
      customSplitting: {
        vendor: [/node_modules/],
        app: [/src\/main/],
      },
    }),
  ];
}
