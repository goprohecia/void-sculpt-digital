import { useState, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Target, Users, TrendingUp, Euro, Plus, GripVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
  const [deals, setDeals] = useState(DEMO_DEALS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);
  const [dragOverEtape, setDragOverEtape] = useState<string | null>(null);
  const [editDeal, setEditDeal] = useState<Deal | null>(null);
  const [editForm, setEditForm] = useState({ nom: "", entreprise: "", montant: "", probabilite: "25", etape: "prospect", contact: "" });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const didDrag = useRef(false);
  const [newDeal, setNewDeal] = useState({
    nom: "",
    entreprise: "",
    montant: "",
    probabilite: "25",
    etape: "prospect",
    contact: "",
  });

  const pipelineEtapes = ETAPES.filter((e) => e.key !== "gagne" && e.key !== "perdu");
  const allDroppableEtapes = ETAPES; // Allow dropping in Gagné/Perdu too
  const activeDeals = deals.filter((d) => d.etape !== "gagne" && d.etape !== "perdu");
  const totalPipeline = activeDeals.reduce((sum, d) => sum + d.montant, 0);
  const totalPondere = activeDeals.reduce((sum, d) => sum + (d.montant * d.probabilite) / 100, 0);

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    didDrag.current = true;
    setDraggedDeal(dealId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", dealId);
  };

  const handleDragOver = (e: React.DragEvent, etapeKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverEtape(etapeKey);
  };

  const handleDragLeave = () => {
    setDragOverEtape(null);
  };

  const handleDrop = (e: React.DragEvent, targetEtape: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("text/plain");
    
    if (dealId && targetEtape) {
      setDeals((prev) =>
        prev.map((deal) => {
          if (deal.id === dealId && deal.etape !== targetEtape) {
            const etapeLabel = ETAPES.find((et) => et.key === targetEtape)?.label;
            toast.success(`"${deal.nom}" déplacé vers ${etapeLabel}`);
            // Update probabilité based on stage
            let newProba = deal.probabilite;
            if (targetEtape === "gagne") newProba = 100;
            else if (targetEtape === "perdu") newProba = 0;
            return { ...deal, etape: targetEtape, probabilite: newProba };
          }
          return deal;
        })
      );
    }
    
    setDraggedDeal(null);
    setDragOverEtape(null);
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
    setDragOverEtape(null);
    // Reset drag flag after a tick so click handler can check it
    setTimeout(() => { didDrag.current = false; }, 100);
  };

  const openEditDeal = (deal: Deal) => {
    if (didDrag.current) return;
    setEditDeal(deal);
    setEditForm({
      nom: deal.nom,
      entreprise: deal.entreprise,
      montant: String(deal.montant),
      probabilite: String(deal.probabilite),
      etape: deal.etape,
      contact: deal.contact,
    });
  };

  const handleUpdateDeal = () => {
    if (!editDeal || !editForm.nom.trim() || !editForm.entreprise.trim() || !editForm.montant) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setDeals((prev) =>
      prev.map((d) =>
        d.id === editDeal.id
          ? { ...d, nom: editForm.nom.trim(), entreprise: editForm.entreprise.trim(), montant: parseFloat(editForm.montant), probabilite: parseInt(editForm.probabilite), etape: editForm.etape, contact: editForm.contact.trim() || "Non renseigné" }
          : d
      )
    );
    toast.success(`Opportunité "${editForm.nom}" mise à jour`);
    setEditDeal(null);
  };

  const handleDeleteDeal = () => {
    if (!deleteConfirmId) return;
    const deal = deals.find((d) => d.id === deleteConfirmId);
    setDeals((prev) => prev.filter((d) => d.id !== deleteConfirmId));
    toast.success(`Opportunité "${deal?.nom}" supprimée`);
    setDeleteConfirmId(null);
    setEditDeal(null);
  };

  const handleCreateDeal = () => {
    if (!newDeal.nom.trim() || !newDeal.entreprise.trim() || !newDeal.montant) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const deal: Deal = {
      id: `deal-${Date.now()}`,
      nom: newDeal.nom.trim(),
      entreprise: newDeal.entreprise.trim(),
      montant: parseFloat(newDeal.montant),
      probabilite: parseInt(newDeal.probabilite),
      etape: newDeal.etape,
      dateCreation: new Date().toLocaleDateString("fr-FR"),
      contact: newDeal.contact.trim() || "Non renseigné",
    };

    setDeals((prev) => [deal, ...prev]);
    setDialogOpen(false);
    setNewDeal({ nom: "", entreprise: "", montant: "", probabilite: "25", etape: "prospect", contact: "" });
    toast.success(`Opportunité "${deal.nom}" créée`);
  };

  const DealCard = ({ deal }: { deal: Deal }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, deal.id)}
      onDragEnd={handleDragEnd}
      className={`p-3 rounded-lg bg-background border border-border/50 space-y-1.5 transition-all cursor-grab active:cursor-grabbing group ${
        draggedDeal === deal.id ? "opacity-50 scale-95 border-primary" : "hover:border-primary/30"
      }`}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground/50 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{deal.nom}</p>
          <p className="text-xs text-muted-foreground truncate">{deal.entreprise}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pl-6">
        <span className="text-xs font-semibold text-primary">{deal.montant.toLocaleString("fr-FR")}€</span>
        <Badge variant="outline" className="text-[10px]">{deal.probabilite}%</Badge>
      </div>
    </div>
  );

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
            <Button className="gap-1.5" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Nouvelle opportunité
            </Button>
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
              const isOver = dragOverEtape === etape.key;
              return (
                <Card
                  key={etape.key}
                  className={`bg-muted/10 transition-all ${isOver ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
                  onDragOver={(e) => handleDragOver(e, etape.key)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, etape.key)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <Badge variant="outline" className={`${etape.color} text-xs`}>{etape.label}</Badge>
                      <span className="text-xs text-muted-foreground font-normal">{etapeTotal.toLocaleString("fr-FR")}€</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={`space-y-2 min-h-[120px] transition-colors ${isOver ? "bg-primary/5 rounded-b-lg" : ""}`}>
                    {etapeDeals.map((deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                    {etapeDeals.length === 0 && (
                      <p className={`text-xs text-center py-6 ${isOver ? "text-primary" : "text-muted-foreground"}`}>
                        {isOver ? "Déposer ici" : "Aucune opportunité"}
                      </p>
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
              const isOver = dragOverEtape === status;
              return (
                <Card
                  key={status}
                  className={`transition-all ${isOver ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
                  onDragOver={(e) => handleDragOver(e, status)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Badge variant="outline" className={`${etape.color} text-xs`}>{etape.label}</Badge>
                      <span className="text-xs text-muted-foreground font-normal">{statusDeals.length} deal(s)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={`min-h-[60px] transition-colors ${isOver ? "bg-primary/5 rounded-b-lg" : ""}`}>
                    {statusDeals.length === 0 && isOver && (
                      <p className="text-xs text-primary text-center py-3">Déposer ici</p>
                    )}
                    {statusDeals.map((deal) => (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal.id)}
                        onDragEnd={handleDragEnd}
                        className={`flex items-center justify-between py-2 text-sm cursor-grab active:cursor-grabbing group ${
                          draggedDeal === deal.id ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div>
                            <p className="font-medium">{deal.nom}</p>
                            <p className="text-xs text-muted-foreground">{deal.entreprise}</p>
                          </div>
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

        {/* Dialog nouvelle opportunité */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvelle opportunité</DialogTitle>
              <DialogDescription>Créez une nouvelle opportunité dans votre pipeline commercial.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du projet *</Label>
                <Input
                  id="nom"
                  placeholder="Ex: Refonte site web"
                  value={newDeal.nom}
                  onChange={(e) => setNewDeal((p) => ({ ...p, nom: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entreprise">Entreprise / Client *</Label>
                <Input
                  id="entreprise"
                  placeholder="Ex: Ma Société SAS"
                  value={newDeal.entreprise}
                  onChange={(e) => setNewDeal((p) => ({ ...p, entreprise: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="montant">Montant (€) *</Label>
                  <Input
                    id="montant"
                    type="number"
                    placeholder="5000"
                    value={newDeal.montant}
                    onChange={(e) => setNewDeal((p) => ({ ...p, montant: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="probabilite">Probabilité (%)</Label>
                  <Select value={newDeal.probabilite} onValueChange={(v) => setNewDeal((p) => ({ ...p, probabilite: v }))}>
                    <SelectTrigger id="probabilite"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[10, 25, 40, 50, 60, 70, 80, 90, 95].map((p) => (
                        <SelectItem key={p} value={String(p)}>{p}%</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="etape">Étape</Label>
                <Select value={newDeal.etape} onValueChange={(v) => setNewDeal((p) => ({ ...p, etape: v }))}>
                  <SelectTrigger id="etape"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {pipelineEtapes.map((e) => (
                      <SelectItem key={e.key} value={e.key}>{e.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact (facultatif)</Label>
                <Input
                  id="contact"
                  placeholder="Ex: Jean Dupont"
                  value={newDeal.contact}
                  onChange={(e) => setNewDeal((p) => ({ ...p, contact: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleCreateDeal}>Créer l'opportunité</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </AdminPageTransition>
    </AdminLayout>
  );
}
