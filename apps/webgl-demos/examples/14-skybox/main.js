import {
  createContext, createProgram, resizeCanvasToDisplaySize,
  createBuffer, setAttribute, initDepth,
  createCubeGeometry, createGradientCubemap,
  clearDemoFrame,
} from '../../shared/gl-utils.js'
import * as m4 from '../../shared/m4.js';

const skyVsFixed = `
attribute vec3 a_position;
uniform mat4 u_viewRot;
varying vec3 v_dir;
void main() {
  v_dir = a_position;
  vec4 pos = u_viewRot * vec4(a_position, 1.0);
  gl_Position = pos.xyww;
}
`;
const skyFsFixed = `
precision mediump float;
uniform samplerCube u_skybox;
varying vec3 v_dir;
void main() {
  gl_FragColor = textureCube(u_skybox, normalize(v_dir));
}
`;

const meshVs = `
attribute vec3 a_position;
uniform mat4 u_matrix;
void main() {
  gl_Position = u_matrix * vec4(a_position, 1.0);
}
`;
const meshFs = `
precision mediump float;
void main() {
  gl_FragColor = vec4(0.9, 0.55, 0.3, 1.0);
}
`;

const geo = createCubeGeometry();
const canvas = document.querySelector('#canvas');
const { gl } = createContext(canvas);
initDepth(gl);
gl.depthFunc(gl.LEQUAL);

const skyProg = createProgram(gl, skyVsFixed, skyFsFixed);
const meshProg = createProgram(gl, meshVs, meshFs);
const skybox = createGradientCubemap(gl);
const posBuf = createBuffer(gl, geo.positions);
const idxBuf = createBuffer(gl, geo.indices, gl.ELEMENT_ARRAY_BUFFER);

function render(t) {
  t *= 0.001;
  resizeCanvasToDisplaySize(canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);

  const aspect = canvas.clientWidth / canvas.clientHeight;
  const view = m4.lookAt(
    [Math.cos(t * 0.2) * 5, 2, Math.sin(t * 0.2) * 5],
    [0, 0, 0],
    [0, 1, 0]
  );
  const proj = m4.perspective((60 * Math.PI) / 180, aspect, 0.1, 100);
  const viewRot = m4.multiply(proj, view);
  // 去掉平移：天空盒只保留旋转
  viewRot[12] = 0; viewRot[13] = 0; viewRot[14] = 0;

  // Skybox（先画，深度=1）
  clearDemoFrame(gl);
  gl.depthMask(false);
  gl.useProgram(skyProg);
  setAttribute(gl, skyProg, 'a_position', posBuf, 3);
  gl.uniformMatrix4fv(gl.getUniformLocation(skyProg, 'u_viewRot'), false, viewRot);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, skybox);
  gl.uniform1i(gl.getUniformLocation(skyProg, 'u_skybox'), 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
  gl.drawElements(gl.TRIANGLES, geo.indices.length, gl.UNSIGNED_SHORT, 0);
  gl.depthMask(true);

  // 场景立方体
  gl.useProgram(meshProg);
  setAttribute(gl, meshProg, 'a_position', posBuf, 3);
  const viewProj = m4.multiply(
    m4.perspective((60 * Math.PI) / 180, aspect, 0.1, 100),
    m4.lookAt(
      [Math.cos(t * 0.2) * 5, 2, Math.sin(t * 0.2) * 5],
      [0, 0, 0],
      [0, 1, 0]
    )
  );
  gl.uniformMatrix4fv(
    gl.getUniformLocation(meshProg, 'u_matrix'),
    false,
    m4.multiply(viewProj, m4.multiply(m4.translation(0, 0, 0), m4.yRotation(t * 2)))
  );
  gl.drawElements(gl.TRIANGLES, geo.indices.length, gl.UNSIGNED_SHORT, 0);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
