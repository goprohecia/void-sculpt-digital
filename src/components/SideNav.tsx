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
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  // Only show on homepage
  const isHomepage = location.pathname === "/";

  useEffect(() => {
    if (!isHomepage) return;

    const handleScroll = () => {
      // Always visible on homepage

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
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex pointer-events-auto"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Glass sidebar container */}
      <div className="relative flex flex-col py-6 px-4 rounded-2xl border border-white/10 bg-background/80 backdrop-blur-xl shadow-2xl">
        {/* Left accent */}
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-neon-violet/30 to-transparent" />
        
        <div className="flex flex-col gap-1">
          {sectionLinks.map((link, index) => {
            const isActive = activeSection === link.href.replace("#", "");
            
            return (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "text-neon-violet" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 + 0.2 }}
                whileHover={{ x: -4 }}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-neon-violet rounded-full"
                    layoutId="activeBar"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Label */}
                <span className="text-xs font-medium uppercase tracking-[0.15em] whitespace-nowrap">
                  {link.name}
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
