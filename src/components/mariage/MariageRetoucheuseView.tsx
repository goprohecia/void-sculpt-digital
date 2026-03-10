import { useState } from "react";
import { motion } from "framer-motion";
import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MOCK_RETOUCHES, MOCK_RETOUCHEUSES } from "@/data/mockMariageData";
import { Scissors, CheckCircle2, Clock, AlertTriangle, PenLine } from "lucide-react";

const CURRENT_RETOUCHEUSE_ID = "ret-1";

export function MariageRetoucheuseView() {
  const retoucheuse = MOCK_RETOUCHEUSES.find(r => r.id === CURRENT_RETOUCHEUSE_ID)!;
  const [retouches, setRetouches] = useState(
    MOCK_RETOUCHES.filter(r => r.retoucheuseId === CURRENT_RETOUCHEUSE_ID)
  );
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleTerminer = (id: string) => {
    setRetouches(prev => prev.map(r => r.id === id ? { ...r, statut: "termine" as const } : r));
    toast.success("Retouche marquée comme terminée — notification envoyée au propriétaire (simulé)");
  };

  const prioriteOrder = { haute: 0, normale: 1, basse: 2 };
  const sorted = [...retouches].sort((a, b) => prioriteOrder[a.priorite] - prioriteOrder[b.priorite]);

  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Scissors className="h-6 w-6 text-primary" />
              Espace Retoucheuse — {retoucheuse.prenom} {retoucheuse.nom}
            </h1>
            <p className="text-muted-foreground text-sm">{retoucheuse.specialite}</p>
          </motion.div>

          <motion.div className="space-y-4" variants={staggerContainer} initial="initial" animate="animate">
            {sorted.map((r) => (
              <motion.div key={r.id} variants={staggerItem}>
                <Card className={`glass-card ${r.statut === "termine" ? "opacity-60" : ""}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {r.statut === "termine" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Scissors className="h-4 w-4 text-primary" />
                        )}
                        {r.marieeNom} — {r.modele}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={r.priorite === "haute" ? "destructive" : r.priorite === "normale" ? "secondary" : "outline"}
                          className="text-[10px]"
                        >
                          {r.priorite === "haute" && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {r.priorite}
                        </Badge>
                        <Badge variant={r.statut === "termine" ? "default" : r.statut === "en_cours" ? "secondary" : "outline"} className="text-[10px]">
                          {r.statut === "termine" ? "Terminé" : r.statut === "en_cours" ? "En cours" : "À faire"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Spécifications techniques</p>
                      <p className="text-sm bg-muted/30 p-3 rounded-lg">{r.specifications}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Délai : {r.delai}</span>
                    </div>
                    {r.notesRetouche && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Notes</p>
                        <p className="text-sm">{r.notesRetouche}</p>
                      </div>
                    )}

                    {/* Saisie notes */}
                    {r.statut !== "termine" && (
                      <div className="space-y-2 pt-2 border-t border-border/20">
                        <div className="flex items-center gap-2">
                          <PenLine className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-medium">Ajouter une note</span>
                        </div>
                        <Textarea
                          value={notes[r.id] || ""}
                          onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })}
                          placeholder="Notes de retouche..."
                          rows={2}
                        />
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleTerminer(r.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Retouche terminée
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
