import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Trail } from '@react-three/drei';
import * as THREE from 'three';

interface ServiceOrbsProps {
  scrollProgress: number;
}

interface OrbConfig {
  color: string;
  emissive: string;
  position: [number, number, number];
  size: number;
  speed: number;
  orbitRadius: number;
  orbitOffset: number;
}

function ServiceOrb({ 
  config, 
  scrollProgress, 
  index 
}: { 
  config: OrbConfig; 
  scrollProgress: number; 
  index: number;
}) {
  const orbRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);

  // Calculate when this orb should appear based on scroll
  const orbAppearProgress = 0.15 + index * 0.15;
  const orbVisibility = Math.max(0, Math.min(1, (scrollProgress - orbAppearProgress) * 5));

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (orbRef.current && orbVisibility > 0) {
      // Orbital motion
      const angle = time * config.speed + config.orbitOffset;
      const x = Math.cos(angle) * config.orbitRadius * orbVisibility;
      const y = config.position[1] + Math.sin(time * 0.5) * 0.3;
      const z = Math.sin(angle) * config.orbitRadius * orbVisibility - 5;
      
      orbRef.current.position.set(x, y, z);
      orbRef.current.scale.setScalar(orbVisibility * config.size);
    }
  });

  const color = new THREE.Color(config.color);
  const emissive = new THREE.Color(config.emissive);

  if (orbVisibility <= 0) return null;

  return (
    <Trail
      width={1}
      length={6}
      color={color}
      attenuation={(t) => t * t}
    >
      <Sphere ref={orbRef} args={[1, 32, 32]}>
        <MeshDistortMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.5}
          distort={0.2}
          speed={3}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={orbVisibility}
        />
      </Sphere>
    </Trail>
  );
}

export function ServiceOrbs({ scrollProgress }: ServiceOrbsProps) {
  const orbs: OrbConfig[] = useMemo(() => [
    // Web - Violet
    {
      color: '#8b5cf6',
      emissive: '#8b5cf6',
      position: [-3, 0, 0] as [number, number, number],
      size: 0.4,
      speed: 0.5,
      orbitRadius: 4,
      orbitOffset: 0
    },
    // Mobile - Green
    {
      color: '#10b981',
      emissive: '#10b981',
      position: [3, 0, 0] as [number, number, number],
      size: 0.35,
      speed: 0.6,
      orbitRadius: 3.5,
      orbitOffset: Math.PI * 0.66
    },
    // Backoffice - Red/Rose
    {
      color: '#f43f5e',
      emissive: '#f43f5e',
      position: [0, 2, 0] as [number, number, number],
      size: 0.35,
      speed: 0.4,
      orbitRadius: 3,
      orbitOffset: Math.PI * 1.33
    },
    // 360 - Gradient effect (cyan)
    {
      color: '#22d3ee',
      emissive: '#22d3ee',
      position: [0, -2, 0] as [number, number, number],
      size: 0.5,
      speed: 0.3,
      orbitRadius: 5,
      orbitOffset: Math.PI
    }
  ], []);

  return (
    <group>
      {orbs.map((config, index) => (
        <ServiceOrb
          key={index}
          config={config}
          scrollProgress={scrollProgress}
          index={index}
        />
      ))}
    </group>
  );
}
