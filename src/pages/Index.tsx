import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { FloatingParticles } from "@/components/FloatingParticles";
import { ArrowRight, Globe, Smartphone, Server, Layers, Sparkles } from "lucide-react";
import logoHero from "@/assets/logo-hero.png";
const services = [{
  icon: Globe,
  title: "Sites Web & Vitrines",
  description: "Architectures web immersives, du site vitrine au e-commerce puissant.",
  href: "/services/web",
  color: "neon-violet"
}, {
  icon: Smartphone,
  title: "Applications Mobiles",
  description: "Apps natives et cross-platform fluides pour engager vos utilisateurs.",
  href: "/services/mobile",
  color: "neon-green"
}, {
  icon: Server,
  title: "Backoffice & SaaS",
  description: "Dashboards puissants et automatisations pour piloter votre activité.",
  href: "/services/backoffice",
  color: "neon-red"
}, {
  icon: Layers,
  title: "Écosystème 360°",
  description: "L'alliance parfaite : Site + App + Backoffice. La solution ultime.",
  href: "/services/360",
  color: "tier-custom"
}];
const Index = () => {
  return <Layout>
      {/* Floating Particles Background */}
      <FloatingParticles />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-neon-violet/10 via-transparent to-neon-blue/5" />
        <div className="absolute inset-0 grid-bg" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[180px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[150px] animate-pulse-glow" style={{
        animationDelay: "1s"
      }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="mb-8 flex justify-center opacity-0 animate-fade-in">
              <div className="badge-gradient flex items-center gap-2 text-sm font-medium text-violet-300">
                <Sparkles className="h-4 w-4" />
                Studio Digital Gaming & Tech
              </div>
            </div>

            {/* Logo */}
            <div className="mb-8 flex justify-center opacity-0 animate-fade-in" style={{
            animationDelay: "0.1s"
          }}>
              <div className="relative">
                <div className="absolute inset-0 bg-neon-violet/60 blur-[80px] rounded-full scale-110" />
                <div className="absolute inset-0 bg-violet-500/40 blur-[50px] rounded-full" />
                <img 
                  src={logoHero} 
                  alt="Impartial Logo" 
                  className="relative h-48 md:h-64 lg:h-72 w-auto drop-shadow-[0_0_50px_rgba(139,92,246,0.7)] drop-shadow-[0_0_100px_rgba(139,92,246,0.4)]"
                />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight opacity-0 animate-fade-in-up" style={{
            animationDelay: "0.2s"
          }}>
              <span className="text-gradient-neon">IMPARTIAL</span>
            </h1>

            <p className="text-2xl md:text-3xl font-light text-muted-foreground mb-4 opacity-0 animate-fade-in-up" style={{
            animationDelay: "0.35s"
          }}>
              Créateurs d'expériences digitales
            </p>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 opacity-0 animate-fade-in-up" style={{
            animationDelay: "0.5s"
          }}>
              Nous transformons vos idées en solutions digitales performantes : sites web, applications mobiles et écosystèmes complets.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up" style={{
            animationDelay: "0.65s"
          }}>
              <Link to="/contact" className="btn-gradient inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-xl">
                Démarrer un projet
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/portfolio" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border bg-card/50 font-semibold rounded-xl transition-all duration-300 hover:bg-secondary hover:border-primary/50">
                Voir nos réalisations
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{
        animationDelay: "1s"
      }}>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-muted-foreground rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 relative">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-neon-violet/10 border border-neon-violet/30">
              <Sparkles className="h-4 w-4 text-neon-violet" />
              <span className="text-sm font-medium text-neon-violet">Services Premium</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Nos Expertises</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des solutions digitales complètes pour propulser votre business vers de nouveaux sommets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
            const colorClasses = {
              'neon-violet': {
                bg: 'bg-neon-violet/10',
                icon: 'text-neon-violet',
                border: 'group-hover:border-neon-violet/50',
                shadow: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]',
                glow: 'group-hover:bg-neon-violet/20'
              },
              'neon-green': {
                bg: 'bg-emerald-500/10',
                icon: 'text-emerald-400',
                border: 'group-hover:border-emerald-500/50',
                shadow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]',
                glow: 'group-hover:bg-emerald-500/20'
              },
              'neon-red': {
                bg: 'bg-rose-500/10',
                icon: 'text-rose-400',
                border: 'group-hover:border-rose-500/50',
                shadow: 'group-hover:shadow-[0_0_40px_rgba(244,63,94,0.15)]',
                glow: 'group-hover:bg-rose-500/20'
              },
              'tier-custom': {
                bg: 'bg-gradient-to-br from-neon-violet/10 to-blue-500/10',
                icon: 'text-violet-400',
                border: 'group-hover:border-violet-500/50',
                shadow: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]',
                glow: 'group-hover:bg-gradient-to-br group-hover:from-neon-violet/20 group-hover:to-blue-500/20'
              }
            };
            const colors = colorClasses[service.color as keyof typeof colorClasses];
            return <Link key={service.href} to={service.href} className={`group relative p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 ${colors.border} ${colors.shadow}`} style={{
              animationDelay: `${index * 0.1}s`
            }}>
                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colors.glow}`} />
                  
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className={`h-7 w-7 ${colors.icon}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">{service.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 group-hover:text-gray-300 transition-colors">{service.description}</p>
                    <span className={`inline-flex items-center gap-1 text-sm font-medium ${colors.icon} group-hover:gap-3 transition-all duration-300`}>
                      Explorer
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>;
          })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-neon-violet/10 via-purple-600/10 to-blue-600/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[180px]" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Glassmorphism Card */}
            <div className="bg-glass-dark/60 backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-white/10 text-center relative overflow-hidden">
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/5 via-transparent to-purple-600/5 rounded-3xl" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-neon-violet/10 border border-neon-violet/30">
                  <Sparkles className="h-4 w-4 text-neon-violet" />
                  <span className="text-sm font-medium text-neon-violet">Démarrer un projet</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Prêt à <span className="text-gradient-neon">révolutionner</span> votre présence digitale ?
                </h2>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Discutons de votre projet et créons ensemble quelque chose d'extraordinaire.
                </p>
                <Link to="/contact" className="btn-gradient inline-flex items-center justify-center gap-3 px-10 py-5 text-white font-semibold rounded-xl text-lg">
                  Commencer maintenant
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
};
export default Index;