import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Plus, Search, AlertTriangle, ArrowDownUp, Truck, Tags, FolderPlus, Trash2 } from "lucide-react";
import { useProduits, useCategories, useFournisseurs, useStockMouvements, useBonsCommande } from "@/hooks/use-produits";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AdminStock() {
  const { produits, addProduit, deleteProduit, isPending } = useProduits();
  const { categories, addCategory, deleteCategory } = useCategories();
  const { fournisseurs, addFournisseur, deleteFournisseur } = useFournisseurs();
  const { mouvements, addMouvement } = useStockMouvements();
  const { bonsCommande, addBonCommande, updateBonStatut } = useBonsCommande();

  const [search, setSearch] = useState("");
  const [openProduct, setOpenProduct] = useState(false);
  const [openMvt, setOpenMvt] = useState(false);
  const [openCat, setOpenCat] = useState(false);
  const [openFourn, setOpenFourn] = useState(false);
  const [openBC, setOpenBC] = useState(false);

  const [prodForm, setProdForm] = useState({ reference: "", nom: "", description: "", categorie_id: "", fournisseur_id: "", prix_achat: 0, prix_vente: 0, quantite_stock: 0, seuil_alerte: 5, unite: "unité", sku: "" });
  const [mvtForm, setMvtForm] = useState({ produit_id: "", type: "entree", quantite: 1, motif: "" });
  const [catForm, setCatForm] = useState({ nom: "", couleur: "#6366f1" });
  const [fournForm, setFournForm] = useState({ nom: "", email: "", telephone: "", ville: "" });
  const [bcForm, setBcForm] = useState({ reference: "", fournisseur_id: "", montant_total: 0, notes: "" });

  const alertes = produits.filter((p: any) => p.quantite_stock <= p.seuil_alerte);
  const filteredProduits = produits.filter((p: any) =>
    `${p.nom} ${p.reference} ${p.sku}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProduit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduit({ ...prodForm, categorie_id: prodForm.categorie_id || undefined, fournisseur_id: prodForm.fournisseur_id || undefined } as any);
      toast.success("Produit ajouté");
      setOpenProduct(false);
      setProdForm({ reference: "", nom: "", description: "", categorie_id: "", fournisseur_id: "", prix_achat: 0, prix_vente: 0, quantite_stock: 0, seuil_alerte: 5, unite: "unité", sku: "" });
    } catch { toast.error("Erreur"); }
  };

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
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2"><Package className="h-6 w-6 text-primary" /> Gestion de stock</h1>
              <p className="text-muted-foreground text-sm">{produits.length} produits · {alertes.length} alertes stock</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={() => setOpenCat(true)} className="gap-1"><Tags className="h-3.5 w-3.5" /> Catégorie</Button>
              <Button size="sm" variant="outline" onClick={() => setOpenFourn(true)} className="gap-1"><Truck className="h-3.5 w-3.5" /> Fournisseur</Button>
              <Button size="sm" variant="outline" onClick={() => setOpenBC(true)} className="gap-1"><FolderPlus className="h-3.5 w-3.5" /> Bon commande</Button>
              <Button size="sm" variant="outline" onClick={() => setOpenMvt(true)} className="gap-1"><ArrowDownUp className="h-3.5 w-3.5" /> Mouvement</Button>
              <Button size="sm" onClick={() => setOpenProduct(true)} className="gap-1"><Plus className="h-3.5 w-3.5" /> Produit</Button>
            </div>
          </motion.div>

          {alertes.length > 0 && (
            <motion.div variants={staggerItem}>
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="p-4">
                  <p className="text-sm font-medium flex items-center gap-2 text-destructive"><AlertTriangle className="h-4 w-4" /> {alertes.length} produit(s) en stock bas</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {alertes.slice(0, 5).map((p: any) => (
                      <Badge key={p.id} variant="destructive" className="text-xs">{p.nom} ({p.quantite_stock}/{p.seuil_alerte})</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <Tabs defaultValue="produits">
            <TabsList>
              <TabsTrigger value="produits">Produits ({produits.length})</TabsTrigger>
              <TabsTrigger value="mouvements">Mouvements</TabsTrigger>
              <TabsTrigger value="commandes">Bons commande ({bonsCommande.length})</TabsTrigger>
              <TabsTrigger value="fournisseurs">Fournisseurs ({fournisseurs.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="produits" className="space-y-4 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher un produit..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Réf.</TableHead>
                        <TableHead>Produit</TableHead>
                        <TableHead className="hidden md:table-cell">Catégorie</TableHead>
                        <TableHead className="text-right">P. Achat</TableHead>
                        <TableHead className="text-right">P. Vente</TableHead>
                        <TableHead className="text-center">Stock</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProduits.length === 0 ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucun produit</TableCell></TableRow>
                      ) : filteredProduits.map((p: any) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-mono text-xs">{p.reference}</TableCell>
                          <TableCell><div><p className="font-medium text-sm">{p.nom}</p>{p.fournisseurs?.nom && <p className="text-xs text-muted-foreground">{p.fournisseurs.nom}</p>}</div></TableCell>
                          <TableCell className="hidden md:table-cell">
                            {p.product_categories ? <Badge variant="secondary" style={{ borderColor: p.product_categories.couleur }} className="text-xs">{p.product_categories.nom}</Badge> : "—"}
                          </TableCell>
                          <TableCell className="text-right text-sm">{p.prix_achat} €</TableCell>
                          <TableCell className="text-right text-sm font-medium">{p.prix_vente} €</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={p.quantite_stock <= p.seuil_alerte ? "destructive" : "default"}>{p.quantite_stock}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button size="sm" variant="ghost" onClick={() => deleteProduit(p.id).then(() => toast.success("Supprimé"))}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mouvements" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-center">Qté</TableHead>
                        <TableHead>Motif</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mouvements.length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Aucun mouvement</TableCell></TableRow>
                      ) : mouvements.map((m: any) => (
                        <TableRow key={m.id}>
                          <TableCell className="text-xs text-muted-foreground">{format(new Date(m.created_at), "dd MMM yyyy HH:mm", { locale: fr })}</TableCell>
                          <TableCell><Badge variant={m.type === "entree" ? "default" : m.type === "sortie" ? "destructive" : "secondary"}>{m.type}</Badge></TableCell>
                          <TableCell className="text-center font-medium">{m.type === "sortie" ? "-" : "+"}{m.quantite}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{m.motif || "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="commandes" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Réf.</TableHead>
                        <TableHead>Fournisseur</TableHead>
                        <TableHead className="text-right">Montant</TableHead>
                        <TableHead className="text-center">Statut</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bonsCommande.length === 0 ? (
                        <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Aucun bon de commande</TableCell></TableRow>
                      ) : bonsCommande.map((bc: any) => (
                        <TableRow key={bc.id}>
                          <TableCell className="font-mono text-xs">{bc.reference}</TableCell>
                          <TableCell>{bc.fournisseurs?.nom || "—"}</TableCell>
                          <TableCell className="text-right font-medium">{bc.montant_total} €</TableCell>
                          <TableCell className="text-center"><Badge variant={bc.statut === "livree" ? "default" : "secondary"}>{bc.statut}</Badge></TableCell>
                          <TableCell className="text-center">
                            <Select onValueChange={(v) => updateBonStatut({ id: bc.id, statut: v }).then(() => toast.success("Statut mis à jour"))}>
                              <SelectTrigger className="w-28 h-7 text-xs"><SelectValue placeholder="Statut" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="brouillon">Brouillon</SelectItem>
                                <SelectItem value="envoyee">Envoyée</SelectItem>
                                <SelectItem value="livree">Livrée</SelectItem>
                                <SelectItem value="annulee">Annulée</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fournisseurs" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fournisseur</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Ville</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fournisseurs.length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Aucun fournisseur</TableCell></TableRow>
                      ) : fournisseurs.map((f: any) => (
                        <TableRow key={f.id}>
                          <TableCell className="font-medium">{f.nom}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{f.email || "—"}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{f.ville || "—"}</TableCell>
                          <TableCell className="text-center">
                            <Button size="sm" variant="ghost" onClick={() => deleteFournisseur(f.id).then(() => toast.success("Supprimé"))}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Add Product Dialog */}
        <Dialog open={openProduct} onOpenChange={setOpenProduct}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Nouveau produit</DialogTitle></DialogHeader>
            <form onSubmit={handleAddProduit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Référence *</Label><Input value={prodForm.reference} onChange={(e) => setProdForm(f => ({ ...f, reference: e.target.value }))} required /></div>
                <div className="space-y-2"><Label>Nom *</Label><Input value={prodForm.nom} onChange={(e) => setProdForm(f => ({ ...f, nom: e.target.value }))} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select value={prodForm.categorie_id} onValueChange={(v) => setProdForm(f => ({ ...f, categorie_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                    <SelectContent>{categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fournisseur</Label>
                  <Select value={prodForm.fournisseur_id} onValueChange={(v) => setProdForm(f => ({ ...f, fournisseur_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                    <SelectContent>{fournisseurs.map((f: any) => <SelectItem key={f.id} value={f.id}>{f.nom}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2"><Label>P. Achat</Label><Input type="number" value={prodForm.prix_achat} onChange={(e) => setProdForm(f => ({ ...f, prix_achat: +e.target.value }))} /></div>
                <div className="space-y-2"><Label>P. Vente</Label><Input type="number" value={prodForm.prix_vente} onChange={(e) => setProdForm(f => ({ ...f, prix_vente: +e.target.value }))} /></div>
                <div className="space-y-2"><Label>Stock</Label><Input type="number" value={prodForm.quantite_stock} onChange={(e) => setProdForm(f => ({ ...f, quantite_stock: +e.target.value }))} /></div>
                <div className="space-y-2"><Label>Seuil</Label><Input type="number" value={prodForm.seuil_alerte} onChange={(e) => setProdForm(f => ({ ...f, seuil_alerte: +e.target.value }))} /></div>
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>{isPending ? "Ajout..." : "Ajouter"}</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Movement Dialog */}
        <Dialog open={openMvt} onOpenChange={setOpenMvt}>
          <DialogContent>
            <DialogHeader><DialogTitle>Mouvement de stock</DialogTitle></DialogHeader>
            <form onSubmit={handleAddMvt} className="space-y-4">
              <div className="space-y-2">
                <Label>Produit</Label>
                <Select value={mvtForm.produit_id} onValueChange={(v) => setMvtForm(f => ({ ...f, produit_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Choisir un produit" /></SelectTrigger>
                  <SelectContent>{produits.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.nom} ({p.reference})</SelectItem>)}</SelectContent>
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
                      <SelectItem value="ajustement">Ajustement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Quantité</Label><Input type="number" min={1} value={mvtForm.quantite} onChange={(e) => setMvtForm(f => ({ ...f, quantite: +e.target.value }))} /></div>
              </div>
              <div className="space-y-2"><Label>Motif</Label><Input value={mvtForm.motif} onChange={(e) => setMvtForm(f => ({ ...f, motif: e.target.value }))} /></div>
              <Button type="submit" className="w-full" disabled={!mvtForm.produit_id}>Enregistrer</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Category Dialog */}
        <Dialog open={openCat} onOpenChange={setOpenCat}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouvelle catégorie</DialogTitle></DialogHeader>
            <form onSubmit={async (e) => { e.preventDefault(); await addCategory(catForm); toast.success("Catégorie ajoutée"); setOpenCat(false); setCatForm({ nom: "", couleur: "#6366f1" }); }} className="space-y-4">
              <div className="space-y-2"><Label>Nom</Label><Input value={catForm.nom} onChange={(e) => setCatForm(f => ({ ...f, nom: e.target.value }))} required /></div>
              <div className="space-y-2"><Label>Couleur</Label><Input type="color" value={catForm.couleur} onChange={(e) => setCatForm(f => ({ ...f, couleur: e.target.value }))} /></div>
              <Button type="submit" className="w-full">Ajouter</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Fournisseur Dialog */}
        <Dialog open={openFourn} onOpenChange={setOpenFourn}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouveau fournisseur</DialogTitle></DialogHeader>
            <form onSubmit={async (e) => { e.preventDefault(); await addFournisseur(fournForm); toast.success("Fournisseur ajouté"); setOpenFourn(false); setFournForm({ nom: "", email: "", telephone: "", ville: "" }); }} className="space-y-4">
              <div className="space-y-2"><Label>Nom *</Label><Input value={fournForm.nom} onChange={(e) => setFournForm(f => ({ ...f, nom: e.target.value }))} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Email</Label><Input value={fournForm.email} onChange={(e) => setFournForm(f => ({ ...f, email: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Téléphone</Label><Input value={fournForm.telephone} onChange={(e) => setFournForm(f => ({ ...f, telephone: e.target.value }))} /></div>
              </div>
              <div className="space-y-2"><Label>Ville</Label><Input value={fournForm.ville} onChange={(e) => setFournForm(f => ({ ...f, ville: e.target.value }))} /></div>
              <Button type="submit" className="w-full">Ajouter</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Bon de Commande Dialog */}
        <Dialog open={openBC} onOpenChange={setOpenBC}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouveau bon de commande</DialogTitle></DialogHeader>
            <form onSubmit={async (e) => { e.preventDefault(); await addBonCommande(bcForm); toast.success("Bon de commande créé"); setOpenBC(false); setBcForm({ reference: "", fournisseur_id: "", montant_total: 0, notes: "" }); }} className="space-y-4">
              <div className="space-y-2"><Label>Référence *</Label><Input value={bcForm.reference} onChange={(e) => setBcForm(f => ({ ...f, reference: e.target.value }))} required /></div>
              <div className="space-y-2">
                <Label>Fournisseur *</Label>
                <Select value={bcForm.fournisseur_id} onValueChange={(v) => setBcForm(f => ({ ...f, fournisseur_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>{fournisseurs.map((f: any) => <SelectItem key={f.id} value={f.id}>{f.nom}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Montant total</Label><Input type="number" value={bcForm.montant_total} onChange={(e) => setBcForm(f => ({ ...f, montant_total: +e.target.value }))} /></div>
              <Button type="submit" className="w-full" disabled={!bcForm.fournisseur_id}>Créer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </AdminPageTransition>
    </AdminLayout>
  );
}
