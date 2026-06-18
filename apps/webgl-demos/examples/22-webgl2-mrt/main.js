import {
  createContext, createProgram, resizeCanvasToDisplaySize,
  createBuffer, setAttribute, initDepth, createSolidCubeExpanded,
  createMRTFBO, DEMO_CLEAR_RGBA,
  clearDemoFrame,
} from '../../shared/gl-utils.js';
import * as m4 from '../../shared/m4.js';

const geo = createSolidCubeExpanded();
const canvas = document.querySelector('#canvas');
const hint = document.querySelector('#hint');

const { gl, isWebGL2 } = createContext(canvas, true);
if (!isWebGL2) {
  document.body.innerHTML = '<p style="color:#f88;padding:2rem">需要 WebGL2（MRT / drawBuffers）</p>';
  throw new Error('WebGL2 required');
}
initDepth(gl);

const gbufVs = `#version 300 es
in vec3 a_position;
in vec3 a_normal;
uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_model;
uniform vec3 u_albedo;
out vec3 v_normal;
void main() {
  vec4 wp = u_model * vec4(a_position, 1.0);
  v_normal = mat3(u_view * u_model) * a_normal;
  gl_Position = u_projection * u_view * wp;
}
`;
const gbufFs = `#version 300 es
precision mediump float;
in vec3 v_normal;
uniform vec3 u_albedo;
layout(location = 0) out vec4 outAlbedo;
layout(location = 1) out vec4 outNormal;
void main() {
  outAlbedo = vec4(u_albedo, 1.0);
  vec3 n = normalize(v_normal);
  outNormal = vec4(n * 0.5 + 0.5, 1.0);
}
`;

const lightVs = `#version 300 es
in vec2 a_position;
in vec2 a_texcoord;
out vec2 v_uv;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_uv = a_texcoord;
}
`;
const lightFs = `#version 300 es
precision mediump float;
in vec2 v_uv;
uniform sampler2D u_albedo;
uniform sampler2D u_normal;
uniform vec3 u_lightDir;
uniform int u_mode;
out vec4 outColor;
void main() {
  if (u_mode == 1) {
    outColor = texture(u_albedo, v_uv);
    return;
  }
  if (u_mode == 2) {
    outColor = texture(u_normal, v_uv);
    return;
  }
  vec3 albedo = texture(u_albedo, v_uv).rgb;
  vec3 n = normalize(texture(u_normal, v_uv).rgb * 2.0 - 1.0);
  vec3 l = normalize(u_lightDir);
  float diff = max(dot(n, l), 0.0);
  outColor = vec4(albedo * (0.20 + 0.80 * diff), 1.0);
}
`;

const gbufProg = createProgram(gl, gbufVs, gbufFs);
const lightProg = createProgram(gl, lightVs, lightFs);

const posBuf = createBuffer(gl, geo.positions);
const nrmBuf = createBuffer(gl, geo.normals);
const quadPos = createBuffer(gl, new Float32Array([
  -1, -1, 1, -1, 1, 1,
  -1, -1, 1, 1, -1, 1,
]));
const quadUv = createBuffer(gl, new Float32Array([
  0, 0, 1, 0, 1, 1,
  0, 0, 1, 1, 0, 1,
]));

const uProj = gl.getUniformLocation(gbufProg, 'u_projection');
const uView = gl.getUniformLocation(gbufProg, 'u_view');
const uModel = gl.getUniformLocation(gbufProg, 'u_model');
const uAlbedo = gl.getUniformLocation(gbufProg, 'u_albedo');
const uLightDir = gl.getUniformLocation(lightProg, 'u_lightDir');
const uMode = gl.getUniformLocation(lightProg, 'u_mode');
const uAlbedoTex = gl.getUniformLocation(lightProg, 'u_albedo');
const uNormalTex = gl.getUniformLocation(lightProg, 'u_normal');

const cubes = [
  { matrix: m4.translation(-2.2, 0, 0), color: [0.85, 0.35, 0.25] },
  { matrix: m4.translation(0, 0, 0), color: [0.35, 0.65, 0.9] },
  { matrix: m4.translation(2.2, 0, 0), color: [0.45, 0.85, 0.4] },
];

let mrt = null;
let previewMode = 0; // 0=lit, 1=albedo, 2=normal
const modeLabels = ['延迟光照', 'G-Buffer · Albedo', 'G-Buffer · Normal'];

window.addEventListener('keydown', (e) => {
  if (e.key === 'm' || e.key === 'M') {
    previewMode = (previewMode + 1) % 3;
    hint.textContent = `预览：${modeLabels[previewMode]} · 按 M 切换`;
  }
});

function ensureMRT(w, h) {
  if (w < 1 || h < 1) return false;
  if (mrt && mrt.width === w && mrt.height === h) return true;
  mrt = createMRTFBO(gl, w, h, 2);
  return true;
}

function drawFullscreenQuad() {
  gl.useProgram(lightProg);
  setAttribute(gl, lightProg, 'a_position', quadPos, 2);
  setAttribute(gl, lightProg, 'a_texcoord', quadUv, 2);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, mrt.textures[0]);
  gl.uniform1i(uAlbedoTex, 0);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, mrt.textures[1]);
  gl.uniform1i(uNormalTex, 1);
  gl.uniform3f(uLightDir, 0.4, 1.0, 0.5);
  gl.uniform1i(uMode, previewMode);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function render(t) {
  t *= 0.001;
  const resized = resizeCanvasToDisplaySize(canvas);
  const w = canvas.width;
  const h = canvas.height;
  if (!ensureMRT(w, h)) {
    requestAnimationFrame(render);
    return;
  }

  const aspect = canvas.clientWidth / canvas.clientHeight;
  const projection = m4.perspective((50 * Math.PI) / 180, aspect, 0.1, 100);
  const view = m4.lookAt(
    [Math.cos(t * 0.35) * 6, 3.2, Math.sin(t * 0.35) * 6],
    [0, 0, 0],
    [0, 1, 0],
  );

  gl.bindFramebuffer(gl.FRAMEBUFFER, mrt.fb);
  gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
  gl.viewport(0, 0, w, h);
  gl.clearColor(...DEMO_CLEAR_RGBA);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(gbufProg);
  setAttribute(gl, gbufProg, 'a_position', posBuf, 3);
  setAttribute(gl, gbufProg, 'a_normal', nrmBuf, 3);
  gl.uniformMatrix4fv(uProj, false, projection);
  gl.uniformMatrix4fv(uView, false, view);

  for (let i = 0; i < cubes.length; i++) {
    const model = m4.multiply(cubes[i].matrix, m4.yRotation(t + i * 1.1));
    gl.uniformMatrix4fv(uModel, false, model);
    gl.uniform3fv(uAlbedo, cubes[i].color);
    gl.drawArrays(gl.TRIANGLES, 0, geo.vertexCount);
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, w, h);
  clearDemoFrame(gl, gl.COLOR_BUFFER_BIT);
  gl.disable(gl.DEPTH_TEST);
  drawFullscreenQuad();

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
