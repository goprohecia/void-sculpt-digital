import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDossiers } from "@/hooks/use-dossiers";
import { useClientDossier } from "@/hooks/use-client-dossier";
import { toast } from "sonner";
import type { Client } from "@/data/mockData";
import type { DossierStatus } from "@/data/mockData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
}

export function CreateDossierDialog({ open, onOpenChange, clients }: Props) {
  const { dossiers, addDossier } = useDossiers();
  const { linkClient } = useClientDossier();
  const [clientId, setClientId] = useState("");
  const [typePrestation, setTypePrestation] = useState("");
  const [montant, setMontant] = useState("");
  const [dateEcheance, setDateEcheance] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedClient = clients.find((c) => c.id === clientId);

  const handleSubmit = () => {
    if (!clientId || !typePrestation) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }
    setLoading(true);
    const ref = `DOS-${new Date().getFullYear()}-${String(dossiers.length + 1).padStart(3, "0")}`;
    const id = crypto.randomUUID();
    const newDossier = {
      id,
      reference: ref,
      clientId,
      clientNom: selectedClient ? `${selectedClient.prenom} ${selectedClient.nom}` : "",
      typePrestation,
      montant: parseFloat(montant) || 0,
      statut: "en_attente" as DossierStatus,
      dateCreation: new Date().toISOString().split("T")[0],
      dateEcheance: dateEcheance || "",
    };
    addDossier(newDossier);
    linkClient({ clientId, dossierId: id });
    toast.success(`Dossier ${ref} créé avec succès`);
    resetForm();
    onOpenChange(false);
    setLoading(false);
  };

  const resetForm = () => {
    setClientId("");
    setTypePrestation("");
    setMontant("");
    setDateEcheance("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau dossier</DialogTitle>
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
            <Label>Type de prestation *</Label>
            <Input value={typePrestation} onChange={(e) => setTypePrestation(e.target.value)} placeholder="Ex: Création site web" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Montant (€)</Label>
              <Input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label>Date d'échéance</Label>
              <Input type="date" value={dateEcheance} onChange={(e) => setDateEcheance(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={loading}>Créer le dossier</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
