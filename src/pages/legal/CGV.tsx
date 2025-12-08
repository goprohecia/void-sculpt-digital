import { Layout } from "@/components/Layout";
import { FloatingParticles } from "@/components/FloatingParticles";
import { Sparkles } from "lucide-react";
import logoHero from "@/assets/logo-hero.png";

const CGV = () => {
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
                Conditions commerciales
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
              Conditions générales de <span className="text-gradient-neon">vente</span>
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
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">Article 1 - Objet</h2>
                <p className="text-muted-foreground">
                  Les présentes conditions générales de vente (CGV) régissent les relations contractuelles 
                  entre IMPARTIAL Studio et ses clients pour toute prestation de services de création 
                  digitale, développement web, développement mobile et conseil en stratégie digitale.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">Article 2 - Prestations</h2>
                <p className="text-muted-foreground mb-4">IMPARTIAL Studio propose les prestations suivantes :</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Conception et développement de sites web (vitrines, e-commerce, sur-mesure)</li>
                  <li>Développement d'applications mobiles (iOS, Android, cross-platform)</li>
                  <li>Création de backoffices et solutions SaaS</li>
                  <li>Écosystèmes digitaux complets (360°)</li>
                  <li>Maintenance et support technique</li>
                  <li>Conseil en stratégie digitale</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">Article 3 - Devis et commande</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    <strong className="text-foreground">3.1</strong> Tout projet fait l'objet d'un devis 
                    détaillé gratuit, établi après analyse des besoins du client.
                  </p>
                  <p>
                    <strong className="text-foreground">3.2</strong> Le devis est valable 30 jours à 
                    compter de sa date d'émission.
                  </p>
                  <p>
                    <strong className="text-foreground">3.3</strong> La commande est considérée comme 
                    ferme et définitive après signature du devis et versement de l'acompte prévu.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">Article 4 - Tarifs et paiement</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    <strong className="text-foreground">4.1</strong> Les prix sont indiqués en euros 
                    hors taxes (HT). La TVA applicable est ajoutée au montant HT.
                  </p>
                  <p>
                    <strong className="text-foreground">4.2</strong> Sauf accord contraire, les modalités 
                    de paiement sont les suivantes :
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>30% à la signature du devis (acompte)</li>
                    <li>40% à la validation des maquettes</li>
                    <li>30% à la livraison finale</li>
                  </ul>
                  <p>
                    <strong className="text-foreground">4.3</strong> Les paiements s'effectuent par 
                    virement bancaire dans un délai de 30 jours à compter de la date de facturation.
                  </p>
                  <p>
                    <strong className="text-foreground">4.4</strong> Tout retard de paiement entraîne 
                    de plein droit des pénalités de retard égales à trois fois le taux d'intérêt légal.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">Article 5 - Délais de réalisation</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    <strong className="text-foreground">5.1</strong> Les délais de réalisation sont 
                    indiqués dans le devis et courent à compter de la réception de l'acompte et de 
                    tous les éléments nécessaires à la réalisation du projet.
                  </p>
                  <p>
                    <strong className="text-foreground">5.2</strong> Les délais sont donnés à titre 
                    indicatif. Un retard ne peut donner lieu à aucune pénalité ou indemnité, ni 
                    motiver l'annulation de la commande.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">Article 6 - Propriété intellectuelle</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    <strong className="text-foreground">6.1</strong> Le transfert de propriété des 
                    créations est effectif après paiement intégral du prix convenu.
                  </p>
                  <p>
                    <strong className="text-foreground">6.2</strong> IMPARTIAL Studio conserve le droit 
                    de mentionner sa réalisation à titre de référence commerciale et de portfolio.
                  </p>
                  <p>
                    <strong className="text-foreground">6.3</strong> Les éléments fournis par le client 
                    (textes, images, logos) restent sa propriété. Le client garantit détenir les droits 
                    nécessaires sur ces éléments.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">Article 7 - Validation et recette</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    <strong className="text-foreground">7.1</strong> Le client dispose d'un délai de 
                    7 jours ouvrés pour valider chaque étape du projet.
                  </p>
                  <p>
                    <strong className="text-foreground">7.2</strong> L'absence de réponse dans ce délai 
                    vaut acceptation tacite.
                  </p>
                  <p>
                    <strong className="text-foreground">7.3</strong> Le nombre de révisions est limité 
                    selon les termes du devis. Toute révision supplémentaire fera l'objet d'une 
                    facturation additionnelle.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">Article 8 - Garantie et maintenance</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    <strong className="text-foreground">8.1</strong> IMPARTIAL Studio garantit le bon 
                    fonctionnement des réalisations pendant une période de 3 mois suivant la livraison.
                  </p>
                  <p>
                    <strong className="text-foreground">8.2</strong> Cette garantie couvre la correction 
                    des bugs et dysfonctionnements, à l'exclusion des modifications demandées par le client.
                  </p>
                  <p>
                    <strong className="text-foreground">8.3</strong> Au-delà de la période de garantie, 
                    un contrat de maintenance peut être souscrit selon les conditions en vigueur.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">Article 9 - Responsabilité</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    <strong className="text-foreground">9.1</strong> IMPARTIAL Studio s'engage à 
                    apporter tout le soin et la diligence nécessaires à la réalisation des prestations.
                  </p>
                  <p>
                    <strong className="text-foreground">9.2</strong> La responsabilité d'IMPARTIAL Studio 
                    est limitée au montant des sommes effectivement perçues au titre du contrat.
                  </p>
                  <p>
                    <strong className="text-foreground">9.3</strong> IMPARTIAL Studio ne saurait être 
                    tenu responsable des dommages indirects ou immatériels.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">Article 10 - Résiliation</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    <strong className="text-foreground">10.1</strong> En cas d'annulation par le client 
                    après signature du devis, les acomptes versés restent acquis à IMPARTIAL Studio.
                  </p>
                  <p>
                    <strong className="text-foreground">10.2</strong> Les travaux déjà réalisés seront 
                    facturés au prorata du travail effectué.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">Article 11 - Confidentialité</h2>
                <p className="text-muted-foreground">
                  Les parties s'engagent à maintenir confidentielles toutes les informations échangées 
                  dans le cadre de leur collaboration, pendant et après la durée du contrat.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">Article 12 - Litiges</h2>
                <p className="text-muted-foreground">
                  Les présentes CGV sont régies par le droit français. En cas de litige, les parties 
                  s'engagent à rechercher une solution amiable. À défaut d'accord, les tribunaux de 
                  Paris seront seuls compétents.
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

export default CGV;