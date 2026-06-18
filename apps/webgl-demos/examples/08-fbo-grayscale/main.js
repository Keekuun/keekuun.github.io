import {
  createContext, createProgram, resizeCanvasToDisplaySize,
  createBuffer, setAttribute, initDepth, createCubeGeometry,
  clearDemoFrame,
} from '../../shared/gl-utils.js'
import * as m4 from '../../shared/m4.js';

const sceneVs = `
attribute vec3 a_position;
uniform mat4 u_matrix;
uniform vec4 u_color;
void main() { gl_Position = u_matrix * vec4(a_position, 1.0); }
`;
const sceneFs = `
precision mediump float;
uniform vec4 u_color;
void main() { gl_FragColor = u_color; }
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
const quadFs = `
precision mediump float;
uniform sampler2D u_texture;
uniform float u_gray;
varying vec2 v_uv;
void main() {
  vec4 c = texture2D(u_texture, v_uv);
  float g = dot(c.rgb, vec3(0.299, 0.587, 0.114));
  gl_FragColor = mix(c, vec4(g, g, g, c.a), u_gray);
}
`;

function createFBO(gl, w, h) {
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
const quadProg = createProgram(gl, quadVs, quadFs);
const posBuf = createBuffer(gl, geo.positions);
const idxBuf = createBuffer(gl, geo.indices, gl.ELEMENT_ARRAY_BUFFER);
const quadBuf = createBuffer(gl, new Float32Array([
  -1,-1,0,0, 1,-1,1,0, -1,1,0,1, -1,1,0,1, 1,-1,1,0, 1,1,1,1,
]));

let fbo = null;

function render(t) {
  t *= 0.001;
  const resized = resizeCanvasToDisplaySize(canvas);
  const w = canvas.width, h = canvas.height;
  if (!fbo || resized || fbo.w !== w || fbo.h !== h) fbo = createFBO(gl, w, h);

  // Pass 1: scene → FBO
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fb);
  gl.viewport(0, 0, w, h);
  clearDemoFrame(gl);
  gl.useProgram(sceneProg);
  setAttribute(gl, sceneProg, 'a_position', posBuf, 3);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const m = m4.multiply(
    m4.multiply(m4.perspective((50 * Math.PI) / 180, aspect, 0.1, 100), m4.lookAt([2, 1.5, 4], [0, 0, 0], [0, 1, 0])),
    m4.yRotation(t)
  );
  gl.uniformMatrix4fv(gl.getUniformLocation(sceneProg, 'u_matrix'), false, m);
  gl.uniform4fv(gl.getUniformLocation(sceneProg, 'u_color'), [1, 0.45, 0.2, 1]);
  gl.drawElements(gl.TRIANGLES, geo.indices.length, gl.UNSIGNED_SHORT, 0);

  // Pass 2: fullscreen quad → screen
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, w, h);
  clearDemoFrame(gl, gl.COLOR_BUFFER_BIT);
  gl.disable(gl.DEPTH_TEST);
  gl.useProgram(quadProg);
  setAttribute(gl, quadProg, 'a_position', quadBuf, 2, gl.FLOAT, false, 16, 0);
  setAttribute(gl, quadProg, 'a_texcoord', quadBuf, 2, gl.FLOAT, false, 16, 8);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, fbo.tex);
  gl.uniform1i(gl.getUniformLocation(quadProg, 'u_texture'), 0);
  gl.uniform1f(gl.getUniformLocation(quadProg, 'u_gray'), 0.85);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.enable(gl.DEPTH_TEST);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
