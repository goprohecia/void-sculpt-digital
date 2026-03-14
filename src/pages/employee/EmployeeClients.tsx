import { useState } from "react";
import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { motion } from "framer-motion";
import { Users, UserPlus, Search, Eye } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { toast } from "sonner";

export default function EmployeeClients() {
  const { isDemo, supabaseUserId } = useIsDemo();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", telephone: "" });
  const [creating, setCreating] = useState(false);

  // Check if employee has creer_clients permission
  const { data: canCreate = false } = useQuery({
    queryKey: ["employee-can-create-clients", supabaseUserId],
    queryFn: async () => {
      if (!supabaseUserId) return false;
      const { data } = await supabase.rpc("check_permission", {
        _user_id: supabaseUserId,
        _permission_code: "creer_clients",
      });
      return !!data;
    },
    enabled: !isDemo && !!supabaseUserId,
  });

  // Fetch clients linked to employee's dossiers
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["employee-clients"],
    queryFn: async () => {
      if (isDemo) return [];
      // Get employee record
      const { data: emp } = await supabase
        .from("employees")
        .select("id")
        .eq("user_id", supabaseUserId!)
        .maybeSingle();
      if (!emp) return [];

      // Get dossiers assigned to this employee
      const { data: assignments } = await (supabase as any)
        .from("dossier_employe")
        .select("dossier_id")
        .eq("employe_id", emp.id);
      
      const dossierIds = (assignments || []).map((a: any) => a.dossier_id);
      if (dossierIds.length === 0) return [];

      // Get client IDs from those dossiers
      const { data: dossiers } = await supabase
        .from("dossiers")
        .select("client_id")
        .in("id", dossierIds);
      
      const clientIds = [...new Set((dossiers || []).map((d) => d.client_id))];
      if (clientIds.length === 0) return [];

      const { data: clientData } = await supabase
        .from("clients")
        .select("id, prenom, nom, email, telephone, entreprise, statut")
        .in("id", clientIds);
      
      return clientData || [];
    },
    enabled: !isDemo && !!supabaseUserId,
  });

  const filtered = clients.filter((c: any) => {
    const q = search.toLowerCase();
    return !q || c.nom.toLowerCase().includes(q) || c.prenom.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const handleCreate = async () => {
    if (!form.prenom || !form.nom || !form.email) {
      toast.error("Prénom, nom et email sont requis");
      return;
    }
    setCreating(true);
    try {
      const { error } = await supabase.from("clients").insert({
        prenom: form.prenom.trim(),
        nom: form.nom.trim(),
        email: form.email.trim(),
        telephone: form.telephone.trim(),
        statut: "actif",
      } as any);
      if (error) throw error;
      toast.success("Client créé avec succès");
      queryClient.invalidateQueries({ queryKey: ["employee-clients"] });
      setShowCreate(false);
      setForm({ prenom: "", nom: "", email: "", telephone: "" });
    } catch (err: any) {
      toast.error(err.message || "Erreur");
    } finally {
      setCreating(false);
    }
  };

  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Clients
              </h1>
              <p className="text-muted-foreground text-sm">{clients.length} clients associés à vos dossiers</p>
            </div>
            {canCreate && (
              <Button onClick={() => setShowCreate(true)} className="gap-1.5 text-sm">
                <UserPlus className="h-4 w-4" /> Nouveau client
              </Button>
            )}
          </motion.div>

          <motion.div variants={staggerItem}>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </motion.div>

          {filtered.length === 0 && !isLoading ? (
            <motion.div variants={staggerItem}>
              <AdminEmptyState
                icon={Users}
                title="Aucun client"
                description="Les clients liés à vos dossiers apparaîtront ici."
              />
            </motion.div>
          ) : (
            <motion.div variants={staggerItem} className="space-y-2">
              {filtered.map((c: any) => (
                <div key={c.id} className="glass-card p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{c.prenom} {c.nom}</p>
                    <p className="text-xs text-muted-foreground">{c.entreprise || c.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-muted-foreground hidden sm:block">{c.telephone}</p>
                    <StatusBadge status={c.statut} />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Create client dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Nouveau client
              </DialogTitle>
              <DialogDescription>Créer un nouveau client pour votre compte.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Prénom</label>
                  <Input value={form.prenom} onChange={(e) => setForm(f => ({ ...f, prenom: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Nom</label>
                  <Input value={form.nom} onChange={(e) => setForm(f => ({ ...f, nom: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Email</label>
                <Input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Téléphone</label>
                <Input value={form.telephone} onChange={(e) => setForm(f => ({ ...f, telephone: e.target.value }))} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setShowCreate(false)}>Annuler</Button>
                <Button onClick={handleCreate} disabled={creating}>
                  {creating ? "Création..." : "Créer le client"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </AdminPageTransition>
    </EmployeeLayout>
  );
}
