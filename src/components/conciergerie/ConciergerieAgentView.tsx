import { useState } from "react";
import { motion } from "framer-motion";
import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  MOCK_CONCIERGERIE_INTERVENTIONS,
  type ConciergerieIntervention,
} from "@/data/mockConciergerieData";
import { ClipboardList, MapPin, Clock, AlertTriangle, CheckCircle, SprayCan, DoorOpen, DoorClosed, Wrench } from "lucide-react";
import { toast } from "sonner";

const TYPE_ICONS: Record<string, any> = {
  "ménage": SprayCan,
  "check-in": DoorOpen,
  "check-out": DoorClosed,
  "maintenance": Wrench,
};

const TYPE_COLORS: Record<string, string> = {
  "ménage": "bg-teal-500/20 text-teal-400",
  "check-in": "bg-emerald-500/20 text-emerald-400",
  "check-out": "bg-orange-500/20 text-orange-400",
  "maintenance": "bg-red-500/20 text-red-400",
};

const STATUT_BADGE: Record<string, string> = {
  "à_faire": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "en_cours": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "terminé": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export function ConciergerieAgentView() {
  const [interventions, setInterventions] = useState<ConciergerieIntervention[]>(
    MOCK_CONCIERGERIE_INTERVENTIONS.filter((i) => i.agentId === "conc-agent-1")
  );
  const [signalForm, setSignalForm] = useState<string | null>(null);
  const [signalText, setSignalText] = useState("");

  const toggleChecklist = (intId: string, idx: number) => {
    setInterventions((prev) =>
      prev.map((i) =>
        i.id === intId
          ? { ...i, checklist: i.checklist.map((c, ci) => ci === idx ? { ...c, done: !c.done } : c) }
          : i
      )
    );
  };

  const markDone = (intId: string) => {
    setInterventions((prev) =>
      prev.map((i) => i.id === intId ? { ...i, statut: "terminé" as const } : i)
    );
    toast.success("Intervention terminée — notification envoyée au propriétaire");
  };

  const submitSignal = () => {
    toast.success("Problème signalé avec succès");
    setSignalForm(null);
    setSignalText("");
  };

  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-primary" /> Mes interventions du jour
            </h1>
            <p className="text-muted-foreground text-sm">{interventions.length} intervention{interventions.length > 1 ? "s" : ""} prévue{interventions.length > 1 ? "s" : ""}</p>
          </motion.div>

          {interventions.map((intervention) => {
            const Icon = TYPE_ICONS[intervention.type] || ClipboardList;
            const allDone = intervention.checklist.every((c) => c.done);
            return (
              <motion.div key={intervention.id} variants={staggerItem}>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {intervention.bienNom}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={TYPE_COLORS[intervention.type]}>
                          {intervention.type}
                        </Badge>
                        <Badge variant="outline" className={STATUT_BADGE[intervention.statut]}>
                          {intervention.statut === "terminé" ? "✓ Terminé" : intervention.statut === "en_cours" ? "En cours" : "À faire"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{intervention.adresse}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{intervention.heure}</span>
                    </div>

                    {/* Checklist */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold">Checklist :</p>
                      {intervention.checklist.map((item, idx) => (
                        <label key={idx} className="flex items-center gap-2 text-sm cursor-pointer">
                          <Checkbox
                            checked={item.done}
                            onCheckedChange={() => toggleChecklist(intervention.id, idx)}
                            disabled={intervention.statut === "terminé"}
                          />
                          <span className={item.done ? "line-through text-muted-foreground" : ""}>{item.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      {intervention.statut !== "terminé" && (
                        <Button size="sm" onClick={() => markDone(intervention.id)} disabled={!allDone}>
                          <CheckCircle className="h-3 w-3 mr-1" /> Marquer terminé
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setSignalForm(signalForm === intervention.id ? null : intervention.id)}>
                        <AlertTriangle className="h-3 w-3 mr-1" /> Signaler un problème
                      </Button>
                    </div>

                    {signalForm === intervention.id && (
                      <div className="space-y-2 pt-2 border-t border-border/30">
                        <Textarea
                          placeholder="Décrivez le problème rencontré…"
                          value={signalText}
                          onChange={(e) => setSignalText(e.target.value)}
                          rows={3}
                        />
                        <Button size="sm" onClick={submitSignal} disabled={!signalText.trim()}>
                          Envoyer le signalement
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
