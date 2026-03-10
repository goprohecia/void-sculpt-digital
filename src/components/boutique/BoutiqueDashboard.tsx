import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BoutiqueOnboardingBanner } from "./BoutiqueOnboardingBanner";
import { BoutiqueStepper } from "./BoutiqueStepper";
import {
  BOUTIQUE_KPIS,
  BOUTIQUE_STEPS,
  MOCK_BOUTIQUE_PRODUITS,
  MOCK_BOUTIQUE_COMMANDES,
  MOCK_BOUTIQUE_VENDEURS,
  MOCK_BOUTIQUE_COMMANDES_FOURNISSEURS,
} from "@/data/mockBoutiqueData";
import {
  ShoppingBag, Euro, Package, AlertTriangle, Users, TrendingUp,
  Truck, CalendarDays,
} from "lucide-react";

export function BoutiqueDashboard() {
  const [tab, setTab] = useState<"commandes" | "stock" | "fournisseurs" | "equipe">("commandes");

  const alertes = MOCK_BOUTIQUE_PRODUITS.filter((p) => p.stock <= p.seuilAlerte);

  const kpiCards = [
    { title: "CA du jour", value: `${BOUTIQUE_KPIS.caJour.toLocaleString()} €`, icon: Euro, color: "text-green-400" },
    { title: "CA semaine", value: `${BOUTIQUE_KPIS.caSemaine.toLocaleString()} €`, icon: TrendingUp, color: "text-blue-400" },
    { title: "Commandes jour", value: BOUTIQUE_KPIS.nbCommandesJour, icon: ShoppingBag, color: "text-violet-400" },
    { title: "Alertes stock", value: alertes.length, icon: AlertTriangle, color: "text-destructive" },
  ];

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <BoutiqueOnboardingBanner />
      </motion.div>

      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary" /> Espace Gérant
        </h1>
        <p className="text-muted-foreground text-sm">
          {BOUTIQUE_KPIS.produitsEnStock} produits en stock · Panier moyen {BOUTIQUE_KPIS.panierMoyen} €
        </p>
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpiCards.map((k) => (
          <Card key={k.title}>
            <CardContent className="p-4 flex items-center gap-3">
              <k.icon className={`h-5 w-5 ${k.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{k.title}</p>
                <p className="text-lg font-bold">{k.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div variants={staggerItem} className="flex gap-2 flex-wrap">
        {([
          { key: "commandes", label: "Commandes", icon: ShoppingBag },
          { key: "stock", label: "Stock", icon: Package },
          { key: "fournisseurs", label: "Fournisseurs", icon: Truck },
          { key: "equipe", label: "Équipe", icon: Users },
        ] as const).map((t) => (
          <Button
            key={t.key}
            size="sm"
            variant={tab === t.key ? "default" : "outline"}
            onClick={() => setTab(t.key)}
            className="gap-1"
          >
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </Button>
        ))}
      </motion.div>

      {tab === "commandes" && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader><CardTitle className="text-base">Commandes en cours</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Réf.</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Étape</TableHead>
                    <TableHead>Vendeur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_BOUTIQUE_COMMANDES.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-xs">{c.reference}</TableCell>
                      <TableCell className="font-medium text-sm">{c.clientNom}</TableCell>
                      <TableCell className="text-sm">{c.total.toFixed(2)} €</TableCell>
                      <TableCell>
                        <Badge variant={c.etape >= 5 ? "default" : "secondary"} className="text-xs">
                          {BOUTIQUE_STEPS[c.etape] || BOUTIQUE_STEPS[0]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.vendeur}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {tab === "stock" && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader><CardTitle className="text-base">Produits en stock</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Réf.</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead className="text-right">Prix vente</TableHead>
                    <TableHead className="text-center">Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_BOUTIQUE_PRODUITS.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.reference}</TableCell>
                      <TableCell className="font-medium text-sm">{p.nom}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.categorie}</TableCell>
                      <TableCell className="text-right text-sm">{p.prixVente.toFixed(2)} €</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={p.stock <= p.seuilAlerte ? "destructive" : "default"}>{p.stock}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {tab === "fournisseurs" && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader><CardTitle className="text-base">Commandes fournisseurs</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fournisseur</TableHead>
                    <TableHead>Réf.</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Livraison prévue</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_BOUTIQUE_COMMANDES_FOURNISSEURS.map((cf) => (
                    <TableRow key={cf.id}>
                      <TableCell className="font-medium text-sm">{cf.fournisseur}</TableCell>
                      <TableCell className="font-mono text-xs">{cf.reference}</TableCell>
                      <TableCell className="text-sm">{cf.montant.toLocaleString()} €</TableCell>
                      <TableCell className="text-sm">{cf.dateLivraisonPrevue}</TableCell>
                      <TableCell>
                        <Badge variant={cf.statut === "livree" ? "default" : cf.statut === "expediee" ? "secondary" : "outline"} className="text-xs capitalize">
                          {cf.statut === "en_cours" ? "En cours" : cf.statut === "expediee" ? "Expédiée" : "Livrée"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {tab === "equipe" && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader><CardTitle className="text-base">Planning vendeurs</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {MOCK_BOUTIQUE_VENDEURS.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-sm">{v.nom}</p>
                    <p className="text-xs text-muted-foreground">{v.poste}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{v.ca.toFixed(2)} € CA</p>
                    <p className="text-xs text-muted-foreground">{v.ventesJour} ventes aujourd'hui</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
