import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDemoData } from "@/contexts/DemoDataContext";
import { useDemoPlan } from "@/contexts/DemoPlanContext";
import { isAssignationEnabled } from "@/data/sectorModules";
import { FolderOpen, Crown, Shield, Eye } from "lucide-react";
import { GarageMechanicView } from "@/components/garage/GarageMechanicView";

// For demo, simulate the logged-in employee as "demo-emp-1"
const CURRENT_EMPLOYEE_ID = "demo-emp-1";

export default function EmployeeDossiers() {
  const { getDossiersByEmployee } = useDemoData();
  const { demoSector } = useDemoPlan();
  const assignEnabled = isAssignationEnabled(demoSector);

  if (demoSector === "garages") {
    const { GarageMechanicView } = require("@/components/garage/GarageMechanicView");
    return <GarageMechanicView />;
  }

  const myDossiers = getDossiersByEmployee(CURRENT_EMPLOYEE_ID);

  if (!assignEnabled) {
    return (
      <EmployeeLayout>
        <AdminPageTransition>
          <div className="p-8 text-center text-muted-foreground">
            L'assignation n'est pas activée pour ce secteur d'activité.
          </div>
        </AdminPageTransition>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FolderOpen className="h-6 w-6 text-primary" />
              Mes dossiers
            </h1>
            <p className="text-muted-foreground text-sm">
              {myDossiers.length} dossier{myDossiers.length > 1 ? "s" : ""} assigné{myDossiers.length > 1 ? "s" : ""}
            </p>
          </motion.div>

          {myDossiers.length > 0 ? (
            <motion.div className="space-y-3" variants={staggerContainer} initial="initial" animate="animate">
              {myDossiers.map(({ dossier, role }) => (
                <Link key={dossier.id} to={`/admin/dossiers/${dossier.id}`}>
                  <motion.div variants={staggerItem} className="glass-card p-4 space-y-2 hover:bg-muted/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{dossier.reference}</span>
                        {role === "responsable" ? (
                          <Badge className="text-[10px] px-1.5 py-0 bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1">
                            <Crown className="h-2.5 w-2.5" /> Responsable
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1">
                            <Shield className="h-2.5 w-2.5" /> Renfort
                          </Badge>
                        )}
                      </div>
                      <StatusBadge status={dossier.statut} />
                    </div>
                    <p className="font-medium text-sm">{dossier.clientNom}</p>
                    <p className="text-xs text-muted-foreground">{dossier.typePrestation}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-border/20">
                      <span className="text-sm font-medium">{dossier.montant.toLocaleString()} €</span>
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Eye className="h-3 w-3" /> Voir
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          ) : (
            <motion.div variants={staggerItem}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Mes dossiers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Aucun dossier assigné pour le moment.</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
