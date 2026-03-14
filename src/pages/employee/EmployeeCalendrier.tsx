import { useState, useMemo } from "react";
import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CalendarDays, Plus, CalendarIcon, Clock, AlertCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday, ChevronLeft, ChevronRight } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { useCalendarEvents, useIndisponibilites } from "@/hooks/use-calendar-events";
import { useIsDemo } from "@/hooks/useIsDemo";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const TYPE_COLORS: Record<string, string> = {
  travail: "bg-primary/20 text-primary border-primary/30",
  rdv: "bg-primary/20 text-primary border-primary/30",
  reunion: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  intervention: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  conge: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function EmployeeCalendrier() {
  const { isDemo, supabaseUserId } = useIsDemo();
  const { events } = useCalendarEvents();
  const { demandes, createDemande } = useIndisponibilites();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [openIndispo, setOpenIndispo] = useState(false);
  const [indispoForm, setIndispoForm] = useState({ date_debut: "", date_fin: "", motif: "" });

  // Get current employee id
  const { data: currentEmployee } = useQuery({
    queryKey: ["current-employee", supabaseUserId],
    queryFn: async () => {
      if (!supabaseUserId) return null;
      const { data } = await supabase.from("employees").select("id").eq("user_id", supabaseUserId).maybeSingle();
      return data as { id: string } | null;
    },
    enabled: !isDemo && !!supabaseUserId,
  });

  // Filter events for this employee only
  const myEvents = useMemo(() => {
    if (isDemo) return events;
    if (!currentEmployee) return [];
    return events.filter((e) => e.employe_id === currentEmployee.id || !e.employe_id);
  }, [events, currentEmployee, isDemo]);

  const myDemandes = useMemo(() => {
    if (isDemo) return [];
    if (!currentEmployee) return [];
    return demandes.filter((d) => d.employe_id === currentEmployee.id);
  }, [demandes, currentEmployee, isDemo]);

  // Calendar
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = (getDay(monthStart) + 6) % 7;
  const paddedDays: (Date | null)[] = [...Array(startDayOfWeek).fill(null), ...days];

  const getEventsForDay = (day: Date) => myEvents.filter((e) => isSameDay(parseISO(e.date_debut), day));
  const dayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  const handleSubmitIndispo = async () => {
    if (!indispoForm.date_debut || !indispoForm.date_fin || !indispoForm.motif) {
      toast.error("Tous les champs sont requis");
      return;
    }
    if (!currentEmployee) {
      toast.error("Employé non identifié");
      return;
    }
    try {
      await createDemande({
        employe_id: currentEmployee.id,
        date_debut: new Date(indispoForm.date_debut).toISOString(),
        date_fin: new Date(indispoForm.date_fin).toISOString(),
        motif: indispoForm.motif,
      });
      toast.success("Demande d'indisponibilité envoyée");
      setOpenIndispo(false);
      setIndispoForm({ date_debut: "", date_fin: "", motif: "" });
    } catch {
      toast.error("Erreur lors de l'envoi");
    }
  };

  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <CalendarDays className="h-6 w-6 text-primary" />
                Mon calendrier
              </h1>
              <p className="text-muted-foreground text-sm">Vos événements et indisponibilités</p>
            </div>
            <Button onClick={() => setOpenIndispo(true)} variant="outline" className="gap-1.5">
              <AlertCircle className="h-4 w-4" /> Signaler une indisponibilité
            </Button>
          </div>

          <Tabs defaultValue="calendrier">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
              <TabsTrigger value="demandes">
                Mes demandes
                {myDemandes.filter((d) => d.statut === "en_attente").length > 0 && (
                  <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0">
                    {myDemandes.filter((d) => d.statut === "en_attente").length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendrier">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                        ←
                      </Button>
                      <CardTitle className="text-base capitalize">
                        {format(currentMonth, "MMMM yyyy", { locale: fr })}
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                        →
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1">
                      {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((j) => (
                        <div key={j} className="text-center text-xs font-medium text-muted-foreground py-2">{j}</div>
                      ))}
                      {paddedDays.map((day, i) => {
                        if (!day) return <div key={`pad-${i}`} className="p-1 min-h-[60px]" />;
                        const dayEvts = getEventsForDay(day);
                        const isSelected = selectedDay && isSameDay(day, selectedDay);
                        return (
                          <div
                            key={day.toISOString()}
                            onClick={() => setSelectedDay(day)}
                            className={cn(
                              "p-1 min-h-[60px] rounded-lg border transition-colors cursor-pointer",
                              isSelected
                                ? "bg-primary/10 border-primary/50"
                                : isToday(day)
                                ? "border-primary/30 bg-primary/5"
                                : "border-transparent hover:bg-muted/20"
                            )}
                          >
                            <span className={cn("text-xs font-medium", isToday(day) && "text-primary")}>{format(day, "d")}</span>
                            {dayEvts.length > 0 && (
                              <div className="mt-0.5 flex gap-0.5">
                                {dayEvts.slice(0, 3).map((evt) => (
                                  <span key={evt.id} className={cn("h-1.5 w-1.5 rounded-full", evt.type === "conge" ? "bg-destructive" : "bg-primary")} />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

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
                      <div key={evt.id} className={cn("p-3 rounded-lg border space-y-1", TYPE_COLORS[evt.type] || TYPE_COLORS.travail)}>
                        <p className="text-sm font-medium">{evt.titre}</p>
                        <span className="flex items-center gap-1 text-[11px]">
                          <Clock className="h-3 w-3" />
                          {format(parseISO(evt.date_debut), "HH:mm")} — {format(parseISO(evt.date_fin), "HH:mm")}
                        </span>
                        {evt.description && <p className="text-[11px] text-muted-foreground">{evt.description}</p>}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="demandes">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Historique de mes demandes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {myDemandes.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Aucune demande</p>
                  ) : (
                    myDemandes.map((d) => (
                      <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                        <div>
                          <p className="text-sm font-medium">{d.motif}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(d.date_debut), "dd MMM yyyy", { locale: fr })} → {format(parseISO(d.date_fin), "dd MMM yyyy", { locale: fr })}
                          </p>
                          {d.commentaire_admin && (
                            <p className="text-xs text-muted-foreground mt-1">Commentaire : {d.commentaire_admin}</p>
                          )}
                        </div>
                        <Badge variant={d.statut === "validee" ? "default" : d.statut === "refusee" ? "destructive" : "secondary"}>
                          {d.statut === "en_attente" ? "En attente" : d.statut === "validee" ? "Validée" : "Refusée"}
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Indisponibilité dialog */}
        <Dialog open={openIndispo} onOpenChange={setOpenIndispo}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Signaler une indisponibilité
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Date de début *</Label>
                  <Input type="date" value={indispoForm.date_debut} onChange={(e) => setIndispoForm((f) => ({ ...f, date_debut: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Date de fin *</Label>
                  <Input type="date" value={indispoForm.date_fin} onChange={(e) => setIndispoForm((f) => ({ ...f, date_fin: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Motif *</Label>
                <Textarea
                  value={indispoForm.motif}
                  onChange={(e) => setIndispoForm((f) => ({ ...f, motif: e.target.value }))}
                  placeholder="Ex: Congé maladie, rendez-vous médical, vacances..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenIndispo(false)}>Annuler</Button>
              <Button onClick={handleSubmitIndispo} className="gap-1.5">
                <Send className="h-4 w-4" /> Envoyer la demande
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
