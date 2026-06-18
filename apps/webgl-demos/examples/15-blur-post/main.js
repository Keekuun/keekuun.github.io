import {
  createContext, createProgram, resizeCanvasToDisplaySize,
  createBuffer, setAttribute, initDepth, createCubeGeometry,
  clearDemoFrame,
} from '../../shared/gl-utils.js'
import * as m4 from '../../shared/m4.js';

const sceneVs = `
attribute vec3 a_position;
uniform mat4 u_matrix;
uniform vec3 u_color;
void main() { gl_Position = u_matrix * vec4(a_position, 1.0); }
`;
const sceneFs = `
precision mediump float;
uniform vec3 u_color;
void main() { gl_FragColor = vec4(u_color, 1.0); }
`;

const quadVs = `
attribute vec2 a_position;
attribute vec2 a_texcoord;
varying vec2 v_uv;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_uv = a_texcoord;
}
`;
const blurFs = `
precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_direction;
uniform float u_blurAmount;
varying vec2 v_uv;

void main() {
  if (u_blurAmount < 0.5) {
    gl_FragColor = texture2D(u_texture, v_uv);
    return;
  }
  vec2 off = u_direction * (1.0 / 512.0);
  vec4 sum = vec4(0.0);
  sum += texture2D(u_texture, v_uv - 4.0 * off) * 0.05;
  sum += texture2D(u_texture, v_uv - 3.0 * off) * 0.09;
  sum += texture2D(u_texture, v_uv - 2.0 * off) * 0.12;
  sum += texture2D(u_texture, v_uv - 1.0 * off) * 0.15;
  sum += texture2D(u_texture, v_uv) * 0.18;
  sum += texture2D(u_texture, v_uv + 1.0 * off) * 0.15;
  sum += texture2D(u_texture, v_uv + 2.0 * off) * 0.12;
  sum += texture2D(u_texture, v_uv + 3.0 * off) * 0.09;
  sum += texture2D(u_texture, v_uv + 4.0 * off) * 0.05;
  gl_FragColor = sum;
}
`;

function createColorFBO(gl, w, h) {
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  const rb = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rb);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { fb, tex, w, h };
}

const geo = createCubeGeometry();
const canvas = document.querySelector('#canvas');
const { gl } = createContext(canvas);
initDepth(gl);

const sceneProg = createProgram(gl, sceneVs, sceneFs);
const blurProg = createProgram(gl, quadVs, blurFs);
const posBuf = createBuffer(gl, geo.positions);
const idxBuf = createBuffer(gl, geo.indices, gl.ELEMENT_ARRAY_BUFFER);
const quadBuf = createBuffer(gl, new Float32Array([
  -1,-1,0,0, 1,-1,1,0, -1,1,0,1, -1,1,0,1, 1,-1,1,0, 1,1,1,1,
]));

let rtA = null, rtB = null;
let blurOn = 1;
window.addEventListener('keydown', (e) => {
  if (e.key === 'b' || e.key === 'B') blurOn = blurOn ? 0 : 1;
});

function ensureRT(w, h) {
  if (!rtA || rtA.w !== w || rtA.h !== h) {
    rtA = createColorFBO(gl, w, h);
    rtB = createColorFBO(gl, w, h);
  }
}

function drawQuad(prog, tex, direction, blurAmount) {
  gl.useProgram(prog);
  setAttribute(gl, prog, 'a_position', quadBuf, 2, gl.FLOAT, false, 16, 0);
  setAttribute(gl, prog, 'a_texcoord', quadBuf, 2, gl.FLOAT, false, 16, 8);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.uniform1i(gl.getUniformLocation(prog, 'u_texture'), 0);
  gl.uniform2fv(gl.getUniformLocation(prog, 'u_direction'), direction);
  gl.uniform1f(gl.getUniformLocation(prog, 'u_blurAmount'), blurAmount);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function render(t) {
  t *= 0.001;
  const resized = resizeCanvasToDisplaySize(canvas);
  const w = canvas.width, h = canvas.height;
  ensureRT(w, h);

  // Scene → rtA
  gl.bindFramebuffer(gl.FRAMEBUFFER, rtA.fb);
  gl.viewport(0, 0, w, h);
  clearDemoFrame(gl);
  gl.useProgram(sceneProg);
  setAttribute(gl, sceneProg, 'a_position', posBuf, 3);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const vp = m4.multiply(
    m4.perspective((55 * Math.PI) / 180, aspect, 0.1, 100),
    m4.lookAt([3, 2, 4], [0, 0, 0], [0, 1, 0])
  );
  const colors = [[1, 0.35, 0.2], [0.2, 0.7, 1], [0.3, 1, 0.5]];
  for (let i = 0; i < 3; i++) {
    const model = m4.multiply(m4.translation(i * 1.8 - 1.8, 0, 0), m4.yRotation(t + i));
    gl.uniformMatrix4fv(gl.getUniformLocation(sceneProg, 'u_matrix'), false, m4.multiply(vp, model));
    gl.uniform3fv(gl.getUniformLocation(sceneProg, 'u_color'), colors[i]);
    gl.drawElements(gl.TRIANGLES, geo.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, w, h);
  gl.disable(gl.DEPTH_TEST);

  if (blurOn) {
    // 横 blur: rtA → rtB
    gl.bindFramebuffer(gl.FRAMEBUFFER, rtB.fb);
    drawQuad(blurProg, rtA.tex, [1, 0], 1);
    // 竖 blur: rtB → screen
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    drawQuad(blurProg, rtB.tex, [0, 1], 1);
  } else {
    drawQuad(blurProg, rtA.tex, [1, 0], 0);
  }

  gl.enable(gl.DEPTH_TEST);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
