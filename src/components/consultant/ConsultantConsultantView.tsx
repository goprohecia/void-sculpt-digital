import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SectorStepper } from "@/components/admin/SectorStepper";
import {
  MOCK_CONSULTANT_MISSIONS, MOCK_CONSULTANT_CR, MOCK_CONSULTANT_REUNIONS,
} from "@/data/mockConsultantData";
import {
  Briefcase, Target, CalendarDays, FileText, PenLine, AlertTriangle, Clock,
} from "lucide-react";
import { toast } from "sonner";

export function ConsultantConsultantView() {
  // Simulate logged-in consultant = Sophie Durand
  const mesMissions = MOCK_CONSULTANT_MISSIONS.filter((m) => m.consultantAssigne === "Sophie Durand" && m.etape >= 2);
  const mesReunions = MOCK_CONSULTANT_REUNIONS.filter((r) => mesMissions.some((m) => m.id === r.missionId));
  const [showCR, setShowCR] = useState(false);
  const [crText, setCrText] = useState("");
  const [selectedMission, setSelectedMission] = useState(mesMissions[0]?.id || "");

  const handleSubmitCR = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Compte-rendu enregistré (mock)");
    setShowCR(false);
    setCrText("");
  };

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" /> Espace Consultant
        </h1>
        <p className="text-muted-foreground text-sm">{mesMissions.length} mission(s) active(s)</p>
      </motion.div>

      {/* Missions actives */}
      <motion.div variants={staggerItem} className="space-y-4">
        {mesMissions.map((m) => (
          <Card key={m.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{m.clientNom}</CardTitle>
                <Button size="sm" variant="outline" className="gap-1" onClick={() => { setSelectedMission(m.id); setShowCR(true); }}>
                  <PenLine className="h-3.5 w-3.5" /> Compte-rendu
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">{m.objet}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <SectorStepper currentStep={m.etape} />

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1"><Target className="h-3 w-3" /> Objectifs</p>
                <ul className="text-sm space-y-1">
                  {m.objectifs.map((o, i) => <li key={i} className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>{o}</li>)}
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1"><FileText className="h-3 w-3" /> Livrables</p>
                <div className="space-y-2">
                  {m.livrables.map((l) => (
                    <div key={l.id} className="flex items-center justify-between p-2 rounded border">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{l.titre}</p>
                        <p className="text-xs text-muted-foreground">{l.deadline}</p>
                      </div>
                      <Badge variant={l.statut === "valide" ? "default" : l.statut === "livre" ? "secondary" : "outline"} className="text-xs capitalize">
                        {l.statut === "en_cours" ? "En cours" : l.statut === "livre" ? "Livré" : "Validé"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Derniers CR */}
              {MOCK_CONSULTANT_CR.filter((cr) => cr.missionId === m.id).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Derniers comptes-rendus</p>
                  {MOCK_CONSULTANT_CR.filter((cr) => cr.missionId === m.id).slice(0, 2).map((cr) => (
                    <div key={cr.id} className="p-2 rounded border mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="text-xs">{cr.semaine}</Badge>
                        <span className="text-xs text-muted-foreground">{cr.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{cr.contenu}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Planning réunions */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Planning réunions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {mesReunions.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-2 rounded border">
                <div>
                  <p className="font-medium text-sm">{r.titre}</p>
                  <p className="text-xs text-muted-foreground">{r.clientNom}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{r.date}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end"><Clock className="h-3 w-3" /> {r.heure} · {r.duree}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog saisie CR */}
      <Dialog open={showCR} onOpenChange={setShowCR}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><PenLine className="h-5 w-5" /> Compte-rendu hebdomadaire</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmitCR} className="space-y-4">
            <p className="text-sm text-muted-foreground">Mission : {mesMissions.find((m) => m.id === selectedMission)?.clientNom}</p>
            <div className="space-y-2">
              <Label>Contenu du compte-rendu</Label>
              <Textarea value={crText} onChange={(e) => setCrText(e.target.value)} placeholder="Résumez les avancées de la semaine, les points d'attention et les prochaines étapes..." rows={5} />
            </div>
            <Button type="submit" className="w-full" disabled={!crText.trim()}>Enregistrer</Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
