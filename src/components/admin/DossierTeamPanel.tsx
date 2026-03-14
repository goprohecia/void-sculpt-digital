import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, Crown, Shield, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  dossierId: string;
}

/** Cross-view: shows employees assigned to a dossier via dossier_employe table */
export function DossierTeamPanel({ dossierId }: Props) {
  const { isDemo } = useIsDemo();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedRole, setSelectedRole] = useState("intervenant");

  const { data: team = [] } = useQuery({
    queryKey: ["dossier-team", dossierId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("dossier_employe")
        .select("id, employe_id, role_sur_dossier, employees:employe_id(id, prenom, nom, poste, email)")
        .eq("dossier_id", dossierId);
      if (error) throw error;
      return data || [];
    },
    enabled: !isDemo,
  });

  const { data: allEmployees = [] } = useQuery({
    queryKey: ["all-employees-for-assign"],
    queryFn: async () => {
      const { data } = await supabase.from("employees").select("id, prenom, nom, poste").eq("statut", "actif");
      return data || [];
    },
    enabled: showAddModal && !isDemo,
  });

  const handleAddMember = async () => {
    if (!selectedEmployeeId) return;
    const { error } = await (supabase as any).from("dossier_employe").insert({
      dossier_id: dossierId,
      employe_id: selectedEmployeeId,
      role_sur_dossier: selectedRole,
    });
    if (error) {
      if (error.code === "23505") toast.info("Cet employé est déjà assigné");
      else toast.error(error.message);
      return;
    }
    toast.success("Membre ajouté à l'équipe");
    queryClient.invalidateQueries({ queryKey: ["dossier-team", dossierId] });
    setShowAddModal(false);
    setSelectedEmployeeId("");
  };

  const handleRemove = async (assignmentId: string) => {
    const { error } = await (supabase as any).from("dossier_employe").delete().eq("id", assignmentId);
    if (error) { toast.error(error.message); return; }
    toast.success("Membre retiré");
    queryClient.invalidateQueries({ queryKey: ["dossier-team", dossierId] });
  };

  const assignedIds = new Set(team.map((t: any) => t.employe_id));
  const availableEmployees = allEmployees.filter((e: any) => !assignedIds.has(e.id));

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Équipe assignée ({team.length})
        </h2>
        <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => setShowAddModal(true)}>
          <Plus className="h-3 w-3" /> Ajouter
        </Button>
      </div>

      {team.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {team.map((t: any) => {
            const emp = t.employees;
            if (!emp) return null;
            const isResp = t.role_sur_dossier === "responsable";
            return (
              <div key={t.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-border/30">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                    {emp.prenom?.[0]}{emp.nom?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium">{emp.prenom} {emp.nom}</p>
                  <p className="text-[10px] text-muted-foreground">{emp.poste || emp.email}</p>
                </div>
                {isResp ? (
                  <Badge className="text-[10px] px-1.5 py-0 bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1">
                    <Crown className="h-2.5 w-2.5" /> Responsable
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1">
                    <Shield className="h-2.5 w-2.5" /> {t.role_sur_dossier}
                  </Badge>
                )}
                <button
                  onClick={() => handleRemove(t.id)}
                  className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="Retirer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Aucun membre assigné</p>
      )}

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Ajouter un membre
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Employé</label>
              <Select value={selectedEmployeeId || "__none__"} onValueChange={(v) => setSelectedEmployeeId(v === "__none__" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Sélectionner un employé</SelectItem>
                  {availableEmployees.map((e: any) => (
                    <SelectItem key={e.id} value={e.id}>{e.prenom} {e.nom} — {e.poste}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rôle</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="responsable">Responsable</SelectItem>
                  <SelectItem value="intervenant">Intervenant</SelectItem>
                  <SelectItem value="renfort">Renfort</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowAddModal(false)}>Annuler</Button>
              <Button onClick={handleAddMember} disabled={!selectedEmployeeId}>Ajouter</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
