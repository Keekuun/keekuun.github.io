import {
  createContext, createProgram, resizeCanvasToDisplaySize,
  createBuffer, setAttribute, initDepth,
  createSolidCubeExpanded, createPlaneGeometry, createDepthFBO,
  clearDemoFrame,
} from '../../shared/gl-utils.js'
import * as m4 from '../../shared/m4.js';

const SHADOW_SIZE = 512;
const LIGHT_POS = [4, 8, 6];
const LIGHT_TARGET = [0, 0, 0];

const depthVs = `
attribute vec3 a_position;
uniform mat4 u_lightMatrix;
void main() {
  gl_Position = u_lightMatrix * vec4(a_position, 1.0);
}
`;
const depthFs = `
precision mediump float;
void main() {
  vec4 d = gl_FragCoord;
  float depth = d.z / d.w;
  depth = depth * 0.5 + 0.5;
  gl_FragColor = vec4(depth, depth, depth, 1.0);
}
`;

const litVs = `
attribute vec3 a_position;
attribute vec3 a_normal;
uniform mat4 u_matrix;
uniform mat4 u_model;
uniform mat4 u_lightMatrix;
varying vec3 v_normal;
varying vec4 v_shadowCoord;
void main() {
  vec4 world = u_model * vec4(a_position, 1.0);
  gl_Position = u_matrix * world;
  v_normal = mat3(u_model) * a_normal;
  v_shadowCoord = u_lightMatrix * world;
}
`;
const litFs = `
precision mediump float;
varying vec3 v_normal;
varying vec4 v_shadowCoord;
uniform sampler2D u_shadowMap;
uniform vec3 u_lightDir;
uniform vec3 u_color;
uniform float u_useShadow;

float shadowSample(vec4 sc) {
  vec3 proj = sc.xyz / sc.w;
  proj = proj * 0.5 + 0.5;
  if (proj.x < 0.0 || proj.x > 1.0 || proj.y < 0.0 || proj.y > 1.0) return 0.0;
  float bias = 0.002;
  float shadow = 0.0;
  vec2 texel = vec2(1.0 / 512.0);
  for (int x = -1; x <= 1; x++) {
    for (int y = -1; y <= 1; y++) {
      float closest = texture2D(u_shadowMap, proj.xy + vec2(float(x), float(y)) * texel).r;
      shadow += proj.z - bias > closest ? 1.0 : 0.0;
    }
  }
  return shadow / 9.0;
}

void main() {
  vec3 n = normalize(v_normal);
  vec3 l = normalize(u_lightDir);
  float diff = max(dot(n, l), 0.0);
  float sh = u_useShadow > 0.5 ? shadowSample(v_shadowCoord) : 0.0;
  vec3 col = u_color * (0.22 + diff * (1.0 - sh * 0.75));
  gl_FragColor = vec4(col, 1.0);
}
`;

const cube = createSolidCubeExpanded();
const plane = createPlaneGeometry(6);
const canvas = document.querySelector('#canvas');
const { gl } = createContext(canvas);
initDepth(gl);

const depthProg = createProgram(gl, depthVs, depthFs);
const litProg = createProgram(gl, litVs, litFs);

const cubePos = createBuffer(gl, cube.positions);
const cubeNrm = createBuffer(gl, cube.normals);
const planePos = createBuffer(gl, plane.positions);
const planeNrm = createBuffer(gl, plane.normals);

let shadowFBO = createDepthFBO(gl, SHADOW_SIZE, SHADOW_SIZE);
let useShadow = 1;
window.addEventListener('keydown', (e) => {
  if (e.key === 's' || e.key === 'S') useShadow = useShadow ? 0 : 1;
});

function getLightMatrix() {
  const view = m4.lookAt(LIGHT_POS, LIGHT_TARGET, [0, 1, 0]);
  const proj = m4.orthographic(-8, 8, -8, 8, 1, 20);
  return m4.multiply(proj, view);
}

function drawMesh(prog, posBuf, nrmBuf, vertexCount, model, color, lightMatrix, viewProj) {
  gl.useProgram(prog);
  const uMatrix = gl.getUniformLocation(prog, 'u_matrix');
  const uModel = gl.getUniformLocation(prog, 'u_model');
  const uLightM = gl.getUniformLocation(prog, 'u_lightMatrix');
  const uColor = gl.getUniformLocation(prog, 'u_color');
  const uLightDir = gl.getUniformLocation(prog, 'u_lightDir');
  const uShadow = gl.getUniformLocation(prog, 'u_shadowMap');
  const uUseShadow = gl.getUniformLocation(prog, 'u_useShadow');

  gl.uniformMatrix4fv(uModel, false, model);
  gl.uniformMatrix4fv(uMatrix, false, m4.multiply(viewProj, model));
  gl.uniformMatrix4fv(uLightM, false, lightMatrix);
  gl.uniform3fv(uColor, color);
  gl.uniform3fv(uLightDir, [-0.4, -0.8, -0.5]);
  gl.uniform1f(uUseShadow, useShadow);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, shadowFBO.texture);
  gl.uniform1i(uShadow, 0);

  setAttribute(gl, prog, 'a_position', posBuf, 3);
  setAttribute(gl, prog, 'a_normal', nrmBuf, 3);
  gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
}

function renderShadowPass(lightMatrix) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFBO.framebuffer);
  gl.viewport(0, 0, SHADOW_SIZE, SHADOW_SIZE);
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(depthProg);
  const uLM = gl.getUniformLocation(depthProg, 'u_lightMatrix');

  const cubeModel = m4.multiply(m4.translation(0, 1.2, 0), m4.yRotation(performance.now() * 0.001));
  gl.uniformMatrix4fv(uLM, false, m4.multiply(lightMatrix, cubeModel));
  setAttribute(gl, depthProg, 'a_position', cubePos, 3);
  gl.drawArrays(gl.TRIANGLES, 0, cube.vertexCount);

  gl.uniformMatrix4fv(uLM, false, lightMatrix);
  setAttribute(gl, depthProg, 'a_position', planePos, 3);
  gl.drawArrays(gl.TRIANGLES, 0, plane.vertexCount);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function render(t) {
  t *= 0.001;
  const resized = resizeCanvasToDisplaySize(canvas);
  if (resized) shadowFBO = createDepthFBO(gl, SHADOW_SIZE, SHADOW_SIZE);

  const lightMatrix = getLightMatrix();
  renderShadowPass(lightMatrix);

  gl.viewport(0, 0, canvas.width, canvas.height);
  clearDemoFrame(gl);

  const aspect = canvas.clientWidth / canvas.clientHeight;
  const viewProj = m4.multiply(
    m4.perspective((50 * Math.PI) / 180, aspect, 0.1, 100),
    m4.lookAt([5, 4, 7], [0, 1, 0], [0, 1, 0])
  );

  drawMesh(litProg, planePos, planeNrm, plane.vertexCount, m4.identity(), [0.55, 0.58, 0.62], lightMatrix, viewProj);
  const cubeModel = m4.multiply(m4.translation(0, 1.2, 0), m4.yRotation(t));
  drawMesh(litProg, cubePos, cubeNrm, cube.vertexCount, cubeModel, [0.85, 0.45, 0.25], lightMatrix, viewProj);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
