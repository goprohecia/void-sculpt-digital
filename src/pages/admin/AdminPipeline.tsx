import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Users, TrendingUp, Euro, ArrowRight, Plus } from "lucide-react";

interface Deal {
  id: string;
  nom: string;
  entreprise: string;
  montant: number;
  probabilite: number;
  etape: string;
  dateCreation: string;
  contact: string;
}

const ETAPES = [
  { key: "prospect", label: "Prospect", color: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
  { key: "qualifie", label: "Qualifié", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { key: "proposition", label: "Proposition", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { key: "negociation", label: "Négociation", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { key: "gagne", label: "Gagné", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { key: "perdu", label: "Perdu", color: "bg-red-500/20 text-red-400 border-red-500/30" },
];

const DEMO_DEALS: Deal[] = [
  { id: "1", nom: "Refonte site e-commerce", entreprise: "Boutique Parisienne", montant: 8500, probabilite: 70, etape: "proposition", dateCreation: "01/03/2026", contact: "Claire Bernard" },
  { id: "2", nom: "Application mobile gestion", entreprise: "GreenTech Solutions", montant: 15000, probabilite: 40, etape: "qualifie", dateCreation: "28/02/2026", contact: "Thomas Leclerc" },
  { id: "3", nom: "Identité visuelle complète", entreprise: "Startup Nova", montant: 3200, probabilite: 90, etape: "negociation", dateCreation: "20/02/2026", contact: "Julie Moreau" },
  { id: "4", nom: "Maintenance annuelle", entreprise: "Cabinet Roche", montant: 4800, probabilite: 95, etape: "negociation", dateCreation: "15/02/2026", contact: "Dr. Roche" },
  { id: "5", nom: "Module CRM sur mesure", entreprise: "Immo Express", montant: 12000, probabilite: 25, etape: "prospect", dateCreation: "05/03/2026", contact: "Karim Benali" },
  { id: "6", nom: "SEO + Content Marketing", entreprise: "FoodTruck & Co", montant: 2800, probabilite: 60, etape: "proposition", dateCreation: "02/03/2026", contact: "Sarah Petit" },
  { id: "7", nom: "Dashboard analytics", entreprise: "SportClub Pro", montant: 6500, probabilite: 50, etape: "qualifie", dateCreation: "25/02/2026", contact: "Maxime Durand" },
  { id: "8", nom: "Site vitrine restaurant", entreprise: "Le Gourmet", montant: 2200, probabilite: 100, etape: "gagne", dateCreation: "10/02/2026", contact: "Chef Antoine" },
  { id: "9", nom: "Projet abandonné X", entreprise: "OldCorp", montant: 5000, probabilite: 0, etape: "perdu", dateCreation: "01/02/2026", contact: "Jean Ancien" },
];

export default function AdminPipeline() {
  const [deals] = useState(DEMO_DEALS);

  const pipelineEtapes = ETAPES.filter((e) => e.key !== "gagne" && e.key !== "perdu");
  const activeDeals = deals.filter((d) => d.etape !== "gagne" && d.etape !== "perdu");
  const totalPipeline = activeDeals.reduce((sum, d) => sum + d.montant, 0);
  const totalPondere = activeDeals.reduce((sum, d) => sum + (d.montant * d.probabilite) / 100, 0);

  return (
    <AdminLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" /> Pipeline CRM
              </h1>
              <p className="text-muted-foreground text-sm">{activeDeals.length} opportunités actives</p>
            </div>
            <Button className="gap-1.5"><Plus className="h-4 w-4" /> Nouvelle opportunité</Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { label: "Pipeline total", value: `${(totalPipeline / 1000).toFixed(1)}k€`, icon: Euro },
              { label: "Valeur pondérée", value: `${(totalPondere / 1000).toFixed(1)}k€`, icon: TrendingUp },
              { label: "Opportunités", value: activeDeals.length.toString(), icon: Target },
              { label: "Taux conversion", value: "67%", icon: Users },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pipeline Kanban */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {pipelineEtapes.map((etape) => {
              const etapeDeals = deals.filter((d) => d.etape === etape.key);
              const etapeTotal = etapeDeals.reduce((sum, d) => sum + d.montant, 0);
              return (
                <Card key={etape.key} className="bg-muted/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <Badge variant="outline" className={`${etape.color} text-xs`}>{etape.label}</Badge>
                      <span className="text-xs text-muted-foreground font-normal">{etapeTotal.toLocaleString("fr-FR")}€</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 min-h-[120px]">
                    {etapeDeals.map((deal) => (
                      <div key={deal.id} className="p-3 rounded-lg bg-background border border-border/50 space-y-1.5 hover:border-primary/30 transition-colors cursor-pointer">
                        <p className="text-sm font-medium">{deal.nom}</p>
                        <p className="text-xs text-muted-foreground">{deal.entreprise}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-primary">{deal.montant.toLocaleString("fr-FR")}€</span>
                          <Badge variant="outline" className="text-[10px]">{deal.probabilite}%</Badge>
                        </div>
                      </div>
                    ))}
                    {etapeDeals.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-6">Aucune opportunité</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Won / Lost */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["gagne", "perdu"].map((status) => {
              const etape = ETAPES.find((e) => e.key === status)!;
              const statusDeals = deals.filter((d) => d.etape === status);
              return (
                <Card key={status}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Badge variant="outline" className={`${etape.color} text-xs`}>{etape.label}</Badge>
                      <span className="text-xs text-muted-foreground font-normal">{statusDeals.length} deal(s)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {statusDeals.map((deal) => (
                      <div key={deal.id} className="flex items-center justify-between py-2 text-sm">
                        <div>
                          <p className="font-medium">{deal.nom}</p>
                          <p className="text-xs text-muted-foreground">{deal.entreprise}</p>
                        </div>
                        <span className="font-semibold">{deal.montant.toLocaleString("fr-FR")}€</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </AdminPageTransition>
    </AdminLayout>
  );
}
