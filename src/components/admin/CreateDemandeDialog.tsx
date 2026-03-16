import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDemandes } from "@/hooks/use-demandes";
import type { DemandePrestation } from "@/contexts/DemoDataContext";
import { toast } from "sonner";
import type { Client } from "@/data/mockData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
}

export function CreateDemandeDialog({ open, onOpenChange, clients }: Props) {
  const { demandes, addDemande } = useDemandes();
  const [clientId, setClientId] = useState("");
  const [titre, setTitre] = useState("");
  const [typePrestation, setTypePrestation] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedClient = clients.find((c) => c.id === clientId);

  const handleSubmit = () => {
    if (!clientId || !titre || !typePrestation) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }
    setLoading(true);
    const ref = `DEM-${new Date().getFullYear()}-${String(demandes.length + 1).padStart(3, "0")}`;
    const newDemande = {
      id: crypto.randomUUID(),
      reference: ref,
      clientId,
      clientNom: selectedClient ? `${selectedClient.prenom} ${selectedClient.nom}` : "",
      titre,
      typePrestation,
      description,
      budget: budget || undefined,
      statut: "nouvelle" as const,
      dateCreation: new Date().toISOString().split("T")[0],
      dateMiseAJour: new Date().toISOString().split("T")[0],
    };
    addDemande(newDemande);
    toast.success(`Demande ${ref} créée avec succès`);
    resetForm();
    onOpenChange(false);
    setLoading(false);
  };

  const resetForm = () => {
    setClientId("");
    setTitre("");
    setTypePrestation("");
    setDescription("");
    setBudget("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle demande</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Client *</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger><SelectValue placeholder="Sélectionner un client" /></SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.prenom} {c.nom} {c.entreprise ? `(${c.entreprise})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Titre *</Label>
            <Input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex: Refonte site vitrine" />
          </div>
          <div className="space-y-1.5">
            <Label>Type de prestation *</Label>
            <Input value={typePrestation} onChange={(e) => setTypePrestation(e.target.value)} placeholder="Ex: Développement web" />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Détails de la demande..." rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label>Budget (optionnel)</Label>
            <Input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Ex: 2000-5000€" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={loading}>Créer la demande</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
