export function renderPanel(container, { models }) {
  container.innerHTML = `
    <h2>产品信息</h2>
    <div class="model-btns" id="models"></div>
    <div class="field"><strong id="partName">—</strong><span id="partDesc">点击模型部件</span></div>
    <div class="field"><strong>尺寸</strong><span id="partSize">—</span></div>
    <div class="field"><strong>材质</strong><span id="partMat">—</span></div>
    <button id="resetView">重置视角</button>
  `;
  const modelsEl = container.querySelector('#models');
  models.forEach((m, i) => {
    const btn = document.createElement('button');
    btn.textContent = m.label;
    btn.dataset.id = m.id;
    if (i === 0) btn.classList.add('active');
    modelsEl.appendChild(btn);
  });
  return {
    el: container,
    setSelection(data) {
      container.querySelector('#partName').textContent = data?.name ?? '—';
      container.querySelector('#partDesc').textContent = data?.desc ?? '点击模型部件';
      container.querySelector('#partSize').textContent = data?.size ?? '—';
      container.querySelector('#partMat').textContent = data?.material ?? '—';
    },
    setActiveModel(id) {
      modelsEl.querySelectorAll('button').forEach((b) => {
        b.classList.toggle('active', b.dataset.id === id);
      });
    },
  };
}

export function bindPanel(panel, { onModel, onResetView }) {
  panel.el.querySelector('#models').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    panel.setActiveModel(btn.dataset.id);
    onModel(btn.dataset.id);
  });
  panel.el.querySelector('#resetView').addEventListener('click', onResetView);
}
