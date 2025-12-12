import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-secondary/50 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 rounded-xl bg-secondary/80 hover:bg-secondary border border-border/50 hover:border-primary/30 flex items-center justify-center transition-colors duration-200 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-5 w-5 text-neon-violet group-hover:text-primary transition-colors" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-5 w-5 text-amber-500 group-hover:text-amber-400 transition-colors" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
        isDark 
          ? "opacity-0 group-hover:opacity-100 shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
          : "opacity-0 group-hover:opacity-100 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
      }`} />
    </motion.button>
  );
}
