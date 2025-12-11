import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Ring, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingLogo3DProps {
  scrollProgress: number;
}

export function FloatingLogo3D({ scrollProgress }: FloatingLogo3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate particle positions
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 3 + Math.random() * 2;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (groupRef.current) {
      // Logo evolution based on scroll
      const scale = 1 - scrollProgress * 0.5;
      const yPos = scrollProgress * -8;
      const rotationY = scrollProgress * Math.PI * 2;
      
      groupRef.current.position.y = yPos;
      groupRef.current.scale.setScalar(Math.max(0.1, scale));
      groupRef.current.rotation.y = rotationY + time * 0.1;
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = time * 0.3 + scrollProgress * Math.PI;
      ringRef.current.rotation.z = time * 0.2;
    }

    if (torusRef.current) {
      torusRef.current.rotation.y = -time * 0.2;
      torusRef.current.rotation.x = scrollProgress * Math.PI * 0.5;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.05;
      particlesRef.current.rotation.x = scrollProgress * 0.5;
    }
  });

  const violetColor = new THREE.Color('#8b5cf6');
  const blueColor = new THREE.Color('#3b82f6');
  const cyanColor = new THREE.Color('#22d3ee');

  return (
    <group ref={groupRef}>
      {/* Ambient and directional lights */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#3b82f6" />
      
      {/* Central sphere with distort effect */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1.2, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color={violetColor}
            attach="material"
            distort={0.3 + scrollProgress * 0.3}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            emissive={violetColor}
            emissiveIntensity={0.3}
          />
        </Sphere>
      </Float>

      {/* Orbiting ring */}
      <Ring 
        ref={ringRef}
        args={[2, 2.2, 64]} 
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color={blueColor} 
          emissive={blueColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </Ring>

      {/* Secondary torus */}
      <Torus 
        ref={torusRef}
        args={[2.8, 0.08, 16, 100]} 
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial 
          color={cyanColor}
          emissive={cyanColor}
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
        />
      </Torus>

      {/* Particle field */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={violetColor}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
