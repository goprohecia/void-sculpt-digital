import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Box, Torus, Octahedron, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, useEffect, useState } from 'react';

interface ServiceStep {
  title: string;
  description: string;
  features?: string[];
}

interface ServiceScene3DProps {
  steps: ServiceStep[];
  accentColor: string;
  serviceType: 'web' | 'mobile' | 'backoffice' | 'fullstack';
}

function StepIndicator({ 
  index, 
  active, 
  color, 
  position 
}: { 
  index: number; 
  active: boolean; 
  color: string;
  position: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const colorObj = new THREE.Color(color);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      // Pulse when active
      const scale = active ? 1.2 + Math.sin(time * 3) * 0.2 : 0.8;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
      
      // Rotate
      meshRef.current.rotation.x = time * 0.5;
      meshRef.current.rotation.y = time * 0.7;
    }
  });

  return (
    <Float speed={active ? 4 : 1} rotationIntensity={active ? 1 : 0.2}>
      <Octahedron ref={meshRef} position={position} args={[0.3]}>
        <MeshDistortMaterial
          color={colorObj}
          emissive={colorObj}
          emissiveIntensity={active ? 0.8 : 0.2}
          metalness={0.9}
          roughness={0.1}
          distort={active ? 0.3 : 0.1}
          speed={2}
          transparent
          opacity={active ? 1 : 0.5}
        />
      </Octahedron>
    </Float>
  );
}

function CentralShape({ serviceType, activeStep, color }: { serviceType: string; activeStep: number; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const colorObj = new THREE.Color(color);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.2 + activeStep * 0.3;
      meshRef.current.rotation.y = time * 0.3;
      meshRef.current.rotation.z = Math.cos(time * 0.3) * 0.1;
      
      // Scale based on active step
      const targetScale = 1 + activeStep * 0.1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
    }
  });

  const renderShape = () => {
    switch (serviceType) {
      case 'web':
        return (
          <Box ref={meshRef} args={[1.5, 1.5, 1.5]}>
            <MeshDistortMaterial
              color={colorObj}
              emissive={colorObj}
              emissiveIntensity={0.4}
              metalness={0.8}
              roughness={0.2}
              distort={0.2 + activeStep * 0.05}
              speed={2}
              transparent
              opacity={0.9}
            />
          </Box>
        );
      case 'mobile':
        return (
          <Sphere ref={meshRef} args={[1, 64, 64]}>
            <MeshDistortMaterial
              color={colorObj}
              emissive={colorObj}
              emissiveIntensity={0.4}
              metalness={0.8}
              roughness={0.2}
              distort={0.3 + activeStep * 0.05}
              speed={3}
              transparent
              opacity={0.9}
            />
          </Sphere>
        );
      case 'backoffice':
        return (
          <Torus ref={meshRef} args={[1, 0.4, 32, 64]}>
            <MeshDistortMaterial
              color={colorObj}
              emissive={colorObj}
              emissiveIntensity={0.4}
              metalness={0.8}
              roughness={0.2}
              distort={0.15 + activeStep * 0.05}
              speed={2}
              transparent
              opacity={0.9}
            />
          </Torus>
        );
      case 'fullstack':
        return (
          <Octahedron ref={meshRef} args={[1.2]}>
            <MeshDistortMaterial
              color={colorObj}
              emissive={colorObj}
              emissiveIntensity={0.5}
              metalness={0.9}
              roughness={0.1}
              distort={0.25 + activeStep * 0.05}
              speed={2.5}
              transparent
              opacity={0.9}
            />
          </Octahedron>
        );
      default:
        return null;
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      {renderShape()}
    </Float>
  );
}

function OrbitingRings({ color, activeStep }: { color: string; activeStep: number }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const colorObj = new THREE.Color(color);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.5;
      ring1Ref.current.rotation.z = Math.PI / 4;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = time * 0.4;
      ring2Ref.current.rotation.x = Math.PI / 3;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = time * 0.3;
      ring3Ref.current.rotation.y = Math.PI / 6;
    }
  });

  return (
    <group>
      <Torus ref={ring1Ref} args={[2, 0.02, 16, 100]}>
        <meshStandardMaterial
          color={colorObj}
          emissive={colorObj}
          emissiveIntensity={0.6}
          transparent
          opacity={activeStep >= 0 ? 0.8 : 0.3}
        />
      </Torus>
      <Torus ref={ring2Ref} args={[2.3, 0.015, 16, 100]}>
        <meshStandardMaterial
          color={colorObj}
          emissive={colorObj}
          emissiveIntensity={0.5}
          transparent
          opacity={activeStep >= 1 ? 0.7 : 0.2}
        />
      </Torus>
      <Torus ref={ring3Ref} args={[2.6, 0.01, 16, 100]}>
        <meshStandardMaterial
          color={colorObj}
          emissive={colorObj}
          emissiveIntensity={0.4}
          transparent
          opacity={activeStep >= 2 ? 0.6 : 0.1}
        />
      </Torus>
    </group>
  );
}

function Scene({ steps, accentColor, serviceType, activeStep }: ServiceScene3DProps & { activeStep: number }) {
  const stepPositions: [number, number, number][] = useMemo(() => {
    const count = steps.length;
    return steps.map((_, i) => {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      return [Math.cos(angle) * 3.5, Math.sin(angle) * 1.5, 0];
    });
  }, [steps]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} color={accentColor} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />
      
      {/* Background stars */}
      <Stars radius={50} depth={50} count={1000} factor={2} saturation={0.5} fade speed={1} />
      
      {/* Central shape */}
      <CentralShape serviceType={serviceType} activeStep={activeStep} color={accentColor} />
      
      {/* Orbiting rings */}
      <OrbitingRings color={accentColor} activeStep={activeStep} />
      
      {/* Step indicators */}
      {steps.map((_, index) => (
        <StepIndicator
          key={index}
          index={index}
          active={index === activeStep}
          color={accentColor}
          position={stepPositions[index]}
        />
      ))}
    </>
  );
}

export function ServiceScene3D({ steps, accentColor, serviceType }: ServiceScene3DProps) {
  const [activeStep, setActiveStep] = useState(0);

  // Cycle through steps automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene 
            steps={steps} 
            accentColor={accentColor} 
            serviceType={serviceType}
            activeStep={activeStep}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
