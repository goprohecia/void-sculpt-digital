import { useState } from "react";
import { motion } from "framer-motion";
import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { MOCK_BIENS, IMMO_STEPS, MOCK_VISITES_RDV } from "@/data/mockImmobilierData";
import { ImmobilierMandatStepper } from "./ImmobilierMandatStepper";
import { Building2, Filter, CalendarDays, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CURRENT_AGENT_ID = "agent-1";

export function ImmobilierAgentView() {
  const [biens, setBiens] = useState(MOCK_BIENS.filter((b) => b.agentId === CURRENT_AGENT_ID));
  const [filterType, setFilterType] = useState<"tous" | "vente" | "location">("tous");
  const [selectedBien, setSelectedBien] = useState<string | null>(null);

  const filtered = filterType === "tous" ? biens : biens.filter((b) => b.type === filterType);
  const todayVisites = MOCK_VISITES_RDV.filter((v) => v.date === "2026-03-10");

  const handleAdvance = (id: string) => {
    setBiens((prev) =>
      prev.map((b) => {
        if (b.id !== id || b.etape >= IMMO_STEPS.length - 1) return b;
        const newDates = [...b.stepDates];
        newDates[b.etape + 1] = new Date().toISOString().split("T")[0];
        return { ...b, etape: b.etape + 1, stepDates: newDates };
      })
    );
    toast.success("Étape avancée avec succès");
  };

  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              Mes mandats
            </h1>
            <p className="text-muted-foreground text-sm">{biens.length} mandat{biens.length > 1 ? "s" : ""} assigné{biens.length > 1 ? "s" : ""}</p>
          </motion.div>

          {/* Filters */}
          <motion.div variants={staggerItem} className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {(["tous", "vente", "location"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterType === t ? "bg-primary text-primary-foreground" : "glass-button"}`}
              >
                {t === "tous" ? "Tous" : t === "vente" ? "Vente" : "Location"}
              </button>
            ))}
          </motion.div>

          {/* Visites du jour */}
          {todayVisites.length > 0 && (
            <motion.div variants={staggerItem} className="glass-card p-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                <CalendarDays className="h-4 w-4 text-primary" />
                Mes visites du jour
              </h3>
              <div className="space-y-2">
                {todayVisites.map((v, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-xs font-mono text-muted-foreground w-12">{v.heure}</span>
                    <div>
                      <span className="font-medium">{v.clientNom}</span>
                      <span className="text-xs text-muted-foreground ml-2">{v.adresse}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Biens cards */}
          <motion.div className="space-y-3" variants={staggerContainer} initial="initial" animate="animate">
            {filtered.map((bien) => (
              <motion.div key={bien.id} variants={staggerItem} className="glass-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{bien.adresse}</p>
                    <p className="text-xs text-muted-foreground">{bien.ville} · {bien.surface} m² · {bien.pieces} pièces</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      {bien.type === "location" ? `${bien.prix.toLocaleString()} €/mois` : `${bien.prix.toLocaleString()} €`}
                    </p>
                    <Badge variant="outline" className="text-[10px]">{bien.type === "vente" ? "Vente" : "Location"}</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Propriétaire : {bien.proprietaireNom}</span>
                  <span>{bien.nbVisites} visite{bien.nbVisites > 1 ? "s" : ""}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Étape : <span className="text-foreground font-medium">{IMMO_STEPS[bien.etape]}</span></span>
                  <button
                    onClick={() => setSelectedBien(selectedBien === bien.id ? null : bien.id)}
                    className="text-primary hover:underline text-xs"
                  >
                    {selectedBien === bien.id ? "Masquer" : "Détails"}
                  </button>
                </div>

                {selectedBien === bien.id && (
                  <div className="pt-2 border-t border-border/30">
                    <ImmobilierMandatStepper
                      currentStep={bien.etape}
                      stepDates={bien.stepDates}
                      agentNom={bien.agentNom}
                      isEditable
                      onAdvance={() => handleAdvance(bien.id)}
                    />
                    {bien.dernierRetour && (
                      <p className="text-xs text-muted-foreground mt-3 bg-muted/20 rounded-lg p-2 border border-border/30">
                        <span className="font-medium text-foreground">Dernier retour :</span> {bien.dernierRetour}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
