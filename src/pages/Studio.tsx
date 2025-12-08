import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Target, Users, Sparkles } from "lucide-react";
import logo from "@/assets/logo-impartial.png";

const values = [
  {
    icon: Zap,
    title: "Innovation",
    description: "Nous repoussons constamment les limites du possible pour créer des expériences uniques.",
    color: "neon-blue",
  },
  {
    icon: Target,
    title: "Précision",
    description: "Chaque pixel, chaque ligne de code est pensée pour la perfection.",
    color: "neon-green",
  },
  {
    icon: Users,
    title: "Partenariat",
    description: "Nous ne sommes pas un prestataire, mais votre partenaire de croissance digital.",
    color: "neon-red",
  },
  {
    icon: Sparkles,
    title: "Excellence",
    description: "Notre standard est l'excellence, notre objectif est de dépasser vos attentes.",
    color: "tier-custom",
  },
];

const Studio = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-green/10 to-transparent opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <img
                src={logo}
                alt="IMPARTIAL"
                className="w-24 h-24 animate-float opacity-0 animate-fade-in"
              />
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.15s" }}
            >
              Le Studio IMPARTIAL
            </h1>
            <p
              className="text-xl text-muted-foreground opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              Un collectif de créatifs et de technologues passionnés, unis par une vision : 
              transformer vos idées en expériences digitales extraordinaires.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Notre Vision</h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Chez IMPARTIAL, nous croyons que le digital ne doit pas être un compromis. 
                Nous fusionnons l'esthétique gaming et tech avec une approche premium pour 
                créer des expériences qui marquent les esprits.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Notre nom ? <span className="text-foreground font-medium">IMPARTIAL</span>. 
                Parce que nous abordons chaque projet sans préjugé, avec un regard neuf et 
                une objectivité totale pour trouver LA meilleure solution pour vous.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-neon-blue/20 via-neon-green/10 to-neon-red/20 border border-border/50 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-7xl md:text-8xl font-black text-gradient-neon mb-4">
                    100%
                  </div>
                  <p className="text-xl text-muted-foreground">Engagement client</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 relative bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Valeurs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Les piliers qui guident chacune de nos créations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="p-8 rounded-2xl bg-background border border-border hover:border-muted-foreground transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-xl bg-${value.color}/10 flex items-center justify-center mb-6`}>
                  <value.icon className={`h-7 w-7 text-${value.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à rejoindre l'aventure ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Discutons de votre projet et voyons comment nous pouvons créer quelque chose d'exceptionnel ensemble.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-foreground text-background font-semibold rounded-xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
            >
              Nous contacter
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Studio;
