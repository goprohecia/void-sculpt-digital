import { Layout } from "@/components/Layout";
import { FloatingParticles } from "@/components/FloatingParticles";
import { Sparkles } from "lucide-react";
import logoHero from "@/assets/logo-hero.png";

const PolitiqueConfidentialite = () => {
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
                Protection des données
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
              Politique de <span className="text-gradient-neon">confidentialité</span>
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
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">1. Introduction</h2>
                <p className="text-muted-foreground">
                  IMPARTIAL Studio s'engage à protéger la vie privée des utilisateurs de son site. 
                  Cette politique de confidentialité explique comment nous collectons, utilisons, 
                  stockons et protégeons vos données personnelles conformément au Règlement Général 
                  sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">2. Responsable du traitement</h2>
                <div className="text-muted-foreground space-y-2">
                  <p><strong className="text-foreground">Raison sociale :</strong> IMPARTIAL Studio</p>
                  <p><strong className="text-foreground">Adresse :</strong> Paris, France</p>
                  <p><strong className="text-foreground">Email :</strong> contact@impartial.studio</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">3. Données collectées</h2>
                <p className="text-muted-foreground mb-4">Nous pouvons collecter les données suivantes :</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Données d'identification : nom, prénom, adresse email, numéro de téléphone</li>
                  <li>Données professionnelles : nom de l'entreprise, fonction</li>
                  <li>Données de navigation : adresse IP, type de navigateur, pages visitées</li>
                  <li>Données de communication : messages envoyés via le formulaire de contact</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">4. Finalités du traitement</h2>
                <p className="text-muted-foreground mb-4">Vos données sont collectées pour :</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Répondre à vos demandes de contact et de devis</li>
                  <li>Améliorer nos services et notre site web</li>
                  <li>Vous envoyer des informations commerciales (avec votre consentement)</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">5. Base légale du traitement</h2>
                <p className="text-muted-foreground">
                  Le traitement de vos données repose sur : votre consentement, l'exécution d'un contrat, 
                  le respect de nos obligations légales, ou notre intérêt légitime à développer notre activité.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">6. Destinataires des données</h2>
                <p className="text-muted-foreground">
                  Vos données personnelles sont destinées uniquement au personnel habilité d'IMPARTIAL Studio. 
                  Elles peuvent être transmises à nos sous-traitants techniques (hébergeur, outils d'analyse) 
                  qui agissent en notre nom et selon nos instructions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">7. Durée de conservation</h2>
                <p className="text-muted-foreground">
                  Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles 
                  elles ont été collectées, ou pendant la durée requise par la loi. Les données de 
                  prospection sont conservées 3 ans à compter du dernier contact.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">8. Vos droits</h2>
                <p className="text-muted-foreground mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Droit d'accès à vos données personnelles</li>
                  <li>Droit de rectification des données inexactes</li>
                  <li>Droit à l'effacement (droit à l'oubli)</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit à la portabilité de vos données</li>
                  <li>Droit d'opposition au traitement</li>
                  <li>Droit de retirer votre consentement à tout moment</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Pour exercer ces droits, contactez-nous à : contact@impartial.studio
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">9. Sécurité</h2>
                <p className="text-muted-foreground">
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour 
                  protéger vos données personnelles contre la destruction, la perte, l'altération, 
                  la divulgation ou l'accès non autorisé.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">10. Réclamation</h2>
                <p className="text-muted-foreground">
                  Si vous estimez que le traitement de vos données personnelles constitue une violation 
                  du RGPD, vous avez le droit d'introduire une réclamation auprès de la CNIL 
                  (Commission Nationale de l'Informatique et des Libertés) : www.cnil.fr
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

export default PolitiqueConfidentialite;