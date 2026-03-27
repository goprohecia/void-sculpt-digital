import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectorStepper } from "@/components/admin/SectorStepper";
import {
  MOCK_COIFFURE_RDV,
  MOCK_COIFFURE_FICHES,
  COIFFURE_STEPS,
  type CoiffureRDV,
} from "@/data/mockCoiffureData";
import { Scissors, Clock, User, CreditCard, FileText } from "lucide-react";
import { toast } from "sonner";

// Simulate the logged-in praticien as coif-1
const CURRENT_PRATICIEN_ID = "coif-1";

export function CoiffurePraticienView() {
  const [rdvs, setRdvs] = useState<CoiffureRDV[]>(
    MOCK_COIFFURE_RDV.filter((r) => r.praticienId === CURRENT_PRATICIEN_ID && r.date === "2026-03-10")
      .sort((a, b) => a.heure.localeCompare(b.heure))
  );
  const [selectedFiche, setSelectedFiche] = useState<string | null>(null);

  const advanceRdv = (id: string) => {
    setRdvs((prev) => prev.map((r) => r.id === id ? { ...r, etape: Math.min(r.etape + 1, 5) } : r));
    toast.success("Étape avancée");
  };

  const fiche = selectedFiche ? MOCK_COIFFURE_FICHES.find((f) => f.clientId === selectedFiche) : null;

  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Scissors className="h-6 w-6 text-primary" /> Mon planning du jour
            </h1>
            <p className="text-muted-foreground text-sm">
              {rdvs.length} rendez-vous — Marie Duval
            </p>
          </motion.div>

          {rdvs.map((rdv) => (
            <motion.div key={rdv.id} variants={staggerItem}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-4 w-4" /> {rdv.heure}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{rdv.duree} min</Badge>
                      <Badge variant="outline" className="text-xs">{rdv.prix} €</Badge>
                      {rdv.acomptePaye && (
                        <Badge variant="secondary" className="text-[10px] gap-1">
                          <CreditCard className="h-2.5 w-2.5" /> Acompte {rdv.montantAcompte}€
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" /> {rdv.clientNom}
                      </p>
                      <p className="text-xs text-muted-foreground">{rdv.prestationNom}</p>
                    </div>
                    <Button
                      size="sm" variant="ghost"
                      onClick={() => setSelectedFiche(selectedFiche === rdv.clientId ? null : rdv.clientId)}
                    >
                      <FileText className="h-3 w-3 mr-1" /> Fiche client
                    </Button>
                  </div>

                  {rdv.notes && (
                    <p className="text-xs text-muted-foreground italic">📝 {rdv.notes}</p>
                  )}

                  <SectorStepper
                    currentStep={rdv.etape}
                    isEditable
                    onAdvance={() => advanceRdv(rdv.id)}
                  />

                  {/* Fiche client inline */}
                  {selectedFiche === rdv.clientId && fiche && (
                    <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/30 space-y-2">
                      <p className="text-xs font-semibold">Fiche client — {fiche.clientNom}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-muted-foreground">Couleur habituelle :</span> {fiche.couleurHabituelle}</div>
                        <div><span className="text-muted-foreground">Type cheveux :</span> {fiche.typeCheveux}</div>
                        <div><span className="text-muted-foreground">Allergies :</span> {fiche.allergies}</div>
                        <div><span className="text-muted-foreground">Dernière visite :</span> {fiche.derniereVisite}</div>
                      </div>
                      <p className="text-xs text-muted-foreground">{fiche.notes}</p>
                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold text-muted-foreground">Historique :</p>
                        {fiche.historique.map((h, i) => (
                          <div key={i} className="text-[10px] flex items-center gap-2">
                            <span className="text-muted-foreground">{h.date}</span>
                            <span>{h.prestation}</span>
                            <span className="text-muted-foreground">({h.praticien})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
