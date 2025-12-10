import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import logoHero from "@/assets/logo-hero.png";

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

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const isExpertiseActive = expertises.some(e => location.pathname === e.href);
  
  return <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(139,92,246,0.1)]">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <img 
              src={logoHero} 
              alt="Impartial" 
              className="h-12 w-auto drop-shadow-[0_0_10px_rgba(139,92,246,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] transition-all duration-300"
            />
            <span className="text-xl font-bold text-gradient-neon hidden sm:block">IMPARTIAL</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link to="/" className={`font-medium transition-colors duration-200 hover:text-neon-violet ${isActive("/") ? "text-neon-violet" : "text-foreground"}`}>
              Accueil
            </Link>

            {/* Dropdown */}
            <div className="relative" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
              <button className={`flex items-center gap-1 font-medium transition-colors duration-200 hover:text-neon-violet ${isExpertiseActive ? "text-neon-violet" : "text-foreground"}`}>
                Nos expertises
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-200 ${isDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
                <div className="bg-background/80 backdrop-blur-xl rounded-xl p-2 min-w-[220px] border border-neon-violet/30 shadow-[0_10px_40px_rgba(139,92,246,0.2)]">
                  {expertises.map(item => <Link key={item.href} to={item.href} className={`block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-neon-violet/10 ${isActive(item.href) ? "text-neon-violet bg-neon-violet/10" : ""}`}>
                      {item.name}
                    </Link>)}
                </div>
              </div>
            </div>

            <Link to="/portfolio" className={`font-medium transition-colors duration-200 hover:text-neon-violet ${isActive("/portfolio") ? "text-neon-violet" : "text-foreground"}`}>
              Portfolio
            </Link>

            <Link to="/studio" className={`font-medium transition-colors duration-200 hover:text-neon-violet ${isActive("/studio") ? "text-neon-violet" : "text-foreground"}`}>
              Le studio
            </Link>

            <Link to="/contact" className={`font-medium transition-colors duration-200 hover:text-neon-violet ${isActive("/contact") ? "text-neon-violet" : "text-foreground"}`}>
              Contact
            </Link>
          </div>

          {/* CTA Button - Right */}
          <div className="hidden lg:block flex-shrink-0">
            <Link to="/contact" className="btn-gradient px-6 py-2.5 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]">
              Prendre rendez-vous
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-[500px] pb-6" : "max-h-0"}`}>
          <div className="flex flex-col gap-2">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg transition-colors ${isActive("/") ? "bg-neon-violet/10 text-neon-violet" : ""}`}>
              Accueil
            </Link>

            <div className="px-4 py-2 text-muted-foreground text-sm font-semibold uppercase tracking-wider">
              Nos expertises
            </div>
            {expertises.map(item => <Link key={item.href} to={item.href} onClick={() => setIsMobileMenuOpen(false)} className={`px-6 py-3 rounded-lg transition-colors ${isActive(item.href) ? "bg-neon-violet/10 text-neon-violet" : ""}`}>
                {item.name}
              </Link>)}

            <Link to="/portfolio" onClick={() => setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg transition-colors ${isActive("/portfolio") ? "bg-neon-violet/10 text-neon-violet" : ""}`}>
              Portfolio
            </Link>

            <Link to="/studio" onClick={() => setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg transition-colors ${isActive("/studio") ? "bg-neon-violet/10 text-neon-violet" : ""}`}>
              Le studio
            </Link>

            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg transition-colors ${isActive("/contact") ? "bg-neon-violet/10 text-neon-violet" : ""}`}>
              Contact
            </Link>

            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="mx-4 mt-2 btn-gradient px-6 py-3 text-white font-semibold rounded-xl text-center">
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </div>
    </header>;
}