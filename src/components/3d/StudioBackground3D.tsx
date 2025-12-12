import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles, Trail } from "@react-three/drei";
import * as THREE from "three";

// Hook pour synchroniser avec le scroll
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollTop / docHeight, 1);
      setProgress(scrollProgress);
      
      // 4 sections principales
      const sectionIndex = Math.floor(scrollProgress * 4);
      setActiveSection(Math.min(sectionIndex, 3));
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return { progress, activeSection };
}

// Keyboard Key 3D Component
function KeyboardKey({ position, rotation, color, scale = 1 }: { 
  position: [number, number, number]; 
  rotation?: [number, number, number];
  color: string;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <boxGeometry args={[0.8, 0.3, 0.8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

// Voxel Cube Component (Gaming Element)
function VoxelCube({ position, color, delay = 0 }: { 
  position: [number, number, number]; 
  color: string;
  delay?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay;
      meshRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.2;
      meshRef.current.rotation.x = time * 0.3;
      meshRef.current.rotation.z = time * 0.2;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// Code Lines (Dev Element)
function CodeLine({ position, width, color }: { 
  position: [number, number, number]; 
  width: number;
  color: string;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={[width, 0.05, 0.02]} />
      <meshStandardMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// Orbiting Ring (Gaming/Tech Element)
function OrbitRing({ radius, speed, color, thickness = 0.02 }: {
  radius: number;
  speed: number;
  color: string;
  thickness?: number;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * speed;
      ringRef.current.rotation.x = Math.PI / 4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });
  
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, thickness, 16, 100]} />
      <meshStandardMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

// Data Particles
function DataParticles({ count, color }: { count: number; color: string }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);
  
  const pointsRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Central Sphere (Main Element)
function CentralSphere({ activeSection, progress }: { activeSection: number; progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const sectionColors = useMemo(() => [
    "#8b5cf6", // violet - Hero
    "#10b981", // emerald - Vision
    "#a855f7", // purple - Timeline
    "#f43f5e", // rose - Values/CTA
  ], []);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Smooth color transition
      const targetColor = new THREE.Color(sectionColors[activeSection]);
      const currentMaterial = meshRef.current.material as THREE.MeshStandardMaterial;
      currentMaterial.color.lerp(targetColor, 0.05);
      currentMaterial.emissive.lerp(targetColor, 0.05);
      
      // Scale based on progress
      const scale = 1 + progress * 0.3;
      meshRef.current.scale.setScalar(scale);
      
      // Rotation
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });
  
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <MeshDistortMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

// Camera Controller
function CameraController({ activeSection, progress }: { activeSection: number; progress: number }) {
  const { camera } = useThree();
  
  const cameraPositions = useMemo(() => [
    { x: 0, y: 0, z: 8 },      // Hero - Front view
    { x: 3, y: 1, z: 7 },      // Vision - Angled right
    { x: -2, y: -1, z: 9 },    // Timeline - Pulled back left
    { x: 0, y: 2, z: 6 },      // CTA - Above and closer
  ], []);
  
  useFrame(() => {
    const targetPos = cameraPositions[activeSection];
    camera.position.x += (targetPos.x - camera.position.x) * 0.02;
    camera.position.y += (targetPos.y - camera.position.y) * 0.02;
    camera.position.z += (targetPos.z - camera.position.z) * 0.02;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// Main Scene
function Scene() {
  const { progress, activeSection } = useScrollProgress();
  
  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={0.3} />
      
      {/* Directional Lights - change based on section */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.8} 
        color="#8b5cf6"
      />
      <directionalLight 
        position={[-5, -5, -5]} 
        intensity={0.4} 
        color="#06b6d4"
      />
      
      {/* Point lights for glow */}
      <pointLight position={[0, 0, 3]} intensity={1} color="#8b5cf6" />
      
      {/* Camera Controller */}
      <CameraController activeSection={activeSection} progress={progress} />
      
      {/* Central Sphere */}
      <CentralSphere activeSection={activeSection} progress={progress} />
      
      {/* Orbiting Rings */}
      <OrbitRing radius={2.5} speed={0.3} color="#8b5cf6" />
      <OrbitRing radius={3} speed={-0.2} color="#06b6d4" thickness={0.015} />
      <OrbitRing radius={3.5} speed={0.15} color="#a855f7" thickness={0.01} />
      
      {/* Keyboard Keys - Dev Theme */}
      <KeyboardKey position={[-4, 2, -2]} color="#8b5cf6" scale={0.8} />
      <KeyboardKey position={[4, -1.5, -3]} color="#10b981" scale={0.6} />
      <KeyboardKey position={[-3, -2, -1]} color="#f43f5e" scale={0.5} />
      
      {/* Voxel Cubes - Gaming Theme */}
      <VoxelCube position={[5, 1, -2]} color="#06b6d4" delay={0} />
      <VoxelCube position={[-5, 0, -1]} color="#8b5cf6" delay={1} />
      <VoxelCube position={[3, 3, -4]} color="#a855f7" delay={2} />
      <VoxelCube position={[-4, -3, -2]} color="#10b981" delay={3} />
      <VoxelCube position={[6, -2, -3]} color="#f43f5e" delay={1.5} />
      
      {/* Code Lines - Dev Theme */}
      <group position={[-6, 0, -5]}>
        <CodeLine position={[0, 0.3, 0]} width={1.5} color="#8b5cf6" />
        <CodeLine position={[0.3, 0, 0]} width={2} color="#06b6d4" />
        <CodeLine position={[-0.2, -0.3, 0]} width={1.2} color="#a855f7" />
        <CodeLine position={[0.5, -0.6, 0]} width={1.8} color="#10b981" />
      </group>
      
      <group position={[6, 1, -4]}>
        <CodeLine position={[0, 0.3, 0]} width={1.8} color="#06b6d4" />
        <CodeLine position={[-0.3, 0, 0]} width={1.3} color="#8b5cf6" />
        <CodeLine position={[0.2, -0.3, 0]} width={2} color="#f43f5e" />
      </group>
      
      {/* Data Particles */}
      <DataParticles count={200} color="#8b5cf6" />
      
      {/* Sparkles */}
      <Sparkles 
        count={100}
        scale={15}
        size={2}
        speed={0.3}
        color="#8b5cf6"
      />
      
      {/* Grid Floor */}
      <gridHelper 
        args={[30, 30, "#8b5cf6", "#1e1b4b"]} 
        position={[0, -5, 0]}
        rotation={[0, 0, 0]}
      />
    </>
  );
}

interface StudioBackground3DProps {
  reducedMotion?: boolean;
}

export function StudioBackground3D({ reducedMotion = false }: StudioBackground3DProps) {
  const [shouldRender, setShouldRender] = useState(true);
  
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldRender(!mediaQuery.matches && !reducedMotion);
    
    const handler = (e: MediaQueryListEvent) => setShouldRender(!e.matches && !reducedMotion);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [reducedMotion]);
  
  if (!shouldRender) {
    // Fallback: static gradient background
    return (
      <div 
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
        }}
      />
    );
  }
  
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
