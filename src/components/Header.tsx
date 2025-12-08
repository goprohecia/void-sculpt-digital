import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import logoAnimated from "@/assets/logo-animated.mp4";

const expertises = [
  { name: "Sites Web & Vitrines", href: "/services/web" },
  { name: "Applications Mobiles", href: "/services/mobile" },
  { name: "Backoffice & SaaS", href: "/services/backoffice" },
  { name: "Écosystème 360°", href: "/services/360" },
];

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isExpertiseActive = expertises.some(e => location.pathname === e.href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <video 
              src={logoAnimated} 
              autoPlay
              loop
              muted
              playsInline
              className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-xl font-bold tracking-wider hidden sm:block">
              IMPARTIAL
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={`font-medium transition-colors duration-200 hover:text-neon-blue ${
                isActive("/") ? "text-neon-blue" : "text-foreground"
              }`}
            >
              Accueil
            </Link>

            {/* Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 font-medium transition-colors duration-200 hover:text-neon-blue ${
                  isExpertiseActive ? "text-neon-blue" : "text-foreground"
                }`}
              >
                Nos Expertises
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-200 ${
                  isDropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
              >
                <div className="glass-dark rounded-lg p-2 min-w-[220px] border border-neon-blue/20 neon-glow-blue">
                  {expertises.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`block px-4 py-3 rounded-md transition-all duration-200 hover:bg-neon-blue/10 ${
                        isActive(item.href) ? "text-neon-blue bg-neon-blue/5" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/portfolio"
              className={`font-medium transition-colors duration-200 hover:text-neon-blue ${
                isActive("/portfolio") ? "text-neon-blue" : "text-foreground"
              }`}
            >
              Portfolio
            </Link>

            <Link
              to="/studio"
              className={`font-medium transition-colors duration-200 hover:text-neon-blue ${
                isActive("/studio") ? "text-neon-blue" : "text-foreground"
              }`}
            >
              Le Studio
            </Link>

            <Link
              to="/contact"
              className="px-6 py-2.5 bg-neon-blue text-background font-semibold rounded-lg transition-all duration-300 hover:neon-glow-blue hover:scale-105"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-[500px] pb-6" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg transition-colors ${
                isActive("/") ? "bg-neon-blue/10 text-neon-blue" : ""
              }`}
            >
              Accueil
            </Link>

            <div className="px-4 py-2 text-muted-foreground text-sm font-semibold uppercase tracking-wider">
              Nos Expertises
            </div>
            {expertises.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  isActive(item.href) ? "bg-neon-blue/10 text-neon-blue" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}

            <Link
              to="/portfolio"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg transition-colors ${
                isActive("/portfolio") ? "bg-neon-blue/10 text-neon-blue" : ""
              }`}
            >
              Portfolio
            </Link>

            <Link
              to="/studio"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg transition-colors ${
                isActive("/studio") ? "bg-neon-blue/10 text-neon-blue" : ""
              }`}
            >
              Le Studio
            </Link>

            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mx-4 mt-2 px-6 py-3 bg-neon-blue text-background font-semibold rounded-lg text-center"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
