import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { usePermissions as useRolesData } from "@/hooks/use-permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FolderOpen, Calendar, MessageSquare, Shield, X, User, Mail, Phone, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Employee {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  poste: string;
  statut: string;
  date_embauche: string;
  user_id?: string | null;
}

interface EmployeeDetailPanelProps {
  employee: Employee;
  onClose: () => void;
}

export function EmployeeDetailPanel({ employee, onClose }: EmployeeDetailPanelProps) {
  const { isDemo } = useIsDemo();
  const queryClient = useQueryClient();
  const { roles, employeRoles, assignRoleToEmployee, removeRoleFromEmployee } = useRolesData();
  const [showRoleChange, setShowRoleChange] = useState(false);
  const [newRoleId, setNewRoleId] = useState("");

  // Get employee's current role
  const currentRoleAssignment = employeRoles.find((er) => er.employe_id === employee.id);
  const currentRole = roles.find((r) => r.id === currentRoleAssignment?.role_id);

  // Fetch employee's active dossiers
  const { data: dossiers = [] } = useQuery({
    queryKey: ["employee-dossiers", employee.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dossier_employe")
        .select("dossier_id, role_sur_dossier, dossiers(id, reference, client_nom, statut, type_prestation, date_creation)")
        .eq("employe_id", employee.id);
      if (error) throw error;
      return (data || []).filter((d: any) => d.dossiers);
    },
    enabled: !isDemo,
  });

  // Fetch employee's events
  const { data: events = [] } = useQuery({
    queryKey: ["employee-events", employee.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events_manuels")
        .select("*")
        .eq("employee_id", employee.id)
        .order("date", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data || [];
    },
    enabled: !isDemo,
  });

  // Fetch conversations linked to assigned dossiers
  const assignedClientIds = dossiers.map((d: any) => d.dossiers?.client_id).filter(Boolean);
  const { data: conversations = [] } = useQuery({
    queryKey: ["employee-conversations", employee.id, assignedClientIds],
    queryFn: async () => {
      if (assignedClientIds.length === 0) return [];
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .in("client_id", assignedClientIds)
        .order("dernier_message", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data || [];
    },
    enabled: !isDemo && assignedClientIds.length > 0,
  });

  const handleRoleChange = () => {
    if (!newRoleId) return;
    // Remove old role if exists
    if (currentRoleAssignment) {
      removeRoleFromEmployee({ employeId: employee.id, roleId: currentRoleAssignment.role_id });
    }
    // Assign new role
    assignRoleToEmployee({ employeId: employee.id, roleId: newRoleId });
    setShowRoleChange(false);
    setNewRoleId("");
    toast.success("Rôle modifié");
  };

  const activeDossiers = dossiers.filter((d: any) => d.dossiers?.statut !== "archive");

  return (
    <div className="space-y-4">
      {/* Header with role badge */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{employee.prenom} {employee.nom}</h2>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  {employee.poste && (
                    <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {employee.poste}</span>
                  )}
                  <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {employee.email}</span>
                  {employee.telephone && (
                    <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {employee.telephone}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs">
                  {currentRole ? currentRole.nom : "Aucun rôle"}
                </Badge>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setShowRoleChange(true)}>
                  Changer
                </Button>
              </div>
              <Button size="sm" variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="dossiers">
        <TabsList>
          <TabsTrigger value="dossiers" className="gap-1.5">
            <FolderOpen className="h-3.5 w-3.5" /> Dossiers en cours ({activeDossiers.length})
          </TabsTrigger>
          <TabsTrigger value="calendrier" className="gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Calendrier ({events.length})
          </TabsTrigger>
          <TabsTrigger value="messagerie" className="gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" /> Messagerie ({conversations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dossiers">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Prestation</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeDossiers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Aucun dossier assigné
                      </TableCell>
                    </TableRow>
                  ) : (
                    activeDossiers.map((d: any) => (
                      <TableRow key={d.dossier_id}>
                        <TableCell className="font-medium">{d.dossiers.reference}</TableCell>
                        <TableCell>{d.dossiers.client_nom}</TableCell>
                        <TableCell>{d.dossiers.type_prestation}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">{d.role_sur_dossier}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={d.dossiers.statut === "actif" ? "default" : "secondary"}>
                            {d.dossiers.statut}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendrier">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Durée</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Aucun événement
                      </TableCell>
                    </TableRow>
                  ) : (
                    events.map((evt: any) => (
                      <TableRow key={evt.id}>
                        <TableCell>{format(new Date(evt.date), "dd MMM yyyy", { locale: fr })}</TableCell>
                        <TableCell>{evt.heure}</TableCell>
                        <TableCell className="font-medium">{evt.titre}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{evt.type}</Badge></TableCell>
                        <TableCell>{evt.duree} min</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messagerie">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Sujet</TableHead>
                    <TableHead>Non lus</TableHead>
                    <TableHead>Dernier message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Aucune conversation liée
                      </TableCell>
                    </TableRow>
                  ) : (
                    conversations.map((conv: any) => (
                      <TableRow key={conv.id}>
                        <TableCell className="font-medium">{conv.client_nom}</TableCell>
                        <TableCell>{conv.sujet}</TableCell>
                        <TableCell>
                          {conv.non_lus > 0 ? (
                            <Badge variant="destructive" className="text-[10px]">{conv.non_lus}</Badge>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(new Date(conv.dernier_message), "dd MMM yyyy HH:mm", { locale: fr })}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Role change dialog */}
      <Dialog open={showRoleChange} onOpenChange={setShowRoleChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Changer le rôle de {employee.prenom} {employee.nom}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {currentRole && (
              <div className="text-sm">
                Rôle actuel : <Badge variant="secondary">{currentRole.nom}</Badge>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Nouveau rôle</label>
              <Select value={newRoleId} onValueChange={setNewRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.nom}
                      {r.description && <span className="text-muted-foreground ml-1">— {r.description}</span>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleChange(false)}>Annuler</Button>
            <Button onClick={handleRoleChange} disabled={!newRoleId}>Appliquer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
