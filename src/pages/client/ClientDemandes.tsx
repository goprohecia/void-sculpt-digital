import { useState } from "react";
import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useDemoData, type DemandePrestation, type Demande } from "@/contexts/DemoDataContext";
import { DEMO_CLIENT_ID } from "@/data/mockData";
import { Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const prestationTypes: DemandePrestation[] = ["Site web", "App mobile", "E-commerce", "Back-office", "360", "Autre"];

export default function ClientDemandes() {
  const { demandes, addDemande, getDemandesByClient } = useDemoData();
  const mesDemandes = getDemandesByClient(DEMO_CLIENT_ID);
  const [open, setOpen] = useState(false);
  const [titre, setTitre] = useState("");
  const [typePrestation, setTypePrestation] = useState<DemandePrestation>("Site web");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = () => {
    if (!titre.trim() || !description.trim()) {
      toast.error("Veuillez remplir le titre et la description");
      return;
    }
    const newDemande: Demande = {
      id: `dem${Date.now()}`,
      reference: `DEM-2026-${String(demandes.length + 4).padStart(3, "0")}`,
      clientId: DEMO_CLIENT_ID,
      clientNom: "Luxe & Mode",
      titre: titre.trim(),
      typePrestation,
      description: description.trim(),
      budget: budget.trim() || undefined,
      statut: "nouvelle",
      dateCreation: new Date().toISOString().split("T")[0],
      dateMiseAJour: new Date().toISOString().split("T")[0],
    };
    addDemande(newDemande);
    toast.success("Demande envoyée avec succès");
    setTitre(""); setDescription(""); setBudget(""); setTypePrestation("Site web");
    setOpen(false);
  };

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div className="flex items-center justify-between" variants={staggerItem}>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Send className="h-6 w-6 text-[hsl(200,100%,60%)]" />
                Mes demandes
              </h1>
              <p className="text-muted-foreground text-sm">{mesDemandes.length} demande{mesDemandes.length > 1 ? "s" : ""}</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1"><Plus className="h-4 w-4" /> Nouvelle demande</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Nouvelle demande de projet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Titre du projet *</label>
                    <Input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex: Refonte site vitrine" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Type de prestation *</label>
                    <Select value={typePrestation} onValueChange={(v) => setTypePrestation(v as DemandePrestation)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {prestationTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Description détaillée *</label>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez votre projet..." rows={4} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Budget estimatif (optionnel)</label>
                    <Input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Ex: 10 000 – 15 000 €" />
                  </div>
                  <Button onClick={handleSubmit} className="w-full">Envoyer la demande</Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          <motion.div className="space-y-3" variants={staggerContainer} initial="initial" animate="animate">
            {mesDemandes.map((d) => (
              <motion.div key={d.id} variants={staggerItem} className="glass-card p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{d.reference}</span>
                  <StatusBadge status={d.statut} />
                </div>
                <p className="font-medium text-sm">{d.titre}</p>
                <p className="text-xs text-muted-foreground">{d.typePrestation}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{d.description}</p>
                <div className="flex items-center justify-between pt-1 border-t border-border/20">
                  {d.budget && <span className="text-xs text-muted-foreground">Budget : {d.budget}</span>}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(d.dateCreation).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </motion.div>
            ))}
            {mesDemandes.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">Aucune demande pour le moment</div>
            )}
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </ClientLayout>
  );
}
