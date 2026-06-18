import {
  createContext, createProgram, resizeCanvasToDisplaySize,
  createBuffer, setAttribute, initDepth, createSolidCubeExpanded, createColorFBO,
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
const passFs = `
precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_direction;
uniform float u_mode;
varying vec2 v_uv;

void main() {
  vec4 c = texture2D(u_texture, v_uv);
  if (u_mode < 0.5) { gl_FragColor = c; return; }
  if (u_mode < 1.5) {
    float b = max(max(c.r, c.g), c.b);
    gl_FragColor = vec4(max(c.rgb - vec3(0.6), vec3(0.0)), c.a);
    return;
  }
  vec2 off = u_direction / 512.0;
  vec4 sum = vec4(0.0);
  sum += texture2D(u_texture, v_uv - 3.0*off) * 0.09;
  sum += texture2D(u_texture, v_uv - 2.0*off) * 0.12;
  sum += texture2D(u_texture, v_uv - 1.0*off) * 0.15;
  sum += texture2D(u_texture, v_uv) * 0.18;
  sum += texture2D(u_texture, v_uv + 1.0*off) * 0.15;
  sum += texture2D(u_texture, v_uv + 2.0*off) * 0.12;
  sum += texture2D(u_texture, v_uv + 3.0*off) * 0.09;
  gl_FragColor = sum;
}
`;
const compositeFs = `
precision mediump float;
uniform sampler2D u_scene;
uniform sampler2D u_bloom;
uniform float u_bloomOn;
varying vec2 v_uv;
void main() {
  vec3 scene = texture2D(u_scene, v_uv).rgb;
  vec3 bloom = texture2D(u_bloom, v_uv).rgb;
  gl_FragColor = vec4(scene + bloom * u_bloomOn * 1.2, 1.0);
}
`;

const geo = createSolidCubeExpanded();
const canvas = document.querySelector('#canvas');
const { gl } = createContext(canvas);
initDepth(gl);

const sceneProg = createProgram(gl, sceneVs, sceneFs);
const passProg = createProgram(gl, quadVs, passFs);
const compProg = createProgram(gl, quadVs, compositeFs);
const posBuf = createBuffer(gl, geo.positions);
const quadBuf = createBuffer(gl, new Float32Array([
  -1,-1,0,0, 1,-1,1,0, -1,1,0,1, -1,1,0,1, 1,-1,1,0, 1,1,1,1,
]));

let rt = [null, null, null, null];
let bloomOn = 1;
window.addEventListener('keydown', (e) => {
  if (e.key === 'b' || e.key === 'B') bloomOn = bloomOn ? 0 : 1;
});

function ensureRT(w, h) {
  if (!rt[0] || rt[0].width !== w) {
    rt = [0, 1, 2, 3].map(() => createColorFBO(gl, w, h));
  }
}

function drawPass(prog, srcTex, mode, direction) {
  gl.useProgram(prog);
  setAttribute(gl, prog, 'a_position', quadBuf, 2, gl.FLOAT, false, 16, 0);
  setAttribute(gl, prog, 'a_texcoord', quadBuf, 2, gl.FLOAT, false, 16, 8);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, srcTex);
  gl.uniform1i(gl.getUniformLocation(prog, 'u_texture'), 0);
  gl.uniform1f(gl.getUniformLocation(prog, 'u_mode'), mode);
  gl.uniform2fv(gl.getUniformLocation(prog, 'u_direction'), direction);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function render(t) {
  t *= 0.001;
  resizeCanvasToDisplaySize(canvas);
  const w = canvas.width, h = canvas.height;
  ensureRT(w, h);

  gl.bindFramebuffer(gl.FRAMEBUFFER, rt[0].fb);
  gl.viewport(0, 0, w, h);
  clearDemoFrame(gl);
  gl.useProgram(sceneProg);
  setAttribute(gl, sceneProg, 'a_position', posBuf, 3);
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const vp = m4.multiply(
    m4.perspective((50 * Math.PI) / 180, aspect, 0.1, 100),
    m4.lookAt([4, 3, 5], [0, 0, 0], [0, 1, 0])
  );
  const items = [
    { pos: [0, 0, 0], col: [1, 0.2, 0.1], rot: t },
    { pos: [-2, 0.5, 0], col: [0.2, 0.9, 1], rot: t * 0.7 },
    { pos: [2, -0.3, -1], col: [1, 0.85, 0.2], rot: -t * 0.5 },
  ];
  for (const it of items) {
    const model = m4.multiply(m4.translation(...it.pos), m4.yRotation(it.rot));
    gl.uniformMatrix4fv(gl.getUniformLocation(sceneProg, 'u_matrix'), false, m4.multiply(vp, model));
    gl.uniform3fv(gl.getUniformLocation(sceneProg, 'u_color'), it.col);
    gl.drawArrays(gl.TRIANGLES, 0, geo.vertexCount);
  }

  gl.disable(gl.DEPTH_TEST);
  gl.bindFramebuffer(gl.FRAMEBUFFER, rt[1].fb);
  drawPass(passProg, rt[0].tex, 1, [0, 0]);
  gl.bindFramebuffer(gl.FRAMEBUFFER, rt[2].fb);
  drawPass(passProg, rt[1].tex, 2, [1, 0]);
  gl.bindFramebuffer(gl.FRAMEBUFFER, rt[3].fb);
  drawPass(passProg, rt[2].tex, 2, [0, 1]);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.useProgram(compProg);
  setAttribute(gl, compProg, 'a_position', quadBuf, 2, gl.FLOAT, false, 16, 0);
  setAttribute(gl, compProg, 'a_texcoord', quadBuf, 2, gl.FLOAT, false, 16, 8);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, rt[0].tex);
  gl.uniform1i(gl.getUniformLocation(compProg, 'u_scene'), 0);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, rt[3].tex);
  gl.uniform1i(gl.getUniformLocation(compProg, 'u_bloom'), 1);
  gl.uniform1f(gl.getUniformLocation(compProg, 'u_bloomOn'), bloomOn);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.enable(gl.DEPTH_TEST);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
