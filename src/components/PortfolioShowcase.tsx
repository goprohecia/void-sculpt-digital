import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, Sparkles, ArrowRight } from "lucide-react";
import { 
  ScrollReveal, 
  SectionTransition,
  ParallaxBackground,
  Hover3DCard,
} from "@/components/animations";

// Portfolio projects data (shared with Portfolio page)
export const portfolioProjects = [
  {
    id: 1,
    title: "WeClose Agency",
    category: "web",
    description: "Site vitrine moderne pour agence de closing avec animations premium.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    tags: ["React", "Tailwind"],
    client: "WeClose",
    url: "https://wecloseagency.fr/",
  },
  {
    id: 2,
    title: "Altarys Group",
    category: "backoffice",
    description: "Plateforme de gestion avec dashboard administratif complet.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    tags: ["Dashboard", "CRM"],
    client: "Altarys",
    url: "https://altarys-group.fr/",
  },
  {
    id: 3,
    title: "Go Prophecia",
    category: "gaming",
    description: "Jeu vidéo immersif avec système de progression et matchmaking.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
    tags: ["Gaming", "WebGL"],
    client: "Prophecia",
    url: "https://goprophecia.gg?inviteCode=YANNI-DZ94",
  },
];

const categoryColors: Record<string, { text: string; bg: string; border: string }> = {
  web: { text: "text-neon-violet", bg: "bg-neon-violet/10", border: "border-neon-violet/30" },
  backoffice: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" },
  gaming: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
};

export function PortfolioShowcase() {
  return (
    <SectionTransition className="py-24 relative overflow-hidden" parallaxStrength={0.05}>
      {/* Background Effects */}
      <ParallaxBackground speed={0.2}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[120px]" />
      </ParallaxBackground>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal variant="fadeInUp">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-neon-violet/10 border border-neon-violet/30">
              <Sparkles className="h-4 w-4 text-neon-violet" />
              <span className="text-sm font-medium text-neon-violet">Nos réalisations</span>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Projets <span className="text-gradient-neon">récents</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez quelques-unes de nos réalisations pour des clients qui nous font confiance.
            </p>
          </ScrollReveal>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {portfolioProjects.map((project, index) => {
            const colors = categoryColors[project.category] || categoryColors.web;
            
            return (
              <ScrollReveal key={project.id} variant="fadeInUp" delay={index * 0.1}>
                <Hover3DCard className="h-full rounded-2xl" rotateStrength={6}>
                  <a 
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <div className="h-full bg-glass-dark/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-neon-violet/40 transition-all duration-500 group">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        
                        {/* Category Badge */}
                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${colors.text} ${colors.bg} ${colors.border} border backdrop-blur-sm`}>
                          {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                        </div>
                        
                        {/* External Link Icon */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                            <ExternalLink className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold group-hover:text-neon-violet transition-colors">
                            {project.title}
                          </h3>
                        </div>
                        {project.client && (
                          <p className="text-sm text-neon-violet/70 mb-2">
                            Client: {project.client}
                          </p>
                        )}
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs rounded-md bg-white/5 border border-white/10 text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </a>
                </Hover3DCard>
              </ScrollReveal>
            );
          })}
        </div>

        {/* CTA */}
        <ScrollReveal variant="fadeInUp" delay={0.4}>
          <div className="text-center">
            <Link 
              to="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neon-violet/10 border border-neon-violet/30 text-neon-violet font-medium hover:bg-neon-violet/20 hover:border-neon-violet/50 transition-all duration-300"
            >
              Voir tous nos projets
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </SectionTransition>
  );
}
