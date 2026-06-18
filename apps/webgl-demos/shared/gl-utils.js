/**
 * Shared WebGL helpers for webgl-demos
 */

/** 略高于页面底色 #0f1117，避免画布与背景融为一体 */
export const DEMO_CLEAR_RGBA = [0.10, 0.12, 0.16, 1];
export const DEMO_CLEAR_WEBGPU = { r: 0.10, g: 0.12, b: 0.16, a: 1 };

export function clearDemoFrame(gl, bits = gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) {
  gl.clearColor(...DEMO_CLEAR_RGBA);
  gl.clear(bits);
}

export function createContext(canvas, preferWebGL2 = false) {
  if (preferWebGL2) {
    const gl2 = canvas.getContext('webgl2');
    if (gl2) return { gl: gl2, isWebGL2: true };
  }
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) throw new Error('WebGL not supported');
  return { gl, isWebGL2: gl instanceof WebGL2RenderingContext };
}

export function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    const numbered = source.split('\n').map((line, i) => `${i + 1}: ${line}`).join('\n');
    console.error(log, '\n', numbered);
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed: ${log}`);
  }
  return shader;
}

export function createProgram(gl, vsSource, fsSource) {
  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
  gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link failed: ${log}`);
  }
  return program;
}

export function resizeCanvasToDisplaySize(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.floor(canvas.clientWidth * dpr);
  const h = Math.floor(canvas.clientHeight * dpr);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    return true;
  }
  return false;
}

export function createBuffer(gl, data, target = gl.ARRAY_BUFFER, usage = gl.STATIC_DRAW) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(target, buffer);
  gl.bufferData(target, data, usage);
  return buffer;
}

export function setAttribute(gl, program, name, buffer, size, type = gl.FLOAT, normalized = false, stride = 0, offset = 0) {
  const loc = gl.getAttribLocation(program, name);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, size, type, normalized, stride, offset);
  return loc;
}

export function createCheckerTexture(gl, size = 64) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const check = ((x >> 3) ^ (y >> 3)) & 1;
      pixels[i] = check ? 220 : 40;
      pixels[i + 1] = check ? 80 : 160;
      pixels[i + 2] = check ? 80 : 220;
      pixels[i + 3] = 255;
    }
  }
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

/** Unit cube: 8 positions, 36 indices, per-face UVs and normals */
export function createCubeGeometry() {
  const positions = new Float32Array([
    -1, -1,  1,   1, -1,  1,   1,  1,  1,  -1,  1,  1,
    -1, -1, -1,  -1,  1, -1,   1,  1, -1,   1, -1, -1,
  ]);
  const indices = new Uint16Array([
    0, 1, 2,  0, 2, 3,   // front  +Z
    4, 7, 6,  4, 6, 5,   // back   -Z
    3, 2, 6,  3, 6, 5,   // top    +Y
    4, 0, 1,  4, 1, 7,   // bottom -Y
    1, 7, 6,  1, 6, 2,   // right  +X
    4, 5, 3,  4, 3, 0,   // left   -X
  ]);
  const normals = new Float32Array([
     0,  0,  1,   0,  0,  1,   0,  0,  1,   0,  0,  1,
     0,  0, -1,   0,  0, -1,   0,  0, -1,   0,  0, -1,
  ]);
  const uvs = new Float32Array([
    0, 0,  1, 0,  1, 1,  0, 1,
    0, 0,  1, 0,  1, 1,  0, 1,
  ]);
  return { positions, indices, normals, uvs, vertexCount: indices.length };
}

/** 36-vertex cube with per-face normals (for lighting / shadows) */
export function createSolidCubeExpanded() {
  const positions = new Float32Array([
    -1,-1,1, 1,-1,1, 1,1,1, -1,-1,1, 1,1,1, -1,1,1,
    -1,-1,-1, -1,1,-1, 1,1,-1, -1,-1,-1, 1,1,-1, 1,-1,-1,
    -1,1,-1, -1,1,1, 1,1,1, -1,1,-1, 1,1,1, 1,1,-1,
    -1,-1,-1, 1,-1,-1, 1,-1,1, -1,-1,-1, 1,-1,1, -1,-1,1,
    1,-1,-1, 1,1,-1, 1,1,1, 1,-1,-1, 1,1,1, 1,-1,1,
    -1,-1,-1, -1,-1,1, -1,1,1, -1,-1,-1, -1,1,1, -1,1,-1,
  ]);
  const normals = new Float32Array([
    0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1,
    0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
    0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0,
    0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
    1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0,
    -1,0,0, -1,0,0, -1,0,0, -1,0,0, -1,0,0, -1,0,0,
  ]);
  return { positions, normals, vertexCount: 36 };
}

export function initDepth(gl) {
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.frontFace(gl.CCW);
}

/** XZ ground plane centered at origin, y = 0 */
export function createPlaneGeometry(halfSize = 5) {
  const s = halfSize;
  const positions = new Float32Array([
    -s, 0, -s,  s, 0,  s,  s, 0, -s,
    -s, 0, -s, -s, 0,  s,  s, 0,  s,
  ]);
  const normals = new Float32Array([
    0, 1, 0, 0, 1, 0, 0, 1, 0,
    0, 1, 0, 0, 1, 0, 0, 1, 0,
  ]);
  return { positions, normals, vertexCount: 6 };
}

/** Procedural gradient cubemap (6 solid-color faces) */
export function createGradientCubemap(gl, size = 64) {
  const faces = [
    [180, 100, 80], [80, 120, 200], [120, 200, 140],
    [200, 180, 100], [140, 100, 200], [100, 180, 200],
  ];
  const targets = [
    gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
    gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
    gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
  ];
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
  for (let f = 0; f < 6; f++) {
    const [r, g, b] = faces[f];
    const pixels = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const t = y / size;
        const i = (y * size + x) * 4;
        pixels[i] = r * (0.6 + t * 0.4);
        pixels[i + 1] = g * (0.6 + t * 0.4);
        pixels[i + 2] = b * (0.6 + t * 0.4);
        pixels[i + 3] = 255;
      }
    }
    gl.texImage2D(targets[f], 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  }
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

export function createDepthFBO(gl, width, height) {
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  const colorTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, colorTex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTex, 0);
  const depthRb = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthRb);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRb);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { framebuffer: fb, texture: colorTex, width, height };
}

export function createColorFBO(gl, width, height) {
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  const rb = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rb);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { fb, tex, width, height };
}

/** WebGL2 MRT framebuffer with multiple COLOR_ATTACHMENT + drawBuffers */
export function createMRTFBO(gl, width, height, attachmentCount = 2) {
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  const textures = [];
  const attachments = [];
  for (let i = 0; i < attachmentCount; i++) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const attachment = gl.COLOR_ATTACHMENT0 + i;
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, tex, 0);
    textures.push(tex);
    attachments.push(attachment);
  }
  gl.drawBuffers(attachments);
  const depthRb = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthRb);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRb);
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error(`MRT framebuffer incomplete: 0x${status.toString(16)}`);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { fb, textures, depthRb, width, height };
}

/** Subdivided XZ plane with UV + tangent for normal mapping */
export function createSubdividedPlane(segments = 32, halfSize = 2) {
  const positions = [];
  const uvs = [];
  const normals = [];
  const tangents = [];
  const indices = [];
  const stride = segments + 1;
  for (let z = 0; z <= segments; z++) {
    for (let x = 0; x <= segments; x++) {
      const u = x / segments;
      const v = z / segments;
      positions.push((u - 0.5) * 2 * halfSize, 0, (v - 0.5) * 2 * halfSize);
      uvs.push(u, v);
      normals.push(0, 1, 0);
      tangents.push(1, 0, 0);
    }
  }
  for (let z = 0; z < segments; z++) {
    for (let x = 0; x < segments; x++) {
      const i = z * stride + x;
      indices.push(i, i + stride + 1, i + 1, i, i + stride, i + stride + 1);
    }
  }
  return {
    positions: new Float32Array(positions),
    uvs: new Float32Array(uvs),
    normals: new Float32Array(normals),
    tangents: new Float32Array(tangents),
    indices: new Uint16Array(indices),
    indexCount: indices.length,
  };
}

/** Procedural brick albedo + normal map (no external assets) */
export function createBrickTextures(gl, size = 128) {
  const colorPixels = new Uint8Array(size * size * 4);
  const normalPixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const row = Math.floor(v * 4);
      const bu = (u * 4 + (row % 2) * 0.5) % 1;
      const bv = (v * 4) % 1;
      const mortar = bu < 0.1 || bu > 0.9 || bv < 0.1 || bv > 0.9;
      const i = (y * size + x) * 4;
      if (mortar) {
        colorPixels[i] = 90; colorPixels[i + 1] = 88; colorPixels[i + 2] = 85;
      } else {
        colorPixels[i] = 160 + Math.random() * 30;
        colorPixels[i + 1] = 70 + Math.random() * 20;
        colorPixels[i + 2] = 50 + Math.random() * 15;
      }
      colorPixels[i + 3] = 255;
      let nx = 0; let ny = 0; let nz = 1;
      if (mortar) {
        nx = (bu - 0.5) * 1.8;
        ny = (bv - 0.5) * 1.8;
        const len = Math.hypot(nx, ny, 1);
        nx /= len; ny /= len; nz = 1 / len;
      }
      normalPixels[i] = (nx * 0.5 + 0.5) * 255;
      normalPixels[i + 1] = (ny * 0.5 + 0.5) * 255;
      normalPixels[i + 2] = (nz * 0.5 + 0.5) * 255;
      normalPixels[i + 3] = 255;
    }
  }
  function upload(data) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    return tex;
  }
  return { colorMap: upload(colorPixels), normalMap: upload(normalPixels) };
}

/** WebGL2 VAO with position + color buffers */
export function createMeshVAO(gl, program, positions, colors, indices) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const posBuf = createBuffer(gl, positions);
  const colBuf = createBuffer(gl, colors);
  const idxBuf = createBuffer(gl, indices, gl.ELEMENT_ARRAY_BUFFER);
  setAttribute(gl, program, 'a_position', posBuf, 3);
  setAttribute(gl, program, 'a_color', colBuf, 4);
  gl.bindVertexArray(null);
  return { vao, indexCount: indices.length, indexBuffer: idxBuf };
}
