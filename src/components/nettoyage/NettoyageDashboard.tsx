import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_CONTRATS, MOCK_PLANNING_HEBDO, MOCK_AGENTS, NETTOYAGE_KPI, MOCK_INTERVENTIONS } from "@/data/mockNettoyageData";
import { SectorOnboardingBanner } from "@/components/admin/SectorOnboardingBanner";
import { Sparkles, Euro, CalendarDays, AlertTriangle, Users, FileText } from "lucide-react";

export function NettoyageDashboard() {
  const alertes = [
    ...MOCK_INTERVENTIONS.filter((i) => i.statut === "termine" && !i.rapportSoumis).map((i) => `Rapport manquant : ${i.client} (${new Date(i.date).toLocaleDateString("fr-FR")})`),
    ...MOCK_CONTRATS.filter((c) => c.factureStatut === "impayee").map((c) => `Facture impayée : ${c.client}`),
  ];

  return (
    <div className="space-y-6">
      <SectorOnboardingBanner />

      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" /> Espace Direction
        </h1>
        <p className="text-muted-foreground text-sm">Pilotage de l'activité de nettoyage</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Contrats actifs", value: NETTOYAGE_KPI.contratsActifs, icon: FileText, color: "text-blue-400" },
          { label: "Interventions ce mois", value: NETTOYAGE_KPI.interventionsCeMois, icon: CalendarDays, color: "text-violet-400" },
          { label: "CA récurrent", value: `${(NETTOYAGE_KPI.caRecurrent / 1000).toFixed(0)}k €`, icon: Euro, color: "text-emerald-400" },
          { label: "Alertes", value: alertes.length, icon: AlertTriangle, color: "text-red-400" },
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

      {/* Alertes */}
      {alertes.length > 0 && (
        <Card className="glass-card border-destructive/30">
          <CardHeader><CardTitle className="text-base flex items-center gap-2 text-destructive"><AlertTriangle className="h-4 w-4" /> Alertes</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {alertes.map((a, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-destructive/5 text-sm">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
                <span>{a}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Planning hebdomadaire */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Planning hebdomadaire</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="grid grid-cols-5 gap-3 min-w-[600px]">
            {MOCK_PLANNING_HEBDO.map((jour) => (
              <div key={jour.jour} className="space-y-2">
                <p className="text-sm font-semibold text-center">{jour.jour}</p>
                {jour.interventions.map((int, i) => (
                  <div key={i} className={`p-2 rounded-lg text-xs ${int.couleur}`}>
                    <p className="font-semibold">{int.heure}</p>
                    <p>{int.client}</p>
                    <p className="text-[10px] opacity-75">{int.agent}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contrats récurrents */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Contrats récurrents</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground">
                  <th className="text-left p-3 font-medium">Client</th>
                  <th className="text-left p-3 font-medium">Fréquence</th>
                  <th className="text-left p-3 font-medium">Prochain passage</th>
                  <th className="text-right p-3 font-medium">Mensuel</th>
                  <th className="text-left p-3 font-medium">Facturation</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CONTRATS.map((c) => (
                  <tr key={c.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium">{c.client}</td>
                    <td className="p-3 text-muted-foreground">{c.frequence}</td>
                    <td className="p-3 text-muted-foreground">{new Date(c.prochainPassage).toLocaleDateString("fr-FR")}</td>
                    <td className="p-3 text-right font-semibold">{c.montantMensuel.toLocaleString()} €</td>
                    <td className="p-3">
                      <Badge variant={c.factureStatut === "payee" ? "secondary" : c.factureStatut === "impayee" ? "destructive" : "outline"} className="text-xs">
                        {c.factureStatut === "payee" ? "Payée" : c.factureStatut === "impayee" ? "Impayée" : "En attente"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Agents */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Équipe agents</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {MOCK_AGENTS.map((ag) => (
            <div key={ag.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
              <p className="text-sm font-medium">{ag.nom}</p>
              <p className="text-xs text-muted-foreground">{ag.interventionsJour} interventions/jour · {ag.heuresSemaine}h/semaine</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
