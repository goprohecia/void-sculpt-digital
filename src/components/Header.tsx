import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoHero from "@/assets/logo-hero.png";
import { MagneticButton, RippleButton } from "@/components/animations";

const expertises = [
  { name: "Sites Web & Vitrines", href: "/services/web" },
  { name: "Applications Mobiles", href: "/services/mobile" },
  { name: "Backoffice & SaaS", href: "/services/backoffice" },
  { name: "Écosystème 360°", href: "/services/360" },
];

const navLinks = [
  { name: "Services", href: "/#services" },
  { name: "Offres", href: "/#offres" },
  { name: "Réalisations", href: "/#realisations" },
  { name: "Méthode", href: "/#methode" },
  { name: "Studio", href: "/studio" },
  { name: "Contact", href: "/contact" },
];

// Animated nav link with hover 3D effect
function NavLink({
  to,
  children,
  isActive,
  isAnchor = false,
}: {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
  isAnchor?: boolean;
}) {
  const handleClick = (e: React.MouseEvent) => {
    if (isAnchor && to.startsWith("/#")) {
      const hash = to.replace("/", "");
      const element = document.querySelector(hash);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <MagneticButton as="div" strength={0.15} className="relative">
      <Link
        to={to}
        onClick={handleClick}
        className={`relative font-medium transition-colors duration-200 hover:text-neon-violet px-2 py-1 ${
          isActive ? "text-neon-violet" : "text-foreground"
        }`}
      >
        <motion.span
          className="relative z-10"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-violet rounded-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    </MagneticButton>
  );
}

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path.startsWith("/#")) {
      return location.pathname === "/" && location.hash === path.replace("/", "");
    }
    return location.pathname === path;
  };
  const isExpertiseActive = expertises.some((e) => location.pathname === e.href);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-nav border-b border-white/10 py-0"
          : "bg-transparent border-b border-transparent py-2"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="container mx-auto px-4">
        <nav className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-16" : "h-20"}`}>
          {/* Logo */}
          <MagneticButton as="div" strength={0.2}>
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <motion.img
                src={logoHero}
                alt="Impartial Games"
                className="h-10 md:h-12 w-auto drop-shadow-[0_0_10px_rgba(139,92,246,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="text-lg md:text-xl font-bold text-gradient-premium hidden sm:block"
                whileHover={{ scale: 1.05 }}
              >
                IMPARTIAL
              </motion.span>
            </Link>
          </MagneticButton>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {/* Dropdown for Expertises */}
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <MagneticButton as="div" strength={0.15}>
                <motion.button
                  className={`flex items-center gap-1 font-medium transition-colors duration-200 hover:text-neon-violet px-2 py-1 ${
                    isExpertiseActive ? "text-neon-violet" : "text-foreground"
                  }`}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  Expertises
                  <motion.span
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </motion.button>
              </MagneticButton>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <motion.div
                      className="glass-card glass-shimmer min-w-[240px] p-2 overflow-hidden"
                      initial={{ rotateX: -15 }}
                      animate={{ rotateX: 0 }}
                      style={{ transformPerspective: 1000 }}
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-violet/30 to-transparent" />
                      {expertises.map((item, index) => (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            to={item.href}
                            className={`relative z-10 block px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/5 hover:translate-x-1 ${
                              isActive(item.href)
                                ? "text-neon-violet bg-neon-violet/10"
                                : ""
                            }`}
                          >
                            {item.name}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Main nav links with anchors */}
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                isActive={isActive(link.href)}
                isAnchor={link.href.startsWith("/#")}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* CTA Button - Right */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <MagneticButton as="div" strength={0.25}>
              <RippleButton
                onClick={() =>
                  window.open(
                    "https://calendly.com/yannis-bezriche/impartial-games",
                    "_blank"
                  )
                }
                className="btn-gradient px-6 py-2.5 text-white font-semibold rounded-xl"
              >
                Planifier un appel
              </RippleButton>
            </MagneticButton>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <motion.button
              className="glass-button p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6 relative z-10" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6 relative z-10" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden overflow-hidden pb-6"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <motion.div
                className="glass-surface rounded-2xl p-4 mt-2"
                initial="closed"
                animate="open"
                variants={{
                  open: {
                    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
                  },
                  closed: {
                    transition: { staggerChildren: 0.05, staggerDirection: -1 },
                  },
                }}
              >
                {/* Expertises section */}
                <motion.div
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -20 },
                  }}
                  className="px-4 py-2 text-muted-foreground text-sm font-semibold uppercase tracking-wider"
                >
                  Expertises
                </motion.div>

                {expertises.map((item) => (
                  <motion.div
                    key={item.href}
                    variants={{
                      open: { opacity: 1, x: 0 },
                      closed: { opacity: 0, x: -20 },
                    }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`relative z-10 px-6 py-3 rounded-xl transition-colors block ${
                        isActive(item.href)
                          ? "bg-neon-violet/10 text-neon-violet"
                          : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <div className="divider-premium my-3" />

                {/* Main links */}
                {navLinks.map((item) => (
                  <motion.div
                    key={item.href}
                    variants={{
                      open: { opacity: 1, x: 0 },
                      closed: { opacity: 0, x: -20 },
                    }}
                  >
                    <Link
                      to={item.href}
                      onClick={(e) => {
                        if (item.href.startsWith("/#")) {
                          const hash = item.href.replace("/", "");
                          const element = document.querySelector(hash);
                          if (element) {
                            e.preventDefault();
                            setIsMobileMenuOpen(false);
                            setTimeout(() => {
                              element.scrollIntoView({ behavior: "smooth" });
                            }, 300);
                          }
                        } else {
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      className={`relative z-10 px-4 py-3 rounded-xl transition-colors block ${
                        isActive(item.href)
                          ? "bg-neon-violet/10 text-neon-violet"
                          : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: 20 },
                  }}
                >
                  <a
                    href="https://calendly.com/yannis-bezriche/impartial-games"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-4 btn-gradient px-6 py-3 text-white font-semibold rounded-xl text-center block relative z-10"
                  >
                    Planifier un appel
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
