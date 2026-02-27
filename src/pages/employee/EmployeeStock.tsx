import { useState } from "react";
import { motion } from "framer-motion";
import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Search, AlertTriangle, ArrowDownUp } from "lucide-react";
import { useProduits, useStockMouvements } from "@/hooks/use-produits";
import { toast } from "sonner";

export default function EmployeeStock() {
  const { produits } = useProduits();
  const { mouvements, addMouvement, isPending } = useStockMouvements();
  const [search, setSearch] = useState("");
  const [openMvt, setOpenMvt] = useState(false);
  const [mvtForm, setMvtForm] = useState({ produit_id: "", type: "entree", quantite: 1, motif: "" });

  const alertes = produits.filter((p: any) => p.quantite_stock <= p.seuil_alerte);
  const filtered = produits.filter((p: any) => `${p.nom} ${p.reference}`.toLowerCase().includes(search.toLowerCase()));

  const handleAddMvt = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMouvement(mvtForm);
      toast.success("Mouvement enregistré");
      setOpenMvt(false);
      setMvtForm({ produit_id: "", type: "entree", quantite: 1, motif: "" });
    } catch { toast.error("Erreur"); }
  };

  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2"><Package className="h-6 w-6 text-primary" /> Stock</h1>
              <p className="text-muted-foreground text-sm">{produits.length} produits · {alertes.length} alertes</p>
            </div>
            <Button size="sm" onClick={() => setOpenMvt(true)} className="gap-1"><ArrowDownUp className="h-3.5 w-3.5" /> Mouvement</Button>
          </motion.div>

          {alertes.length > 0 && (
            <motion.div variants={staggerItem}>
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="p-4">
                  <p className="text-sm font-medium flex items-center gap-2 text-destructive"><AlertTriangle className="h-4 w-4" /> {alertes.length} produit(s) en stock bas</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div variants={staggerItem}>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Réf.</TableHead>
                      <TableHead>Produit</TableHead>
                      <TableHead className="text-right">Prix</TableHead>
                      <TableHead className="text-center">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Aucun produit</TableCell></TableRow>
                    ) : filtered.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-xs">{p.reference}</TableCell>
                        <TableCell className="font-medium text-sm">{p.nom}</TableCell>
                        <TableCell className="text-right text-sm">{p.prix_vente} €</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={p.quantite_stock <= p.seuil_alerte ? "destructive" : "default"}>{p.quantite_stock}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <Dialog open={openMvt} onOpenChange={setOpenMvt}>
          <DialogContent>
            <DialogHeader><DialogTitle>Mouvement de stock</DialogTitle></DialogHeader>
            <form onSubmit={handleAddMvt} className="space-y-4">
              <div className="space-y-2">
                <Label>Produit</Label>
                <Select value={mvtForm.produit_id} onValueChange={(v) => setMvtForm(f => ({ ...f, produit_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>{produits.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.nom}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={mvtForm.type} onValueChange={(v) => setMvtForm(f => ({ ...f, type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entree">Entrée</SelectItem>
                      <SelectItem value="sortie">Sortie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Quantité</Label><Input type="number" min={1} value={mvtForm.quantite} onChange={(e) => setMvtForm(f => ({ ...f, quantite: +e.target.value }))} /></div>
              </div>
              <div className="space-y-2"><Label>Motif</Label><Input value={mvtForm.motif} onChange={(e) => setMvtForm(f => ({ ...f, motif: e.target.value }))} /></div>
              <Button type="submit" className="w-full" disabled={!mvtForm.produit_id || isPending}>Enregistrer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
