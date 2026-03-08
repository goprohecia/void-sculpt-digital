import { useState } from "react";
import { SuperAdminLayout } from "@/components/admin/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Building2 } from "lucide-react";

const MOCK_ENTERPRISES = [
  { id: "1", nom: "TechVision SAS", email: "contact@techvision.fr", plan: "enterprise", users: 12, modules: ["clients", "dossiers", "facturation", "messagerie", "relances", "support", "emails", "rendez-vous", "stock", "analyse", "pipeline", "ia"], mrr: 400, statut: "actif", date: "2025-09-15", sector: "developpeur" },
  { id: "2", nom: "Studio Créatif", email: "hello@studiocrea.com", plan: "business", users: 5, modules: ["clients", "dossiers", "facturation", "messagerie", "relances", "support"], mrr: 250, statut: "actif", date: "2025-11-02", sector: "designer" },
  { id: "3", nom: "BTP Renov", email: "info@btprenov.fr", plan: "starter", users: 2, modules: ["clients", "dossiers", "facturation"], mrr: 150, statut: "actif", date: "2026-01-10", sector: "btp" },
  { id: "4", nom: "Immo+", email: "contact@immoplus.fr", plan: "business", users: 8, modules: ["clients", "dossiers", "facturation", "messagerie", "emails", "rendez-vous"], mrr: 250, statut: "actif", date: "2025-10-20", sector: "immobilier" },
  { id: "5", nom: "CleanPro", email: "admin@cleanpro.fr", plan: "enterprise", users: 15, modules: ["clients", "dossiers", "facturation", "messagerie", "relances", "support", "stock", "analyse", "taches", "automatisations"], mrr: 400, statut: "actif", date: "2025-08-05", sector: "nettoyage" },
  { id: "6", nom: "DigitalCraft", email: "team@digitalcraft.io", plan: "starter", users: 1, modules: ["clients", "dossiers", "facturation"], mrr: 150, statut: "essai", date: "2026-02-28", sector: "community-manager" },
  { id: "7", nom: "EventPro", email: "contact@eventpro.fr", plan: "business", users: 4, modules: ["clients", "dossiers", "facturation", "messagerie", "support"], mrr: 250, statut: "actif", date: "2026-01-15", sector: "evenementiel" },
  { id: "8", nom: "CoachFit", email: "hello@coachfit.com", plan: "starter", users: 1, modules: ["clients", "dossiers", "facturation"], mrr: 150, statut: "actif", date: "2026-02-01", sector: "coach-sportif" },
];

const planColors: Record<string, string> = {
  starter: "bg-muted text-muted-foreground",
  business: "bg-neon-blue/10 text-neon-blue",
  enterprise: "bg-amber-500/10 text-amber-400",
};

export default function SuperAdminEntreprises() {
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");

  const filtered = MOCK_ENTERPRISES.filter((e) => {
    const matchSearch = e.nom.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan === "all" || e.plan === filterPlan;
    return matchSearch && matchPlan;
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
        </div>

        {/* Liste */}
        <div className="grid gap-4">
          {filtered.map((e) => (
            <Card key={e.id} className="glass-card border-white/10 hover:border-white/20 transition-colors cursor-pointer">
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
                    <p className="text-xs text-muted-foreground">{e.email}</p>
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
          ))}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
