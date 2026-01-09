import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Eye, ArrowRight } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition } from "@/components/animations";

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
    description: "Site vitrine premium pour une agence de closers et setters. Design moderne noir et or avec animations fluides.",
    image: wecloseImg,
    tags: ["React", "Framer Motion", "Design Premium"],
    client: "We Close Agency",
    year: "2024",
    url: "/portfolio/weclose"
  },
  {
    id: 2,
    title: "Altarys Group",
    category: "backoffice",
    description: "Plateforme DeFi et RWA avec dashboard administratif complet. Interface intuitive pour la gestion financière.",
    image: altarysImg,
    tags: ["Dashboard", "DeFi", "Finance", "TypeScript"],
    client: "Altarys Group",
    year: "2024",
    url: "/portfolio/altarys"
  },
  {
    id: 3,
    title: "Guardian Of Prophecia",
    category: "360",
    description: "Plateforme gaming complète avec système d'invitation, rewards et communauté. Expérience immersive Web3.",
    image: propheciaImg,
    tags: ["Gaming", "Web3", "Community", "Full Stack"],
    client: "Guardian Of Prophecia",
    year: "2024",
    url: "/portfolio/prophecia"
  }
];

const categories = [
  { id: "all", name: "Tous" },
  { id: "web", name: "Web" },
  { id: "mobile", name: "Mobile" },
  { id: "backoffice", name: "Backoffice" },
  { id: "360", name: "360°" }
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  // Mouse tracking for subtle gradient
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 30, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / innerWidth);
      mouseY.set((clientY - innerHeight / 2) / innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const gradientX = useTransform(smoothMouseX, [-0.5, 0.5], ["40%", "60%"]);
  const gradientY = useTransform(smoothMouseY, [-0.5, 0.5], ["40%", "60%"]);

  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[40svh] sm:min-h-[50svh] flex items-center justify-center overflow-hidden pt-20 sm:pt-24">
        <motion.div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse 80% 60% at ${gradientX} ${gradientY}, hsl(var(--neon-violet) / 0.12), transparent 70%)`,
          }}
        />

        

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <motion.p
              className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground mb-6 sm:mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Portfolio
            </motion.p>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-6 sm:mb-8 tracking-tight leading-[1.1]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Nos <span className="font-medium text-gradient-neon">réalisations.</span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed font-light px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Découvrez nos projets et les solutions digitales créées pour nos clients.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <SectionTransition className="py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <ScrollReveal variant="fadeIn">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat.id
                      ? "bg-white text-background"
                      : "text-muted-foreground hover:text-foreground border border-white/10 hover:border-white/20"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </SectionTransition>

      {/* Projects Grid */}
      <SectionTransition className="py-10 sm:py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <StaggerContainer 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto" 
            staggerDelay={0.1}
          >
            {filteredProjects.map((project) => (
              <motion.div key={project.id} variants={staggerItemVariants}>
                <Link
                  to={project.url}
                  className="block group"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-500">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <ImageWithSkeleton
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        containerClassName="w-full h-full"
                      />
                      
                      {/* Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-background/90 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Eye className="h-4 w-4" />
                          Voir le projet
                        </div>
                      </motion.div>

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium bg-background/80 backdrop-blur-sm border border-white/10">
                        {project.category === "360" ? "360°" : project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base sm:text-lg font-medium">{project.title}</h3>
                        <span className="text-xs text-muted-foreground">{project.year}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {project.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 sm:py-1 text-xs rounded-md bg-white/5 text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </SectionTransition>

      {/* CTA Section */}
      <SectionTransition className="py-16 sm:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal variant="fadeInUp">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 sm:mb-6">Votre projet</p>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-6">
                Le prochain pourrait être <span className="font-medium text-gradient-neon">le vôtre.</span>
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground mb-8 sm:mb-10 px-2">
                Discutons ensemble de votre vision et transformons-la en réalité digitale.
              </p>

              <motion.a
                href="/contact"
                className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-medium tracking-wide uppercase overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 bg-white rounded-full" />
                <span className="absolute inset-0 bg-gradient-to-r from-violet-500 to-violet-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <span className="relative text-background group-hover:text-white transition-colors duration-500">
                  Démarrer un projet
                </span>
                <ArrowRight className="relative h-3.5 w-3.5 sm:h-4 sm:w-4 text-background group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
              </motion.a>
            </div>
          </ScrollReveal>
        </div>
      </SectionTransition>
    </Layout>
  );
}
