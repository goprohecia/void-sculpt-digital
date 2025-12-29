import { motion } from "framer-motion";

export function GlassAtmosphere() {
  return (
    <div className="atmosphere">
      {/* Primary violet orb - top left */}
      <motion.div
        className="atmosphere-orb"
        style={{
          width: "45vw",
          height: "45vw",
          maxWidth: "550px",
          maxHeight: "550px",
          left: "-12%",
          top: "-8%",
          background: "radial-gradient(circle, hsl(265 85% 50% / 0.25), hsl(265 85% 35% / 0.08), transparent 65%)",
        }}
        animate={{
          x: [0, 40, -25, 0],
          y: [0, -25, 15, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{
          duration: 28,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Secondary blue orb - bottom right */}
      <motion.div
        className="atmosphere-orb"
        style={{
          width: "40vw",
          height: "40vw",
          maxWidth: "450px",
          maxHeight: "450px",
          right: "-8%",
          bottom: "12%",
          background: "radial-gradient(circle, hsl(200 100% 55% / 0.2), hsl(200 100% 45% / 0.08), transparent 65%)",
        }}
        animate={{
          x: [0, -35, 25, 0],
          y: [0, 35, -18, 0],
          scale: [1, 0.92, 1.04, 1],
        }}
        transition={{
          duration: 32,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 3,
        }}
      />

      {/* Tertiary pink/magenta orb - center right */}
      <motion.div
        className="atmosphere-orb"
        style={{
          width: "30vw",
          height: "30vw",
          maxWidth: "350px",
          maxHeight: "350px",
          right: "25%",
          top: "35%",
          background: "radial-gradient(circle, hsl(320 80% 55% / 0.15), hsl(320 80% 45% / 0.06), transparent 65%)",
        }}
        animate={{
          x: [0, 50, -35, 0],
          y: [0, -40, 25, 0],
          scale: [1, 1.1, 0.92, 1],
        }}
        transition={{
          duration: 36,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 6,
        }}
      />

      {/* Accent cyan orb - top right */}
      <motion.div
        className="atmosphere-orb"
        style={{
          width: "25vw",
          height: "25vw",
          maxWidth: "300px",
          maxHeight: "300px",
          right: "15%",
          top: "8%",
          background: "radial-gradient(circle, hsl(180 100% 50% / 0.12), hsl(180 100% 40% / 0.04), transparent 65%)",
        }}
        animate={{
          x: [0, -25, 35, 0],
          y: [0, 25, -35, 0],
          scale: [1, 0.96, 1.08, 1],
        }}
        transition={{
          duration: 30,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 10,
        }}
      />

      {/* Subtle violet accent - bottom left */}
      <motion.div
        className="atmosphere-orb"
        style={{
          width: "22vw",
          height: "22vw",
          maxWidth: "250px",
          maxHeight: "250px",
          left: "8%",
          bottom: "18%",
          background: "radial-gradient(circle, hsl(265 70% 55% / 0.12), hsl(265 70% 45% / 0.04), transparent 65%)",
        }}
        animate={{
          x: [0, 20, -30, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.06, 0.94, 1],
        }}
        transition={{
          duration: 34,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 14,
        }}
      />

      {/* Global noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Premium mesh gradient overlay */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 15% 35%, hsl(265 85% 45% / 0.12), transparent),
            radial-gradient(ellipse 55% 35% at 85% 55%, hsl(200 100% 50% / 0.08), transparent),
            radial-gradient(ellipse 60% 45% at 55% 85%, hsl(320 80% 50% / 0.06), transparent)
          `,
        }}
      />
    </div>
  );
}
