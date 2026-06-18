import {
  createContext, createProgram, resizeCanvasToDisplaySize,
  createBuffer, setAttribute, initDepth,
  clearDemoFrame,
} from '../../shared/gl-utils.js'
import * as m4 from '../../shared/m4.js';

const VERTEX_COUNT = 36;

/** 6 个面 · 高对比色 */
const FACE_COLORS = [
  [0.95, 0.25, 0.2, 1],   // 前 红
  [0.2, 0.85, 0.35, 1],   // 后 绿
  [0.35, 0.55, 1.0, 1],   // 上 蓝
  [1.0, 0.75, 0.15, 1],   // 下 黄
  [0.85, 0.35, 1.0, 1],   // 右 紫
  [0.2, 0.9, 0.95, 1],    // 左 青
];

/** 8 个几何角点 · 同一坐标无论写几次都用同色 */
const CORNER_COLORS = {
  '1,1,1': [1, 0.2, 0.2, 1],
  '1,1,-1': [1, 0.6, 0.1, 1],
  '1,-1,1': [1, 1, 0.2, 1],
  '1,-1,-1': [0.6, 1, 0.2, 1],
  '-1,1,1': [0.2, 1, 0.5, 1],
  '-1,1,-1': [0.2, 0.8, 1, 1],
  '-1,-1,1': [0.5, 0.3, 1, 1],
  '-1,-1,-1': [1, 0.3, 0.8, 1],
};

const faces = [
  [0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1],
  [0, 0, -1, 0, 1, -1, 1, 1, -1, 0, 0, -1, 1, 1, -1, 1, 0, -1],
  [-1, 1, -1, -1, 1, 1, 1, 1, 1, -1, 1, -1, 1, 1, 1, 1, 1, -1],
  [-1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, -1, 1, -1, 1, -1, -1, 1],
  [1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, -1, 1, 1, 1, 1, -1, 1],
  [-1, -1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, -1, 1, 1, -1, 1, -1],
];

const positions = [];
for (const face of faces) positions.push(...face);

function hslToRgb(h, s, l) {
  const hue = h * 6;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((hue % 2) - 1));
  let r = 0; let g = 0; let b = 0;
  if (hue < 1) [r, g, b] = [c, x, 0];
  else if (hue < 2) [r, g, b] = [x, c, 0];
  else if (hue < 3) [r, g, b] = [0, c, x];
  else if (hue < 4) [r, g, b] = [0, x, c];
  else if (hue < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return [r + m, g + m, b + m];
}

function colorForCorner(x, y, z) {
  const key = `${x},${y},${z}`;
  return CORNER_COLORS[key] ?? [1, 1, 1, 1];
}

function buildColors(mode) {
  const out = [];
  if (mode === 'face') {
    for (let f = 0; f < 6; f++) {
      for (let i = 0; i < 6; i++) out.push(...FACE_COLORS[f]);
    }
    return out;
  }
  if (mode === 'vertex') {
    for (let i = 0; i < VERTEX_COUNT; i++) {
      out.push(...hslToRgb(i / VERTEX_COUNT, 0.9, 0.55), 1);
    }
    return out;
  }
  // corner：按 (x,y,z) 8 角点着色
  for (let i = 0; i < positions.length; i += 3) {
    out.push(...colorForCorner(positions[i], positions[i + 1], positions[i + 2]));
  }
  return out;
}

const HINTS = {
  face: '6 面色块 · 每面 2 三角 = 6 顶点',
  vertex: '36 种颜色 · 棱边处「断层」= 同坐标、不同 buffer 条目',
  corner: '8 种颜色 · 真实角点（重复写入的顶点同色）',
};

const vs = `
attribute vec4 a_position;
attribute vec4 a_color;
uniform mat4 u_matrix;
varying vec4 v_color;
void main() {
  gl_Position = u_matrix * a_position;
  v_color = a_color;
}
`;
const fs = `
precision mediump float;
varying vec4 v_color;
void main() { gl_FragColor = v_color; }
`;

const canvas = document.querySelector('#canvas');
const hintEl = document.querySelector('#hint');
const { gl } = createContext(canvas);
initDepth(gl);
const program = createProgram(gl, vs, fs);
const matrixLoc = gl.getUniformLocation(program, 'u_matrix');
const posBuf = createBuffer(gl, new Float32Array(positions));
let colBuf = createBuffer(gl, new Float32Array(buildColors('face')));

let colorMode = 'face';

function setColorMode(mode) {
  colorMode = mode;
  const data = new Float32Array(buildColors(mode));
  gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  hintEl.textContent = HINTS[mode];
  document.querySelectorAll('input[name="mode"]').forEach((el) => {
    el.checked = el.value === mode;
  });
}

document.querySelectorAll('input[name="mode"]').forEach((el) => {
  el.addEventListener('change', () => {
    if (el.checked) setColorMode(el.value);
  });
});

const MODES = ['face', 'vertex', 'corner'];
window.addEventListener('keydown', (e) => {
  if (e.key === 'c' || e.key === 'C') {
    const i = (MODES.indexOf(colorMode) + 1) % MODES.length;
    setColorMode(MODES[i]);
  }
});

function render(t) {
  t *= 0.001;
  resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);
  clearDemoFrame(gl);
  gl.useProgram(program);
  setAttribute(gl, program, 'a_position', posBuf, 3);
  setAttribute(gl, program, 'a_color', colBuf, 4);
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const proj = m4.perspective((60 * Math.PI) / 180, aspect, 0.1, 100);
  const view = m4.lookAt([0, 0, 4], [0, 0, 0], [0, 1, 0]);
  const model = m4.multiply(m4.yRotation(t), m4.xRotation(t * 0.7));
  gl.uniformMatrix4fv(matrixLoc, false, m4.multiply(m4.multiply(proj, view), model));
  gl.drawArrays(gl.TRIANGLES, 0, VERTEX_COUNT);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
