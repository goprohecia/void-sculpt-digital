import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MOCK_TEAM_MEMBERS, type DossierAssignment, type TeamMember } from "@/data/mockData";
import { Users, Crown, Shield, Star, AlertTriangle } from "lucide-react";

interface AssignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAssignments: DossierAssignment[];
  onAssign: (assignments: DossierAssignment[]) => void;
  filterOut?: string[];
}

export function AssignModal({ open, onOpenChange, currentAssignments, onAssign, filterOut = [] }: AssignModalProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [responsableId, setResponsableId] = useState<string | null>(null);

  const visibleMembers = MOCK_TEAM_MEMBERS.filter((m) => !filterOut.includes(m.id));

  useEffect(() => {
    if (open) {
      const ids = currentAssignments.map((a) => a.employeeId);
      setSelected(ids);
      const resp = currentAssignments.find((a) => a.role === "responsable");
      setResponsableId(resp?.employeeId ?? (ids.length === 1 ? ids[0] : null));
    }
  }, [open, currentAssignments]);

  // Auto-set responsable if only one selected
  useEffect(() => {
    if (selected.length === 1) {
      setResponsableId(selected[0]);
    } else if (selected.length === 0) {
      setResponsableId(null);
    } else if (responsableId && !selected.includes(responsableId)) {
      setResponsableId(null);
    }
  }, [selected]);

  const toggleMember = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleConfirm = () => {
    if (!responsableId) return;
    const assignments: DossierAssignment[] = selected.map((employeeId) => ({
      employeeId,
      role: employeeId === responsableId ? "responsable" : "renfort",
      dateAssignation: new Date().toISOString().split("T")[0],
    }));
    onAssign(assignments);
    onOpenChange(false);
  };

  const getInitials = (m: TeamMember) => `${m.prenom[0]}${m.nom[0]}`;
  const renfortCount = selected.length > 0 ? selected.length - 1 : 0;
  const isValid = selected.length > 0 && responsableId !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Assigner l'équipe
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto py-2">
          {visibleMembers.map((member) => {
            const isChecked = selected.includes(member.id);
            const isResp = member.id === responsableId;

            return (
              <div
                key={member.id}
                onClick={() => toggleMember(member.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  isChecked
                    ? "border-primary/50 bg-primary/5"
                    : "border-border/50 hover:bg-muted/30"
                } ${member.statut === "indisponible" ? "opacity-60" : ""}`}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => toggleMember(member.id)}
                  className="pointer-events-none"
                />
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                    {getInitials(member)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{member.prenom} {member.nom}</p>
                  <p className="text-xs text-muted-foreground">{member.poste}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isChecked && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setResponsableId(member.id);
                      }}
                      className="p-1 rounded hover:bg-muted/50 transition-colors"
                      title={isResp ? "Responsable" : "Désigner comme responsable"}
                    >
                      <Star
                        className={`h-4 w-4 transition-colors ${
                          isResp ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  )}
                  {isChecked && isResp && (
                    <Badge className="text-[10px] px-1.5 py-0 bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1">
                      <Crown className="h-2.5 w-2.5" /> Responsable
                    </Badge>
                  )}
                  {isChecked && !isResp && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1">
                      <Shield className="h-2.5 w-2.5" /> Renfort
                    </Badge>
                  )}
                  <Badge
                    variant={member.statut === "disponible" ? "default" : "outline"}
                    className={`text-[10px] px-1.5 py-0 ${
                      member.statut === "disponible"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "text-muted-foreground"
                    }`}
                  >
                    {member.statut === "disponible" ? "Disponible" : "Indisponible"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recap + validation */}
        <div className="space-y-2">
          {selected.length > 0 && !responsableId && (
            <p className="text-xs text-destructive flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Vous devez désigner un responsable
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {selected.length === 0
              ? "Sélectionnez au moins un membre de l'équipe."
              : responsableId
                ? <>
                    <strong>1 responsable</strong>{renfortCount > 0 && <> + <strong>{renfortCount} en renfort</strong></>}
                  </>
                : "Cliquez sur l'étoile ★ pour désigner le responsable."
            }
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleConfirm} disabled={!isValid}>
            Confirmer l'assignation ({selected.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
