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
  },
];

export default function Fonctionnalites() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-40 md:pb-24 relative bg-white">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal variant="fadeInUp">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
                Fonctionnalités
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.1}>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight text-gray-900">
                Tous les outils pour{" "}
                <span className="font-medium text-gradient-neon">piloter votre activité</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
                MBA regroupe 8 modules complémentaires pour gérer vos clients, vos projets, votre facturation et votre équipe. Activez uniquement ceux dont vous avez besoin.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fadeInUp" delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
                <Link
                  to="/contact?subject=Demo%20MBA"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#22c55e] text-white font-semibold rounded-full shadow-[0_4px_14px_rgba(34,197,94,0.40)] hover:bg-[#16a34a] transition-colors"
                >
                  Demander une démo
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/#offres"
                  className="px-8 py-4 font-semibold rounded-full border border-gray-200 text-gray-900 hover:border-[#22c55e]/50 hover:text-[#22c55e] transition-colors"
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
        const bgClass = index % 2 === 0 ? "bg-gray-50" : "bg-white";
        return (
          <section
            key={mod.id}
            id={mod.id}
            className={`py-16 md:py-24 relative ${bgClass}`}
          >
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <div
                className={`flex flex-col ${
                  isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                } gap-12 lg:gap-16 items-center max-w-6xl mx-auto`}
              >
                {/* Text */}
                <div className="flex-1 space-y-6">
                  <ScrollReveal variant="fadeInUp">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 flex items-center justify-center">
                        <mod.icon className="h-5 w-5 text-[#22c55e]" />
                      </div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                        {mod.subtitle}
                      </p>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal variant="fadeInUp" delay={0.1}>
                    <h2 className="text-3xl md:text-4xl font-light tracking-tight text-gray-900">
                      {mod.title}
                    </h2>
                  </ScrollReveal>

                  <ScrollReveal variant="fadeInUp" delay={0.15}>
                    <p className="text-gray-600 font-light leading-relaxed">
                      {mod.description}
                    </p>
                  </ScrollReveal>

                  <ScrollReveal variant="fadeInUp" delay={0.2}>
                    <ul className="space-y-3 pt-2">
                      {mod.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="h-5 w-5 flex-shrink-0 mt-0.5 text-[#22c55e]" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollReveal>
                </div>

                {/* Screenshot */}
                <div className="flex-1 w-full">
                  <ScrollReveal variant={isReversed ? "fadeInLeft" : "fadeInRight"} delay={0.2}>
                    <motion.div
                      className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-xl"
                      whileHover={{ scale: 1.02, y: -4 }}
                      transition={{ duration: 0.4 }}
                    >
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
      <section className="py-24 relative bg-white">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal variant="scaleIn">
            <div className="max-w-3xl mx-auto text-center bg-gray-50 border border-gray-200 p-8 sm:p-12 md:p-16 rounded-2xl sm:rounded-3xl shadow-lg">
              <h2 className="text-3xl md:text-4xl font-light mb-4 tracking-tight text-gray-900">
                Prêt à tout <span className="font-medium text-gradient-neon">centraliser ?</span>
              </h2>
              <p className="text-gray-600 font-light mb-8 max-w-lg mx-auto">
                Choisissez votre plan, activez vos modules et simplifiez votre gestion dès aujourd'hui.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact?subject=Demo%20MBA"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#22c55e] text-white font-semibold rounded-full shadow-[0_4px_14px_rgba(34,197,94,0.40)] hover:bg-[#16a34a] transition-colors"
                >
                  Demander une démo
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/#offres"
                  className="inline-flex items-center justify-center px-8 py-4 font-semibold rounded-full border border-gray-200 text-gray-900 hover:border-[#22c55e]/50 hover:text-[#22c55e] transition-colors"
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
