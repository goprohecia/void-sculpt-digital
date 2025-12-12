import { useRef, useMemo, useEffect, useState, createContext, useContext } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Context for mouse position
const MouseContext = createContext({ x: 0, y: 0 });

// Hook for mouse position
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

// Interactive floating sphere that follows mouse
function InteractiveSphere({ color, size, position, speed = 1 }: {
  color: string;
  size: number;
  position: [number, number, number];
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useContext(MouseContext);
  const targetPos = useRef(new THREE.Vector3(...position));
  
  useFrame((state) => {
    if (meshRef.current) {
      // Mouse influence
      const mouseInfluence = 0.5;
      targetPos.current.x = position[0] + mouse.x * mouseInfluence * speed;
      targetPos.current.y = position[1] + mouse.y * mouseInfluence * speed;
      
      // Smooth follow
      meshRef.current.position.lerp(targetPos.current, 0.05);
      
      // Floating animation
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.003;
      
      // Rotation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15 * speed;
    }
  });
  
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[size, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

// Central morphing orb
function CentralOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useContext(MouseContext);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Mouse-based rotation
      meshRef.current.rotation.x = mouse.y * 0.3 + state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = mouse.x * 0.3 + state.clock.elapsedTime * 0.15;
      
      // Pulse scale
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });
  
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 3]} />
        <MeshDistortMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
          distort={0.25}
          speed={2}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

// Orbiting ring
function OrbitRing({ radius, speed, color }: {
  radius: number;
  speed: number;
  color: string;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * speed;
      ringRef.current.rotation.x = Math.PI / 3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });
  
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, 0.015, 16, 100]} />
      <meshStandardMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// Floating particles that react to mouse
function FloatingParticles3D({ count }: { count: number }) {
  const mouse = useContext(MouseContext);
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorOptions = [
      new THREE.Color("#8b5cf6"),
      new THREE.Color("#06b6d4"),
      new THREE.Color("#a855f7"),
    ];
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return { positions: pos, colors: col };
  }, [count]);
  
  const pointsRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (pointsRef.current) {
      // Rotate based on mouse
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02 + mouse.x * 0.1;
      pointsRef.current.rotation.x = mouse.y * 0.05;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

// Scene component
function Scene() {
  const mouse = useMousePosition();
  
  return (
    <MouseContext.Provider value={mouse}>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[0, 0, 3]} intensity={1} color="#8b5cf6" />
      
      {/* Central element */}
      <CentralOrb />
      
      {/* Orbiting rings */}
      <OrbitRing radius={2.5} speed={0.2} color="#8b5cf6" />
      <OrbitRing radius={3.2} speed={-0.15} color="#06b6d4" />
      
      {/* Interactive spheres */}
      <InteractiveSphere color="#8b5cf6" size={0.3} position={[-3, 2, -1]} speed={1.2} />
      <InteractiveSphere color="#06b6d4" size={0.25} position={[3.5, -1, -2]} speed={0.8} />
      <InteractiveSphere color="#a855f7" size={0.2} position={[-2, -2, 0]} speed={1} />
      <InteractiveSphere color="#f43f5e" size={0.22} position={[2.5, 2, -1]} speed={0.9} />
      
      {/* Particles */}
      <FloatingParticles3D count={80} />
      <Sparkles count={50} scale={12} size={1.5} speed={0.2} color="#8b5cf6" />
      
      {/* Post-processing */}
      <EffectComposer>
        <Bloom intensity={0.6} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </MouseContext.Provider>
  );
}

// Mobile simplified scene
function MobileScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 3]} intensity={1} color="#8b5cf6" />
      
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh>
          <icosahedronGeometry args={[1.2, 2]} />
          <MeshDistortMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
            distort={0.2}
            speed={1.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>
      
      <OrbitRing radius={2} speed={0.15} color="#8b5cf6" />
      
      <Sparkles count={30} scale={10} size={2} speed={0.15} color="#8b5cf6" />
      
      <EffectComposer>
        <Bloom intensity={0.4} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </>
  );
}

export function HomeBackground3D() {
  const isMobile = useIsMobile();
  const [shouldRender, setShouldRender] = useState(true);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldRender(!mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setShouldRender(!e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  
  if (!shouldRender) {
    return (
      <div 
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.1) 0%, transparent 60%)",
        }}
      />
    );
  }
  
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{ 
          antialias: !isMobile, 
          alpha: true,
          powerPreference: isMobile ? "low-power" : "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        {isMobile ? <MobileScene /> : <Scene />}
      </Canvas>
    </div>
  );
}
