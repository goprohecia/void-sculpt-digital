import { Layout } from "@/components/Layout";
import { FloatingParticles } from "@/components/FloatingParticles";
import { Sparkles } from "lucide-react";
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
            <div className="mb-6 flex justify-center opacity-0 animate-fade-in">
              <div className="badge-gradient flex items-center gap-2 text-sm font-medium text-violet-300">
                <Sparkles className="h-4 w-4" />
                Informations légales
              </div>
            </div>
            
            <div className="mb-8 flex justify-center opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="relative">
                <div className="absolute inset-0 bg-neon-violet/50 blur-[60px] rounded-full scale-110 animate-pulse-glow" />
                <img
                  src={logoHero}
                  alt="IMPARTIAL"
                  className="relative w-24 h-24 drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Mentions <span className="text-gradient-neon">légales</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-glass-dark/80 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-white/10 space-y-8">
              
              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">1. Éditeur du site</h2>
                <div className="text-muted-foreground space-y-2">
                  <p><strong className="text-foreground">Raison sociale :</strong> IMPARTIAL Studio</p>
                  <p><strong className="text-foreground">Forme juridique :</strong> [À compléter]</p>
                  <p><strong className="text-foreground">Capital social :</strong> [À compléter]</p>
                  <p><strong className="text-foreground">Siège social :</strong> Paris, France</p>
                  <p><strong className="text-foreground">SIRET :</strong> [À compléter]</p>
                  <p><strong className="text-foreground">RCS :</strong> [À compléter]</p>
                  <p><strong className="text-foreground">Numéro de TVA :</strong> [À compléter]</p>
                  <p><strong className="text-foreground">Email :</strong> contact@impartial.studio</p>
                  <p><strong className="text-foreground">Téléphone :</strong> +33 1 23 45 67 89</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">2. Directeur de la publication</h2>
                <p className="text-muted-foreground">
                  Le directeur de la publication est [Nom du directeur], en qualité de [Fonction].
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">3. Hébergement</h2>
                <div className="text-muted-foreground space-y-2">
                  <p><strong className="text-foreground">Hébergeur :</strong> [Nom de l'hébergeur]</p>
                  <p><strong className="text-foreground">Adresse :</strong> [Adresse de l'hébergeur]</p>
                  <p><strong className="text-foreground">Téléphone :</strong> [Téléphone de l'hébergeur]</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">4. Propriété intellectuelle</h2>
                <p className="text-muted-foreground">
                  L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes, sons, logiciels, etc.) 
                  est la propriété exclusive d'IMPARTIAL Studio ou de ses partenaires et est protégé par les lois 
                  françaises et internationales relatives à la propriété intellectuelle. Toute reproduction, 
                  représentation, modification, publication, adaptation de tout ou partie des éléments du site, 
                  quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">5. Limitation de responsabilité</h2>
                <p className="text-muted-foreground">
                  IMPARTIAL Studio s'efforce de fournir sur le site des informations aussi précises que possible. 
                  Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes et des carences 
                  dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui 
                  fournissent ces informations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">6. Liens hypertextes</h2>
                <p className="text-muted-foreground">
                  Le site peut contenir des liens hypertextes vers d'autres sites. IMPARTIAL Studio n'exerce 
                  aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou aux 
                  éventuels dommages qui pourraient résulter de leur utilisation.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">7. Droit applicable</h2>
                <p className="text-muted-foreground">
                  Les présentes mentions légales sont régies par le droit français. En cas de litige, 
                  les tribunaux français seront seuls compétents.
                </p>
              </section>

              <div className="pt-8 border-t border-white/10">
                <p className="text-sm text-muted-foreground">
                  Dernière mise à jour : Décembre 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MentionsLegales;