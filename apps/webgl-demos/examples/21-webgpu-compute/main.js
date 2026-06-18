import { DEMO_CLEAR_WEBGPU } from '../../shared/gl-utils.js';

const PARTICLE_COUNT = 8192;
const WORKGROUP = 64;
const VERTS_PER_PARTICLE = 6;

const canvas = document.querySelector('#canvas');
const statusEl = document.querySelector('#status');

function fail(msg) {
  statusEl.textContent = msg;
  statusEl.style.color = '#f85149';
}

function writeParams(device, buffer, dt, count) {
  const data = new ArrayBuffer(16);
  const view = new DataView(data);
  view.setFloat32(0, dt, true);
  view.setUint32(4, count, true);
  device.queue.writeBuffer(buffer, 0, data);
}

async function logShaderErrors(device, module, label) {
  const info = await module.getCompilationInfo();
  for (const m of info.messages) {
    if (m.type === 'error') console.error(`[${label}]`, m.message);
  }
}

async function main() {
  if (!navigator.gpu) {
    fail('需要 WebGPU。对比 WebGL 版：examples/11-particles/');
    return;
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) { fail('requestAdapter 失败'); return; }
  const device = await adapter.requestDevice();
  const context = canvas.getContext('webgpu');
  const format = navigator.gpu.getPreferredCanvasFormat();

  const viewportBuffer = device.createBuffer({
    size: 16,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  function writeViewport(w, h) {
    const data = new Float32Array([w, h, 4.0, 0]); // 粒子半径（像素）
    device.queue.writeBuffer(viewportBuffer, 0, data);
  }

  let canvasW = 0;
  let canvasH = 0;

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (w < 1 || h < 1 || (w === canvasW && h === canvasH)) return;
    canvasW = w;
    canvasH = h;
    canvas.width = w;
    canvas.height = h;
    context.configure({ device, format, alphaMode: 'opaque' });
    writeViewport(w, h);
  };
  resize();
  window.addEventListener('resize', resize);
  new ResizeObserver(resize).observe(canvas);

  const particles = new Float32Array(PARTICLE_COUNT * 4);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles[i * 4] = (Math.random() * 2 - 1) * 0.95;
    particles[i * 4 + 1] = (Math.random() * 2 - 1) * 0.95;
    particles[i * 4 + 2] = (Math.random() - 0.5) * 0.02;
    particles[i * 4 + 3] = (Math.random() - 0.5) * 0.02;
  }

  const particleBuffer = device.createBuffer({
    size: particles.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(particleBuffer, 0, particles);

  const paramsBuffer = device.createBuffer({
    size: 16,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const computeCode = `
    struct Particle { pos: vec2f, vel: vec2f };
    struct Params { dt: f32, count: u32, _pad: vec2u };
    @group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
    @group(0) @binding(1) var<uniform> params: Params;

    @compute @workgroup_size(${WORKGROUP})
    fn update(@builtin(global_invocation_id) gid: vec3u) {
      let i = gid.x;
      if (i >= params.count) { return; }
      var p = particles[i];
      p.pos += p.vel * params.dt;
      if (p.pos.x < -0.95) { p.pos.x = -0.95; p.vel.x *= -1.0; }
      if (p.pos.x > 0.95) { p.pos.x = 0.95; p.vel.x *= -1.0; }
      if (p.pos.y < -0.95) { p.pos.y = -0.95; p.vel.y *= -1.0; }
      if (p.pos.y > 0.95) { p.pos.y = 0.95; p.vel.y *= -1.0; }
      particles[i] = p;
    }
  `;

  const renderCode = `
    struct Particle { pos: vec2f, vel: vec2f };
    struct Viewport { dimensions: vec2f, pointRadius: f32, _pad: f32 };
    @group(0) @binding(0) var<storage, read> particles: array<Particle>;
    @group(0) @binding(1) var<uniform> viewport: Viewport;

    const QUAD: array<vec2f, 6> = array<vec2f, 6>(
      vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0),
      vec2f(-1.0, -1.0), vec2f(1.0, 1.0), vec2f(-1.0, 1.0),
    );

    struct VSOut {
      @builtin(position) pos: vec4f,
      @location(0) uv: vec2f,
      @location(1) speed: f32,
      @location(2) tint: f32,
    };

    @vertex
    fn vs(@builtin(vertex_index) vid: u32) -> VSOut {
      var o: VSOut;
      let i = vid / 6u;
      let corner = QUAD[vid % 6u];
      let p = particles[i];
      let ndcPerPx = vec2f(2.0 / viewport.dimensions.x, 2.0 / viewport.dimensions.y);
      let half = corner * viewport.pointRadius * ndcPerPx;
      o.pos = vec4f(p.pos + half, 0.0, 1.0);
      o.uv = corner * 0.5 + 0.5;
      o.speed = length(p.vel) * 80.0;
      o.tint = fract(f32(i) * 0.6180339887);
      return o;
    }

    @fragment
    fn fs(@location(0) uv: vec2f, @location(1) speed: f32, @location(2) tint: f32) -> @location(0) vec4f {
      let d = length(uv - vec2f(0.5)) * 2.0;
      if (d > 1.0) { discard; }

      let cool = vec3f(0.55, 0.64, 0.80);
      let warm = vec3f(0.80, 0.66, 0.70);
      let mint = vec3f(0.58, 0.74, 0.70);
      let hue = tint * 6.28318;
      let accent = vec3f(
        0.60 + 0.08 * sin(hue),
        0.62 + 0.06 * sin(hue + 2.1),
        0.74 + 0.08 * sin(hue + 4.2),
      );
      let base = mix(accent, mix(cool, warm, clamp(speed * 0.22, 0.0, 1.0)), 0.45);
      let c = mix(base, mint, tint * 0.25);

      return vec4f(c, 0.55);
    }
  `;

  const computeModule = device.createShaderModule({ code: computeCode });
  const renderModule = device.createShaderModule({ code: renderCode });
  await logShaderErrors(device, computeModule, 'compute');
  await logShaderErrors(device, renderModule, 'render');

  const computePipeline = device.createComputePipeline({
    layout: 'auto',
    compute: { module: computeModule, entryPoint: 'update' },
  });

  const renderPipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: { module: renderModule, entryPoint: 'vs' },
    fragment: {
      module: renderModule,
      entryPoint: 'fs',
      targets: [{
        format,
        // 与 11-particles 一致：加法混合，避免大量半透明叠绘的顺序闪烁
        blend: {
          color: { srcFactor: 'src-alpha', dstFactor: 'one', operation: 'add' },
          alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
        },
      }],
    },
    primitive: { topology: 'triangle-list' },
  });

  const computeBG = device.createBindGroup({
    layout: computePipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: particleBuffer } },
      { binding: 1, resource: { buffer: paramsBuffer } },
    ],
  });

  const renderBG = device.createBindGroup({
    layout: renderPipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: particleBuffer } },
      { binding: 1, resource: { buffer: viewportBuffer } },
    ],
  });

  statusEl.textContent = `${PARTICLE_COUNT} 粒子 · WebGPU 用小圆点四边形渲染（非 point-list）`;
  statusEl.style.color = '#8b949e';

  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.033);
    last = now;
    writeParams(device, paramsBuffer, dt, PARTICLE_COUNT);

    const encoder = device.createCommandEncoder();
    const cpass = encoder.beginComputePass();
    cpass.setPipeline(computePipeline);
    cpass.setBindGroup(0, computeBG);
    cpass.dispatchWorkgroups(Math.ceil(PARTICLE_COUNT / WORKGROUP));
    cpass.end();

    const rpass = encoder.beginRenderPass({
      colorAttachments: [{
        view: context.getCurrentTexture().createView(),
        clearValue: DEMO_CLEAR_WEBGPU,
        loadOp: 'clear',
        storeOp: 'store',
      }],
    });
    rpass.setPipeline(renderPipeline);
    rpass.setBindGroup(0, renderBG);
    rpass.draw(PARTICLE_COUNT * VERTS_PER_PARTICLE);
    rpass.end();

    device.queue.submit([encoder.finish()]);
    // 等 GPU 完成再开下一帧，避免 compute 覆盖 buffer 时 render 仍在读（闪烁）
    device.queue.onSubmittedWorkDone().then(() => requestAnimationFrame(frame));
  }
  requestAnimationFrame(frame);
}

main().catch((e) => {
  console.error(e);
  fail(e.message);
});
