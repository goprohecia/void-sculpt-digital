import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MOCK_EVENEMENTS, MOCK_CHEFS_DE_PROJET, EVENEMENTIEL_KPI, EVENEMENTIEL_STEPS } from "@/data/mockEvenementielData";
import { SectorOnboardingBanner } from "@/components/admin/SectorOnboardingBanner";
import { Euro, CalendarDays, TrendingUp, PartyPopper, Users } from "lucide-react";

export function EvenementielDashboard() {
  return (
    <div className="space-y-6">
      <SectorOnboardingBanner />

      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <PartyPopper className="h-6 w-6 text-primary" /> Espace Direction
        </h1>
        <p className="text-muted-foreground text-sm">Pilotage du portefeuille événementiel</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "CA en cours", value: `${(EVENEMENTIEL_KPI.caEnCours / 1000).toFixed(0)}k €`, icon: Euro, color: "text-emerald-400" },
          { label: "Événements ce mois", value: EVENEMENTIEL_KPI.evenementsCeMois, icon: CalendarDays, color: "text-blue-400" },
          { label: "Taux de marge", value: `${EVENEMENTIEL_KPI.tauxMarge}%`, icon: TrendingUp, color: "text-amber-400" },
          { label: "Total événements", value: EVENEMENTIEL_KPI.evenementsTotal, icon: PartyPopper, color: "text-violet-400" },
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

      {/* Portefeuille événements */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Portefeuille événements</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground">
                  <th className="text-left p-3 font-medium">Événement</th>
                  <th className="text-left p-3 font-medium">Client</th>
                  <th className="text-left p-3 font-medium">Chef de projet</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-right p-3 font-medium">Budget</th>
                  <th className="text-left p-3 font-medium">Étape</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_EVENEMENTS.map((evt) => (
                  <tr key={evt.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium">{evt.nom}</td>
                    <td className="p-3 text-muted-foreground">{evt.client}</td>
                    <td className="p-3">{evt.chefDeProjet}</td>
                    <td className="p-3 text-muted-foreground">{new Date(evt.date).toLocaleDateString("fr-FR")}</td>
                    <td className="p-3 text-right font-semibold">{evt.budget.toLocaleString()} €</td>
                    <td className="p-3">
                      <Badge variant={evt.statut === "termine" ? "secondary" : "default"} className="text-xs">
                        {EVENEMENTIEL_STEPS[Math.min(evt.step, EVENEMENTIEL_STEPS.length - 1)]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Équipe chefs de projet */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Charge équipe — Chefs de projet</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {MOCK_CHEFS_DE_PROJET.map((cdp) => (
            <div key={cdp.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{cdp.nom}</span>
                <span className="text-muted-foreground">{cdp.evenementsActifs} événements · {cdp.charge}%</span>
              </div>
              <Progress value={cdp.charge} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
