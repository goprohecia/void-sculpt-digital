import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, User, Loader2, AlertCircle, Video, ExternalLink, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendlyEvent } from "@/hooks/use-calendly-events";
import { useCalendlyEvents } from "@/hooks/use-calendly-events";
import { useEventsManuels } from "@/hooks/use-events-manuels";
import { useClients } from "@/hooks/use-clients";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isToday, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";

export default function AdminRendezVous() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRdv, setSelectedRdv] = useState<CalendlyEvent | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [evtForm, setEvtForm] = useState({ titre: "", description: "", date: "", heure: "09:00", duree: 60, type: "rdv", employee_id: "", client_id: "" });

  const { isDemo } = useIsDemo();

  const minDate = useMemo(() => { const d = new Date(); d.setMonth(d.getMonth() - 3); return d.toISOString(); }, []);
  const maxDate = useMemo(() => { const d = new Date(); d.setMonth(d.getMonth() + 6); return d.toISOString(); }, []);

  const { data: calendlyEvents = [], isLoading, error } = useCalendlyEvents(minDate, maxDate);
  const { events: manualEvents, addEvent } = useEventsManuels();
  const { clients } = useClients();
  const { data: employees = [] } = useQuery<any[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      if (isDemo) return [{ id: "demo-emp-1", prenom: "Sophie", nom: "Martin" }, { id: "demo-emp-2", prenom: "Lucas", nom: "Dupont" }];
      const { data, error } = await (supabase as any).from("employees").select("id, prenom, nom").eq("statut", "actif");
      if (error) throw error;
      return data || [];
    },
  });

  // Merge calendly + manual events for calendar display
  const allEvents = useMemo(() => {
    const manual = manualEvents.map((e) => ({
      id: e.id,
      date: e.date,
      heure: e.heure,
      clientNom: clients.find((c) => c.id === e.client_id)?.entreprise || "Interne",
      clientEmail: "",
      sujet: e.titre,
      statut: new Date(e.date) > new Date() ? "a_venir" : "passe",
      location: null,
      isManual: true,
    }));
    const calendly = calendlyEvents.map((e) => ({ ...e, isManual: false }));
    return [...calendly, ...manual];
  }, [calendlyEvents, manualEvents, clients]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = (getDay(monthStart) + 6) % 7;
  const paddedDays: (Date | null)[] = [...Array(startDayOfWeek).fill(null), ...days];

  const getRdvForDay = (day: Date) => allEvents.filter((r) => isSameDay(parseISO(r.date), day));

  const rdvAVenir = allEvents.filter((r) => r.statut === "a_venir").sort((a, b) => a.date.localeCompare(b.date));

  const handleCreateEvent = () => {
    if (!evtForm.titre || !evtForm.date) { toast.error("Titre et date requis"); return; }
    addEvent({
      titre: evtForm.titre,
      description: evtForm.description,
      date: new Date(evtForm.date).toISOString(),
      heure: evtForm.heure,
      duree: evtForm.duree,
      type: evtForm.type,
      employee_id: evtForm.employee_id || undefined,
      client_id: evtForm.client_id || undefined,
    });
    toast.success("Événement créé");
    setOpenCreate(false);
    setEvtForm({ titre: "", description: "", date: "", heure: "09:00", duree: 60, type: "rdv", employee_id: "", client_id: "" });
  };

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Rendez-vous</h1>
              <p className="text-muted-foreground text-sm">Calendly + événements manuels</p>
            </div>
            <Button size="sm" onClick={() => setOpenCreate(true)} className="gap-1"><Plus className="h-4 w-4" /> Événement</Button>
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
              <span className="text-sm">Chargement…</span>
            </motion.div>
          )}

          {/* Calendar */}
          <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft className="h-4 w-4" /></Button>
              <h3 className="text-sm font-semibold capitalize">{format(currentMonth, "MMMM yyyy", { locale: fr })}</h3>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <div className="grid grid-cols-7 gap-px">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
              ))}
              {paddedDays.map((day, i) => {
                if (!day) return <div key={`pad-${i}`} className="p-1 min-h-[60px]" />;
                const dayRdv = getRdvForDay(day);
                return (
                  <div key={day.toISOString()} className={`p-1 min-h-[60px] rounded-lg border border-transparent transition-colors ${isToday(day) ? "bg-primary/10 border-primary/30" : "hover:bg-muted/20"}`}>
                    <span className={`text-xs font-medium ${isToday(day) ? "text-primary" : "text-foreground"}`}>{format(day, "d")}</span>
                    {dayRdv.map((r: any) => (
                      <div key={r.id} className={`mt-0.5 text-[10px] px-1 py-0.5 rounded truncate cursor-pointer transition-all hover:scale-[1.03] ${
                        r.isManual ? "bg-accent/30 text-accent-foreground" : r.statut === "a_venir" ? "bg-primary/20 text-primary" : "bg-muted/40 text-muted-foreground"
                      }`} title={`${r.heure} - ${r.clientNom}: ${r.sujet}`} onClick={() => !r.isManual && setSelectedRdv(r)}>
                        {r.heure} {r.clientNom?.split(" ")[0]}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Upcoming */}
          <motion.div className="glass-card p-4 sm:p-6" variants={staggerItem}>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> À venir ({rdvAVenir.length})</h3>
            <div className="space-y-3">
              {rdvAVenir.length === 0 && !isLoading ? (
                <p className="text-sm text-muted-foreground text-center py-6">Aucun rendez-vous à venir</p>
              ) : rdvAVenir.map((rdv: any) => (
                <div key={rdv.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => !rdv.isManual && setSelectedRdv(rdv)}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><User className="h-4 w-4 text-primary" /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{rdv.sujet}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">{rdv.clientNom}</span><span>·</span>
                        <span>{format(parseISO(rdv.date), "d MMM yyyy", { locale: fr })}</span>
                        <Clock className="h-3 w-3" /><span>{rdv.heure}</span>
                      </div>
                    </div>
                  </div>
                  {rdv.isManual ? <Badge variant="secondary" className="text-xs">Manuel</Badge> : <StatusBadge status={rdv.statut} />}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </AdminPageTransition>

      {/* Detail Dialog for Calendly events */}
      <Dialog open={!!selectedRdv} onOpenChange={(open) => !open && setSelectedRdv(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{selectedRdv?.sujet}</DialogTitle></DialogHeader>
          {selectedRdv && (
            <div className="space-y-4">
              <div className="flex items-center gap-3"><User className="h-4 w-4 text-muted-foreground" /><div><p className="text-sm font-medium">{selectedRdv.clientNom}</p><p className="text-xs text-muted-foreground">{selectedRdv.clientEmail}</p></div></div>
              <div className="flex items-center gap-3"><CalendarDays className="h-4 w-4 text-muted-foreground" /><p className="text-sm">{format(parseISO(selectedRdv.date), "EEEE d MMMM yyyy", { locale: fr })} à {selectedRdv.heure}</p></div>
              <div className="flex items-center gap-2"><span className="text-sm text-muted-foreground">Statut :</span><StatusBadge status={selectedRdv.statut} /></div>
              {selectedRdv.location && <a href={selectedRdv.location} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary text-sm font-medium"><Video className="h-4 w-4" />Rejoindre la réunion<ExternalLink className="h-3 w-3 ml-auto" /></a>}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nouvel événement</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2"><Label>Titre *</Label><Input value={evtForm.titre} onChange={(e) => setEvtForm((f) => ({ ...f, titre: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Description</Label><Input value={evtForm.description} onChange={(e) => setEvtForm((f) => ({ ...f, description: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date *</Label><Input type="date" value={evtForm.date} onChange={(e) => setEvtForm((f) => ({ ...f, date: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Heure</Label><Input type="time" value={evtForm.heure} onChange={(e) => setEvtForm((f) => ({ ...f, heure: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Durée (min)</Label><Input type="number" value={evtForm.duree} onChange={(e) => setEvtForm((f) => ({ ...f, duree: +e.target.value }))} /></div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={evtForm.type} onValueChange={(v) => setEvtForm((f) => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rdv">Rendez-vous</SelectItem>
                    <SelectItem value="interne">Interne</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Employé assigné</Label>
              <Select value={evtForm.employee_id || "__none__"} onValueChange={(v) => setEvtForm((f) => ({ ...f, employee_id: v === "__none__" ? "" : v }))}>
                <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Aucun</SelectItem>
                  {employees.map((emp: any) => <SelectItem key={emp.id} value={emp.id}>{emp.prenom} {emp.nom}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Client</Label>
              <Select value={evtForm.client_id} onValueChange={(v) => setEvtForm((f) => ({ ...f, client_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem>
                  {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.entreprise || `${c.prenom} ${c.nom}`}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleCreateEvent}>Créer l'événement</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
