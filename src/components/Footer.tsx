import { Link } from "react-router-dom";
import logo from "@/assets/logo-impartial.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="IMPARTIAL" className="h-10 w-auto" />
              <span className="text-lg font-bold tracking-wider">IMPARTIAL</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Studio digital spécialisé dans la création d'expériences web et mobiles immersives pour les marques ambitieuses.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-neon-blue">Nos Expertises</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services/web" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sites Web & Vitrines
                </Link>
              </li>
              <li>
                <Link to="/services/mobile" className="text-muted-foreground hover:text-foreground transition-colors">
                  Applications Mobiles
                </Link>
              </li>
              <li>
                <Link to="/services/backoffice" className="text-muted-foreground hover:text-foreground transition-colors">
                  Backoffice & SaaS
                </Link>
              </li>
              <li>
                <Link to="/services/360" className="text-muted-foreground hover:text-foreground transition-colors">
                  Écosystème 360°
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio */}
          <div>
            <h4 className="font-semibold mb-4 text-neon-green">Le Studio</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/studio" className="text-muted-foreground hover:text-foreground transition-colors">
                  Notre Vision
                </Link>
              </li>
              <li>
                <Link to="/studio" className="text-muted-foreground hover:text-foreground transition-colors">
                  L'Équipe
                </Link>
              </li>
              <li>
                <Link to="/studio" className="text-muted-foreground hover:text-foreground transition-colors">
                  Nos Valeurs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-neon-red">Contact</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>contact@impartial.studio</li>
              <li>+33 1 23 45 67 89</li>
              <li>Paris, France</li>
            </ul>
            <Link
              to="/contact"
              className="inline-block mt-4 px-5 py-2 bg-neon-blue/10 border border-neon-blue/50 text-neon-blue rounded-lg hover:bg-neon-blue/20 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 IMPARTIAL. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="#" className="hover:text-foreground transition-colors">
              Mentions légales
            </Link>
            <Link to="#" className="hover:text-foreground transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
