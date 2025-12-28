import { motion } from "framer-motion";

export function GlassAtmosphere() {
  return (
    <div className="atmosphere">
      {/* Primary violet orb - top left */}
      <motion.div
        className="atmosphere-orb"
        style={{
          width: "50vw",
          height: "50vw",
          maxWidth: "600px",
          maxHeight: "600px",
          left: "-10%",
          top: "-10%",
          background: "radial-gradient(circle, hsl(265 85% 50% / 0.3), hsl(265 85% 30% / 0.1), transparent 70%)",
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 25,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Secondary blue orb - bottom right */}
      <motion.div
        className="atmosphere-orb"
        style={{
          width: "45vw",
          height: "45vw",
          maxWidth: "500px",
          maxHeight: "500px",
          right: "-5%",
          bottom: "10%",
          background: "radial-gradient(circle, hsl(200 100% 50% / 0.25), hsl(200 100% 40% / 0.1), transparent 70%)",
        }}
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 40, -20, 0],
          scale: [1, 0.9, 1.05, 1],
        }}
        transition={{
          duration: 30,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 2,
        }}
      />

      {/* Tertiary pink/magenta orb - center */}
      <motion.div
        className="atmosphere-orb"
        style={{
          width: "35vw",
          height: "35vw",
          maxWidth: "400px",
          maxHeight: "400px",
          left: "40%",
          top: "30%",
          background: "radial-gradient(circle, hsl(320 80% 55% / 0.2), hsl(320 80% 40% / 0.08), transparent 70%)",
        }}
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 35,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 5,
        }}
      />

      {/* Accent cyan orb - top right */}
      <motion.div
        className="atmosphere-orb"
        style={{
          width: "30vw",
          height: "30vw",
          maxWidth: "350px",
          maxHeight: "350px",
          right: "20%",
          top: "5%",
          background: "radial-gradient(circle, hsl(180 100% 45% / 0.15), hsl(180 100% 35% / 0.05), transparent 70%)",
        }}
        animate={{
          x: [0, -30, 40, 0],
          y: [0, 30, -40, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{
          duration: 28,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 8,
        }}
      />

      {/* Subtle gold accent - bottom left */}
      <motion.div
        className="atmosphere-orb"
        style={{
          width: "25vw",
          height: "25vw",
          maxWidth: "280px",
          maxHeight: "280px",
          left: "10%",
          bottom: "20%",
          background: "radial-gradient(circle, hsl(45 100% 50% / 0.1), hsl(45 100% 40% / 0.03), transparent 70%)",
        }}
        animate={{
          x: [0, 25, -35, 0],
          y: [0, -35, 25, 0],
          scale: [1, 1.08, 0.92, 1],
        }}
        transition={{
          duration: 32,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 12,
        }}
      />

      {/* Global noise texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Mesh gradient overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, hsl(265 85% 40% / 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 80% 60%, hsl(200 100% 45% / 0.1), transparent),
            radial-gradient(ellipse 70% 50% at 50% 80%, hsl(320 80% 45% / 0.08), transparent)
          `,
        }}
      />
    </div>
  );
}
