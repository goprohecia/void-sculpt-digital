import { useRef, useMemo, useEffect, useState, createContext, useContext } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles, Trail } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Context for mobile optimization
const MobileContext = createContext(false);

// Context for mouse position
const MouseContext = createContext({ x: 0, y: 0 });

// Hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  return isMobile;
}

// Hook for mouse position (normalized -1 to 1)
function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  return mouse;
}

// Hook pour synchroniser avec le scroll
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const lastScrollTop = useRef(0);
  const lastTime = useRef(Date.now());
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollTop / docHeight, 1);
      
      // Calculate scroll velocity
      const now = Date.now();
      const dt = Math.max(now - lastTime.current, 1);
      const velocity = Math.abs(scrollTop - lastScrollTop.current) / dt;
      setScrollVelocity(Math.min(velocity * 10, 1)); // Normalize to 0-1
      
      lastScrollTop.current = scrollTop;
      lastTime.current = now;
      
      setProgress(scrollProgress);
      
      const sectionIndex = Math.floor(scrollProgress * 4);
      setActiveSection(Math.min(sectionIndex, 3));
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return { progress, activeSection, scrollVelocity };
}

// Trailing Orb with luminous trail
function TrailingOrb({ 
  position, 
  color, 
  speed = 1,
  radius = 0.15 
}: { 
  position: [number, number, number]; 
  color: string;
  speed?: number;
  radius?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isMobile = useContext(MobileContext);
  
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * speed;
      meshRef.current.position.x = position[0] + Math.sin(t) * 2;
      meshRef.current.position.y = position[1] + Math.cos(t * 0.7) * 1.5;
      meshRef.current.position.z = position[2] + Math.sin(t * 0.5) * 1;
    }
  });
  
  if (isMobile) {
    // Simplified version without trail for mobile
    return (
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[radius, 8, 8]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </mesh>
    );
  }
  
  return (
    <Trail
      width={1}
      length={8}
      color={new THREE.Color(color)}
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </mesh>
    </Trail>
  );
}

// Low-poly Game Controller with Trail
function GameController({ position, scale = 1 }: { 
  position: [number, number, number]; 
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Mesh>(null);
  const isMobile = useContext(MobileContext);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
    if (trailRef.current) {
      trailRef.current.position.copy(groupRef.current?.position || new THREE.Vector3());
    }
  });
  
  const controllerContent = (
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
      
      {/* Grips - simplified on mobile */}
      {!isMobile && (
        <>
          <mesh position={[-0.7, -0.1, 0.3]} rotation={[0.3, 0, -0.2]}>
            <cylinderGeometry args={[0.15, 0.2, 0.6, 8]} />
            <meshStandardMaterial color="#1a1a2e" emissive="#8b5cf6" emissiveIntensity={0.15} metalness={0.8} roughness={0.4} />
          </mesh>
          <mesh position={[0.7, -0.1, 0.3]} rotation={[0.3, 0, 0.2]}>
            <cylinderGeometry args={[0.15, 0.2, 0.6, 8]} />
            <meshStandardMaterial color="#1a1a2e" emissive="#8b5cf6" emissiveIntensity={0.15} metalness={0.8} roughness={0.4} />
          </mesh>
        </>
      )}
      
      {/* Action buttons */}
      <mesh position={[0.4, 0.25, -0.12]}>
        <sphereGeometry args={[0.08, isMobile ? 6 : 8, isMobile ? 6 : 8]} />
        <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.55, 0.25, 0]}>
        <sphereGeometry args={[0.08, isMobile ? 6 : 8, isMobile ? 6 : 8]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.4, 0.25, 0.12]}>
        <sphereGeometry args={[0.08, isMobile ? 6 : 8, isMobile ? 6 : 8]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.25, 0.25, 0]}>
        <sphereGeometry args={[0.08, isMobile ? 6 : 8, isMobile ? 6 : 8]} />
        <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.5} />
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
    </group>
  );
  
  if (isMobile) {
    return <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>{controllerContent}</Float>;
  }
  
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      {controllerContent}
    </Float>
  );
}

// Simplified Code Monitor for mobile
function CodeMonitor({ position, scale = 1 }: { 
  position: [number, number, number]; 
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const isMobile = useContext(MobileContext);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
    if (screenRef.current && !isMobile) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });
  
  const codeLines = isMobile ? 3 : 5;
  
  return (
    <Float speed={isMobile ? 0.8 : 1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={groupRef} position={position} scale={scale}>
        {/* Monitor frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.6, 1, 0.1]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.3} />
        </mesh>
        
        {/* Screen */}
        <mesh ref={screenRef} position={[0, 0, 0.06]}>
          <planeGeometry args={[1.4, 0.85]} />
          <meshStandardMaterial color="#0f172a" emissive="#8b5cf6" emissiveIntensity={0.3} />
        </mesh>
        
        {/* Code lines */}
        {Array.from({ length: codeLines }).map((_, i) => (
          <mesh key={i} position={[-0.3 + i * 0.05, 0.25 - i * 0.15, 0.07]}>
            <boxGeometry args={[0.4 + (i % 3) * 0.2, 0.04, 0.01]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#8b5cf6" : "#06b6d4"}
              emissive={i % 2 === 0 ? "#8b5cf6" : "#06b6d4"}
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}
        
        {/* Stand - only on desktop */}
        {!isMobile && (
          <>
            <mesh position={[0, -0.6, 0]}>
              <boxGeometry args={[0.15, 0.3, 0.1]} />
              <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.8, 0.1]}>
              <boxGeometry args={[0.5, 0.05, 0.3]} />
              <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.3} />
            </mesh>
          </>
        )}
      </group>
    </Float>
  );
}

// Voxel Cube with optional trail
function VoxelCube({ position, color, delay = 0, hasTrail = false }: { 
  position: [number, number, number]; 
  color: string;
  delay?: number;
  hasTrail?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isMobile = useContext(MobileContext);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay;
      meshRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.2;
      meshRef.current.rotation.x = time * 0.3;
      meshRef.current.rotation.z = time * 0.2;
    }
  });
  
  const cube = (
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
  
  if (hasTrail && !isMobile) {
    return (
      <Trail
        width={0.5}
        length={5}
        color={new THREE.Color(color)}
        attenuation={(t) => t * t}
      >
        {cube}
      </Trail>
    );
  }
  
  return cube;
}

// Orbiting Ring
function OrbitRing({ radius, speed, color, thickness = 0.02 }: {
  radius: number;
  speed: number;
  color: string;
  thickness?: number;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const isMobile = useContext(MobileContext);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * speed;
      ringRef.current.rotation.x = Math.PI / 4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });
  
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, thickness, isMobile ? 8 : 16, isMobile ? 50 : 100]} />
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

// Scroll-Reactive Particles
function ScrollReactiveParticles({ count, color, scrollVelocity }: { 
  count: number; 
  color: string;
  scrollVelocity: number;
}) {
  const isMobile = useContext(MobileContext);
  const mouse = useContext(MouseContext);
  const actualCount = isMobile ? Math.floor(count / 3) : count;
  
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(actualCount * 3);
    const vel = new Float32Array(actualCount * 3);
    for (let i = 0; i < actualCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return { positions: pos, velocities: vel };
  }, [actualCount]);
  
  const pointsRef = useRef<THREE.Points>(null);
  const positionsRef = useRef(positions);
  
  useFrame((state) => {
    if (pointsRef.current) {
      const geometry = pointsRef.current.geometry;
      const posAttr = geometry.attributes.position;
      
      // Animate particles based on scroll velocity and mouse
      for (let i = 0; i < actualCount; i++) {
        const idx = i * 3;
        
        // Base movement
        positionsRef.current[idx] += velocities[idx] * (1 + scrollVelocity * 5);
        positionsRef.current[idx + 1] += velocities[idx + 1] * (1 + scrollVelocity * 5);
        positionsRef.current[idx + 2] += velocities[idx + 2];
        
        // Mouse influence (desktop only)
        if (!isMobile) {
          const dx = mouse.x * 5 - positionsRef.current[idx];
          const dy = mouse.y * 5 - positionsRef.current[idx + 1];
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 5) {
            positionsRef.current[idx] += dx * 0.001;
            positionsRef.current[idx + 1] += dy * 0.001;
          }
        }
        
        // Wrap around bounds
        if (Math.abs(positionsRef.current[idx]) > 10) positionsRef.current[idx] *= -0.9;
        if (Math.abs(positionsRef.current[idx + 1]) > 10) positionsRef.current[idx + 1] *= -0.9;
        if (Math.abs(positionsRef.current[idx + 2]) > 5) positionsRef.current[idx + 2] *= -0.9;
        
        posAttr.setXYZ(i, positionsRef.current[idx], positionsRef.current[idx + 1], positionsRef.current[idx + 2]);
      }
      
      posAttr.needsUpdate = true;
      
      // Global rotation
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={actualCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.08 : 0.05 + scrollVelocity * 0.1}
        color={color}
        transparent
        opacity={0.6 + scrollVelocity * 0.3}
        sizeAttenuation
      />
    </points>
  );
}

// Interactive element that reacts to mouse
function InteractiveOrb({ position, color, size = 0.3 }: {
  position: [number, number, number];
  color: string;
  size?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useContext(MouseContext);
  const isMobile = useContext(MobileContext);
  const targetScale = useRef(1);
  const targetEmissive = useRef(0.5);
  
  useFrame((state) => {
    if (meshRef.current && !isMobile) {
      // Convert mouse to 3D space approximation
      const mouseX = mouse.x * 8;
      const mouseY = mouse.y * 5;
      
      const dx = mouseX - meshRef.current.position.x;
      const dy = mouseY - meshRef.current.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Scale up when mouse is near
      if (dist < 3) {
        targetScale.current = 1.5 - dist * 0.15;
        targetEmissive.current = 1 - dist * 0.15;
        
        // Move slightly toward mouse
        meshRef.current.position.x += dx * 0.01;
        meshRef.current.position.y += dy * 0.01;
      } else {
        targetScale.current = 1;
        targetEmissive.current = 0.5;
        
        // Return to original position
        meshRef.current.position.x += (position[0] - meshRef.current.position.x) * 0.02;
        meshRef.current.position.y += (position[1] - meshRef.current.position.y) * 0.02;
      }
      
      // Smooth scale transition
      const currentScale = meshRef.current.scale.x;
      meshRef.current.scale.setScalar(currentScale + (targetScale.current - currentScale) * 0.1);
      
      // Update emissive
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity += (targetEmissive.current - material.emissiveIntensity) * 0.1;
      
      // Floating animation
      meshRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, isMobile ? 12 : 24, isMobile ? 12 : 24]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// Morphing Central Sphere
function MorphingSphere({ activeSection, progress }: { activeSection: number; progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const isMobile = useContext(MobileContext);
  
  const sectionConfigs = useMemo(() => [
    { color: "#8b5cf6", distort: isMobile ? 0.2 : 0.3, speed: 2, scale: 1 },
    { color: "#10b981", distort: isMobile ? 0.3 : 0.5, speed: 3, scale: 1.2 },
    { color: "#a855f7", distort: isMobile ? 0.25 : 0.4, speed: 4, scale: 1.1 },
    { color: "#f43f5e", distort: isMobile ? 0.35 : 0.6, speed: 5, scale: 1.3 },
  ], [isMobile]);
  
  const currentConfig = useRef(sectionConfigs[0]);
  
  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      const targetConfig = sectionConfigs[activeSection];
      
      currentConfig.current.distort += (targetConfig.distort - currentConfig.current.distort) * 0.03;
      currentConfig.current.speed += (targetConfig.speed - currentConfig.current.speed) * 0.03;
      currentConfig.current.scale += (targetConfig.scale - currentConfig.current.scale) * 0.03;
      
      materialRef.current.distort = currentConfig.current.distort;
      materialRef.current.speed = currentConfig.current.speed;
      
      const targetColor = new THREE.Color(targetConfig.color);
      materialRef.current.color.lerp(targetColor, 0.03);
      materialRef.current.emissive.lerp(targetColor, 0.03);
      
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.setScalar(currentConfig.current.scale * pulseScale);
      
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 + activeSection * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 + activeSection) * 0.3;
    }
  });
  
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, isMobile ? 2 : 4]} />
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
      
      {!isMobile && (
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
      )}
    </Float>
  );
}

// Camera Controller
function CameraController({ activeSection, progress }: { activeSection: number; progress: number }) {
  const { camera } = useThree();
  const isMobile = useContext(MobileContext);
  
  const cameraPositions = useMemo(() => isMobile ? [
    { x: 0, y: 0, z: 10, lookY: 0 },
    { x: 2, y: 0.5, z: 9, lookY: 0 },
    { x: -1, y: 0, z: 11, lookY: 0 },
    { x: 0, y: 1, z: 8, lookY: 0 },
  ] : [
    { x: 0, y: 0, z: 8, lookY: 0 },
    { x: 3, y: 1, z: 7, lookY: 0 },
    { x: -2, y: -0.5, z: 9, lookY: 0 },
    { x: 0, y: 1.5, z: 6, lookY: -0.3 },
  ], [isMobile]);
  
  useFrame(() => {
    const targetPos = cameraPositions[activeSection];
    const lerpSpeed = isMobile ? 0.01 : 0.015;
    camera.position.x += (targetPos.x - camera.position.x) * lerpSpeed;
    camera.position.y += (targetPos.y - camera.position.y) * lerpSpeed;
    camera.position.z += (targetPos.z - camera.position.z) * lerpSpeed;
    camera.lookAt(0, targetPos.lookY, 0);
  });
  
  return null;
}

// Dynamic Lighting
function DynamicLighting({ activeSection }: { activeSection: number }) {
  const light1Ref = useRef<THREE.DirectionalLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const isMobile = useContext(MobileContext);
  
  const lightConfigs = useMemo(() => [
    { main: "#8b5cf6", accent: "#06b6d4", intensity: isMobile ? 0.8 : 1 },
    { main: "#10b981", accent: "#8b5cf6", intensity: isMobile ? 1 : 1.2 },
    { main: "#a855f7", accent: "#f43f5e", intensity: isMobile ? 0.9 : 1.1 },
    { main: "#f43f5e", accent: "#8b5cf6", intensity: isMobile ? 1.1 : 1.3 },
  ], [isMobile]);
  
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
      <ambientLight intensity={isMobile ? 0.4 : 0.3} />
      <directionalLight ref={light1Ref} position={[5, 5, 5]} intensity={1} color="#8b5cf6" />
      {!isMobile && <directionalLight position={[-5, -5, -5]} intensity={0.4} color="#06b6d4" />}
      <pointLight ref={light2Ref} position={[0, 0, 3]} intensity={isMobile ? 1 : 1.5} color="#8b5cf6" />
    </>
  );
}

// Main Scene - Desktop
function DesktopScene() {
  const { progress, activeSection, scrollVelocity } = useScrollProgress();
  const mouse = useMousePosition();
  
  return (
    <MouseContext.Provider value={mouse}>
      <DynamicLighting activeSection={activeSection} />
      <CameraController activeSection={activeSection} progress={progress} />
      <MorphingSphere activeSection={activeSection} progress={progress} />
      
      {/* Orbiting Rings */}
      <OrbitRing radius={2.5} speed={0.3} color="#8b5cf6" />
      <OrbitRing radius={3} speed={-0.2} color="#06b6d4" thickness={0.015} />
      <OrbitRing radius={3.5} speed={0.15} color="#a855f7" thickness={0.01} />
      
      {/* Interactive Orbs - React to mouse */}
      <InteractiveOrb position={[-5, 2, -1]} color="#8b5cf6" size={0.4} />
      <InteractiveOrb position={[5, -1, -2]} color="#06b6d4" size={0.35} />
      <InteractiveOrb position={[-3, -2, 0]} color="#f43f5e" size={0.3} />
      <InteractiveOrb position={[4, 3, -1]} color="#10b981" size={0.35} />
      
      {/* Trailing Orbs */}
      <TrailingOrb position={[3, 2, -1]} color="#8b5cf6" speed={0.8} />
      <TrailingOrb position={[-4, 1, -2]} color="#06b6d4" speed={1.2} />
      <TrailingOrb position={[2, -2, -1]} color="#f43f5e" speed={0.6} />
      <TrailingOrb position={[-3, -1, 0]} color="#10b981" speed={1} />
      
      {/* Game Controllers */}
      <GameController position={[4.5, 1.5, -2]} scale={0.8} />
      <GameController position={[-5, -1, -3]} scale={0.6} />
      
      {/* Code Monitors */}
      <CodeMonitor position={[-4, 2, -3]} scale={0.7} />
      <CodeMonitor position={[5, -2, -4]} scale={0.5} />
      
      {/* Voxel Cubes with trails */}
      <VoxelCube position={[5, 1, -2]} color="#06b6d4" delay={0} hasTrail />
      <VoxelCube position={[-5, 0, -1]} color="#8b5cf6" delay={1} hasTrail />
      <VoxelCube position={[3, 3, -4]} color="#a855f7" delay={2} />
      <VoxelCube position={[-4, -3, -2]} color="#10b981" delay={3} />
      <VoxelCube position={[6, -2, -3]} color="#f43f5e" delay={1.5} hasTrail />
      
      {/* Scroll-Reactive Particles */}
      <ScrollReactiveParticles count={150} color="#8b5cf6" scrollVelocity={scrollVelocity} />
      <Sparkles count={80} scale={15} size={2} speed={0.3 + scrollVelocity * 0.5} color="#8b5cf6" />
      
      {/* Grid */}
      <gridHelper args={[30, 30, "#8b5cf6", "#1e1b4b"]} position={[0, -5, 0]} />
      
      {/* Post-processing */}
      <EffectComposer>
        <Bloom intensity={0.8 + scrollVelocity * 0.3} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </MouseContext.Provider>
  );
}

// Main Scene - Mobile (simplified)
function MobileScene() {
  const { progress, activeSection, scrollVelocity } = useScrollProgress();
  
  return (
    <MouseContext.Provider value={{ x: 0, y: 0 }}>
      <DynamicLighting activeSection={activeSection} />
      <CameraController activeSection={activeSection} progress={progress} />
      <MorphingSphere activeSection={activeSection} progress={progress} />
      
      {/* Fewer orbiting rings */}
      <OrbitRing radius={2.5} speed={0.3} color="#8b5cf6" />
      <OrbitRing radius={3} speed={-0.2} color="#06b6d4" thickness={0.015} />
      
      {/* Fewer trailing orbs */}
      <TrailingOrb position={[3, 2, -1]} color="#8b5cf6" speed={0.8} />
      <TrailingOrb position={[-3, -1, 0]} color="#10b981" speed={1} />
      
      {/* Single controller */}
      <GameController position={[3, 1, -2]} scale={0.6} />
      
      {/* Fewer cubes */}
      <VoxelCube position={[4, 1, -2]} color="#06b6d4" delay={0} />
      <VoxelCube position={[-4, 0, -1]} color="#8b5cf6" delay={1} />
      
      {/* Reduced scroll-reactive particles */}
      <ScrollReactiveParticles count={50} color="#8b5cf6" scrollVelocity={scrollVelocity} />
      <Sparkles count={30} scale={12} size={3} speed={0.2} color="#8b5cf6" />
      
      {/* Post-processing with lighter bloom */}
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </MouseContext.Provider>
  );
}

interface StudioBackground3DProps {
  reducedMotion?: boolean;
}

export function StudioBackground3D({ reducedMotion = false }: StudioBackground3DProps) {
  const [shouldRender, setShouldRender] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldRender(!mediaQuery.matches && !reducedMotion);
    
    const handler = (e: MediaQueryListEvent) => setShouldRender(!e.matches && !reducedMotion);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [reducedMotion]);
  
  if (!shouldRender) {
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
      <MobileContext.Provider value={isMobile}>
        <Canvas
          camera={{ position: [0, 0, isMobile ? 10 : 8], fov: 60 }}
          dpr={isMobile ? [1, 1] : [1, 1.5]}
          gl={{ 
            antialias: !isMobile, 
            alpha: true,
            powerPreference: isMobile ? "low-power" : "high-performance",
          }}
          style={{ background: "transparent" }}
          frameloop={isMobile ? "demand" : "always"}
        >
          {isMobile ? <MobileScene /> : <DesktopScene />}
        </Canvas>
      </MobileContext.Provider>
    </div>
  );
}
