import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MOCK_TEAM_MEMBERS, type DossierAssignment, type TeamMember } from "@/data/mockData";
import { Users, Crown, Shield } from "lucide-react";

interface AssignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAssignments: DossierAssignment[];
  onAssign: (assignments: DossierAssignment[]) => void;
}

export function AssignModal({ open, onOpenChange, currentAssignments, onAssign }: AssignModalProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      // Pre-check currently assigned members in order (responsable first)
      const sorted = [...currentAssignments].sort((a, b) => (a.role === "responsable" ? -1 : 1));
      setSelected(sorted.map((a) => a.employeeId));
    }
  }, [open, currentAssignments]);

  const toggleMember = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleConfirm = () => {
    const assignments: DossierAssignment[] = selected.map((employeeId, index) => ({
      employeeId,
      role: index === 0 ? "responsable" : "renfort",
      dateAssignation: new Date().toISOString().split("T")[0],
    }));
    onAssign(assignments);
    onOpenChange(false);
  };

  const getInitials = (m: TeamMember) => `${m.prenom[0]}${m.nom[0]}`;

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
          {MOCK_TEAM_MEMBERS.map((member) => {
            const isChecked = selected.includes(member.id);
            const roleIndex = selected.indexOf(member.id);
            const role = roleIndex === 0 ? "responsable" : roleIndex > 0 ? "renfort" : null;

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
                  {role === "responsable" && (
                    <Badge className="text-[10px] px-1.5 py-0 bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1">
                      <Crown className="h-2.5 w-2.5" /> Responsable
                    </Badge>
                  )}
                  {role === "renfort" && (
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

        <p className="text-xs text-muted-foreground">
          Le premier membre sélectionné sera désigné <strong>Responsable</strong>, les suivants comme <strong>Renfort</strong>.
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleConfirm} disabled={selected.length === 0}>
            Confirmer l'assignation ({selected.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
