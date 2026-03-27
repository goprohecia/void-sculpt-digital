import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MOCK_SESSIONS, FORMATEUR_KPI, FORMATEUR_STEPS } from "@/data/mockFormateurData";
import { SectorOnboardingBanner } from "@/components/admin/SectorOnboardingBanner";
import { GraduationCap, Users, Clock, CalendarDays, CheckCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export function FormateurDashboard() {
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    MOCK_SESSIONS.forEach((s) => s.qualiopiChecklist.forEach((q) => { init[q.id] = q.fait; }));
    return init;
  });

  const toggleQualiopi = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
    toast.success("Checklist Qualiopi mise à jour");
  };

  return (
    <div className="space-y-6">
      <SectorOnboardingBanner />

      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" /> Espace Organisme
        </h1>
        <p className="text-muted-foreground text-sm">Pilotage des sessions de formation</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Sessions actives", value: FORMATEUR_KPI.sessionsActives, icon: CalendarDays, color: "text-blue-400" },
          { label: "Stagiaires formés", value: FORMATEUR_KPI.stagiairesFormes, icon: Users, color: "text-violet-400" },
          { label: "Heures dispensées", value: `${FORMATEUR_KPI.heuresDispensees}h`, icon: Clock, color: "text-emerald-400" },
          { label: "Taux complétion", value: `${FORMATEUR_KPI.tauxCompletion}%`, icon: CheckCircle, color: "text-amber-400" },
        ].map((kpi) => (
          <Card key={kpi.label} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sessions actives */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Sessions de formation</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground">
                  <th className="text-left p-3 font-medium">Intitulé</th>
                  <th className="text-left p-3 font-medium">Formateur</th>
                  <th className="text-left p-3 font-medium">Dates</th>
                  <th className="text-center p-3 font-medium">Stagiaires</th>
                  <th className="text-left p-3 font-medium">Étape</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_SESSIONS.map((s) => (
                  <tr key={s.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium">{s.intitule}</td>
                    <td className="p-3 text-muted-foreground">{s.formateur}</td>
                    <td className="p-3 text-muted-foreground">{new Date(s.dateDebut).toLocaleDateString("fr-FR")} — {new Date(s.dateFin).toLocaleDateString("fr-FR")}</td>
                    <td className="p-3 text-center">{s.nbStagiaires}</td>
                    <td className="p-3">
                      <Badge variant={s.statut === "terminee" ? "secondary" : s.statut === "a_venir" ? "outline" : "default"} className="text-xs">
                        {FORMATEUR_STEPS[Math.min(s.step, FORMATEUR_STEPS.length - 1)]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Conventions */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Conventions — Statut signature</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {MOCK_SESSIONS.filter((s) => s.statut !== "terminee").map((s) => (
            <div key={s.id} className="space-y-2">
              <p className="text-sm font-medium">{s.intitule}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {s.stagiaires.map((st) => (
                  <div key={st.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 text-xs">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${st.conventionSignee ? "bg-emerald-500" : "bg-amber-500"}`} />
                    <span className="truncate">{st.nom}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Checklist Qualiopi */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Conformité Qualiopi</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {MOCK_SESSIONS.map((s) => (
            <div key={s.id} className="space-y-2">
              <p className="text-sm font-medium">{s.intitule}</p>
              <div className="space-y-1">
                {s.qualiopiChecklist.map((q) => (
                  <div key={q.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                    <Checkbox
                      checked={checklist[q.id] || false}
                      onCheckedChange={() => toggleQualiopi(q.id)}
                    />
                    <span className="text-sm">{q.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
