import { useState } from "react";
import { Layout } from "@/components/Layout";
import { FloatingParticles } from "@/components/FloatingParticles";
import { ExternalLink, Eye, Sparkles } from "lucide-react";
import { useParallax } from "@/hooks/use-parallax";
import logoHero from "@/assets/logo-hero.png";

interface Project {
  id: number;
  title: string;
  category: "web" | "mobile" | "backoffice" | "360";
  description: string;
  image: string;
  tags: string[];
  client?: string;
  year: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Premium",
    category: "web",
    description: "Plateforme e-commerce haute performance avec tunnel de vente optimisé et paiements sécurisés.",
    image: "https://images.unsplash.com/photo-1661956602116-aa6865609028?w=600&h=400&fit=crop",
    tags: ["React", "Stripe", "SEO"],
    client: "Fashion Brand",
    year: "2024",
  },
  {
    id: 2,
    title: "App Fitness Tracker",
    category: "mobile",
    description: "Application mobile cross-platform pour le suivi d'entraînements avec synchronisation temps réel.",
    image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=600&h=400&fit=crop",
    tags: ["React Native", "Firebase", "HealthKit"],
    client: "FitLife",
    year: "2024",
  },
  {
    id: 3,
    title: "Dashboard Analytics",
    category: "backoffice",
    description: "Tableau de bord administratif avec visualisation de données en temps réel et reporting automatisé.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    tags: ["TypeScript", "D3.js", "PostgreSQL"],
    client: "DataCorp",
    year: "2023",
  },
  {
    id: 4,
    title: "Écosystème Startup",
    category: "360",
    description: "Solution complète Site + App + Backoffice pour une startup fintech en croissance.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    tags: ["Full Stack", "Microservices", "AWS"],
    client: "FinTech Plus",
    year: "2024",
  },
  {
    id: 5,
    title: "Site Vitrine Luxe",
    category: "web",
    description: "Site vitrine élégant avec animations premium pour une marque de joaillerie haut de gamme.",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=400&fit=crop",
    tags: ["Next.js", "GSAP", "CMS"],
    client: "Maison Bijoux",
    year: "2023",
  },
  {
    id: 6,
    title: "App Livraison",
    category: "mobile",
    description: "Application de livraison avec géolocalisation temps réel et notifications push.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    tags: ["Flutter", "Google Maps", "Socket.io"],
    client: "QuickDeliver",
    year: "2023",
  },
  {
    id: 7,
    title: "CRM Immobilier",
    category: "backoffice",
    description: "Solution CRM sur mesure pour la gestion de biens immobiliers et leads qualifiés.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    tags: ["Vue.js", "Supabase", "AI"],
    client: "ImmoGroup",
    year: "2024",
  },
  {
    id: 8,
    title: "Plateforme SaaS",
    category: "360",
    description: "Plateforme SaaS B2B complète avec abonnements, API et intégrations tierces.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
    tags: ["Node.js", "Stripe", "Kubernetes"],
    client: "CloudTech",
    year: "2024",
  },
];

const categories = [
  { id: "all", name: "Tous" },
  { id: "web", name: "Web" },
  { id: "mobile", name: "Mobile" },
  { id: "backoffice", name: "Backoffice" },
  { id: "360", name: "360°" },
];

const categoryColors: Record<string, { border: string; text: string; bg: string; shadow: string }> = {
  web: { border: "border-neon-violet/50", text: "text-neon-violet", bg: "bg-neon-violet/10", shadow: "shadow-[0_0_20px_rgba(139,92,246,0.3)]" },
  mobile: { border: "border-emerald-500/50", text: "text-emerald-400", bg: "bg-emerald-500/10", shadow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]" },
  backoffice: { border: "border-rose-500/50", text: "text-rose-400", bg: "bg-rose-500/10", shadow: "shadow-[0_0_20px_rgba(244,63,94,0.3)]" },
  "360": { border: "border-violet-400/50", text: "text-violet-400", bg: "bg-violet-500/10", shadow: "shadow-[0_0_20px_rgba(167,139,250,0.3)]" },
};

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const parallaxSlow = useParallax(0.15);
  const parallaxMedium = useParallax(0.25);

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <Layout>
      <FloatingParticles />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-neon-violet/10 via-transparent to-transparent" />
        <div className="absolute inset-0 grid-bg" />
        <div 
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[150px] animate-pulse-glow"
          style={{ transform: `translateY(${parallaxSlow}px)` }}
        />
        <div 
          className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-glow"
          style={{ transform: `translateY(${parallaxMedium}px)`, animationDelay: "1s" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-8 flex justify-center opacity-0 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-neon-violet/50 blur-[60px] rounded-full scale-110 animate-pulse-glow" />
                <img
                  src={logoHero}
                  alt="IMPARTIAL"
                  className="relative w-32 h-32 drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                />
              </div>
            </div>
            
            <div className="mb-6 flex justify-center opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="badge-gradient flex items-center gap-2 text-sm font-medium text-violet-300">
                <Sparkles className="h-4 w-4" />
                Nos Créations
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Nos <span className="text-gradient-neon">Réalisations</span>
            </h1>
            <p className="text-xl text-muted-foreground opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Découvrez nos projets et les solutions digitales que nous avons créées pour nos clients.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-neon-violet/20 text-neon-violet border border-neon-violet/50 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                    : "bg-glass-dark/50 backdrop-blur-sm border border-white/10 hover:bg-white/5 hover:border-neon-violet/30"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => {
              const colors = categoryColors[project.category];
              return (
                <div
                  key={project.id}
                  className={`group bg-glass-dark/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 hover:border-neon-violet/40 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] opacity-0 animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center gap-4 transition-opacity duration-300 ${
                        hoveredProject === project.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <button className="p-3 rounded-full bg-neon-violet/20 border border-neon-violet/40 hover:bg-neon-violet/30 transition-colors">
                        <Eye className="h-5 w-5 text-neon-violet" />
                      </button>
                      <button className="p-3 rounded-full bg-neon-violet/20 border border-neon-violet/40 hover:bg-neon-violet/30 transition-colors">
                        <ExternalLink className="h-5 w-5 text-neon-violet" />
                      </button>
                    </div>

                    {/* Category Badge */}
                    <div
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold border ${colors.border} ${colors.text} ${colors.bg} backdrop-blur-sm`}
                    >
                      {project.category === "360" ? "360°" : project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold group-hover:text-neon-violet transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-sm text-muted-foreground">{project.year}</span>
                    </div>

                    {project.client && (
                      <p className="text-sm text-neon-violet/70 mb-3">Client: {project.client}</p>
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
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-violet/10 via-purple-600/10 to-blue-600/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-glass-dark/60 backdrop-blur-xl rounded-3xl p-12 text-center max-w-3xl mx-auto border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/5 via-transparent to-purple-600/5 rounded-3xl" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-neon-violet/10 border border-neon-violet/30">
                <Sparkles className="h-4 w-4 text-neon-violet" />
                <span className="text-sm font-medium text-neon-violet">Votre projet</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Votre projet est le <span className="text-gradient-neon">prochain</span> ?
              </h2>
              <p className="text-muted-foreground mb-8">
                Discutons ensemble de votre vision et transformons-la en réalité digitale.
              </p>
              <a
                href="/contact"
                className="btn-gradient inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
              >
                Démarrer un projet
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}