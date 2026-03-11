import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Play, BarChart3, Users, FileText, MessageSquare, Receipt, Package, HeadphonesIcon, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import logoMba from "@/assets/logo-mba.png";
import dashboardImg from "@/assets/screenshots/dashboard.jpg";
import clientsImg from "@/assets/screenshots/clients.jpg";
import dossiersImg from "@/assets/screenshots/dossiers.jpg";
import messagerieImg from "@/assets/screenshots/messagerie.jpg";
import facturationImg from "@/assets/screenshots/facturation.jpg";
import stockImg from "@/assets/screenshots/stock.jpg";
import supportImg from "@/assets/screenshots/support.jpg";
import analyseImg from "@/assets/screenshots/analyse.jpg";

const tourSteps = [
  {
    icon: BarChart3,
    title: "Tableau de bord",
    description: "Vue d'ensemble de votre activité avec KPIs dynamiques, graphiques d'évolution et alertes en temps réel.",
    image: dashboardImg,
    highlight: "Suivez votre CA, dossiers en cours et taux de conversion d'un coup d'œil.",
  },
  {
    icon: Users,
    title: "Gestion des clients",
    description: "Fiches clients complètes avec historique, segmentation automatique et tags personnalisés.",
    image: clientsImg,
    highlight: "Filtrez, recherchez et segmentez votre base clients en quelques clics.",
  },
  {
    icon: FileText,
    title: "Dossiers & Projets",
    description: "Suivi complet de chaque dossier : statut, échéances, documents et assignation aux collaborateurs.",
    image: dossiersImg,
    highlight: "Chaque dossier regroupe devis, factures, messages et historique.",
  },
  {
    icon: MessageSquare,
    title: "Messagerie intégrée",
    description: "Communiquez directement avec vos clients sans quitter MBA. Historique complet et pièces jointes.",
    image: messagerieImg,
    highlight: "Fini les emails perdus : tout est centralisé et traçable.",
  },
  {
    icon: Receipt,
    title: "Facturation & Devis",
    description: "Créez, envoyez et suivez vos devis et factures. Signature électronique et relances automatiques.",
    image: facturationImg,
    highlight: "Transformez un devis signé en facture en un seul clic.",
  },
  {
    icon: Package,
    title: "Gestion de stock",
    description: "Inventaire en temps réel, alertes de seuil, commandes fournisseurs et mouvements de stock.",
    image: stockImg,
    highlight: "Anticipez les ruptures grâce aux alertes de réapprovisionnement.",
  },
  {
    icon: HeadphonesIcon,
    title: "Support & Tickets",
    description: "Système de tickets intégré pour gérer les demandes de vos clients avec priorités et suivi.",
    image: supportImg,
    highlight: "Vos clients soumettent leurs demandes, vous les traitez efficacement.",
  },
  {
    icon: BarChart3,
    title: "Analyse & Reporting",
    description: "Tableaux de bord analytiques avec indicateurs personnalisables et export des données.",
    image: analyseImg,
    highlight: "Prenez des décisions éclairées grâce aux données en temps réel.",
  },
];

export default function DemoTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  const next = useCallback(() => {
    if (currentStep < tourSteps.length - 1) setCurrentStep(s => s + 1);
  }, [currentStep]);

  const prev = useCallback(() => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  }, [currentStep]);

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div
          className="max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-20 h-20 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mx-auto mb-8">
            <Play className="h-8 w-8 text-[#22c55e] ml-1" />
          </div>
          <h1 className="text-4xl md:text-5xl font-light mb-6 tracking-tight text-gray-900">
            Découvrez <span className="font-medium text-gradient-neon">MBA</span> en action
          </h1>
          <p className="text-lg text-gray-600 font-light mb-10 max-w-lg mx-auto">
            Parcourez les 8 modules principaux de MBA avec une visite guidée interactive. Aucune inscription requise.
          </p>
          <motion.button
            onClick={() => setIsStarted(true)}
            className="group relative inline-flex items-center gap-3 px-10 py-5 text-sm font-medium tracking-wide uppercase overflow-hidden"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="absolute inset-0 bg-[#22c55e] rounded-full" />
            <span className="absolute inset-0 bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative text-white">
              Commencer la visite
            </span>
            <ChevronRight className="relative h-4 w-4 text-white group-hover:translate-x-1 transition-all duration-300" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logoMba} alt="MBA" className="h-8 w-auto" />
            <span className="text-sm font-medium text-gray-500">
              Visite guidée MBA
            </span>
            <span className="text-xs text-gray-400">
              {currentStep + 1} / {tourSteps.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="hidden sm:block flex-1 max-w-xs mx-8">
            <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="h-4 w-4" />
            Quitter
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 container mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Info panel */}
        <div className="w-full lg:w-[380px] lg:flex-shrink-0">
          {/* Step navigation dots */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {tourSteps.map((s, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  i === currentStep
                    ? "bg-[#22c55e]/10 border border-[#22c55e]/40 text-[#22c55e]"
                    : i < currentStep
                    ? "bg-gray-100 border border-gray-200 text-gray-900"
                    : "bg-gray-50 border border-gray-200 text-gray-400"
                }`}
              >
                <s.icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-14 h-14 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mb-6">
                <step.icon className="h-6 w-6 text-[#22c55e]" />
              </div>

              <h2 className="text-2xl font-light mb-4 text-gray-900">{step.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{step.description}</p>

              {/* Highlight callout */}
              <div className="p-4 rounded-xl bg-[#22c55e]/5 border border-[#22c55e]/10">
                <p className="text-sm text-[#16a34a] font-medium leading-relaxed">
                  💡 {step.highlight}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex items-center gap-4 mt-10">
            <button
              onClick={prev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </button>

            {currentStep < tourSteps.length - 1 ? (
              <button
                onClick={next}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#22c55e] text-white text-sm font-medium hover:bg-[#16a34a] transition-all"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <Link
                to="/contact?subject=Demande%20de%20d%C3%A9mo"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white text-sm font-medium hover:opacity-90 transition-all"
              >
                Demander une démo
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Right: Screenshot */}
        <div className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl">
                {/* Fake browser chrome */}
                <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white rounded-lg px-4 py-1.5 text-xs text-gray-400 max-w-sm border border-gray-200">
                      app.mybusinessassistant.com/admin/{step.title.toLowerCase().replace(/[& ]/g, '-')}
                    </div>
                  </div>
                </div>

                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full object-cover"
                  style={{ maxHeight: "calc(100vh - 250px)" }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
