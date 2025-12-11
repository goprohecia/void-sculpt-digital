import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Box, Sphere, Torus, Octahedron, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface Step {
  title: string;
  color: string;
  shape: 'box' | 'sphere' | 'torus' | 'octahedron';
}

interface ServiceSteps3DProps {
  scrollProgress: number;
  steps: Step[];
  accentColor?: string;
}

function StepShape({ 
  step, 
  index, 
  scrollProgress, 
  totalSteps 
}: { 
  step: Step; 
  index: number; 
  scrollProgress: number;
  totalSteps: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Calculate step visibility based on scroll
  const stepStart = index / totalSteps;
  const stepEnd = (index + 1) / totalSteps;
  const stepProgress = Math.max(0, Math.min(1, (scrollProgress - stepStart) / (stepEnd - stepStart)));
  const isActive = scrollProgress >= stepStart && scrollProgress < stepEnd;

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      // Position based on scroll
      const xOffset = (index - (totalSteps - 1) / 2) * 3;
      const yOffset = isActive ? Math.sin(time * 2) * 0.2 : 0;
      const zOffset = isActive ? 2 : 0;
      
      meshRef.current.position.x = xOffset;
      meshRef.current.position.y = yOffset;
      meshRef.current.position.z = zOffset;
      
      // Scale based on activity
      const targetScale = isActive ? 1.5 : 0.8;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
      
      // Rotation
      meshRef.current.rotation.x = time * 0.3;
      meshRef.current.rotation.y = time * 0.5;
    }
  });

  const color = new THREE.Color(step.color);
  const opacity = stepProgress > 0 ? 0.8 : 0.3;

  const materialProps = {
    color,
    emissive: color,
    emissiveIntensity: isActive ? 0.5 : 0.1,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity
  };

  const renderShape = () => {
    switch (step.shape) {
      case 'box':
        return (
          <Box ref={meshRef} args={[1, 1, 1]}>
            <meshStandardMaterial {...materialProps} />
          </Box>
        );
      case 'sphere':
        return (
          <Sphere ref={meshRef} args={[0.6, 32, 32]}>
            <MeshDistortMaterial
              {...materialProps}
              distort={isActive ? 0.3 : 0.1}
              speed={2}
            />
          </Sphere>
        );
      case 'torus':
        return (
          <Torus ref={meshRef} args={[0.5, 0.2, 16, 32]}>
            <meshStandardMaterial {...materialProps} />
          </Torus>
        );
      case 'octahedron':
        return (
          <Octahedron ref={meshRef} args={[0.7]}>
            <meshStandardMaterial {...materialProps} />
          </Octahedron>
        );
      default:
        return null;
    }
  };

  return (
    <Float speed={isActive ? 4 : 1} rotationIntensity={isActive ? 1 : 0.2}>
      {renderShape()}
    </Float>
  );
}

export function ServiceSteps3D({ scrollProgress, steps, accentColor = '#8b5cf6' }: ServiceSteps3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = -scrollProgress * 2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -3, -5]}>
      {/* Lighting */}
      <pointLight position={[0, 5, 5]} intensity={1} color={accentColor} />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#3b82f6" />
      
      {steps.map((step, index) => (
        <StepShape
          key={index}
          step={step}
          index={index}
          scrollProgress={scrollProgress}
          totalSteps={steps.length}
        />
      ))}
    </group>
  );
}
