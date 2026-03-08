import { SuperAdminLayout } from "@/components/admin/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MONTHLY_DATA = [
  { mois: "Oct 2025", inscrits: 5, churn: 1, mrr: 10200 },
  { mois: "Nov 2025", inscrits: 7, churn: 0, mrr: 11450 },
  { mois: "Déc 2025", inscrits: 4, churn: 2, mrr: 11850 },
  { mois: "Jan 2026", inscrits: 8, churn: 1, mrr: 12800 },
  { mois: "Fév 2026", inscrits: 6, churn: 1, mrr: 13500 },
  { mois: "Mar 2026", inscrits: 9, churn: 0, mrr: 14350 },
];

export default function SuperAdminStats() {
  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Statistiques globales</h1>
          <p className="text-muted-foreground text-sm">Évolution de l'activité MBA</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="glass-card border-white/10">
            <CardContent className="p-5 text-center">
              <p className="text-3xl font-bold text-emerald-400">39</p>
              <p className="text-xs text-muted-foreground mt-1">Inscriptions (6 mois)</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="p-5 text-center">
              <p className="text-3xl font-bold text-destructive">5</p>
              <p className="text-xs text-muted-foreground mt-1">Churns (6 mois)</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="p-5 text-center">
              <p className="text-3xl font-bold text-primary">+40.7%</p>
              <p className="text-xs text-muted-foreground mt-1">Croissance MRR</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Évolution mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">Mois</th>
                    <th className="text-center py-2 font-medium text-muted-foreground">Inscriptions</th>
                    <th className="text-center py-2 font-medium text-muted-foreground">Churns</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">MRR</th>
                  </tr>
                </thead>
                <tbody>
                  {MONTHLY_DATA.map((row) => (
                    <tr key={row.mois} className="border-b border-border/50">
                      <td className="py-3 font-medium">{row.mois}</td>
                      <td className="py-3 text-center text-emerald-400">+{row.inscrits}</td>
                      <td className="py-3 text-center text-destructive">{row.churn > 0 ? `-${row.churn}` : "0"}</td>
                      <td className="py-3 text-right font-semibold">{row.mrr.toLocaleString("fr-FR")}€</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}
