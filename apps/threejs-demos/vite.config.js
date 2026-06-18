import { readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import { templateCompilerOptions } from '@tresjs/core';

const root = __dirname;
const scanDirs = ['labs', 'portfolio', 'advanced'];

/** @type {Record<string, string>} */
const input = { index: resolve(root, 'index.html') };

for (const dirName of scanDirs) {
  const base = resolve(root, dirName);
  if (!existsSync(base)) continue;
  for (const name of readdirSync(base)) {
    const html = join(base, name, 'index.html');
    if (existsSync(html)) {
      input[`${dirName}/${name}`] = html;
    }
  }
}

export default defineConfig({
  root,
  publicDir: 'public',
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  plugins: [
    vue({ include: [/\.vue$/], ...templateCompilerOptions }),
    react({ include: /\.(jsx|tsx)$/, jsxRuntime: 'automatic' }),
  ],
  build: {
    rollupOptions: { input },
  },
  server: {
    open: '/',
  },
});
