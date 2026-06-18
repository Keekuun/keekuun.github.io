import { DEMO_CLEAR_WEBGPU } from '../../shared/gl-utils.js';

const canvas = document.querySelector('#canvas');
const statusEl = document.querySelector('#status');

function showError(msg) {
  statusEl.textContent = msg;
  statusEl.style.color = '#f85149';
}

async function initWebGPU() {
  if (!navigator.gpu) {
    showError('当前浏览器不支持 WebGPU。请使用 Chrome 113+ / Safari 26+ / Firefox 141+。');
    return;
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    showError('requestAdapter 失败，无法获取 GPU 适配器。');
    return;
  }

  const device = await adapter.requestDevice();
  const context = canvas.getContext('webgpu');
  const format = navigator.gpu.getPreferredCanvasFormat();

  function configure() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (w < 1 || h < 1) return;
    canvas.width = w;
    canvas.height = h;
    context.configure({ device, format, alphaMode: 'opaque' });
  }
  configure();
  window.addEventListener('resize', configure);

  const shaderCode = `
    struct Uniforms {
      time: f32,
    };
    @group(0) @binding(0) var<uniform> u: Uniforms;

    struct VertexOut {
      @builtin(position) pos: vec4f,
      @location(0) color: vec4f,
    };

    @vertex
    fn vs(@location(0) position: vec2f, @location(1) color: vec4f) -> VertexOut {
      var out: VertexOut;
      let angle = u.time;
      let c = cos(angle);
      let s = sin(angle);
      let rot = mat2x2f(c, -s, s, c);
      out.pos = vec4f(rot * position, 0.0, 1.0);
      out.color = color;
      return out;
    }

    @fragment
    fn fs(@location(0) color: vec4f) -> @location(0) vec4f {
      return color;
    }
  `;

  const module = device.createShaderModule({ code: shaderCode });
  const info = await module.getCompilationInfo();
  for (const m of info.messages) {
    if (m.type === 'error') console.error('[shader]', m.message);
  }

  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module,
      entryPoint: 'vs',
      buffers: [{
        arrayStride: 6 * 4,
        attributes: [
          { shaderLocation: 0, offset: 0, format: 'float32x2' },
          { shaderLocation: 1, offset: 8, format: 'float32x4' },
        ],
      }],
    },
    fragment: {
      module,
      entryPoint: 'fs',
      targets: [{ format }],
    },
    primitive: { topology: 'triangle-list' },
  });

  const vertices = new Float32Array([
    0.0, 0.55,  1, 0.3, 0.5, 1,
    -0.55, -0.45,  0.2, 1, 0.7, 1,
    0.55, -0.45,  0.3, 0.5, 1, 1,
  ]);

  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, vertices);

  const uniformBuffer = device.createBuffer({
    size: 16,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
  });

  statusEl.textContent = `WebGPU 就绪 · ${adapter.info?.description ?? 'GPU'}`;
  statusEl.style.color = '#8b949e';

  function frame(t) {
    t *= 0.001;
    device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([t]));

    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [{
        view: context.getCurrentTexture().createView(),
        clearValue: DEMO_CLEAR_WEBGPU,
        loadOp: 'clear',
        storeOp: 'store',
      }],
    });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.draw(3);
    pass.end();
    device.queue.submit([encoder.finish()]);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

initWebGPU().catch((err) => {
  console.error(err);
  showError(`WebGPU 初始化失败: ${err.message}`);
});
