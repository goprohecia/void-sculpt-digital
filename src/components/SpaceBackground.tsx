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

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(false);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
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

    const starColors = [
      "255, 255, 255",
      "255, 240, 220",
      "220, 240, 255",
      "255, 220, 180",
      "200, 220, 255",
    ];

    const initElements = () => {
      // Initialize stars - more dense like the reference image
      const starCount = Math.floor((canvas.width * canvas.height) / 3000);
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.9 + 0.1,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      }));

      // Initialize nebulae
      nebulaeRef.current = [
        {
          x: canvas.width * 0.2,
          y: canvas.height * 0.3,
          radius: Math.min(canvas.width, canvas.height) * 0.4,
          color1: "rgba(139, 92, 246, 0.03)",
          color2: "rgba(59, 130, 246, 0.02)",
          rotation: 0,
          rotationSpeed: 0.0002,
        },
        {
          x: canvas.width * 0.8,
          y: canvas.height * 0.7,
          radius: Math.min(canvas.width, canvas.height) * 0.35,
          color1: "rgba(236, 72, 153, 0.025)",
          color2: "rgba(139, 92, 246, 0.015)",
          rotation: Math.PI,
          rotationSpeed: -0.00015,
        },
        {
          x: canvas.width * 0.5,
          y: canvas.height * 0.5,
          radius: Math.min(canvas.width, canvas.height) * 0.5,
          color1: "rgba(34, 211, 238, 0.02)",
          color2: "rgba(16, 185, 129, 0.015)",
          rotation: Math.PI / 2,
          rotationSpeed: 0.0001,
        },
      ];

      // Initialize auroras
      aurorasRef.current = [
        {
          y: canvas.height * 0.15,
          amplitude: 30,
          frequency: 0.003,
          speed: 0.0005,
          color: "rgba(34, 211, 238, 0.08)",
          offset: 0,
        },
        {
          y: canvas.height * 0.2,
          amplitude: 25,
          frequency: 0.004,
          speed: 0.0007,
          color: "rgba(139, 92, 246, 0.06)",
          offset: Math.PI / 3,
        },
        {
          y: canvas.height * 0.25,
          amplitude: 20,
          frequency: 0.0035,
          speed: 0.0006,
          color: "rgba(16, 185, 129, 0.05)",
          offset: Math.PI / 2,
        },
      ];
    };

    const shootingStarColors = [
      "rgba(255, 255, 255, ",
      "rgba(139, 92, 246, ",
      "rgba(99, 102, 241, ",
      "rgba(34, 211, 238, ",
      "rgba(168, 85, 247, ",
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

    const drawAurora = (aurora: Aurora, time: number) => {
      ctx.beginPath();
      ctx.moveTo(0, aurora.y);

      for (let x = 0; x <= canvas.width; x += 5) {
        const y = aurora.y + 
          Math.sin(x * aurora.frequency + time * aurora.speed * 1000 + aurora.offset) * aurora.amplitude +
          Math.sin(x * aurora.frequency * 2 + time * aurora.speed * 500) * (aurora.amplitude * 0.5);
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
      // Clear with deep space black
      ctx.fillStyle = "rgb(5, 5, 8)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      time += 0.016;

      // Draw nebulae (background layer)
      nebulaeRef.current.forEach((nebula) => {
        nebula.rotation += nebula.rotationSpeed;
        drawNebula(nebula);
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

        // Add glow for brighter stars
        if (star.size > 1 && star.opacity > 0.6) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${star.color}, ${finalOpacity * 0.2})`;
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
          ctx.lineWidth = 2;
          ctx.stroke();

          // Glow at head
          ctx.beginPath();
          ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `${star.color}${star.opacity})`;
          ctx.fill();

          // Extra glow
          ctx.beginPath();
          ctx.arc(star.x, star.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = `${star.color}${star.opacity * 0.3})`;
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
