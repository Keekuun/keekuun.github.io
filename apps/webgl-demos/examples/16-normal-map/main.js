import {
  createContext, createProgram, resizeCanvasToDisplaySize,
  createBuffer, setAttribute, initDepth,
  createSubdividedPlane, createBrickTextures,
  clearDemoFrame,
} from '../../shared/gl-utils.js'
import * as m4 from '../../shared/m4.js';

const vs = `
attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec3 a_tangent;
attribute vec2 a_texcoord;
uniform mat4 u_mvp;
uniform mat3 u_normalMatrix;
varying vec3 v_normal;
varying vec3 v_tangent;
varying vec3 v_bitangent;
varying vec2 v_uv;
void main() {
  gl_Position = u_mvp * vec4(a_position, 1.0);
  v_normal = normalize(u_normalMatrix * a_normal);
  v_tangent = normalize(u_normalMatrix * a_tangent);
  v_bitangent = cross(v_normal, v_tangent);
  v_uv = a_texcoord * 3.0;
}
`;
const fs = `
precision mediump float;
varying vec3 v_normal;
varying vec3 v_tangent;
varying vec3 v_bitangent;
varying vec2 v_uv;
uniform sampler2D u_colorMap;
uniform sampler2D u_normalMap;
uniform vec3 u_lightDir;
uniform vec3 u_viewDir;
uniform float u_useNormalMap;
uniform float u_normalScale;

void main() {
  vec3 n = normalize(v_normal);
  if (u_useNormalMap > 0.5) {
    vec3 mapN = texture2D(u_normalMap, v_uv).rgb * 2.0 - 1.0;
    mapN.xy *= u_normalScale;
    mat3 tbn = mat3(normalize(v_tangent), normalize(v_bitangent), n);
    n = normalize(tbn * mapN);
  }
  vec3 l = normalize(u_lightDir);
  vec3 v = normalize(u_viewDir);
  vec3 h = normalize(l + v);
  float diff = max(dot(n, l), 0.0);
  float spec = pow(max(dot(n, h), 0.0), 32.0);
  vec3 albedo = texture2D(u_colorMap, v_uv).rgb;
  vec3 col = albedo * (0.20 + diff * 0.80) + vec3(1.0) * spec * 0.25;
  gl_FragColor = vec4(col, 1.0);
}
`;

const plane = createSubdividedPlane(48, 2.5);
const canvas = document.querySelector('#canvas');
const { gl } = createContext(canvas);
initDepth(gl);
gl.depthFunc(gl.LEQUAL);
const program = createProgram(gl, vs, fs);
const { colorMap, normalMap } = createBrickTextures(gl, 256);

const posBuf = createBuffer(gl, plane.positions);
const nrmBuf = createBuffer(gl, plane.normals);
const tanBuf = createBuffer(gl, plane.tangents);
const uvBuf = createBuffer(gl, plane.uvs);
const idxBuf = createBuffer(gl, plane.indices, gl.ELEMENT_ARRAY_BUFFER);

let useNormal = 1;
let normalScale = 1;
window.addEventListener('keydown', (e) => {
  if (e.key === 'n' || e.key === 'N') useNormal = useNormal ? 0 : 1;
  if (e.key === '+' || e.key === '=') normalScale = Math.min(3, normalScale + 0.25);
  if (e.key === '-') normalScale = Math.max(0, normalScale - 0.25);
});

const cam = [0, 3, 6];

const uMvp = gl.getUniformLocation(program, 'u_mvp');
const uNormalMatrix = gl.getUniformLocation(program, 'u_normalMatrix');
const uLightDir = gl.getUniformLocation(program, 'u_lightDir');
const uViewDir = gl.getUniformLocation(program, 'u_viewDir');
const uUseNormalMap = gl.getUniformLocation(program, 'u_useNormalMap');
const uNormalScale = gl.getUniformLocation(program, 'u_normalScale');
const uColorMap = gl.getUniformLocation(program, 'u_colorMap');
const uNormalMap = gl.getUniformLocation(program, 'u_normalMap');

function render(t) {
  t *= 0.001;
  resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);
  clearDemoFrame(gl);
  gl.useProgram(program);

  setAttribute(gl, program, 'a_position', posBuf, 3);
  setAttribute(gl, program, 'a_normal', nrmBuf, 3);
  setAttribute(gl, program, 'a_tangent', tanBuf, 3);
  setAttribute(gl, program, 'a_texcoord', uvBuf, 2);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);

  const aspect = canvas.clientWidth / canvas.clientHeight || 1;
  const view = m4.lookAt(cam, [0, 0, 0], [0, 1, 0]);
  const proj = m4.perspective((45 * Math.PI) / 180, aspect, 0.1, 50);
  const model = m4.yRotation(t * 0.15);
  const mvp = m4.multiply(m4.multiply(proj, view), model);
  gl.uniformMatrix4fv(uMvp, false, mvp);
  gl.uniformMatrix3fv(uNormalMatrix, false, new Float32Array([
    model[0], model[1], model[2],
    model[4], model[5], model[6],
    model[8], model[9], model[10],
  ]));
  gl.uniform3fv(uLightDir, [0.5, 1, 0.4]);
  gl.uniform3fv(uViewDir, [cam[0], cam[1], cam[2]]);
  gl.uniform1f(uUseNormalMap, useNormal);
  gl.uniform1f(uNormalScale, normalScale);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, colorMap);
  gl.uniform1i(uColorMap, 0);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, normalMap);
  gl.uniform1i(uNormalMap, 1);

  gl.drawElements(gl.TRIANGLES, plane.indexCount, gl.UNSIGNED_SHORT, 0);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
