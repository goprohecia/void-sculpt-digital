import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

interface SectionTransition3DProps {
  scrollProgress: number;
  fromColor?: string;
  toColor?: string;
}

function MorphingShape({ scrollProgress, fromColor, toColor }: SectionTransition3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Interpolate between colors based on scroll
  const currentColor = useMemo(() => {
    const from = new THREE.Color(fromColor);
    const to = new THREE.Color(toColor);
    return from.lerp(to, scrollProgress);
  }, [fromColor, toColor, scrollProgress]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      // Morphing rotation based on scroll
      meshRef.current.rotation.x = time * 0.2 + scrollProgress * Math.PI;
      meshRef.current.rotation.y = time * 0.3 + scrollProgress * Math.PI * 0.5;
      meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.2;
      
      // Scale pulsation with scroll influence
      const baseScale = 1 + Math.sin(time * 2) * 0.1;
      const scrollScale = 1 + scrollProgress * 0.5;
      meshRef.current.scale.setScalar(baseScale * scrollScale);
    }
  });

  // Calculate distortion based on scroll (more distortion during transitions)
  const distortAmount = 0.3 + Math.sin(scrollProgress * Math.PI) * 0.4;

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Icosahedron ref={meshRef} args={[1.5, 4]}>
        <MeshDistortMaterial
          color={currentColor}
          emissive={currentColor}
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
          distort={distortAmount}
          speed={3}
          transparent
          opacity={0.8}
        />
      </Icosahedron>
    </Float>
  );
}

function TransitionParticles({ scrollProgress }: { scrollProgress: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spiral distribution
      const angle = (i / count) * Math.PI * 8;
      const radius = 2 + Math.random() * 3;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (i / count - 0.5) * 10;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Gradient colors from violet to blue
      const t = i / count;
      colors[i * 3] = 0.5 + t * 0.3; // R
      colors[i * 3 + 1] = 0.2 + t * 0.2; // G
      colors[i * 3 + 2] = 0.8 + t * 0.2; // B

      sizes[i] = Math.random() * 3 + 1;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;
      particlesRef.current.rotation.y = time * 0.1 + scrollProgress * 2;
      particlesRef.current.position.y = -scrollProgress * 5;
      
      // Update particle positions for flow effect
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 8 + time * 0.5;
        const radius = 2 + Math.sin(time + i * 0.1) * 0.5;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6 + scrollProgress * 0.4}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function SectionTransition3D({ 
  scrollProgress, 
  fromColor = '#8b5cf6', 
  toColor = '#3b82f6' 
}: SectionTransition3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = (0.5 - scrollProgress) * 2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central morphing shape */}
      <MorphingShape 
        scrollProgress={scrollProgress} 
        fromColor={fromColor} 
        toColor={toColor} 
      />
      
      {/* Transition particles */}
      <TransitionParticles scrollProgress={scrollProgress} />
      
      {/* Dynamic lighting */}
      <pointLight
        position={[0, 2, 3]}
        intensity={1 + scrollProgress}
        color={fromColor}
      />
      <pointLight
        position={[0, -2, 3]}
        intensity={scrollProgress}
        color={toColor}
      />
    </group>
  );
}
