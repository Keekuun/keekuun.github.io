import {
  createContext, createProgram, resizeCanvasToDisplaySize,
  createBuffer, setAttribute, initDepth,
  clearDemoFrame,
} from '../../shared/gl-utils.js'
import * as m4 from '../../shared/m4.js';

const GRID = 16;
const vs = `
attribute vec3 a_position;
attribute float a_heat;
uniform mat4 u_matrix;
varying float v_heat;
void main() {
  gl_Position = u_matrix * vec4(a_position, 1.0);
  v_heat = a_heat;
}
`;
const fs = `
precision mediump float;
varying float v_heat;

vec3 heatColor(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 a = vec3(0.1, 0.2, 0.8);
  vec3 b = vec3(0.2, 0.9, 0.4);
  vec3 c = vec3(1.0, 0.9, 0.1);
  vec3 d = vec3(1.0, 0.15, 0.05);
  if (t < 0.33) return mix(a, b, t / 0.33);
  if (t < 0.66) return mix(b, c, (t - 0.33) / 0.33);
  return mix(c, d, (t - 0.66) / 0.34);
}

void main() {
  gl_FragColor = vec4(heatColor(v_heat), 1.0);
}
`;

const positions = [];
const heats = [];
const heatData = new Float32Array(GRID * GRID);
for (let z = 0; z < GRID; z++) {
  for (let x = 0; x < GRID; x++) {
    const px = (x / (GRID - 1) - 0.5) * 8;
    const pz = (z / (GRID - 1) - 0.5) * 8;
    const h = Math.random();
    heatData[z * GRID + x] = h;
    positions.push(px, 0, pz, px + 0.45, 0, pz, px + 0.45, 0, pz + 0.45);
    positions.push(px, 0, pz, px + 0.45, 0, pz + 0.45, px, 0, pz + 0.45);
    for (let i = 0; i < 6; i++) heats.push(h);
  }
}

const canvas = document.querySelector('#canvas');
const { gl } = createContext(canvas);
initDepth(gl);
const program = createProgram(gl, vs, fs);
const posBuf = createBuffer(gl, new Float32Array(positions), gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
const heatBuf = createBuffer(gl, new Float32Array(heats), gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
const matrixLoc = gl.getUniformLocation(program, 'u_matrix');

function tickHeat() {
  for (let i = 0; i < heatData.length; i++) {
    heatData[i] += (Math.random() - 0.5) * 0.08;
    heatData[i] = Math.max(0, Math.min(1, heatData[i]));
  }
  for (let i = 0; i < heats.length; i++) heats[i] = heatData[Math.floor(i / 6)];
  gl.bindBuffer(gl.ARRAY_BUFFER, heatBuf);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, heats);
}

function render(t) {
  t *= 0.001;
  if (Math.floor(t * 2) !== Math.floor((t - 0.016) * 2)) tickHeat();
  resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);
  clearDemoFrame(gl);
  gl.useProgram(program);
  setAttribute(gl, program, 'a_position', posBuf, 3);
  setAttribute(gl, program, 'a_heat', heatBuf, 1);
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const m = m4.multiply(
    m4.multiply(m4.perspective((45 * Math.PI) / 180, aspect, 0.1, 100), m4.lookAt([6, 8, 6], [0, 0, 0], [0, 1, 0])),
    m4.yRotation(t * 0.1)
  );
  gl.uniformMatrix4fv(matrixLoc, false, m);
  gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
