import { Canvas } from '@react-three/fiber';
import { Suspense, ReactNode } from 'react';

interface Scene3DProps {
  children: ReactNode;
  className?: string;
}

export function Scene3D({ children, className = '' }: Scene3DProps) {
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
