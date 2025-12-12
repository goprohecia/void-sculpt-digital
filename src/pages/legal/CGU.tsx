import { Layout } from "@/components/Layout";
import { Sparkles } from "lucide-react";

const CGU = () => {
  return (
    <Layout>
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-violet/10 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-violet-600/15 rounded-full blur-[120px] animate-pulse-glow" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              <div className="badge-gradient flex items-center gap-2 text-sm font-medium text-violet-300">
                <Sparkles className="h-4 w-4" />
                Conditions générales d'utilisation
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-center">
              <span className="text-gradient-neon">CGU</span>
            </h1>

            <div className="prose prose-invert prose-violet max-w-none space-y-8">
              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">1. Objet</h2>
                <p className="text-muted-foreground">
                  Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions d'utilisation des services proposés sur le site IMPARTIAL Studio, ainsi que de définir les droits et obligations des parties dans ce cadre.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">2. Mentions légales</h2>
                <p className="text-muted-foreground mb-4">
                  Le site impartial.studio est édité par IMPARTIAL Studio.<br />
                  Siège social : Paris, France<br />
                  Email : contact@impartial.studio
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">3. Accès au site</h2>
                <p className="text-muted-foreground">
                  L'accès au site et son utilisation sont réservés à un usage strictement personnel. Vous vous engagez à ne pas utiliser ce site et les informations ou données qui y figurent à des fins commerciales, politiques, publicitaires et pour toute forme de sollicitation commerciale.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">4. Propriété intellectuelle</h2>
                <p className="text-muted-foreground">
                  Tout le contenu du présent site, incluant, de façon non limitative, les graphismes, images, textes, vidéos, animations, sons, logos, gifs et icônes ainsi que leur mise en forme sont la propriété exclusive d'IMPARTIAL Studio à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">5. Protection des données</h2>
                <p className="text-muted-foreground">
                  Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">6. Limitation de responsabilité</h2>
                <p className="text-muted-foreground">
                  IMPARTIAL Studio ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications, soit de l'apparition d'un bug ou d'une incompatibilité.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-glass-dark/80 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 text-neon-violet">7. Droit applicable</h2>
                <p className="text-muted-foreground">
                  Les présentes conditions sont régies par les lois françaises et toute contestation ou litige qui pourrait naître de l'interprétation ou de l'exécution de celles-ci seront de la compétence exclusive des tribunaux de Paris.
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

export default CGU;
