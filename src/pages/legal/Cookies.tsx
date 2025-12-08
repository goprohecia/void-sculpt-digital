import { Layout } from "@/components/Layout";
import { FloatingParticles } from "@/components/FloatingParticles";
import { Sparkles } from "lucide-react";
import logoHero from "@/assets/logo-hero.png";

const Cookies = () => {
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
                Gestion des cookies
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
              Politique de <span className="text-gradient-neon">cookies</span>
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
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">1. Qu'est-ce qu'un cookie ?</h2>
                <p className="text-muted-foreground">
                  Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, 
                  smartphone) lors de la visite d'un site web. Il permet au site de mémoriser des 
                  informations sur votre visite, comme votre langue préférée et d'autres paramètres, 
                  facilitant ainsi votre prochaine visite et rendant le site plus utile pour vous.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">2. Les cookies que nous utilisons</h2>
                
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="font-semibold text-emerald-400 mb-2">Cookies essentiels</h3>
                    <p className="text-muted-foreground text-sm">
                      Ces cookies sont indispensables au fonctionnement du site. Ils permettent d'utiliser 
                      les principales fonctionnalités du site (par exemple, accès à votre compte). 
                      Sans ces cookies, vous ne pourrez pas utiliser notre site normalement.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="font-semibold text-neon-violet mb-2">Cookies analytiques</h3>
                    <p className="text-muted-foreground text-sm">
                      Ces cookies nous permettent de mesurer l'audience de notre site, de comprendre 
                      comment les visiteurs l'utilisent et d'améliorer son fonctionnement. Ils collectent 
                      des informations de manière anonyme.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="font-semibold text-rose-400 mb-2">Cookies de fonctionnalité</h3>
                    <p className="text-muted-foreground text-sm">
                      Ces cookies permettent de personnaliser votre expérience sur notre site en 
                      mémorisant vos préférences (langue, région, etc.).
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">3. Durée de conservation</h2>
                <p className="text-muted-foreground">
                  Les cookies ont une durée de vie limitée. La durée maximale de conservation des cookies 
                  est de 13 mois conformément aux recommandations de la CNIL. Au-delà de cette période, 
                  votre consentement sera à nouveau requis.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">4. Gestion des cookies</h2>
                <p className="text-muted-foreground mb-4">
                  Vous pouvez à tout moment choisir de désactiver ces cookies. Votre navigateur peut 
                  également être paramétré pour vous signaler les cookies qui sont déposés dans votre 
                  terminal et vous demander de les accepter ou non.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Pour Chrome :</h4>
                    <p className="text-muted-foreground text-sm">
                      Menu → Paramètres → Afficher les paramètres avancés → Confidentialité → Paramètres de contenu
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Pour Firefox :</h4>
                    <p className="text-muted-foreground text-sm">
                      Menu → Options → Vie privée → Historique → Paramètres personnalisés
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Pour Safari :</h4>
                    <p className="text-muted-foreground text-sm">
                      Menu → Préférences → Confidentialité
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Pour Edge :</h4>
                    <p className="text-muted-foreground text-sm">
                      Menu → Paramètres → Afficher les paramètres avancés → Cookies
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">5. Conséquences du refus</h2>
                <p className="text-muted-foreground">
                  Si vous refusez l'enregistrement de cookies, ou si vous supprimez ceux enregistrés 
                  sur votre terminal, vous pourrez toujours naviguer sur notre site. Toutefois, 
                  certaines fonctionnalités pourraient ne pas fonctionner correctement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">6. Plus d'informations</h2>
                <p className="text-muted-foreground">
                  Pour plus d'informations sur les cookies et leur gestion, vous pouvez consulter 
                  le site de la CNIL : <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs" 
                  target="_blank" rel="noopener noreferrer" className="text-neon-violet hover:underline">
                  www.cnil.fr/fr/cookies-et-autres-traceurs</a>
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

export default Cookies;