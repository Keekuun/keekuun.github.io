import {
  createContext, createProgram, resizeCanvasToDisplaySize,
  createBuffer, setAttribute, initDepth, createCubeGeometry,
  clearDemoFrame,
} from '../../shared/gl-utils.js'
import * as m4 from '../../shared/m4.js';

const FACE_COLORS = [
  [0.95, 0.25, 0.2, 1],
  [0.2, 0.85, 0.35, 1],
  [0.35, 0.55, 1.0, 1],
  [1.0, 0.75, 0.15, 1],
  [0.85, 0.35, 1.0, 1],
  [0.2, 0.9, 0.95, 1],
];

/** 8 角点坐标 → 颜色（与 Demo 02 corner 模式一致） */
const CORNER_COLORS_BY_POS = {
  '-1,-1,1': [0.5, 0.3, 1, 1],
  '1,-1,1': [1, 1, 0.2, 1],
  '1,1,1': [1, 0.2, 0.2, 1],
  '-1,1,1': [0.2, 1, 0.5, 1],
  '-1,-1,-1': [1, 0.3, 0.8, 1],
  '-1,1,-1': [0.2, 0.8, 1, 1],
  '1,1,-1': [1, 0.6, 0.1, 1],
  '1,-1,-1': [0.6, 1, 0.2, 1],
};

function colorForPosition(x, y, z) {
  return CORNER_COLORS_BY_POS[`${x},${y},${z}`] ?? [1, 1, 1, 1];
}

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
  return [r + m, g + m, b + m, 1];
}

const TRIANGLE_COLORS = Array.from({ length: 12 }, (_, i) => hslToRgb(i / 12, 0.9, 0.55));

const HINTS = {
  face: '6 次 drawElements · 每面 uniform 一色（索引共用 8 顶点）',
  corner: '8 色 attribute · 同一角点只存一份 → 三面共享一色',
  triangle: '12 次 draw · 每个三角一色 · 对比 Demo 02 的 36 顶点',
};

const vsUniform = `
attribute vec3 a_position;
uniform mat4 u_matrix;
uniform vec4 u_color;
varying vec4 v_color;
void main() {
  gl_Position = u_matrix * vec4(a_position, 1.0);
  v_color = u_color;
}
`;

const vsAttrib = `
attribute vec3 a_position;
attribute vec4 a_color;
uniform mat4 u_matrix;
varying vec4 v_color;
void main() {
  gl_Position = u_matrix * vec4(a_position, 1.0);
  v_color = a_color;
}
`;

const fs = `
precision mediump float;
varying vec4 v_color;
void main() { gl_FragColor = v_color; }
`;

const { positions, indices } = createCubeGeometry();
const canvas = document.querySelector('#canvas');
const hintEl = document.querySelector('#hint');
const { gl } = createContext(canvas);
initDepth(gl);

const programUniform = createProgram(gl, vsUniform, fs);
const programAttrib = createProgram(gl, vsAttrib, fs);

const posBuf = createBuffer(gl, positions);
const idxBuf = createBuffer(gl, indices, gl.ELEMENT_ARRAY_BUFFER);

const cornerColorData = new Float32Array(8 * 4);
for (let i = 0; i < 8; i++) {
  cornerColorData.set(
    colorForPosition(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]),
    i * 4,
  );
}
const colBuf = createBuffer(gl, cornerColorData);

const matrixLocU = gl.getUniformLocation(programUniform, 'u_matrix');
const colorLoc = gl.getUniformLocation(programUniform, 'u_color');
const matrixLocA = gl.getUniformLocation(programAttrib, 'u_matrix');

let colorMode = 'face';
const MODES = ['face', 'corner', 'triangle'];

function setColorMode(mode) {
  colorMode = mode;
  hintEl.textContent = HINTS[mode];
  document.querySelectorAll('input[name="mode"]').forEach((el) => {
    el.checked = el.value === mode;
  });
}

document.querySelectorAll('input[name="mode"]').forEach((el) => {
  el.addEventListener('change', () => { if (el.checked) setColorMode(el.value); });
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'c' || e.key === 'C') {
    setColorMode(MODES[(MODES.indexOf(colorMode) + 1) % MODES.length]);
  }
});

function getMatrix(t) {
  const aspect = canvas.clientWidth / canvas.clientHeight;
  return m4.multiply(
    m4.multiply(m4.perspective((60 * Math.PI) / 180, aspect, 0.1, 100), m4.lookAt([2, 2, 3], [0, 0, 0], [0, 1, 0])),
    m4.yRotation(t),
  );
}

function drawIndexed(mode, matrix) {
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);

  if (mode === 'face') {
    gl.useProgram(programUniform);
    setAttribute(gl, programUniform, 'a_position', posBuf, 3);
    gl.uniformMatrix4fv(matrixLocU, false, matrix);
    for (let f = 0; f < 6; f++) {
      gl.uniform4fv(colorLoc, FACE_COLORS[f]);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, f * 6 * 2);
    }
    return;
  }

  if (mode === 'triangle') {
    gl.useProgram(programUniform);
    setAttribute(gl, programUniform, 'a_position', posBuf, 3);
    gl.uniformMatrix4fv(matrixLocU, false, matrix);
    for (let i = 0; i < 12; i++) {
      gl.uniform4fv(colorLoc, TRIANGLE_COLORS[i]);
      gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, i * 3 * 2);
    }
    return;
  }

  // corner：8 顶点 attribute，一次 draw
  gl.useProgram(programAttrib);
  setAttribute(gl, programAttrib, 'a_position', posBuf, 3);
  setAttribute(gl, programAttrib, 'a_color', colBuf, 4);
  gl.uniformMatrix4fv(matrixLocA, false, matrix);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

function render(t) {
  t *= 0.001;
  resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);
  clearDemoFrame(gl);
  drawIndexed(colorMode, getMatrix(t));
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
