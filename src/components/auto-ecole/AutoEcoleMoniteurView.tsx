import { useState } from "react";
import { motion } from "framer-motion";
import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  MOCK_ELEVES, MOCK_LECONS, MOCK_MONITEURS, AUTO_ECOLE_STEPS,
} from "@/data/mockAutoEcoleData";
import {
  Car, CalendarDays, User, Clock, FileText, Star, PenLine,
} from "lucide-react";

const CURRENT_MONITEUR_ID = "mon-1";

export function AutoEcoleMoniteurView() {
  const moniteur = MOCK_MONITEURS.find((m) => m.id === CURRENT_MONITEUR_ID)!;
  const today = "2026-03-10";
  const leconsJour = MOCK_LECONS.filter((l) => l.moniteurId === CURRENT_MONITEUR_ID && l.date === today);
  const [selectedEleve, setSelectedEleve] = useState<string | null>(null);
  const [saisie, setSaisie] = useState({ duree: "60", axe: "", commentaire: "" });

  const ficheEleve = selectedEleve ? MOCK_ELEVES.find((e) => e.id === selectedEleve) : null;

  const handleSaisie = () => {
    toast.success("Leçon enregistrée (simulé)");
    setSaisie({ duree: "60", axe: "", commentaire: "" });
  };

  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Car className="h-6 w-6 text-primary" />
              Espace Moniteur — {moniteur.prenom} {moniteur.nom}
            </h1>
            <p className="text-muted-foreground text-sm">Véhicule : {moniteur.vehicule}</p>
          </motion.div>

          {/* Planning du jour */}
          <motion.div variants={staggerItem}>
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Planning du jour — {today}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {leconsJour.length > 0 ? leconsJour.map((l) => (
                  <div
                    key={l.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedEleve === l.eleveId ? "border border-primary bg-primary/5" : "bg-muted/20 hover:bg-muted/30"}`}
                    onClick={() => setSelectedEleve(selectedEleve === l.eleveId ? null : l.eleveId)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{l.eleveNom}</p>
                        <p className="text-xs text-muted-foreground">{l.axeTravaille || "Leçon de conduite"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{l.heure}</p>
                      <Badge variant="secondary" className="text-[10px]">{l.duree} min</Badge>
                      <Badge variant={l.type === "examen_blanc" ? "default" : "outline"} className="text-[10px] ml-1">
                        {l.type === "conduite" ? "Conduite" : l.type === "examen_blanc" ? "Exam blanc" : l.type}
                      </Badge>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucune leçon aujourd'hui</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Fiche élève */}
          {ficheEleve && (
            <motion.div variants={staggerItem}>
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Fiche élève — {ficheEleve.prenom} {ficheEleve.nom}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Compteur d'heures</p>
                      <p className="text-lg font-bold">{ficheEleve.heuresEffectuees} / {ficheEleve.heuresForfait}h</p>
                      <Progress value={(ficheEleve.heuresEffectuees / ficheEleve.heuresForfait) * 100} className="h-2 mt-1" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Étape actuelle</p>
                      <Badge variant="secondary" className="mt-1">{AUTO_ECOLE_STEPS[ficheEleve.etape - 1]}</Badge>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-3 w-3 text-amber-400" />
                        <span className="text-xs capitalize">{ficheEleve.progression}</span>
                      </div>
                    </div>
                  </div>
                  {ficheEleve.notesConduite && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Notes de conduite</p>
                      <p className="text-sm bg-muted/30 p-3 rounded-lg">{ficheEleve.notesConduite}</p>
                    </div>
                  )}

                  {/* Saisie heures */}
                  <div className="pt-3 border-t border-border/20 space-y-3">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <PenLine className="h-4 w-4 text-primary" />
                      Saisir une leçon
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground">Durée (min)</label>
                        <Input type="number" value={saisie.duree} onChange={(e) => setSaisie({ ...saisie, duree: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Axe travaillé</label>
                        <Input value={saisie.axe} onChange={(e) => setSaisie({ ...saisie, axe: e.target.value })} placeholder="Ex: Créneaux" className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Commentaire</label>
                      <Textarea value={saisie.commentaire} onChange={(e) => setSaisie({ ...saisie, commentaire: e.target.value })} placeholder="Observations..." className="mt-1" rows={2} />
                    </div>
                    <Button size="sm" onClick={handleSaisie} className="w-full">
                      Enregistrer la leçon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
