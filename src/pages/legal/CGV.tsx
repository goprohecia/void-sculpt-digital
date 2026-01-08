import { Layout } from "@/components/Layout";
const CGV = () => {
  return <Layout>
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-violet/10 via-transparent to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-purple-600/15 rounded-full blur-[120px] animate-pulse-glow" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-center">
              <span className="text-gradient-neon">CGV</span>
            </h1>

            <div className="prose prose-invert prose-violet max-w-none space-y-8">
              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">1. Préambule</h2>
                <p className="text-muted-foreground">
                  Les présentes Conditions Générales de Vente (CGV) s'appliquent à toutes les prestations de services conclues par IMPARTIAL Studio auprès de ses clients professionnels ou particuliers.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">2. Services proposés</h2>
                <p className="text-muted-foreground">
                  IMPARTIAL Studio propose des prestations de création digitale incluant :
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Conception et développement de sites web</li>
                  <li>Développement d'applications mobiles</li>
                  <li>Création de backoffices et solutions SaaS</li>
                  <li>Écosystèmes digitaux complets (360°)</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">3. Devis et commandes</h2>
                <p className="text-muted-foreground">
                  Chaque projet fait l'objet d'un devis personnalisé établi après analyse des besoins du client. Le devis est valable 30 jours à compter de sa date d'émission. La commande est considérée comme ferme après acceptation du devis par le client et versement de l'acompte prévu.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">4. Tarifs et paiement</h2>
                <p className="text-muted-foreground">Les prix sont établis sur devis et exprimés en euros hors taxes. Le règlement s'effectue selon les modalités suivantes : 50% à la commande et 50% à la livraison.</p>
              </div>

              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">5. Délais de réalisation</h2>
                <p className="text-muted-foreground">
                  Les délais de réalisation sont indiqués sur le devis et courent à compter de la réception de l'acompte et de l'ensemble des éléments nécessaires à la réalisation du projet. Tout retard dans la fourniture des éléments par le client repousse d'autant le délai de livraison.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">6. Propriété intellectuelle</h2>
                <p className="text-muted-foreground">
                  La cession des droits de propriété intellectuelle sur les créations réalisées n'intervient qu'après paiement intégral du prix. Jusqu'au paiement complet, IMPARTIAL Studio reste propriétaire des créations.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">7. Garantie et maintenance</h2>
                <p className="text-muted-foreground">
                  IMPARTIAL Studio garantit la conformité des prestations réalisées pendant une durée de 3 mois à compter de la livraison. Cette garantie couvre les corrections de bugs mais exclut les évolutions fonctionnelles.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">8. Résiliation</h2>
                <p className="text-muted-foreground">
                  En cas de résiliation anticipée par le client, les sommes déjà versées restent acquises à IMPARTIAL Studio au titre des travaux réalisés et du préjudice subi.
                </p>
              </div>

              <p className="text-sm text-muted-foreground text-center pt-8">
                Dernière mise à jour : Décembre 2025
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
};
export default CGV;