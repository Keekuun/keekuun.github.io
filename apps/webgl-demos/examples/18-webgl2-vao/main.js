import {
  createContext, createProgram, resizeCanvasToDisplaySize,
  initDepth, createMeshVAO,
  clearDemoFrame,
} from '../../shared/gl-utils.js'
import * as m4 from '../../shared/m4.js';

const vs = `#version 300 es
in vec3 a_position;
in vec4 a_color;
uniform mat4 u_matrix;
out vec4 v_color;
void main() {
  gl_Position = u_matrix * vec4(a_position, 1.0);
  v_color = a_color;
}
`;
const fs = `#version 300 es
precision mediump float;
in vec4 v_color;
out vec4 outColor;
void main() { outColor = v_color; }
`;

const CUBE_POS = new Float32Array([
  -0.5,-0.5,0.5, 0.5,-0.5,0.5, 0.5,0.5,0.5, -0.5,-0.5,0.5, 0.5,0.5,0.5, -0.5,0.5,0.5,
  -0.5,-0.5,-0.5, -0.5,0.5,-0.5, 0.5,0.5,-0.5, -0.5,-0.5,-0.5, 0.5,0.5,-0.5, 0.5,-0.5,-0.5,
]);
const CUBE_IDX = new Uint16Array([0,1,2,3,4,5,6,7,8,9,10,11]);

function cubeColors(rgba) {
  const colors = new Float32Array(36 * 4);
  for (let i = 0; i < 36; i++) colors.set(rgba, i * 4);
  return colors;
}

const canvas = document.querySelector('#canvas');
const { gl, isWebGL2 } = createContext(canvas, true);
if (!isWebGL2) {
  document.body.innerHTML = '<p style="color:#f88;padding:2rem">需要 WebGL2</p>';
  throw new Error('WebGL2 required');
}
initDepth(gl);
const program = createProgram(gl, vs, fs);
const uMatrix = gl.getUniformLocation(program, 'u_matrix');

const scene = [
  { vao: createMeshVAO(gl, program, CUBE_POS, cubeColors([1, 0.35, 0.2, 1]), CUBE_IDX), matrix: m4.translation(-2, 0, 0) },
  { vao: createMeshVAO(gl, program, CUBE_POS, cubeColors([0.25, 0.75, 1, 1]), CUBE_IDX), matrix: m4.identity() },
  { vao: createMeshVAO(gl, program, CUBE_POS, cubeColors([0.3, 1, 0.45, 1]), CUBE_IDX), matrix: m4.translation(2, 0, 0) },
];

function render(t) {
  t *= 0.001;
  resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);
  clearDemoFrame(gl);
  gl.useProgram(program);
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const vp = m4.multiply(
    m4.perspective((50 * Math.PI) / 180, aspect, 0.1, 100),
    m4.lookAt([0, 2, 6], [0, 0, 0], [0, 1, 0])
  );
  for (let i = 0; i < scene.length; i++) {
    const { vao, matrix } = scene[i];
    gl.bindVertexArray(vao.vao);
    gl.uniformMatrix4fv(uMatrix, false, m4.multiply(vp, m4.multiply(matrix, m4.yRotation(t + i))));
    gl.drawElements(gl.TRIANGLES, vao.indexCount, gl.UNSIGNED_SHORT, 0);
  }
  gl.bindVertexArray(null);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
