import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_SEANCES, MOCK_PHOTOGRAPHES, PHOTOGRAPHE_KPI, PHOTOGRAPHE_STEPS } from "@/data/mockPhotographeData";
import { SectorOnboardingBanner } from "@/components/admin/SectorOnboardingBanner";
import { Camera, Euro, Clock, CalendarDays, ImageIcon } from "lucide-react";

export function PhotographeDashboard() {
  return (
    <div className="space-y-6">
      <SectorOnboardingBanner />
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Camera className="h-6 w-6 text-primary" /> Espace Studio</h1>
        <p className="text-muted-foreground text-sm">Pilotage des séances et livraisons</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Séances ce mois", value: PHOTOGRAPHE_KPI.seancesCeMois, icon: CalendarDays, color: "text-blue-400" },
          { label: "En attente livraison", value: PHOTOGRAPHE_KPI.enAttentelivraison, icon: ImageIcon, color: "text-amber-400" },
          { label: "Délai moyen", value: `${PHOTOGRAPHE_KPI.delaiMoyenJours}j`, icon: Clock, color: "text-violet-400" },
          { label: "CA en cours", value: `${(PHOTOGRAPHE_KPI.caEnCours / 1000).toFixed(1)}k €`, icon: Euro, color: "text-emerald-400" },
        ].map((kpi) => (
          <Card key={kpi.label} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1"><kpi.icon className={`h-4 w-4 ${kpi.color}`} /><span className="text-xs text-muted-foreground">{kpi.label}</span></div>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Planning séances */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Planning séances</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 text-muted-foreground">
                <th className="text-left p-3 font-medium">Client</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Lieu</th>
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-left p-3 font-medium">Durée</th>
                <th className="text-left p-3 font-medium">Étape</th>
              </tr></thead>
              <tbody>
                {MOCK_SEANCES.map((s) => (
                  <tr key={s.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium">{s.client}</td>
                    <td className="p-3 text-muted-foreground">{s.type}</td>
                    <td className="p-3 text-muted-foreground">{s.lieu}</td>
                    <td className="p-3 text-muted-foreground">{new Date(s.date).toLocaleDateString("fr-FR")}</td>
                    <td className="p-3">{s.duree}</td>
                    <td className="p-3"><Badge variant={s.statut === "terminee" ? "secondary" : "default"} className="text-xs">{PHOTOGRAPHE_STEPS[Math.min(s.step, PHOTOGRAPHE_STEPS.length - 1)]}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Suivi livraisons */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Suivi livraisons</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {MOCK_SEANCES.filter((s) => s.step >= 2 && s.step < 6).map((s) => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div><p className="text-sm font-medium">{s.client} — {s.type}</p><p className="text-xs text-muted-foreground">Séance le {new Date(s.date).toLocaleDateString("fr-FR")} · {s.nbRetouchees}/{s.nbPhotos} retouchées</p></div>
              <Badge variant="outline" className="text-xs">{PHOTOGRAPHE_STEPS[s.step]}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Facturation */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Euro className="h-4 w-4" /> Facturation</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border/50 text-muted-foreground">
              <th className="text-left p-3 font-medium">Séance</th>
              <th className="text-right p-3 font-medium">Acompte</th>
              <th className="text-right p-3 font-medium">Total</th>
              <th className="text-right p-3 font-medium">Solde</th>
            </tr></thead>
            <tbody>
              {MOCK_SEANCES.map((s) => (
                <tr key={s.id} className="border-b border-border/30">
                  <td className="p-3">{s.client}</td>
                  <td className="p-3 text-right text-muted-foreground">{s.acompte.toLocaleString()} €</td>
                  <td className="p-3 text-right font-semibold">{s.total.toLocaleString()} €</td>
                  <td className="p-3 text-right">{s.soldePaye ? <Badge variant="secondary" className="text-xs">Réglé</Badge> : <span className="font-medium">{(s.total - s.acompte).toLocaleString()} €</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
