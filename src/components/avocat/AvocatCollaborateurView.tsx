import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvocatStepper } from "./AvocatStepper";
import { toast } from "sonner";
import {
  MOCK_AFFAIRES, MOCK_AUDIENCES, MOCK_COLLABORATEURS, MOCK_TACHES,
  AVOCAT_STEPS,
} from "@/data/mockAvocatData";
import {
  Scale, Briefcase, CalendarDays, CheckCircle2, Clock,
  AlertTriangle, ListTodo, User,
} from "lucide-react";

const CURRENT_AVOCAT_ID = "av-1";

export function AvocatCollaborateurView() {
  const avocat = MOCK_COLLABORATEURS.find(c => c.id === CURRENT_AVOCAT_ID)!;
  const mesAffaires = MOCK_AFFAIRES.filter(a => a.avocatId === CURRENT_AVOCAT_ID && a.etape < 8);
  const mesAudiences = MOCK_AUDIENCES.filter(a => a.avocatId === CURRENT_AVOCAT_ID);
  const [taches, setTaches] = useState(
    MOCK_TACHES.filter(t => mesAffaires.some(a => a.id === t.affaireId))
  );
  const [selectedAffaire, setSelectedAffaire] = useState<string | null>(null);
  const affaireDetail = selectedAffaire ? MOCK_AFFAIRES.find(a => a.id === selectedAffaire) : null;

  const handleTacheDone = (id: string) => {
    setTaches(prev => prev.map(t => t.id === id ? { ...t, statut: "fait" as const } : t));
    toast.success("Tâche marquée comme faite");
  };

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          Espace Avocat — {avocat.prenom} {avocat.nom}
        </h1>
        <p className="text-muted-foreground text-sm">{avocat.specialite} · Barreau de {avocat.barreau}</p>
      </motion.div>

      <Tabs defaultValue="affaires" className="space-y-4">
        <TabsList>
          <TabsTrigger value="affaires">Mes affaires</TabsTrigger>
          <TabsTrigger value="audiences">Audiences</TabsTrigger>
          <TabsTrigger value="taches">Tâches</TabsTrigger>
        </TabsList>

        <TabsContent value="affaires">
          <motion.div className="space-y-3" variants={staggerContainer} initial="initial" animate="animate">
            {mesAffaires.map((a) => (
              <motion.div key={a.id} variants={staggerItem}>
                <Card
                  className={`cursor-pointer transition-all ${selectedAffaire === a.id ? "border-primary ring-1 ring-primary/30" : "hover:border-primary/40"}`}
                  onClick={() => setSelectedAffaire(selectedAffaire === a.id ? null : a.id)}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{a.clientPrenom} {a.clientNom}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{a.reference}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{AVOCAT_STEPS[a.etape - 1]}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{a.typeLitige}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Échéance : {a.prochaineEcheance}</span>
                      {a.prochaineAudience && <span className="text-primary">📅 Audience : {a.prochaineAudience}</span>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Détail affaire */}
            {affaireDetail && (
              <motion.div variants={staggerItem}>
                <Card className="glass-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      {affaireDetail.clientPrenom} {affaireDetail.clientNom} — {affaireDetail.typeLitige}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm bg-muted/30 p-3 rounded-lg">{affaireDetail.description}</p>
                    <AvocatStepper currentStep={affaireDetail.etape - 1} compact />

                    {/* Tâches de l'affaire */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><ListTodo className="h-3 w-3" /> Tâches en cours</p>
                      <div className="space-y-1">
                        {taches.filter(t => t.affaireId === affaireDetail.id && t.statut !== "fait").map((t) => (
                          <div key={t.id} className="flex items-center justify-between p-2 rounded bg-muted/20">
                            <div className="flex items-center gap-2">
                              <Badge variant={t.priorite === "haute" ? "destructive" : "outline"} className="text-[10px]">
                                {t.priorite === "haute" && <AlertTriangle className="h-3 w-3 mr-1" />}
                                {t.priorite}
                              </Badge>
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
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="audiences">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                Agenda audiences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mesAudiences.map((aud) => (
                <div key={aud.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <p className="text-sm font-medium">{aud.clientNom}</p>
                    <p className="text-xs text-muted-foreground">{aud.juridiction}</p>
                    <Badge variant="secondary" className="text-[10px] mt-1">{aud.type}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{aud.date}</p>
                    <p className="text-xs text-muted-foreground">{aud.heure}</p>
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
                const affaire = MOCK_AFFAIRES.find(a => a.id === t.affaireId);
                return (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div>
                      <p className="text-sm font-medium">{t.titre}</p>
                      <p className="text-xs text-muted-foreground">{affaire?.clientPrenom} {affaire?.clientNom} · {affaire?.reference}</p>
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
              {taches.filter(t => t.statut === "fait").length > 0 && (
                <div className="pt-3 border-t border-border/20">
                  <p className="text-xs text-muted-foreground mb-2">Terminées</p>
                  {taches.filter(t => t.statut === "fait").map((t) => (
                    <div key={t.id} className="flex items-center gap-2 p-2 rounded opacity-50">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-sm line-through">{t.titre}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
