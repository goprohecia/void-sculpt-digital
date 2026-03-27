import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_FICHES, MOCK_STOCK_PIECES, REPARATEUR_KPI, REPARATEUR_STEPS } from "@/data/mockReparateurData";
import { SectorOnboardingBanner } from "@/components/admin/SectorOnboardingBanner";
import { Smartphone, Wrench, Clock, Euro, Package, AlertTriangle } from "lucide-react";

export function ReparateurDashboard() {
  const alertes = MOCK_STOCK_PIECES.filter((p) => p.quantite <= p.seuilAlerte);

  return (
    <div className="space-y-6">
      <SectorOnboardingBanner />
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Wrench className="h-6 w-6 text-primary" /> Espace Atelier</h1>
        <p className="text-muted-foreground text-sm">Gestion des réparations, stock et facturation</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "En cours", value: REPARATEUR_KPI.appareilsEnCours, icon: Smartphone, color: "text-blue-400" },
          { label: "Terminées / semaine", value: REPARATEUR_KPI.repTerminesSemaine, icon: Wrench, color: "text-emerald-400" },
          { label: "Délai moyen", value: REPARATEUR_KPI.delaiMoyen, icon: Clock, color: "text-amber-400" },
          { label: "CA en cours", value: `${REPARATEUR_KPI.caEnCours} €`, icon: Euro, color: "text-violet-400" },
        ].map((kpi) => (
          <Card key={kpi.label} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1"><kpi.icon className={`h-4 w-4 ${kpi.color}`} /><span className="text-xs text-muted-foreground">{kpi.label}</span></div>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* File d'attente */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">File d'attente des réparations</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 text-muted-foreground">
                <th className="text-left p-3 font-medium">Appareil</th>
                <th className="text-left p-3 font-medium">Client</th>
                <th className="text-left p-3 font-medium">Technicien</th>
                <th className="text-left p-3 font-medium">Étape</th>
                <th className="text-left p-3 font-medium">Délai</th>
              </tr></thead>
              <tbody>
                {MOCK_FICHES.map((f) => (
                  <tr key={f.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium">{f.marque} {f.modele}</td>
                    <td className="p-3 text-muted-foreground">{f.client}</td>
                    <td className="p-3 text-muted-foreground">{f.technicien}</td>
                    <td className="p-3"><Badge variant={f.step >= 7 ? "secondary" : "default"} className="text-xs">{REPARATEUR_STEPS[Math.min(f.step, REPARATEUR_STEPS.length - 1)]}</Badge></td>
                    <td className="p-3">{f.delaiEstime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stock pièces */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4" /> Stock pièces détachées</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border/50 text-muted-foreground">
              <th className="text-left p-3 font-medium">Référence</th>
              <th className="text-left p-3 font-medium">Pièce</th>
              <th className="text-right p-3 font-medium">Qté</th>
              <th className="text-left p-3 font-medium">Fournisseur</th>
              <th className="text-right p-3 font-medium">Alerte</th>
            </tr></thead>
            <tbody>
              {MOCK_STOCK_PIECES.map((p) => (
                <tr key={p.id} className="border-b border-border/30">
                  <td className="p-3 font-mono text-xs">{p.reference}</td>
                  <td className="p-3">{p.nom}</td>
                  <td className={`p-3 text-right font-medium ${p.quantite <= p.seuilAlerte ? "text-destructive" : ""}`}>{p.quantite}</td>
                  <td className="p-3 text-muted-foreground">{p.fournisseur}</td>
                  <td className="p-3 text-right">{p.quantite <= p.seuilAlerte && <Badge variant="destructive" className="text-xs gap-1"><AlertTriangle className="h-3 w-3" /> Rupture</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Facturation */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Euro className="h-4 w-4" /> Facturation</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border/50 text-muted-foreground">
              <th className="text-left p-3 font-medium">Client</th>
              <th className="text-left p-3 font-medium">Appareil</th>
              <th className="text-right p-3 font-medium">Montant</th>
              <th className="text-right p-3 font-medium">Statut</th>
            </tr></thead>
            <tbody>
              {MOCK_FICHES.filter((f) => f.devisAccepte !== null).map((f) => (
                <tr key={f.id} className="border-b border-border/30">
                  <td className="p-3">{f.client}</td>
                  <td className="p-3 text-muted-foreground">{f.marque} {f.modele}</td>
                  <td className="p-3 text-right font-semibold">{f.montantDevis} €</td>
                  <td className="p-3 text-right">
                    {f.step >= 7 ? <Badge variant="secondary" className="text-xs">Facturé</Badge>
                      : f.devisAccepte ? <Badge variant="default" className="text-xs">Devis accepté</Badge>
                      : <Badge variant="outline" className="text-xs">Refusé</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
