import { useState } from "react";
import { motion } from "framer-motion";
import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MariageStepper } from "./MariageStepper";
import {
  MOCK_DOSSIERS_MARIEE, MOCK_ESSAYAGES, MOCK_CONSEILLERES, MARIAGE_STEPS,
} from "@/data/mockMariageData";
import {
  Heart, User, CalendarDays, Ruler, FileText, Sparkles,
} from "lucide-react";

const CURRENT_CONSEILLERE_ID = "cons-1";

export function MariageConseillerView() {
  const conseillere = MOCK_CONSEILLERES.find(c => c.id === CURRENT_CONSEILLERE_ID)!;
  const mesDossiers = MOCK_DOSSIERS_MARIEE.filter(d => d.conseillereId === CURRENT_CONSEILLERE_ID && d.etape < 8);
  const mesEssayages = MOCK_ESSAYAGES.filter(e => e.conseillereId === CURRENT_CONSEILLERE_ID);
  const [selectedDossier, setSelectedDossier] = useState<string | null>(null);
  const fiche = selectedDossier ? MOCK_DOSSIERS_MARIEE.find(d => d.id === selectedDossier) : null;

  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Espace Conseillère — {conseillere.prenom} {conseillere.nom}
            </h1>
            <p className="text-muted-foreground text-sm">{conseillere.specialite}</p>
          </motion.div>

          <Tabs defaultValue="dossiers" className="space-y-4">
            <TabsList>
              <TabsTrigger value="dossiers">Mes mariées</TabsTrigger>
              <TabsTrigger value="essayages">Planning essayages</TabsTrigger>
            </TabsList>

            <TabsContent value="dossiers">
              <motion.div className="space-y-3" variants={staggerContainer} initial="initial" animate="animate">
                {mesDossiers.map((d) => (
                  <motion.div key={d.id} variants={staggerItem}>
                    <Card
                      className={`cursor-pointer transition-all ${selectedDossier === d.id ? "border-primary ring-1 ring-primary/30" : "hover:border-primary/40"}`}
                      onClick={() => setSelectedDossier(selectedDossier === d.id ? null : d.id)}
                    >
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-pink-400" />
                            <span className="font-medium text-sm">{d.marieePrenom} {d.marieeNom}</span>
                            <span className="font-mono text-[10px] text-muted-foreground">{d.reference}</span>
                          </div>
                          <Badge variant="secondary" className="text-[10px]">{MARIAGE_STEPS[d.etape - 1]}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{d.modeleChoisi}</p>
                        <p className="text-xs text-muted-foreground">Mariage : {d.dateMariage} · Taille {d.taille}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* Fiche détaillée */}
                {fiche && (
                  <motion.div variants={staggerItem}>
                    <Card className="glass-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          Fiche — {fiche.marieePrenom} {fiche.marieeNom}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-muted-foreground flex items-center gap-1"><Ruler className="h-3 w-3" /> Mensurations</p>
                              <div className="grid grid-cols-2 gap-1 mt-1 text-sm">
                                <span>Poitrine : {fiche.mensurations.tour_poitrine}</span>
                                <span>Taille : {fiche.mensurations.tour_taille}</span>
                                <span>Hanches : {fiche.mensurations.tour_hanches}</span>
                                <span>Dos : {fiche.mensurations.longueur_dos}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Modèle</p>
                              <p className="text-sm font-medium">{fiche.modeleChoisi}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-muted-foreground flex items-center gap-1"><FileText className="h-3 w-3" /> Notes de style</p>
                              <p className="text-sm bg-muted/30 p-3 rounded-lg mt-1">{fiche.notesStyle}</p>
                            </div>
                            <MariageStepper currentStep={fiche.etape - 1} compact />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="essayages">
              <motion.div variants={staggerItem}>
                <Card className="glass-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      Mes essayages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {mesEssayages.map((e) => (
                      <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                        <div>
                          <p className="text-sm font-medium">{e.marieeNom}</p>
                          <Badge variant="secondary" className="text-[10px] capitalize">{e.type === "decouverte" ? "Découverte" : e.type === "recuperation" ? "Récupération" : e.type}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{e.date}</p>
                          <p className="text-xs text-muted-foreground">{e.heure}</p>
                        </div>
                      </div>
                    ))}
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
