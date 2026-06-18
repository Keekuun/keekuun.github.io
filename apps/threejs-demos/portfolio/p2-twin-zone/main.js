/** P2 · 分区孪生 · docs/3d/threejs/practices/02-portfolio-projects.md */
import { TwinApp } from './app.js';

const zonesEl = document.getElementById('zones');
const detailEl = document.getElementById('detail');
const viewport = document.getElementById('viewport');

zonesEl.innerHTML = '<strong>园区分区</strong>';
['A 栋', 'B 栋', 'C 栋'].forEach((name, i) => {
  const btn = document.createElement('button');
  btn.className = 'zone-btn' + (i === 0 ? ' active' : '');
  btn.textContent = name;
  btn.dataset.zone = `zone-${String.fromCharCode(97 + i)}`;
  zonesEl.appendChild(btn);
});

const app = new TwinApp(viewport, detailEl);

zonesEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.zone-btn');
  if (!btn) return;
  zonesEl.querySelectorAll('.zone-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  app.loadZone(btn.dataset.zone);
});

app.loadZone('zone-a');
window.addEventListener('beforeunload', () => app.dispose());
