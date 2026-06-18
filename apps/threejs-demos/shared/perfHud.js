/**
 * 轻量性能 HUD：FPS、帧时、三角面、Draw Call、DPR
 * @param {HTMLElement} container
 * @param {{ renderer: import('three').WebGLRenderer }} ctx
 */
export function attachPerfHud(container, { renderer }) {
  const wrap = document.createElement('div');
  wrap.className = 'perf-hud';
  wrap.innerHTML = `
    <button type="button" class="perf-hud-toggle" aria-expanded="false">Perf</button>
    <div class="perf-hud-body" hidden>
      <div class="perf-row"><span>FPS</span><strong data-fps>—</strong></div>
      <div class="perf-row"><span>帧时</span><strong data-ms>—</strong><span class="unit">ms</span></div>
      <div class="perf-row"><span>三角面</span><strong data-tris>—</strong></div>
      <div class="perf-row"><span>Draw</span><strong data-calls>—</strong></div>
      <div class="perf-row"><span>DPR</span><strong data-dpr>—</strong></div>
      <div class="perf-budget" data-budget>—</div>
    </div>
  `;
  if (getComputedStyle(container).position === 'static') {
    container.style.position = 'relative';
  }
  container.appendChild(wrap);

  const body = wrap.querySelector('.perf-hud-body');
  const toggle = wrap.querySelector('.perf-hud-toggle');
  toggle.addEventListener('click', () => {
    const open = body.hidden;
    body.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.toggle('active', open);
  });

  let frames = 0;
  let accMs = 0;
  let lastSample = performance.now();
  let lastFrame = performance.now();

  const setFpsClass = (el, fps) => {
    el.classList.remove('ok', 'warn', 'bad');
    if (fps >= 50) el.classList.add('ok');
    else if (fps >= 30) el.classList.add('warn');
    else el.classList.add('bad');
  };

  const formatTri = (n) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  const update = () => {
    const now = performance.now();
    const frameMs = now - lastFrame;
    lastFrame = now;
    frames += 1;
    accMs += frameMs;

    wrap.querySelector('[data-ms]').textContent = frameMs.toFixed(1);
    wrap.querySelector('[data-dpr]').textContent = String(renderer.getPixelRatio());

    const info = renderer.info.render;
    wrap.querySelector('[data-tris]').textContent = formatTri(info.triangles);
    wrap.querySelector('[data-calls]').textContent = String(info.calls);

    if (now - lastSample >= 500) {
      const fps = Math.round((frames * 1000) / (now - lastSample));
      const avgMs = accMs / frames;
      const fpsEl = wrap.querySelector('[data-fps]');
      fpsEl.textContent = String(fps);
      setFpsClass(fpsEl, fps);

      const budget = wrap.querySelector('[data-budget]');
      if (fps >= 50) {
        budget.textContent = '预算：流畅（桌面 60fps 档）';
        budget.className = 'perf-budget ok';
      } else if (fps >= 30) {
        budget.textContent = '预算：可用（移动端 30fps 档）';
        budget.className = 'perf-budget warn';
      } else {
        budget.textContent = '预算：需优化（低于 30fps）';
        budget.className = 'perf-budget bad';
      }

      frames = 0;
      accMs = 0;
      lastSample = now;
    }
  };

  return {
    update,
    dispose: () => wrap.remove(),
  };
}
