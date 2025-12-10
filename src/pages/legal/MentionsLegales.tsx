import { Layout } from "@/components/Layout";
import { FloatingParticles } from "@/components/FloatingParticles";
import { Sparkles, Building2, Mail, Phone, Globe, Server, Shield } from "lucide-react";
import logoHero from "@/assets/logo-hero.png";

const MentionsLegales = () => {
  return (
    <Layout>
      <FloatingParticles />
      
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-violet/10 via-transparent to-transparent" />
        <div className="absolute inset-0 grid-bg" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8 flex justify-center opacity-0 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-neon-violet/50 blur-[60px] rounded-full scale-110 animate-pulse-glow" />
                <img
                  src={logoHero}
                  alt="IMPARTIAL"
                  className="relative w-24 h-24 drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                />
              </div>
            </div>
            
            <div className="mb-6 flex justify-center opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="badge-gradient flex items-center gap-2 text-sm font-medium text-violet-300">
                <Sparkles className="h-4 w-4" />
                Informations légales
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Mentions <span className="text-gradient-neon">légales</span>
            </h1>
            <p className="text-xl text-muted-foreground opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              Conformément aux dispositions légales en vigueur
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Éditeur du site */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-neon-violet/20 border border-neon-violet/30">
                  <Building2 className="h-6 w-6 text-neon-violet" />
                </div>
                <h2 className="text-2xl font-bold">Éditeur du site</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p><span className="font-semibold text-foreground">Raison sociale :</span> IMPARTIAL Studio</p>
                <p><span className="font-semibold text-foreground">Forme juridique :</span> SAS (Société par Actions Simplifiée)</p>
                <p><span className="font-semibold text-foreground">Capital social :</span> 10 000 €</p>
                <p><span className="font-semibold text-foreground">Siège social :</span> 123 Avenue des Champs-Élysées, 75008 Paris, France</p>
                <p><span className="font-semibold text-foreground">SIRET :</span> 123 456 789 00012</p>
                <p><span className="font-semibold text-foreground">RCS :</span> Paris B 123 456 789</p>
                <p><span className="font-semibold text-foreground">Numéro TVA intracommunautaire :</span> FR12 123456789</p>
              </div>
            </div>

            {/* Directeur de publication */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                  <Shield className="h-6 w-6 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold">Directeur de la publication</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p><span className="font-semibold text-foreground">Nom :</span> [Nom du directeur de publication]</p>
                <p><span className="font-semibold text-foreground">Qualité :</span> Président</p>
              </div>
            </div>

            {/* Contact */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30">
                  <Mail className="h-6 w-6 text-rose-400" />
                </div>
                <h2 className="text-2xl font-bold">Contact</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-rose-400" />
                  <span>contact@impartial.studio</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-rose-400" />
                  <span>+33 1 23 45 67 89</span>
                </p>
                <p className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-rose-400" />
                  <span>www.impartial.studio</span>
                </p>
              </div>
            </div>

            {/* Hébergeur */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                  <Server className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold">Hébergement</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p><span className="font-semibold text-foreground">Hébergeur :</span> Vercel Inc.</p>
                <p><span className="font-semibold text-foreground">Adresse :</span> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
                <p><span className="font-semibold text-foreground">Site web :</span> vercel.com</p>
              </div>
            </div>

            {/* Propriété intellectuelle */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Propriété intellectuelle</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                </p>
                <p>
                  La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
                </p>
                <p>
                  Les marques et logos figurant sur ce site sont des marques déposées. Toute reproduction totale ou partielle de ces marques ou de ces logos, effectuée à partir des éléments du site sans l'autorisation expresse de IMPARTIAL Studio est donc prohibée.
                </p>
              </div>
            </div>

            {/* Données personnelles */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Protection des données personnelles</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
                </p>
                <p>
                  Pour exercer ces droits ou pour toute question relative à la protection de vos données personnelles, vous pouvez nous contacter à l'adresse suivante : contact@impartial.studio
                </p>
                <p>
                  Pour plus d'informations sur la gestion de vos données personnelles, veuillez consulter notre politique de confidentialité.
                </p>
              </div>
            </div>

            {/* Limitation de responsabilité */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Limitation de responsabilité</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  IMPARTIAL Studio s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur ce site. Cependant, IMPARTIAL Studio ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.
                </p>
                <p>
                  En conséquence, IMPARTIAL Studio décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur ce site.
                </p>
                <p>
                  IMPARTIAL Studio ne saurait être tenu responsable des dommages directs ou indirects résultant de l'accès ou de l'utilisation du site, y compris l'inaccessibilité, les pertes de données, détériorations, destructions ou virus qui pourraient affecter l'équipement informatique de l'utilisateur.
                </p>
              </div>
            </div>

            {/* Liens hypertextes */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Liens hypertextes</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Le site peut contenir des liens hypertextes vers d'autres sites. IMPARTIAL Studio n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou aux éventuels collectes et transmissions de données personnelles effectuées par ces sites.
                </p>
                <p>
                  La création de liens hypertextes vers le site impartial.studio est soumise à l'accord préalable du directeur de la publication.
                </p>
              </div>
            </div>

            {/* Droit applicable */}
            <div className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Droit applicable et juridiction compétente</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
                </p>
              </div>
            </div>

            {/* Mise à jour */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Dernière mise à jour : Décembre 2024</p>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MentionsLegales;
