import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Text3D, Center, Sphere, Box, Octahedron, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';

interface Step {
  title: string;
  description: string;
  features: string[];
}

interface StepsTimeline3DProps {
  steps: Step[];
  accentColor: string;
  activeStep: number;
  onStepChange: (step: number) => void;
}

function StepShape({ 
  index, 
  active, 
  color, 
  position,
  onClick
}: { 
  index: number; 
  active: boolean; 
  color: string;
  position: [number, number, number];
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const colorObj = new THREE.Color(color);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      // Scale animation
      const targetScale = active ? 1.5 : hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Rotation
      if (active) {
        meshRef.current.rotation.x = time * 0.5;
        meshRef.current.rotation.y = time * 0.7;
      } else {
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
      }
    }
  });

  const shapes = [Sphere, Box, Octahedron];
  const ShapeComponent = shapes[index % shapes.length];
  const args = index % 3 === 0 ? [0.5, 32, 32] : index % 3 === 1 ? [0.8, 0.8, 0.8] : [0.6];

  return (
    <Float speed={active ? 4 : 2} rotationIntensity={active ? 1 : 0.3}>
      <group position={position}>
        <ShapeComponent 
          ref={meshRef} 
          args={args as any}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <MeshDistortMaterial
            color={colorObj}
            emissive={colorObj}
            emissiveIntensity={active ? 0.8 : 0.3}
            metalness={0.9}
            roughness={0.1}
            distort={active ? 0.4 : 0.1}
            speed={active ? 3 : 1}
            transparent
            opacity={active ? 1 : 0.6}
          />
        </ShapeComponent>
        
        {/* Connection line to next step */}
        {index < 2 && (
          <mesh position={[1.5, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
            <meshStandardMaterial
              color={colorObj}
              emissive={colorObj}
              emissiveIntensity={0.3}
              transparent
              opacity={0.5}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
}

function GlowingOrb({ position, color, intensity }: { position: [number, number, number]; color: string; intensity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const colorObj = new THREE.Color(color);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[0.1, 16, 16]}>
      <meshStandardMaterial
        color={colorObj}
        emissive={colorObj}
        emissiveIntensity={intensity}
        transparent
        opacity={0.8}
      />
    </Sphere>
  );
}

function Scene({ steps, accentColor, activeStep, onStepChange }: StepsTimeline3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  const stepPositions: [number, number, number][] = [
    [-3, 0, 0],
    [0, 0, 0],
    [3, 0, 0],
  ];

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating motion
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient and point lights */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={1} color={accentColor} />
      <pointLight position={[0, -5, -5]} intensity={0.5} color="#8b5cf6" />
      
      {/* Step shapes */}
      {steps.slice(0, 3).map((_, index) => (
        <StepShape
          key={index}
          index={index}
          active={index === activeStep}
          color={accentColor}
          position={stepPositions[index]}
          onClick={() => onStepChange(index)}
        />
      ))}
      
      {/* Background glowing orbs */}
      <GlowingOrb position={[-4, 2, -3]} color="#8b5cf6" intensity={0.5} />
      <GlowingOrb position={[4, -2, -3]} color={accentColor} intensity={0.5} />
      <GlowingOrb position={[0, 3, -4]} color="#3b82f6" intensity={0.3} />
    </group>
  );
}

export function StepsTimeline3D({ steps, accentColor, activeStep, onStepChange }: StepsTimeline3DProps) {
  return (
    <div className="h-[300px] w-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene 
            steps={steps} 
            accentColor={accentColor}
            activeStep={activeStep}
            onStepChange={onStepChange}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
