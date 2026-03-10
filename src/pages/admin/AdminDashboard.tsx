import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { DashboardKPI } from "@/components/admin/DashboardKPI";
import { useDemoPlan } from "@/contexts/DemoPlanContext";
import { GarageDashboard } from "@/components/garage/GarageDashboard";
import { ImmobilierDashboard } from "@/components/immobilier/ImmobilierDashboard";
import { BTPDashboard } from "@/components/btp/BTPDashboard";
import { ConciergerieDashboard } from "@/components/conciergerie/ConciergerieDashboard";
import { CoiffureDashboard } from "@/components/coiffure/CoiffureDashboard";
import { RecrutementDashboard } from "@/components/recrutement/RecrutementDashboard";
import { AutoEcoleDashboard } from "@/components/auto-ecole/AutoEcoleDashboard";
import { MariageDashboard } from "@/components/mariage/MariageDashboard";
import { AvocatDashboard } from "@/components/avocat/AvocatDashboard";
import { ComptableDashboard } from "@/components/comptable/ComptableDashboard";
import { BoutiqueDashboard } from "@/components/boutique/BoutiqueDashboard";
import { SportDashboard } from "@/components/sport/SportDashboard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmailLogPanel } from "@/components/admin/EmailLogPanel";
import { useEmailLogs } from "@/hooks/use-email-logs";
import { useDossiers } from "@/hooks/use-dossiers";
import { useClients } from "@/hooks/use-clients";
import { useFactures } from "@/hooks/use-factures";
import { useRelances } from "@/hooks/use-relances";
import { useConversations } from "@/hooks/use-conversations";
import { useIsDemo } from "@/hooks/useIsDemo";
import { useDemoData } from "@/contexts/DemoDataContext";
import { MOCK_TEAM_MEMBERS } from "@/data/mockData";
import {
  Euro, FolderOpen, Users, Receipt, MessageSquare, ArrowRight,
  CalendarDays, ChevronLeft, ChevronRight, Mail, UserCheck, UserPlus,
  Plus, Send, Calendar, StickyNote, Zap, TrendingUp, Activity, Gauge
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  activites as mockActivites,
  donneesMensuelles as mockDonneesMensuelles,
} from "@/data/mockData";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay } from "date-fns";
import { fr } from "date-fns/locale";

type CalendarEvent = { date: string; label: string; type: "dossier" | "facture" | "relance"; color: string };

export default function AdminDashboard() {
  const { demoSector } = useDemoPlan();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const { isDemo } = useIsDemo();
  const { emailLogs } = useEmailLogs();
  const { dossiers } = useDossiers();
  const { clients } = useClients();
  const { factures } = useFactures();
  const { relances } = useRelances();
  const { conversations } = useConversations();
  const { getDossiersByEmployee } = useDemoData();

  const donneesMensuelles = isDemo ? mockDonneesMensuelles : [];
  const activites = isDemo ? mockActivites : [];
  const totalNonLus = conversations.reduce((sum, c) => sum + (c.nonLus || 0), 0);

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
  }, [dossiers, factures, relances]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = (getDay(monthStart) + 6) % 7;

  const getEventsForDay = (day: Date) =>
    calendarEvents.filter((e) => isSameDay(new Date(e.date), day));

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  const hasTrendData = donneesMensuelles.length >= 2;

  const nbClients = clients.filter((c) => (c as any).segment !== "prospect").length;
  const nbProspects = clients.filter((c) => (c as any).segment === "prospect").length;
  const totalClients = nbClients + nbProspects;
  const pctClients = totalClients > 0 ? Math.round((nbClients / totalClients) * 100) : 0;
  const pctProspects = totalClients > 0 ? 100 - pctClients : 0;

  const quickActions = [
    { icon: Plus, label: "Nouveau dossier", to: "/admin/dossiers", color: "text-blue-400 bg-blue-500/15" },
    { icon: Send, label: "Envoyer email", to: "/admin/emails", color: "text-violet-400 bg-violet-500/15" },
    { icon: Calendar, label: "Planifier RDV", to: "/admin/rendez-vous", color: "text-emerald-400 bg-emerald-500/15" },
    { icon: StickyNote, label: "Voir notes", to: "/admin/dossiers", color: "text-amber-400 bg-amber-500/15" },
  ];

  if (demoSector === "garages") {
    return (
      <AdminLayout>
        <AdminPageTransition>
          <GarageDashboard />
        </AdminPageTransition>
      </AdminLayout>
    );
  }

  if (demoSector === "immobilier") {
    return (
      <AdminLayout>
        <AdminPageTransition>
          <ImmobilierDashboard />
        </AdminPageTransition>
      </AdminLayout>
    );
  }

  if (demoSector === "btp") {
    return (
      <AdminLayout>
        <AdminPageTransition>
          <BTPDashboard />
        </AdminPageTransition>
      </AdminLayout>
    );
  }

  if (demoSector === "conciergerie") {
    return (
      <AdminLayout>
        <AdminPageTransition>
          <ConciergerieDashboard />
        </AdminPageTransition>
      </AdminLayout>
    );
  }

  if (demoSector === "coiffure") {
    return (
      <AdminLayout>
        <AdminPageTransition>
          <CoiffureDashboard />
        </AdminPageTransition>
      </AdminLayout>
    );
  }

  if (demoSector === "cabinet-recrutement") {
    return (
      <AdminLayout>
        <AdminPageTransition>
          <RecrutementDashboard />
        </AdminPageTransition>
      </AdminLayout>
    );
  }

  if (demoSector === "auto-ecole") {
    return (
      <AdminLayout>
        <AdminPageTransition>
          <AutoEcoleDashboard />
        </AdminPageTransition>
      </AdminLayout>
    );
  }

  if (demoSector === "mariage") {
    return (
      <AdminLayout>
        <AdminPageTransition>
          <MariageDashboard />
        </AdminPageTransition>
      </AdminLayout>
    );
  }

  if (demoSector === "cabinet-avocats") {
    return (
      <AdminLayout>
        <AdminPageTransition>
          <AvocatDashboard />
        </AdminPageTransition>
      </AdminLayout>
    );
  }

  if (demoSector === "expert-comptable") {
    return (
      <AdminLayout>
        <AdminPageTransition>
          <ComptableDashboard />
        </AdminPageTransition>
      </AdminLayout>
    );
  }

  if (demoSector === "boutique") {
    return (
      <AdminLayout>
        <AdminPageTransition>
          <BoutiqueDashboard />
        </AdminPageTransition>
      </AdminLayout>
    );
  }

  if (demoSector === "coach-sportif") {
    return (
      <AdminLayout>
        <AdminPageTransition>
          <SportDashboard />
        </AdminPageTransition>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">

          {/* Header */}
          <motion.div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" variants={staggerItem}>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                <span>📊</span> Dashboard
              </h1>
              <p className="text-muted-foreground text-sm mt-1">Bienvenue ! Voici un aperçu de votre activité.</p>
            </div>
            <Link
              to="/admin/dossiers"
              className="glass-card px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:border-primary/40 transition-colors w-fit"
            >
              <Plus className="h-4 w-4 text-primary" />
              Nouveau dossier
            </Link>
          </motion.div>

          {/* KPIs */}
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={staggerContainer} initial="initial" animate="animate">
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Chiffre d'affaires" value={`${(caFevrier / 1000).toFixed(1)}k €`} icon={Euro} iconColor="emerald" trend={hasTrendData ? { value: 23.5, label: "vs jan." } : undefined} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Dossiers actifs" value={dossiersActifs} icon={FolderOpen} iconColor="blue" trend={hasTrendData ? { value: 12, label: "vs jan." } : undefined} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Nouveaux clients" value={nouveauxClients} icon={Users} iconColor="violet" trend={hasTrendData ? { value: 50, label: "vs jan." } : undefined} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <DashboardKPI title="Factures en attente" value={facturesEnAttente} icon={Receipt} iconColor="amber" />
            </motion.div>
          </motion.div>

          {/* Main grid: 2/3 + 1/3 */}
          <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={staggerItem}>

            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">

              {/* Dossiers récents */}
              {dossiersRecents.length > 0 && (
                <div className="glass-card p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-blue-400" />
                      Dossiers récents
                    </h3>
                    <Link to="/admin/dossiers" className="text-xs text-primary hover:underline flex items-center gap-1">
                      Voir tous <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
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
                </div>
              )}

              {/* Calendrier des échéances */}
              <div className="glass-card p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Calendrier des échéances
                  </h3>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-400" />Dossiers</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" />Factures</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-400" />Relances</span>
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
                    const isToday = isSameDay(day, new Date(2026, 1, 9));
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
              </div>

              {/* Derniers emails envoyés */}
              {emailLogs.length > 0 && (
                <div className="glass-card p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4 text-violet-400" />
                      Derniers emails envoyés
                    </h3>
                    <span className="text-xs text-muted-foreground">{emailLogs.length} email{emailLogs.length > 1 ? "s" : ""}</span>
                  </div>
                  <EmailLogPanel emails={emailLogs} maxItems={5} />
                </div>
              )}
            </div>

            {/* RIGHT COLUMN (sidebar) */}
            <div className="space-y-6">

              {/* Actions rapides */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                  <Zap className="h-4 w-4 text-amber-400" />
                  Actions rapides
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <Link
                      key={action.label}
                      to={action.to}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted/30 transition-colors text-center group"
                    >
                      <div className={`rounded-xl p-2.5 ${action.color} group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">{action.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tendance CA (sparkline) */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  Tendance CA
                </h3>
                <p className="text-xs text-muted-foreground mb-3">Janvier – Juin 2026</p>
                <div className="h-20">
                  {sparklineData.length > 0 ? (
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
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-muted-foreground">Aucune donnée</div>
                  )}
                </div>
              </div>

              {/* Répartition clients */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> Répartition
                  </h3>
                  <span className="text-xs text-muted-foreground">{totalClients} total</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3">
                    <UserCheck className="h-5 w-5 text-emerald-400" />
                    <div className="flex-1">
                      <p className="text-lg font-bold text-emerald-400">{nbClients}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Clients</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400">{pctClients}%</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 p-3">
                    <UserPlus className="h-5 w-5 text-amber-400" />
                    <div className="flex-1">
                      <p className="text-lg font-bold text-amber-400">{nbProspects}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Prospects</p>
                    </div>
                    <span className="text-xs font-semibold text-amber-400">{pctProspects}%</span>
                  </div>
                  {totalClients > 0 && (
                    <div className="h-2 rounded-full bg-muted/30 overflow-hidden flex">
                      <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${pctClients}%` }} />
                      <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${pctProspects}%` }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Charge de l'équipe */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary" />
                    Charge de l'équipe
                  </h3>
                </div>
                <div className="space-y-3">
                  {MOCK_TEAM_MEMBERS.map((member) => {
                    const active = isDemo ? getDossiersByEmployee(member.id).filter((d) => d.dossier.statut === "en_cours").length : 0;
                    const hasLimit = member.capaciteMax != null && member.capaciteMax > 0;
                    const pctCharge = hasLimit ? Math.round((active / member.capaciteMax!) * 100) : 0;
                    const isOver = hasLimit && pctCharge >= 100;
                    return (
                      <div key={member.id} className={`flex items-center gap-3 text-xs ${isOver ? "text-destructive" : ""}`}>
                        <div className="w-24 truncate font-medium">{member.prenom} {member.nom[0]}.</div>
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isOver ? "bg-destructive" : pctCharge >= 70 ? "bg-orange-500" : "bg-green-500"}`}
                            style={{ width: `${Math.min(pctCharge, 100)}%` }}
                          />
                        </div>
                        <span className="w-16 text-right text-muted-foreground whitespace-nowrap">
                          {active}{hasLimit ? ` / ${member.capaciteMax}` : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Activités récentes */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-400" />
                    Activité récente
                  </h3>
                  <span className="text-xs text-muted-foreground">{activites.length}</span>
                </div>
                {activites.length > 0 ? (
                  <div className="space-y-3">
                    {activites.slice(0, 6).map((a) => (
                      <div key={a.id} className="flex items-start gap-3 text-xs">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{
                          backgroundColor: a.type === "dossier" ? "hsl(200,100%,50%)" :
                            a.type === "client" ? "hsl(155,100%,45%)" :
                            a.type === "facture" ? "hsl(45,93%,55%)" :
                            a.type === "message" ? "hsl(265,85%,60%)" :
                            "hsl(0,84%,60%)"
                        }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground truncate leading-tight">{a.description}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{a.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-16 text-xs text-muted-foreground">Aucune activité récente</div>
                )}
              </div>

              {/* Messages non lus */}
              {totalNonLus > 0 && (
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
              )}
            </div>
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </AdminLayout>
  );
}
