import { motion } from "framer-motion";
import {
  Code, Palette, Camera, Users, Smartphone,
  Briefcase, Dumbbell, Building2, Home, GraduationCap,
  ShoppingBag, PartyPopper, Heart, UtensilsCrossed, Music,
  Wrench, HardHat, Scissors, Scale, SprayCan, Car,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal, StaggerContainer, staggerItemVariants } from "@/components/animations";

interface Sector {
  icon: any;
  title: string;
  description: string;
  href?: string;
}

interface SectorGroup {
  category: string;
  color: string;
  bg: string;
  sectors: Sector[];
}

const sectorGroups: SectorGroup[] = [
  {
    category: "Tech & Digital",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    sectors: [
      { icon: Code, title: "Développeur freelance", description: "Gestion de projets, clients et facturation pour développeurs indépendants.", href: "/secteurs/developpeur" },
      { icon: Palette, title: "Designer / Motion", description: "Suivi créatif, briefs clients et livrables organisés.", href: "/secteurs/designer" },
      { icon: Camera, title: "Photographe / Vidéaste", description: "Bookings, galeries clients, devis et contrats.", href: "/secteurs/photographe" },
      { icon: Users, title: "Community Manager", description: "Gestion multi-clients, plannings et reporting.", href: "/secteurs/community-manager" },
      { icon: Smartphone, title: "Réparateur de téléphones", description: "Suivi réparations, stock pièces et facturation.", href: "/secteurs/reparateur" },
    ],
  },
  {
    category: "Services & Conseil",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    sectors: [
      { icon: Briefcase, title: "Consultant (marketing, RH)", description: "Missions, propositions commerciales et suivi client.", href: "/secteurs/consultant" },
      { icon: Dumbbell, title: "Coach sportif / Personal trainer", description: "Planning séances, fiches clients et paiements.", href: "/secteurs/coach-sportif" },
      { icon: Building2, title: "Agent immobilier indépendant", description: "Mandats, visites, dossiers acquéreurs et facturation.", href: "/secteurs/immobilier" },
      { icon: Home, title: "Conciergerie Airbnb", description: "Gestion des biens, check-in/out, interventions et revenus.", href: "/secteurs/conciergerie" },
      { icon: GraduationCap, title: "Formateur indépendant", description: "Sessions, inscriptions, conventions et facturation.", href: "/secteurs/formateur" },
    ],
  },
  {
    category: "Commerce & Événementiel",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    sectors: [
      { icon: ShoppingBag, title: "Gérant de boutique", description: "Stock, ventes, fiches clients et caisse.", href: "/secteurs/boutique" },
      { icon: PartyPopper, title: "Organisateur d'événements", description: "Projets, prestataires, planning et budgets.", href: "/secteurs/evenementiel" },
      { icon: Heart, title: "Wedding planner", description: "Couples, prestataires, planning jour J et devis.", href: "/secteurs/mariage" },
      { icon: UtensilsCrossed, title: "Traiteur indépendant", description: "Commandes, menus, stock ingrédients et livraisons.", href: "/secteurs/traiteur" },
      { icon: Music, title: "DJ / Animateur", description: "Bookings, contrats, calendrier et facturation.", href: "/secteurs/dj-animateur" },
    ],
  },
  {
    category: "Autres secteurs",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    sectors: [
      { icon: Wrench, title: "Garages & Carrosseries", description: "Véhicules, devis, pièces détachées et suivi d'atelier.", href: "/secteurs/garages" },
      { icon: HardHat, title: "BTP & Artisans", description: "Chantiers, devis, factures et gestion d'équipes.", href: "/secteurs/btp" },
      { icon: Scissors, title: "Salons & Instituts de beauté", description: "Rendez-vous, fiches clients et stock produits.", href: "/secteurs/coiffure" },
      { icon: Scale, title: "Cabinets comptables & juridiques", description: "Dossiers, échéances légales et facturation récurrente.", href: "/secteurs/cabinets" },
      { icon: SprayCan, title: "Nettoyage & Propreté", description: "Contrats récurrents, planning et stock produits.", href: "/secteurs/nettoyage" },
    ],
  },
];

export function ServicesSection() {
  return (
    <section id="secteurs" className="py-24 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <ScrollReveal variant="fadeInUp">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Secteurs</p>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Adapté à votre{" "}
              <span className="font-medium text-gradient-neon">secteur d'activité</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-muted-foreground font-light">
              MBA s'adapte aux besoins spécifiques de chaque métier. Ils gèrent tous leur business avec 4-5 outils différents — MBA centralise tout en un seul endroit.
            </p>
          </ScrollReveal>
        </div>

        <div className="space-y-16 max-w-6xl mx-auto">
          {sectorGroups.map((group, gi) => (
            <div key={group.category}>
              <ScrollReveal variant="fadeInUp" delay={gi * 0.1}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`h-1 w-8 rounded-full ${group.bg.replace("/10", "/50")}`} />
                  <h3 className={`text-lg font-semibold ${group.color}`}>{group.category}</h3>
                </div>
              </ScrollReveal>

              <StaggerContainer
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
                staggerDelay={0.05}
                delayStart={gi * 0.1}
              >
                {group.sectors.map((sector) => {
                  const content = (
                    <div className="group h-full p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-500">
                      <div className={`w-10 h-10 rounded-xl ${group.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <sector.icon className={`h-4 w-4 ${group.color}`} />
                      </div>
                      <h4 className="text-sm font-medium mb-1.5">{sector.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{sector.description}</p>
                    </div>
                  );

                  return (
                    <motion.div key={sector.title} variants={staggerItemVariants}>
                      {sector.href ? (
                        <Link to={sector.href} className="block h-full">{content}</Link>
                      ) : (
                        content
                      )}
                    </motion.div>
                  );
                })}
              </StaggerContainer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
