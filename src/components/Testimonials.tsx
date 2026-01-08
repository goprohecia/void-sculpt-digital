import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal, SectionTransition, ParallaxBackground } from "@/components/animations";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sophie Martin",
    role: "CEO",
    company: "Fashion Brand",
    content: "IMPARTIAL a transformé notre vision en une boutique e-commerce exceptionnelle. Les ventes ont augmenté de 340% en 6 mois. Une équipe vraiment à l'écoute et créative.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Thomas Dubois",
    role: "Fondateur",
    company: "FitLife App",
    content: "L'application mobile qu'ils ont développée dépasse toutes nos attentes. Interface fluide, performances optimales, et un suivi projet irréprochable du début à la fin.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Marie Leroy",
    role: "Directrice Marketing",
    company: "DataCorp",
    content: "Notre dashboard analytics est devenu l'outil central de notre équipe. Des visualisations claires et une UX remarquable. Collaboration très professionnelle.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    name: "Alexandre Chen",
    role: "CTO",
    company: "FinTech Plus",
    content: "L'écosystème 360° qu'IMPARTIAL a créé pour notre startup nous a permis de lever 2M€. Qualité technique irréprochable et vision stratégique pertinente.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: 5,
    name: "Camille Bernard",
    role: "Gérante",
    company: "Maison Bijoux",
    content: "Un site vitrine qui reflète parfaitement l'élégance de notre marque. Les animations et le design sont sublimes. Nos clients adorent la nouvelle expérience.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
  },
];

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    // Auto-scroll
    const autoplay = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, 5000);

    return () => {
      clearInterval(autoplay);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <SectionTransition className="py-24 relative overflow-hidden" parallaxStrength={0.05}>
      {/* Background Effects */}
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
              <span className="text-sm font-medium text-neon-violet">Témoignages</span>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ce que disent nos <span className="text-gradient-neon">clients</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez les retours de nos clients qui nous font confiance pour leurs projets digitaux.
            </p>
          </ScrollReveal>
        </div>

        {/* Carousel */}
        <ScrollReveal variant="fadeIn" delay={0.3}>
          <div className="relative max-w-5xl mx-auto">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex-[0_0_100%] min-w-0 px-4 md:flex-[0_0_80%] lg:flex-[0_0_60%]"
                  >
                    <motion.div 
                      className="group bg-glass-dark/80 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-white/10 hover:border-neon-violet/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]"
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      {/* Quote Icon */}
                      <div className="flex justify-between items-start mb-6">
                        <Quote className="h-10 w-10 text-neon-violet/40" />
                        <div className="flex gap-1">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-5 w-5 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-lg md:text-xl leading-relaxed mb-8 text-foreground/90">
                        "{testimonial.content}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-neon-violet/40"
                          />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-violet/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role} • <span className="text-neon-violet">{testimonial.company}</span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <motion.button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 p-3 rounded-full bg-glass-dark/80 backdrop-blur-xl border border-white/10 hover:border-neon-violet/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>
            <motion.button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 p-3 rounded-full bg-glass-dark/80 backdrop-blur-xl border border-white/10 hover:border-neon-violet/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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
            {testimonials.map((_, index) => (
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
      </div>
    </SectionTransition>
  );
}
