import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ExternalLink, Eye } from "lucide-react";

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
  { id: "all", name: "Tous", color: "neon-white" },
  { id: "web", name: "Web", color: "neon-blue" },
  { id: "mobile", name: "Mobile", color: "neon-green" },
  { id: "backoffice", name: "Backoffice", color: "neon-red" },
  { id: "360", name: "360°", color: "tier-custom" },
];

const categoryColors: Record<string, string> = {
  web: "border-neon-blue text-neon-blue",
  mobile: "border-neon-green text-neon-green",
  backoffice: "border-neon-red text-neon-red",
  "360": "border-tier-custom text-tier-custom",
};

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/10 to-transparent opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 animate-fade-in-up">
              Nos <span className="text-neon-blue">Réalisations</span>
            </h1>
            <p className="text-xl text-muted-foreground animate-fade-in-up [animation-delay:150ms]">
              Découvrez nos projets et les solutions digitales que nous avons créées pour nos clients.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 border-b border-border/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? `bg-${cat.color}/20 text-${cat.color} border border-${cat.color}`
                    : "glass-dark hover:bg-white/5"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group glass-dark rounded-2xl overflow-hidden animate-fade-in-up"
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
                    className={`absolute inset-0 bg-background/80 flex items-center justify-center gap-4 transition-opacity duration-300 ${
                      hoveredProject === project.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <button className="p-3 rounded-full glass-dark hover:bg-neon-blue/20 transition-colors">
                      <Eye className="h-5 w-5 text-neon-blue" />
                    </button>
                    <button className="p-3 rounded-full glass-dark hover:bg-neon-blue/20 transition-colors">
                      <ExternalLink className="h-5 w-5 text-neon-blue" />
                    </button>
                  </div>

                  {/* Category Badge */}
                  <div
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold border ${
                      categoryColors[project.category]
                    } bg-background/80 backdrop-blur-sm`}
                  >
                    {project.category === "360" ? "360°" : project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold group-hover:text-neon-blue transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-sm text-muted-foreground">{project.year}</span>
                  </div>

                  {project.client && (
                    <p className="text-sm text-neon-blue/70 mb-3">Client: {project.client}</p>
                  )}

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-md bg-white/5 text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-neon-blue/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="glass-dark rounded-3xl p-12 text-center max-w-3xl mx-auto border border-neon-blue/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Votre projet est le prochain ?
            </h2>
            <p className="text-muted-foreground mb-8">
              Discutons ensemble de votre vision et transformons-la en réalité digitale.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-neon-blue text-background font-semibold rounded-xl transition-all duration-300 hover:neon-glow-blue hover:scale-105"
            >
              Démarrer un projet
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
