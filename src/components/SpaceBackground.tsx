import { useEffect, useRef, useState } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  color: string;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color1: string;
  color2: string;
  rotation: number;
  rotationSpeed: number;
}

interface Aurora {
  y: number;
  amplitude: number;
  frequency: number;
  speed: number;
  color: string;
  offset: number;
}

interface Galaxy {
  x: number;
  y: number;
  radius: number;
  arms: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(false);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const aurorasRef = useRef<Aurora[]>([]);
  const galaxiesRef = useRef<Galaxy[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    
    checkDark();
    
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ["class"] 
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isDark) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initElements();
    };

    const starColors = [
      "255, 255, 255",
      "255, 245, 238",
      "230, 240, 255",
      "255, 230, 200",
      "210, 225, 255",
    ];

    const initElements = () => {
      // Initialize stars - dense like deep space
      const starCount = Math.floor((canvas.width * canvas.height) / 2500);
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.2,
        opacity: Math.random() * 0.85 + 0.15,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      }));

      // Initialize nebulae - more subtle
      nebulaeRef.current = [
        {
          x: canvas.width * 0.15,
          y: canvas.height * 0.25,
          radius: Math.min(canvas.width, canvas.height) * 0.35,
          color1: "rgba(139, 92, 246, 0.015)",
          color2: "rgba(59, 130, 246, 0.01)",
          rotation: 0,
          rotationSpeed: 0.0001,
        },
        {
          x: canvas.width * 0.85,
          y: canvas.height * 0.75,
          radius: Math.min(canvas.width, canvas.height) * 0.3,
          color1: "rgba(236, 72, 153, 0.012)",
          color2: "rgba(139, 92, 246, 0.008)",
          rotation: Math.PI,
          rotationSpeed: -0.00008,
        },
      ];

      // Initialize galaxies
      galaxiesRef.current = [
        {
          x: canvas.width * 0.75,
          y: canvas.height * 0.2,
          radius: 60,
          arms: 2,
          rotation: 0,
          rotationSpeed: 0.0003,
          color: "rgba(139, 92, 246, ",
          opacity: 0.15,
        },
        {
          x: canvas.width * 0.2,
          y: canvas.height * 0.7,
          radius: 45,
          arms: 2,
          rotation: Math.PI / 4,
          rotationSpeed: -0.0002,
          color: "rgba(99, 102, 241, ",
          opacity: 0.12,
        },
        {
          x: canvas.width * 0.6,
          y: canvas.height * 0.55,
          radius: 35,
          arms: 2,
          rotation: Math.PI / 2,
          rotationSpeed: 0.00025,
          color: "rgba(34, 211, 238, ",
          opacity: 0.1,
        },
      ];

      // Initialize auroras - very subtle
      aurorasRef.current = [
        {
          y: canvas.height * 0.12,
          amplitude: 20,
          frequency: 0.002,
          speed: 0.0003,
          color: "rgba(34, 211, 238, 0.04)",
          offset: 0,
        },
        {
          y: canvas.height * 0.18,
          amplitude: 15,
          frequency: 0.003,
          speed: 0.0004,
          color: "rgba(139, 92, 246, 0.03)",
          offset: Math.PI / 3,
        },
      ];
    };

    const shootingStarColors = [
      "rgba(255, 255, 255, ",
      "rgba(139, 92, 246, ",
      "rgba(99, 102, 241, ",
      "rgba(34, 211, 238, ",
    ];

    const createShootingStar = (): ShootingStar => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.4,
      length: Math.random() * 100 + 50,
      speed: Math.random() * 10 + 6,
      angle: (Math.random() * 30 + 15) * (Math.PI / 180),
      opacity: 1,
      color: shootingStarColors[Math.floor(Math.random() * shootingStarColors.length)],
    });

    let time = 0;

    const drawNebula = (nebula: Nebula) => {
      ctx.save();
      ctx.translate(nebula.x, nebula.y);
      ctx.rotate(nebula.rotation);

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, nebula.radius);
      gradient.addColorStop(0, nebula.color1);
      gradient.addColorStop(0.5, nebula.color2);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, nebula.radius, nebula.radius * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawGalaxy = (galaxy: Galaxy) => {
      ctx.save();
      ctx.translate(galaxy.x, galaxy.y);
      ctx.rotate(galaxy.rotation);

      // Draw spiral arms
      for (let arm = 0; arm < galaxy.arms; arm++) {
        const armAngle = (arm * Math.PI * 2) / galaxy.arms;
        
        for (let i = 0; i < 80; i++) {
          const t = i / 80;
          const spiralAngle = armAngle + t * Math.PI * 2.5;
          const distance = t * galaxy.radius;
          
          const x = Math.cos(spiralAngle) * distance;
          const y = Math.sin(spiralAngle) * distance * 0.4; // Elliptical
          
          const starSize = (1 - t * 0.7) * 1.5;
          const starOpacity = (1 - t * 0.8) * galaxy.opacity;
          
          ctx.beginPath();
          ctx.arc(x, y, starSize, 0, Math.PI * 2);
          ctx.fillStyle = `${galaxy.color}${starOpacity})`;
          ctx.fill();
        }
      }

      // Core glow
      const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.radius * 0.3);
      coreGradient.addColorStop(0, `${galaxy.color}${galaxy.opacity * 0.4})`);
      coreGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(0, 0, galaxy.radius * 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawAurora = (aurora: Aurora, time: number) => {
      ctx.beginPath();
      ctx.moveTo(0, aurora.y);

      for (let x = 0; x <= canvas.width; x += 8) {
        const y = aurora.y + 
          Math.sin(x * aurora.frequency + time * aurora.speed * 1000 + aurora.offset) * aurora.amplitude +
          Math.sin(x * aurora.frequency * 1.5 + time * aurora.speed * 500) * (aurora.amplitude * 0.3);
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, 0, 0, aurora.y + aurora.amplitude * 2);
      gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradient.addColorStop(0.7, aurora.color);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const animate = () => {
      // Pure black space background
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      time += 0.016;

      // Draw nebulae (background layer)
      nebulaeRef.current.forEach((nebula) => {
        nebula.rotation += nebula.rotationSpeed;
        drawNebula(nebula);
      });

      // Draw galaxies
      galaxiesRef.current.forEach((galaxy) => {
        galaxy.rotation += galaxy.rotationSpeed;
        drawGalaxy(galaxy);
      });

      // Draw auroras
      aurorasRef.current.forEach((aurora) => {
        drawAurora(aurora, time);
      });

      // Draw stars with twinkling
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.4 + 0.6;
        const finalOpacity = star.opacity * twinkle;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${finalOpacity})`;
        ctx.fill();

        // Glow for brighter stars
        if (star.size > 0.8 && star.opacity > 0.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${star.color}, ${finalOpacity * 0.15})`;
          ctx.fill();
        }
      });

      // Shooting stars
      if (Math.random() < 0.003) {
        shootingStarsRef.current.push(createShootingStar());
      }

      shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.opacity -= 0.012;

        if (star.opacity > 0) {
          const gradient = ctx.createLinearGradient(
            star.x,
            star.y,
            star.x - Math.cos(star.angle) * star.length,
            star.y - Math.sin(star.angle) * star.length
          );
          gradient.addColorStop(0, `${star.color}${star.opacity})`);
          gradient.addColorStop(1, `${star.color}0)`);

          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(
            star.x - Math.cos(star.angle) * star.length,
            star.y - Math.sin(star.angle) * star.length
          );
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Glow at head
          ctx.beginPath();
          ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `${star.color}${star.opacity})`;
          ctx.fill();

          return true;
        }
        return false;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDark]);

  if (!isDark) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
}
