import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Megaphone, Plus, Eye, EyeOff, Users, Calendar } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSectorRoleLabels } from "@/hooks/use-sector-role-labels";

export default function AdminAnnonces() {
  const { clientsLabel, employeesLabel } = useSectorRoleLabels();
  const { isDemo } = useIsDemo();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titre: "", contenu: "", cible: "tous_clients", dateExpiration: "" });
  const [creating, setCreating] = useState(false);

  const { data: annonces = [], isLoading } = useQuery({
    queryKey: ["annonces"],
    queryFn: async () => {
      if (isDemo) return [
        { id: "demo-1", titre: "Bienvenue", contenu: "Bienvenue sur notre plateforme !", cible_type: "tous_clients", statut: "active", date_creation: new Date().toISOString(), date_expiration: null, lectures: 3, total: 10 },
      ];
      const { data, error } = await (supabase as any).from("annonces").select("*").order("date_creation", { ascending: false });
      if (error) throw error;

      // Get lecture counts
      const ids = (data || []).map((a: any) => a.id);
      let lectureCounts: Record<string, number> = {};
      if (ids.length > 0) {
        const { data: lectures } = await (supabase as any).from("annonce_lecture").select("annonce_id");
        if (lectures) {
          for (const l of lectures) {
            lectureCounts[l.annonce_id] = (lectureCounts[l.annonce_id] || 0) + 1;
          }
        }
      }

      return (data || []).map((a: any) => ({
        ...a,
        lectures: lectureCounts[a.id] || 0,
      }));
    },
  });

  const handleCreate = async () => {
    if (!form.titre.trim() || !form.contenu.trim()) {
      toast.error("Titre et contenu requis");
      return;
    }
    if (isDemo) {
      toast.success("Annonce créée (mode démo)");
      setShowForm(false);
      return;
    }
    setCreating(true);
    try {
      const { error } = await (supabase as any).from("annonces").insert({
        titre: form.titre.trim(),
        contenu: form.contenu.trim(),
        cible_type: form.cible,
        date_expiration: form.dateExpiration || null,
        statut: "active",
      });
      if (error) throw error;
      toast.success("Annonce publiée");
      queryClient.invalidateQueries({ queryKey: ["annonces"] });
      setShowForm(false);
      setForm({ titre: "", contenu: "", cible: "tous_clients", dateExpiration: "" });
    } catch (err: any) {
      toast.error(err.message || "Erreur");
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (id: string, currentStatut: string) => {
    if (isDemo) { toast.info("Mode démo"); return; }
    const newStatut = currentStatut === "active" ? "desactivee" : "active";
    const { error } = await (supabase as any).from("annonces").update({ statut: newStatut }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(newStatut === "active" ? "Annonce réactivée" : "Annonce désactivée");
    queryClient.invalidateQueries({ queryKey: ["annonces"] });
  };

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Megaphone className="h-6 w-6 text-primary" />
                Annonces
              </h1>
              <p className="text-muted-foreground text-sm">Communications générales à vos clients et employés</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Nouvelle annonce
            </button>
          </motion.div>

          {annonces.length === 0 && !isLoading ? (
            <motion.div variants={staggerItem}>
              <AdminEmptyState
                icon={Megaphone}
                title="Aucune annonce"
                description="Publiez des annonces pour communiquer avec vos clients et employés."
              />
            </motion.div>
          ) : (
            <motion.div variants={staggerItem} className="space-y-3">
              {annonces.map((a: any) => (
                <div key={a.id} className="glass-card p-4 flex items-start gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                    a.statut === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{a.titre}</p>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                        a.statut === "active" ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"
                      )}>
                        {a.statut === "active" ? "Active" : "Désactivée"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{a.contenu}</p>
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {a.cible_type === "tous_clients" ? "Clients" : a.cible_type === "tous_employes" ? "Employés" : "Tous"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {a.lectures || 0} lectures
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(a.date_creation).toLocaleDateString("fr-FR")}
                      </span>
                      {a.date_expiration && (
                        <span>Expire : {new Date(a.date_expiration).toLocaleDateString("fr-FR")}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(a.id, a.statut)}
                    className={cn(
                      "p-2 rounded-lg transition-colors text-sm",
                      a.statut === "active"
                        ? "hover:bg-destructive/10 text-destructive"
                        : "hover:bg-primary/10 text-primary"
                    )}
                    title={a.statut === "active" ? "Désactiver" : "Réactiver"}
                  >
                    {a.statut === "active" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                Nouvelle annonce
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Titre</label>
                <Input
                  value={form.titre}
                  onChange={(e) => setForm((f) => ({ ...f, titre: e.target.value }))}
                  placeholder="Ex: Maintenance prévue ce week-end"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contenu</label>
                <Textarea
                  value={form.contenu}
                  onChange={(e) => setForm((f) => ({ ...f, contenu: e.target.value }))}
                  placeholder="Rédigez votre annonce..."
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Destinataires</label>
                <div className="flex gap-2">
                  {[
                    { value: "tous_clients", label: "Tous les clients" },
                    { value: "tous_employes", label: "Tous les employés" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setForm((f) => ({ ...f, cible: opt.value }))}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                        form.cible === opt.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/30 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date d'expiration (optionnelle)</label>
                <Input
                  type="date"
                  value={form.dateExpiration}
                  onChange={(e) => setForm((f) => ({ ...f, dateExpiration: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
                  Annuler
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating || !form.titre.trim() || !form.contenu.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {creating ? "Publication..." : "Publier l'annonce"}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </AdminPageTransition>
    </AdminLayout>
  );
}
