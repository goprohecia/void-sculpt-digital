import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SectorOnboardingBanner } from "@/components/admin/SectorOnboardingBanner";
import {
  MOCK_MISSIONS, MOCK_DECLARATIONS, MOCK_COLLABORATEURS_COMPTABLES,
  COMPTABLE_STEPS, COMPTABLE_KPIS,
} from "@/data/mockComptableData";
import {
  Calculator, Users, Euro, CalendarDays, Briefcase,
  AlertTriangle, FileText, Clock,
} from "lucide-react";

export function ComptableDashboard() {
  const now = new Date("2026-03-10");
  const alerteDeclarations = MOCK_DECLARATIONS.filter(d => {
    const ech = new Date(d.echeance);
    const diff = (ech.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7 && diff >= 0 && d.statut !== "envoyee";
  });
  const alertePieces = MOCK_MISSIONS.filter(m => {
    const diff = (now.getTime() - new Date(m.dateDernieresPieces).getTime()) / (1000 * 60 * 60 * 24);
    return m.piecesManquantes.length > 0 && diff > 14;
  });

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <SectorOnboardingBanner />

      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          Espace Cabinet
        </h1>
        <p className="text-muted-foreground text-sm">Portefeuille clients, échéances fiscales et facturation</p>
      </motion.div>

      {/* KPIs */}
      <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3" variants={staggerItem}>
        {[
          { icon: Briefcase, label: "Missions", value: COMPTABLE_KPIS.missionsActives, color: "text-primary" },
          { icon: FileText, label: "Décl. à faire", value: COMPTABLE_KPIS.declarationsAFaire, color: "text-amber-400" },
          { icon: CalendarDays, label: "Décl. sem.", value: COMPTABLE_KPIS.declarationsCetteSemaine, color: "text-violet-400" },
          { icon: AlertTriangle, label: "Pièces manq.", value: COMPTABLE_KPIS.piecesManquantes, color: "text-destructive" },
          { icon: Euro, label: "Honoraires", value: `${(COMPTABLE_KPIS.honorairesTotaux / 1000).toFixed(1)}k€`, color: "text-primary" },
          { icon: Euro, label: "Encaissés", value: `${(COMPTABLE_KPIS.honorairesEncaisses / 1000).toFixed(1)}k€`, color: "text-emerald-400" },
        ].map((kpi) => (
          <Card key={kpi.label} className="glass-card">
            <CardContent className="p-4 text-center">
              <kpi.icon className={`h-5 w-5 mx-auto mb-1 ${kpi.color}`} />
              <p className="text-xl font-bold">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Alertes */}
      {(alerteDeclarations.length > 0 || alertePieces.length > 0) && (
        <motion.div variants={staggerItem}>
          <Card className="glass-card border-destructive/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Alertes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {alerteDeclarations.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-2 rounded bg-destructive/5">
                  <span className="text-sm">📋 {d.entrepriseNom} — {d.type}</span>
                  <Badge variant="destructive" className="text-[10px]">Échéance {d.echeance}</Badge>
                </div>
              ))}
              {alertePieces.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-2 rounded bg-destructive/5">
                  <span className="text-sm">📎 {m.entrepriseNom} — {m.piecesManquantes.length} pièce(s) manquante(s)</span>
                  <Badge variant="outline" className="text-[10px] text-destructive">Depuis {m.dateDernieresPieces}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Portefeuille clients */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Portefeuille clients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_MISSIONS.map((m) => {
              const progress = Math.round(((m.etape - 1) / (COMPTABLE_STEPS.length - 1)) * 100);
              const collab = MOCK_COLLABORATEURS_COMPTABLES.find(c => c.id === m.collaborateurId);
              return (
                <div key={m.id} className="p-4 rounded-lg border border-border/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{m.entrepriseNom}</p>
                      <p className="text-xs text-muted-foreground">{m.formeJuridique} · {m.typeMission}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-[10px]">{COMPTABLE_STEPS[m.etape - 1]}</Badge>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{m.reference}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="h-1.5 flex-1" />
                    <span className="text-[10px] text-muted-foreground">{progress}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Collaborateur : {collab?.prenom} {collab?.nom}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {m.echeanceType} : {m.prochaineEcheanceFiscale}
                    </span>
                  </div>
                  {m.piecesManquantes.length > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-destructive">
                      <AlertTriangle className="h-3 w-3" />
                      {m.piecesManquantes.length} pièce(s) manquante(s)
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Collaborateurs */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Équipe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MOCK_COLLABORATEURS_COMPTABLES.map((c) => {
              const nb = MOCK_MISSIONS.filter(m => m.collaborateurId === c.id).length;
              return (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <p className="text-sm font-medium">{c.prenom} {c.nom}</p>
                    <p className="text-[10px] text-muted-foreground">{c.specialite}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{nb} dossier{nb > 1 ? "s" : ""}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Facturation */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Euro className="h-4 w-4 text-primary" />
              Honoraires
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MOCK_MISSIONS.map((m) => {
              const restant = m.honorairesAnnuels - m.honorairesPaies;
              return (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <p className="text-sm font-medium">{m.entrepriseNom}</p>
                    <p className="text-xs text-muted-foreground">{m.honorairesMensuels}€/mois · {m.honorairesAnnuels.toLocaleString()}€/an</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${restant > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                      {restant > 0 ? `Dû : ${restant.toLocaleString()} €` : "Soldé"}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
