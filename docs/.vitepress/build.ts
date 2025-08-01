import { visualizer } from "rollup-plugin-visualizer";
import type { BuildOptions } from "vite";

export function Build(): BuildOptions {
  return {
    chunkSizeWarningLimit: 4096,
    assetsInlineLimit: 4096,
    minify: "terser", // 这里加类型断言或者直接写字面量
    rollupOptions: {
      plugins: [
        visualizer({
          filename: "../stats.html",
          open: false,
          gzipSize: true,
          brotliSize: true,
        }),
      ],
      output: {
        manualChunks: {
          theme: ["vitepress-theme-teek"],
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.info"],
        dead_code: true,
        arrows: true,
        unused: true,
        join_vars: true,
        collapse_vars: true,
      },
      format: {
        comments: false,
        beautify: false,
        preamble: "/* 项目版本 1.0.0 */",
      },
      mangle: {
        toplevel: true,
        properties: false,
      },
    },
  };
}
