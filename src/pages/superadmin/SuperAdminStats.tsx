import { SuperAdminLayout } from "@/components/admin/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts";

const MONTHLY_DATA = [
  { mois: "Oct 2025", inscrits: 5, churn: 1, mrr: 10200 },
  { mois: "Nov 2025", inscrits: 7, churn: 0, mrr: 11450 },
  { mois: "Déc 2025", inscrits: 4, churn: 2, mrr: 11850 },
  { mois: "Jan 2026", inscrits: 8, churn: 1, mrr: 12800 },
  { mois: "Fév 2026", inscrits: 6, churn: 1, mrr: 13500 },
  { mois: "Mar 2026", inscrits: 9, churn: 0, mrr: 14350 },
];

const mrrConfig = { mrr: { label: "MRR (€)", color: "hsl(var(--primary))" } };
const growthConfig = {
  inscrits: { label: "Inscriptions", color: "hsl(142, 71%, 45%)" },
  churn: { label: "Churns", color: "hsl(var(--destructive))" },
};

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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Courbe MRR</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={mrrConfig} className="h-[250px] w-full">
                <LineChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="mois" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="mrr" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Inscriptions vs Churns</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={growthConfig} className="h-[250px] w-full">
                <BarChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="mois" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="inscrits" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="churn" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Détail mensuel</CardTitle>
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
