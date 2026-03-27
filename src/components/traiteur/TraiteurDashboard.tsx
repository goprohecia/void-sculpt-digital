import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_COMMANDES, MOCK_MATIERES, TRAITEUR_KPI, TRAITEUR_STEPS } from "@/data/mockTraiteurData";
import { SectorOnboardingBanner } from "@/components/admin/SectorOnboardingBanner";
import { UtensilsCrossed, Euro, Users, CalendarDays, Package, AlertTriangle } from "lucide-react";

export function TraiteurDashboard() {
  const alertes = MOCK_MATIERES.filter((m) => m.quantite <= m.seuilAlerte);

  return (
    <div className="space-y-6">
      <SectorOnboardingBanner />
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><UtensilsCrossed className="h-6 w-6 text-primary" /> Espace Direction</h1>
        <p className="text-muted-foreground text-sm">Gestion des commandes, production et stock</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Commandes ce mois", value: TRAITEUR_KPI.commandesCeMois, icon: CalendarDays, color: "text-blue-400" },
          { label: "Couverts totaux", value: TRAITEUR_KPI.couvertsTotaux, icon: Users, color: "text-emerald-400" },
          { label: "CA en cours", value: `${(TRAITEUR_KPI.caEnCours / 1000).toFixed(1)}k €`, icon: Euro, color: "text-violet-400" },
          { label: "En préparation", value: TRAITEUR_KPI.enPreparation, icon: UtensilsCrossed, color: "text-amber-400" },
        ].map((kpi) => (
          <Card key={kpi.label} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1"><kpi.icon className={`h-4 w-4 ${kpi.color}`} /><span className="text-xs text-muted-foreground">{kpi.label}</span></div>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Commandes */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Commandes événementielles</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 text-muted-foreground">
                <th className="text-left p-3 font-medium">Client</th>
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-right p-3 font-medium">Couverts</th>
                <th className="text-left p-3 font-medium">Étape</th>
              </tr></thead>
              <tbody>
                {MOCK_COMMANDES.map((c) => (
                  <tr key={c.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium">{c.client}</td>
                    <td className="p-3 text-muted-foreground">{new Date(c.date).toLocaleDateString("fr-FR")}</td>
                    <td className="p-3 text-muted-foreground">{c.type}</td>
                    <td className="p-3 text-right">{c.nbCouverts}</td>
                    <td className="p-3"><Badge variant={c.step >= 7 ? "secondary" : "default"} className="text-xs">{TRAITEUR_STEPS[Math.min(c.step, TRAITEUR_STEPS.length - 1)]}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Planning production */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Planning production</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {MOCK_COMMANDES.filter((c) => c.step >= 4 && c.step < 7).map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <p className="text-sm font-medium">{c.client} — {c.type}</p>
                <p className="text-xs text-muted-foreground">{new Date(c.date).toLocaleDateString("fr-FR")} · {c.nbCouverts} couverts · {c.lieu}</p>
              </div>
              <Badge variant="outline" className="text-xs">{TRAITEUR_STEPS[c.step]}</Badge>
            </div>
          ))}
          {MOCK_COMMANDES.filter((c) => c.step >= 4 && c.step < 7).length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Aucune commande en production actuellement</p>
          )}
        </CardContent>
      </Card>

      {/* Stock matières premières */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4" /> Stock matières premières</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border/50 text-muted-foreground">
              <th className="text-left p-3 font-medium">Matière</th>
              <th className="text-right p-3 font-medium">Qté</th>
              <th className="text-left p-3 font-medium">Unité</th>
              <th className="text-left p-3 font-medium">Fournisseur</th>
              <th className="text-right p-3 font-medium">Alerte</th>
            </tr></thead>
            <tbody>
              {MOCK_MATIERES.map((m) => (
                <tr key={m.id} className="border-b border-border/30">
                  <td className="p-3">{m.nom}</td>
                  <td className={`p-3 text-right font-medium ${m.quantite <= m.seuilAlerte ? "text-destructive" : ""}`}>{m.quantite}</td>
                  <td className="p-3 text-muted-foreground">{m.unite}</td>
                  <td className="p-3 text-muted-foreground">{m.fournisseur}</td>
                  <td className="p-3 text-right">{m.quantite <= m.seuilAlerte && <Badge variant="destructive" className="text-xs gap-1"><AlertTriangle className="h-3 w-3" /> Bas</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
