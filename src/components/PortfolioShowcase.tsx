import { useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ExternalLink, ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, SectionTransition, ParallaxBackground, Hover3DCard } from "@/components/animations";

// Import screenshots
import wecloseImg from "@/assets/portfolio/weclose.png";
import altarysImg from "@/assets/portfolio/altarys.png";

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  url: string;
  tags: string[];
  color: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "We Close Agency",
    category: "Site Web",
    description: "Site vitrine pour une agence de closers et setters. Design moderne avec animations fluides et une expérience utilisateur immersive.",
    image: wecloseImg,
    url: "/portfolio/weclose",
    tags: ["React", "Framer Motion", "Design Premium"],
    color: "neon-violet",
  },
  {
    id: 2,
    title: "Altarys Group",
    category: "Backoffice",
    description: "Plateforme DeFi et RWA avec dashboard administratif complet. Interface intuitive pour la gestion financière décentralisée.",
    image: altarysImg,
    url: "/portfolio/altarys",
    tags: ["Dashboard", "DeFi", "Finance"],
    color: "neon-blue",
  },
  {
    id: 3,
    title: "Guardian Of Prophecia",
    category: "Jeu Vidéo",
    description: "Plateforme gaming avec système d'invitation et rewards. Expérience immersive pour les joueurs passionnés.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
    url: "/portfolio/prophecia",
    tags: ["Gaming", "Web3", "Community"],
    color: "neon-green",
  },
];

export function PortfolioShowcase() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const colorClasses: Record<string, { border: string; text: string; bg: string; shadow: string }> = {
    "neon-violet": { 
      border: "border-neon-violet/50", 
      text: "text-neon-violet", 
      bg: "bg-neon-violet/10", 
      shadow: "shadow-[0_0_30px_rgba(139,92,246,0.3)]" 
    },
    "neon-blue": { 
      border: "border-blue-500/50", 
      text: "text-blue-400", 
      bg: "bg-blue-500/10", 
      shadow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]" 
    },
    "neon-green": { 
      border: "border-emerald-500/50", 
      text: "text-emerald-400", 
      bg: "bg-emerald-500/10", 
      shadow: "shadow-[0_0_30px_rgba(16,185,129,0.3)]" 
    },
  };

  return (
    <>
      <SectionTransition className="py-24 relative overflow-hidden" parallaxStrength={0.05}>
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
                Projets <span className="text-gradient-neon">réalisés</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez nos dernières créations digitales qui propulsent nos clients vers le succès.
              </p>
            </ScrollReveal>
          </div>

          {/* Carousel */}
          <ScrollReveal variant="fadeIn" delay={0.3}>
            <div className="relative max-w-5xl mx-auto">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {projects.map((project) => {
                    const colors = colorClasses[project.color];
                    return (
                      <div
                        key={project.id}
                        className="flex-[0_0_100%] min-w-0 px-4 md:flex-[0_0_80%] lg:flex-[0_0_70%]"
                      >
                        <Hover3DCard className="rounded-2xl" rotateStrength={5}>
                          <motion.div 
                            className={`group bg-glass-dark/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-neon-violet/40 transition-all duration-500 hover:${colors.shadow}`}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                            onMouseEnter={() => setHoveredProject(project.id)}
                            onMouseLeave={() => setHoveredProject(null)}
                          >
                            {/* Image */}
                            <div className="relative h-64 md:h-80 overflow-hidden">
                              <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                              />
                              
                              {/* Hover Overlay with Preview Button */}
                              <AnimatePresence>
                                {hoveredProject === project.id && (
                                  <motion.div
                                    className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <motion.button
                                      onClick={() => setPreviewUrl(project.url)}
                                      className={`px-6 py-3 rounded-xl ${colors.bg} border ${colors.border} ${colors.text} font-medium flex items-center gap-2 hover:scale-105 transition-transform`}
                                      initial={{ y: 20, opacity: 0 }}
                                      animate={{ y: 0, opacity: 1 }}
                                      transition={{ delay: 0.1 }}
                                    >
                                      Aperçu
                                    </motion.button>
                                    <motion.a
                                      href={project.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-6 py-3 rounded-xl bg-neon-violet/20 border border-neon-violet/50 text-neon-violet font-medium flex items-center gap-2 hover:scale-105 transition-transform"
                                      initial={{ y: 20, opacity: 0 }}
                                      animate={{ y: 0, opacity: 1 }}
                                      transition={{ delay: 0.15 }}
                                    >
                                      Visiter <ExternalLink className="h-4 w-4" />
                                    </motion.a>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Category Badge */}
                              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold border ${colors.border} ${colors.text} ${colors.bg} backdrop-blur-sm`}>
                                {project.category}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 md:p-8">
                              <h3 className="text-xl md:text-2xl font-bold mb-2">{project.title}</h3>
                              <p className="text-muted-foreground mb-4 line-clamp-2">
                                {project.description}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-muted-foreground"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        </Hover3DCard>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Buttons */}
              <motion.button
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 p-3 rounded-full bg-glass-dark/80 backdrop-blur-xl border border-white/10 hover:border-neon-violet/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="h-6 w-6" />
              </motion.button>
              <motion.button
                onClick={scrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 p-3 rounded-full bg-glass-dark/80 backdrop-blur-xl border border-white/10 hover:border-neon-violet/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="h-6 w-6" />
              </motion.button>
            </div>
          </ScrollReveal>

          {/* Dots */}
          <ScrollReveal variant="fadeIn" delay={0.4}>
            <div className="flex justify-center gap-2 mt-8">
              {projects.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? "bg-neon-violet w-8 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                      : "bg-white/20 w-2.5 hover:bg-white/40"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </ScrollReveal>

          {/* View All Link */}
          <ScrollReveal variant="fadeInUp" delay={0.5}>
            <div className="text-center mt-10">
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 text-neon-violet hover:text-neon-violet/80 font-medium transition-colors"
              >
                Voir tous les projets
                <ExternalLink className="h-4 w-4" />
              </Link>
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
              {/* Header */}
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
              
              {/* Iframe */}
              <iframe
                src={previewUrl}
                className="w-full h-[calc(100%-60px)]"
                title="Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
