import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoHero from "@/assets/logo-hero.png";
import { MagneticButton, RippleButton } from "@/components/animations";

const expertises = [{
  name: "Sites Web & Vitrines",
  href: "/services/web"
}, {
  name: "Applications Mobiles",
  href: "/services/mobile"
}, {
  name: "Backoffice & SaaS",
  href: "/services/backoffice"
}, {
  name: "Écosystème 360°",
  href: "/services/360"
}];

// Animated nav link with hover 3D effect
function NavLink({ 
  to, 
  children, 
  isActive 
}: { 
  to: string; 
  children: React.ReactNode; 
  isActive: boolean;
}) {
  return (
    <MagneticButton as="div" strength={0.15} className="relative">
      <Link 
        to={to} 
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
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const isExpertiseActive = expertises.some(e => location.pathname === e.href);
  
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(139,92,246,0.1)]"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <MagneticButton as="div" strength={0.2}>
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <motion.img 
                src={logoHero} 
                alt="Impartial" 
                className="h-12 w-auto drop-shadow-[0_0_10px_rgba(139,92,246,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span 
                className="text-xl font-bold text-gradient-neon hidden sm:block"
                whileHover={{ scale: 1.05 }}
              >
                IMPARTIAL
              </motion.span>
            </Link>
          </MagneticButton>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <NavLink to="/" isActive={isActive("/")}>
              Accueil
            </NavLink>

            {/* Dropdown */}
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
                  Nos expertises
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
                      className="bg-background/80 backdrop-blur-xl rounded-xl p-2 min-w-[220px] border border-neon-violet/30 shadow-[0_10px_40px_rgba(139,92,246,0.2)]"
                      initial={{ rotateX: -15 }}
                      animate={{ rotateX: 0 }}
                      style={{ transformPerspective: 1000 }}
                    >
                      {expertises.map((item, index) => (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link 
                            to={item.href} 
                            className={`block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-neon-violet/10 hover:translate-x-1 ${
                              isActive(item.href) ? "text-neon-violet bg-neon-violet/10" : ""
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

            <NavLink to="/portfolio" isActive={isActive("/portfolio")}>
              Portfolio
            </NavLink>

            <NavLink to="/studio" isActive={isActive("/studio")}>
              Le studio
            </NavLink>

            <NavLink to="/contact" isActive={isActive("/contact")}>
              Contact
            </NavLink>
          </div>

          {/* CTA Button - Right */}
          <div className="hidden lg:block flex-shrink-0">
            <MagneticButton as="div" strength={0.25}>
              <RippleButton
                onClick={() => window.location.href = "/contact"}
                className="btn-gradient px-6 py-2.5 text-white font-semibold rounded-xl"
              >
                Prendre rendez-vous
              </RippleButton>
            </MagneticButton>
          </div>

          {/* Mobile Menu Button */}
          <motion.button 
            className="lg:hidden p-2" 
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
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
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
                className="flex flex-col gap-2"
                initial="closed"
                animate="open"
                variants={{
                  open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                }}
              >
                <motion.div
                  variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -20 } }}
                >
                  <Link 
                    to="/" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className={`px-4 py-3 rounded-lg transition-colors block ${isActive("/") ? "bg-neon-violet/10 text-neon-violet" : ""}`}
                  >
                    Accueil
                  </Link>
                </motion.div>

                <motion.div
                  variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -20 } }}
                  className="px-4 py-2 text-muted-foreground text-sm font-semibold uppercase tracking-wider"
                >
                  Nos expertises
                </motion.div>

                {expertises.map((item) => (
                  <motion.div
                    key={item.href}
                    variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -20 } }}
                  >
                    <Link 
                      to={item.href} 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className={`px-6 py-3 rounded-lg transition-colors block ${isActive(item.href) ? "bg-neon-violet/10 text-neon-violet" : ""}`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                {[
                  { to: "/portfolio", label: "Portfolio" },
                  { to: "/studio", label: "Le studio" },
                  { to: "/contact", label: "Contact" },
                ].map((item) => (
                  <motion.div
                    key={item.to}
                    variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -20 } }}
                  >
                    <Link 
                      to={item.to} 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className={`px-4 py-3 rounded-lg transition-colors block ${isActive(item.to) ? "bg-neon-violet/10 text-neon-violet" : ""}`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: 20 } }}
                >
                  <Link 
                    to="/contact" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="mx-4 mt-2 btn-gradient px-6 py-3 text-white font-semibold rounded-xl text-center block"
                  >
                    Prendre rendez-vous
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
