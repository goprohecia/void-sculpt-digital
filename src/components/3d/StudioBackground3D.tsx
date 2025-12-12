import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
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

// Low-poly Game Controller
function GameController({ position, scale = 1 }: { 
  position: [number, number, number]; 
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
  });
  
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} position={position} scale={scale}>
        {/* Main body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.8, 0.4, 1]} />
          <meshStandardMaterial 
            color="#1a1a2e"
            emissive="#8b5cf6"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
        
        {/* Left grip */}
        <mesh position={[-0.7, -0.1, 0.3]} rotation={[0.3, 0, -0.2]}>
          <cylinderGeometry args={[0.15, 0.2, 0.6, 8]} />
          <meshStandardMaterial 
            color="#1a1a2e"
            emissive="#8b5cf6"
            emissiveIntensity={0.15}
            metalness={0.8}
            roughness={0.4}
          />
        </mesh>
        
        {/* Right grip */}
        <mesh position={[0.7, -0.1, 0.3]} rotation={[0.3, 0, 0.2]}>
          <cylinderGeometry args={[0.15, 0.2, 0.6, 8]} />
          <meshStandardMaterial 
            color="#1a1a2e"
            emissive="#8b5cf6"
            emissiveIntensity={0.15}
            metalness={0.8}
            roughness={0.4}
          />
        </mesh>
        
        {/* D-pad */}
        <mesh position={[-0.5, 0.22, 0]}>
          <boxGeometry args={[0.3, 0.08, 0.1]} />
          <meshStandardMaterial color="#2d2d44" emissive="#06b6d4" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[-0.5, 0.22, 0]}>
          <boxGeometry args={[0.1, 0.08, 0.3]} />
          <meshStandardMaterial color="#2d2d44" emissive="#06b6d4" emissiveIntensity={0.3} />
        </mesh>
        
        {/* Action buttons */}
        <mesh position={[0.4, 0.25, -0.12]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.55, 0.25, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.4, 0.25, 0.12]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.25, 0.25, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.5} />
        </mesh>
        
        {/* Analog sticks */}
        <mesh position={[-0.2, 0.25, 0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
          <meshStandardMaterial color="#2d2d44" emissive="#8b5cf6" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0.1, 0.25, -0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
          <meshStandardMaterial color="#2d2d44" emissive="#8b5cf6" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

// Monitor/Screen Element (Dev)
function CodeMonitor({ position, scale = 1 }: { 
  position: [number, number, number]; 
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });
  
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={groupRef} position={position} scale={scale}>
        {/* Monitor frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.6, 1, 0.1]} />
          <meshStandardMaterial 
            color="#1a1a2e"
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
        
        {/* Screen */}
        <mesh ref={screenRef} position={[0, 0, 0.06]}>
          <planeGeometry args={[1.4, 0.85]} />
          <meshStandardMaterial 
            color="#0f172a"
            emissive="#8b5cf6"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Code lines on screen */}
        {[0.25, 0.1, -0.05, -0.2, -0.35].map((y, i) => (
          <mesh key={i} position={[-0.3 + i * 0.05, y, 0.07]}>
            <boxGeometry args={[0.4 + Math.random() * 0.4, 0.04, 0.01]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#8b5cf6" : "#06b6d4"}
              emissive={i % 2 === 0 ? "#8b5cf6" : "#06b6d4"}
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}
        
        {/* Stand */}
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[0.15, 0.3, 0.1]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.8, 0.1]}>
          <boxGeometry args={[0.5, 0.05, 0.3]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>
    </Float>
  );
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

// Morphing Central Sphere with section-based geometry
function MorphingSphere({ activeSection, progress }: { activeSection: number; progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  
  // Target properties for each section
  const sectionConfigs = useMemo(() => [
    { color: "#8b5cf6", distort: 0.3, speed: 2, scale: 1, detail: 1 },      // Hero - Smooth
    { color: "#10b981", distort: 0.5, speed: 3, scale: 1.2, detail: 2 },    // Vision - More distorted
    { color: "#a855f7", distort: 0.4, speed: 4, scale: 1.1, detail: 1 },    // Timeline - Dynamic
    { color: "#f43f5e", distort: 0.6, speed: 5, scale: 1.3, detail: 2 },    // CTA - Most active
  ], []);
  
  const currentConfig = useRef(sectionConfigs[0]);
  
  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      const targetConfig = sectionConfigs[activeSection];
      
      // Smooth interpolation of all properties
      currentConfig.current.distort += (targetConfig.distort - currentConfig.current.distort) * 0.03;
      currentConfig.current.speed += (targetConfig.speed - currentConfig.current.speed) * 0.03;
      currentConfig.current.scale += (targetConfig.scale - currentConfig.current.scale) * 0.03;
      
      // Update material
      materialRef.current.distort = currentConfig.current.distort;
      materialRef.current.speed = currentConfig.current.speed;
      
      // Color transition
      const targetColor = new THREE.Color(targetConfig.color);
      materialRef.current.color.lerp(targetColor, 0.03);
      materialRef.current.emissive.lerp(targetColor, 0.03);
      
      // Scale morphing
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.setScalar(currentConfig.current.scale * pulseScale);
      
      // Rotation based on section
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 + activeSection * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 + activeSection) * 0.3;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.25) * 0.1;
    }
  });
  
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 4]} />
        <MeshDistortMaterial
          ref={materialRef}
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
          distort={0.3}
          speed={2}
        />
      </mesh>
      
      {/* Inner glow sphere */}
      <mesh scale={0.8}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.6}
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}

// Camera Controller with smooth transitions
function CameraController({ activeSection, progress }: { activeSection: number; progress: number }) {
  const { camera } = useThree();
  
  const cameraPositions = useMemo(() => [
    { x: 0, y: 0, z: 8, lookY: 0 },       // Hero - Front view
    { x: 3, y: 1, z: 7, lookY: 0 },       // Vision - Angled right
    { x: -2, y: -0.5, z: 9, lookY: 0 },   // Timeline - Pulled back left
    { x: 0, y: 1.5, z: 6, lookY: -0.3 },  // CTA - Above and closer
  ], []);
  
  useFrame(() => {
    const targetPos = cameraPositions[activeSection];
    camera.position.x += (targetPos.x - camera.position.x) * 0.015;
    camera.position.y += (targetPos.y - camera.position.y) * 0.015;
    camera.position.z += (targetPos.z - camera.position.z) * 0.015;
    camera.lookAt(0, targetPos.lookY, 0);
  });
  
  return null;
}

// Dynamic Lighting based on section
function DynamicLighting({ activeSection }: { activeSection: number }) {
  const light1Ref = useRef<THREE.DirectionalLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  
  const lightConfigs = useMemo(() => [
    { main: "#8b5cf6", accent: "#06b6d4", intensity: 1 },
    { main: "#10b981", accent: "#8b5cf6", intensity: 1.2 },
    { main: "#a855f7", accent: "#f43f5e", intensity: 1.1 },
    { main: "#f43f5e", accent: "#8b5cf6", intensity: 1.3 },
  ], []);
  
  useFrame(() => {
    const config = lightConfigs[activeSection];
    
    if (light1Ref.current) {
      const targetColor = new THREE.Color(config.main);
      light1Ref.current.color.lerp(targetColor, 0.02);
      light1Ref.current.intensity += (config.intensity - light1Ref.current.intensity) * 0.02;
    }
    
    if (light2Ref.current) {
      const targetColor = new THREE.Color(config.accent);
      light2Ref.current.color.lerp(targetColor, 0.02);
    }
  });
  
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight 
        ref={light1Ref}
        position={[5, 5, 5]} 
        intensity={1} 
        color="#8b5cf6"
      />
      <directionalLight 
        position={[-5, -5, -5]} 
        intensity={0.4} 
        color="#06b6d4"
      />
      <pointLight 
        ref={light2Ref}
        position={[0, 0, 3]} 
        intensity={1.5} 
        color="#8b5cf6" 
      />
    </>
  );
}

// Main Scene
function Scene() {
  const { progress, activeSection } = useScrollProgress();
  
  return (
    <>
      {/* Dynamic Lighting */}
      <DynamicLighting activeSection={activeSection} />
      
      {/* Camera Controller */}
      <CameraController activeSection={activeSection} progress={progress} />
      
      {/* Central Morphing Sphere */}
      <MorphingSphere activeSection={activeSection} progress={progress} />
      
      {/* Orbiting Rings */}
      <OrbitRing radius={2.5} speed={0.3} color="#8b5cf6" />
      <OrbitRing radius={3} speed={-0.2} color="#06b6d4" thickness={0.015} />
      <OrbitRing radius={3.5} speed={0.15} color="#a855f7" thickness={0.01} />
      
      {/* Game Controller - Main Interactive Element */}
      <GameController position={[4.5, 1.5, -2]} scale={0.8} />
      <GameController position={[-5, -1, -3]} scale={0.6} />
      
      {/* Code Monitor */}
      <CodeMonitor position={[-4, 2, -3]} scale={0.7} />
      <CodeMonitor position={[5, -2, -4]} scale={0.5} />
      
      {/* Keyboard Keys - Dev Theme */}
      <KeyboardKey position={[-3, -2.5, -1]} color="#8b5cf6" scale={0.6} />
      <KeyboardKey position={[3.5, 2.5, -2]} color="#10b981" scale={0.5} />
      
      {/* Voxel Cubes - Gaming Theme */}
      <VoxelCube position={[5, 1, -2]} color="#06b6d4" delay={0} />
      <VoxelCube position={[-5, 0, -1]} color="#8b5cf6" delay={1} />
      <VoxelCube position={[3, 3, -4]} color="#a855f7" delay={2} />
      <VoxelCube position={[-4, -3, -2]} color="#10b981" delay={3} />
      <VoxelCube position={[6, -2, -3]} color="#f43f5e" delay={1.5} />
      <VoxelCube position={[-6, 2, -2]} color="#eab308" delay={2.5} />
      
      {/* Data Particles */}
      <DataParticles count={150} color="#8b5cf6" />
      
      {/* Sparkles */}
      <Sparkles 
        count={80}
        scale={15}
        size={2}
        speed={0.3}
        color="#8b5cf6"
      />
      
      {/* Grid Floor */}
      <gridHelper 
        args={[30, 30, "#8b5cf6", "#1e1b4b"]} 
        position={[0, -5, 0]}
      />
      
      {/* Post-processing */}
      <EffectComposer>
        <Bloom 
          intensity={0.8}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
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
