import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, User, MapPin } from "lucide-react";

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MOIS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

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

export default function AdminAgenda() {
  const [mois] = useState(2); // Mars (0-indexed)
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysInMonth = 31;
  const firstDayOffset = 6; // Mars 2026 commence un dimanche → offset 6

  const dayEvents = selectedDay ? DEMO_EVENTS.filter((e) => e.date === selectedDay) : [];

  return (
    <AdminLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-primary" /> Agenda
            </h1>
            <p className="text-muted-foreground text-sm">Vue unifiée de vos rendez-vous, tâches et rappels</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar grid */}
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
                    const isToday = day === 8;
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

            {/* Day detail */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  {selectedDay ? `${selectedDay} ${MOIS[mois]}` : "Sélectionnez un jour"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!selectedDay && (
                  <p className="text-sm text-muted-foreground text-center py-8">Cliquez sur un jour pour voir les événements</p>
                )}
                {selectedDay && dayEvents.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">Aucun événement ce jour</p>
                )}
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
        </div>
      </AdminPageTransition>
    </AdminLayout>
  );
}
