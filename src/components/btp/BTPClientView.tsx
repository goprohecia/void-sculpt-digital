import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { SectorStepper } from "@/components/admin/SectorStepper";
import { MOCK_CHANTIERS, BTP_STEP_MESSAGES, MOCK_DOCUMENTS_CLIENT } from "@/data/mockBTPData";
import { HardHat, FileText, PenLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Simulate the logged-in client viewing chantier ch-1
const CURRENT_CHANTIER = MOCK_CHANTIERS[0];

export function BTPClientView() {
  const ch = CURRENT_CHANTIER;
  const [signed, setSigned] = useState(false);

  const handleSign = () => {
    setSigned(true);
    toast.success("Validation signée ! Merci pour votre confiance.");
  };

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <HardHat className="h-6 w-6 text-primary" />
          Suivi de mon chantier
        </h1>
        <p className="text-muted-foreground text-sm">{ch.description}</p>
      </motion.div>

      {/* Step message */}
      <motion.div variants={staggerItem} className="glass-card p-5 border-primary/20">
        <p className="text-sm">{BTP_STEP_MESSAGES[ch.etape]}</p>
      </motion.div>

      {/* Stepper with progress */}
      <motion.div variants={staggerItem} className="glass-card p-5">
        <h3 className="text-sm font-semibold mb-4">Avancement</h3>
        <SectorStepper
          currentStep={ch.etape}
          stepDates={ch.stepDates}
          avancement={ch.avancement}
        />
      </motion.div>

      {/* Infos */}
      <motion.div variants={staggerItem} className="glass-card p-5">
        <h3 className="text-sm font-semibold mb-3">Mon chantier</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Adresse</p>
            <p className="font-medium">{ch.adresse}, {ch.ville}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Montant TTC</p>
            <p className="font-medium">{ch.montantTTC.toLocaleString()} €</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Date de début</p>
            <p className="font-medium">{new Date(ch.dateDebut).toLocaleDateString("fr-FR")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Responsable chantier</p>
            <p className="font-medium">{ch.ouvrierNom}</p>
          </div>
        </div>
      </motion.div>

      {/* Documents */}
      <motion.div variants={staggerItem} className="glass-card p-5">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-primary" />
          Mes documents
        </h3>
        <div className="space-y-2">
          {MOCK_DOCUMENTS_CLIENT.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/10">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{doc.nom}</span>
              </div>
              {doc.statut === "disponible" ? (
                <Badge variant="secondary" className="text-[10px] bg-emerald-500/15 text-emerald-400">Disponible</Badge>
              ) : (
                <Badge variant="outline" className="text-[10px]">En attente</Badge>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Signature finale */}
      {ch.etape >= 4 && (
        <motion.div variants={staggerItem} className="glass-card p-5">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
            <PenLine className="h-4 w-4 text-primary" />
            Validation finale
          </h3>
          {signed ? (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary">
              ✓ Réception signée le {new Date().toLocaleDateString("fr-FR")}. Merci !
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                En signant, vous confirmez la bonne réception des travaux et la conformité avec le devis accepté.
              </p>
              <Button onClick={handleSign} className="gap-1.5">
                <PenLine className="h-3.5 w-3.5" />
                Signer la réception
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
