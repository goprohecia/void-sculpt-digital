import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Users, FolderOpen, Receipt, MessageSquare, LifeBuoy, Package, BarChart3, Check } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ScrollReveal, StaggerContainer, staggerItemVariants } from "@/components/animations";

import dashboardImg from "@/assets/screenshots/dashboard.jpg";
import clientsImg from "@/assets/screenshots/clients.jpg";
import dossiersImg from "@/assets/screenshots/dossiers.jpg";
import facturationImg from "@/assets/screenshots/facturation.jpg";
import messagerieImg from "@/assets/screenshots/messagerie.jpg";
import supportImg from "@/assets/screenshots/support.jpg";
import stockImg from "@/assets/screenshots/stock.jpg";
import analyseImg from "@/assets/screenshots/analyse.jpg";

const modules = [
  {
    id: "dashboard",
    icon: BarChart3,
    title: "Tableau de bord",
    subtitle: "Vue d'ensemble en temps réel",
    description:
      "Accédez à une synthèse complète de votre activité : chiffre d'affaires, nombre de clients, dossiers en cours, taux de conversion. Les KPIs s'actualisent en temps réel pour vous offrir une vision claire de votre performance.",
    features: [
      "KPIs dynamiques (CA, clients, dossiers, conversion)",
      "Graphiques d'évolution mensuelle",
      "Objectifs mensuels avec suivi de progression",
      "Notifications et alertes centralisées",
    ],
    image: dashboardImg,
    color: "from-violet-500/20 to-purple-600/20",
    accentColor: "text-violet-400",
  },
  {
    id: "clients",
    icon: Users,
    title: "Gestion clients",
    subtitle: "CRM complet et intuitif",
    description:
      "Centralisez toutes les informations de vos clients : coordonnées, historique des interactions, dossiers associés, tags personnalisés. Segmentez votre base et retrouvez n'importe quel client en un instant.",
    features: [
      "Fiches clients détaillées (adresse, SIRET, téléphone)",
      "Système de tags personnalisables avec couleurs",
      "Segmentation et filtres avancés",
      "Historique complet des dossiers et factures par client",
      "Import/Export CSV",
    ],
    image: clientsImg,
    color: "from-blue-500/20 to-cyan-600/20",
    accentColor: "text-blue-400",
  },
  {
    id: "dossiers",
    icon: FolderOpen,
    title: "Dossiers",
    subtitle: "Suivi de projets centralisé",
    description:
      "Créez et suivez vos dossiers de A à Z. Assignez-les à des collaborateurs, définissez des échéances, suivez l'avancement et associez devis et factures. Chaque dossier est un hub complet pour votre projet.",
    features: [
      "Création depuis une demande client ou en direct",
      "Assignation aux salariés avec notifications",
      "Suivi des statuts (en attente, en cours, terminé)",
      "Lien vers les devis et factures associés",
      "URL de preview pour les projets web",
    ],
    image: dossiersImg,
    color: "from-emerald-500/20 to-green-600/20",
    accentColor: "text-emerald-400",
  },
  {
    id: "facturation",
    icon: Receipt,
    title: "Facturation",
    subtitle: "Devis, factures et encaissements",
    description:
      "Générez des devis et factures professionnels en quelques clics. Suivez les paiements, envoyez des relances automatiques et faites signer électroniquement. Export PDF conforme aux normes françaises.",
    features: [
      "Génération PDF de devis et factures",
      "Signature électronique intégrée",
      "Relances automatiques configurables",
      "Suivi des paiements et encaissements",
      "Mentions légales et IBAN personnalisables",
      "Historique d'envoi et logs email",
    ],
    image: facturationImg,
    color: "from-amber-500/20 to-orange-600/20",
    accentColor: "text-amber-400",
  },
  {
    id: "messagerie",
    icon: MessageSquare,
    title: "Messagerie",
    subtitle: "Communication centralisée",
    description:
      "Échangez directement avec vos clients et votre équipe depuis une messagerie intégrée. Chaque conversation est liée à un client, avec historique complet et compteur de messages non lus.",
    features: [
      "Messagerie temps réel avec notifications",
      "Conversations liées aux fiches clients",
      "Compteur de messages non lus",
      "Historique des échanges sauvegardé",
      "Accessible depuis l'espace admin, client et salarié",
    ],
    image: messagerieImg,
    color: "from-purple-500/20 to-pink-600/20",
    accentColor: "text-purple-400",
  },
  {
    id: "support",
    icon: LifeBuoy,
    title: "Support",
    subtitle: "Gestion des tickets",
    description:
      "Offrez un support client structuré avec un système de tickets. Vos clients créent des demandes, vous priorisez et résolvez. Chaque ticket dispose d'un fil de discussion dédié.",
    features: [
      "Création de tickets depuis l'espace client",
      "Niveaux de priorité (basse, moyenne, haute, urgente)",
      "Statuts de suivi (ouvert, en cours, résolu, fermé)",
      "Fil de discussion par ticket",
      "Badge de compteur dans la navigation admin",
    ],
    image: supportImg,
    color: "from-rose-500/20 to-red-600/20",
    accentColor: "text-rose-400",
  },
  {
    id: "stock",
    icon: Package,
    title: "Stock",
    subtitle: "Inventaire et fournisseurs",
    description:
      "Gérez votre inventaire complet : produits, catégories, fournisseurs, bons de commande. Recevez des alertes quand un produit passe sous le seuil minimum et tracez chaque mouvement de stock.",
    features: [
      "Catalogue produits avec SKU et catégories",
      "Gestion des fournisseurs (coordonnées, notes)",
      "Bons de commande avec suivi de livraison",
      "Alertes de stock bas automatiques",
      "Historique des mouvements (entrées/sorties)",
      "Accessible aux salariés pour les mises à jour terrain",
    ],
    image: stockImg,
    color: "from-cyan-500/20 to-teal-600/20",
    accentColor: "text-cyan-400",
  },
  {
    id: "analyse",
    icon: BarChart3,
    title: "Analyse",
    subtitle: "Business intelligence",
    description:
      "Visualisez vos données clés sous forme de graphiques interactifs. Suivez l'évolution de votre CA, le nombre de nouveaux clients, les taux de conversion et les performances de votre équipe.",
    features: [
      "Graphiques interactifs (ligne, barre, camembert)",
      "Données mensuelles comparatives",
      "Objectifs vs réalisé avec progression",
      "Export des rapports",
      "Panier moyen et taux de conversion",
    ],
    image: analyseImg,
    color: "from-indigo-500/20 to-violet-600/20",
    accentColor: "text-indigo-400",
  },
];

export default function Fonctionnalites() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-violet/5 via-transparent to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal variant="fadeInUp">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
                Fonctionnalités
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight">
                Tous les outils pour{" "}
                <span className="font-medium text-gradient-neon">piloter votre activité</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                MBA regroupe 8 modules complémentaires pour gérer vos clients, vos projets, votre facturation et votre équipe. Activez uniquement ceux dont vous avez besoin.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
                <Link
                  to="/contact?subject=Demo%20MBA"
                  className="btn-gradient inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl"
                >
                  Demander une démo
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/#offres"
                  className="glass-button px-8 py-4 font-semibold rounded-xl hover:border-neon-violet/50"
                >
                  Voir les offres
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Module Sections */}
      {modules.map((mod, index) => {
        const isReversed = index % 2 !== 0;
        return (
          <section
            key={mod.id}
            id={mod.id}
            className="py-16 md:py-24 relative"
          >
            {/* Subtle background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${mod.color} opacity-30`} />

            <div className="container mx-auto px-6 relative z-10">
              <div
                className={`flex flex-col ${
                  isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                } gap-12 lg:gap-16 items-center max-w-6xl mx-auto`}
              >
                {/* Text */}
                <div className="flex-1 space-y-6">
                  <ScrollReveal variant="fadeInUp">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                        <mod.icon className={`h-5 w-5 ${mod.accentColor}`} />
                      </div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {mod.subtitle}
                      </p>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal variant="fadeInUp" delay={0.1}>
                    <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                      {mod.title}
                    </h2>
                  </ScrollReveal>

                  <ScrollReveal variant="fadeInUp" delay={0.15}>
                    <p className="text-muted-foreground font-light leading-relaxed">
                      {mod.description}
                    </p>
                  </ScrollReveal>

                  <ScrollReveal variant="fadeInUp" delay={0.2}>
                    <ul className="space-y-3 pt-2">
                      {mod.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${mod.accentColor}`} />
                          <span className="text-sm text-foreground/90">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollReveal>
                </div>

                {/* Screenshot */}
                <div className="flex-1 w-full">
                  <ScrollReveal variant={isReversed ? "fadeInLeft" : "fadeInRight"} delay={0.2}>
                    <motion.div
                      className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/30"
                      whileHover={{ scale: 1.02, y: -4 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Glass reflection overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] z-10 pointer-events-none" />
                      <img
                        src={mod.image}
                        alt={`Interface ${mod.title} — MBA`}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                    </motion.div>
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Bottom CTA */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal variant="scaleIn">
            <div className="max-w-3xl mx-auto text-center glass-ultra glass-noise p-12 md:p-16 rounded-3xl">
              <h2 className="text-3xl md:text-4xl font-light mb-4 tracking-tight">
                Prêt à tout <span className="font-medium text-gradient-neon">centraliser ?</span>
              </h2>
              <p className="text-muted-foreground font-light mb-8 max-w-lg mx-auto">
                Choisissez votre plan, activez vos modules et simplifiez votre gestion dès aujourd'hui.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact?subject=Demo%20MBA"
                  className="btn-gradient inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-xl"
                >
                  Demander une démo
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/#offres"
                  className="glass-button inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl hover:border-neon-violet/50"
                >
                  Voir les offres
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
}
