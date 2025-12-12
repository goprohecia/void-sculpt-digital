import { useEffect, useRef, useState } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
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
  opacity: number;
}

interface Aurora {
  points: { x: number; y: number; offset: number }[];
  color: string;
  opacity: number;
  speed: number;
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(false);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const nebulasRef = useRef<Nebula[]>([]);
  const aurorasRef = useRef<Aurora[]>([]);
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

    const initElements = () => {
      // Stars
      const starCount = Math.floor((canvas.width * canvas.height) / 5000);
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.3,
        opacity: Math.random() * 0.9 + 0.1,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));

      // Nebulas
      nebulasRef.current = [
        {
          x: canvas.width * 0.2,
          y: canvas.height * 0.3,
          radius: Math.min(canvas.width, canvas.height) * 0.4,
          color1: "rgba(139, 92, 246, 0.08)",
          color2: "rgba(59, 130, 246, 0.05)",
          rotation: 0,
          rotationSpeed: 0.0002,
          opacity: 0.6,
        },
        {
          x: canvas.width * 0.8,
          y: canvas.height * 0.7,
          radius: Math.min(canvas.width, canvas.height) * 0.35,
          color1: "rgba(236, 72, 153, 0.06)",
          color2: "rgba(168, 85, 247, 0.04)",
          rotation: Math.PI / 4,
          rotationSpeed: -0.00015,
          opacity: 0.5,
        },
        {
          x: canvas.width * 0.5,
          y: canvas.height * 0.5,
          radius: Math.min(canvas.width, canvas.height) * 0.5,
          color1: "rgba(34, 211, 238, 0.04)",
          color2: "rgba(99, 102, 241, 0.03)",
          rotation: Math.PI / 2,
          rotationSpeed: 0.0001,
          opacity: 0.4,
        },
      ];

      // Auroras
      const auroraColors = [
        "rgba(34, 211, 238, 0.15)",
        "rgba(139, 92, 246, 0.12)",
        "rgba(16, 185, 129, 0.1)",
      ];
      
      aurorasRef.current = auroraColors.map((color, i) => ({
        points: Array.from({ length: 8 }, (_, j) => ({
          x: (canvas.width / 7) * j,
          y: canvas.height * (0.15 + i * 0.08),
          offset: Math.random() * Math.PI * 2,
        })),
        color,
        opacity: 0.8 - i * 0.2,
        speed: 0.002 + i * 0.001,
      }));
    };

    const shootingStarColors = [
      "rgba(255, 255, 255, ",
      "rgba(139, 92, 246, ",
      "rgba(99, 102, 241, ",
      "rgba(34, 211, 238, ",
      "rgba(168, 85, 247, ",
      "rgba(236, 72, 153, ",
    ];

    const createShootingStar = (): ShootingStar => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.4,
      length: Math.random() * 100 + 50,
      speed: Math.random() * 10 + 5,
      angle: (Math.random() * 40 + 10) * (Math.PI / 180),
      opacity: 1,
      color: shootingStarColors[Math.floor(Math.random() * shootingStarColors.length)],
    });

    let time = 0;

    const drawNebula = (nebula: Nebula) => {
      ctx.save();
      ctx.translate(nebula.x, nebula.y);
      ctx.rotate(nebula.rotation);

      // Multiple layers for depth
      for (let layer = 0; layer < 3; layer++) {
        const layerRadius = nebula.radius * (1 - layer * 0.2);
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, layerRadius);
        gradient.addColorStop(0, nebula.color1);
        gradient.addColorStop(0.5, nebula.color2);
        gradient.addColorStop(1, "transparent");

        ctx.globalAlpha = nebula.opacity * (1 - layer * 0.3);
        ctx.fillStyle = gradient;
        
        // Elliptical shape
        ctx.beginPath();
        ctx.ellipse(0, 0, layerRadius, layerRadius * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const drawAurora = (aurora: Aurora, time: number) => {
      ctx.save();
      ctx.globalAlpha = aurora.opacity;

      const points = aurora.points.map((p, i) => ({
        x: p.x,
        y: p.y + Math.sin(time * aurora.speed + p.offset) * 30 + Math.sin(time * aurora.speed * 0.5 + i) * 20,
      }));

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.4);
      gradient.addColorStop(0, aurora.color);
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(points[0].x, 0);
      
      // Draw smooth curve through points
      for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.lineTo(canvas.width, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const drawGalaxySpiral = (x: number, y: number, size: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      const arms = 2;
      const spiralTightness = 0.3;
      
      for (let arm = 0; arm < arms; arm++) {
        const armOffset = (Math.PI * 2 / arms) * arm;
        
        for (let i = 0; i < 100; i++) {
          const angle = i * 0.15 + armOffset;
          const distance = i * spiralTightness * (size / 100);
          const starX = Math.cos(angle) * distance;
          const starY = Math.sin(angle) * distance * 0.5;
          const starSize = Math.max(0.5, (1 - i / 100) * 2);
          const opacity = (1 - i / 100) * 0.6;

          ctx.beginPath();
          ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
        }
      }

      // Core glow
      const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.15);
      coreGradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
      coreGradient.addColorStop(0.5, "rgba(139, 92, 246, 0.15)");
      coreGradient.addColorStop(1, "transparent");
      
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      // Draw nebulas (background layer)
      nebulasRef.current.forEach((nebula) => {
        nebula.rotation += nebula.rotationSpeed;
        drawNebula(nebula);
      });

      // Draw distant galaxy
      drawGalaxySpiral(
        canvas.width * 0.85,
        canvas.height * 0.25,
        80,
        time * 0.05
      );

      // Draw auroras
      aurorasRef.current.forEach((aurora) => {
        drawAurora(aurora, time * 60);
      });

      // Draw stars with twinkling
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.4 + 0.6;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        
        // Some stars have color tints
        const colorChance = Math.random();
        if (colorChance > 0.95) {
          ctx.fillStyle = `rgba(139, 92, 246, ${star.opacity * twinkle})`;
        } else if (colorChance > 0.9) {
          ctx.fillStyle = `rgba(34, 211, 238, ${star.opacity * twinkle})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        }
        ctx.fill();

        // Add glow to brighter stars
        if (star.size > 1.5 && star.opacity > 0.7) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle * 0.1})`;
          ctx.fill();
        }
      });

      // Shooting stars
      if (Math.random() < 0.004) {
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
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Bright head glow
          const headGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 8);
          headGlow.addColorStop(0, `${star.color}${star.opacity})`);
          headGlow.addColorStop(1, `${star.color}0)`);
          ctx.beginPath();
          ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = headGlow;
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
