'use client';

import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import type { Mesh } from 'three';

type CameraMode = 'orthographic' | 'perspective';

type CameraRigProps = {
  mode: CameraMode;
};

type SceneProps = {
  cameraMode: CameraMode;
  showGrid: boolean;
};

function CameraRig({ mode }: CameraRigProps) {
  const isometricPosition = useMemo<[number, number, number]>(() => {
    const distance = 6;
    return [distance, distance, distance];
  }, []);
  const perspectivePosition = useMemo<[number, number, number]>(() => [6, 5, 8], []);

  if (mode === 'orthographic') {
    return (
      <OrthographicCamera
        key="orthographic"
        makeDefault
        position={isometricPosition}
        zoom={80}
        near={-100}
        far={100}
        onUpdate={(camera) => {
          camera.lookAt(0, 0, 0);
        }}
      />
    );
  }

  return (
    <PerspectiveCamera
      key="perspective"
      makeDefault
      position={perspectivePosition}
      near={0.1}
      far={100}
      fov={50}
      onUpdate={(camera) => {
        camera.lookAt(0, 0, 0);
      }}
    />
  );
}

function RotatingCube() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.rotation.x += delta * 0.6;
    meshRef.current.rotation.y += delta * 0.6;
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6366f1" />
    </mesh>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 6, 5]} intensity={0.9} castShadow />
    </>
  );
}

function Scene({ cameraMode, showGrid }: SceneProps) {
  return (
    <>
      <color attach="background" args={['#f2f2f2']} />
      <CameraRig mode={cameraMode} />
      <Lighting />
      <RotatingCube />
      {showGrid ? (
        <gridHelper
          args={[12, 24, '#9ca3af', '#d4d4d8']}
          position={[0, -0.5, 0]}
        />
      ) : null}
      <OrbitControls
        key={cameraMode}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI - 0.2}
        minDistance={3}
        maxDistance={20}
        minZoom={20}
        maxZoom={120}
        target={[0, 0.5, 0]}
      />
    </>
  );
}

export default function ScenePage() {
  const [cameraMode, setCameraMode] = useState<CameraMode>('orthographic');
  const [showGrid, setShowGrid] = useState(true);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <div className="pointer-events-none fixed right-6 top-6 z-10">
        <div className="card pointer-events-auto bg-base-100/90 shadow-lg">
          <div className="card-body space-y-4 p-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-base-content/60">
                Camera
              </h2>
              <div className="join mt-2">
                <button
                  type="button"
                  className={`join-item btn btn-sm ${
                    cameraMode === 'orthographic' ? 'btn-primary' : 'btn-ghost'
                  }`}
                  aria-pressed={cameraMode === 'orthographic'}
                  onClick={() => setCameraMode('orthographic')}
                >
                  Isometric
                </button>
                <button
                  type="button"
                  className={`join-item btn btn-sm ${
                    cameraMode === 'perspective' ? 'btn-primary' : 'btn-ghost'
                  }`}
                  aria-pressed={cameraMode === 'perspective'}
                  onClick={() => setCameraMode('perspective')}
                >
                  Perspective
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-base-content/80">Show grid</span>
              <input
                type="checkbox"
                className="toggle toggle-sm"
                checked={showGrid}
                onChange={(event) => setShowGrid(event.target.checked)}
              />
            </div>
          </div>
        </div>
      </div>

      <Canvas className="h-full w-full" shadows dpr={[1, 2]}>
        <Scene cameraMode={cameraMode} showGrid={showGrid} />
      </Canvas>
    </main>
  );
}
