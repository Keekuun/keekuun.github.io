import {
  createContext, createProgram, resizeCanvasToDisplaySize,
  createBuffer, setAttribute, initDepth,
  clearDemoFrame,
} from '../../shared/gl-utils.js'
import * as m4 from '../../shared/m4.js';

const positions = new Float32Array([
  -1,-1,1, 1,-1,1, 1,1,1, -1,-1,1, 1,1,1, -1,1,1,
  -1,-1,-1, -1,1,-1, 1,1,-1, -1,-1,-1, 1,1,-1, 1,-1,-1,
  -1,1,-1, -1,1,1, 1,1,1, -1,1,-1, 1,1,1, 1,1,-1,
  -1,-1,-1, 1,-1,-1, 1,-1,1, -1,-1,-1, 1,-1,1, -1,-1,1,
  1,-1,-1, 1,1,-1, 1,1,1, 1,-1,-1, 1,1,1, 1,-1,1,
  -1,-1,-1, -1,-1,1, -1,1,1, -1,-1,-1, -1,1,1, -1,1,-1,
]);
const normals = new Float32Array([
  0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1,
  0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
  0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0,
  0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
  1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0,
  -1,0,0, -1,0,0, -1,0,0, -1,0,0, -1,0,0, -1,0,0,
]);

const vs = `
attribute vec3 a_position;
attribute vec3 a_normal;
uniform mat4 u_matrix;
uniform mat4 u_world;
varying vec3 v_normal;
void main() {
  gl_Position = u_matrix * vec4(a_position, 1.0);
  v_normal = mat3(u_world) * a_normal;
}
`;
const fs = `
precision mediump float;
varying vec3 v_normal;
uniform vec3 u_lightDir;
uniform vec3 u_viewDir;
void main() {
  vec3 n = normalize(v_normal);
  vec3 l = normalize(u_lightDir);
  vec3 v = normalize(u_viewDir);
  vec3 h = normalize(l + v);
  float diff = max(dot(n, l), 0.0);
  float spec = pow(max(dot(n, h), 0.0), 48.0);
  vec3 col = vec3(0.22) + vec3(0.75, 0.35, 0.2) * diff + vec3(1.0) * spec * 0.4;
  gl_FragColor = vec4(col, 1.0);
}
`;

const canvas = document.querySelector('#canvas');
const { gl } = createContext(canvas);
initDepth(gl);
const program = createProgram(gl, vs, fs);
const posBuf = createBuffer(gl, positions);
const nrmBuf = createBuffer(gl, normals);
const uMatrix = gl.getUniformLocation(program, 'u_matrix');
const uWorld = gl.getUniformLocation(program, 'u_world');
const uLight = gl.getUniformLocation(program, 'u_lightDir');
const uView = gl.getUniformLocation(program, 'u_viewDir');
const cam = [2.5, 2, 4];

function render(t) {
  t *= 0.001;
  resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);
  clearDemoFrame(gl);
  gl.useProgram(program);
  setAttribute(gl, program, 'a_position', posBuf, 3);
  setAttribute(gl, program, 'a_normal', nrmBuf, 3);
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const view = m4.lookAt(cam, [0, 0, 0], [0, 1, 0]);
  const proj = m4.perspective((50 * Math.PI) / 180, aspect, 0.1, 100);
  const model = m4.yRotation(t);
  gl.uniformMatrix4fv(uWorld, false, model);
  gl.uniformMatrix4fv(uMatrix, false, m4.multiply(m4.multiply(proj, view), model));
  gl.uniform3fv(uLight, [0.4, 1, 0.6]);
  gl.uniform3fv(uView, cam);
  gl.drawArrays(gl.TRIANGLES, 0, 36);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
