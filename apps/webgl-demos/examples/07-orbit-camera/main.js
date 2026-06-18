import {
  createContext, createProgram, resizeCanvasToDisplaySize,
  createBuffer, setAttribute, initDepth, createCubeGeometry,
  clearDemoFrame,
} from '../../shared/gl-utils.js'
import * as m4 from '../../shared/m4.js';

const vs = `
attribute vec3 a_position;
uniform mat4 u_matrix;
uniform vec4 u_color;
void main() {
  gl_Position = u_matrix * vec4(a_position, 1.0);
}
`;
const fs = `
precision mediump float;
uniform vec4 u_color;
void main() { gl_FragColor = u_color; }
`;

const geo = createCubeGeometry();
const canvas = document.querySelector('#canvas');
const { gl } = createContext(canvas);
initDepth(gl);
const program = createProgram(gl, vs, fs);
const posBuf = createBuffer(gl, geo.positions);
const idxBuf = createBuffer(gl, geo.indices, gl.ELEMENT_ARRAY_BUFFER);
const matrixLoc = gl.getUniformLocation(program, 'u_matrix');
const colorLoc = gl.getUniformLocation(program, 'u_color');

let theta = 0.6, phi = 0.5, radius = 5;
let dragging = false, lastX = 0, lastY = 0;

canvas.addEventListener('pointerdown', (e) => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointerup', () => { dragging = false; });
canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  theta += (e.clientX - lastX) * 0.01;
  phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi + (e.clientY - lastY) * 0.01));
  lastX = e.clientX;
  lastY = e.clientY;
});
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  radius = Math.max(2, Math.min(12, radius + e.deltaY * 0.01));
}, { passive: false });

function getCameraEye() {
  return [
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.cos(theta),
  ];
}

function render(t) {
  t *= 0.001;
  resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);
  clearDemoFrame(gl);
  gl.useProgram(program);
  setAttribute(gl, program, 'a_position', posBuf, 3);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const view = m4.lookAt(getCameraEye(), [0, 0, 0], [0, 1, 0]);
  const viewProj = m4.multiply(m4.perspective((50 * Math.PI) / 180, aspect, 0.1, 100), view);
  gl.uniform4fv(colorLoc, [0.4, 0.75, 1, 1]);
  gl.uniformMatrix4fv(matrixLoc, false, m4.multiply(viewProj, m4.yRotation(t)));
  gl.drawElements(gl.TRIANGLES, geo.indices.length, gl.UNSIGNED_SHORT, 0);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
