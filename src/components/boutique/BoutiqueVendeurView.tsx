import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_BOUTIQUE_PRODUITS, type BoutiqueProduit } from "@/data/mockBoutiqueData";
import { Search, Package, ShoppingCart, AlertTriangle, Plus, Minus, Receipt } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  produit: BoutiqueProduit;
  quantite: number;
}

export function BoutiqueVendeurView() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showVente, setShowVente] = useState(false);

  const filtered = MOCK_BOUTIQUE_PRODUITS.filter((p) =>
    `${p.nom} ${p.reference}`.toLowerCase().includes(search.toLowerCase())
  );

  const alertes = MOCK_BOUTIQUE_PRODUITS.filter((p) => p.stock <= p.seuilAlerte);

  const addToCart = (produit: BoutiqueProduit) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.produit.id === produit.id);
      if (existing) {
        return prev.map((c) => c.produit.id === produit.id ? { ...c, quantite: c.quantite + 1 } : c);
      }
      return [...prev, { produit, quantite: 1 }];
    });
  };

  const removeFromCart = (produitId: string) => {
    setCart((prev) => prev
      .map((c) => c.produit.id === produitId ? { ...c, quantite: c.quantite - 1 } : c)
      .filter((c) => c.quantite > 0)
    );
  };

  const totalCart = cart.reduce((sum, c) => sum + c.produit.prixVente * c.quantite, 0);

  const handleValiderVente = () => {
    toast.success(`Vente de ${totalCart.toFixed(2)} € enregistrée`);
    setCart([]);
    setShowVente(false);
  };

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" /> Espace Vendeur
        </h1>
        <p className="text-muted-foreground text-sm">
          Stock temps réel · {alertes.length} alerte(s)
        </p>
      </motion.div>

      {alertes.length > 0 && (
        <motion.div variants={staggerItem}>
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4 space-y-2">
              <p className="text-sm font-medium flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" /> Produits en rupture ou stock faible
              </p>
              <div className="flex flex-wrap gap-2">
                {alertes.map((a) => (
                  <Badge key={a.id} variant="destructive" className="text-xs">
                    {a.nom} — {a.stock} restant(s)
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un produit (nom ou réf.)..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button size="sm" onClick={() => setShowVente(true)} className="gap-1" disabled={cart.length === 0}>
          <ShoppingCart className="h-3.5 w-3.5" /> Panier ({cart.length}) — {totalCart.toFixed(2)} €
        </Button>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader><CardTitle className="text-base">Stock en temps réel</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Réf.</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead className="text-right">Prix</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Aucun produit trouvé</TableCell>
                  </TableRow>
                ) : filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.reference}</TableCell>
                    <TableCell className="font-medium text-sm">{p.nom}</TableCell>
                    <TableCell className="text-right text-sm">{p.prixVente.toFixed(2)} €</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={p.stock <= p.seuilAlerte ? "destructive" : p.stock <= p.seuilAlerte * 2 ? "secondary" : "default"}>
                        {p.stock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button size="sm" variant="ghost" onClick={() => addToCart(p)} disabled={p.stock === 0}>
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Vente Dialog */}
      <Dialog open={showVente} onOpenChange={setShowVente}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" /> Saisie de vente</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.produit.id} className="flex items-center justify-between p-2 rounded border">
                <div>
                  <p className="text-sm font-medium">{item.produit.nom}</p>
                  <p className="text-xs text-muted-foreground">{item.produit.prixVente.toFixed(2)} € × {item.quantite}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{(item.produit.prixVente * item.quantite).toFixed(2)} €</p>
                  <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.produit.id)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => addToCart(item.produit)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-3 border-t font-bold">
              <span>Total</span>
              <span>{totalCart.toFixed(2)} €</span>
            </div>
            <Button className="w-full" onClick={handleValiderVente}>Valider la vente</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
