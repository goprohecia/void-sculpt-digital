import { useState } from "react";
import { motion } from "framer-motion";
import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Badge } from "@/components/ui/badge";
import { Wrench, Car } from "lucide-react";
import { MOCK_VEHICULES, GARAGE_STEPS, type MockVehicule } from "@/data/mockGarageData";
import { GarageVehicleStepper } from "./GarageVehicleStepper";
import { toast } from "sonner";

const CURRENT_MECHANIC_ID = "mec-1";

export function GarageMechanicView() {
  const [vehicules, setVehicules] = useState<MockVehicule[]>(MOCK_VEHICULES);
  const myVehicules = vehicules.filter((v) => v.mecanicienId === CURRENT_MECHANIC_ID && v.etape < 6);

  const handleAdvance = (id: string) => {
    setVehicules((prev) =>
      prev.map((v) => {
        if (v.id !== id || v.etape >= 6) return v;
        const newDates = [...v.stepDates];
        newDates[v.etape + 1] = new Date().toISOString().split("T")[0];
        return { ...v, etape: v.etape + 1, stepDates: newDates };
      })
    );
    const veh = vehicules.find((v) => v.id === id);
    if (veh) {
      toast.success(`${veh.immatriculation} → ${GARAGE_STEPS[Math.min(veh.etape + 1, 6)]}`);
    }
  };

  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Wrench className="h-6 w-6 text-primary" />
              Mes véhicules
            </h1>
            <p className="text-muted-foreground text-sm">
              {myVehicules.length} véhicule{myVehicules.length > 1 ? "s" : ""} assigné{myVehicules.length > 1 ? "s" : ""}
            </p>
          </motion.div>

          {myVehicules.length === 0 ? (
            <motion.div variants={staggerItem} className="glass-card p-8 text-center text-muted-foreground">
              Aucun véhicule assigné pour le moment.
            </motion.div>
          ) : (
            <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-4" variants={staggerContainer} initial="initial" animate="animate">
              {myVehicules.map((v) => (
                <motion.div key={v.id} variants={staggerItem} className="glass-card p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-primary" />
                      <span className="font-mono text-sm font-semibold">{v.immatriculation}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {v.marque} {v.modele}
                    </Badge>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium">{v.clientNom}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{v.motifEntree}</p>
                    <p className="text-xs text-muted-foreground">{v.kilometrage.toLocaleString()} km</p>
                  </div>

                  {v.notes && (
                    <div className="text-xs bg-muted/20 rounded-lg p-2 border border-border/30">
                      <span className="font-medium text-foreground">Notes réceptionniste :</span> {v.notes}
                    </div>
                  )}

                  <GarageVehicleStepper
                    currentStep={v.etape}
                    stepDates={v.stepDates}
                    isEditable
                    onAdvance={() => handleAdvance(v.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
