import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CalendlyBookingDialog } from "@/components/admin/CalendlyBookingDialog";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus, Clock, Video, Loader2, AlertCircle, ExternalLink, User } from "lucide-react";
import { useCalendlyEvents, CalendlyEvent } from "@/hooks/use-calendly-events";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export default function ClientRendezVous() {
  const [showCalendly, setShowCalendly] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState<CalendlyEvent | null>(null);

  const minDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return d.toISOString();
  }, []);

  const maxDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString();
  }, []);

  const { data: events = [], isLoading, error } = useCalendlyEvents(minDate, maxDate);

  const rdvAVenir = events
    .filter((r) => r.statut === "a_venir")
    .sort((a, b) => a.date.localeCompare(b.date));

  const rdvPasses = events
    .filter((r) => r.statut === "passe" || r.statut === "annule")
    .sort((a, b) => b.date.localeCompare(a.date));

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

          {error && (
            <motion.div variants={staggerItem} className="glass-card p-4 border-destructive/30 flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">Impossible de charger les rendez-vous.</p>
            </motion.div>
          )}

          {isLoading && (
            <motion.div variants={staggerItem} className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Chargement des rendez-vous…</span>
            </motion.div>
          )}

          {/* À venir */}
          <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              À venir ({rdvAVenir.length})
            </h3>
            <div className="space-y-3">
              {rdvAVenir.length === 0 && !isLoading ? (
                <p className="text-sm text-muted-foreground text-center py-6">Aucun rendez-vous à venir</p>
              ) : (
                rdvAVenir.map((rdv) => (
                  <div key={rdv.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedRdv(rdv)}>
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
              {rdvPasses.length === 0 && !isLoading ? (
                <p className="text-sm text-muted-foreground text-center py-6">Aucun rendez-vous passé</p>
              ) : (
                rdvPasses.map((rdv) => (
                  <div key={rdv.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 opacity-70 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSelectedRdv(rdv)}>
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

      <Dialog open={!!selectedRdv} onOpenChange={(open) => !open && setSelectedRdv(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedRdv?.sujet}</DialogTitle>
          </DialogHeader>
          {selectedRdv && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{format(parseISO(selectedRdv.date), "EEEE d MMMM yyyy", { locale: fr })} à {selectedRdv.heure}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Statut :</span>
                <StatusBadge status={selectedRdv.statut} />
              </div>
              {selectedRdv.location && (
                <a
                  href={selectedRdv.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary text-sm font-medium"
                >
                  <Video className="h-4 w-4" />
                  Rejoindre la réunion
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ClientLayout>
  );
}
