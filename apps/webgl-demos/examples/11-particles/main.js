import {
  createContext, createProgram, resizeCanvasToDisplaySize, createBuffer, setAttribute,
  clearDemoFrame,
} from '../../shared/gl-utils.js'
import * as m4 from '../../shared/m4.js';

const N = 5000;
const vs = `
attribute vec3 a_position;
attribute vec3 a_color;
uniform mat4 u_matrix;
uniform float u_pointSize;
varying vec3 v_color;
void main() {
  gl_Position = u_matrix * vec4(a_position, 1.0);
  gl_PointSize = u_pointSize * (1.0 + a_position.y * 0.05);
  v_color = a_color;
}
`;
const fs = `
precision mediump float;
varying vec3 v_color;
void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  if (dot(c, c) > 0.25) discard;
  gl_FragColor = vec4(v_color, 0.85);
}
`;

const positions = new Float32Array(N * 3);
const colors = new Float32Array(N * 3);
const velocities = [];
for (let i = 0; i < N; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 6;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
  colors[i * 3] = 0.3 + Math.random() * 0.7;
  colors[i * 3 + 1] = 0.4 + Math.random() * 0.5;
  colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
  velocities.push([
    (Math.random() - 0.5) * 0.02,
    Math.random() * 0.03 + 0.01,
    (Math.random() - 0.5) * 0.02,
  ]);
}

const canvas = document.querySelector('#canvas');
const { gl } = createContext(canvas);
const program = createProgram(gl, vs, fs);
const posBuf = createBuffer(gl, positions, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
const colBuf = createBuffer(gl, colors);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
gl.enable(gl.DEPTH_TEST);

function render(t) {
  t *= 0.001;
  for (let i = 0; i < N; i++) {
    positions[i * 3] += velocities[i][0];
    positions[i * 3 + 1] += velocities[i][1];
    positions[i * 3 + 2] += velocities[i][2];
    if (positions[i * 3 + 1] > 3) {
      positions[i * 3 + 1] = -2;
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);

  resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);
  clearDemoFrame(gl);
  gl.useProgram(program);
  setAttribute(gl, program, 'a_position', posBuf, 3);
  setAttribute(gl, program, 'a_color', colBuf, 3);
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const m = m4.multiply(
    m4.multiply(m4.perspective((60 * Math.PI) / 180, aspect, 0.1, 100), m4.lookAt([0, 1, 6], [0, 0, 0], [0, 1, 0])),
    m4.yRotation(t * 0.15)
  );
  gl.uniformMatrix4fv(gl.getUniformLocation(program, 'u_matrix'), false, m);
  gl.uniform1f(gl.getUniformLocation(program, 'u_pointSize'), 4.0);
  gl.drawArrays(gl.POINTS, 0, N);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
