import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MOCK_FICHES, MOCK_STOCK_PIECES, CHECKLIST_TESTS, REPARATEUR_STEPS } from "@/data/mockReparateurData";
import { ReparateurStepper } from "./ReparateurStepper";
import { Wrench, Smartphone, Package, ClipboardCheck, FileText } from "lucide-react";
import { toast } from "sonner";

export function ReparateurTechnicienView() {
  const mesFiches = MOCK_FICHES.filter((f) => f.technicien === "Karim B.");
  const [selected, setSelected] = useState(mesFiches[0]);
  const [devisEnvoye, setDevisEnvoye] = useState<Record<string, boolean>>({});
  const [testsCoches, setTestsCoches] = useState<Record<string, Set<string>>>({});
  const [stockLocal, setStockLocal] = useState(MOCK_STOCK_PIECES.map((p) => ({ ...p })));
  const [piecesUtilisees, setPiecesUtilisees] = useState<Record<string, Set<string>>>({});

  if (!selected) return null;

  const checks = testsCoches[selected.id] ?? new Set<string>();
  const pieces = piecesUtilisees[selected.id] ?? new Set<string>();

  const toggleTest = (test: string) => {
    setTestsCoches((prev) => {
      const s = new Set(prev[selected.id] ?? []);
      if (s.has(test)) s.delete(test); else s.add(test);
      return { ...prev, [selected.id]: s };
    });
  };

  const utiliserPiece = (pieceNom: string) => {
    const piece = stockLocal.find((p) => p.nom === pieceNom);
    if (!piece || piece.quantite <= 0) { toast.error("Stock insuffisant !"); return; }
    setStockLocal((prev) => prev.map((p) => p.nom === pieceNom ? { ...p, quantite: p.quantite - 1 } : p));
    setPiecesUtilisees((prev) => {
      const s = new Set(prev[selected.id] ?? []);
      s.add(pieceNom);
      return { ...prev, [selected.id]: s };
    });
    toast.success(`Pièce "${pieceNom}" utilisée — stock décrémenté`);
  };

  const handleDevisPret = () => {
    setDevisEnvoye((prev) => ({ ...prev, [selected.id]: true }));
    toast.success(`Devis de ${selected.montantDevis} € envoyé à ${selected.client} !`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Wrench className="h-6 w-6 text-primary" /> Espace Technicien</h1>
        <p className="text-muted-foreground text-sm">Vos appareils assignés</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {mesFiches.map((f) => (
          <Button key={f.id} variant={selected.id === f.id ? "default" : "outline"} size="sm" onClick={() => setSelected(f)}>
            {f.marque} {f.modele}
          </Button>
        ))}
      </div>

      <Card className="glass-card"><CardContent className="p-4"><ReparateurStepper currentStep={selected.step} /></CardContent></Card>

      {/* Fiche technique */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Smartphone className="h-4 w-4" /> Fiche technique</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Marque</span><p className="font-medium">{selected.marque}</p></div>
          <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Modèle</span><p className="font-medium">{selected.modele}</p></div>
          <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Panne déclarée</span><p className="font-medium">{selected.panneDeclaree}</p></div>
          <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Panne constatée</span><p className="font-medium">{selected.panneConstatee}</p></div>
        </CardContent>
      </Card>

      {/* Pièces nécessaires */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4" /> Pièces nécessaires</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {selected.piecesNecessaires.map((nom) => {
            const piece = stockLocal.find((p) => p.nom === nom);
            const used = pieces.has(nom);
            return (
              <div key={nom} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium">{nom}</p>
                  <p className="text-xs text-muted-foreground">Stock : {piece?.quantite ?? 0} · {piece?.reference}</p>
                </div>
                {used ? (
                  <Badge variant="secondary" className="text-xs">Utilisée ✓</Badge>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => utiliserPiece(nom)} disabled={!piece || piece.quantite <= 0}>
                    Utiliser
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Devis */}
      {!devisEnvoye[selected.id] && selected.step <= 2 && (
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Devis</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 text-sm">
              <p>Appareil : {selected.marque} {selected.modele}</p>
              <p>Diagnostic : {selected.panneConstatee}</p>
              <p className="font-semibold mt-1">Montant : {selected.montantDevis} €</p>
            </div>
            <Button onClick={handleDevisPret}><FileText className="h-4 w-4 mr-2" /> Devis prêt — Notifier le client</Button>
          </CardContent>
        </Card>
      )}

      {/* Checklist tests */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><ClipboardCheck className="h-4 w-4" /> Tests post-réparation</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {CHECKLIST_TESTS.map((test) => (
            <label key={test} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
              <Checkbox checked={checks.has(test)} onCheckedChange={() => toggleTest(test)} />
              <span className="text-sm">{test}</span>
            </label>
          ))}
          <p className="text-xs text-muted-foreground pt-2">{checks.size}/{CHECKLIST_TESTS.length} tests validés</p>
        </CardContent>
      </Card>
    </div>
  );
}
