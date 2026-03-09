import { useState } from "react";
import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays, Plus, Trash2, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import {
  MOCK_DISPONIBILITES,
  type PlageHoraire,
  type DisponibilitesHebdo,
  type ExceptionDispo,
  type Conge,
} from "@/data/mockData";

const JOURS_LABELS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const currentDispo = MOCK_DISPONIBILITES[0]; // simule le pro connecté

export default function EmployeeCalendrier() {
  const [horaires, setHoraires] = useState<DisponibilitesHebdo>({ ...currentDispo.horaires });
  const [exceptions, setExceptions] = useState<ExceptionDispo[]>([...currentDispo.exceptions]);
  const [conges, setConges] = useState<Conge[]>([...currentDispo.conges]);

  // -- Horaires --
  const addPlage = (jour: number) => {
    setHoraires(prev => ({
      ...prev,
      [jour]: [...(prev[jour] || []), { debut: "09:00", fin: "12:00" }],
    }));
  };

  const removePlage = (jour: number, idx: number) => {
    setHoraires(prev => ({
      ...prev,
      [jour]: (prev[jour] || []).filter((_, i) => i !== idx),
    }));
  };

  const updatePlage = (jour: number, idx: number, field: "debut" | "fin", val: string) => {
    setHoraires(prev => ({
      ...prev,
      [jour]: (prev[jour] || []).map((p, i) => (i === idx ? { ...p, [field]: val } : p)),
    }));
  };

  // -- Exceptions --
  const [excDate, setExcDate] = useState<Date | undefined>();
  const [excDispo, setExcDispo] = useState(false);
  const [excDebut, setExcDebut] = useState("09:00");
  const [excFin, setExcFin] = useState("18:00");

  const addException = () => {
    if (!excDate) return;
    const dateStr = format(excDate, "yyyy-MM-dd");
    if (exceptions.some(e => e.date === dateStr)) {
      toast({ title: "Exception déjà existante", description: "Une exception existe déjà pour ce jour.", variant: "destructive" });
      return;
    }
    setExceptions(prev => [
      ...prev,
      {
        id: `exc-${Date.now()}`,
        date: dateStr,
        disponible: excDispo,
        plages: excDispo ? [{ debut: excDebut, fin: excFin }] : undefined,
      },
    ]);
    setExcDate(undefined);
  };

  // -- Congés --
  const [congeDebut, setCongeDebut] = useState<Date | undefined>();
  const [congeFin, setCongeFin] = useState<Date | undefined>();

  const addConge = () => {
    if (!congeDebut || !congeFin || congeFin <= congeDebut) return;
    setConges(prev => [
      ...prev,
      { id: `cong-${Date.now()}`, debut: format(congeDebut, "yyyy-MM-dd"), fin: format(congeFin, "yyyy-MM-dd") },
    ]);
    setCongeDebut(undefined);
    setCongeFin(undefined);
    toast({ title: "Congé ajouté" });
  };

  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-primary" />
              Mes disponibilités
            </h1>
            <p className="text-muted-foreground text-sm">Gérez vos horaires, exceptions et congés</p>
          </div>

          <Tabs defaultValue="horaires">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="horaires">Horaires habituels</TabsTrigger>
              <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
              <TabsTrigger value="conges">Congés</TabsTrigger>
            </TabsList>

            {/* ===== HORAIRES ===== */}
            <TabsContent value="horaires">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Plages horaires récurrentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {JOURS_LABELS.map((label, jour) => (
                    <div key={jour} className="flex flex-col gap-2 p-3 rounded-lg border bg-muted/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium w-24">{label}</span>
                        <Button variant="ghost" size="sm" onClick={() => addPlage(jour)}>
                          <Plus className="h-3 w-3 mr-1" /> Ajouter
                        </Button>
                      </div>
                      {(horaires[jour] || []).length === 0 && (
                        <p className="text-xs text-muted-foreground ml-1">Fermé</p>
                      )}
                      {(horaires[jour] || []).map((plage, idx) => (
                        <div key={idx} className="flex items-center gap-2 ml-1">
                          <Input
                            type="time"
                            value={plage.debut}
                            onChange={e => updatePlage(jour, idx, "debut", e.target.value)}
                            className="w-28 h-8 text-xs"
                          />
                          <span className="text-xs text-muted-foreground">→</span>
                          <Input
                            type="time"
                            value={plage.fin}
                            onChange={e => updatePlage(jour, idx, "fin", e.target.value)}
                            className="w-28 h-8 text-xs"
                          />
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removePlage(jour, idx)}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ===== EXCEPTIONS ===== */}
            <TabsContent value="exceptions">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Exceptions ponctuelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-end gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-44 justify-start text-left text-sm", !excDate && "text-muted-foreground")}>
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {excDate ? format(excDate, "dd MMM yyyy", { locale: fr }) : "Choisir"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={excDate} onSelect={setExcDate} className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-muted-foreground">Disponible</label>
                      <Switch checked={excDispo} onCheckedChange={setExcDispo} />
                    </div>
                    {excDispo && (
                      <>
                        <Input type="time" value={excDebut} onChange={e => setExcDebut(e.target.value)} className="w-28 h-9 text-sm" />
                        <span className="text-xs text-muted-foreground">→</span>
                        <Input type="time" value={excFin} onChange={e => setExcFin(e.target.value)} className="w-28 h-9 text-sm" />
                      </>
                    )}
                    <Button size="sm" onClick={addException} disabled={!excDate}>
                      <Plus className="h-3 w-3 mr-1" /> Ajouter
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {exceptions.map(exc => (
                      <Badge
                        key={exc.id}
                        variant={exc.disponible ? "default" : "destructive"}
                        className="gap-1 text-xs py-1"
                      >
                        {format(new Date(exc.date), "dd MMM", { locale: fr })} — {exc.disponible ? "Disponible" : "Indisponible"}
                        {exc.plages && exc.plages.length > 0 && ` (${exc.plages[0].debut}–${exc.plages[0].fin})`}
                        <button onClick={() => setExceptions(prev => prev.filter(e => e.id !== exc.id))} className="ml-1 hover:text-foreground">
                          ×
                        </button>
                      </Badge>
                    ))}
                    {exceptions.length === 0 && <p className="text-sm text-muted-foreground">Aucune exception</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ===== CONGÉS ===== */}
            <TabsContent value="conges">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Périodes de congés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-end gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Début</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-44 justify-start text-left text-sm", !congeDebut && "text-muted-foreground")}>
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {congeDebut ? format(congeDebut, "dd MMM yyyy", { locale: fr }) : "Début"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={congeDebut} onSelect={setCongeDebut} className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Fin</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-44 justify-start text-left text-sm", !congeFin && "text-muted-foreground")}>
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {congeFin ? format(congeFin, "dd MMM yyyy", { locale: fr }) : "Fin"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={congeFin} onSelect={setCongeFin} className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Button size="sm" onClick={addConge} disabled={!congeDebut || !congeFin}>
                      <Plus className="h-3 w-3 mr-1" /> Ajouter
                    </Button>
                  </div>

                  <div className="space-y-2 pt-2">
                    {conges.map(c => (
                      <div key={c.id} className="flex items-center justify-between p-2 rounded-lg border bg-muted/20">
                        <span className="text-sm">
                          {format(new Date(c.debut), "dd MMM yyyy", { locale: fr })} → {format(new Date(c.fin), "dd MMM yyyy", { locale: fr })}
                        </span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setConges(prev => prev.filter(x => x.id !== c.id))}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    {conges.length === 0 && <p className="text-sm text-muted-foreground">Aucun congé planifié</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
