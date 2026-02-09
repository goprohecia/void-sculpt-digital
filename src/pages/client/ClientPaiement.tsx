import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { useDemoData } from "@/contexts/DemoDataContext";
import { CreditCard, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ClientPaiement() {
  const { factureId } = useParams<{ factureId: string }>();
  const navigate = useNavigate();
  const { getFactureById, updateFactureStatut, dossiers } = useDemoData();
  const facture = factureId ? getFactureById(factureId) : undefined;
  const dossier = facture ? dossiers.find((d) => d.id === facture.dossierId) : undefined;

  const [methode, setMethode] = useState<"carte" | "virement">("carte");
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  if (!facture) {
    return (
      <ClientLayout>
        <div className="p-8 text-center text-muted-foreground">Facture introuvable</div>
      </ClientLayout>
    );
  }

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      updateFactureStatut(facture.id, "payee");
      setPaid(true);
      setLoading(false);
      toast.success("Paiement confirmé !");
    }, 2000);
  };

  if (paid) {
    return (
      <ClientLayout>
        <AdminPageTransition>
          <motion.div className="flex flex-col items-center justify-center py-20 space-y-6"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <motion.div
              className="rounded-full bg-[hsl(155,100%,45%)]/20 p-6"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
              <CheckCircle className="h-16 w-16 text-[hsl(155,100%,55%)]" />
            </motion.div>
            <h1 className="text-2xl font-bold">Paiement confirmé</h1>
            <p className="text-muted-foreground">{facture.reference} — {facture.montant.toLocaleString()} €</p>
            <Button variant="outline" onClick={() => navigate("/client/factures")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Retour aux factures
            </Button>
          </motion.div>
        </AdminPageTransition>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div className="max-w-xl mx-auto space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </Button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-[hsl(200,100%,60%)]" />
              Paiement
            </h1>
          </motion.div>

          {/* Récapitulatif */}
          <motion.div className="glass-card p-5 space-y-3" variants={staggerItem}>
            <h2 className="text-sm font-semibold">Récapitulatif</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-muted-foreground">Facture</p><p className="font-mono">{facture.reference}</p></div>
              <div><p className="text-muted-foreground">Client</p><p>{facture.clientNom}</p></div>
              {dossier && <div><p className="text-muted-foreground">Dossier</p><p className="font-mono">{dossier.reference}</p></div>}
              <div><p className="text-muted-foreground">Échéance</p><p>{new Date(facture.dateEcheance).toLocaleDateString("fr-FR")}</p></div>
            </div>
            <div className="pt-3 border-t border-border/20">
              <p className="text-2xl font-bold">{facture.montant.toLocaleString()} €</p>
            </div>
          </motion.div>

          {/* Méthode */}
          <motion.div className="glass-card p-5 space-y-4" variants={staggerItem}>
            <h2 className="text-sm font-semibold">Méthode de paiement</h2>
            <div className="flex gap-3">
              {(["carte", "virement"] as const).map((m) => (
                <button key={m} onClick={() => setMethode(m)}
                  className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-colors ${
                    methode === m ? "border-primary bg-primary/10 text-primary" : "border-border/50 text-muted-foreground hover:border-border"
                  }`}>
                  {m === "carte" ? "Carte bancaire" : "Virement"}
                </button>
              ))}
            </div>

            {methode === "carte" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Numéro de carte</label>
                  <Input defaultValue="4242 4242 4242 4242" className="font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Expiration</label>
                    <Input defaultValue="12/28" className="font-mono" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">CVV</label>
                    <Input defaultValue="123" className="font-mono" />
                  </div>
                </div>
              </div>
            )}
            {methode === "virement" && (
              <div className="p-3 rounded-lg bg-muted/20 text-sm space-y-1">
                <p className="font-medium">Coordonnées bancaires</p>
                <p className="text-muted-foreground font-mono text-xs">IBAN : FR76 1234 5678 9012 3456 7890 123</p>
                <p className="text-muted-foreground font-mono text-xs">BIC : IMPARTFR2X</p>
                <p className="text-muted-foreground text-xs mt-2">Référence : {facture.reference}</p>
              </div>
            )}
          </motion.div>

          <motion.div variants={staggerItem}>
            <Button onClick={handlePay} disabled={loading} className="w-full h-12 text-base">
              {loading ? <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Traitement...</> : `Confirmer le paiement de ${facture.montant.toLocaleString()} €`}
            </Button>
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </ClientLayout>
  );
}
