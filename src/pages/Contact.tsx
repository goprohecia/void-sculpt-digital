import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { FloatingParticles } from "@/components/FloatingParticles";
import { Newsletter } from "@/components/Newsletter";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useParallax } from "@/hooks/use-parallax";
import { motion } from "framer-motion";
import logoHero from "@/assets/logo-hero.png";
import { ScrollReveal, SectionTransition, ParallaxBackground, Hover3DCard, RippleButton } from "@/components/animations";
const Contact = () => {
  const [searchParams] = useSearchParams();
  const {
    toast
  } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const parallaxSlow = useParallax(0.15);
  const parallaxMedium = useParallax(0.25);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: ""
  });
  useEffect(() => {
    const subject = searchParams.get("subject");
    if (subject) {
      setFormData(prev => ({
        ...prev,
        subject: decodeURIComponent(subject)
      }));
    }
  }, [searchParams]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Message envoyé !",
      description: "Nous vous recontacterons dans les plus brefs délais."
    });
    setFormData({
      name: "",
      email: "",
      company: "",
      subject: "",
      message: ""
    });
    setIsLoading(false);
  };
  return <Layout>
      <FloatingParticles />
      
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-neon-violet/10 via-transparent to-transparent" />
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute top-1/4 left-1/4 w-[200px] md:w-[300px] lg:w-[400px] h-[200px] md:h-[300px] lg:h-[400px] bg-violet-600/15 rounded-full blur-[80px] md:blur-[120px] lg:blur-[150px] animate-pulse-glow" style={{
        transform: `translateY(${parallaxSlow}px)`
      }} />
        <div className="absolute top-1/3 right-1/4 w-[150px] md:w-[250px] lg:w-[300px] h-[150px] md:h-[250px] lg:h-[300px] bg-purple-600/10 rounded-full blur-[60px] md:blur-[100px] lg:blur-[120px] animate-pulse-glow hidden sm:block" style={{
        transform: `translateY(${parallaxMedium}px)`,
        animationDelay: "1s"
      }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal variant="fadeInUp">
              <div className="mb-6 flex justify-center">
                <div className="badge-gradient flex items-center gap-2 text-sm font-medium text-violet-300">
                  Contactez-nous
                </div>
              </div>
            </ScrollReveal>
            
            <motion.div className="mb-8 flex justify-center" initial={{
            opacity: 0,
            scale: 0.8,
            rotate: -10
          }} animate={{
            opacity: 1,
            scale: 1,
            rotate: 0
          }} transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.25, 0.1, 0.25, 1]
          }}>
              <div className="relative">
                <div className="absolute inset-0 bg-neon-violet/50 blur-[60px] rounded-full scale-110 animate-pulse-glow" />
                <img src={logoHero} alt="IMPARTIAL" className="relative w-32 h-32 drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]" />
              </div>
            </motion.div>
            
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
                Parlons de votre <span className="text-gradient-neon">projet</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="fadeInUp" delay={0.3}>
              <p className="text-xl text-muted-foreground">
                Une idée ? Un besoin ? Contactez-nous et donnons vie à votre vision digitale.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <SectionTransition className="py-16 relative" parallaxStrength={0.05}>
        <ParallaxBackground speed={0.2}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        </ParallaxBackground>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <ScrollReveal variant="fadeInLeft">
                <h2 className="text-2xl font-bold mb-6">Informations</h2>
              </ScrollReveal>

              <div className="space-y-6">
              <ScrollReveal variant="fadeInLeft" delay={0.1}>
                  <Hover3DCard className="rounded-xl" rotateStrength={5}>
                    <div className="flex items-start gap-4 group p-4 glass-card glass-noise rounded-xl hover:border-neon-violet/30 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-neon-violet/10 border border-neon-violet/30 flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300">
                        <Mail className="h-5 w-5 text-neon-violet" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">Email</p>
                        <a href="mailto:contact@impartialgames.com" className="text-muted-foreground hover:text-neon-violet transition-colors">
                          contact@impartialgames.com
                        </a>
                      </div>
                    </div>
                  </Hover3DCard>
                </ScrollReveal>


                <ScrollReveal variant="fadeInLeft" delay={0.3}>
                  <Hover3DCard className="rounded-xl" rotateStrength={5}>
                    <div className="flex items-start gap-4 group p-4 glass-card glass-noise rounded-xl hover:border-rose-500/30 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all duration-300">
                        <MapPin className="h-5 w-5 text-rose-400" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">Adresse</p>
                        <p className="text-muted-foreground">
                          Delaware, États-Unis
                        </p>
                      </div>
                    </div>
                  </Hover3DCard>
                </ScrollReveal>
              </div>

              {/* Hours */}
              <ScrollReveal variant="fadeInLeft" delay={0.4}>
                <Hover3DCard className="rounded-2xl" rotateStrength={4}>
                  <div className="p-6 glass-card glass-noise rounded-2xl hover:border-neon-violet/30 transition-all duration-300">
                    <h3 className="font-semibold mb-4 text-neon-violet">Horaires</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Lundi - Vendredi: 9h00 - 18h00</p>
                      <p>Weekend: Sur rendez-vous</p>
                    </div>
                  </div>
                </Hover3DCard>
              </ScrollReveal>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ScrollReveal variant="fadeInRight">
                <Hover3DCard className="rounded-2xl" rotateStrength={3} glareEnabled={false}>
                  <form onSubmit={handleSubmit} className="p-8 glass-surface glass-noise rounded-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/10 via-transparent to-purple-600/10 rounded-[inherit]" />
                    
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold mb-6">Envoyez-nous un <span className="text-gradient-neon">message</span></h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <motion.div initial={{
                        opacity: 0,
                        y: 20
                      }} whileInView={{
                        opacity: 1,
                        y: 0
                      }} transition={{
                        delay: 0.1
                      }}>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Nom complet *
                          </label>
                          <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-background/50 border border-white/10 focus:border-neon-violet focus:outline-none focus:ring-1 focus:ring-neon-violet focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all" placeholder="John Doe" />
                        </motion.div>
                        <motion.div initial={{
                        opacity: 0,
                        y: 20
                      }} whileInView={{
                        opacity: 1,
                        y: 0
                      }} transition={{
                        delay: 0.15
                      }}>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email *
                          </label>
                          <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-background/50 border border-white/10 focus:border-neon-violet focus:outline-none focus:ring-1 focus:ring-neon-violet focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all" placeholder="john@example.com" />
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <motion.div initial={{
                        opacity: 0,
                        y: 20
                      }} whileInView={{
                        opacity: 1,
                        y: 0
                      }} transition={{
                        delay: 0.2
                      }}>
                          <label htmlFor="company" className="block text-sm font-medium mb-2">
                            Entreprise
                          </label>
                          <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-background/50 border border-white/10 focus:border-neon-violet focus:outline-none focus:ring-1 focus:ring-neon-violet focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all" placeholder="Votre entreprise" />
                        </motion.div>
                        <motion.div initial={{
                        opacity: 0,
                        y: 20
                      }} whileInView={{
                        opacity: 1,
                        y: 0
                      }} transition={{
                        delay: 0.25
                      }}>
                          <label htmlFor="subject" className="block text-sm font-medium mb-2">
                            Sujet *
                          </label>
                          <input type="text" id="subject" name="subject" required value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-background/50 border border-white/10 focus:border-neon-violet focus:outline-none focus:ring-1 focus:ring-neon-violet focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all" placeholder="Votre projet" />
                        </motion.div>
                      </div>

                      <motion.div className="mb-6" initial={{
                      opacity: 0,
                      y: 20
                    }} whileInView={{
                      opacity: 1,
                      y: 0
                    }} transition={{
                      delay: 0.3
                    }}>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Message *
                        </label>
                        <textarea id="message" name="message" required rows={6} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-background/50 border border-white/10 focus:border-neon-violet focus:outline-none focus:ring-1 focus:ring-neon-violet focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all resize-none" placeholder="Décrivez votre projet, vos besoins, vos délais..." />
                      </motion.div>

                      <motion.div initial={{
                      opacity: 0,
                      y: 20
                    }} whileInView={{
                      opacity: 1,
                      y: 0
                    }} transition={{
                      delay: 0.35
                    }}>
                        <RippleButton type="submit" disabled={isLoading} className="group w-full md:w-auto btn-gradient px-8 py-4 text-white font-semibold rounded-xl inline-flex items-center justify-center gap-2 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed">
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                          <span className="relative">{isLoading ? "Envoi en cours..." : "Envoyer le message"}</span>
                          {isLoading ? <Loader2 className="relative h-5 w-5 animate-spin" /> : <Send className="relative h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />}
                        </RippleButton>
                      </motion.div>
                    </div>
                  </form>
                </Hover3DCard>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </SectionTransition>

      {/* Calendly Section */}
      <SectionTransition className="py-16 relative" parallaxStrength={0.05}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal variant="fadeInUp">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Réservez un <span className="text-gradient-neon">rendez-vous</span>
                </h2>
                <p className="text-muted-foreground">
                  Choisissez un créneau qui vous convient pour discuter de votre projet
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal variant="fadeIn" delay={0.2}>
              <Hover3DCard className="rounded-2xl" rotateStrength={3} glareEnabled={false}>
                <div className="glass-surface glass-noise rounded-2xl overflow-hidden">
                  <iframe src="https://calendly.com/yannis-bezriche/impartial-games" width="100%" height="700" frameBorder="0" title="Calendly" className="bg-transparent" />
                </div>
              </Hover3DCard>
            </ScrollReveal>
          </div>
        </div>
      </SectionTransition>

      {/* Newsletter Section */}
      <SectionTransition className="py-16 relative" parallaxStrength={0.05}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            <ScrollReveal variant="fadeInUp">
              <Newsletter variant="card" />
            </ScrollReveal>
          </div>
        </div>
      </SectionTransition>
    </Layout>;
};
export default Contact;