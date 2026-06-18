/** Lab 01 · docs/3d/threejs/01-from-dashboard-to-3d.md */
import * as echarts from 'echarts';
import * as THREE from 'three';
import { createScene } from '../../shared/createScene.js';

const chartEl = document.getElementById('chart');
const threeRoot = document.getElementById('three-root');

const chart = echarts.init(chartEl);
chart.setOption({
  backgroundColor: 'transparent',
  grid: { left: 40, right: 16, top: 24, bottom: 28 },
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], axisLine: { lineStyle: { color: '#484f58' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#21262d' } } },
  series: [{ type: 'line', smooth: true, data: [12, 18, 9, 22, 16], areaStyle: { opacity: 0.15 } }],
});

const ctx = createScene(threeRoot, { onDemand: true, perfHud: true });

const grid = new THREE.GridHelper(10, 10, 0x30363d, 0x21262d);
grid.position.y = 0.001;
grid.renderOrder = -1;
grid.material.depthWrite = false;
ctx.scene.add(grid);
ctx.scene.add(new THREE.AxesHelper(2));
ctx.camera.position.set(4, 3, 6);
ctx.controls.update();
ctx.requestRender();

let resizeTimer = 0;
const ro = new ResizeObserver(() => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => chart.resize(), 100);
});
ro.observe(chartEl);

window.addEventListener('beforeunload', () => {
  clearTimeout(resizeTimer);
  ro.disconnect();
  chart.dispose();
  ctx.dispose();
});
