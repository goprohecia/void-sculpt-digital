import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Mail, MapPin, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ScrollReveal, SectionTransition } from "@/components/animations";

const subjectOptions = [
"Demande de démo",
"Question sur les offres",
"Support technique",
"Autre"];


const Contact = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
      setFormData((prev) => ({
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
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast({
      title: "Message envoyé !",
      description: "Nous vous recontacterons dans les plus brefs délais."
    });
    setFormData({ name: "", email: "", company: "", subject: "", message: "" });
    setIsLoading(false);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[50svh] flex items-center justify-center overflow-hidden pt-24 bg-white">
        <motion.div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse 80% 60% at ${gradientX} ${gradientY}, hsl(142 71% 45% / 0.08), transparent 70%)`
          }} />
        

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}>
            
            <motion.p
              className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}>
              
              Contact
            </motion.p>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-8 tracking-tight leading-[1.1] text-gray-900"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}>
              
              Demandez votre <span className="font-medium text-gradient-neon">démo MBA.</span>
            </motion.h1>

            <motion.p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
              
              Découvrez comment MBA peut transformer la gestion de votre activité.
            </motion.p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </section>

      {/* Contact Section */}
      <SectionTransition className="py-20 relative bg-white">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <ScrollReveal variant="fadeInLeft">
                <h2 className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-8">Informations</h2>
              </ScrollReveal>

              <div className="space-y-6">
                <ScrollReveal variant="fadeInLeft" delay={0.1}>
                  <div className="group p-6 rounded-2xl border border-gray-200 bg-gray-50 hover:border-[#22c55e]/30 transition-all duration-500">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-[#22c55e]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <a href="mailto:contact@mybusinessassistant.com" className="text-gray-900 hover:text-[#22c55e] transition-colors">
                          contact@mybusinessassistant.com
                        </a>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal variant="fadeInLeft" delay={0.2}>
                  <div className="group p-6 rounded-2xl border border-gray-200 bg-gray-50 hover:border-[#22c55e]/30 transition-all duration-500">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-[#22c55e]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Localisation</p>
                        <p className="text-gray-900">Delaware, États-Unis</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal variant="fadeInLeft" delay={0.3}>
                  <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-500 mb-2">Horaires</p>
                    <div className="space-y-1 text-sm text-gray-900">
                      <p>Lundi - Vendredi: 9h00 - 18h00</p>
                      <p className="text-gray-500">Weekend: Sur rendez-vous</p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ScrollReveal variant="fadeInRight">
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-gray-200 bg-gray-50">
                  <h2 className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-8">
                    Demandez une démo
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                      <label htmlFor="name" className="block text-sm text-gray-600 mb-2">Nom complet *</label>
                      <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#22c55e]/50 focus:outline-none focus:ring-0 transition-colors placeholder:text-gray-400"
                      placeholder="John Doe" />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                      <label htmlFor="email" className="block text-sm text-gray-600 mb-2">Email *</label>
                      <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#22c55e]/50 focus:outline-none focus:ring-0 transition-colors placeholder:text-gray-400"
                      placeholder="john@example.com" />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <label htmlFor="company" className="block text-sm text-gray-600 mb-2">Entreprise</label>
                      <input type="text" id="company" name="company" value={formData.company} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#22c55e]/50 focus:outline-none focus:ring-0 transition-colors placeholder:text-gray-400"
                      placeholder="Votre entreprise" />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                      <label htmlFor="subject" className="block text-sm text-gray-600 mb-2">Sujet *</label>
                      <select id="subject" name="subject" required value={formData.subject} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#22c55e]/50 focus:outline-none focus:ring-0 transition-colors appearance-none">
                        <option value="" disabled className="text-gray-400">Choisir un sujet</option>
                        {subjectOptions.map((opt) =>
                        <option key={opt} value={opt}>{opt}</option>
                        )}
                      </select>
                    </motion.div>
                  </div>

                  <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <label htmlFor="message" className="block text-sm text-gray-600 mb-2">Message *</label>
                    <textarea id="message" name="message" required rows={6} value={formData.message} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#22c55e]/50 focus:outline-none focus:ring-0 transition-colors resize-none placeholder:text-gray-400"
                    placeholder="Décrivez votre activité et vos besoins..." />
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                    <motion.button type="submit" disabled={isLoading}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 text-sm font-medium tracking-wide uppercase overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <span className="absolute inset-0 bg-[#22c55e] rounded-full" />
                      <span className="absolute inset-0 bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="relative text-white">
                        {isLoading ? "Envoi en cours..." : "Envoyer le message"}
                      </span>
                      {isLoading ?
                      <Loader2 className="relative h-4 w-4 text-white animate-spin" /> :

                      <Send className="relative h-4 w-4 text-white group-hover:translate-x-1 transition-all duration-300" />
                      }
                    </motion.button>
                  </motion.div>
                </form>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </SectionTransition>

      {/* Calendly Section */}
      <SectionTransition className="py-20 relative bg-white">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal variant="fadeInUp">
              <div className="text-center mb-12">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">Rendez-vous</p>
                <h2 className="text-2xl md:text-3xl font-light mb-4 text-gray-900">
                  Réservez une <span className="font-medium text-gradient-neon">démo personnalisée</span>
                </h2>
              </div>
            </ScrollReveal>
            
            <ScrollReveal variant="fadeIn" delay={0.2}>
              <div className="rounded-3xl overflow-hidden border border-gray-200 bg-gray-50 shadow-lg">
                <iframe
                  src="https://calendly.com/yannis-bezriche/impartial-games"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  title="Calendly"
                  className="bg-white sm:h-[700px]" />
                
              </div>
            </ScrollReveal>
          </div>
        </div>
      </SectionTransition>
    </Layout>);

};

export default Contact;