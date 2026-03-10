import { useState } from "react";
import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MOCK_CANDIDATS, MOCK_MISSIONS, RECRUTEMENT_STEPS } from "@/data/mockRecrutementData";
import { Building2, Users, ThumbsUp, ThumbsDown, User, Briefcase, Clock } from "lucide-react";

// Client entreprise view — sees only candidates at step >= 4 (Candidat présenté)
const CLIENT_ENTREPRISE_ID = "mis-1"; // Simulates TechVision

export function RecrutementClientView() {
  const mission = MOCK_MISSIONS.find((m) => m.id === CLIENT_ENTREPRISE_ID)!;
  const [candidatsState, setCandidatsState] = useState(
    MOCK_CANDIDATS.filter((c) => c.missionId === CLIENT_ENTREPRISE_ID && c.etape >= 4)
  );

  const handleRetour = (candidatId: string, retour: "positif" | "negatif") => {
    setCandidatsState((prev) =>
      prev.map((c) => (c.id === candidatId ? { ...c, retourClient: retour } : c))
    );
    toast.success(`Retour ${retour} enregistré`);
  };

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              Espace Client Entreprise
            </h1>
            <p className="text-muted-foreground text-sm">Suivi des candidats présentés pour votre mission</p>
          </motion.div>

          {/* Mission info */}
          <motion.div variants={staggerItem}>
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{mission.poste}</p>
                    <p className="text-xs text-muted-foreground">{mission.salaireFourchette} · {mission.typeContrat}</p>
                  </div>
                  <Badge variant="outline">{mission.reference}</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Candidats présentés */}
          <motion.div variants={staggerItem}>
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Candidats présentés ({candidatsState.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidatsState.map((c) => (
                  <div key={c.id} className="p-4 rounded-lg border border-border/30 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{c.prenom} {c.nom}</p>
                          <p className="text-xs text-muted-foreground">{c.posteActuel} — {c.entrepriseActuelle}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{RECRUTEMENT_STEPS[c.etape - 1]}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{c.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{c.disponibilite}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Prétentions : {c.pretentionsSalariales}</p>

                    {/* Retour buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-border/20">
                      {c.retourClient ? (
                        <Badge variant={c.retourClient === "positif" ? "default" : "destructive"}>
                          Retour {c.retourClient}
                        </Badge>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" className="gap-1 text-emerald-400 border-emerald-400/30 hover:bg-emerald-500/10" onClick={() => handleRetour(c.id, "positif")}>
                            <ThumbsUp className="h-3.5 w-3.5" /> Retour positif
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1 text-red-400 border-red-400/30 hover:bg-red-500/10" onClick={() => handleRetour(c.id, "negatif")}>
                            <ThumbsDown className="h-3.5 w-3.5" /> Retour négatif
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Next steps info */}
          <motion.div variants={staggerItem}>
            <Card className="glass-card border-primary/20">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Note :</strong> Vous avez uniquement accès aux candidats présentés. Le sourcing interne et les entretiens cabinet restent confidentiels.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </ClientLayout>
  );
}
