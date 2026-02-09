import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useDemoData } from "@/contexts/DemoDataContext";
import { ArrowLeft, FolderOpen, CreditCard, ExternalLink, Link2, AlertTriangle, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CahierDesChargesForm } from "@/components/admin/CahierDesChargesForm";

const etapes = ["Demande reçue", "Devis envoyé", "Devis accepté", "Cahier des charges", "En cours", "Livraison", "Terminé"];

function getEtapeIndex(statut: string, cdcComplete: boolean): number {
  switch (statut) {
    case "en_attente": return 1;
    case "en_cours": return cdcComplete ? 4 : 2;
    case "termine": return 6;
    case "annule": return -1;
    default: return 0;
  }
}

export default function ClientDossierDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDossierById, getFacturesByDossier, getDevisByDossier, getCahierByDossier, saveCahierDesCharges, dossiers } = useDemoData();
  const dossier = id ? getDossierById(id) : undefined;
  const facturesDossier = id ? getFacturesByDossier(id) : [];
  const devisDossier = id ? getDevisByDossier(id) : [];
  const cahier = id ? getCahierByDossier(id) : undefined;
  const [cdcFormOpen, setCdcFormOpen] = useState(false);

  if (!dossier) {
    return <ClientLayout><div className="p-8 text-center text-muted-foreground">Dossier introuvable</div></ClientLayout>;
  }

  const cdcComplete = cahier?.statut === "complet";
  const isCdcRequired = (dossier.statut === "en_cours" || dossier.statut === "termine") && dossier.demandeId && !cdcComplete;
  const etapeActive = getEtapeIndex(dossier.statut, cdcComplete);

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </Button>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6 text-[hsl(200,100%,60%)]" />
                  {dossier.reference}
                </h1>
                <p className="text-muted-foreground text-sm">{dossier.typePrestation} — {dossier.clientNom}</p>
              </div>
              <StatusBadge status={dossier.statut} />
            </div>
          </motion.div>

          {/* CDC Required Banner */}
          {isCdcRequired && (
            <motion.div
              className="rounded-lg border border-[hsl(45,100%,50%)]/30 bg-[hsl(45,100%,50%)]/10 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              variants={staggerItem}
            >
              <div className="flex items-start gap-3 flex-1">
                <AlertTriangle className="h-5 w-5 text-[hsl(45,100%,50%)] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Cahier des charges requis</p>
                  <p className="text-xs text-muted-foreground">Vous devez compléter le cahier des charges pour que le développement puisse commencer.</p>
                </div>
              </div>
              <Button size="sm" onClick={() => setCdcFormOpen(true)} className="gap-1.5 shrink-0">
                <FileText className="h-3.5 w-3.5" /> Remplir le cahier des charges
              </Button>
            </motion.div>
          )}

          {/* Admin feedback - read only */}
          {cahier?.commentairesAdmin && (
            <motion.div
              className="glass-card p-4 border border-border/30"
              variants={staggerItem}
            >
              <h2 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[hsl(200,100%,60%)]" />
                Retours de l'équipe
              </h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{cahier.commentairesAdmin}</p>
            </motion.div>
          )}

          {/* Info */}
          <motion.div className="glass-card p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm" variants={staggerItem}>
            <div><p className="text-muted-foreground text-xs sm:text-sm">Montant</p><p className="font-bold text-base sm:text-lg">{dossier.montant.toLocaleString()} €</p></div>
            <div><p className="text-muted-foreground text-xs sm:text-sm">Création</p><p>{new Date(dossier.dateCreation).toLocaleDateString("fr-FR")}</p></div>
            <div><p className="text-muted-foreground text-xs sm:text-sm">Échéance</p><p>{new Date(dossier.dateEcheance).toLocaleDateString("fr-FR")}</p></div>
            <div><p className="text-muted-foreground text-xs sm:text-sm">Prestation</p><p>{dossier.typePrestation}</p></div>
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
                      }`}>
                        {i === 3 ? <FileText className="h-3 w-3" /> : i + 1}
                      </div>
                      <span className="text-[10px] mt-1 text-center leading-tight">{e}</span>
                      {i === 3 && (
                        <span className={`text-[8px] ${cdcComplete ? "text-green-400" : "text-[hsl(45,100%,50%)]"}`}>
                          {cdcComplete ? "Validé" : "À remplir"}
                        </span>
                      )}
                    </div>
                    {i < etapes.length - 1 && (
                      <div className={`h-0.5 flex-1 min-w-4 ${i < etapeActive ? "bg-primary" : "bg-border"}`} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Preview Link */}
          {dossier.previewUrl && (
            <motion.div className="glass-card p-5" variants={staggerItem}>
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-[hsl(200,100%,60%)]" />
                Preview du projet
              </h2>
              <div className="flex items-center gap-3">
                <p className="text-sm text-muted-foreground flex-1">Consultez l'avancement de votre projet en temps réel</p>
                <a href={dossier.previewUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" /> Voir la preview
                  </Button>
                </a>
              </div>
            </motion.div>
          )}

          {/* Devis */}
          {devisDossier.length > 0 && (
            <motion.div className="glass-card p-5" variants={staggerItem}>
              <h2 className="text-sm font-semibold mb-3">Devis associés</h2>
              <div className="space-y-2">
                {devisDossier.map((d) => (
                  <div key={d.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-muted/20 gap-2">
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
                  <div key={f.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-muted/20 gap-2">
                    <div><p className="text-sm font-mono">{f.reference}</p></div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
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

        {/* CDC Form Dialog */}
        {dossier.demandeId && (
          <CahierDesChargesForm
            open={cdcFormOpen}
            onOpenChange={setCdcFormOpen}
            demandeId={dossier.demandeId}
            existing={cahier}
            onSave={saveCahierDesCharges}
          />
        )}
      </AdminPageTransition>
    </ClientLayout>
  );
}
