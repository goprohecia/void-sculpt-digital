import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MOCK_DJ_PRESTATIONS, MOCK_DJ_MATERIEL, type DJMateriel,
} from "@/data/mockDJData";
import {
  Music, MapPin, Phone, Wrench, ClipboardCheck, StickyNote, CalendarDays, Clock,
} from "lucide-react";
import { toast } from "sonner";

export function DJAssistantView() {
  const prestations = MOCK_DJ_PRESTATIONS.filter((p) => p.etape >= 3 && p.etape <= 5);
  const [materielState, setMaterielState] = useState<Record<string, DJMateriel[]>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const getMateriel = (prestId: string) =>
    materielState[prestId] || MOCK_DJ_MATERIEL.map((m) => ({ ...m }));

  const toggleMateriel = (prestId: string, matId: string) => {
    const current = getMateriel(prestId);
    setMaterielState((prev) => ({
      ...prev,
      [prestId]: current.map((m) => m.id === matId ? { ...m, checked: !m.checked } : m),
    }));
  };

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Music className="h-6 w-6 text-primary" /> Espace Assistant / Régisseur
        </h1>
        <p className="text-muted-foreground text-sm">{prestations.length} intervention(s) à préparer</p>
      </motion.div>

      {prestations.map((p) => {
        const mat = getMateriel(p.id);
        const checkedCount = mat.filter((m) => m.checked).length;
        return (
          <motion.div key={p.id} variants={staggerItem}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{p.clientNom} — {p.typeAnimation}</CardTitle>
                  <Badge variant="secondary" className="text-xs">{p.date}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Fiche technique */}
                <div className="p-3 rounded-lg border bg-muted/30 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Wrench className="h-3 w-3" /> Fiche technique</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-start gap-2"><MapPin className="h-3.5 w-3.5 mt-0.5 text-muted-foreground flex-shrink-0" /><div><p className="font-medium">{p.lieu}</p><p className="text-xs text-muted-foreground">{p.adresse}</p></div></div>
                    <div className="flex items-start gap-2"><Clock className="h-3.5 w-3.5 mt-0.5 text-muted-foreground flex-shrink-0" /><p>{p.duree}</p></div>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.setupTechnique}</p>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" /> Contacts</p>
                    {p.contacts.map((c, i) => (
                      <p key={i} className="text-xs">{c.nom} — {c.tel} <span className="text-muted-foreground">({c.role})</span></p>
                    ))}
                  </div>
                </div>

                {/* Checklist matériel */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                    <ClipboardCheck className="h-3 w-3" /> Checklist matériel ({checkedCount}/{mat.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {mat.map((m) => (
                      <label key={m.id} className="flex items-center gap-2 text-sm cursor-pointer p-1.5 rounded hover:bg-muted/30 transition-colors">
                        <Checkbox checked={m.checked} onCheckedChange={() => toggleMateriel(p.id, m.id)} />
                        <span className={m.checked ? "line-through text-muted-foreground" : ""}>{m.nom}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes régisseur */}
                <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-1"><StickyNote className="h-3 w-3" /> Notes régisseur</Label>
                  <Textarea
                    value={notes[p.id] || ""}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [p.id]: e.target.value }))}
                    placeholder="Notes pour cette prestation..."
                    rows={2} className="text-sm"
                  />
                  <Button size="sm" variant="outline" onClick={() => toast.success("Notes sauvegardées (mock)")}>Sauvegarder</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {prestations.length === 0 && (
        <motion.div variants={staggerItem}>
          <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">Aucune intervention à préparer</CardContent></Card>
        </motion.div>
      )}
    </motion.div>
  );
}
