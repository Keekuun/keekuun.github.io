/** Lab 10 · docs/3d/threejs/10-project-integration.md — 业务入口保持精简 */
import { bootstrapViewer, destroyViewer } from './viewer.js';

const root = document.getElementById('root');
const msg = document.getElementById('msg');
let viewer = null;

async function mount(loadOk = true) {
  destroyViewer(viewer);
  viewer = await bootstrapViewer(root, { loadOk, onStatus: (t) => { msg.textContent = t; } });
}

document.getElementById('reload').addEventListener('click', () => mount(true));
document.getElementById('fail').addEventListener('click', () => mount(false));

mount(true);
window.addEventListener('beforeunload', () => destroyViewer(viewer));
