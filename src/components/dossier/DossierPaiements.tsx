import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Check, AlertTriangle, Clock, Plus, Bell } from "lucide-react";
import { toast } from "sonner";
import type { Facture } from "@/data/mockData";

interface Props {
  dossierId: string;
  facturesDossier: Facture[];
  montantTotal: number;
  onMarquerPayee?: (id: string) => void;
}

export function DossierPaiements({ dossierId, facturesDossier, montantTotal, onMarquerPayee }: Props) {
  const encaisse = facturesDossier.filter(f => f.statut === "payee").reduce((s, f) => s + f.montant, 0);
  const restantDu = montantTotal - encaisse;

  const statutIcon = (statut: string) => {
    if (statut === "payee") return <Badge className="bg-primary/20 text-primary border-primary/30 gap-1"><Check className="h-3 w-3" /> Payé</Badge>;
    if (statut === "en_retard") return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> Retard</Badge>;
    return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> En attente</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Totaux */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-xl font-bold">{montantTotal.toLocaleString()} €</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-xs text-muted-foreground">Encaissé</p>
          <p className="text-xl font-bold text-[hsl(var(--primary))]">{encaisse.toLocaleString()} €</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-xs text-muted-foreground">Restant dû</p>
          <p className="text-xl font-bold text-destructive">{restantDu.toLocaleString()} €</p>
        </div>
      </div>

      {facturesDossier.length > 0 ? (
        <div className="rounded-lg border bg-card p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facturesDossier.map(f => (
                <TableRow key={f.id}>
                  <TableCell className="font-mono text-xs">{f.reference}</TableCell>
                  <TableCell className="font-medium">{f.montant.toLocaleString()} €</TableCell>
                  <TableCell className="text-sm">{new Date(f.dateEcheance).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>{statutIcon(f.statut)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {f.statut !== "payee" && onMarquerPayee && (
                        <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => { onMarquerPayee(f.id); toast.success("Marqué comme payé"); }}>
                          <Check className="h-3 w-3" /> Payé
                        </Button>
                      )}
                      {f.statut !== "payee" && (
                        <Button size="sm" variant="ghost" className="text-xs" onClick={() => toast.success("Relance envoyée")}>
                          <Bell className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-12 flex flex-col items-center justify-center text-center">
          <CreditCard className="h-12 w-12 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground mb-3">Aucun paiement enregistré</p>
          <Button className="gap-1.5"><Plus className="h-4 w-4" /> Ajouter un versement</Button>
        </div>
      )}
    </div>
  );
}
