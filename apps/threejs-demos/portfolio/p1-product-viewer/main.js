/** P1 · docs/3d/threejs/practices/02-portfolio-projects.md */
import { ProductViewer } from './viewer.js';
import { renderPanel, bindPanel } from './ui/panel.js';

const viewport = document.getElementById('viewport');
const sidebar = document.getElementById('sidebar');
const loading = document.getElementById('loading');

const viewer = new ProductViewer(viewport, {
  onProgress: (p) => {
    loading.classList.remove('hidden');
    loading.textContent = `加载中 ${Math.round(p * 100)}%`;
  },
  onReady: () => loading.classList.add('hidden'),
  onError: (msg) => {
    loading.classList.remove('hidden');
    loading.textContent = msg;
  },
  onPick: (data) => panel.setSelection(data),
});

const panel = renderPanel(sidebar, {
  models: [
    { id: 'helmet', label: 'DamagedHelmet' },
    { id: 'duck', label: 'Duck' },
  ],
});

bindPanel(panel, {
  onModel: (id) => viewer.loadModel(id),
  onResetView: () => viewer.resetView(),
});

viewer.loadModel('helmet');

window.addEventListener('beforeunload', () => viewer.dispose());
