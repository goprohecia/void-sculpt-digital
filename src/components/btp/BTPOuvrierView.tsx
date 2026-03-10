import { useState } from "react";
import { motion } from "framer-motion";
import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { MOCK_CHANTIERS, BTP_STEPS } from "@/data/mockBTPData";
import { HardHat, AlertTriangle, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const CURRENT_OUVRIER_ID = "ouv-1";

export function BTPOuvrierView() {
  const [chantiers, setChantiers] = useState(
    MOCK_CHANTIERS.filter((c) => c.ouvrierId === CURRENT_OUVRIER_ID && c.etape >= 2 && c.etape <= 4)
  );
  const [tachesDone, setTachesDone] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    chantiers.forEach((c) => c.taches.forEach((t) => { init[t.id] = t.done; }));
    return init;
  });
  const [showSignaler, setShowSignaler] = useState<string | null>(null);
  const [probleme, setProbleme] = useState("");

  const toggleTache = (id: string) => {
    setTachesDone((prev) => ({ ...prev, [id]: !prev[id] }));
    toast.success("Tâche mise à jour");
  };

  const handleSignaler = (chantierId: string) => {
    if (!probleme.trim()) return;
    toast.success("Problème signalé au dirigeant");
    setProbleme("");
    setShowSignaler(null);
  };

  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <HardHat className="h-6 w-6 text-primary" />
              Mes chantiers du jour
            </h1>
            <p className="text-muted-foreground text-sm">{chantiers.length} chantier{chantiers.length > 1 ? "s" : ""} assigné{chantiers.length > 1 ? "s" : ""}</p>
          </motion.div>

          {chantiers.length === 0 ? (
            <motion.div variants={staggerItem} className="glass-card p-6 text-center text-muted-foreground">
              Aucun chantier assigné pour le moment.
            </motion.div>
          ) : (
            <motion.div className="space-y-4" variants={staggerContainer} initial="initial" animate="animate">
              {chantiers.map((ch) => (
                <motion.div key={ch.id} variants={staggerItem} className="glass-card p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{ch.clientNom}</p>
                      <p className="text-xs text-muted-foreground">{ch.description}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      {BTP_STEPS[ch.etape]}
                    </Badge>
                  </div>

                  {/* Address + schedule */}
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {ch.adresse}, {ch.ville}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 08:00 – 17:00
                    </span>
                  </div>

                  {/* Tâches */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">Tâches du jour</p>
                    {ch.taches.map((t) => (
                      <div key={t.id} className="flex items-center gap-3">
                        <Checkbox
                          id={t.id}
                          checked={!!tachesDone[t.id]}
                          onCheckedChange={() => toggleTache(t.id)}
                        />
                        <label htmlFor={t.id} className={`text-sm cursor-pointer ${tachesDone[t.id] ? "line-through text-muted-foreground" : ""}`}>
                          {t.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Signaler un problème */}
                  {showSignaler === ch.id ? (
                    <div className="space-y-2 border-t border-border/30 pt-3">
                      <p className="text-xs font-semibold">Signaler un problème</p>
                      <Textarea
                        placeholder="Décrivez le problème rencontré..."
                        value={probleme}
                        onChange={(e) => setProbleme(e.target.value)}
                        className="text-sm"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSignaler(ch.id)}>Envoyer</Button>
                        <Button size="sm" variant="ghost" onClick={() => { setShowSignaler(null); setProbleme(""); }}>Annuler</Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs"
                      onClick={() => setShowSignaler(ch.id)}
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Signaler un problème
                    </Button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
