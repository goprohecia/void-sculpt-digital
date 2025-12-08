import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Testimonials } from "@/components/Testimonials";
import { ArrowRight, Globe, Smartphone, Server, Layers } from "lucide-react";
import logoAnimated from "@/assets/logo-animated.mp4";

const services = [
  {
    icon: Globe,
    title: "Sites Web & Vitrines",
    description: "Architectures web immersives, du site vitrine au e-commerce puissant.",
    href: "/services/web",
    color: "neon-blue",
  },
  {
    icon: Smartphone,
    title: "Applications Mobiles",
    description: "Apps natives et cross-platform fluides pour engager vos utilisateurs.",
    href: "/services/mobile",
    color: "neon-green",
  },
  {
    icon: Server,
    title: "Backoffice & SaaS",
    description: "Dashboards puissants et automatisations pour piloter votre activité.",
    href: "/services/backoffice",
    color: "neon-red",
  },
  {
    icon: Layers,
    title: "Écosystème 360°",
    description: "L'alliance parfaite : Site + App + Backoffice. La solution ultime.",
    href: "/services/360",
    color: "tier-custom",
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/5 via-transparent to-neon-red/5" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-red/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: "1s" }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Logo */}
            <div className="mb-8 flex justify-center opacity-0 animate-fade-in">
              <video
                src={logoAnimated}
                autoPlay
                loop
                muted
                playsInline
                className="w-32 h-32 md:w-40 md:h-40 object-contain animate-float"
              />
            </div>

            {/* Title */}
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="text-gradient-neon">IMPARTIAL</span>
            </h1>

            <p
              className="text-2xl md:text-3xl font-light text-muted-foreground mb-4 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.35s" }}
            >
              Studio Digital Premium
            </p>

            <p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
            >
              Nous créons des expériences digitales immersives qui transforment les marques ambitieuses en références incontournables.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.65s" }}
            >
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                Démarrer un projet
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/studio"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border bg-transparent font-semibold rounded-xl transition-all duration-300 hover:bg-secondary hover:border-muted-foreground"
              >
                Découvrir le studio
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: "1s" }}>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-muted-foreground rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Expertises</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des solutions digitales complètes pour propulser votre business vers de nouveaux sommets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link
                key={service.href}
                to={service.href}
                className="group p-8 rounded-2xl bg-card/50 border border-border hover:border-muted-foreground transition-all duration-500 hover:scale-[1.02] hover:shadow-lg"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-${service.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <service.icon className={`h-7 w-7 text-${service.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                <span className={`inline-flex items-center gap-1 text-sm font-medium text-${service.color} group-hover:gap-2 transition-all`}>
                  Explorer
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 via-neon-green/10 to-neon-red/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Prêt à révolutionner votre présence digitale ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Discutons de votre projet et créons ensemble quelque chose d'extraordinaire.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-foreground text-background font-semibold rounded-xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
            >
              Commencer maintenant
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
