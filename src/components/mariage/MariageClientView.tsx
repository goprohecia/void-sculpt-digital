import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectorStepper } from "@/components/admin/SectorStepper";
import {
  MOCK_DOSSIERS_MARIEE, MOCK_ESSAYAGES, MOCK_CONSEILLERES,
  MARIAGE_STEPS, MARIAGE_STEP_MESSAGES,
} from "@/data/mockMariageData";
import {
  Heart, CalendarDays, Euro, MessageSquare, AlertTriangle,
} from "lucide-react";

const CURRENT_MARIEE_ID = "dm-1";

export function MariageClientView() {
  const dossier = MOCK_DOSSIERS_MARIEE.find(d => d.id === CURRENT_MARIEE_ID)!;
  const conseillere = MOCK_CONSEILLERES.find(c => c.id === dossier.conseillereId);
  const essayages = MOCK_ESSAYAGES.filter(e => e.dossierId === CURRENT_MARIEE_ID);
  const stepMessage = MARIAGE_STEP_MESSAGES[dossier.etape] || "";

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              Espace Mariée
            </h1>
            <p className="text-muted-foreground text-sm">Bienvenue {dossier.marieePrenom}, suivez votre robe de rêve</p>
          </motion.div>

          {/* Stepper visuel */}
          <motion.div variants={staggerItem}>
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Suivi de votre commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SectorStepper currentStep={dossier.etape - 1} />

                {/* Message personnalisé */}
                {stepMessage && (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Message de votre conseillère</span>
                    </div>
                    <p className="text-sm">{stepMessage}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Info robe */}
          <motion.div variants={staggerItem}>
            <Card className="glass-card">
              <CardContent className="p-4 space-y-2">
                <p className="text-sm font-medium">{dossier.modeleChoisi}</p>
                <p className="text-xs text-muted-foreground">Taille {dossier.taille} · Mariage le {dossier.dateMariage}</p>
                <p className="text-xs text-muted-foreground">Conseillère : {conseillere?.prenom} {conseillere?.nom}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Prochains RDV */}
          <motion.div variants={staggerItem}>
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Prochains rendez-vous essayage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {essayages.length > 0 ? essayages.map((e) => (
                  <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div>
                      <Badge variant={e.type === "final" ? "default" : "secondary"} className="text-[10px] capitalize">
                        {e.type === "decouverte" ? "Découverte" : e.type === "recuperation" ? "Récupération" : e.type}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{e.date}</p>
                      <p className="text-xs text-muted-foreground">{e.heure}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucun rendez-vous à venir</p>
                )}
                <p className="text-[10px] text-muted-foreground italic mt-2">
                  📱 Un rappel vous sera envoyé 24h avant chaque essayage
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Paiements */}
          <motion.div variants={staggerItem}>
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Euro className="h-4 w-4 text-primary" />
                  Paiements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <span className="text-sm">Prix total</span>
                  <span className="text-sm font-medium">{dossier.prixTotal.toLocaleString()} €</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <span className="text-sm">Acompte versé</span>
                  <span className="text-sm font-medium text-emerald-400">{dossier.acompteVerse.toLocaleString()} €</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <span className="text-sm font-medium">Reste à payer</span>
                  <span className={`text-sm font-bold ${dossier.resteDu > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                    {dossier.resteDu.toLocaleString()} €
                  </span>
                </div>
                {dossier.resteDu > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Date limite de paiement : {dossier.dateLimitePaiement}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </ClientLayout>
  );
}
