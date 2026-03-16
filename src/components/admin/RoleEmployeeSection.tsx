import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserPlus, X } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { toast } from "sonner";

interface Employee {
  id: string;
  prenom: string;
  nom: string;
  poste: string | null;
}

export function RoleEmployeeSection({ roleId }: { roleId: string }) {
  const { employeRoles, assignRoleToEmployee, removeRoleFromEmployee } = usePermissions();
  const { isDemo } = useIsDemo();
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  const { data: employees = [] } = useQuery({
    queryKey: ["employees-list"],
    queryFn: async () => {
      if (isDemo) {
        return [
          { id: "e1", prenom: "Marie", nom: "Dupont", poste: "Conseillère" },
          { id: "e2", prenom: "Jean", nom: "Martin", poste: "Comptable" },
          { id: "e3", prenom: "Sophie", nom: "Bernard", poste: "Manager" },
        ] as Employee[];
      }
      const { data, error } = await supabase.from("employees").select("id, prenom, nom, poste").eq("statut", "actif");
      if (error) throw error;
      return data as Employee[];
    },
  });

  const assignedEmployeeIds = employeRoles.filter((er) => er.role_id === roleId).map((er) => er.employe_id);
  const assignedEmployees = employees.filter((e) => assignedEmployeeIds.includes(e.id));
  const unassignedEmployees = employees.filter((e) => !assignedEmployeeIds.includes(e.id));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Salariés assignés ({assignedEmployees.length})
        </p>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1"
          onClick={() => setShowAssignDialog(true)}
        >
          <UserPlus className="h-3 w-3" />
          Assigner
        </Button>
      </div>

      {assignedEmployees.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">Aucun salarié assigné à ce rôle.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {assignedEmployees.map((emp) => (
            <Badge
              key={emp.id}
              variant="secondary"
              className="text-xs gap-1 pr-1"
            >
              {emp.prenom} {emp.nom}
              <button
                onClick={() => {
                  removeRoleFromEmployee({ employeId: emp.id, roleId });
                  toast.success(`${emp.prenom} retiré du rôle`);
                }}
                className="ml-0.5 p-0.5 rounded hover:bg-destructive/20 hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">Assigner un salarié</DialogTitle>
          </DialogHeader>
          {unassignedEmployees.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Tous les salariés sont déjà assignés.</p>
          ) : (
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {unassignedEmployees.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => {
                    assignRoleToEmployee({ employeId: emp.id, roleId });
                    toast.success(`${emp.prenom} assigné au rôle`);
                    setShowAssignDialog(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <p className="text-sm font-medium">{emp.prenom} {emp.nom}</p>
                  {emp.poste && <p className="text-[11px] text-muted-foreground">{emp.poste}</p>}
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
