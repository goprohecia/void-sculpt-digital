import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FolderOpen, Plus, Link2, Users, Crown, Shield } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Props {
  clientId: string;
}

/** Cross-view: shows dossiers linked to a client via client_dossier table + direct dossiers */
export function ClientDossiersLinked({ clientId }: Props) {
  const { isDemo } = useIsDemo();
  const queryClient = useQueryClient();
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedDossierId, setSelectedDossierId] = useState("");

  // Fetch linked dossiers (via client_dossier junction + direct dossiers.client_id)
  const { data: linkedDossiers = [] } = useQuery({
    queryKey: ["client-linked-dossiers", clientId],
    queryFn: async () => {
      // Direct dossiers
      const { data: directDossiers } = await supabase
        .from("dossiers")
        .select("id, reference, type_prestation, statut, montant, date_creation")
        .eq("client_id", clientId);

      // Many-to-many dossiers
      const { data: links } = await (supabase as any)
        .from("client_dossier")
        .select("dossier_id")
        .eq("client_id", clientId);

      const linkedIds = (links || []).map((l: any) => l.dossier_id);
      let m2mDossiers: any[] = [];
      if (linkedIds.length > 0) {
        const { data } = await supabase
          .from("dossiers")
          .select("id, reference, type_prestation, statut, montant, date_creation")
          .in("id", linkedIds);
        m2mDossiers = data || [];
      }

      // Merge & deduplicate
      const all = [...(directDossiers || []), ...m2mDossiers];
      const seen = new Set<string>();
      return all.filter((d) => {
        if (seen.has(d.id)) return false;
        seen.add(d.id);
        return true;
      });
    },
    enabled: !isDemo,
  });

  // Fetch assignees for each dossier
  const { data: assignments = [] } = useQuery({
    queryKey: ["dossier-assignments-for-client", clientId],
    queryFn: async () => {
      const ids = linkedDossiers.map((d: any) => d.id);
      if (ids.length === 0) return [];
      const { data } = await (supabase as any)
        .from("dossier_employe")
        .select("dossier_id, role_sur_dossier, employe_id, employees:employe_id(prenom, nom)")
        .in("dossier_id", ids);
      return data || [];
    },
    enabled: linkedDossiers.length > 0 && !isDemo,
  });

  // All dossiers for linking
  const { data: allDossiers = [] } = useQuery({
    queryKey: ["all-dossiers-for-link"],
    queryFn: async () => {
      const { data } = await supabase.from("dossiers").select("id, reference, type_prestation, client_nom");
      return data || [];
    },
    enabled: showLinkModal && !isDemo,
  });

  const handleLink = async () => {
    if (!selectedDossierId) return;
    const { error } = await (supabase as any).from("client_dossier").insert({
      client_id: clientId,
      dossier_id: selectedDossierId,
    });
    if (error) {
      if (error.code === "23505") toast.info("Ce dossier est déjà lié");
      else toast.error(error.message);
      return;
    }
    toast.success("Dossier lié au client");
    queryClient.invalidateQueries({ queryKey: ["client-linked-dossiers", clientId] });
    setShowLinkModal(false);
    setSelectedDossierId("");
  };

  const linkedIds = new Set(linkedDossiers.map((d: any) => d.id));
  const availableDossiers = allDossiers.filter((d: any) => !linkedIds.has(d.id));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-1.5">
          <FolderOpen className="h-3.5 w-3.5 text-primary" />
          Projets liés ({linkedDossiers.length})
        </h3>
        <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => setShowLinkModal(true)}>
          <Plus className="h-3 w-3" /> Lier un projet
        </Button>
      </div>

      {linkedDossiers.length > 0 ? (
        <div className="space-y-2">
          {linkedDossiers.map((d: any) => {
            const dAssigns = assignments.filter((a: any) => a.dossier_id === d.id);
            return (
              <Link key={d.id} to={`/admin/dossiers/${d.id}`} className="block">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono">{d.reference}</p>
                    <p className="text-xs text-muted-foreground">{d.type_prestation}</p>
                    {dAssigns.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        {dAssigns.map((a: any) => (
                          <Badge key={a.employe_id} variant="secondary" className="text-[9px] px-1 py-0 gap-0.5">
                            {a.role_sur_dossier === "responsable" ? <Crown className="h-2 w-2" /> : <Shield className="h-2 w-2" />}
                            {a.employees?.prenom?.[0]}{a.employees?.nom?.[0]}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{Number(d.montant).toLocaleString()} €</span>
                    <StatusBadge status={d.statut} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Aucun projet lié</p>
      )}

      <Dialog open={showLinkModal} onOpenChange={setShowLinkModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              Lier à un projet
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Select value={selectedDossierId || "__none__"} onValueChange={(v) => setSelectedDossierId(v === "__none__" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un dossier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Sélectionner un dossier</SelectItem>
                {availableDossiers.map((d: any) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.reference} — {d.client_nom} ({d.type_prestation})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowLinkModal(false)}>Annuler</Button>
              <Button onClick={handleLink} disabled={!selectedDossierId}>Lier</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
