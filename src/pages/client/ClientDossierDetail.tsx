import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useDemoData } from "@/contexts/DemoDataContext";
import { ArrowLeft, FolderOpen, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const etapes = ["Demande reçue", "Devis envoyé", "Devis accepté", "En cours", "Livraison", "Terminé"];

function getEtapeIndex(statut: string): number {
  switch (statut) {
    case "en_attente": return 1;
    case "en_cours": return 3;
    case "termine": return 5;
    case "annule": return -1;
    default: return 0;
  }
}

export default function ClientDossierDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDossierById, getFacturesByDossier, getDevisByDossier } = useDemoData();
  const dossier = id ? getDossierById(id) : undefined;
  const facturesDossier = id ? getFacturesByDossier(id) : [];
  const devisDossier = id ? getDevisByDossier(id) : [];

  if (!dossier) {
    return <ClientLayout><div className="p-8 text-center text-muted-foreground">Dossier introuvable</div></ClientLayout>;
  }

  const etapeActive = getEtapeIndex(dossier.statut);

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <FolderOpen className="h-6 w-6 text-[hsl(200,100%,60%)]" />
                  {dossier.reference}
                </h1>
                <p className="text-muted-foreground text-sm">{dossier.typePrestation} — {dossier.clientNom}</p>
              </div>
              <StatusBadge status={dossier.statut} />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div className="glass-card p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm" variants={staggerItem}>
            <div><p className="text-muted-foreground">Montant</p><p className="font-bold text-lg">{dossier.montant.toLocaleString()} €</p></div>
            <div><p className="text-muted-foreground">Création</p><p>{new Date(dossier.dateCreation).toLocaleDateString("fr-FR")}</p></div>
            <div><p className="text-muted-foreground">Échéance</p><p>{new Date(dossier.dateEcheance).toLocaleDateString("fr-FR")}</p></div>
            <div><p className="text-muted-foreground">Prestation</p><p>{dossier.typePrestation}</p></div>
          </motion.div>

          {/* Timeline */}
          {dossier.statut !== "annule" && (
            <motion.div className="glass-card p-5" variants={staggerItem}>
              <h2 className="text-sm font-semibold mb-4">Progression</h2>
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {etapes.map((e, i) => (
                  <div key={e} className="flex items-center flex-1 min-w-0">
                    <div className={`flex flex-col items-center flex-1 ${i <= etapeActive ? "text-primary" : "text-muted-foreground"}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i <= etapeActive ? "bg-primary text-primary-foreground" : "bg-muted border border-border"
                      }`}>{i + 1}</div>
                      <span className="text-[10px] mt-1 text-center leading-tight">{e}</span>
                    </div>
                    {i < etapes.length - 1 && (
                      <div className={`h-0.5 flex-1 min-w-4 ${i < etapeActive ? "bg-primary" : "bg-border"}`} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Devis */}
          {devisDossier.length > 0 && (
            <motion.div className="glass-card p-5" variants={staggerItem}>
              <h2 className="text-sm font-semibold mb-3">Devis associés</h2>
              <div className="space-y-2">
                {devisDossier.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div><p className="text-sm font-mono">{d.reference}</p><p className="text-xs text-muted-foreground">{d.titre}</p></div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{d.montant.toLocaleString()} €</span>
                      <StatusBadge status={d.statut} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Factures */}
          {facturesDossier.length > 0 && (
            <motion.div className="glass-card p-5" variants={staggerItem}>
              <h2 className="text-sm font-semibold mb-3">Factures associées</h2>
              <div className="space-y-2">
                {facturesDossier.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div><p className="text-sm font-mono">{f.reference}</p></div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{f.montant.toLocaleString()} €</span>
                      <StatusBadge status={f.statut} />
                      {(f.statut === "en_attente" || f.statut === "en_retard") && (
                        <Link to={`/client/paiement/${f.id}`}>
                          <Button size="sm" variant="outline" className="gap-1 text-xs">
                            <CreditCard className="h-3 w-3" /> Payer
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </AdminPageTransition>
    </ClientLayout>
  );
}
