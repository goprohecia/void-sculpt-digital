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

interface Comet {
  x: number;
  y: number;
  tailLength: number;
  speed: number;
  angle: number;
  opacity: number;
  size: number;
  color: string;
  glowColor: string;
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
  const cometsRef = useRef<Comet[]>([]);
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
      const starCount = Math.floor((canvas.width * canvas.height) / 2000);
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.3 + 0.2,
        opacity: Math.random() * 0.9 + 0.1,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      }));

      nebulaeRef.current = [
        {
          x: canvas.width * 0.85,
          y: canvas.height * 0.5,
          radius: Math.min(canvas.width, canvas.height) * 0.5,
          color1: "rgba(180, 200, 255, 0.03)",
          color2: "rgba(100, 130, 180, 0.015)",
          rotation: 0,
          rotationSpeed: 0.00005,
        },
        {
          x: canvas.width * 0.15,
          y: canvas.height * 0.3,
          radius: Math.min(canvas.width, canvas.height) * 0.35,
          color1: "rgba(139, 92, 246, 0.012)",
          color2: "rgba(59, 130, 246, 0.008)",
          rotation: 0,
          rotationSpeed: 0.0001,
        },
      ];

      galaxiesRef.current = [
        {
          x: canvas.width * 0.75,
          y: canvas.height * 0.2,
          radius: 50,
          arms: 2,
          rotation: 0,
          rotationSpeed: 0.0003,
          color: "rgba(139, 92, 246, ",
          opacity: 0.12,
        },
        {
          x: canvas.width * 0.2,
          y: canvas.height * 0.7,
          radius: 40,
          arms: 2,
          rotation: Math.PI / 4,
          rotationSpeed: -0.0002,
          color: "rgba(99, 102, 241, ",
          opacity: 0.1,
        },
      ];

      aurorasRef.current = [
        {
          y: canvas.height * 0.12,
          amplitude: 15,
          frequency: 0.002,
          speed: 0.0003,
          color: "rgba(34, 211, 238, 0.025)",
          offset: 0,
        },
      ];

      cometsRef.current = [];
    };

    const shootingStarColors = [
      "rgba(255, 255, 255, ",
      "rgba(139, 92, 246, ",
      "rgba(99, 102, 241, ",
      "rgba(34, 211, 238, ",
    ];

    const cometColors = [
      { main: "rgba(100, 200, 255, ", glow: "rgba(50, 150, 255, " },
      { main: "rgba(255, 255, 255, ", glow: "rgba(200, 220, 255, " },
      { main: "rgba(180, 140, 255, ", glow: "rgba(139, 92, 246, " },
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

    const createComet = (): Comet => {
      const colorSet = cometColors[Math.floor(Math.random() * cometColors.length)];
      return {
        x: -100,
        y: Math.random() * canvas.height * 0.5,
        tailLength: Math.random() * 200 + 150,
        speed: Math.random() * 2 + 1.5,
        angle: (Math.random() * 20 + 10) * (Math.PI / 180),
        opacity: 0.8,
        size: Math.random() * 3 + 2,
        color: colorSet.main,
        glowColor: colorSet.glow,
      };
    };

    let time = 0;

    const drawBackground = () => {
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.8,
        canvas.height * 0.6,
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width
      );
      gradient.addColorStop(0, "rgb(15, 25, 45)");
      gradient.addColorStop(0.3, "rgb(8, 15, 30)");
      gradient.addColorStop(0.6, "rgb(5, 10, 22)");
      gradient.addColorStop(1, "rgb(2, 5, 15)");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const milkyWay = ctx.createRadialGradient(
        canvas.width * 0.9,
        canvas.height * 0.5,
        0,
        canvas.width * 0.9,
        canvas.height * 0.5,
        canvas.width * 0.4
      );
      milkyWay.addColorStop(0, "rgba(150, 170, 200, 0.08)");
      milkyWay.addColorStop(0.5, "rgba(100, 120, 160, 0.04)");
      milkyWay.addColorStop(1, "rgba(0, 0, 0, 0)");
      
      ctx.fillStyle = milkyWay;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

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

      for (let arm = 0; arm < galaxy.arms; arm++) {
        const armAngle = (arm * Math.PI * 2) / galaxy.arms;
        
        for (let i = 0; i < 60; i++) {
          const t = i / 60;
          const spiralAngle = armAngle + t * Math.PI * 2.5;
          const distance = t * galaxy.radius;
          
          const x = Math.cos(spiralAngle) * distance;
          const y = Math.sin(spiralAngle) * distance * 0.4;
          
          const starSize = (1 - t * 0.7) * 1.2;
          const starOpacity = (1 - t * 0.8) * galaxy.opacity;
          
          ctx.beginPath();
          ctx.arc(x, y, starSize, 0, Math.PI * 2);
          ctx.fillStyle = `${galaxy.color}${starOpacity})`;
          ctx.fill();
        }
      }

      const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.radius * 0.25);
      coreGradient.addColorStop(0, `${galaxy.color}${galaxy.opacity * 0.3})`);
      coreGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(0, 0, galaxy.radius * 0.25, 0, Math.PI * 2);
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

    const drawComet = (comet: Comet) => {
      ctx.save();

      const tailGradient = ctx.createLinearGradient(
        comet.x,
        comet.y,
        comet.x - Math.cos(comet.angle) * comet.tailLength,
        comet.y - Math.sin(comet.angle) * comet.tailLength
      );
      tailGradient.addColorStop(0, `${comet.color}${comet.opacity * 0.9})`);
      tailGradient.addColorStop(0.3, `${comet.color}${comet.opacity * 0.4})`);
      tailGradient.addColorStop(0.7, `${comet.glowColor}${comet.opacity * 0.15})`);
      tailGradient.addColorStop(1, `${comet.glowColor}0)`);

      ctx.beginPath();
      ctx.moveTo(comet.x, comet.y);
      
      const tailEndX = comet.x - Math.cos(comet.angle) * comet.tailLength;
      const tailEndY = comet.y - Math.sin(comet.angle) * comet.tailLength;
      
      ctx.quadraticCurveTo(
        comet.x - Math.cos(comet.angle) * comet.tailLength * 0.5,
        comet.y - Math.sin(comet.angle) * comet.tailLength * 0.5 + 5,
        tailEndX,
        tailEndY
      );
      
      ctx.strokeStyle = tailGradient;
      ctx.lineWidth = comet.size * 2;
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(comet.x, comet.y);
      ctx.quadraticCurveTo(
        comet.x - Math.cos(comet.angle) * comet.tailLength * 0.6,
        comet.y - Math.sin(comet.angle) * comet.tailLength * 0.6 - 3,
        comet.x - Math.cos(comet.angle) * comet.tailLength * 0.8,
        comet.y - Math.sin(comet.angle) * comet.tailLength * 0.8
      );
      ctx.strokeStyle = `${comet.glowColor}${comet.opacity * 0.3})`;
      ctx.lineWidth = comet.size * 0.8;
      ctx.stroke();

      const headGlow = ctx.createRadialGradient(
        comet.x, comet.y, 0,
        comet.x, comet.y, comet.size * 6
      );
      headGlow.addColorStop(0, `${comet.color}${comet.opacity})`);
      headGlow.addColorStop(0.3, `${comet.glowColor}${comet.opacity * 0.5})`);
      headGlow.addColorStop(1, `${comet.glowColor}0)`);

      ctx.beginPath();
      ctx.arc(comet.x, comet.y, comet.size * 6, 0, Math.PI * 2);
      ctx.fillStyle = headGlow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(comet.x, comet.y, comet.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${comet.opacity})`;
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      drawBackground();
      
      time += 0.016;

      nebulaeRef.current.forEach((nebula) => {
        nebula.rotation += nebula.rotationSpeed;
        drawNebula(nebula);
      });

      galaxiesRef.current.forEach((galaxy) => {
        galaxy.rotation += galaxy.rotationSpeed;
        drawGalaxy(galaxy);
      });

      aurorasRef.current.forEach((aurora) => {
        drawAurora(aurora, time);
      });

      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.4 + 0.6;
        const finalOpacity = star.opacity * twinkle;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${finalOpacity})`;
        ctx.fill();

        if (star.size > 0.9 && star.opacity > 0.6) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${star.color}, ${finalOpacity * 0.12})`;
          ctx.fill();
        }
      });

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

          ctx.beginPath();
          ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `${star.color}${star.opacity})`;
          ctx.fill();

          return true;
        }
        return false;
      });

      if (Math.random() < 0.0008 && cometsRef.current.length < 2) {
        cometsRef.current.push(createComet());
      }

      cometsRef.current = cometsRef.current.filter((comet) => {
        comet.x += Math.cos(comet.angle) * comet.speed;
        comet.y += Math.sin(comet.angle) * comet.speed;

        if (comet.x > canvas.width + 100) {
          comet.opacity -= 0.02;
        }

        if (comet.opacity > 0 && comet.x < canvas.width + 300) {
          drawComet(comet);
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
