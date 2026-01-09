import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ArrowLeft, ExternalLink, Check, Database, LineChart, Shield } from "lucide-react";
import { motion } from "framer-motion";
import altarysImg from "@/assets/portfolio/altarys-logo.png";
const projectDetails = {
  title: "Altarys Group",
  subtitle: "Plateforme DeFi et RWA avec dashboard administratif complet",
  category: "Backoffice",
  client: "Altarys Group",
  year: "2024",
  duration: "8 semaines",
  url: "https://altarys-group.fr/",
  description: `Altarys Group accompagne les professionnels de la finance dans leur transition vers l'écosystème DeFi et les actifs tokenisés (RWA). Le projet nécessitait une plateforme complète combinant un site vitrine informatif et un dashboard de gestion avancé.

L'interface a été conçue pour simplifier des concepts financiers complexes tout en maintenant un niveau de professionnalisme adapté au secteur. Le dashboard offre une vue claire des opérations et permet une gestion fluide des différents services proposés.`,
  challenges: ["Vulgariser des concepts DeFi complexes pour un public traditionnel", "Créer un dashboard intuitif pour la gestion multi-services", "Assurer la sécurité des données financières sensibles", "Intégrer des visualisations de données en temps réel"],
  solutions: ["Design épuré avec hiérarchie visuelle claire", "Architecture modulaire avec composants réutilisables", "Authentification sécurisée et gestion des rôles", "Graphiques interactifs avec mises à jour live"],
  technologies: ["React", "TypeScript", "Tailwind CSS", "Supabase", "Chart.js", "Framer Motion"],
  features: ["Dashboard administratif complet", "Gestion multi-utilisateurs", "Visualisation de données avancée", "Système de notifications", "Rapports automatisés", "Interface responsive"],
  results: [{
    metric: "+85%",
    label: "Efficacité opérationnelle"
  }, {
    metric: "50%",
    label: "Réduction temps admin"
  }, {
    metric: "99.9%",
    label: "Uptime garanti"
  }, {
    metric: "A+",
    label: "Score sécurité"
  }],
  dashboardFeatures: [{
    icon: Database,
    title: "Base de données",
    description: "Gestion centralisée des données clients et transactions"
  }, {
    icon: LineChart,
    title: "Analytics",
    description: "Tableaux de bord avec métriques en temps réel"
  }, {
    icon: Shield,
    title: "Sécurité",
    description: "Authentification 2FA et chiffrement bout-en-bout"
  }]
};
export default function AltarysProject() {
  return <Layout>
      {/* Hero Section - Refined */}
      <section className="relative min-h-[50svh] sm:min-h-[60svh] flex items-center justify-center overflow-hidden pt-20 sm:pt-24">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Back Link */}
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6
        }}>
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 sm:mb-12 text-sm">
              <ArrowLeft className="h-4 w-4" />
              Retour au portfolio
            </Link>
          </motion.div>

          <div className="max-w-4xl mx-auto text-center">
            <motion.p className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground mb-6 sm:mb-8" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.1
          }}>
              {projectDetails.category} · {projectDetails.year}
            </motion.p>

            <motion.h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 sm:mb-6 tracking-tight" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.2
          }}>
              {projectDetails.title}
            </motion.h1>

            <motion.p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light mb-8 sm:mb-10 px-2" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.3
          }}>
              {projectDetails.subtitle}
            </motion.p>

            <motion.a href={projectDetails.url} target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-medium tracking-wide uppercase overflow-hidden" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.4
          }} whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }}>
              <span className="absolute inset-0 bg-white rounded-full" />
              <span className="absolute inset-0 bg-gradient-to-r from-neon-violet to-violet-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative text-background group-hover:text-white transition-colors duration-500">
                Visiter le site
              </span>
              <ExternalLink className="relative h-3.5 w-3.5 sm:h-4 sm:w-4 text-background group-hover:text-white transition-colors duration-500" />
            </motion.a>
          </div>
        </div>
      </section>

      {/* Project Image */}
      

      {/* Description */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.h2 className="text-xl sm:text-2xl md:text-3xl font-light mb-6 sm:mb-8" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} viewport={{
            once: true
          }}>
              À propos du <span className="font-medium text-gradient-neon">projet</span>
            </motion.h2>
            <motion.p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.1
          }} viewport={{
            once: true
          }}>
              {projectDetails.description}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Dashboard Features */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.h2 className="text-xl sm:text-2xl md:text-3xl font-light text-center mb-8 sm:mb-12" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }}>
            Fonctionnalités <span className="font-medium text-gradient-neon">Backoffice</span>
          </motion.h2>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto">
            {projectDetails.dashboardFeatures.map((feature, index) => <motion.div key={feature.title} className="text-center p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.02]" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: index * 0.1
          }} viewport={{
            once: true
          }}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-neon-violet" />
                </div>
                <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.h2 className="text-xl sm:text-2xl md:text-3xl font-light text-center mb-8 sm:mb-12" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }}>
            Résultats <span className="font-medium text-gradient-neon">obtenus</span>
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto">
            {projectDetails.results.map((result, index) => <motion.div key={result.label} className="text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.02]" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: index * 0.1
          }} viewport={{
            once: true
          }}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-light text-gradient-neon mb-1 sm:mb-2">
                  {result.metric}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {result.label}
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Challenges & Solutions */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 max-w-4xl mx-auto">
            {/* Challenges */}
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6
          }} viewport={{
            once: true
          }}>
              <h3 className="text-lg sm:text-xl font-light mb-4 sm:mb-6">Défis</h3>
              <ul className="space-y-3 sm:space-y-4">
                {projectDetails.challenges.map((challenge, index) => <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground">
                    <span className="text-xs font-medium text-foreground mt-0.5 sm:mt-1">{String(index + 1).padStart(2, '0')}</span>
                    <span>{challenge}</span>
                  </li>)}
              </ul>
            </motion.div>

            {/* Solutions */}
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6
          }} viewport={{
            once: true
          }}>
              <h3 className="text-lg sm:text-xl font-light mb-4 sm:mb-6">Solutions</h3>
              <ul className="space-y-3 sm:space-y-4">
                {projectDetails.solutions.map((solution, index) => <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground">
                    <Check className="h-4 w-4 text-neon-violet mt-0.5 sm:mt-1 flex-shrink-0" />
                    <span>{solution}</span>
                  </li>)}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.h2 className="text-xl sm:text-2xl md:text-3xl font-light text-center mb-8 sm:mb-10" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }}>
            Technologies <span className="font-medium text-gradient-neon">utilisées</span>
          </motion.h2>

          <motion.div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-3xl mx-auto" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} viewport={{
          once: true
        }}>
            {projectDetails.technologies.map(tech => <span key={tech} className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full border border-white/10 bg-white/[0.02] text-muted-foreground">
                {tech}
              </span>)}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.h2 className="text-xl sm:text-2xl md:text-3xl font-light text-center mb-8 sm:mb-10" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }}>
            Fonctionnalités <span className="font-medium text-gradient-neon">clés</span>
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {projectDetails.features.map((feature, index) => <motion.div key={feature} className="flex items-center gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/5 bg-white/[0.02]" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: index * 0.05
          }} viewport={{
            once: true
          }}>
                <Check className="h-4 w-4 text-neon-violet flex-shrink-0" />
                <span className="text-xs sm:text-sm">{feature}</span>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div className="text-center max-w-2xl mx-auto" initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} viewport={{
          once: true
        }}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 sm:mb-6">Votre projet</p>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-6">
              Besoin d'un <span className="font-medium text-gradient-neon">backoffice</span> sur mesure ?
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground mb-8 sm:mb-10 px-2">
              Créons ensemble le dashboard parfait pour gérer votre activité.
            </p>

            <motion.a href="/contact" className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-medium tracking-wide uppercase overflow-hidden" whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }}>
              <span className="absolute inset-0 bg-white rounded-full" />
              <span className="absolute inset-0 bg-gradient-to-r from-neon-violet to-violet-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative text-background group-hover:text-white transition-colors duration-500">
                Démarrer un projet
              </span>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </Layout>;
}