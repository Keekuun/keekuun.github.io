import { readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { defineConfig } from 'vite';

const examplesDir = resolve(__dirname, 'examples');
const exampleNames = readdirSync(examplesDir).filter((name) =>
  existsSync(join(examplesDir, name, 'index.html'))
);

/** @type {Record<string, string>} */
const input = { index: resolve(__dirname, 'index.html') };
for (const name of exampleNames) {
  input[name] = resolve(examplesDir, name, 'index.html');
}

export default defineConfig({
  root: __dirname,
  publicDir: 'public',
  build: {
    rollupOptions: { input },
  },
  server: {
    open: '/',
  },
});
