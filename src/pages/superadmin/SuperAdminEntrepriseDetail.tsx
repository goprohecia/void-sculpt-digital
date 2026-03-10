import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { SuperAdminLayout } from "@/components/admin/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, Building2, Sparkles, AlertTriangle, Unlock, RefreshCw } from "lucide-react";
import { format, startOfMonth, addMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { MOCK_ENTERPRISES, MOCK_DEBLOCAGES, type SwapDeblocage } from "@/data/mockEnterprises";
import { SECTORS } from "@/contexts/DemoPlanContext";

const planColors: Record<string, string> = {
  starter: "bg-muted text-muted-foreground",
  business: "bg-neon-blue/10 text-neon-blue",
  enterprise: "bg-amber-500/10 text-amber-400",
};

export default function SuperAdminEntrepriseDetail() {
  const { id } = useParams<{ id: string }>();
  const enterprise = MOCK_ENTERPRISES.find((e) => e.id === id);

  const [swapsRemaining, setSwapsRemaining] = useState(enterprise?.swapsRemaining ?? 0);
  const [deblocages, setDeblocages] = useState<SwapDeblocage[]>(
    MOCK_DEBLOCAGES[id || ""] ? [...MOCK_DEBLOCAGES[id || ""]] : []
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [raison, setRaison] = useState("");

  const resetDate = useMemo(() => {
    const nextMonth = addMonths(startOfMonth(new Date()), 1);
    return format(nextMonth, "d MMMM yyyy", { locale: fr });
  }, []);

  const currentMonthDeblocages = useMemo(() => {
    const monthStart = format(startOfMonth(new Date()), "yyyy-MM");
    return deblocages.filter((d) => d.date.startsWith(monthStart)).length;
  }, [deblocages]);

  if (!enterprise) {
    return (
      <SuperAdminLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Entreprise introuvable.</p>
          <Link to="/superadmin/entreprises">
            <Button variant="outline" className="mt-4"><ArrowLeft className="h-4 w-4 mr-2" />Retour</Button>
          </Link>
        </div>
      </SuperAdminLayout>
    );
  }

  const sector = SECTORS.find((s) => s.key === enterprise.sector);

  const handleConfirmDeblocage = () => {
    if (!raison.trim()) return;
    const newEntry: SwapDeblocage = {
      id: `d-${Date.now()}`,
      date: format(new Date(), "yyyy-MM-dd"),
      supportId: "SA-001",
      raison: raison.trim(),
      swapsOctroyes: 1,
    };
    setDeblocages((prev) => [newEntry, ...prev]);
    setSwapsRemaining((prev) => prev + 1);
    setRaison("");
    setDialogOpen(false);
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Back + Header */}
        <div className="flex items-center gap-3">
          <Link to="/superadmin/entreprises">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">{enterprise.nom}</h1>
              <Badge className={planColors[enterprise.plan]}>{enterprise.plan}</Badge>
              <Badge variant={enterprise.statut === "actif" ? "default" : "secondary"}>{enterprise.statut}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {enterprise.email}
              {sector && <span className="ml-2">{sector.icon} {sector.label}</span>}
              <span className="ml-3">{enterprise.users} utilisateurs · {enterprise.modules.length} modules · {enterprise.mrr}€/mois</span>
            </p>
          </div>
        </div>

        {/* Swap Management */}
        <Card className="glass-card border-amber-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <RefreshCw className="h-5 w-5 text-amber-400" />
              Gestion des swaps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-2xl font-bold">{swapsRemaining} / 2 <span className="text-base font-normal text-muted-foreground">swaps restants</span></p>
                <p className="text-sm text-muted-foreground">Remise à zéro le {resetDate}</p>
              </div>
              <Button onClick={() => setDialogOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-black">
                <Unlock className="h-4 w-4 mr-2" />
                Débloquer 1 swap supplémentaire
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Deblocage History */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg">Historique des déblocages</CardTitle>
              {currentMonthDeblocages >= 3 && (
                <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Déblocages fréquents — upgrade recommandé
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {deblocages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Aucun déblocage enregistré pour ce client.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Identifiant support</TableHead>
                    <TableHead>Raison</TableHead>
                    <TableHead className="text-right">Swaps octroyés</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deblocages.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{format(new Date(d.date), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{d.supportId}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{d.raison}</TableCell>
                      <TableCell className="text-right">+{d.swapsOctroyes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                Débloquer un swap supplémentaire
              </DialogTitle>
              <DialogDescription>
                Pour <strong>{enterprise.nom}</strong> ({enterprise.plan})
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-sm text-amber-300">
                Cette action ajoutera 1 swap au compteur du client. Elle sera loggée avec votre identifiant.
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Raison du déblocage <span className="text-destructive">*</span></label>
                <Textarea
                  placeholder="Indiquez la raison de ce déblocage exceptionnel…"
                  value={raison}
                  onChange={(e) => setRaison(e.target.value)}
                  className="min-h-[100px]"
                />
                {raison.trim() === "" && (
                  <p className="text-xs text-muted-foreground">La raison est obligatoire pour confirmer le déblocage.</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setDialogOpen(false); setRaison(""); }}>Annuler</Button>
              <Button
                onClick={handleConfirmDeblocage}
                disabled={raison.trim() === ""}
                className="bg-amber-500 hover:bg-amber-600 text-black"
              >
                Confirmer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminLayout>
  );
}
