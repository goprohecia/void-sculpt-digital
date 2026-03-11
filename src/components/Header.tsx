import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoMba from "@/assets/logo-mba.png";
import { MagneticButton } from "@/components/animations";

const navItems = [
  { name: "Fonctionnalités", href: "/fonctionnalites" },
  { name: "Secteurs", href: "/#secteurs" },
  { name: "Offres", href: "/#offres" },
  { name: "Démo", href: "/demo" },
  { name: "Contact", href: "/contact" },
];

function NavLinkItem({
  to,
  children,
  isActive,
  isHeroOverlay,
}: {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
  isHeroOverlay: boolean;
}) {
  const handleClick = (e: React.MouseEvent) => {
    if (to.startsWith("/#")) {
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
        className={`relative font-medium transition-colors duration-200 hover:text-[#22c55e] px-2 py-1 ${
          isActive ? "text-[#22c55e]" : isHeroOverlay ? "text-white/90" : "text-gray-700"
        }`}
      >
        <motion.span className="relative z-10" whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
          {children}
        </motion.span>
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#22c55e] rounded-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    </MagneticButton>
  );
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  const isActive = (path: string) => {
    if (path.startsWith("/#")) {
      return location.pathname === "/" && location.hash === path.replace("/", "");
    }
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroOverlay = isHomepage && !isScrolled;

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-gray-200 py-0 shadow-sm"
          : "bg-transparent border-b border-transparent py-2"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >

      <div className="container mx-auto px-4">
        <nav
          className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
          }`}
        >
          {/* Logo */}
          <MagneticButton as="div" strength={0.2}>
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
              <motion.img
                src={logoMba}
                alt="MBA"
                className="h-8 sm:h-10 md:h-12 w-auto drop-shadow-[0_0_10px_rgba(34,197,94,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(34,197,94,0.6)] transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className={`text-base sm:text-lg md:text-xl font-bold hidden sm:block transition-colors duration-300 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                MY BUSINESS ASSISTANT
              </motion.span>
            </Link>
          </MagneticButton>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <NavLinkItem key={item.href} to={item.href} isActive={isActive(item.href)} isHeroOverlay={heroOverlay}>
                {item.name}
              </NavLinkItem>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <MagneticButton as="div" strength={0.25}>
              <Link
                to="/contact?subject=Demo%20MBA"
                className={`px-5 py-2.5 text-sm font-medium rounded-xl border transition-colors ${
                  isScrolled
                    ? "border-gray-300 text-gray-900 hover:border-[#22c55e]/50"
                    : "border-white/30 text-white hover:border-white/60"
                }`}
              >
                Essayer MBA
              </Link>
            </MagneticButton>
            <MagneticButton as="div" strength={0.15}>
              <Link
                to="/client/login"
                className={`px-5 py-2.5 text-sm font-medium rounded-xl border transition-colors ${
                  isScrolled
                    ? "border-gray-300 text-gray-900 hover:border-[#22c55e]/50"
                    : "border-white/30 text-white hover:border-white/60"
                }`}
              >
                Connexion
              </Link>
            </MagneticButton>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <motion.button
              className={`p-2 sm:p-2.5 border rounded-xl ${isScrolled ? "border-gray-300" : "border-white/30 text-white"}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" />
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
                className="rounded-2xl p-4 mt-2 border border-gray-200 bg-white shadow-lg"
                initial="closed"
                animate="open"
                variants={{
                  open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                }}
              >
                {navItems.map((item) => (
                  <motion.div
                    key={item.href}
                    variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -20 } }}
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
                            setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 300);
                          }
                        } else {
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      className={`relative z-10 px-4 py-3 rounded-xl transition-colors block ${
                        isActive(item.href) ? "bg-[#22c55e]/10 text-[#22c55e]" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <div className="divider-premium my-3" />

                <motion.div variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: 20 } }}>
                  <Link
                    to="/contact?subject=Demo%20MBA"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-4 px-6 py-3 font-medium rounded-xl text-center block relative z-10 border border-gray-300 text-gray-900"
                  >
                    Essayer MBA
                  </Link>
                </motion.div>

                <motion.div variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: 20 } }}>
                  <Link
                    to="/client/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-3 px-6 py-3 font-medium rounded-xl text-center block relative z-10 border border-gray-300 text-gray-900"
                  >
                    Connexion
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
