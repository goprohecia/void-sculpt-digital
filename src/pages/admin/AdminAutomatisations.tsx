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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Zap, Bell, Mail, Clock, ArrowRight, Plus, CheckCircle, X, Pencil, Trash2 } from "lucide-react";
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

// ── Predefined triggers ──
const PREDEFINED_TRIGGERS: Record<string, { label: string; items: string[] }> = {
  relance: {
    label: "Relance",
    items: [
      "Facture impayée > 3 jours",
      "Facture impayée > 7 jours",
      "Facture impayée > 15 jours",
      "Facture impayée > 30 jours",
      "Facture impayée > 60 jours",
      "Devis non signé > 5 jours",
      "Devis non signé > 10 jours",
      "Devis non signé > 30 jours",
      "Acompte non reçu > 7 jours",
    ],
  },
  notification: {
    label: "Notification",
    items: [
      "Inscription client",
      "Nouveau message reçu",
      "Nouveau ticket support",
      "Rendez-vous confirmé",
      "Rendez-vous annulé",
      "Dossier assigné à un employé",
      "Commentaire ajouté sur un dossier",
      "Stock en alerte (seuil atteint)",
      "Nouvel avis / note client",
      "Employé ajouté à l'équipe",
    ],
  },
  statut: {
    label: "Changement de statut",
    items: [
      "Statut dossier = Terminé",
      "Statut dossier = En attente",
      "Statut dossier = Annulé",
      "Statut demande = Acceptée",
      "Statut demande = Refusée",
      "Date validité dépassée (devis)",
      "Date d'échéance dépassée (facture)",
      "Ticket résolu",
      "Ticket sans réponse > 48h",
      "Bon de commande livré",
    ],
  },
  email: {
    label: "Email",
    items: [
      "Premier dossier créé",
      "RDV dans 24h",
      "RDV dans 1h",
      "Anniversaire du client",
      "3 mois sans activité",
      "6 mois sans activité",
      "Facture payée",
      "Devis signé",
      "Nouveau devis envoyé",
      "Nouvelle facture émise",
      "Dossier en cours de livraison",
      "Demande de feedback post-prestation",
    ],
  },
};

// ── Predefined actions ──
const PREDEFINED_ACTIONS: Record<string, { label: string; items: string[] }> = {
  relance: {
    label: "Relance",
    items: [
      "Envoyer email de relance niveau 1",
      "Envoyer email de relance niveau 2 (ferme)",
      "Envoyer email de relance niveau 3 (mise en demeure)",
      "Envoyer SMS de relance",
      "Créer une tâche de suivi pour l'admin",
      "Ajouter une note au dossier",
      "Marquer le client comme 'À risque'",
    ],
  },
  notification: {
    label: "Notification",
    items: [
      "Notification push admin",
      "Notification push + email admin",
      "Notification push client",
      "Notification push employé assigné",
      "Notification Slack / webhook",
      "Ajouter une entrée dans le journal d'activité",
    ],
  },
  statut: {
    label: "Changement de statut",
    items: [
      "Changer statut → Archivé",
      "Changer statut → En attente",
      "Changer statut → En cours",
      "Créer facture brouillon",
      "Créer facture et envoyer au client",
      "Clôturer le dossier",
      "Réouvrir le dossier",
      "Générer un rapport de clôture",
      "Archiver les documents liés",
    ],
  },
  email: {
    label: "Email",
    items: [
      "Email de bienvenue",
      "Email de rappel au client",
      "Email de confirmation",
      "Email de remerciement",
      "Email de satisfaction (enquête)",
      "Email récapitulatif mensuel",
      "Email promotionnel personnalisé",
      "Email de réactivation",
      "Email d'anniversaire avec offre",
      "Email de suivi post-prestation",
      "Envoyer le devis en PDF",
      "Envoyer la facture en PDF",
    ],
  },
};

const DEMO_AUTOMATIONS: Automation[] = [
  { id: "1", titre: "Relance automatique J+7", description: "Envoyer une relance email si la facture n'est pas payée après 7 jours", declencheur: "Facture impayée > 7 jours", action: "Envoyer email de relance niveau 1", actif: true, executions: 23, derniereExec: "07/03/2026", categorie: "relance" },
  { id: "2", titre: "Notification nouveau client", description: "Alerter l'admin quand un nouveau client s'inscrit", declencheur: "Inscription client", action: "Notification push + email admin", actif: true, executions: 8, derniereExec: "06/03/2026", categorie: "notification" },
  { id: "3", titre: "Devis expiré → archivé", description: "Passer automatiquement les devis expirés en statut archivé", declencheur: "Date validité dépassée (devis)", action: "Changer statut → Archivé", actif: true, executions: 5, derniereExec: "05/03/2026", categorie: "statut" },
  { id: "4", titre: "Rappel RDV J-1", description: "Envoyer un email de rappel au client 24h avant le rendez-vous", declencheur: "RDV dans 24h", action: "Email de rappel au client", actif: true, executions: 34, derniereExec: "07/03/2026", categorie: "email" },
  { id: "5", titre: "Relance 2e niveau J+15", description: "Relance plus ferme si toujours impayé après 15 jours", declencheur: "Facture impayée > 15 jours", action: "Envoyer email de relance niveau 2 (ferme)", actif: false, executions: 3, derniereExec: "01/03/2026", categorie: "relance" },
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

type RuleForm = { titre: string; description: string; declencheur: string; action: string; categorie: Automation["categorie"] };
const EMPTY_FORM: RuleForm = { titre: "", description: "", declencheur: "", action: "", categorie: "email" };

function RuleFormFields({ form, setForm, allTriggers, allActions }: {
  form: RuleForm;
  setForm: React.Dispatch<React.SetStateAction<RuleForm>>;
  allTriggers: string[];
  allActions: string[];
}) {
  const triggers = PREDEFINED_TRIGGERS[form.categorie]?.items ?? [];
  const actions = PREDEFINED_ACTIONS[form.categorie]?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Titre</Label>
          <Input placeholder="Ex: Relance J+7" value={form.titre} onChange={(e) => setForm((r) => ({ ...r, titre: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label>Catégorie</Label>
          <Select value={form.categorie} onValueChange={(v) => setForm((r) => ({ ...r, categorie: v as Automation["categorie"], declencheur: "", action: "" }))}>
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
        <Textarea placeholder="Description de la règle..." rows={2} value={form.description} onChange={(e) => setForm((r) => ({ ...r, description: e.target.value }))} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Déclencheur</Label>
          <Select value={form.declencheur} onValueChange={(v) => setForm((r) => ({ ...r, declencheur: v }))}>
            <SelectTrigger><SelectValue placeholder="Choisir un déclencheur…" /></SelectTrigger>
            <SelectContent>
              {triggers.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Action</Label>
          <Select value={form.action} onValueChange={(v) => setForm((r) => ({ ...r, action: v }))}>
            <SelectTrigger><SelectValue placeholder="Choisir une action…" /></SelectTrigger>
            <SelectContent>
              {actions.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default function AdminAutomatisations() {
  const [automations, setAutomations] = useState(DEMO_AUTOMATIONS);
  const [showForm, setShowForm] = useState(false);
  const [newRule, setNewRule] = useState<RuleForm>({ ...EMPTY_FORM });

  // Edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<RuleForm>({ ...EMPTY_FORM });

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const allTriggers = Object.values(PREDEFINED_TRIGGERS).flatMap((g) => g.items);
  const allActions = Object.values(PREDEFINED_ACTIONS).flatMap((g) => g.items);

  const toggleAutomation = (id: string) => {
    setAutomations((prev) => prev.map((a) => (a.id === id ? { ...a, actif: !a.actif } : a)));
  };

  const handleCreate = () => {
    if (!newRule.titre.trim() || !newRule.declencheur || !newRule.action) return;
    setAutomations((prev) => [
      { id: Date.now().toString(), ...newRule, actif: true, executions: 0 },
      ...prev,
    ]);
    setNewRule({ ...EMPTY_FORM });
    setShowForm(false);
    toast.success("Règle d'automatisation créée");
  };

  const openEdit = (auto: Automation) => {
    setEditId(auto.id);
    setEditForm({ titre: auto.titre, description: auto.description, declencheur: auto.declencheur, action: auto.action, categorie: auto.categorie });
  };

  const handleEdit = () => {
    if (!editId || !editForm.titre.trim() || !editForm.declencheur || !editForm.action) return;
    setAutomations((prev) => prev.map((a) => (a.id === editId ? { ...a, ...editForm } : a)));
    setEditId(null);
    toast.success("Règle modifiée");
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setAutomations((prev) => prev.filter((a) => a.id !== deleteId));
    setDeleteId(null);
    toast.success("Règle supprimée");
  };

  const activeCount = automations.filter((a) => a.actif).length;
  const totalExecs = automations.reduce((sum, a) => sum + a.executions, 0);
  const deleteAuto = automations.find((a) => a.id === deleteId);

  return (
    <AdminLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" /> Automatisations
              </h1>
              <p className="text-muted-foreground text-sm">{activeCount} règles actives · {totalExecs} exécutions au total</p>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="gap-1.5 self-start">
              {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm ? "Annuler" : "Nouvelle règle"}
            </Button>
          </div>

          {showForm && (
            <Card>
              <CardContent className="pt-4 space-y-4">
                <RuleFormFields form={newRule} setForm={setNewRule} allTriggers={allTriggers} allActions={allActions} />
                <div className="flex justify-end">
                  <Button onClick={handleCreate} disabled={!newRule.titre.trim() || !newRule.declencheur || !newRule.action} className="gap-1.5">
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
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${CAT_COLOR[auto.categorie]}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold">{auto.titre}</p>
                          <Badge variant="outline" className="text-[10px]">{auto.categorie}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{auto.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-muted/30 font-medium">{auto.declencheur}</span>
                          <ArrowRight className="h-3 w-3 shrink-0" />
                          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{auto.action}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                          <span>{auto.executions} exécutions</span>
                          {auto.derniereExec && <span>· Dernière : {auto.derniereExec}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(auto)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(auto.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <Switch checked={auto.actif} onCheckedChange={() => toggleAutomation(auto.id)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Edit dialog */}
        <Dialog open={!!editId} onOpenChange={(o) => { if (!o) setEditId(null); }}>
          <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[85dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier la règle</DialogTitle>
              <DialogDescription>Modifiez les paramètres de cette automatisation.</DialogDescription>
            </DialogHeader>
            <RuleFormFields form={editForm} setForm={setEditForm} allTriggers={allTriggers} allActions={allActions} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditId(null)}>Annuler</Button>
              <Button onClick={handleEdit} disabled={!editForm.titre.trim() || !editForm.declencheur || !editForm.action}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete confirm dialog */}
        <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Supprimer la règle</DialogTitle>
              <DialogDescription>
                Voulez-vous vraiment supprimer « {deleteAuto?.titre} » ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>Annuler</Button>
              <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminPageTransition>
    </AdminLayout>
  );
}
