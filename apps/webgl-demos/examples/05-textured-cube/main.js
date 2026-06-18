import {
  createContext, createProgram, resizeCanvasToDisplaySize,
  createBuffer, setAttribute, initDepth, createCheckerTexture,
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
const uvs = new Float32Array([
  0,0, 2,0, 2,2, 0,0, 2,2, 0,2,
  0,0, 0,2, 2,2, 0,0, 2,2, 2,0,
  0,0, 0,2, 2,2, 0,0, 2,2, 2,0,
  0,0, 2,0, 2,2, 0,0, 2,2, 0,2,
  0,0, 0,2, 2,2, 0,0, 2,2, 2,0,
  0,0, 2,0, 2,2, 0,0, 2,2, 0,2,
]);

const vs = `
attribute vec3 a_position;
attribute vec2 a_texcoord;
uniform mat4 u_matrix;
varying vec2 v_texcoord;
void main() {
  gl_Position = u_matrix * vec4(a_position, 1.0);
  v_texcoord = a_texcoord;
}
`;
const fs = `
precision mediump float;
uniform sampler2D u_texture;
varying vec2 v_texcoord;
void main() {
  gl_FragColor = texture2D(u_texture, v_texcoord);
}
`;

const canvas = document.querySelector('#canvas');
const { gl } = createContext(canvas);
initDepth(gl);
const program = createProgram(gl, vs, fs);
const texture = createCheckerTexture(gl);
const posBuf = createBuffer(gl, positions);
const uvBuf = createBuffer(gl, uvs);
const matrixLoc = gl.getUniformLocation(program, 'u_matrix');
const texLoc = gl.getUniformLocation(program, 'u_texture');

gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

function render(t) {
  t *= 0.001;
  resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);
  clearDemoFrame(gl);
  gl.useProgram(program);
  setAttribute(gl, program, 'a_position', posBuf, 3);
  setAttribute(gl, program, 'a_texcoord', uvBuf, 2);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(texLoc, 0);
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const m = m4.multiply(
    m4.multiply(m4.perspective((55 * Math.PI) / 180, aspect, 0.1, 100), m4.lookAt([2, 1.5, 3], [0, 0, 0], [0, 1, 0])),
    m4.yRotation(t)
  );
  gl.uniformMatrix4fv(matrixLoc, false, m);
  gl.drawArrays(gl.TRIANGLES, 0, 36);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
