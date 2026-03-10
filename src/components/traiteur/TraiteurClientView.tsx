import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_COMMANDES, MOCK_FORMULES, TRAITEUR_STEPS } from "@/data/mockTraiteurData";
import { TraiteurStepper } from "./TraiteurStepper";
import { UtensilsCrossed, FileText, CheckCircle, PenLine, Euro, Clock } from "lucide-react";
import { toast } from "sonner";

export function TraiteurClientView() {
  const commande = MOCK_COMMANDES[1]; // mariage – step 3 = menu validé
  const [step, setStep] = useState(commande.step);
  const [menuPostes, setMenuPostes] = useState(commande.menu.map((m) => ({ ...m })));
  const [contratSigne, setContratSigne] = useState(commande.contratSigne);
  const [menuValide, setMenuValide] = useState(false);

  const total = menuPostes.reduce((sum, m) => sum + m.quantite * m.prixUnitaire, 0);

  const togglePosteValidation = (id: string) => {
    setMenuPostes((prev) => prev.map((m) => m.id === id ? { ...m, valide: !m.valide } : m));
  };

  const updateQuantite = (id: string, qty: number) => {
    setMenuPostes((prev) => prev.map((m) => m.id === id ? { ...m, quantite: Math.max(0, qty) } : m));
  };

  const handleValiderMenu = () => {
    setMenuValide(true);
    setStep(Math.max(step, 2));
    toast.success("Menu validé ! Le traiteur prépare votre contrat.");
  };

  const handleSignerContrat = () => {
    setContratSigne(true);
    setStep(Math.max(step, 3));
    toast.success("Contrat signé électroniquement !");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><UtensilsCrossed className="h-6 w-6 text-primary" /> Ma commande traiteur</h1>
        <p className="text-muted-foreground text-sm">{commande.type} — {new Date(commande.date).toLocaleDateString("fr-FR")} · {commande.nbCouverts} couverts</p>
      </div>

      {/* Stepper */}
      <Card className="glass-card">
        <CardContent className="p-4 space-y-2">
          <TraiteurStepper currentStep={step} />
          <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Livraison prévue : {new Date(commande.date).toLocaleDateString("fr-FR")} à {commande.heureLivraison}</span>
          </div>
        </CardContent>
      </Card>

      {/* Devis interactif */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Devis — Sélection menu</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {menuPostes.map((poste) => (
            <div key={poste.id} className={`p-3 rounded-lg border transition-colors ${poste.valide ? "border-primary/30 bg-primary/5" : "border-border/30 bg-muted/20"}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs text-muted-foreground">{poste.categorie}</span>
                  <p className="text-sm font-medium">{poste.nom}</p>
                </div>
                <Button size="sm" variant={poste.valide ? "default" : "outline"} onClick={() => togglePosteValidation(poste.id)} disabled={menuValide} className="gap-1">
                  {poste.valide ? <><CheckCircle className="h-3.5 w-3.5" /> Validé</> : "Valider"}
                </Button>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Qté :</span>
                  <Input type="number" value={poste.quantite} onChange={(e) => updateQuantite(poste.id, parseInt(e.target.value) || 0)} className="w-20 h-8" disabled={menuValide} />
                </div>
                <span className="text-muted-foreground">× {poste.prixUnitaire} €</span>
                <span className="ml-auto font-semibold">{(poste.quantite * poste.prixUnitaire).toLocaleString()} €</span>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
            <span className="font-medium">Total</span>
            <span className="text-xl font-bold">{total.toLocaleString()} €</span>
          </div>

          {!menuValide ? (
            <Button onClick={handleValiderMenu} className="w-full" disabled={!menuPostes.some((m) => m.valide)}>
              <CheckCircle className="h-4 w-4 mr-2" /> Valider le menu
            </Button>
          ) : (
            <Badge variant="secondary" className="text-xs gap-1"><CheckCircle className="h-3 w-3" /> Menu validé</Badge>
          )}
        </CardContent>
      </Card>

      {/* Formules disponibles */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Nos formules</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {MOCK_FORMULES.map((f) => (
            <div key={f.id} className="p-3 rounded-lg bg-muted/30">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold">{f.nom}</p>
                <Badge variant="outline" className="text-xs">{f.prixParCouvert} € / couvert</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{f.description}</p>
              <div className="flex flex-wrap gap-1">
                {f.plats.map((p) => <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contrat */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><PenLine className="h-4 w-4" /> Contrat</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-muted/30 text-sm space-y-1">
            <p><span className="text-muted-foreground">Événement :</span> {commande.type}</p>
            <p><span className="text-muted-foreground">Date :</span> {new Date(commande.date).toLocaleDateString("fr-FR")}</p>
            <p><span className="text-muted-foreground">Lieu :</span> {commande.lieu}</p>
            <p><span className="text-muted-foreground">Couverts :</span> {commande.nbCouverts}</p>
            <p><span className="text-muted-foreground">Montant :</span> <span className="font-semibold">{total.toLocaleString()} €</span></p>
          </div>

          {contratSigne ? (
            <Badge variant="secondary" className="text-xs gap-1"><CheckCircle className="h-3 w-3" /> Contrat signé électroniquement</Badge>
          ) : (
            <Button onClick={handleSignerContrat} disabled={!menuValide} className="w-full gap-2">
              <PenLine className="h-4 w-4" /> Signer le contrat électroniquement
            </Button>
          )}
          {!menuValide && !contratSigne && (
            <p className="text-xs text-muted-foreground">Validez d'abord le menu pour pouvoir signer le contrat.</p>
          )}
        </CardContent>
      </Card>

      {/* Paiement */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Euro className="h-4 w-4" /> Paiement</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Acompte</span><p className="font-medium">{commande.acompte} €</p></div>
            <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Total</span><p className="font-medium">{total.toLocaleString()} €</p></div>
            <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Solde</span><p className="font-medium">{(total - commande.acompte).toLocaleString()} €</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
