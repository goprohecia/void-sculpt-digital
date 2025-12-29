import { Link } from "react-router-dom";
import { Sparkles, Mail, Phone, MapPin, ArrowUpRight, Cookie } from "lucide-react";
import { motion } from "framer-motion";
import { Newsletter } from "@/components/Newsletter";
import { ScrollReveal, StaggerContainer, staggerItemVariants, RippleButton, MagneticButton } from "@/components/animations";
import logoHero from "@/assets/logo-hero.png";
const footerLinkVariants = {
  hidden: {
    opacity: 0,
    x: -10
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as const
    }
  }
};
export function Footer() {
  const openCookieSettings = () => {
    localStorage.removeItem("cookie-consent");
    window.location.reload();
  };
  return <footer className="relative border-t border-white/10 bg-glass-dark/50 backdrop-blur-xl overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-neon-violet/5 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-violet-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/3 w-[300px] h-[150px] bg-purple-600/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <ScrollReveal variant="fadeInUp" delay={0}>
            <div className="space-y-6">
              <MagneticButton as="div" strength={0.2}>
                <Link to="/" className="flex items-center gap-3 group inline-flex">
                  <motion.img src={logoHero} alt="Impartial" className="h-12 w-auto drop-shadow-[0_0_10px_rgba(139,92,246,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] transition-all duration-300" whileHover={{
                  scale: 1.1,
                  rotate: 5
                }} transition={{
                  duration: 0.3
                }} />
                  <motion.span className="text-xl font-bold tracking-wider group-hover:text-neon-violet transition-colors" whileHover={{
                  scale: 1.05
                }}>
                    IMPARTIAL
                  </motion.span>
                </Link>
              </MagneticButton>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Studio digital spécialisé dans la création d'expériences web et mobiles immersives pour les marques ambitieuses.
              </p>
              <motion.div className="flex items-center gap-2" whileHover={{
              x: 5
            }} transition={{
              duration: 0.2
            }}>
                <Sparkles className="h-4 w-4 text-neon-violet" />
                <span className="text-sm text-neon-violet font-medium">Gaming & Tech Design</span>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Services */}
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <div>
              <h4 className="font-semibold mb-6 text-neon-violet flex items-center gap-2">
                <motion.div className="w-2 h-2 rounded-full bg-neon-violet shadow-[0_0_10px_rgba(139,92,246,0.5)]" animate={{
                scale: [1, 1.2, 1]
              }} transition={{
                duration: 2,
                repeat: Infinity
              }} />
                Nos expertises
              </h4>
              <StaggerContainer staggerDelay={0.05}>
                <ul className="space-y-3">
                  {[{
                  to: "/services/web",
                  label: "Sites Web & Vitrines"
                }, {
                  to: "/services/mobile",
                  label: "Applications Mobiles"
                }, {
                  to: "/services/backoffice",
                  label: "Backoffice & SaaS"
                }, {
                  to: "/services/360",
                  label: "Écosystème 360°"
                }].map(link => <motion.li key={link.to} variants={footerLinkVariants}>
                      <Link to={link.to} className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-neon-violet" />
                        <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                      </Link>
                    </motion.li>)}
                </ul>
              </StaggerContainer>
            </div>
          </ScrollReveal>

          {/* Studio */}
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <div>
              <h4 className="font-semibold mb-6 text-emerald-400 flex items-center gap-2">
                <motion.div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" animate={{
                scale: [1, 1.2, 1]
              }} transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.3
              }} />
                Le studio
              </h4>
              <StaggerContainer staggerDelay={0.05} delayStart={0.1}>
                <ul className="space-y-3">
                  {[{
                  to: "/studio",
                  label: "Notre vision"
                }, {
                  to: "/studio",
                  label: "L'équipe"
                }, {
                  to: "/studio",
                  label: "Nos valeurs"
                }, {
                  to: "/portfolio",
                  label: "Portfolio"
                }].map((link, index) => <motion.li key={index} variants={footerLinkVariants}>
                      <Link to={link.to} className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-400" />
                        <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                      </Link>
                    </motion.li>)}
                </ul>
              </StaggerContainer>
            </div>
          </ScrollReveal>

          {/* Contact */}
          <ScrollReveal variant="fadeInUp" delay={0.3}>
            <div>
              <h4 className="font-semibold mb-6 text-rose-400 flex items-center gap-2">
                <motion.div className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.5)]" animate={{
                scale: [1, 1.2, 1]
              }} transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.6
              }} />
                Contact
              </h4>
              <ul className="space-y-3 text-muted-foreground">
                <motion.li whileHover={{
                x: 3
              }} transition={{
                duration: 0.2
              }}>
                  <a href="mailto:contact@impartialgames.com" className="flex items-center gap-3 hover:text-rose-400 transition-colors">
                    <Mail className="h-4 w-4 text-rose-400" />
                    contact@impartialgames.com
                  </a>
                </motion.li>
                
                <motion.li className="flex items-center gap-3" whileHover={{
                x: 3
              }} transition={{
                duration: 0.2
              }}>
                  <MapPin className="h-4 w-4 text-rose-400" />
                  Delaware, États-Unis
                </motion.li>
              </ul>
              <MagneticButton as="div" strength={0.15} className="mt-6 inline-block">
                <Link to="/contact">
                  <RippleButton className="inline-flex items-center gap-2 px-5 py-2.5 bg-neon-violet/10 border border-neon-violet/40 text-neon-violet rounded-xl hover:bg-neon-violet/20 hover:border-neon-violet/60 transition-all duration-300">
                    Nous contacter
                    <ArrowUpRight className="h-4 w-4" />
                  </RippleButton>
                </Link>
              </MagneticButton>
            </div>
          </ScrollReveal>

          {/* Newsletter */}
          <ScrollReveal variant="fadeInUp" delay={0.4}>
            <Newsletter variant="inline" />
          </ScrollReveal>
        </div>

        <motion.div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4" initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5
      }} viewport={{
        once: true
      }}>
          <p className="text-muted-foreground text-sm">
            © 2025 <span className="text-neon-violet">IMPARTIAL</span>. Tous droits réservés.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
            {[{
            to: "/mentions-legales",
            label: "Mentions légales"
          }, {
            to: "/politique-confidentialite",
            label: "Confidentialité"
          }, {
            to: "/cgu",
            label: "CGU"
          }, {
            to: "/cgv",
            label: "CGV"
          }, {
            to: "/cookies",
            label: "Cookies"
          }].map((link, index) => <motion.div key={link.to} whileHover={{
            y: -2
          }} transition={{
            duration: 0.2
          }}>
                <Link to={link.to} className="hover:text-neon-violet transition-colors">
                  {link.label}
                </Link>
              </motion.div>)}
            <motion.button onClick={openCookieSettings} className="hover:text-neon-violet transition-colors flex items-center gap-1" whileHover={{
            y: -2
          }} transition={{
            duration: 0.2
          }}>
              <Cookie className="h-3 w-3" />
              Préférences cookies
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>;
}