import { Layout } from "@/components/Layout";


const Cookies = () => {
  return (
    <Layout>
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-violet/10 via-transparent to-transparent" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse-glow" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              <div className="badge-gradient flex items-center gap-2 text-sm font-medium text-violet-300">
                Politique de cookies
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-center">
              <span className="text-gradient-neon">Cookies</span>
            </h1>

            <div className="prose prose-invert prose-violet max-w-none space-y-8">
              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">1. Qu'est-ce qu'un cookie ?</h2>
                <p className="text-muted-foreground">
                  Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou mobile) lors de votre visite sur notre site. Il permet de conserver des données utilisateur afin de faciliter la navigation et d'améliorer votre expérience.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">2. Types de cookies utilisés</h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground">Cookies essentiels</h3>
                    <p>Nécessaires au fonctionnement du site. Ils permettent d'utiliser les principales fonctionnalités du site.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Cookies analytiques</h3>
                    <p>Permettent de mesurer l'audience du site et d'analyser la façon dont les visiteurs l'utilisent.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Cookies fonctionnels</h3>
                    <p>Permettent de mémoriser vos préférences et de personnaliser votre expérience.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Cookies marketing</h3>
                    <p>Utilisés pour le suivi des visiteurs et afficher des publicités pertinentes.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">3. Durée de conservation</h2>
                <p className="text-muted-foreground">
                  Les cookies sont conservés pour une durée maximale de 13 mois conformément aux recommandations de la CNIL. À l'expiration de ce délai, votre consentement sera à nouveau requis.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">4. Gestion des cookies</h2>
                <p className="text-muted-foreground">
                  Vous pouvez à tout moment modifier vos préférences en matière de cookies via le bouton "Préférences cookies" situé en bas de chaque page, ou en paramétrant votre navigateur pour accepter ou refuser les cookies.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">5. Cookies tiers</h2>
                <p className="text-muted-foreground">
                  Certains cookies tiers peuvent être déposés par nos partenaires pour les besoins de mesure d'audience ou de personnalisation du contenu. Ces cookies sont soumis aux politiques de confidentialité de ces tiers.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">6. Vos droits</h2>
                <p className="text-muted-foreground">
                  Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Pour exercer ces droits, contactez-nous à contact@impartialgames.com.
                </p>
              </div>

              <p className="text-sm text-muted-foreground text-center pt-8">
                Dernière mise à jour : Décembre 2025
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cookies;
