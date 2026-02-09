import { useState } from "react";
import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CalendlyBookingDialog } from "@/components/admin/CalendlyBookingDialog";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus, Clock, Video } from "lucide-react";
import { getRendezVousByClient, DEMO_CLIENT_ID } from "@/data/mockData";
import { format, parseISO, isPast } from "date-fns";
import { fr } from "date-fns/locale";

export default function ClientRendezVous() {
  const [showCalendly, setShowCalendly] = useState(false);
  const mesRdv = getRendezVousByClient(DEMO_CLIENT_ID);
  const rdvAVenir = mesRdv.filter((r) => r.statut === "a_venir");
  const rdvPasses = mesRdv.filter((r) => r.statut === "passe" || r.statut === "annule");

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Rendez-vous</h1>
              <p className="text-muted-foreground text-sm">Planifiez et consultez vos rendez-vous</p>
            </div>
            <Button onClick={() => setShowCalendly(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nouveau rendez-vous
            </Button>
          </motion.div>

          {/* À venir */}
          <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              À venir ({rdvAVenir.length})
            </h3>
            <div className="space-y-3">
              {rdvAVenir.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Aucun rendez-vous à venir</p>
              ) : (
                rdvAVenir.map((rdv) => (
                  <div key={rdv.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Video className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{rdv.sujet}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarDays className="h-3 w-3" />
                          <span>{format(parseISO(rdv.date), "EEEE d MMMM yyyy", { locale: fr })}</span>
                          <Clock className="h-3 w-3 ml-1" />
                          <span>{rdv.heure}</span>
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={rdv.statut} />
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Passés */}
          <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Historique ({rdvPasses.length})
            </h3>
            <div className="space-y-3">
              {rdvPasses.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Aucun rendez-vous passé</p>
              ) : (
                rdvPasses.map((rdv) => (
                  <div key={rdv.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 opacity-70">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{rdv.sujet}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(rdv.date), "d MMM yyyy", { locale: fr })} à {rdv.heure}
                      </p>
                    </div>
                    <StatusBadge status={rdv.statut} />
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      </AdminPageTransition>

      <CalendlyBookingDialog open={showCalendly} onOpenChange={setShowCalendly} />
    </ClientLayout>
  );
}
