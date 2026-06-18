/** P4 · 3D 配置器 */
import { Configurator } from './configurator.js';

const viewport = document.getElementById('viewport');
const panel = document.getElementById('panel');

const colors = [
  { id: 'blue', hex: 0x58a6ff, label: '科技蓝' },
  { id: 'green', hex: 0x3fb950, label: '森林绿' },
  { id: 'orange', hex: 0xffa657, label: '活力橙' },
  { id: 'pink', hex: 0xf778ba, label: '樱花粉' },
];

panel.innerHTML = `
  <h2>车身颜色</h2>
  <div id="swatches"></div>
  <h2 style="margin-top:16px">轮毂</h2>
  <label><input type="radio" name="wheel" value="standard" checked /> 标准</label><br/>
  <label><input type="radio" name="wheel" value="sport" /> 运动（大号）</label>
  <button id="shot" style="margin-top:16px">导出截图</button>
  <pre id="json"></pre>
`;

const swatches = panel.querySelector('#swatches');
colors.forEach((c, i) => {
  const s = document.createElement('span');
  s.className = 'swatch' + (i === 0 ? ' active' : '');
  s.style.background = `#${c.hex.toString(16).padStart(6, '0')}`;
  s.title = c.label;
  s.dataset.id = c.id;
  swatches.appendChild(s);
});

const cfg = new Configurator(viewport);

function getConfig() {
  const colorId = swatches.querySelector('.active')?.dataset.id ?? 'blue';
  const wheel = panel.querySelector('input[name=wheel]:checked').value;
  return { colorId, wheel };
}

function sync() {
  const c = getConfig();
  const color = colors.find((x) => x.id === c.colorId);
  cfg.setColor(color.hex);
  cfg.setWheel(c.wheel);
  panel.querySelector('#json').textContent = JSON.stringify(c, null, 2);
}

swatches.addEventListener('click', (e) => {
  const s = e.target.closest('.swatch');
  if (!s) return;
  swatches.querySelectorAll('.swatch').forEach((x) => x.classList.remove('active'));
  s.classList.add('active');
  sync();
});
panel.querySelectorAll('input[name=wheel]').forEach((r) => r.addEventListener('change', sync));

panel.querySelector('#shot').addEventListener('click', () => {
  const a = document.createElement('a');
  a.download = 'config.png';
  a.href = cfg.screenshot();
  a.click();
});

sync();
window.addEventListener('beforeunload', () => cfg.dispose());
