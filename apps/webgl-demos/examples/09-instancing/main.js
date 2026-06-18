import {
  createContext, createProgram, resizeCanvasToDisplaySize,
  createBuffer, setAttribute, initDepth, createSolidCubeExpanded,
  clearDemoFrame,
} from '../../shared/gl-utils.js';
import * as m4 from '../../shared/m4.js';

const GRID = 20;
const COUNT = GRID * GRID;
const SPACING = 0.42;
const CUBE_SCALE = 0.18;
const UBO_SIZE = 128;

const vs = `#version 300 es
layout(std140) uniform SceneBlock {
  mat4 u_projection;
  mat4 u_view;
};
layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_instanceOffset;
out vec3 v_color;
void main() {
  vec3 worldPos = a_position * ${CUBE_SCALE} + a_instanceOffset;
  gl_Position = u_projection * u_view * vec4(worldPos, 1.0);
  v_color = abs(a_position) * 0.5 + 0.35;
}
`;
const fs = `#version 300 es
precision mediump float;
in vec3 v_color;
out vec4 outColor;
void main() { outColor = vec4(v_color, 1.0); }
`;

const geo = createSolidCubeExpanded();
const canvas = document.querySelector('#canvas');
const { gl, isWebGL2 } = createContext(canvas, true);
if (!isWebGL2) {
  document.body.innerHTML = '<p style="color:#f88;padding:2rem">需要 WebGL2</p>';
  throw new Error('WebGL2 required');
}
initDepth(gl);
gl.depthFunc(gl.LEQUAL);

const program = createProgram(gl, vs, fs);
const posBuf = createBuffer(gl, geo.positions);

const blockIndex = gl.getUniformBlockIndex(program, 'SceneBlock');
gl.uniformBlockBinding(program, blockIndex, 0);
const ubo = gl.createBuffer();
gl.bindBuffer(gl.UNIFORM_BUFFER, ubo);
gl.bufferData(gl.UNIFORM_BUFFER, UBO_SIZE, gl.DYNAMIC_DRAW);
gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, ubo);
const uboData = new Float32Array(UBO_SIZE / 4);

const instanceData = new Float32Array(COUNT * 3);
for (let i = 0; i < COUNT; i++) {
  const ix = i % GRID;
  const iz = Math.floor(i / GRID);
  instanceData[i * 3] = (ix - GRID * 0.5) * SPACING;
  instanceData[i * 3 + 1] = Math.sin(i * 0.37) * 1.4;
  instanceData[i * 3 + 2] = (iz - GRID * 0.5) * SPACING;
}
const instBuf = createBuffer(gl, instanceData);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);
gl.useProgram(program);
setAttribute(gl, program, 'a_position', posBuf, 3);
gl.vertexAttribDivisor(0, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, instBuf);
gl.enableVertexAttribArray(1);
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
gl.vertexAttribDivisor(1, 1);
gl.bindVertexArray(null);

function uploadViewProjection(projection, view) {
  uboData.set(projection, 0);
  uboData.set(view, 16);
  gl.bindBuffer(gl.UNIFORM_BUFFER, ubo);
  gl.bufferSubData(gl.UNIFORM_BUFFER, 0, uboData);
}

function render(t) {
  t *= 0.001;
  resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);
  clearDemoFrame(gl);
  gl.useProgram(program);
  gl.bindVertexArray(vao);

  const aspect = canvas.clientWidth / canvas.clientHeight || 1;
  const projection = m4.perspective((50 * Math.PI) / 180, aspect, 0.1, 100);
  const view = m4.lookAt(
    [Math.cos(t * 0.3) * 8, 4, Math.sin(t * 0.3) * 8],
    [0, 0, 0],
    [0, 1, 0],
  );
  uploadViewProjection(projection, view);
  gl.drawArraysInstanced(gl.TRIANGLES, 0, geo.vertexCount, COUNT);
  gl.bindVertexArray(null);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
