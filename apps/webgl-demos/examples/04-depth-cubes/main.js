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

let depthOn = true;
window.addEventListener('keydown', (e) => {
  if (e.key === 'd' || e.key === 'D') {
    depthOn = !depthOn;
    depthOn ? gl.enable(gl.DEPTH_TEST) : gl.disable(gl.DEPTH_TEST);
  }
});

function drawCube(viewProj, model, color) {
  gl.uniform4fv(colorLoc, color);
  gl.uniformMatrix4fv(matrixLoc, false, m4.multiply(viewProj, model));
  setAttribute(gl, program, 'a_position', posBuf, 3);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
  gl.drawElements(gl.TRIANGLES, geo.indices.length, gl.UNSIGNED_SHORT, 0);
}

function render(t) {
  t *= 0.001;
  resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);
  clearDemoFrame(gl);
  gl.useProgram(program);
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const viewProj = m4.multiply(
    m4.perspective((50 * Math.PI) / 180, aspect, 0.1, 100),
    m4.lookAt([0, 1, 5], [0, 0, 0], [0, 1, 0])
  );
  drawCube(viewProj, m4.multiply(m4.translation(-1.2, 0, 0), m4.yRotation(t)), [0.9, 0.3, 0.2, 1]);
  drawCube(viewProj, m4.multiply(m4.translation(0.5, 0, -0.8), m4.yRotation(-t * 0.5)), [0.2, 0.6, 1, 1]);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
