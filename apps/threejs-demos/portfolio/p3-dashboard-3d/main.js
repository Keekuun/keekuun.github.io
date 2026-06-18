/** P3 · 大屏 3D + ECharts 联动 */
import * as echarts from 'echarts';
import { createStore } from './store.js';
import { TwinBlock } from './twin-block.js';

const store = createStore();
const viewport = document.getElementById('viewport');
const lineEl = document.getElementById('chartLine');
const barEl = document.getElementById('chartBar');

const twin = new TwinBlock(viewport, store);
const lineChart = echarts.init(lineEl);
const barChart = echarts.init(barEl);

const dark = { axisLine: { lineStyle: { color: '#30363d' } }, splitLine: { lineStyle: { color: '#21262d' } } };

function renderCharts() {
  const { devices, selectedId, history } = store.getState();
  lineChart.setOption({
    backgroundColor: 'transparent',
    grid: { left: 40, right: 12, top: 24, bottom: 24 },
    xAxis: { type: 'category', data: history.labels, ...dark },
    yAxis: { type: 'value', ...dark },
    series: [{
      type: 'line',
      data: history.values,
      areaStyle: { opacity: 0.12 },
      markLine: selectedId ? { data: [{ xAxis: history.labels.at(-1) }] } : undefined,
    }],
  });
  barChart.setOption({
    backgroundColor: 'transparent',
    grid: { left: 40, right: 12, top: 24, bottom: 24 },
    xAxis: { type: 'category', data: devices.map((d) => d.name), ...dark },
    yAxis: { type: 'value', ...dark },
    series: [{
      type: 'bar',
      data: devices.map((d) => ({
        value: d.value,
        itemStyle: { color: d.id === selectedId ? '#58a6ff' : d.status === 'alarm' ? '#f85149' : '#3fb950' },
      })),
    }],
  });
}

store.subscribe(renderCharts);
renderCharts();

barChart.on('click', (params) => {
  const dev = store.getState().devices[params.dataIndex];
  if (dev) store.select(dev.id);
});

store.subscribe(({ selectedId }) => twin.setSelected(selectedId));

setInterval(() => store.tick(), 2000);

const clock = document.getElementById('clock');
setInterval(() => {
  clock.textContent = new Date().toLocaleString('zh-CN');
}, 1000);

const ro = new ResizeObserver(() => {
  lineChart.resize();
  barChart.resize();
});
ro.observe(lineEl.parentElement);

window.addEventListener('beforeunload', () => {
  twin.dispose();
  lineChart.dispose();
  barChart.dispose();
});
