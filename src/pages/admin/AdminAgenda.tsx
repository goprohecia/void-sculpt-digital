import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, User, MapPin, Plus, Trash2 } from "lucide-react";
import { MOCK_TEAM_MEMBERS, MOCK_DISPONIBILITES, type PlageHoraire, type DisponibilitesHebdo } from "@/data/mockData";

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const JOURS_FULL = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const MOIS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const HEURES_AGENDA = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

interface AgendaEvent {
  id: string;
  titre: string;
  date: number;
  heure: string;
  duree: string;
  type: "rdv" | "tache" | "rappel" | "reunion";
  client?: string;
  lieu?: string;
}

const DEMO_EVENTS: AgendaEvent[] = [
  { id: "1", titre: "RDV client Dupont", date: 10, heure: "09:00", duree: "1h", type: "rdv", client: "Pierre Dupont", lieu: "Visio" },
  { id: "2", titre: "Livraison maquette site", date: 10, heure: "14:00", duree: "30min", type: "tache" },
  { id: "3", titre: "Réunion d'équipe", date: 12, heure: "10:00", duree: "1h30", type: "reunion", lieu: "Salle A" },
  { id: "4", titre: "Rappel : relancer devis #042", date: 13, heure: "09:00", duree: "15min", type: "rappel", client: "Marie Martin" },
  { id: "5", titre: "Présentation projet", date: 15, heure: "11:00", duree: "2h", type: "rdv", client: "Altarys SAS", lieu: "Bureau client" },
  { id: "6", titre: "Deadline facturation", date: 18, heure: "18:00", duree: "—", type: "tache" },
  { id: "7", titre: "Call fournisseur", date: 20, heure: "15:30", duree: "45min", type: "rdv", lieu: "Téléphone" },
  { id: "8", titre: "Formation nouveau salarié", date: 22, heure: "09:00", duree: "3h", type: "reunion" },
];

const TYPE_COLORS: Record<string, string> = {
  rdv: "bg-primary/20 text-primary border-primary/30",
  tache: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  rappel: "bg-red-500/20 text-red-400 border-red-500/30",
  reunion: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

function isInRange(dateStr: string, debut: string, fin: string) {
  return dateStr >= debut && dateStr <= fin;
}

function heureInPlage(heure: string, plage: { debut: string; fin: string }) {
  return heure >= plage.debut && heure < plage.fin;
}

export default function AdminAgenda() {
  const [mois] = useState(2);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedPro, setSelectedPro] = useState<string | null>(null);
  const [editHoraires, setEditHoraires] = useState<DisponibilitesHebdo | null>(null);

  const daysInMonth = 31;
  const firstDayOffset = 6;

  const dayEvents = selectedDay ? DEMO_EVENTS.filter((e) => e.date === selectedDay) : [];

  const openProPanel = (empId: string) => {
    const dispo = MOCK_DISPONIBILITES.find(d => d.employeeId === empId);
    setSelectedPro(empId);
    setEditHoraires(dispo ? { ...dispo.horaires } : {});
  };

  const selectedMember = MOCK_TEAM_MEMBERS.find(m => m.id === selectedPro);
  const selectedDispo = MOCK_DISPONIBILITES.find(d => d.employeeId === selectedPro);

  return (
    <AdminLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-primary" /> Agenda
            </h1>
            <p className="text-muted-foreground text-sm">Vue unifiée de vos rendez-vous et disponibilités équipe</p>
          </div>

          <Tabs defaultValue="calendrier">
            <TabsList>
              <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
              <TabsTrigger value="equipe">Disponibilités équipe</TabsTrigger>
            </TabsList>

            {/* ===== CALENDRIER ===== */}
            <TabsContent value="calendrier">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Button variant="ghost" size="sm"><ChevronLeft className="h-4 w-4" /></Button>
                      <CardTitle className="text-base">{MOIS[mois]} 2026</CardTitle>
                      <Button variant="ghost" size="sm"><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1">
                      {JOURS.map((j) => (
                        <div key={j} className="text-center text-xs font-medium text-muted-foreground py-2">{j}</div>
                      ))}
                      {Array.from({ length: firstDayOffset }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const eventsCount = DEMO_EVENTS.filter((e) => e.date === day).length;
                        const isSelected = selectedDay === day;
                        const isToday = day === 9;
                        return (
                          <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`relative h-16 rounded-lg text-sm transition-all border ${
                              isSelected
                                ? "bg-primary/20 border-primary/50 text-primary font-bold"
                                : isToday
                                ? "border-primary/30 bg-primary/5"
                                : "border-transparent hover:bg-muted/30"
                            }`}
                          >
                            <span className="absolute top-1 left-2 text-xs">{day}</span>
                            {eventsCount > 0 && (
                              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                {Array.from({ length: Math.min(eventsCount, 3) }).map((_, j) => (
                                  <span key={j} className="h-1.5 w-1.5 rounded-full bg-primary" />
                                ))}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      {selectedDay ? `${selectedDay} ${MOIS[mois]}` : "Sélectionnez un jour"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!selectedDay && <p className="text-sm text-muted-foreground text-center py-8">Cliquez sur un jour pour voir les événements</p>}
                    {selectedDay && dayEvents.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Aucun événement ce jour</p>}
                    {dayEvents.map((ev) => (
                      <div key={ev.id} className={`p-3 rounded-lg border ${TYPE_COLORS[ev.type]} space-y-1.5`}>
                        <p className="text-sm font-medium">{ev.titre}</p>
                        <div className="flex flex-wrap gap-2 text-[11px]">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {ev.heure} · {ev.duree}</span>
                          {ev.client && <span className="flex items-center gap-1"><User className="h-3 w-3" /> {ev.client}</span>}
                          {ev.lieu && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {ev.lieu}</span>}
                        </div>
                        <Badge variant="outline" className="text-[10px]">{ev.type}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ===== ÉQUIPE ===== */}
            <TabsContent value="equipe">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Vue semaine — disponibilités par membre</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="min-w-[700px]">
                      {/* Header */}
                      <div className="grid grid-cols-[180px_repeat(7,1fr)] gap-1 mb-2">
                        <div />
                        {JOURS.map(j => (
                          <div key={j} className="text-center text-xs font-medium text-muted-foreground py-1">{j}</div>
                        ))}
                      </div>

                      {/* Rows per member */}
                      {MOCK_TEAM_MEMBERS.map(member => {
                        const dispo = MOCK_DISPONIBILITES.find(d => d.employeeId === member.id);
                        return (
                          <div key={member.id} className="grid grid-cols-[180px_repeat(7,1fr)] gap-1 mb-1">
                            <button
                              onClick={() => openProPanel(member.id)}
                              className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted/30 transition-colors text-left"
                            >
                              <span
                                className="h-3 w-3 rounded-full shrink-0"
                                style={{ backgroundColor: member.couleur }}
                              />
                              <span className="text-xs font-medium truncate">{member.prenom} {member.nom}</span>
                            </button>
                            {Array.from({ length: 7 }).map((_, jourIdx) => {
                              const plages = dispo?.horaires[jourIdx] || [];
                              const dateStr = `2026-03-${String(9 + jourIdx).padStart(2, "0")}`;
                              const enConge = dispo?.conges.some(c => isInRange(dateStr, c.debut, c.fin));
                              const exception = dispo?.exceptions.find(e => e.date === dateStr);

                              if (enConge) {
                                return (
                                  <div key={jourIdx} className="rounded-md bg-destructive/10 border border-destructive/20 flex items-center justify-center p-1">
                                    <span className="text-[10px] text-destructive line-through">Congé</span>
                                  </div>
                                );
                              }

                              if (exception) {
                                return (
                                  <div
                                    key={jourIdx}
                                    className={cn(
                                      "rounded-md border p-1 flex items-center justify-center",
                                      exception.disponible
                                        ? "bg-amber-500/10 border-amber-500/20"
                                        : "bg-destructive/10 border-destructive/20"
                                    )}
                                  >
                                    <span className="text-[10px]">
                                      {exception.disponible && exception.plages
                                        ? exception.plages.map(p => `${p.debut}–${p.fin}`).join(", ")
                                        : "Indispo"}
                                    </span>
                                  </div>
                                );
                              }

                              if (plages.length === 0) {
                                return (
                                  <div key={jourIdx} className="rounded-md bg-muted/20 border border-border/30 flex items-center justify-center p-1">
                                    <span className="text-[10px] text-muted-foreground">—</span>
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={jourIdx}
                                  className="rounded-md border p-1 flex flex-col items-center justify-center gap-0.5"
                                  style={{ backgroundColor: `${member.couleur}15`, borderColor: `${member.couleur}30` }}
                                >
                                  {plages.map((p, pi) => (
                                    <span key={pi} className="text-[10px] font-mono" style={{ color: member.couleur }}>
                                      {p.debut}–{p.fin}
                                    </span>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
                    {MOCK_TEAM_MEMBERS.map(m => (
                      <span key={m.id} className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.couleur }} />
                        {m.prenom} {m.nom}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sheet détail pro */}
        <Sheet open={!!selectedPro} onOpenChange={() => setSelectedPro(null)}>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                {selectedMember && (
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: selectedMember.couleur }} />
                )}
                {selectedMember ? `${selectedMember.prenom} ${selectedMember.nom}` : ""}
              </SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <h3 className="text-sm font-semibold">Horaires habituels</h3>
              {editHoraires && JOURS_FULL.map((label, jour) => (
                <div key={jour} className="space-y-1">
                  <span className="text-xs font-medium">{label}</span>
                  {(editHoraires[jour] || []).length === 0 && <p className="text-xs text-muted-foreground">Fermé</p>}
                  {(editHoraires[jour] || []).map((p, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input type="time" value={p.debut} readOnly className="w-24 h-7 text-xs" />
                      <span className="text-xs">→</span>
                      <Input type="time" value={p.fin} readOnly className="w-24 h-7 text-xs" />
                    </div>
                  ))}
                </div>
              ))}

              {selectedDispo && selectedDispo.conges.length > 0 && (
                <>
                  <h3 className="text-sm font-semibold pt-2">Congés</h3>
                  {selectedDispo.conges.map(c => (
                    <Badge key={c.id} variant="destructive" className="text-xs">
                      {c.debut} → {c.fin}
                    </Badge>
                  ))}
                </>
              )}

              {selectedDispo && selectedDispo.exceptions.length > 0 && (
                <>
                  <h3 className="text-sm font-semibold pt-2">Exceptions</h3>
                  {selectedDispo.exceptions.map(e => (
                    <Badge key={e.id} variant={e.disponible ? "default" : "destructive"} className="text-xs">
                      {e.date} — {e.disponible ? "Dispo" : "Indispo"}
                    </Badge>
                  ))}
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </AdminPageTransition>
    </AdminLayout>
  );
}
