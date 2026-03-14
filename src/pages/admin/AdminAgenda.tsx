import { useState, useMemo, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, User, Plus, Check, X, AlertCircle, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCalendarEvents, useIndisponibilites, type CalendarEvent } from "@/hooks/use-calendar-events";
import { useIsDemo } from "@/hooks/useIsDemo";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isToday, parseISO, addMinutes, differenceInMinutes } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

const TYPE_COLORS: Record<string, string> = {
  travail: "bg-primary/20 text-primary border-primary/30",
  rdv: "bg-primary/20 text-primary border-primary/30",
  reunion: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  intervention: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  conge: "bg-red-500/20 text-red-400 border-red-500/30",
};

const TYPE_LABELS: Record<string, string> = {
  travail: "Travail",
  rdv: "Rendez-vous",
  reunion: "Réunion",
  intervention: "Intervention",
  conge: "Congé",
};

const STATUT_LABELS: Record<string, string> = {
  en_attente: "En attente",
  validee: "Validée",
  refusee: "Refusée",
};

export default function AdminAgenda() {
  const { isDemo } = useIsDemo();
  const { events, addEvent, updateEvent, deleteEvent } = useCalendarEvents();
  const { demandes, handleDemande } = useIndisponibilites();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [dragEvent, setDragEvent] = useState<CalendarEvent | null>(null);
  const [confirmDrag, setConfirmDrag] = useState<{ event: CalendarEvent; newStart: Date } | null>(null);
  const [filterEmployees, setFilterEmployees] = useState<string[]>([]);
  const [evtForm, setEvtForm] = useState({
    titre: "", description: "", date: "", heure_debut: "09:00", heure_fin: "10:00",
    type: "rdv", employe_id: "", client_id: "", statut: "confirme",
  });

  // Fetch employees
  const { data: employees = [] } = useQuery<any[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      if (isDemo) return [{ id: "demo-emp-1", prenom: "Sophie", nom: "Martin" }, { id: "demo-emp-2", prenom: "Lucas", nom: "Dupont" }];
      const { data, error } = await (supabase as any).from("employees").select("id, prenom, nom").eq("statut", "actif");
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch clients
  const { data: clients = [] } = useQuery<any[]>({
    queryKey: ["clients-list"],
    queryFn: async () => {
      if (isDemo) return [];
      const { data, error } = await supabase.from("clients").select("id, prenom, nom, entreprise");
      if (error) throw error;
      return data || [];
    },
  });

  // Calendar data
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = (getDay(monthStart) + 6) % 7;
  const paddedDays: (Date | null)[] = [...Array(startDayOfWeek).fill(null), ...days];

  // Filter events
  const filteredEvents = useMemo(() => {
    if (filterEmployees.length === 0) return events;
    return events.filter((e) => !e.employe_id || filterEmployees.includes(e.employe_id));
  }, [events, filterEmployees]);

  const getEventsForDay = useCallback((day: Date) => {
    return filteredEvents.filter((e) => isSameDay(parseISO(e.date_debut), day));
  }, [filteredEvents]);

  const dayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  // Pending indisponibilité requests
  const pendingDemandes = demandes.filter((d) => d.statut === "en_attente");

  const handleCreateEvent = async () => {
    if (!evtForm.titre || !evtForm.date) { toast.error("Titre et date requis"); return; }
    try {
      const dateDebut = new Date(`${evtForm.date}T${evtForm.heure_debut}`);
      const dateFin = new Date(`${evtForm.date}T${evtForm.heure_fin}`);
      await addEvent({
        titre: evtForm.titre,
        description: evtForm.description,
        date_debut: dateDebut.toISOString(),
        date_fin: dateFin.toISOString(),
        type: evtForm.type,
        statut: evtForm.statut,
        employe_id: evtForm.employe_id || null,
        client_id: evtForm.client_id || null,
      });
      toast.success("Événement créé");
      setOpenCreate(false);
      setEvtForm({ titre: "", description: "", date: "", heure_debut: "09:00", heure_fin: "10:00", type: "rdv", employe_id: "", client_id: "", statut: "confirme" });
    } catch {
      toast.error("Erreur lors de la création");
    }
  };

  // Drag-drop handler
  const handleDrop = (day: Date) => {
    if (!dragEvent) return;
    if (isSameDay(parseISO(dragEvent.date_debut), day)) { setDragEvent(null); return; }

    const newStart = new Date(day);
    const oldStart = parseISO(dragEvent.date_debut);
    newStart.setHours(oldStart.getHours(), oldStart.getMinutes());

    if (dragEvent.statut === "confirme") {
      setConfirmDrag({ event: dragEvent, newStart });
    } else {
      executeDrag(dragEvent, newStart);
    }
    setDragEvent(null);
  };

  const executeDrag = async (event: CalendarEvent, newStart: Date) => {
    const duration = differenceInMinutes(parseISO(event.date_fin), parseISO(event.date_debut));
    const newEnd = addMinutes(newStart, duration);
    try {
      await updateEvent({ id: event.id, date_debut: newStart.toISOString(), date_fin: newEnd.toISOString() });
      toast.success("Événement déplacé");
    } catch {
      toast.error("Erreur lors du déplacement");
    }
  };

  const toggleEmployeeFilter = (empId: string) => {
    setFilterEmployees((prev) => prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]);
  };

  const getEmployeeName = (id: string | null) => {
    if (!id) return "";
    const emp = employees.find((e: any) => e.id === id);
    return emp ? `${emp.prenom} ${emp.nom}` : "";
  };

  return (
    <AdminLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <CalendarDays className="h-6 w-6 text-primary" /> Agenda
              </h1>
              <p className="text-muted-foreground text-sm">Vue unifiée de vos rendez-vous et disponibilités équipe</p>
            </div>
            <Button onClick={() => setOpenCreate(true)} className="gap-1.5">
              <Plus className="h-4 w-4" /> Événement
            </Button>
          </div>

          <Tabs defaultValue="calendrier">
            <TabsList>
              <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
              <TabsTrigger value="demandes">
                Demandes {pendingDemandes.length > 0 && (
                  <Badge variant="destructive" className="ml-1.5 text-[10px] px-1.5 py-0">{pendingDemandes.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendrier">
              {/* Employee filter */}
              {employees.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <span className="text-xs font-medium text-muted-foreground">Filtrer :</span>
                  {employees.map((emp: any) => (
                    <button
                      key={emp.id}
                      onClick={() => toggleEmployeeFilter(emp.id)}
                      className={cn(
                        "text-xs px-2.5 py-1 rounded-full border transition-all",
                        filterEmployees.includes(emp.id)
                          ? "bg-primary/20 border-primary/40 text-primary"
                          : filterEmployees.length === 0
                          ? "border-border/50 text-muted-foreground hover:border-primary/30"
                          : "border-border/30 text-muted-foreground/50 hover:border-border/50"
                      )}
                    >
                      {emp.prenom} {emp.nom}
                    </button>
                  ))}
                  {filterEmployees.length > 0 && (
                    <button onClick={() => setFilterEmployees([])} className="text-[10px] text-muted-foreground underline">
                      Tous
                    </button>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar grid */}
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <CardTitle className="text-base capitalize">
                        {format(currentMonth, "MMMM yyyy", { locale: fr })}
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1">
                      {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((j) => (
                        <div key={j} className="text-center text-xs font-medium text-muted-foreground py-2">{j}</div>
                      ))}
                      {paddedDays.map((day, i) => {
                        if (!day) return <div key={`pad-${i}`} className="p-1 min-h-[70px]" />;
                        const dayEvts = getEventsForDay(day);
                        const isSelected = selectedDay && isSameDay(day, selectedDay);
                        return (
                          <div
                            key={day.toISOString()}
                            onClick={() => setSelectedDay(day)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(day)}
                            className={cn(
                              "p-1 min-h-[70px] rounded-lg border transition-colors cursor-pointer",
                              isSelected
                                ? "bg-primary/10 border-primary/50"
                                : isToday(day)
                                ? "border-primary/30 bg-primary/5"
                                : "border-transparent hover:bg-muted/20"
                            )}
                          >
                            <span className={cn("text-xs font-medium", isToday(day) && "text-primary")}>{format(day, "d")}</span>
                            <div className="mt-0.5 space-y-0.5">
                              {dayEvts.slice(0, 3).map((evt) => (
                                <div
                                  key={evt.id}
                                  draggable
                                  onDragStart={() => setDragEvent(evt)}
                                  className={cn(
                                    "text-[10px] px-1 py-0.5 rounded truncate cursor-grab active:cursor-grabbing",
                                    TYPE_COLORS[evt.type] || TYPE_COLORS.travail
                                  )}
                                  title={`${evt.titre} ${getEmployeeName(evt.employe_id) ? `(${getEmployeeName(evt.employe_id)})` : ""}`}
                                >
                                  {format(parseISO(evt.date_debut), "HH:mm")} {evt.titre.slice(0, 12)}
                                </div>
                              ))}
                              {dayEvts.length > 3 && (
                                <span className="text-[9px] text-muted-foreground">+{dayEvts.length - 3}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Day detail panel */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      {selectedDay ? format(selectedDay, "EEEE d MMMM", { locale: fr }) : "Sélectionnez un jour"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!selectedDay && <p className="text-sm text-muted-foreground text-center py-8">Cliquez sur un jour</p>}
                    {selectedDay && dayEvents.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Aucun événement</p>}
                    {dayEvents.map((evt) => (
                      <div key={evt.id} className={cn("p-3 rounded-lg border space-y-1.5", TYPE_COLORS[evt.type] || TYPE_COLORS.travail)}>
                        <p className="text-sm font-medium">{evt.titre}</p>
                        <div className="flex flex-wrap gap-2 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(parseISO(evt.date_debut), "HH:mm")} — {format(parseISO(evt.date_fin), "HH:mm")}
                          </span>
                          {evt.employe_id && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" /> {getEmployeeName(evt.employe_id)}
                            </span>
                          )}
                        </div>
                        {evt.description && <p className="text-[11px] text-muted-foreground">{evt.description}</p>}
                        <Badge variant="outline" className="text-[10px]">{TYPE_LABELS[evt.type] || evt.type}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Demandes d'indisponibilité */}
            <TabsContent value="demandes">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Demandes d'indisponibilité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employé</TableHead>
                        <TableHead>Début</TableHead>
                        <TableHead>Fin</TableHead>
                        <TableHead>Motif</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {demandes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            Aucune demande
                          </TableCell>
                        </TableRow>
                      ) : (
                        demandes.map((d) => (
                          <TableRow key={d.id}>
                            <TableCell className="font-medium">{getEmployeeName(d.employe_id)}</TableCell>
                            <TableCell>{format(parseISO(d.date_debut), "dd MMM yyyy", { locale: fr })}</TableCell>
                            <TableCell>{format(parseISO(d.date_fin), "dd MMM yyyy", { locale: fr })}</TableCell>
                            <TableCell>{d.motif}</TableCell>
                            <TableCell>
                              <Badge variant={d.statut === "validee" ? "default" : d.statut === "refusee" ? "destructive" : "secondary"}>
                                {STATUT_LABELS[d.statut] || d.statut}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              {d.statut === "en_attente" && (
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 text-emerald-500 hover:text-emerald-600"
                                    onClick={async () => {
                                      await handleDemande({ id: d.id, statut: "validee" });
                                      toast.success("Demande validée — congé ajouté au calendrier");
                                    }}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                    onClick={async () => {
                                      await handleDemande({ id: d.id, statut: "refusee" });
                                      toast.success("Demande refusée");
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Create event dialog */}
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouvel événement</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Titre *</Label>
                <Input value={evtForm.titre} onChange={(e) => setEvtForm((f) => ({ ...f, titre: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={evtForm.description} onChange={(e) => setEvtForm((f) => ({ ...f, description: e.target.value }))} rows={2} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input type="date" value={evtForm.date} onChange={(e) => setEvtForm((f) => ({ ...f, date: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Début</Label>
                  <Input type="time" value={evtForm.heure_debut} onChange={(e) => setEvtForm((f) => ({ ...f, heure_debut: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Fin</Label>
                  <Input type="time" value={evtForm.heure_fin} onChange={(e) => setEvtForm((f) => ({ ...f, heure_fin: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={evtForm.type} onValueChange={(v) => setEvtForm((f) => ({ ...f, type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(TYPE_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select value={evtForm.statut} onValueChange={(v) => setEvtForm((f) => ({ ...f, statut: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirme">Confirmé</SelectItem>
                      <SelectItem value="provisoire">Provisoire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Employé</Label>
                <Select value={evtForm.employe_id || "__none__"} onValueChange={(v) => setEvtForm((f) => ({ ...f, employe_id: v === "__none__" ? "" : v }))}>
                  <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Aucun</SelectItem>
                    {employees.map((emp: any) => <SelectItem key={emp.id} value={emp.id}>{emp.prenom} {emp.nom}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={evtForm.client_id || "__none__"} onValueChange={(v) => setEvtForm((f) => ({ ...f, client_id: v === "__none__" ? "" : v }))}>
                  <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Aucun</SelectItem>
                    {clients.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.entreprise || `${c.prenom} ${c.nom}`}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleCreateEvent}>Créer l'événement</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Drag confirmation dialog */}
        <Dialog open={!!confirmDrag} onOpenChange={(o) => !o && setConfirmDrag(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Déplacer l'événement ?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Cet événement est confirmé. Voulez-vous le déplacer au{" "}
              <strong>{confirmDrag?.newStart && format(confirmDrag.newStart, "EEEE d MMMM", { locale: fr })}</strong> ?
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDrag(null)}>Annuler</Button>
              <Button onClick={() => {
                if (confirmDrag) {
                  executeDrag(confirmDrag.event, confirmDrag.newStart);
                  setConfirmDrag(null);
                }
              }}>Déplacer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminPageTransition>
    </AdminLayout>
  );
}
