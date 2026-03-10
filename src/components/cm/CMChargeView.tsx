import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  MOCK_CM_CONTENUS, MOCK_CM_CLIENTS, RESEAU_COLORS, type CMContenu, type CMContentStatus,
} from "@/data/mockCMData";
import {
  Megaphone, CalendarDays, PenTool, Plus, Instagram, Facebook, Linkedin, Clock,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_LABELS: Record<CMContentStatus, string> = {
  brouillon: "Brouillon",
  a_valider: "À valider",
  valide: "Validé",
  publie: "Publié",
};

const STATUS_VARIANTS: Record<CMContentStatus, "outline" | "secondary" | "default" | "destructive"> = {
  brouillon: "outline",
  a_valider: "secondary",
  valide: "default",
  publie: "default",
};

export function CMChargeView() {
  // Simulate current CM handles cmc1 & cmc2
  const mesClients = MOCK_CM_CLIENTS.filter((c) => c.cmAssigne === "Léa Martin");
  const [selectedClient, setSelectedClient] = useState(mesClients[0]?.id || "");
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ titre: "", texte: "", reseau: "Instagram", datePublication: "" });

  const contenusClient = MOCK_CM_CONTENUS.filter((c) => c.clientId === selectedClient);

  // Group by date for calendar-like view
  const dates = [...new Set(contenusClient.map((c) => c.datePublication))].sort();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Contenu créé (mock)");
    setShowCreate(false);
    setCreateForm({ titre: "", texte: "", reseau: "Instagram", datePublication: "" });
  };

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-primary" /> Espace CM
        </h1>
        <p className="text-muted-foreground text-sm">{mesClients.length} comptes clients</p>
      </motion.div>

      <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          {mesClients.map((c) => (
            <Button key={c.id} size="sm" variant={selectedClient === c.id ? "default" : "outline"} onClick={() => setSelectedClient(c.id)}>
              {c.nom}
            </Button>
          ))}
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1 ml-auto">
          <Plus className="h-3.5 w-3.5" /> Nouveau contenu
        </Button>
      </motion.div>

      {/* Calendrier éditorial */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Calendrier éditorial — {mesClients.find((c) => c.id === selectedClient)?.nom}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {dates.map((date) => (
              <div key={date}>
                <p className="text-xs font-semibold text-muted-foreground mb-2">{date}</p>
                <div className="space-y-2">
                  {contenusClient.filter((c) => c.datePublication === date).map((c) => (
                    <div key={c.id} className="flex items-start justify-between p-3 rounded-lg border gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`text-xs ${RESEAU_COLORS[c.reseau] || ""}`}>{c.reseau}</Badge>
                          <Badge variant={STATUS_VARIANTS[c.statut]} className="text-xs">{STATUS_LABELS[c.statut]}</Badge>
                        </div>
                        <p className="font-medium text-sm">{c.titre}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{c.texte}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {dates.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Aucun contenu planifié</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog création */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><PenTool className="h-5 w-5" /> Nouveau contenu</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2"><Label>Titre</Label><Input value={createForm.titre} onChange={(e) => setCreateForm((f) => ({ ...f, titre: e.target.value }))} placeholder="Titre du post" /></div>
            <div className="space-y-2"><Label>Texte</Label><Textarea value={createForm.texte} onChange={(e) => setCreateForm((f) => ({ ...f, texte: e.target.value }))} placeholder="Rédigez le contenu..." rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Réseau</Label>
                <Select value={createForm.reseau} onValueChange={(v) => setCreateForm((f) => ({ ...f, reseau: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Instagram", "Facebook", "LinkedIn", "TikTok", "X"].map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Date publication</Label><Input type="date" value={createForm.datePublication} onChange={(e) => setCreateForm((f) => ({ ...f, datePublication: e.target.value }))} /></div>
            </div>
            <div className="space-y-2">
              <Label>Visuel</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground text-xs">
                Glissez un fichier ici ou cliquez pour importer (simulé)
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={!createForm.titre}>Créer le contenu</Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
