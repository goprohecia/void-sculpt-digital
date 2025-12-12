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

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(false);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
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
      initStars();
    };

    const initStars = () => {
      const starCount = Math.floor((canvas.width * canvas.height) / 8000);
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));
    };

    const colors = [
      "rgba(255, 255, 255, ",
      "rgba(139, 92, 246, ",
      "rgba(99, 102, 241, ",
      "rgba(34, 211, 238, ",
      "rgba(168, 85, 247, ",
    ];

    const createShootingStar = (): ShootingStar => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      length: Math.random() * 80 + 40,
      speed: Math.random() * 8 + 4,
      angle: (Math.random() * 30 + 15) * (Math.PI / 180),
      opacity: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      // Draw stars with twinkling
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.fill();
      });

      // Shooting stars
      if (Math.random() < 0.003) {
        shootingStarsRef.current.push(createShootingStar());
      }

      shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.opacity -= 0.015;

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
