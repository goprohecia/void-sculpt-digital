import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { SectorStepper } from "@/components/admin/SectorStepper";
import { MOCK_BIENS, IMMO_STEP_MESSAGES_PROPRIETAIRE, MOCK_DOCUMENTS_PROPRIETAIRE } from "@/data/mockImmobilierData";
import { Building2, FileText, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const CURRENT_BIEN = MOCK_BIENS[0];

export function ImmobilierProprietaireView() {
  const bien = CURRENT_BIEN;

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          Suivi de mon bien
        </h1>
        <p className="text-muted-foreground text-sm">{bien.adresse}, {bien.ville}</p>
      </motion.div>

      <motion.div variants={staggerItem} className="glass-card p-5 border-primary/20">
        <p className="text-sm">{IMMO_STEP_MESSAGES_PROPRIETAIRE[bien.etape]}</p>
      </motion.div>

      <motion.div variants={staggerItem} className="glass-card p-5">
        <h3 className="text-sm font-semibold mb-4">Avancement</h3>
        <SectorStepper currentStep={bien.etape} stepDates={bien.stepDates} subLabel={bien.agentNom} />
      </motion.div>

      <motion.div variants={staggerItem} className="glass-card p-5">
        <h3 className="text-sm font-semibold mb-3">Mes informations</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Bien</p>
            <p className="font-medium">{bien.adresse}, {bien.ville}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Prix</p>
            <p className="font-medium">{bien.prix.toLocaleString()} €</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Date du mandat</p>
            <p className="font-medium">{new Date(bien.dateMandat).toLocaleDateString("fr-FR")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Agent en charge</p>
            <p className="font-medium">{bien.agentNom}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Visites effectuées</p>
            <p className="font-medium">{bien.nbVisites}</p>
          </div>
          {bien.dernierRetour && (
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground">Dernier retour</p>
              <p className="font-medium">{bien.dernierRetour}</p>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div variants={staggerItem} className="glass-card p-5">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-primary" />
          Mes documents
        </h3>
        <div className="space-y-2">
          {MOCK_DOCUMENTS_PROPRIETAIRE.map((doc) => (
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

      <motion.div variants={staggerItem}>
        <Link to="/client/messagerie" className="glass-card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors">
          <MessageSquare className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Contacter mon agent</p>
            <p className="text-xs text-muted-foreground">Échanger avec {bien.agentNom}</p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
