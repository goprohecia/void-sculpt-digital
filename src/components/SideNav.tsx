import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const sectionLinks = [
  { name: "Services", href: "#services" },
  { name: "Offres", href: "#offres" },
  { name: "Réalisations", href: "#realisations" },
  { name: "Méthode", href: "#methode" },
];

export function SideNav() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  // Only show on homepage
  const isHomepage = location.pathname === "/";

  useEffect(() => {
    if (!isHomepage) return;

    const handleScroll = () => {
      // Show after scrolling past hero
      setIsVisible(window.scrollY > window.innerHeight * 0.5);

      // Detect active section
      const sections = sectionLinks.map(link => ({
        id: link.href.replace("#", ""),
        element: document.getElementById(link.href.replace("#", ""))
      }));

      for (const section of sections.reverse()) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomepage]);

  const handleClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isHomepage) return null;

  return (
    <motion.nav
      className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        x: isVisible ? 0 : 20,
        pointerEvents: isVisible ? "auto" : "none"
      }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {sectionLinks.map((link, index) => {
        const isActive = activeSection === link.href.replace("#", "");
        
        return (
          <motion.a
            key={link.href}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className="group flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 + 0.2 }}
          >
            {/* Label - appears on hover or when active */}
            <motion.span
              className={`text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                isActive 
                  ? "text-foreground opacity-100" 
                  : "text-muted-foreground opacity-0 group-hover:opacity-100"
              }`}
            >
              {link.name}
            </motion.span>

            {/* Dot indicator */}
            <div className="relative flex items-center justify-center">
              <motion.div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive 
                    ? "bg-neon-violet scale-100" 
                    : "bg-white/30 scale-75 group-hover:bg-white/60 group-hover:scale-100"
                }`}
              />
              {isActive && (
                <motion.div
                  className="absolute inset-0 w-2 h-2 rounded-full bg-neon-violet"
                  layoutId="activeDot"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {/* Active glow */}
              {isActive && (
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-neon-violet blur-sm opacity-60" />
              )}
            </div>
          </motion.a>
        );
      })}

      {/* Vertical line connecting dots */}
      <div className="absolute right-[3px] top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -z-10" />
    </motion.nav>
  );
}
