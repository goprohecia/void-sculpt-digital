import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, User, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendlyEvents } from "@/hooks/use-calendly-events";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isToday, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export default function AdminRendezVous() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const minDate = useMemo(() => {
    // Fetch from 3 months ago to get past events too
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

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = (getDay(monthStart) + 6) % 7;
  const paddedDays: (Date | null)[] = [...Array(startDayOfWeek).fill(null), ...days];

  const getRdvForDay = (day: Date) =>
    events.filter((r) => isSameDay(parseISO(r.date), day));

  const rdvAVenir = events
    .filter((r) => r.statut === "a_venir")
    .sort((a, b) => a.date.localeCompare(b.date));

  const rdvPasses = events
    .filter((r) => r.statut === "passe" || r.statut === "annule")
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold">Rendez-vous</h1>
            <p className="text-muted-foreground text-sm">Rendez-vous synchronisés depuis Calendly</p>
          </motion.div>

          {error && (
            <motion.div variants={staggerItem} className="glass-card p-4 border-destructive/30 flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">Erreur de connexion Calendly. Vérifiez votre token API.</p>
            </motion.div>
          )}

          {isLoading && (
            <motion.div variants={staggerItem} className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Chargement des rendez-vous Calendly…</span>
            </motion.div>
          )}

          {/* Calendar */}
          <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-sm font-semibold capitalize">
                {format(currentMonth, "MMMM yyyy", { locale: fr })}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-px">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
              ))}
              {paddedDays.map((day, i) => {
                if (!day) return <div key={`pad-${i}`} className="p-1 min-h-[60px]" />;
                const dayRdv = getRdvForDay(day);
                return (
                  <div
                    key={day.toISOString()}
                    className={`p-1 min-h-[60px] rounded-lg border border-transparent transition-colors ${
                      isToday(day) ? "bg-primary/10 border-primary/30" : "hover:bg-muted/20"
                    }`}
                  >
                    <span className={`text-xs font-medium ${isToday(day) ? "text-primary" : "text-foreground"}`}>
                      {format(day, "d")}
                    </span>
                    {dayRdv.map((r) => (
                      <div
                        key={r.id}
                        className={`mt-0.5 text-[10px] px-1 py-0.5 rounded truncate ${
                          r.statut === "a_venir"
                            ? "bg-primary/20 text-primary"
                            : r.statut === "passe"
                            ? "bg-muted/40 text-muted-foreground"
                            : "bg-destructive/20 text-destructive"
                        }`}
                        title={`${r.heure} - ${r.clientNom}: ${r.sujet}`}
                      >
                        {r.heure} {r.clientNom.split(" ")[0]}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Upcoming */}
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
                  <div key={rdv.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{rdv.sujet}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium">{rdv.clientNom}</span>
                          <span>·</span>
                          <span>{format(parseISO(rdv.date), "d MMM yyyy", { locale: fr })}</span>
                          <Clock className="h-3 w-3" />
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

          {/* Past */}
          <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Passés ({rdvPasses.length})
            </h3>
            <div className="space-y-3">
              {rdvPasses.length === 0 && !isLoading ? (
                <p className="text-sm text-muted-foreground text-center py-6">Aucun rendez-vous passé</p>
              ) : (
                rdvPasses.map((rdv) => (
                  <div key={rdv.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 opacity-70">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{rdv.sujet}</p>
                      <p className="text-xs text-muted-foreground">{rdv.clientNom} · {format(parseISO(rdv.date), "d MMM yyyy", { locale: fr })} à {rdv.heure}</p>
                    </div>
                    <StatusBadge status={rdv.statut} />
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </AdminLayout>
  );
}
