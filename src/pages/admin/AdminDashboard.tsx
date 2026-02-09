import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { DashboardKPI } from "@/components/admin/DashboardKPI";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmailLogPanel } from "@/components/admin/EmailLogPanel";
import { useDemoData } from "@/contexts/DemoDataContext";
import { Euro, FolderOpen, Users, Receipt, MessageSquare, ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import {
  dossiers,
  clients,
  factures,
  relances,
  activites,
  donneesMensuelles,
  totalNonLus,
} from "@/data/mockData";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from "date-fns";
import { fr } from "date-fns/locale";

type CalendarEvent = { date: string; label: string; type: "dossier" | "facture" | "relance"; color: string };

export default function AdminDashboard() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const { emailLogs } = useDemoData();

  const dossiersActifs = dossiers.filter((d) => d.statut === "en_cours").length;
  const nouveauxClients = clients.filter((c) => c.dateCreation >= "2026-02-01").length;
  const facturesEnAttente = factures.filter((f) => f.statut === "en_attente").length;
  const caFevrier = donneesMensuelles[1]?.caTotal || 0;

  const sparklineData = donneesMensuelles.slice(0, 6).map((d) => ({ ca: d.caTotal }));
  const dossiersRecents = dossiers.slice(0, 5);

  const calendarEvents = useMemo<CalendarEvent[]>(() => {
    const events: CalendarEvent[] = [];
    dossiers.forEach((d) => {
      if (d.dateEcheance) events.push({ date: d.dateEcheance, label: `${d.reference} — ${d.clientNom}`, type: "dossier", color: "hsl(200,100%,50%)" });
    });
    factures.forEach((f) => {
      if (f.dateEcheance) events.push({ date: f.dateEcheance, label: `${f.reference} — ${f.clientNom} (${f.montant.toLocaleString()} €)`, type: "facture", color: "hsl(45,93%,55%)" });
    });
    relances.forEach((r) => {
      if (r.dateProchaine) events.push({ date: r.dateProchaine, label: `Relance ${r.factureRef} — ${r.clientNom}`, type: "relance", color: "hsl(0,84%,60%)" });
    });
    return events;
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = (getDay(monthStart) + 6) % 7;

  const getEventsForDay = (day: Date) =>
    calendarEvents.filter((e) => isSameDay(new Date(e.date), day));

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold">Vue d'ensemble</h1>
            <p className="text-muted-foreground text-sm">Tableau de bord de l'activité</p>
          </motion.div>

          {/* KPIs */}
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={staggerContainer} initial="initial" animate="animate">
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Chiffre d'affaires" value={`${(caFevrier / 1000).toFixed(1)}k €`} icon={Euro} trend={{ value: 23.5, label: "vs jan." }} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Dossiers actifs" value={dossiersActifs} icon={FolderOpen} trend={{ value: 12, label: "vs jan." }} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Nouveaux clients" value={nouveauxClients} icon={Users} trend={{ value: 50, label: "vs jan." }} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Factures en attente" value={facturesEnAttente} icon={Receipt} />
            </motion.div>
          </motion.div>

          <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={staggerItem}>
            {/* Sparkline CA */}
            <div className="glass-card p-6 lg:col-span-1">
              <h3 className="text-sm font-semibold mb-2">Tendance CA</h3>
              <p className="text-xs text-muted-foreground mb-4">Janvier – Juin 2026</p>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineData}>
                    <defs>
                      <linearGradient id="caGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(265, 85%, 60%)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="hsl(265, 85%, 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="ca" stroke="hsl(265, 85%, 60%)" fill="url(#caGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activités récentes */}
            <div className="glass-card p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Activités récentes</h3>
                <span className="text-xs text-muted-foreground">{activites.length} activités</span>
              </div>
              <div className="space-y-3">
                {activites.slice(0, 6).map((a) => (
                  <div key={a.id} className="flex items-start gap-3 text-sm">
                    <div className="mt-1 h-2 w-2 rounded-full shrink-0" style={{
                      backgroundColor: a.type === "dossier" ? "hsl(200,100%,50%)" :
                        a.type === "client" ? "hsl(155,100%,45%)" :
                        a.type === "facture" ? "hsl(45,93%,55%)" :
                        a.type === "message" ? "hsl(265,85%,60%)" :
                        "hsl(0,84%,60%)"
                    }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground truncate">{a.description}</p>
                      <p className="text-xs text-muted-foreground">{a.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Dossiers récents */}
          <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Dossiers récents</h3>
              <Link to="/admin/dossiers" className="text-xs text-primary hover:underline flex items-center gap-1">
                Voir tous <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Référence</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Client</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium hidden md:table-cell">Prestation</th>
                    <th className="text-right py-2 px-3 text-muted-foreground font-medium">Montant</th>
                    <th className="text-center py-2 px-3 text-muted-foreground font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {dossiersRecents.map((d) => (
                    <tr key={d.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-xs">{d.reference}</td>
                      <td className="py-2.5 px-3">{d.clientNom}</td>
                      <td className="py-2.5 px-3 hidden md:table-cell text-muted-foreground">{d.typePrestation}</td>
                      <td className="py-2.5 px-3 text-right font-medium">{d.montant.toLocaleString()} €</td>
                      <td className="py-2.5 px-3 text-center"><StatusBadge status={d.statut} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Calendrier des échéances */}
          <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                Calendrier des échéances
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[hsl(200,100%,50%)]" />Dossiers</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[hsl(45,93%,55%)]" />Factures</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[hsl(0,84%,60%)]" />Relances</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium capitalize">{format(currentMonth, "MMMM yyyy", { locale: fr })}</span>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-px text-center text-[10px] text-muted-foreground mb-1">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => <div key={d} className="py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-px">
              {Array.from({ length: startDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
              {days.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isSelected = selectedDay && isSameDay(day, selectedDay);
                const isToday = isSameDay(day, new Date(2026, 1, 9)); // simulated today
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`relative py-2 rounded-lg text-xs transition-colors ${isSelected ? "bg-primary/20 text-primary font-semibold" : isToday ? "bg-muted/60 font-semibold" : "hover:bg-muted/30"}`}
                  >
                    {format(day, "d")}
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dayEvents.slice(0, 3).map((e, i) => (
                          <span key={i} className="h-1 w-1 rounded-full" style={{ backgroundColor: e.color }} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected day events */}
            {selectedDay && (
              <div className="mt-4 border-t border-border/50 pt-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">{format(selectedDay, "EEEE d MMMM yyyy", { locale: fr })}</p>
                {selectedEvents.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Aucune échéance</p>
                ) : (
                  selectedEvents.map((e, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="mt-1 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
                      <div>
                        <span className="font-medium capitalize">{e.type}</span>
                        <span className="text-muted-foreground"> — {e.label}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>

          {/* Derniers emails envoyés */}
          {emailLogs.length > 0 && (
            <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Derniers emails envoyés
                </h3>
                <span className="text-xs text-muted-foreground">{emailLogs.length} email{emailLogs.length > 1 ? "s" : ""}</span>
              </div>
              <EmailLogPanel emails={emailLogs} maxItems={5} />
            </motion.div>
          )}

          {/* Messages non lus */}
          {totalNonLus > 0 && (
            <motion.div variants={staggerItem}>
              <Link to="/admin/messagerie" className="glass-card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors block">
                <div className="rounded-xl bg-primary/10 p-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{totalNonLus} message{totalNonLus > 1 ? "s" : ""} non lu{totalNonLus > 1 ? "s" : ""}</p>
                  <p className="text-xs text-muted-foreground">Consultez votre messagerie</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </AdminPageTransition>
    </AdminLayout>
  );
}
