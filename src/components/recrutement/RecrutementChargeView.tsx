import { useState } from "react";
import { motion } from "framer-motion";
import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MOCK_MISSIONS, MOCK_CANDIDATS, MOCK_ENTRETIENS, RECRUTEMENT_STEPS,
} from "@/data/mockRecrutementData";
import {
  Kanban, User, FileText, Star, Clock, CalendarDays, Briefcase,
} from "lucide-react";

export function RecrutementChargeView() {
  const [selectedMission, setSelectedMission] = useState(MOCK_MISSIONS[0].id);
  const [selectedCandidat, setSelectedCandidat] = useState<string | null>(null);

  const mission = MOCK_MISSIONS.find((m) => m.id === selectedMission)!;
  const candidats = MOCK_CANDIDATS.filter((c) => c.missionId === selectedMission);
  const entretiens = MOCK_ENTRETIENS.filter((e) => e.missionId === selectedMission);
  const ficheCandidat = selectedCandidat ? MOCK_CANDIDATS.find((c) => c.id === selectedCandidat) : null;

  // Group candidats by step for kanban
  const kanbanColumns = RECRUTEMENT_STEPS.map((step, i) => ({
    step,
    index: i + 1,
    candidats: candidats.filter((c) => c.etape === i + 1),
  }));

  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Kanban className="h-6 w-6 text-primary" />
              Espace Chargé de Recrutement
            </h1>
            <p className="text-muted-foreground text-sm">Pipeline candidats par mission</p>
          </motion.div>

          {/* Mission selector */}
          <motion.div variants={staggerItem}>
            <Select value={selectedMission} onValueChange={setSelectedMission}>
              <SelectTrigger className="w-full md:w-80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOCK_MISSIONS.filter((m) => m.statut === "active").map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.poste} — {m.clientEntreprise}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          <Tabs defaultValue="kanban" className="space-y-4">
            <TabsList>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="calendrier">Entretiens</TabsTrigger>
            </TabsList>

            {/* Kanban view */}
            <TabsContent value="kanban">
              <motion.div variants={staggerItem}>
                <div className="flex gap-3 overflow-x-auto pb-4">
                  {kanbanColumns.map((col) => (
                    <div key={col.step} className="min-w-[200px] flex-shrink-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`h-2 w-2 rounded-full ${col.candidats.length > 0 ? "bg-primary" : "bg-muted-foreground/30"}`} />
                        <span className="text-xs font-medium">{col.step}</span>
                        <Badge variant="secondary" className="text-[10px] ml-auto">{col.candidats.length}</Badge>
                      </div>
                      <div className="space-y-2">
                        {col.candidats.map((c) => (
                          <Card
                            key={c.id}
                            className={`cursor-pointer transition-all ${selectedCandidat === c.id ? "border-primary ring-1 ring-primary/30" : "hover:border-primary/40"}`}
                            onClick={() => setSelectedCandidat(selectedCandidat === c.id ? null : c.id)}
                          >
                            <CardContent className="p-3 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{c.prenom} {c.nom}</span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-amber-400" />
                                  <span className="text-xs font-medium">{c.scoring}</span>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">{c.posteActuel}</p>
                              <p className="text-xs text-muted-foreground">{c.disponibilite}</p>
                              {c.retourClient && (
                                <Badge variant={c.retourClient === "positif" ? "default" : "destructive"} className="text-[10px]">
                                  Retour {c.retourClient}
                                </Badge>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                        {col.candidats.length === 0 && (
                          <div className="p-3 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
                            Aucun candidat
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fiche candidat detail */}
                {ficheCandidat && (
                  <Card className="glass-card mt-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        {ficheCandidat.prenom} {ficheCandidat.nom}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{ficheCandidat.posteActuel} — {ficheCandidat.entrepriseActuelle}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{ficheCandidat.experience}</p>
                          <p className="text-sm">Prétentions : <span className="font-medium">{ficheCandidat.pretentionsSalariales}</span></p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{ficheCandidat.disponibilite}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-400" />
                            <span className="text-sm font-medium">Score : {ficheCandidat.scoring}/100</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase">Notes d'entretien</p>
                          <p className="text-sm bg-muted/30 p-3 rounded-lg">{ficheCandidat.notesEntretien}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="text-primary underline cursor-pointer">Voir CV (simulé)</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>

            {/* Calendrier entretiens */}
            <TabsContent value="calendrier">
              <motion.div variants={staggerItem}>
                <Card className="glass-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      Entretiens planifiés
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {entretiens.length > 0 ? entretiens.map((e) => (
                      <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                        <div>
                          <p className="text-sm font-medium">{e.candidatNom}</p>
                          <p className="text-xs text-muted-foreground">{e.lieu}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{e.date} à {e.heure}</p>
                          <Badge variant={e.type === "client" ? "default" : "secondary"} className="text-[10px]">
                            {e.type === "client" ? "Chez client" : "Au cabinet"}
                          </Badge>
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm text-muted-foreground text-center py-4">Aucun entretien planifié pour cette mission</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
