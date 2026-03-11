import { Link } from "react-router-dom";
import { ArrowRight, Cookie } from "lucide-react";
import logoMba from "@/assets/logo-mba.png";

export function Footer() {
  const openCookieSettings = () => {
    localStorage.removeItem("cookie-consent");
    window.location.reload();
  };

  return (
    <footer className="relative border-t border-gray-200 py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 max-w-6xl mx-auto">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoMba} alt="MBA" className="h-10 w-auto" />
              <span className="text-xl font-medium tracking-wide text-gray-900">MY BUSINESS ASSISTANT</span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
              Plateforme SaaS modulable pour la gestion de votre entreprise, vos clients et vos salariés.
            </p>
          </div>

          {/* Produit */}
          <div>
            <h4 className="text-sm font-medium mb-6 text-gray-900">Produit</h4>
            <ul className="space-y-3">
              {[
                { to: "/fonctionnalites", label: "Fonctionnalités" },
                { to: "/#secteurs", label: "Secteurs" },
                { to: "/#offres", label: "Offres" },
                { to: "/#methode", label: "Comment ça marche" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4 className="text-sm font-medium mb-6 text-gray-900">Ressources</h4>
            <ul className="space-y-3">
              {[
                { to: "/contact", label: "Contact" },
                { to: "/client/login", label: "Connexion" },
                { to: "/client/signup", label: "Créer un compte" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium mb-6 text-gray-900">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <a href="mailto:contact@mybusinessassistant.fr" className="hover:text-gray-900 transition-colors">
                  contact@mybusinessassistant.fr
                </a>
              </li>
            </ul>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-[#22c55e] hover:text-[#16a34a] transition-colors"
            >
              Nous contacter
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 max-w-6xl mx-auto">
          <p className="text-sm text-gray-500">© 2025 MY BUSINESS ASSISTANT. Tous droits réservés.</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            {[
              { to: "/mentions-legales", label: "Mentions légales" },
              { to: "/politique-confidentialite", label: "Confidentialité" },
              { to: "/cgu", label: "CGU" },
              { to: "/cgv", label: "CGV" },
              { to: "/cookies", label: "Cookies" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-gray-900 transition-colors">
                {link.label}
              </Link>
            ))}
            <button onClick={openCookieSettings} className="hover:text-gray-900 transition-colors flex items-center gap-1">
              <Cookie className="h-3 w-3" />
              Préférences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
