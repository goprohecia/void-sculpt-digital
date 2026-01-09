import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItemVariants, SectionTransition, ParallaxBackground, Hover3DCard } from "@/components/animations";

import wecloseImg from "@/assets/portfolio/weclose-logo.jpeg";
import altarysImg from "@/assets/portfolio/altarys-logo.png";
import propheciaImg from "@/assets/portfolio/prophecia-logo.jpeg";

const projects = [
  {
    title: "We Close Agency",
    objective: "Site vitrine premium pour agence de closers",
    role: "Design & Développement",
    result: "Expérience fluide et premium",
    image: wecloseImg,
    url: "/portfolio/weclose",
    externalUrl: "https://wecloseagency.fr/",
    color: "neon-violet",
  },
  {
    title: "Altarys Group",
    objective: "Plateforme DeFi avec dashboard admin",
    role: "UI/UX & Développement",
    result: "Interface intuitive et scalable",
    image: altarysImg,
    url: "/portfolio/altarys",
    externalUrl: "https://altarys-group.fr/",
    color: "neon-blue",
  },
  {
    title: "Guardian Of Prophecia",
    objective: "Plateforme gaming avec rewards",
    role: "Design & Développement",
    result: "Communauté engagée",
    image: propheciaImg,
    url: "/portfolio/prophecia",
    externalUrl: "https://goprophecia.gg?inviteCode=YANNI-DZ94",
    color: "neon-green",
  },
];

const colorClasses = {
  "neon-violet": {
    border: "group-hover:border-neon-violet/50",
    text: "text-neon-violet",
    shadow: "group-hover:shadow-[0_0_50px_rgba(139,92,246,0.2)]",
    badge: "bg-neon-violet/15 border-neon-violet/30 text-neon-violet",
  },
  "neon-blue": {
    border: "group-hover:border-blue-500/50",
    text: "text-blue-400",
    shadow: "group-hover:shadow-[0_0_50px_rgba(59,130,246,0.2)]",
    badge: "bg-blue-500/15 border-blue-500/30 text-blue-400",
  },
  "neon-green": {
    border: "group-hover:border-emerald-500/50",
    text: "text-emerald-400",
    shadow: "group-hover:shadow-[0_0_50px_rgba(16,185,129,0.2)]",
    badge: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
  },
};

export function RealisationsSection() {
  return (
    <section id="realisations">
    <SectionTransition className="py-24 md:py-32 relative" parallaxStrength={0.05}>
      <ParallaxBackground speed={0.2}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[180px]" />
      </ParallaxBackground>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <ScrollReveal variant="fadeInUp">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
              Réalisations
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6">
              Sélection de{" "}
              <span className="font-medium text-gradient-neon">projets.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Quelques réalisations qui illustrent notre approche premium.
            </p>
          </ScrollReveal>
        </div>

        {/* Projects Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto" staggerDelay={0.15} delayStart={0.3}>
          {projects.map((project) => {
            const colors = colorClasses[project.color as keyof typeof colorClasses];
            return (
              <motion.div key={project.title} variants={staggerItemVariants}>
                <Hover3DCard rotateStrength={5} className="h-full">
                  <div className={`group h-full glass-card glass-noise rounded-2xl overflow-hidden transition-all duration-500 ${colors.border} ${colors.shadow}`}>
                    {/* Image */}
                    <div className="relative h-48 md:h-56 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Specular highlight on hover */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                      <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                      
                      <div className="space-y-2 mb-6">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground/80">Objectif :</span> {project.objective}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground/80">Rôle :</span> {project.role}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium text-foreground/80">Résultat :</span>{" "}
                          <span className={colors.text}>{project.result}</span>
                        </p>
                      </div>

                      {/* Links */}
                      <div className="flex items-center gap-4">
                        <Link
                          to={project.url}
                          className={`inline-flex items-center gap-1.5 text-sm font-medium ${colors.text} hover:underline`}
                        >
                          Voir le projet
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <a
                          href={project.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Hover3DCard>
              </motion.div>
            );
          })}
        </StaggerContainer>

        {/* View All CTA */}
        <ScrollReveal variant="fadeInUp" delay={0.5}>
          <div className="text-center mt-12">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-button hover:border-neon-violet/50 font-medium transition-all"
            >
              Voir toutes nos réalisations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </SectionTransition>
    </section>
  );
}
