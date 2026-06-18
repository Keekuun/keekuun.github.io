import {
  createContext, createProgram, resizeCanvasToDisplaySize,
  createBuffer, setAttribute, initDepth, createCubeGeometry,
  clearDemoFrame,
} from '../../shared/gl-utils.js'
import * as m4 from '../../shared/m4.js';

const vs = `
attribute vec3 a_position;
uniform mat4 u_matrix;
void main() { gl_Position = u_matrix * vec4(a_position, 1.0); }
`;
const fs = `
precision mediump float;
uniform vec4 u_color;
void main() { gl_FragColor = u_color; }
`;

const geo = createCubeGeometry();
const canvas = document.querySelector('#canvas');
const status = document.getElementById('status');
const { gl } = createContext(canvas);
initDepth(gl);
const program = createProgram(gl, vs, fs);
const posBuf = createBuffer(gl, geo.positions);
const idxBuf = createBuffer(gl, geo.indices, gl.ELEMENT_ARRAY_BUFFER);
const matrixLoc = gl.getUniformLocation(program, 'u_matrix');
const colorLoc = gl.getUniformLocation(program, 'u_color');

const cubes = [
  { pos: [-1.5, 0, 0], color: [0.9, 0.3, 0.2, 1], selected: false },
  { pos: [0, 0, -0.5], color: [0.2, 0.65, 1, 1], selected: false },
  { pos: [1.4, 0, 0.3], color: [0.3, 0.9, 0.4, 1], selected: false },
];

const cam = { theta: 0.5, phi: 1.0, radius: 5 };
function getEye() {
  return [
    cam.radius * Math.sin(cam.phi) * Math.sin(cam.theta),
    cam.radius * Math.cos(cam.phi),
    cam.radius * Math.sin(cam.phi) * Math.cos(cam.theta),
  ];
}

function screenToRay(x, y) {
  const rect = canvas.getBoundingClientRect();
  const ndcX = ((x - rect.left) / rect.width) * 2 - 1;
  const ndcY = -(((y - rect.top) / rect.height) * 2 - 1);
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const proj = m4.perspective((50 * Math.PI) / 180, aspect, 0.1, 100);
  const view = m4.lookAt(getEye(), [0, 0, 0], [0, 1, 0]);
  const invPV = m4.inverse(m4.multiply(proj, view));
  const near = m4.transformPoint(invPV, [ndcX, ndcY, -1]);
  const far = m4.transformPoint(invPV, [ndcX, ndcY, 1]);
  const dir = [
    far[0] - near[0], far[1] - near[1], far[2] - near[2],
  ];
  const len = Math.hypot(dir[0], dir[1], dir[2]);
  return { origin: getEye(), dir: [dir[0] / len, dir[1] / len, dir[2] / len] };
}

function hitAABB(origin, dir, center, half = 1) {
  let tmin = -Infinity, tmax = Infinity;
  for (let i = 0; i < 3; i++) {
    const inv = 1 / (dir[i] || 1e-8);
    let t0 = (center[i] - half - origin[i]) * inv;
    let t1 = (center[i] + half - origin[i]) * inv;
    if (t0 > t1) [t0, t1] = [t1, t0];
    tmin = Math.max(tmin, t0);
    tmax = Math.min(tmax, t1);
  }
  return tmax >= Math.max(tmin, 0) ? tmin : null;
}

canvas.addEventListener('click', (e) => {
  const ray = screenToRay(e.clientX, e.clientY);
  let best = null, bestT = Infinity;
  cubes.forEach((c, i) => {
    const t = hitAABB(ray.origin, ray.dir, c.pos);
    if (t !== null && t < bestT) { bestT = t; best = i; }
  });
  cubes.forEach((c, i) => { c.selected = i === best; });
  status.textContent = best !== null ? `选中立方体 #${best + 1}` : '未命中';
});

function render(t) {
  t *= 0.001;
  cam.theta = t * 0.2;
  resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);
  clearDemoFrame(gl);
  gl.useProgram(program);
  setAttribute(gl, program, 'a_position', posBuf, 3);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const viewProj = m4.multiply(
    m4.perspective((50 * Math.PI) / 180, aspect, 0.1, 100),
    m4.lookAt(getEye(), [0, 0, 0], [0, 1, 0])
  );
  for (const c of cubes) {
    const col = c.selected ? [1, 1, 0.2, 1] : c.color;
    gl.uniform4fv(colorLoc, col);
    gl.uniformMatrix4fv(matrixLoc, false, m4.multiply(viewProj, m4.translation(...c.pos)));
    gl.drawElements(gl.TRIANGLES, geo.indices.length, gl.UNSIGNED_SHORT, 0);
  }
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
