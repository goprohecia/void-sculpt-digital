import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AutoEcoleStepper } from "./AutoEcoleStepper";
import {
  MOCK_ELEVES, MOCK_LECONS, MOCK_MONITEURS, AUTO_ECOLE_STEPS,
} from "@/data/mockAutoEcoleData";
import {
  Car, Clock, CalendarDays, FileText, Euro, GraduationCap,
  CheckCircle2, AlertCircle,
} from "lucide-react";

const CURRENT_ELEVE_ID = "elv-1";

export function AutoEcoleEleveView() {
  const eleve = MOCK_ELEVES.find((e) => e.id === CURRENT_ELEVE_ID)!;
  const moniteur = MOCK_MONITEURS.find((m) => m.id === eleve.moniteurId);
  const prochainsCours = MOCK_LECONS.filter((l) => l.eleveId === CURRENT_ELEVE_ID && l.statut === "planifie").slice(0, 3);
  const heuresPct = Math.round((eleve.heuresEffectuees / eleve.heuresForfait) * 100);

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              Espace Élève
            </h1>
            <p className="text-muted-foreground text-sm">Bonjour {eleve.prenom}, voici votre progression</p>
          </motion.div>

          {/* Compteur d'heures GRAND FORMAT */}
          <motion.div variants={staggerItem}>
            <Card className="glass-card">
              <CardContent className="p-6 text-center space-y-3">
                <Car className="h-8 w-8 mx-auto text-primary" />
                <p className="text-4xl font-bold">
                  {eleve.heuresEffectuees} <span className="text-lg text-muted-foreground font-normal">/ {eleve.heuresForfait} heures</span>
                </p>
                <Progress value={heuresPct} className="h-3 max-w-md mx-auto" />
                <p className="text-sm text-muted-foreground">{heuresPct}% de votre forfait effectué</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stepper */}
          <motion.div variants={staggerItem}>
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Avancement de votre formation</CardTitle>
              </CardHeader>
              <CardContent>
                <AutoEcoleStepper currentStep={eleve.etape - 1} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Prochains RDV */}
          <motion.div variants={staggerItem}>
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Prochains rendez-vous
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {prochainsCours.length > 0 ? prochainsCours.map((l) => (
                  <div key={l.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div>
                      <p className="text-sm font-medium">{l.axeTravaille || "Leçon de conduite"}</p>
                      <p className="text-xs text-muted-foreground">Moniteur : {moniteur?.prenom} {moniteur?.nom}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{l.date}</p>
                      <p className="text-xs text-muted-foreground">{l.heure} · {l.duree} min</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucun RDV à venir</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Dossier NEPH & Examen */}
          <motion.div variants={staggerItem}>
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Dossier & Examens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <span className="text-sm">Numéro NEPH</span>
                  <div className="flex items-center gap-2">
                    {eleve.nephStatut === "valide" ? (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Validé — {eleve.nephDate}
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] gap-1">
                        <AlertCircle className="h-3 w-3" /> En attente
                      </Badge>
                    )}
                  </div>
                </div>
                {eleve.dateExamenCode && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <span className="text-sm">Examen code</span>
                    <span className="text-sm font-medium">{eleve.dateExamenCode}</span>
                  </div>
                )}
                {eleve.dateExamenConduite && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <span className="text-sm">Examen conduite</span>
                    <span className="text-sm font-medium">{eleve.dateExamenConduite}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Facturation */}
          <motion.div variants={staggerItem}>
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Euro className="h-4 w-4 text-primary" />
                  Facturation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <span className="text-sm">Forfait souscrit</span>
                  <span className="text-sm font-medium">{eleve.forfait} — {eleve.forfaitMontant.toLocaleString()} €</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <span className="text-sm">Acompte payé</span>
                  <span className="text-sm font-medium text-emerald-400">{eleve.acomptePaye.toLocaleString()} €</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <span className="text-sm font-medium">Reste dû</span>
                  <span className={`text-sm font-bold ${eleve.resteDu > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                    {eleve.resteDu.toLocaleString()} €
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </ClientLayout>
  );
}
