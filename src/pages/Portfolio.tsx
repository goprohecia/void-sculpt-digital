import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { FloatingParticles } from "@/components/FloatingParticles";
import { ExternalLink, Eye, Sparkles, X } from "lucide-react";
import { useParallax } from "@/hooks/use-parallax";
import { motion, AnimatePresence } from "framer-motion";
import logoHero from "@/assets/logo-hero.png";
import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
import { 
  ScrollReveal, 
  StaggerContainer,
  staggerItemVariants,
  SectionTransition,
  ParallaxBackground,
  Hover3DCard,
  RippleButton,
  HorizontalScrollSection,
  HorizontalScrollItem,
} from "@/components/animations";

// Import screenshots
import wecloseImg from "@/assets/portfolio/weclose-logo.jpeg";
import altarysImg from "@/assets/portfolio/altarys-logo.png";
import propheciaImg from "@/assets/portfolio/prophecia-logo.jpeg";

interface Project {
  id: number;
  title: string;
  category: "web" | "mobile" | "backoffice" | "360";
  description: string;
  image: string;
  tags: string[];
  client?: string;
  year: string;
  url: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "We Close Agency",
    category: "web",
    description: "Site vitrine premium pour une agence de closers et setters. Design moderne noir et or avec animations fluides et expérience utilisateur immersive.",
    image: wecloseImg,
    tags: ["React", "Framer Motion", "Design Premium"],
    client: "We Close Agency",
    year: "2024",
    url: "/portfolio/weclose",
  },
  {
    id: 2,
    title: "Altarys Group",
    category: "backoffice",
    description: "Plateforme DeFi et RWA avec dashboard administratif complet. Interface intuitive pour la gestion financière décentralisée et les actifs tokenisés.",
    image: altarysImg,
    tags: ["Dashboard", "DeFi", "Finance", "TypeScript"],
    client: "Altarys Group",
    year: "2024",
    url: "/portfolio/altarys",
  },
  {
    id: 3,
    title: "Guardian Of Prophecia",
    category: "360",
    description: "Plateforme gaming complète avec système d'invitation, rewards et communauté. Expérience immersive pour les joueurs passionnés avec intégration Web3.",
    image: propheciaImg,
    tags: ["Gaming", "Web3", "Community", "Full Stack"],
    client: "Guardian Of Prophecia",
    year: "2024",
    url: "/portfolio/prophecia",
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
          className="absolute top-1/4 left-1/4 w-[200px] md:w-[300px] lg:w-[400px] h-[200px] md:h-[300px] lg:h-[400px] bg-violet-600/15 rounded-full blur-[80px] md:blur-[120px] lg:blur-[150px] animate-pulse-glow"
          style={{ transform: `translateY(${parallaxSlow}px)` }}
        />
        <div 
          className="absolute top-1/3 right-1/4 w-[150px] md:w-[250px] lg:w-[300px] h-[150px] md:h-[250px] lg:h-[300px] bg-purple-600/10 rounded-full blur-[60px] md:blur-[100px] lg:blur-[120px] animate-pulse-glow hidden sm:block"
          style={{ transform: `translateY(${parallaxMedium}px)`, animationDelay: "1s" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div 
              className="mb-8 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-neon-violet/50 blur-[60px] rounded-full scale-110 animate-pulse-glow" />
                <img
                  src={logoHero}
                  alt="IMPARTIAL"
                  className="relative w-32 h-32 drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                />
              </div>
            </motion.div>
            
            <ScrollReveal variant="fadeInUp">
              <div className="mb-6 flex justify-center">
                <div className="badge-gradient flex items-center gap-2 text-sm font-medium text-violet-300">
                  <Sparkles className="h-4 w-4" />
                  Nos créations
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
                Nos <span className="text-gradient-neon">réalisations</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="text-xl text-muted-foreground">
                Découvrez nos projets et les solutions digitales que nous avons créées pour nos clients.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <SectionTransition className="py-8 border-b border-white/10">
        <div className="container mx-auto px-4">
          <ScrollReveal variant="fadeIn">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <RippleButton
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                    activeCategory === cat.id
                      ? "bg-neon-violet/20 text-neon-violet border border-neon-violet/50 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                      : "bg-glass-dark/50 backdrop-blur-sm border border-white/10 hover:bg-white/5 hover:border-neon-violet/30"
                  }`}
                  rippleColor={activeCategory === cat.id ? "rgba(139, 92, 246, 0.3)" : "rgba(255, 255, 255, 0.2)"}
                >
                  {cat.name}
                </RippleButton>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </SectionTransition>

      {/* Projects Horizontal Scroll - Featured */}
      <HorizontalScrollSection
        title="Projets en vedette"
        subtitle="Parcourez nos réalisations les plus marquantes"
        badge="Showcase"
        className="bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent"
      >
        {filteredProjects.slice(0, 4).map((project, index) => {
          const colors = categoryColors[project.category];
          return (
            <HorizontalScrollItem key={project.id} index={index} className="w-[400px] lg:w-[500px]">
              <Hover3DCard className="rounded-2xl overflow-hidden">
                <div className="bg-glass-dark/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithSkeleton
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      containerClassName="h-64"
                    />
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
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      <span className="text-sm text-muted-foreground">{project.year}</span>
                    </div>
                    {project.client && (
                      <p className="text-sm text-neon-violet/70 mb-3">Client: {project.client}</p>
                    )}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
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
              </Hover3DCard>
            </HorizontalScrollItem>
          );
        })}
      </HorizontalScrollSection>

      {/* Projects Grid */}
      <SectionTransition className="py-16 relative" parallaxStrength={0.05}>
        <ParallaxBackground speed={0.2}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        </ParallaxBackground>
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal variant="fadeInUp" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tous nos <span className="text-gradient-neon">projets</span>
            </h2>
          </ScrollReveal>

          <StaggerContainer 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            staggerDelay={0.1}
          >
            {filteredProjects.map((project, index) => {
              const colors = categoryColors[project.category];
              return (
                <motion.div
                  key={project.id}
                  variants={staggerItemVariants}
                >
                  <Hover3DCard 
                    className="h-full rounded-2xl overflow-hidden"
                    rotateStrength={6}
                  >
                    <div
                      className={`h-full bg-glass-dark/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 hover:border-neon-violet/40`}
                      onMouseEnter={() => setHoveredProject(project.id)}
                      onMouseLeave={() => setHoveredProject(null)}
                    >
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        <ImageWithSkeleton
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          containerClassName="w-full h-full"
                        />
                        <motion.div
                          className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center gap-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Link 
                            to={project.url}
                            className="p-3 rounded-full bg-neon-violet/20 border border-neon-violet/40 hover:bg-neon-violet/30 transition-colors"
                          >
                            <Eye className="h-5 w-5 text-neon-violet" />
                          </Link>
                        </motion.div>

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
                          <h3 className="text-xl font-bold">{project.title}</h3>
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
                  </Hover3DCard>
                </motion.div>
              );
            })}
          </StaggerContainer>
        </div>
      </SectionTransition>

      {/* CTA Section */}
      <SectionTransition className="py-20 relative overflow-hidden" parallaxStrength={0.08} scaleOnScroll>
        <ParallaxBackground speed={0.3}>
          <div className="absolute inset-0 bg-gradient-to-r from-neon-violet/10 via-purple-600/10 to-blue-600/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[150px]" />
        </ParallaxBackground>
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal variant="scaleIn" duration={0.8}>
            <div className="bg-glass-dark/60 backdrop-blur-xl rounded-3xl p-12 text-center max-w-3xl mx-auto border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/5 via-transparent to-purple-600/5 rounded-3xl" />
              
              <div className="relative z-10">
                <ScrollReveal variant="fadeInUp" delay={0.1}>
                  <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-neon-violet/10 border border-neon-violet/30">
                    <Sparkles className="h-4 w-4 text-neon-violet" />
                    <span className="text-sm font-medium text-neon-violet">Votre projet</span>
                  </div>
                </ScrollReveal>
                
                <ScrollReveal variant="fadeInUp" delay={0.2}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Votre projet est le <span className="text-gradient-neon">prochain</span> ?
                  </h2>
                </ScrollReveal>

                <ScrollReveal variant="fadeInUp" delay={0.3}>
                  <p className="text-muted-foreground mb-8">
                    Discutons ensemble de votre vision et transformons-la en réalité digitale.
                  </p>
                </ScrollReveal>

                <ScrollReveal variant="fadeInUp" delay={0.4}>
                  <RippleButton
                    onClick={() => window.location.href = "/contact"}
                    className="btn-gradient px-8 py-4 text-white font-semibold rounded-xl"
                  >
                    Démarrer un projet
                  </RippleButton>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </SectionTransition>

      {/* Iframe Preview Modal */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-6xl h-[80vh] bg-glass-dark rounded-2xl border border-white/10 overflow-hidden"
              initial={{ scale: 0.9, rotateX: -10 }}
              animate={{ scale: 1, rotateX: 0 }}
              exit={{ scale: 0.9, rotateX: 10 }}
              style={{ perspective: 1000 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-glass-dark/80">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm text-muted-foreground truncate max-w-md">{previewUrl}</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => setPreviewUrl(null)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <iframe
                src={previewUrl}
                className="w-full h-[calc(100%-60px)]"
                title="Preview"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
