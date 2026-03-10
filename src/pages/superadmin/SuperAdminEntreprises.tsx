import { useState } from "react";
import { Link } from "react-router-dom";
import { SuperAdminLayout } from "@/components/admin/SuperAdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, AlertTriangle } from "lucide-react";
import { SECTORS } from "@/contexts/DemoPlanContext";
import { MOCK_ENTERPRISES } from "@/data/mockEnterprises";

const planColors: Record<string, string> = {
  starter: "bg-muted text-muted-foreground",
  business: "bg-neon-blue/10 text-neon-blue",
  enterprise: "bg-amber-500/10 text-amber-400",
};

export default function SuperAdminEntreprises() {
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterSector, setFilterSector] = useState("all");

  const filtered = MOCK_ENTERPRISES.filter((e) => {
    const matchSearch = e.nom.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan === "all" || e.plan === filterPlan;
    const matchSector = filterSector === "all" || e.sector === filterSector;
    return matchSearch && matchPlan && matchSector;
  });

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Entreprises</h1>
          <p className="text-muted-foreground text-sm">Gestion de toutes les entreprises clientes MBA</p>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher une entreprise..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 glass-input border-0" />
          </div>
          <Select value={filterPlan} onValueChange={setFilterPlan}>
            <SelectTrigger className="w-[180px] glass-input border-0">
              <SelectValue placeholder="Tous les plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les plans</SelectItem>
              <SelectItem value="starter">Starter</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterSector} onValueChange={setFilterSector}>
            <SelectTrigger className="w-[220px] glass-input border-0">
              <SelectValue placeholder="Tous les secteurs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les secteurs</SelectItem>
              {SECTORS.map((s) => (
                <SelectItem key={s.key} value={s.key}>
                  {s.icon} {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Liste */}
        <div className="grid gap-4">
          {filtered.map((e) => (
            <Link key={e.id} to={`/superadmin/entreprises/${e.id}`}>
              <Card className="glass-card border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{e.nom}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${planColors[e.plan]}`}>
                          {e.plan}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${e.statut === "actif" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                          {e.statut}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {e.email}
                        {e.sector && (
                          <span className="ml-2 inline-flex items-center gap-1">
                            <span>{SECTORS.find(s => s.key === e.sector)?.icon}</span>
                            <span>{SECTORS.find(s => s.key === e.sector)?.label}</span>
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-semibold">{e.users}</p>
                        <p className="text-[10px] text-muted-foreground">utilisateurs</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{e.modules.length}</p>
                        <p className="text-[10px] text-muted-foreground">modules</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{e.mrr}€</p>
                        <p className="text-[10px] text-muted-foreground">MRR</p>
                      </div>
                      <div className="text-center">
                        <p className={`font-semibold ${e.swapsRemaining === 0 ? "text-destructive" : ""}`}>{e.swapsRemaining}/2</p>
                        <p className="text-[10px] text-muted-foreground">swaps</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <p className="font-semibold">{e.deblocages}</p>
                          {e.deblocages >= 3 && <AlertTriangle className="h-3 w-3 text-destructive" />}
                        </div>
                        <p className="text-[10px] text-muted-foreground">déblocages</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {e.modules.slice(0, 6).map((m) => (
                      <span key={m} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize">{m}</span>
                    ))}
                    {e.modules.length > 6 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">+{e.modules.length - 6}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
