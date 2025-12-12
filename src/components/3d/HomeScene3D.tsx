import { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Ring, Torus, Stars, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';
import { useScroll3D } from '@/hooks/use-scroll-3d';

function LogoSphere({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (groupRef.current) {
      // Scroll-based transformations
      const scale = Math.max(0.1, 1 - scrollProgress * 1.5);
      const yPos = -scrollProgress * 15;
      const rotation = scrollProgress * Math.PI * 3;
      
      groupRef.current.scale.setScalar(scale);
      groupRef.current.position.y = yPos;
      groupRef.current.rotation.y = rotation + time * 0.1;
    }

    if (sphereRef.current) {
      sphereRef.current.rotation.x = time * 0.2;
      sphereRef.current.rotation.z = time * 0.1;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.3 + Math.PI / 4;
      ring1Ref.current.rotation.z = time * 0.2;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.25;
      ring2Ref.current.rotation.x = Math.PI / 3;
    }
  });

  const violetColor = new THREE.Color('#8b5cf6');
  const blueColor = new THREE.Color('#3b82f6');
  const cyanColor = new THREE.Color('#22d3ee');

  return (
    <group ref={groupRef} position={[0, 1, 0]}>
      {/* Main sphere */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <Sphere ref={sphereRef} args={[1.5, 64, 64]}>
          <MeshDistortMaterial
            color={violetColor}
            emissive={violetColor}
            emissiveIntensity={0.4}
            distort={0.25 + scrollProgress * 0.2}
            speed={2}
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.9}
          />
        </Sphere>
      </Float>

      {/* Inner glow sphere */}
      <Sphere args={[1.3, 32, 32]}>
        <meshBasicMaterial
          color={violetColor}
          transparent
          opacity={0.2}
        />
      </Sphere>

      {/* Orbiting ring 1 */}
      <Ring 
        ref={ring1Ref}
        args={[2.2, 2.4, 64]}
      >
        <meshStandardMaterial 
          color={blueColor}
          emissive={blueColor}
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </Ring>

      {/* Orbiting ring 2 */}
      <Torus 
        ref={ring2Ref}
        args={[2.8, 0.06, 16, 100]}
      >
        <meshStandardMaterial 
          color={cyanColor}
          emissive={cyanColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </Torus>
    </group>
  );
}

function ServiceOrbs({ scrollProgress }: { scrollProgress: number }) {
  const orbsRef = useRef<THREE.Group>(null);

  const orbConfigs = [
    { color: '#8b5cf6', offset: 0, label: 'Web' },
    { color: '#10b981', offset: Math.PI * 0.5, label: 'Mobile' },
    { color: '#f43f5e', offset: Math.PI, label: 'Backoffice' },
    { color: '#22d3ee', offset: Math.PI * 1.5, label: '360°' },
  ];

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (orbsRef.current) {
      orbsRef.current.rotation.y = time * 0.1;
      orbsRef.current.position.y = -scrollProgress * 10 - 5;
      
      // Orbs spread out as you scroll
      const spreadFactor = 1 + scrollProgress * 2;
      orbsRef.current.scale.setScalar(spreadFactor);
    }
  });

  return (
    <group ref={orbsRef}>
      {orbConfigs.map((config, i) => (
        <OrbWithTrail 
          key={i}
          color={config.color}
          offset={config.offset}
          scrollProgress={scrollProgress}
          index={i}
        />
      ))}
    </group>
  );
}

function OrbWithTrail({ 
  color, 
  offset, 
  scrollProgress,
  index 
}: { 
  color: string; 
  offset: number;
  scrollProgress: number;
  index: number;
}) {
  const orbRef = useRef<THREE.Mesh>(null);

  const orbitRadius = 3;
  const appearThreshold = 0.1 + index * 0.1;
  const visibility = Math.max(0, Math.min(1, (scrollProgress - appearThreshold) * 4));

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (orbRef.current && visibility > 0) {
      const angle = time * 0.5 + offset;
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;
      const y = Math.sin(time * 0.3 + offset) * 0.5;
      
      orbRef.current.position.set(x, y, z);
      orbRef.current.scale.setScalar(visibility * 0.4);
    }
  });

  if (visibility <= 0) return null;

  const threeColor = new THREE.Color(color);

  return (
    <Sphere ref={orbRef} args={[1, 24, 24]}>
      <MeshDistortMaterial
        color={threeColor}
        emissive={threeColor}
        emissiveIntensity={0.6}
        distort={0.15}
        speed={3}
        roughness={0.1}
        metalness={0.9}
        transparent
        opacity={visibility * 0.9}
      />
    </Sphere>
  );
}

// Section Transition Morphing Shape
function SectionMorphingShape({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Calculate which section we're in (0-1 for each section)
  const sectionIndex = Math.floor(scrollProgress * 4);
  const sectionProgress = (scrollProgress * 4) % 1;
  
  const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f43f5e'];
  const currentColor = new THREE.Color(colors[sectionIndex % colors.length]);
  const nextColor = new THREE.Color(colors[(sectionIndex + 1) % colors.length]);
  const lerpedColor = currentColor.clone().lerp(nextColor, sectionProgress);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.2 + scrollProgress * Math.PI * 2;
      meshRef.current.rotation.y = time * 0.3 + scrollProgress * Math.PI;
      meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.2;
      
      // Position based on scroll - appears in the middle of page
      const visibility = scrollProgress > 0.15 && scrollProgress < 0.85 ? 1 : 0;
      const scale = visibility * (0.8 + Math.sin(sectionProgress * Math.PI) * 0.3);
      meshRef.current.scale.setScalar(scale);
      
      // Move along the side of the screen
      meshRef.current.position.x = 5 + Math.sin(scrollProgress * Math.PI * 4) * 2;
      meshRef.current.position.y = -scrollProgress * 30 + 5;
    }
  });

  // Calculate distortion - more during transitions
  const distortAmount = 0.2 + Math.sin(sectionProgress * Math.PI) * 0.4;

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
      <Icosahedron ref={meshRef} args={[1.2, 4]}>
        <MeshDistortMaterial
          color={lerpedColor}
          emissive={lerpedColor}
          emissiveIntensity={0.5}
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

// Transition Particles flowing between sections
function TransitionParticles({ scrollProgress }: { scrollProgress: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 300;

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spiral/helix distribution
      const t = i / count;
      const angle = t * Math.PI * 10;
      const radius = 3 + Math.random() * 4;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (t - 0.5) * 40;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Gradient colors
      colors[i * 3] = 0.5 + t * 0.4;
      colors[i * 3 + 1] = 0.2 + t * 0.3;
      colors[i * 3 + 2] = 0.8 + t * 0.2;
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;
      particlesRef.current.rotation.y = time * 0.05 + scrollProgress;
      particlesRef.current.position.y = -scrollProgress * 20;
      
      // Update particle positions for flow effect
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const angle = t * Math.PI * 10 + time * 0.3;
        const radius = 3 + Math.sin(time * 0.5 + t * 5) * 1;
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
        size={0.04}
        vertexColors
        transparent
        opacity={0.4 + scrollProgress * 0.3}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function BackgroundElements({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <Stars 
        radius={50} 
        depth={50} 
        count={1000} 
        factor={4} 
        saturation={0.5}
        fade
        speed={0.5}
      />
      
      {/* Ambient fog effect */}
      <fog attach="fog" args={['#0a0a0f', 8, 35]} />
    </>
  );
}

export function HomeScene3D() {
  const { scrollProgress } = useScroll3D();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#070709']} />
          
          {/* Lighting */}
          <ambientLight intensity={0.15} />
          <directionalLight position={[5, 5, 5]} intensity={0.6} color="#8b5cf6" />
          <pointLight position={[-5, -5, 5]} intensity={0.4} color="#3b82f6" />
          <pointLight position={[0, 5, -5]} intensity={0.3} color="#22d3ee" />

          <BackgroundElements scrollProgress={scrollProgress} />
          <LogoSphere scrollProgress={scrollProgress} />
          <ServiceOrbs scrollProgress={scrollProgress} />
          
          {/* Section transitions */}
          <SectionMorphingShape scrollProgress={scrollProgress} />
          <TransitionParticles scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
