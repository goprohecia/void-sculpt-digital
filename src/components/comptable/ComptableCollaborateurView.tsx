import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComptableStepper } from "./ComptableStepper";
import { toast } from "sonner";
import {
  MOCK_MISSIONS, MOCK_DECLARATIONS, MOCK_COLLABORATEURS_COMPTABLES,
  MOCK_TACHES_COMPTABLES, COMPTABLE_STEPS,
} from "@/data/mockComptableData";
import {
  Calculator, Briefcase, CalendarDays, CheckCircle2,
  AlertTriangle, ListTodo, FileText, Clock,
} from "lucide-react";

const CURRENT_COLLAB_ID = "cc-1";

export function ComptableCollaborateurView() {
  const collab = MOCK_COLLABORATEURS_COMPTABLES.find(c => c.id === CURRENT_COLLAB_ID)!;
  const mesMissions = MOCK_MISSIONS.filter(m => m.collaborateurId === CURRENT_COLLAB_ID);
  const mesDeclarations = MOCK_DECLARATIONS.filter(d => mesMissions.some(m => m.id === d.missionId));
  const [taches, setTaches] = useState(
    MOCK_TACHES_COMPTABLES.filter(t => mesMissions.some(m => m.id === t.missionId))
  );
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const missionDetail = selectedMission ? MOCK_MISSIONS.find(m => m.id === selectedMission) : null;
  const [piecesChecked, setPiecesChecked] = useState<Record<string, boolean>>({});

  const handleTacheDone = (id: string) => {
    setTaches(prev => prev.map(t => t.id === id ? { ...t, statut: "fait" as const } : t));
    toast.success("Tâche marquée comme faite");
  };

  const togglePiece = (missionId: string, piece: string) => {
    const key = `${missionId}-${piece}`;
    setPiecesChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          Espace Collaborateur — {collab.prenom} {collab.nom}
        </h1>
        <p className="text-muted-foreground text-sm">{collab.specialite}</p>
      </motion.div>

      <Tabs defaultValue="dossiers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dossiers">Mes dossiers</TabsTrigger>
          <TabsTrigger value="echeancier">Échéancier fiscal</TabsTrigger>
          <TabsTrigger value="taches">Tâches</TabsTrigger>
        </TabsList>

        <TabsContent value="dossiers">
          <motion.div className="space-y-3" variants={staggerContainer} initial="initial" animate="animate">
            {mesMissions.map((m) => (
              <motion.div key={m.id} variants={staggerItem}>
                <Card
                  className={`cursor-pointer transition-all ${selectedMission === m.id ? "border-primary ring-1 ring-primary/30" : "hover:border-primary/40"}`}
                  onClick={() => setSelectedMission(selectedMission === m.id ? null : m.id)}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{m.entrepriseNom}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{m.reference}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{COMPTABLE_STEPS[m.etape - 1]}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{m.typeMission} · {m.formeJuridique}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {m.echeanceType} : {m.prochaineEcheanceFiscale}</span>
                      {m.piecesManquantes.length > 0 && (
                        <span className="text-destructive flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> {m.piecesManquantes.length} pièce(s) manquante(s)
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Détail mission */}
            {missionDetail && (
              <motion.div variants={staggerItem}>
                <Card className="glass-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{missionDetail.entrepriseNom} — Détail</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ComptableStepper currentStep={missionDetail.etape - 1} compact />

                    {/* Pièces reçues */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><FileText className="h-3 w-3" /> Pièces reçues</p>
                      <div className="space-y-1">
                        {missionDetail.piecesRecues.map((p) => {
                          const key = `${missionDetail.id}-${p}`;
                          return (
                            <div key={p} className="flex items-center gap-2 p-2 rounded bg-muted/20">
                              <Checkbox checked={piecesChecked[key] || false} onCheckedChange={() => togglePiece(missionDetail.id, p)} />
                              <span className="text-sm">{p}</span>
                              <Badge variant="secondary" className="text-[10px] ml-auto">Reçu</Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pièces manquantes */}
                    {missionDetail.piecesManquantes.length > 0 && (
                      <div>
                        <p className="text-xs text-destructive mb-2 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Pièces manquantes</p>
                        <div className="space-y-1">
                          {missionDetail.piecesManquantes.map((p) => (
                            <div key={p} className="flex items-center gap-2 p-2 rounded bg-destructive/5">
                              <span className="text-sm">{p}</span>
                              <Badge variant="destructive" className="text-[10px] ml-auto">Manquant</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tâches */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><ListTodo className="h-3 w-3" /> Tâches</p>
                      {taches.filter(t => t.missionId === missionDetail.id && t.statut !== "fait").map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-2 rounded bg-muted/20 mb-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={t.priorite === "haute" ? "destructive" : "outline"} className="text-[10px]">{t.priorite}</Badge>
                            <span className="text-sm">{t.titre}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground">{t.echeance}</span>
                            <Button size="sm" variant="ghost" className="h-6 px-2" onClick={(e) => { e.stopPropagation(); handleTacheDone(t.id); }}>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="echeancier">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                Échéancier fiscal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mesDeclarations.sort((a, b) => a.echeance.localeCompare(b.echeance)).map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <p className="text-sm font-medium">{d.entrepriseNom}</p>
                    <p className="text-xs text-muted-foreground">{d.type} · {d.periodicite}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{d.echeance}</p>
                    <Badge
                      variant={d.statut === "envoyee" ? "default" : d.statut === "validee" ? "secondary" : d.statut === "preparee" ? "outline" : "destructive"}
                      className="text-[10px] mt-1"
                    >
                      {d.statut === "envoyee" ? "Envoyée" : d.statut === "validee" ? "Validée" : d.statut === "preparee" ? "Préparée" : "À préparer"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taches">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-primary" />
                Toutes mes tâches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {taches.filter(t => t.statut !== "fait").sort((a, b) => {
                const prio = { haute: 0, normale: 1, basse: 2 };
                return prio[a.priorite] - prio[b.priorite];
              }).map((t) => {
                const mission = MOCK_MISSIONS.find(m => m.id === t.missionId);
                return (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div>
                      <p className="text-sm font-medium">{t.titre}</p>
                      <p className="text-xs text-muted-foreground">{mission?.entrepriseNom} · {mission?.reference}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={t.priorite === "haute" ? "destructive" : "outline"} className="text-[10px]">{t.priorite}</Badge>
                      <span className="text-[10px] text-muted-foreground">{t.echeance}</span>
                      <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => handleTacheDone(t.id)}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
