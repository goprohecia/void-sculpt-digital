import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { ImmobilierMandatStepper } from "./ImmobilierMandatStepper";
import { MOCK_BIENS, IMMO_STEP_MESSAGES_ACHETEUR, ACHETEUR_CHECKLIST } from "@/data/mockImmobilierData";
import { Building2, FileCheck, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const CURRENT_BIEN = MOCK_BIENS[0];

export function ImmobilierAcheteurView() {
  const bien = CURRENT_BIEN;
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (bien.etape >= 3) {
      toast.info("Votre offre a été transmise au propriétaire !", { duration: 5000 });
    }
  }, []);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalRequired = ACHETEUR_CHECKLIST.filter((c) => c.required).length;
  const completedRequired = ACHETEUR_CHECKLIST.filter((c) => c.required && checkedItems[c.id]).length;

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          Ma candidature
        </h1>
        <p className="text-muted-foreground text-sm">{bien.adresse}, {bien.ville}</p>
      </motion.div>

      <motion.div variants={staggerItem} className="glass-card p-5 border-primary/20">
        <p className="text-sm">{IMMO_STEP_MESSAGES_ACHETEUR[bien.etape]}</p>
      </motion.div>

      <motion.div variants={staggerItem} className="glass-card p-5">
        <h3 className="text-sm font-semibold mb-4">Statut du bien</h3>
        <ImmobilierMandatStepper currentStep={bien.etape} stepDates={bien.stepDates} agentNom={bien.agentNom} />
      </motion.div>

      <motion.div variants={staggerItem} className="glass-card p-5">
        <h3 className="text-sm font-semibold mb-3">Le bien</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Adresse</p>
            <p className="font-medium">{bien.adresse}, {bien.ville}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Prix</p>
            <p className="font-medium">{bien.prix.toLocaleString()} €</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Surface</p>
            <p className="font-medium">{bien.surface} m²</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pièces</p>
            <p className="font-medium">{bien.pieces}</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={staggerItem} className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" />
            Dossier de candidature
          </h3>
          <Badge variant="secondary" className="text-[10px]">
            {completedRequired}/{totalRequired} requis
          </Badge>
        </div>
        <div className="space-y-3">
          {ACHETEUR_CHECKLIST.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <Checkbox id={item.id} checked={!!checkedItems[item.id]} onCheckedChange={() => toggleItem(item.id)} />
              <label htmlFor={item.id} className="text-sm cursor-pointer flex items-center gap-2">
                {item.label}
                {item.required && <span className="text-[10px] text-muted-foreground">*obligatoire</span>}
              </label>
            </div>
          ))}
        </div>
        {completedRequired === totalRequired && (
          <div className="mt-3 p-2 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Tous les documents obligatoires sont fournis !
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
