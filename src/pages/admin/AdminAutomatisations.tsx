import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Bell, Mail, Clock, ArrowRight, Plus, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";

interface Automation {
  id: string;
  titre: string;
  description: string;
  declencheur: string;
  action: string;
  actif: boolean;
  executions: number;
  derniereExec?: string;
  categorie: "relance" | "notification" | "statut" | "email";
}

const DEMO_AUTOMATIONS: Automation[] = [
  { id: "1", titre: "Relance automatique J+7", description: "Envoyer une relance email si la facture n'est pas payée après 7 jours", declencheur: "Facture impayée > 7 jours", action: "Envoyer email de relance", actif: true, executions: 23, derniereExec: "07/03/2026", categorie: "relance" },
  { id: "2", titre: "Notification nouveau client", description: "Alerter l'admin quand un nouveau client s'inscrit", declencheur: "Inscription client", action: "Notification push + email", actif: true, executions: 8, derniereExec: "06/03/2026", categorie: "notification" },
  { id: "3", titre: "Devis expiré → archivé", description: "Passer automatiquement les devis expirés en statut archivé", declencheur: "Date validité dépassée", action: "Changer statut → Archivé", actif: true, executions: 5, derniereExec: "05/03/2026", categorie: "statut" },
  { id: "4", titre: "Rappel RDV J-1", description: "Envoyer un email de rappel au client 24h avant le rendez-vous", declencheur: "RDV dans 24h", action: "Email de rappel au client", actif: true, executions: 34, derniereExec: "07/03/2026", categorie: "email" },
  { id: "5", titre: "Relance 2e niveau J+15", description: "Relance plus ferme si toujours impayé après 15 jours", declencheur: "Facture impayée > 15 jours", action: "Email relance niveau 2", actif: false, executions: 3, derniereExec: "01/03/2026", categorie: "relance" },
  { id: "6", titre: "Dossier terminé → facture", description: "Créer automatiquement une facture quand un dossier passe en 'Terminé'", declencheur: "Statut dossier = Terminé", action: "Créer facture brouillon", actif: false, executions: 0, categorie: "statut" },
  { id: "7", titre: "Bienvenue nouveau client", description: "Envoyer un email de bienvenue personnalisé", declencheur: "Premier dossier créé", action: "Email de bienvenue", actif: true, executions: 12, derniereExec: "04/03/2026", categorie: "email" },
];

const CAT_ICON: Record<string, typeof Bell> = { relance: Clock, notification: Bell, statut: CheckCircle, email: Mail };
const CAT_COLOR: Record<string, string> = {
  relance: "bg-amber-500/10 text-amber-400",
  notification: "bg-blue-500/10 text-blue-400",
  statut: "bg-emerald-500/10 text-emerald-400",
  email: "bg-purple-500/10 text-purple-400",
};

const CATEGORIES = [
  { value: "relance", label: "Relance" },
  { value: "notification", label: "Notification" },
  { value: "statut", label: "Changement de statut" },
  { value: "email", label: "Email" },
];

export default function AdminAutomatisations() {
  const [automations, setAutomations] = useState(DEMO_AUTOMATIONS);
  const [showForm, setShowForm] = useState(false);
  const [newRule, setNewRule] = useState({ titre: "", description: "", declencheur: "", action: "", categorie: "email" as Automation["categorie"] });

  const toggleAutomation = (id: string) => {
    setAutomations((prev) => prev.map((a) => (a.id === id ? { ...a, actif: !a.actif } : a)));
  };

  const handleCreate = () => {
    if (!newRule.titre.trim() || !newRule.declencheur.trim() || !newRule.action.trim()) return;
    setAutomations((prev) => [
      {
        id: Date.now().toString(),
        titre: newRule.titre,
        description: newRule.description,
        declencheur: newRule.declencheur,
        action: newRule.action,
        categorie: newRule.categorie,
        actif: true,
        executions: 0,
      },
      ...prev,
    ]);
    setNewRule({ titre: "", description: "", declencheur: "", action: "", categorie: "email" });
    setShowForm(false);
    toast.success("Règle d'automatisation créée");
  };

  const activeCount = automations.filter((a) => a.actif).length;
  const totalExecs = automations.reduce((sum, a) => sum + a.executions, 0);

  return (
    <AdminLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" /> Automatisations
              </h1>
              <p className="text-muted-foreground text-sm">{activeCount} règles actives · {totalExecs} exécutions au total</p>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="gap-1.5">
              {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm ? "Annuler" : "Nouvelle règle"}
            </Button>
          </div>

          {showForm && (
            <Card>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Titre</Label>
                    <Input placeholder="Ex: Relance J+7" value={newRule.titre} onChange={(e) => setNewRule((r) => ({ ...r, titre: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Catégorie</Label>
                    <Select value={newRule.categorie} onValueChange={(v) => setNewRule((r) => ({ ...r, categorie: v as Automation["categorie"] }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea placeholder="Description de la règle..." rows={2} value={newRule.description} onChange={(e) => setNewRule((r) => ({ ...r, description: e.target.value }))} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Déclencheur</Label>
                    <Input placeholder="Ex: Facture impayée > 7 jours" value={newRule.declencheur} onChange={(e) => setNewRule((r) => ({ ...r, declencheur: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Action</Label>
                    <Input placeholder="Ex: Envoyer email de relance" value={newRule.action} onChange={(e) => setNewRule((r) => ({ ...r, action: e.target.value }))} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleCreate} disabled={!newRule.titre.trim() || !newRule.declencheur.trim() || !newRule.action.trim()} className="gap-1.5">
                    <Plus className="h-4 w-4" /> Créer la règle
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {automations.map((auto) => {
              const Icon = CAT_ICON[auto.categorie];
              return (
                <Card key={auto.id} className={`transition-opacity ${!auto.actif ? "opacity-60" : ""}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${CAT_COLOR[auto.categorie]}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{auto.titre}</p>
                          <Badge variant="outline" className="text-[10px]">{auto.categorie}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{auto.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                          <span className="px-2 py-0.5 rounded bg-muted/30 font-medium">{auto.declencheur}</span>
                          <ArrowRight className="h-3 w-3" />
                          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{auto.action}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                          <span>{auto.executions} exécutions</span>
                          {auto.derniereExec && <span>· Dernière : {auto.derniereExec}</span>}
                        </div>
                      </div>
                      <Switch checked={auto.actif} onCheckedChange={() => toggleAutomation(auto.id)} />
                    </div>
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
