import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Car, User, CalendarDays, Wrench, Bell } from "lucide-react";
import { MOCK_VEHICULES, GARAGE_CLIENT_MESSAGES } from "@/data/mockGarageData";
import { SectorStepper } from "@/components/admin/SectorStepper";
import { toast } from "sonner";

export function GarageClientView() {
  // Simulate logged-in client sees their vehicle (pick one "in progress")
  const vehicule = MOCK_VEHICULES.find((v) => v.etape === 5) || MOCK_VEHICULES.find((v) => v.etape >= 1 && v.etape < 6) || MOCK_VEHICULES[0];
  const [hasNotified, setHasNotified] = useState(false);

  useEffect(() => {
    if (vehicule.etape === 5 && !hasNotified) {
      setHasNotified(true);
      toast.success("🚗 Votre véhicule est prêt à récupérer !", { duration: 6000 });
    }
  }, [vehicule.etape, hasNotified]);

  const message = GARAGE_CLIENT_MESSAGES[vehicule.etape] || "";

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Car className="h-6 w-6 text-primary" />
              Suivi de mon véhicule
            </h1>
          </motion.div>

          {/* Info card */}
          <motion.div variants={staggerItem} className="glass-card p-5 space-y-3">
            <h3 className="text-sm font-semibold mb-3">Mes informations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">Véhicule</p>
                  <p className="font-medium">{vehicule.marque} {vehicule.modele} — {vehicule.immatriculation}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">Date de dépôt</p>
                  <p className="font-medium">{new Date(vehicule.dateDepot).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">Mécanicien en charge</p>
                  <p className="font-medium">{vehicule.mecanicienNom}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Status message */}
          {vehicule.etape === 5 && (
            <motion.div variants={staggerItem} className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-3">
              <Bell className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-medium text-emerald-300 text-sm">Votre véhicule est prêt à récupérer</p>
                <p className="text-xs text-muted-foreground mt-0.5">Contactez-nous pour convenir d'un créneau de restitution.</p>
              </div>
            </motion.div>
          )}

          {/* Message */}
          <motion.div variants={staggerItem} className="glass-card p-5">
            <p className="text-sm text-muted-foreground">{message}</p>
          </motion.div>

          {/* Stepper */}
          <motion.div variants={staggerItem} className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-4">Avancement</h3>
            <SectorStepper
              currentStep={vehicule.etape}
              stepDates={vehicule.stepDates}
              notes={vehicule.notes}
            />
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </ClientLayout>
  );
}
