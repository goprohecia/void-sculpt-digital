import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ScrollReveal, SectionTransition } from "@/components/animations";

import devImg from "@/assets/sectors/developpeur.jpg";
import designerImg from "@/assets/sectors/designer.jpg";
import photographeImg from "@/assets/sectors/photographe.jpg";
import cmImg from "@/assets/sectors/community-manager.jpg";
import reparateurImg from "@/assets/sectors/reparateur.jpg";
import consultantImg from "@/assets/sectors/consultant.jpg";
import coachImg from "@/assets/sectors/coach-sportif.jpg";
import immobilierImg from "@/assets/sectors/immobilier.jpg";
import conciergerieImg from "@/assets/sectors/conciergerie.jpg";
import formateurImg from "@/assets/sectors/formateur.jpg";
import boutiqueImg from "@/assets/sectors/boutique.jpg";
import evenementielImg from "@/assets/sectors/evenementiel.jpg";
import mariageImg from "@/assets/sectors/mariage.jpg";
import traiteurImg from "@/assets/sectors/traiteur.jpg";
import djImg from "@/assets/sectors/dj.jpg";
import garageImg from "@/assets/sectors/garages.jpg";
import coiffureImg from "@/assets/sectors/coiffure.jpg";
import btpImg from "@/assets/sectors/btp.jpg";
import nettoyageImg from "@/assets/sectors/nettoyage.jpg";
import autoEcoleImg from "@/assets/sectors/auto-ecole.jpg";

interface Sector {
  name: string;
  description: string;
  image: string;
  link: string;
}

interface Category {
  title: string;
  color: string;
  sectors: Sector[];
}

const categories: Category[] = [
  {
    title: "Tech & Digital",
    color: "text-blue-500",
    sectors: [
      { name: "Développeur freelance", description: "Projets, clients et facturation.", image: devImg, link: "/secteurs/developpeur" },
      { name: "Designer / Motion", description: "Briefs, livrables et suivi créatif.", image: designerImg, link: "/secteurs/designer" },
      { name: "Photographe / Vidéaste", description: "Bookings, galeries et devis.", image: photographeImg, link: "/secteurs/photographe" },
      { name: "Community Manager", description: "Plannings, contrats et reporting.", image: cmImg, link: "/secteurs/community-manager" },
      { name: "Réparateur", description: "Réparations, stock et facturation.", image: reparateurImg, link: "/secteurs/reparateur" },
    ],
  },
  {
    title: "Services & Conseil",
    color: "text-emerald-500",
    sectors: [
      { name: "Consultant", description: "Missions et suivi commercial.", image: consultantImg, link: "/secteurs/consultant" },
      { name: "Coach sportif", description: "Séances, fiches clients et paiements.", image: coachImg, link: "/secteurs/coach-sportif" },
      { name: "Agent immobilier", description: "Mandats, visites et acquéreurs.", image: immobilierImg, link: "/secteurs/immobilier" },
      { name: "Conciergerie Airbnb", description: "Biens, check-in/out et revenus.", image: conciergerieImg, link: "/secteurs/conciergerie" },
      { name: "Formateur", description: "Sessions, inscriptions et conventions.", image: formateurImg, link: "/secteurs/formateur" },
    ],
  },
  {
    title: "Commerce & Événementiel",
    color: "text-amber-500",
    sectors: [
      { name: "Gérant de boutique", description: "Stock, caisse et fidélisation.", image: boutiqueImg, link: "/secteurs/boutique" },
      { name: "Événementiel", description: "Projets, prestataires et budgets.", image: evenementielImg, link: "/secteurs/evenementiel" },
      { name: "Wedding planner", description: "Couples, plannings et prestataires.", image: mariageImg, link: "/secteurs/mariage" },
      { name: "Traiteur", description: "Commandes, menus et logistique.", image: traiteurImg, link: "/secteurs/traiteur" },
      { name: "DJ / Animateur", description: "Bookings, contrats et playlists.", image: djImg, link: "/secteurs/dj-animateur" },
    ],
  },
  {
    title: "Artisanat & Terrain",
    color: "text-rose-500",
    sectors: [
      { name: "Garage automobile", description: "Véhicules, devis et interventions.", image: garageImg, link: "/secteurs/garages" },
      { name: "Salon de coiffure", description: "RDV, clients et encaissements.", image: coiffureImg, link: "/secteurs/coiffure" },
      { name: "BTP / Artisan", description: "Chantiers, devis et suivi terrain.", image: btpImg, link: "/secteurs/btp" },
      { name: "Nettoyage", description: "Interventions, planning et contrats.", image: nettoyageImg, link: "/secteurs/nettoyage" },
      { name: "Auto-école", description: "Élèves, moniteurs et planning.", image: autoEcoleImg, link: "/secteurs/auto-ecole" },
    ],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.06,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

function SectorCard({ sector, index }: { sector: Sector; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      <Link to={sector.link} className="group block">
        <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/60 hover:border-[#22c55e]/40 transition-all duration-500 hover:shadow-lg hover:shadow-[#22c55e]/5">
          {/* Image */}
          <div className="relative h-40 sm:h-44 overflow-hidden">
            <motion.img
              src={sector.image}
              alt={sector.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Hover arrow */}
            <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <ArrowRight className="h-4 w-4 text-gray-900" />
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5">
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 group-hover:text-[#22c55e] transition-colors duration-300">
              {sector.name}
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {sector.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function CiblesSection() {
  let globalIndex = 0;

  return (
    <section id="secteurs" className="bg-[#F6F5F2]">
      <SectionTransition className="py-24 md:py-32 relative" parallaxStrength={0.03}>
        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <ScrollReveal variant="fadeInUp">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6">Nos secteurs</p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h2 className="text-3xl md:text-5xl font-light mb-6 text-gray-900">
                Conçu pour les{" "}
                <span className="font-medium text-gradient-neon">professionnels exigeants.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="text-base md:text-lg text-gray-500 font-light">
                +20 métiers couverts avec des modules adaptés à chaque activité.
              </p>
            </ScrollReveal>
          </div>

          {/* Categories */}
          <div className="max-w-7xl mx-auto space-y-16">
            {categories.map((cat) => (
              <div key={cat.title}>
                <ScrollReveal variant="fadeInUp">
                  <h3 className={`text-lg md:text-xl font-semibold mb-6 ${cat.color}`}>
                    {cat.title}
                  </h3>
                </ScrollReveal>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                  {cat.sectors.map((sector) => {
                    const idx = globalIndex++;
                    return <SectorCard key={sector.name} sector={sector} index={idx} />;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionTransition>
    </section>
  );
}
