import { useRef, useState, useEffect, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, Float, Text3D, Center } from '@react-three/drei';
import { FloatingLogo3D } from './FloatingLogo3D';
import { ServiceOrbs } from './ServiceOrbs';
import * as THREE from 'three';

function ScrollContent() {
  const scroll = useScroll();
  const [scrollProgress, setScrollProgress] = useState(0);

  useFrame(() => {
    setScrollProgress(scroll.offset);
  });

  return (
    <>
      <FloatingLogo3D scrollProgress={scrollProgress} />
      <ServiceOrbs scrollProgress={scrollProgress} />
      <BackgroundStars scrollProgress={scrollProgress} />
    </>
  );
}

function BackgroundStars({ scrollProgress }: { scrollProgress: number }) {
  const starsRef = useRef<THREE.Points>(null);
  const count = 500;
  
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    
    // Purple to blue gradient
    const t = Math.random();
    colors[i * 3] = 0.55 + t * 0.2;
    colors[i * 3 + 1] = 0.36 + t * 0.15;
    colors[i * 3 + 2] = 0.96;
  }

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.02 + scrollProgress * 2;
      starsRef.current.rotation.x = scrollProgress * 0.5;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

interface ScrollSceneProps {
  children: ReactNode;
  pages?: number;
}

export function ScrollScene({ children, pages = 5 }: ScrollSceneProps) {
  return (
    <div className="relative">
      {/* 3D Canvas Layer */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          <color attach="background" args={['#0a0a0f']} />
          <fog attach="fog" args={['#0a0a0f', 10, 50]} />
          
          <ScrollControls pages={pages} damping={0.25}>
            <ScrollContent />
          </ScrollControls>
          
          <ambientLight intensity={0.2} />
        </Canvas>
      </div>
      
      {/* HTML Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
