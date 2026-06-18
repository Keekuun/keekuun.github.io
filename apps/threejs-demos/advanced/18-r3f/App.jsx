/** 进阶 18 · React Three Fiber · docs/3d/threejs/advanced/18-r3f-tres.md */
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { HelmetModel } from './HelmetModel.jsx';
import { DEMO_BG_CSS } from '../../shared/constants.js';

export default function App() {
  return (
    <div className="r3f-app">
      <header className="bar">
        <a href="/">← Demos</a>
        <span>进阶 18 · React + R3F · 声明式 3D</span>
      </header>
      <div className="r3f-canvas">
        <Canvas
          camera={{ position: [0, 0.5, 4], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={[DEMO_BG_CSS]} />
          <ambientLight intensity={0.25} />
          <directionalLight position={[5, 8, 5]} intensity={0.9} />
          <HelmetModel />
          <OrbitControls
            makeDefault
            enableDamping
            minDistance={1.5}
            maxDistance={12}
            maxPolarAngle={Math.PI * 0.48}
          />
          <Suspense fallback={null}>
            <Environment preset="sunset" background={false} />
          </Suspense>
        </Canvas>
      </div>
      <div className="panel">
        <strong>R3F 要点</strong>
        <p className="status" style={{ marginTop: 8 }}>
          Canvas + loadGLTF + drei Environment · 与 Tres 对照（文档 18）
        </p>
      </div>
    </div>
  );
}
