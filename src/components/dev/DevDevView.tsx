import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MOCK_DEV_PROJETS, MOCK_DEV_TICKETS, KANBAN_COLUMNS, PRIORITE_COLORS,
  type DevTicket, type DevTicketStatus,
} from "@/data/mockDevData";
import { Code, Send, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function DevDevView() {
  const mesProjets = MOCK_DEV_PROJETS.filter((p) => p.devAssigne === "Alex Morel");
  const [selectedProjet, setSelectedProjet] = useState(mesProjets[0]?.id || "");
  const [tickets, setTickets] = useState<DevTicket[]>(MOCK_DEV_TICKETS);

  const projetTickets = tickets.filter((t) => t.projetId === selectedProjet);

  const handleSubmitRecette = () => {
    setTickets((prev) =>
      prev.map((t) => t.projetId === selectedProjet && t.statut === "a_livrer" ? { ...t, statut: "termine" as DevTicketStatus } : t)
    );
    toast.success("Sprint soumis à la recette client (mock)");
  };

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" /> Espace Développeur
        </h1>
        <p className="text-muted-foreground text-sm">{mesProjets.length} projet(s) actif(s)</p>
      </motion.div>

      <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex gap-2 flex-wrap">
          {mesProjets.map((p) => (
            <Button key={p.id} size="sm" variant={selectedProjet === p.id ? "default" : "outline"} onClick={() => setSelectedProjet(p.id)}>
              {p.clientNom}
            </Button>
          ))}
        </div>
        <Button size="sm" variant="secondary" className="gap-1 ml-auto" onClick={handleSubmitRecette}>
          <Send className="h-3.5 w-3.5" /> Soumettre à la recette
        </Button>
      </motion.div>

      {/* Kanban board */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {KANBAN_COLUMNS.map((col) => {
          const colTickets = projetTickets.filter((t) => t.statut === col.key);
          return (
            <Card key={col.key} className={cn("border-t-2", col.color)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  {col.label}
                  <Badge variant="outline" className="text-xs">{colTickets.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 min-h-[120px]">
                {colTickets.map((t) => (
                  <div key={t.id} className="p-3 rounded-lg border bg-background space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm leading-tight">{t.titre}</p>
                      <Badge className={cn("text-[10px] px-1.5", PRIORITE_COLORS[t.priorite])}>
                        {t.priorite}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{t.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{t.sprintCible}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.tempsEstime}h</span>
                    </div>
                  </div>
                ))}
                {colTickets.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">Aucun ticket</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
