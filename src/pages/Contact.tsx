import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { FloatingParticles } from "@/components/FloatingParticles";
import { Newsletter } from "@/components/Newsletter";
import { Mail, Phone, MapPin, Send, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useParallax } from "@/hooks/use-parallax";
import logoHero from "@/assets/logo-hero.png";

const Contact = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const parallaxSlow = useParallax(0.15);
  const parallaxMedium = useParallax(0.25);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const subject = searchParams.get("subject");
    if (subject) {
      setFormData((prev) => ({ ...prev, subject: decodeURIComponent(subject) }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Message envoyé !",
      description: "Nous vous recontacterons dans les plus brefs délais.",
    });
    setFormData({ name: "", email: "", company: "", subject: "", message: "" });
    setIsLoading(false);
  };

  return (
    <Layout>
      <FloatingParticles />
      
      {/* Hero */}
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
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6 flex justify-center opacity-0 animate-fade-in">
              <div className="badge-gradient flex items-center gap-2 text-sm font-medium text-violet-300">
                <Sparkles className="h-4 w-4" />
                Contactez-nous
              </div>
            </div>
            
            <div className="mb-8 flex justify-center opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="relative">
                <div className="absolute inset-0 bg-neon-violet/50 blur-[60px] rounded-full scale-110 animate-pulse-glow" />
                <img
                  src={logoHero}
                  alt="IMPARTIAL"
                  className="relative w-32 h-32 drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Parlons de votre <span className="text-gradient-neon">projet</span>
            </h1>
            <p
              className="text-xl text-muted-foreground opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              Une idée ? Un besoin ? Contactez-nous et donnons vie à votre vision digitale.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-violet/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Informations</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-neon-violet/10 border border-neon-violet/30 flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300">
                      <Mail className="h-5 w-5 text-neon-violet" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Email</p>
                      <a href="mailto:contact@impartial.studio" className="text-muted-foreground hover:text-neon-violet transition-colors">
                        contact@impartial.studio
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300">
                      <Phone className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Téléphone</p>
                      <a href="tel:+33123456789" className="text-muted-foreground hover:text-emerald-400 transition-colors">
                        +33 1 23 45 67 89
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all duration-300">
                      <MapPin className="h-5 w-5 text-rose-400" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Adresse</p>
                      <p className="text-muted-foreground">
                        Paris, France
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="p-6 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10 hover:border-neon-violet/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all duration-300">
                <h3 className="font-semibold mb-4 text-neon-violet">Horaires</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Lundi - Vendredi: 9h00 - 18h00</p>
                  <p>Weekend: Sur rendez-vous</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/5 via-transparent to-purple-600/5 rounded-2xl" />
                
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-6">Envoyez-nous un <span className="text-gradient-neon">message</span></h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-white/10 focus:border-neon-violet focus:outline-none focus:ring-1 focus:ring-neon-violet focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-white/10 focus:border-neon-violet focus:outline-none focus:ring-1 focus:ring-neon-violet focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-2">
                        Entreprise
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-white/10 focus:border-neon-violet focus:outline-none focus:ring-1 focus:ring-neon-violet focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all"
                        placeholder="Votre entreprise"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Sujet *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-white/10 focus:border-neon-violet focus:outline-none focus:ring-1 focus:ring-neon-violet focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all"
                        placeholder="Votre projet"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-background/50 border border-white/10 focus:border-neon-violet focus:outline-none focus:ring-1 focus:ring-neon-violet focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all resize-none"
                      placeholder="Décrivez votre projet, vos besoins, vos délais..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group w-full md:w-auto btn-gradient px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] inline-flex items-center justify-center gap-2 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative">{isLoading ? "Envoi en cours..." : "Envoyer le message"}</span>
                    {isLoading ? (
                      <Loader2 className="relative h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="relative h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Newsletter variant="card" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;