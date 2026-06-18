import {
  createContext,
  createProgram,
  resizeCanvasToDisplaySize,
  createBuffer,
  setAttribute,
  clearDemoFrame,
} from '../../shared/gl-utils.js'

const vs = `
attribute vec2 a_position;
attribute vec4 a_color;
varying vec4 v_color;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_color = a_color;
}
`;

const fs = `
precision mediump float;
varying vec4 v_color;
void main() {
  gl_FragColor = v_color;
}
`;

const canvas = document.querySelector('#canvas');
const { gl } = createContext(canvas);
const program = createProgram(gl, vs, fs);

const positions = new Float32Array([
  0.0, 0.5,
  -0.5, -0.5,
  0.5, -0.5,
]);
const colors = new Float32Array([
  1, 0, 0.5, 1,
  0, 1, 0.8, 1,
  0.2, 0.4, 1, 1,
]);

const posBuf = createBuffer(gl, positions);
const colBuf = createBuffer(gl, colors);

function render() {
  resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);
  clearDemoFrame(gl, gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);
  setAttribute(gl, program, 'a_position', posBuf, 2);
  setAttribute(gl, program, 'a_color', colBuf, 4);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  requestAnimationFrame(render);
}

render();
