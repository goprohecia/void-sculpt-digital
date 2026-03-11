import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
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
import btpImg from "@/assets/sectors/btp.jpg";
import coiffureImg from "@/assets/sectors/coiffure.jpg";
import cabinetsImg from "@/assets/sectors/cabinets.jpg";
import autoEcoleImg from "@/assets/sectors/auto-ecole.jpg";
import nettoyageImg from "@/assets/sectors/nettoyage.jpg";

interface Sector {
  image: string;
  title: string;
  description: string;
  href?: string;
}

interface SectorGroup {
  category: string;
  color: string;
  sectors: Sector[];
}

const sectorGroups: SectorGroup[] = [
  {
    category: "Tech & Digital",
    color: "text-blue-500",
    sectors: [
      { image: devImg, title: "Développeur freelance", description: "Gestion de projets, clients et facturation.", href: "/secteurs/developpeur" },
      { image: designerImg, title: "Designer / Motion", description: "Suivi créatif, briefs clients et livrables.", href: "/secteurs/designer" },
      { image: photographeImg, title: "Photographe / Vidéaste", description: "Bookings, galeries clients et devis.", href: "/secteurs/photographe" },
      { image: cmImg, title: "Community Manager", description: "Gestion multi-clients et reporting.", href: "/secteurs/community-manager" },
      { image: reparateurImg, title: "Réparateur de téléphones", description: "Suivi réparations, stock et facturation.", href: "/secteurs/reparateur" },
    ],
  },
  {
    category: "Services & Conseil",
    color: "text-emerald-500",
    sectors: [
      { image: consultantImg, title: "Consultant (marketing, RH)", description: "Missions et suivi commercial.", href: "/secteurs/consultant" },
      { image: coachImg, title: "Coach sportif", description: "Séances, fiches clients et paiements.", href: "/secteurs/coach-sportif" },
      { image: immobilierImg, title: "Agent immobilier", description: "Mandats, visites et acquéreurs.", href: "/secteurs/immobilier" },
      { image: conciergerieImg, title: "Conciergerie Airbnb", description: "Biens, check-in/out et revenus.", href: "/secteurs/conciergerie" },
      { image: formateurImg, title: "Formateur indépendant", description: "Sessions, inscriptions et conventions.", href: "/secteurs/formateur" },
    ],
  },
  {
    category: "Commerce & Événementiel",
    color: "text-amber-500",
    sectors: [
      { image: boutiqueImg, title: "Gérant de boutique", description: "Stock, ventes et fidélisation.", href: "/secteurs/boutique" },
      { image: evenementielImg, title: "Organisateur d'événements", description: "Projets, prestataires et budgets.", href: "/secteurs/evenementiel" },
      { image: mariageImg, title: "Wedding planner", description: "Couples, planning jour J et devis.", href: "/secteurs/mariage" },
      { image: traiteurImg, title: "Traiteur indépendant", description: "Commandes, menus et livraisons.", href: "/secteurs/traiteur" },
      { image: djImg, title: "DJ / Animateur", description: "Bookings, contrats et calendrier.", href: "/secteurs/dj-animateur" },
    ],
  },
  {
    category: "Artisanat & Terrain",
    color: "text-rose-500",
    sectors: [
      { image: garageImg, title: "Garages & Carrosseries", description: "Véhicules, devis et suivi d'atelier.", href: "/secteurs/garages" },
      { image: btpImg, title: "BTP & Artisans", description: "Chantiers, devis et gestion d'équipes.", href: "/secteurs/btp" },
      { image: coiffureImg, title: "Salons & Instituts", description: "Rendez-vous, clients et stock produits.", href: "/secteurs/coiffure" },
      { image: cabinetsImg, title: "Cabinets comptables & juridiques", description: "Dossiers, échéances et facturation.", href: "/secteurs/cabinets" },
      { image: autoEcoleImg, title: "Auto-École", description: "Élèves, planning conduite et examens.", href: "/secteurs/auto-ecole" },
      { image: nettoyageImg, title: "Nettoyage & Propreté", description: "Contrats, planning et stock produits.", href: "/secteurs/nettoyage" },
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
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

function SectorCard({ sector, index }: { sector: Sector; index: number }) {
  const content = (
    <div className="group relative rounded-2xl overflow-hidden bg-white border border-gray-200/60 hover:border-[#22c55e]/40 transition-all duration-500 hover:shadow-lg hover:shadow-[#22c55e]/5">
      <div className="relative h-40 sm:h-44 overflow-hidden">
        <motion.img
          src={sector.image}
          alt={sector.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <ArrowRight className="h-4 w-4 text-gray-900" />
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 group-hover:text-[#22c55e] transition-colors duration-300">
          {sector.title}
        </h4>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          {sector.description}
        </p>
      </div>
    </div>
  );

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {sector.href ? (
        <Link to={sector.href} className="block h-full">{content}</Link>
      ) : (
        content
      )}
    </motion.div>
  );
}

export function ServicesSection() {
  let globalIndex = 0;

  return (
    <section id="secteurs" className="bg-[#F6F5F2]">
      <SectionTransition className="py-24 md:py-32 relative" parallaxStrength={0.03}>
        <div className="container mx-auto px-4 relative z-10">
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

          <div className="max-w-7xl mx-auto space-y-16">
            {sectorGroups.map((group) => (
              <div key={group.category}>
                <ScrollReveal variant="fadeInUp">
                  <h3 className={`text-lg md:text-xl font-semibold mb-6 ${group.color}`}>
                    {group.category}
                  </h3>
                </ScrollReveal>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                  {group.sectors.map((sector) => {
                    const idx = globalIndex++;
                    return <SectorCard key={sector.title} sector={sector} index={idx} />;
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
