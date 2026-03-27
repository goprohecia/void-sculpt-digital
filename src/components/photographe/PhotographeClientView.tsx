import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_SEANCES, MOCK_GALLERY_IMAGES, PHOTOGRAPHE_STEPS } from "@/data/mockPhotographeData";
import { SectorStepper } from "@/components/admin/SectorStepper";
import { Camera, Heart, Download, Lock, Euro, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function PhotographeClientView() {
  const seance = MOCK_SEANCES[2]; // terminée with gallery
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [soldePaye, setSoldePaye] = useState(seance.soldePaye);
  const soldeRestant = seance.total - seance.acompte;

  const toggleFav = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    toast.success("Sélection mise à jour");
  };

  const handlePayerSolde = () => {
    setSoldePaye(true);
    toast.success("Solde réglé — galerie complète débloquée !");
  };

  const galerieAccessible = seance.galerieLivree && soldePaye;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Camera className="h-6 w-6 text-primary" /> Ma commande</h1>
        <p className="text-muted-foreground text-sm">{seance.type} — {seance.lieu}</p>
      </div>

      {/* Stepper */}
      <Card className="glass-card">
        <CardContent className="p-4 space-y-2">
          <SectorStepper currentStep={soldePaye ? 6 : seance.step} />
          <div className="flex justify-between text-xs text-muted-foreground pt-2">
            {PHOTOGRAPHE_STEPS.map((s, i) => (
              <span key={i} className="flex-1 text-center">{i <= 1 ? "J" : i <= 3 ? `J+${i * 3}` : `J+${i * 5}`}</span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Solde */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Euro className="h-4 w-4" /> Paiement</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Acompte</span><p className="font-medium">{seance.acompte} €</p></div>
            <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Total</span><p className="font-medium">{seance.total} €</p></div>
            <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Solde</span><p className="font-medium">{soldePaye ? "0 €" : `${soldeRestant} €`}</p></div>
          </div>
          {!soldePaye && (
            <div className="p-3 rounded-lg bg-amber-500/10 text-sm flex items-center gap-2">
              <Lock className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-medium">Galerie verrouillée</p>
                <p className="text-xs text-muted-foreground">Réglez le solde pour débloquer le téléchargement de toutes les photos.</p>
              </div>
            </div>
          )}
          {!soldePaye ? (
            <Button onClick={handlePayerSolde}>Régler le solde — {soldeRestant} €</Button>
          ) : (
            <Badge variant="secondary" className="text-xs gap-1"><CheckCircle className="h-3 w-3" /> Solde réglé</Badge>
          )}
        </CardContent>
      </Card>

      {/* Galerie */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Galerie privée</CardTitle>
            {galerieAccessible && (
              <Button size="sm" variant="outline" className="gap-1"><Download className="h-3.5 w-3.5" /> Télécharger toutes les photos</Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {seance.galerieLivree ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {MOCK_GALLERY_IMAGES.map((img) => (
                <div key={img.id} className={`relative group rounded-lg overflow-hidden border-2 transition-colors ${favorites.has(img.id) ? "border-primary" : "border-transparent"} ${!galerieAccessible ? "opacity-50" : ""}`}>
                  <div className="aspect-square bg-muted/30 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  {!galerieAccessible && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60"><Lock className="h-5 w-5 text-muted-foreground" /></div>
                  )}
                  {galerieAccessible && (
                    <button
                      onClick={() => toggleFav(img.id)}
                      className="absolute top-1 right-1 w-7 h-7 rounded-full bg-background/80 flex items-center justify-center transition-transform hover:scale-110"
                    >
                      <Heart className={`h-4 w-4 ${favorites.has(img.id) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    </button>
                  )}
                  <p className="text-[10px] text-center py-1 text-muted-foreground">{img.label}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground text-sm">La galerie sera disponible une fois les retouches terminées.</div>
          )}
          {galerieAccessible && favorites.size > 0 && (
            <p className="text-xs text-muted-foreground mt-3">{favorites.size} photo(s) sélectionnée(s) comme favorite(s)</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
