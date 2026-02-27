import { Link } from "react-router-dom";
import { Mail, MapPin, ArrowRight, Cookie } from "lucide-react";
import { motion } from "framer-motion";
import { Newsletter } from "@/components/Newsletter";

export function Footer() {
  const openCookieSettings = () => {
    localStorage.removeItem("cookie-consent");
    window.location.reload();
  };

  return (
    <footer className="relative border-t border-white/5 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="text-xl font-medium tracking-wide">
              MY BUSINESS ASSISTANT
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Plateforme SaaS modulable pour la gestion de votre entreprise, vos clients et vos salariés.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-medium mb-6">Expertises</h4>
            <ul className="space-y-3">
              {[
                { to: "/services/web", label: "Sites Web" },
                { to: "/services/mobile", label: "Apps Mobiles" },
                { to: "/services/backoffice", label: "Backoffice" },
                { to: "/services/360", label: "Écosystème 360°" }
              ].map(link => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio */}
          <div>
            <h4 className="text-sm font-medium mb-6">Studio</h4>
            <ul className="space-y-3">
              {[
                { to: "/studio", label: "Notre vision" },
                { to: "/portfolio", label: "Portfolio" },
                { to: "/contact", label: "Contact" }
              ].map(link => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium mb-6">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a 
                  href="mailto:studio@impartialgames.com" 
                  className="hover:text-foreground transition-colors"
                >
                  studio@impartialgames.com
                </a>
              </li>
              <li>Delaware, États-Unis</li>
            </ul>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
            >
              Nous contacter
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 max-w-6xl mx-auto">
          <p className="text-sm text-muted-foreground">
            © 2025 MY BUSINESS ASSISTANT. Tous droits réservés.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            {[
              { to: "/mentions-legales", label: "Mentions légales" },
              { to: "/politique-confidentialite", label: "Confidentialité" },
              { to: "/cgu", label: "CGU" },
              { to: "/cgv", label: "CGV" },
              { to: "/cookies", label: "Cookies" }
            ].map(link => (
              <Link 
                key={link.to} 
                to={link.to} 
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button 
              onClick={openCookieSettings} 
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Cookie className="h-3 w-3" />
              Préférences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}