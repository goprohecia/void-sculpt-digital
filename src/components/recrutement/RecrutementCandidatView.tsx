import { useState } from "react";
import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { SectorStepper } from "@/components/admin/SectorStepper";
import { MOCK_CANDIDATS, RECRUTEMENT_STEPS } from "@/data/mockRecrutementData";
import { User, FileCheck, MessageSquare, CalendarDays } from "lucide-react";

// Simulate logged-in candidate
const CURRENT_CANDIDAT_ID = "cand-1";

export function RecrutementCandidatView() {
  const candidat = MOCK_CANDIDATS.find((c) => c.id === CURRENT_CANDIDAT_ID)!;
  const [checklist, setChecklist] = useState(candidat.documentsChecklist);

  const toggleDoc = (index: number) => {
    setChecklist((prev) =>
      prev.map((item, i) => (i === index ? { ...item, fourni: !item.fourni } : item))
    );
  };

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              Espace Candidat
            </h1>
            <p className="text-muted-foreground text-sm">Suivez l'avancement de votre candidature</p>
          </motion.div>

          {/* Current step */}
          <motion.div variants={staggerItem}>
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Votre candidature</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SectorStepper currentStep={candidat.etape - 1} />
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Message personnalisé</span>
                  </div>
                  <p className="text-sm text-foreground">{candidat.messagePersonnalise}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Checklist documents */}
          <motion.div variants={staggerItem}>
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-primary" />
                  Documents à fournir
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {checklist.map((doc, i) => (
                  <div key={doc.label} className="flex items-center gap-3">
                    <Checkbox
                      checked={doc.fourni}
                      onCheckedChange={() => toggleDoc(i)}
                    />
                    <span className={`text-sm ${doc.fourni ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {doc.label}
                    </span>
                    {doc.fourni && <Badge variant="secondary" className="text-[10px]">Fourni</Badge>}
                  </div>
                ))}
                <p className="text-xs text-muted-foreground mt-2">
                  {checklist.filter((d) => d.fourni).length}/{checklist.length} documents fournis
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Prochaine action */}
          <motion.div variants={staggerItem}>
            <Card className="glass-card border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Prochaine action attendue</span>
                </div>
                <p className="text-sm">{candidat.prochaineAction}</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </ClientLayout>
  );
}
