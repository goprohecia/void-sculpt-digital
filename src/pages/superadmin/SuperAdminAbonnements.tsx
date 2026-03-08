import { SuperAdminLayout } from "@/components/admin/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PLAN_DATA = [
  { plan: "Starter", price: "150€/mois", count: 18, revenue: 2700, color: "text-muted-foreground", bg: "bg-muted" },
  { plan: "Business", price: "250€/mois", count: 20, revenue: 5000, color: "text-neon-blue", bg: "bg-neon-blue/10" },
  { plan: "Enterprise", price: "400€/mois", count: 9, revenue: 3600, color: "text-amber-400", bg: "bg-amber-500/10" },
];

export default function SuperAdminAbonnements() {
  const totalMRR = PLAN_DATA.reduce((s, p) => s + p.revenue, 0);

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Abonnements</h1>
          <p className="text-muted-foreground text-sm">Suivi des revenus récurrents par formule</p>
        </div>

        <Card className="glass-card border-white/10">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">Revenu mensuel récurrent total</p>
            <p className="text-4xl font-bold mt-2">{totalMRR.toLocaleString("fr-FR")}€</p>
            <p className="text-xs text-emerald-400 mt-1">+12% vs mois précédent</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLAN_DATA.map((p) => (
            <Card key={p.plan} className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.bg} ${p.color}`}>{p.plan}</span>
                  <span className="text-muted-foreground text-sm font-normal">{p.price}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Entreprises</span>
                  <span className="font-semibold">{p.count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Revenus</span>
                  <span className="font-semibold">{p.revenue.toLocaleString("fr-FR")}€/mois</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Part du MRR</span>
                  <span className="font-semibold">{Math.round((p.revenue / totalMRR) * 100)}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
