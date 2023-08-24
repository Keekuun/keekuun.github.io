---
title: webgl学习资源
sidebar: auto
date: 2023-08-21
isComment: true
categories: 
- webgl

tags:
- webgl
- 3D
---

Smallest GLSL:

```js
'use strict';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const vsGLSL = `
void main() {
    gl_Position = vec4(0, 0, 0, 1);
    gl_PointSize = 100.0;
}
`;

const fsGLSL = `
precision highp float;

void main() {
    gl_FragColor = vec4(1, 0.5, 0, 1);
}
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsGLSL);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(vertexShader))
};

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsGLSL);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(fragmentShader))
};

const prg = gl.createProgram();
gl.attachShader(prg, vertexShader);
gl.attachShader(prg, fragmentShader);
gl.linkProgram(prg);
if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(prg))
};

gl.useProgram(prg);

// draw 1 point
gl.drawArrays(gl.POINTS, 0, 1);
```

# webgl doc

+ [WebGL](https://webglfundamentals.org/webgl/lessons/zh_cn/)
+ [WebGL2](https://webgl2fundamentals.org/webgl/lessons/zh_cn/)
+ [OpenGL ES 3.0 API Reference Card](https://www.khronos.org/files/opengles3-quick-reference-card.pdf)

# webgl video
+ [YouTube: WebGL + WebGPU Meetup LIVE](https://www.youtube.com/watch?v=oWwtCDv3Pgg)
<iframe width="640" height="360" src="https://www.youtube.com/embed/oWwtCDv3Pgg" title="WebGL + WebGPU Meetup LIVE!" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

# webgl-state-diagram

+ [WebGL](https://webglfundamentals.org/webgl/lessons/resources/webgl-state-diagram.html?exampleId=smallest-glsl#no-help)
+ [WebGL2](https://webgl2fundamentals.org/webgl/lessons/resources/webgl-state-diagram.html?exampleId=smallest-glsl#no-help)
