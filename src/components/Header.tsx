import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoHero from "@/assets/logo-hero.png";
import { MagneticButton, RippleButton } from "@/components/animations";

const services = [
{ name: "Web", href: "/services/web" },
{ name: "Mobile", href: "/services/mobile" },
{ name: "Backoffice", href: "/services/backoffice" },
{ name: "360°", href: "/services/360" }];


const navLinks = [
{ name: "Studio", href: "/studio" },
{ name: "Contact", href: "/contact" }];


// Animated nav link with hover 3D effect
function NavLink({
  to,
  children,
  isActive,
  isAnchor = false





}: {to: string;children: React.ReactNode;isActive: boolean;isAnchor?: boolean;}) {
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
        isActive ? "text-neon-violet" : "text-foreground"}`
        }>

        <motion.span
          className="relative z-10"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}>

          {children}
        </motion.span>
        {isActive &&
        <motion.div
          layoutId="activeNav"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-violet rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }} />

        }
      </Link>
    </MagneticButton>);

}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path.startsWith("/#")) {
      return location.pathname === "/" && location.hash === path.replace("/", "");
    }
    return location.pathname === path;
  };

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
      isScrolled ?
      "glass-nav glass-noise border-b border-white/10 py-0" :
      "bg-transparent border-b border-transparent py-2"}`
      }
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}>

      {/* Subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="container mx-auto px-4">
        <nav className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"}`}>
          {/* Logo */}
          <MagneticButton as="div" strength={0.2}>
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
              <motion.img
                src={logoHero}
                alt="Impartial Games"
                className="h-8 sm:h-10 md:h-12 w-auto drop-shadow-[0_0_10px_rgba(139,92,246,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }} />

              <motion.span
                className="text-base sm:text-lg md:text-xl font-bold text-gradient-premium hidden sm:block"
                whileHover={{ scale: 1.05 }}>

                IMPARTIAL GAMES 
              </motion.span>
            </Link>
          </MagneticButton>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {/* Studio first */}
            <NavLink
              to="/studio"
              isActive={isActive("/studio")}>

              Studio
            </NavLink>

            {/* Services links */}
            {services.map((link) =>
            <NavLink
              key={link.href}
              to={link.href}
              isActive={isActive(link.href)}>

                {link.name}
              </NavLink>
            )}

            {/* Contact */}
            <NavLink
              to="/contact"
              isActive={isActive("/contact")}>

              Contact
            </NavLink>
          </div>

          {/* CTA Button - Right */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <MagneticButton as="div" strength={0.25}>
              <a
                href="https://calendly.com/yannis-bezriche/impartial-games"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button px-5 py-2.5 text-sm font-medium rounded-xl hover:border-primary/30 transition-colors">

                Planifier un appel
              </a>
            </MagneticButton>
            <MagneticButton as="div" strength={0.15}>
              <Link
                to="/client/login"
                className="glass-button px-5 py-2.5 text-sm font-medium rounded-xl hover:border-primary/30 transition-colors">

                Connexion
              </Link>
            </MagneticButton>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <motion.button
              className="glass-button p-2 sm:p-2.5"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}>

              <AnimatePresence mode="wait">
                {isMobileMenuOpen ?
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}>

                    <X className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" />
                  </motion.div> :

                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}>

                    <Menu className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" />
                  </motion.div>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen &&
          <motion.div
            className="lg:hidden overflow-hidden pb-6"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}>

              <motion.div
              className="glass-surface glass-noise rounded-2xl p-4 mt-2"
              initial="closed"
              animate="open"
              variants={{
                open: {
                  transition: { staggerChildren: 0.05, delayChildren: 0.1 }
                },
                closed: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 }
                }
              }}>

                {/* Studio first */}
                <motion.div
                variants={{
                  open: { opacity: 1, x: 0 },
                  closed: { opacity: 0, x: -20 }
                }}>

                  <Link
                  to="/studio"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`relative z-10 px-4 py-3 rounded-xl transition-colors block ${
                  isActive("/studio") ?
                  "bg-neon-violet/10 text-neon-violet" :
                  ""}`
                  }>

                    Studio
                  </Link>
                </motion.div>

                {/* Services section */}
                <motion.div
                variants={{
                  open: { opacity: 1, x: 0 },
                  closed: { opacity: 0, x: -20 }
                }}
                className="px-4 py-2 text-muted-foreground text-sm font-semibold uppercase tracking-wider mt-2">

                  Services
                </motion.div>

                {services.map((item) =>
              <motion.div
                key={item.href}
                variants={{
                  open: { opacity: 1, x: 0 },
                  closed: { opacity: 0, x: -20 }
                }}>

                    <Link
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`relative z-10 px-6 py-3 rounded-xl transition-colors block ${
                  isActive(item.href) ?
                  "bg-neon-violet/10 text-neon-violet" :
                  ""}`
                  }>

                      {item.name}
                    </Link>
                  </motion.div>
              )}

                <div className="divider-premium my-3" />

                {/* Main links */}
                {navLinks.map((item) =>
              <motion.div
                key={item.href}
                variants={{
                  open: { opacity: 1, x: 0 },
                  closed: { opacity: 0, x: -20 }
                }}>

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
                  isActive(item.href) ?
                  "bg-neon-violet/10 text-neon-violet" :
                  ""}`
                  }>

                      {item.name}
                    </Link>
                  </motion.div>
              )}

                <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 20 }
                }}>

                  <a
                  href="https://calendly.com/yannis-bezriche/impartial-games"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4 glass-button px-6 py-3 font-medium rounded-xl text-center block relative z-10">

                    Planifier un appel
                  </a>
                </motion.div>

                <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 20 }
                }}>

                  <Link
                  to="/client/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-3 glass-button px-6 py-3 font-medium rounded-xl text-center block relative z-10">

                    Connexion
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </motion.header>);

}