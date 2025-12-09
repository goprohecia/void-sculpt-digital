import { Link } from "react-router-dom";
import { Sparkles, Mail, Phone, MapPin, ArrowUpRight, Cookie } from "lucide-react";
import { Newsletter } from "@/components/Newsletter";
import logoHero from "@/assets/logo-hero.png";

export function Footer() {
  const openCookieSettings = () => {
    localStorage.removeItem("cookie-consent");
    window.location.reload();
  };

  return (
    <footer className="relative border-t border-white/10 bg-glass-dark/50 backdrop-blur-xl overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-neon-violet/5 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-violet-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/3 w-[300px] h-[150px] bg-purple-600/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logoHero}
                alt="Impartial"
                className="h-12 w-auto drop-shadow-[0_0_10px_rgba(139,92,246,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] transition-all duration-300"
              />
              <span className="text-xl font-bold tracking-wider group-hover:text-neon-violet transition-colors">IMPARTIAL</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Studio digital spécialisé dans la création d'expériences web et mobiles immersives pour les marques ambitieuses.
            </p>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-neon-violet" />
              <span className="text-sm text-neon-violet font-medium">Gaming & Tech Design</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-6 text-neon-violet flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-violet shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
              Nos Expertises
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/services/web", label: "Sites Web & Vitrines" },
                { to: "/services/mobile", label: "Applications Mobiles" },
                { to: "/services/backoffice", label: "Backoffice & SaaS" },
                { to: "/services/360", label: "Écosystème 360°" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-neon-violet" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio */}
          <div>
            <h4 className="font-semibold mb-6 text-emerald-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
              Le Studio
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/studio", label: "Notre Vision" },
                { to: "/studio", label: "L'Équipe" },
                { to: "/studio", label: "Nos Valeurs" },
                { to: "/portfolio", label: "Portfolio" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-400" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-6 text-rose-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.5)]" />
              Contact
            </h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-rose-400" />
                contact@impartial.studio
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-rose-400" />
                +33 1 23 45 67 89
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-rose-400" />
                Paris, France
              </li>
            </ul>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-neon-violet/10 border border-neon-violet/40 text-neon-violet rounded-xl hover:bg-neon-violet/20 hover:border-neon-violet/60 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-300"
            >
              Nous contacter
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Newsletter */}
          <div>
            <Newsletter variant="inline" />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 <span className="text-neon-violet">IMPARTIAL</span>. Tous droits réservés.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
            <Link to="/cgu" className="hover:text-neon-violet transition-colors">
              CGU
            </Link>
            <Link to="/cgv" className="hover:text-neon-violet transition-colors">
              CGV
            </Link>
            <Link to="/cookies" className="hover:text-neon-violet transition-colors">
              Cookies
            </Link>
            <button
              onClick={openCookieSettings}
              className="hover:text-neon-violet transition-colors flex items-center gap-1"
            >
              <Cookie className="h-3 w-3" />
              Préférences cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}