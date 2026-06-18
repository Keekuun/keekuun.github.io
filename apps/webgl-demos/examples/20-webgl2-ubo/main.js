import {
  createContext, createProgram, resizeCanvasToDisplaySize,
  createBuffer, setAttribute, initDepth, createSolidCubeExpanded,
  clearDemoFrame,
} from '../../shared/gl-utils.js'
import * as m4 from '../../shared/m4.js';

// std140: mat4@0, mat4@64 → 128 bytes
const UBO_SIZE = 128;

const vs = `#version 300 es
layout(std140) uniform SceneBlock {
  mat4 u_projection;
  mat4 u_view;
};
uniform mat4 u_model;
in vec3 a_position;
out vec3 v_pos;
void main() {
  gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
  v_pos = a_position;
}
`;
const fs = `#version 300 es
precision mediump float;
in vec3 v_pos;
out vec4 outColor;
void main() {
  outColor = vec4(v_pos * 0.5 + 0.5, 1.0);
}
`;

const geo = createSolidCubeExpanded();
const canvas = document.querySelector('#canvas');
const { gl, isWebGL2 } = createContext(canvas, true);
if (!isWebGL2) {
  document.body.innerHTML = '<p style="color:#f88;padding:2rem">需要 WebGL2</p>';
  throw new Error('WebGL2 required');
}
initDepth(gl);
const program = createProgram(gl, vs, fs);
const posBuf = createBuffer(gl, geo.positions);

const blockIndex = gl.getUniformBlockIndex(program, 'SceneBlock');
gl.uniformBlockBinding(program, blockIndex, 0);

const ubo = gl.createBuffer();
gl.bindBuffer(gl.UNIFORM_BUFFER, ubo);
gl.bufferData(gl.UNIFORM_BUFFER, UBO_SIZE, gl.DYNAMIC_DRAW);
gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, ubo);

const uModel = gl.getUniformLocation(program, 'u_model');
const uboData = new Float32Array(UBO_SIZE / 4);

const instances = [
  { matrix: m4.translation(-2, 0, 0) },
  { matrix: m4.translation(0, 0, 0) },
  { matrix: m4.translation(2, 0, 0) },
];

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
  setAttribute(gl, program, 'a_position', posBuf, 3);

  const aspect = canvas.clientWidth / canvas.clientHeight;
  const projection = m4.perspective((50 * Math.PI) / 180, aspect, 0.1, 100);
  const view = m4.lookAt(
    [Math.cos(t * 0.3) * 6, 3, Math.sin(t * 0.3) * 6],
    [0, 0, 0],
    [0, 1, 0]
  );
  uploadViewProjection(projection, view);

  for (let i = 0; i < instances.length; i++) {
    const model = m4.multiply(instances[i].matrix, m4.yRotation(t + i * 0.8));
    gl.uniformMatrix4fv(uModel, false, model);
    gl.drawArrays(gl.TRIANGLES, 0, geo.vertexCount);
  }
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
