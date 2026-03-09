import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Plus, Search, Mail, Phone, Briefcase, Send, Settings2 } from "lucide-react";
import { useIsDemo } from "@/hooks/useIsDemo";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  created_at: string;
  acces_modules: string[];
}

const ALL_MODULES = [
  { key: "overview", label: "Dashboard" },
  { key: "dossiers", label: "Dossiers" },
  { key: "calendrier", label: "Calendrier" },
  { key: "messagerie", label: "Messagerie" },
  { key: "stock", label: "Stock" },
  { key: "profil", label: "Profil" },
];

const DEMO_EMPLOYEES: Employee[] = [
  { id: "demo-emp-1", nom: "Martin", prenom: "Sophie", email: "sophie.martin@mba.demo", telephone: "06 12 34 56 78", poste: "Développeuse", statut: "actif", date_embauche: "2025-03-01T00:00:00Z", created_at: "2025-03-01T00:00:00Z", acces_modules: ["overview", "dossiers", "calendrier", "messagerie", "profil"] },
  { id: "demo-emp-2", nom: "Dupont", prenom: "Lucas", email: "lucas.dupont@mba.demo", telephone: "06 98 76 54 32", poste: "Chef de projet", statut: "actif", date_embauche: "2025-06-15T00:00:00Z", created_at: "2025-06-15T00:00:00Z", acces_modules: ["overview", "dossiers", "calendrier", "messagerie", "stock", "profil"] },
];

export default function AdminEmployees() {
  const { isDemo } = useIsDemo();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", poste: "" });
  const [inviteForm, setInviteForm] = useState({ nom: "", prenom: "", email: "", telephone: "", poste: "" });

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      if (isDemo) return DEMO_EMPLOYEES;
      const { data, error } = await (supabase as any).from("employees").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((e: any) => ({ ...e, acces_modules: Array.isArray(e.acces_modules) ? e.acces_modules : [] }));
    },
  });

  const addEmployee = useMutation({
    mutationFn: async (emp: typeof form) => {
      if (isDemo) { toast.success("Salarié ajouté (mode démo)"); return; }
      const { error } = await (supabase as any).from("employees").insert({ nom: emp.nom, prenom: emp.prenom, email: emp.email, telephone: emp.telephone, poste: emp.poste });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["employees"] }); toast.success("Salarié ajouté"); setOpen(false); setForm({ nom: "", prenom: "", email: "", telephone: "", poste: "" }); },
    onError: () => toast.error("Erreur lors de l'ajout"),
  });

  const inviteEmployee = useMutation({
    mutationFn: async (emp: typeof inviteForm) => {
      if (isDemo) { toast.success("Invitation envoyée (mode démo)"); return; }
      const res = await supabase.functions.invoke("create-employee-account", { body: emp });
      if (res.error) throw new Error(res.error.message);
      if (res.data?.error) throw new Error(res.data.error);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["employees"] }); toast.success("Invitation envoyée par email"); setInviteOpen(false); setInviteForm({ nom: "", prenom: "", email: "", telephone: "", poste: "" }); },
    onError: (e: any) => toast.error(e.message || "Erreur lors de l'invitation"),
  });

  const updateModules = useMutation({
    mutationFn: async ({ id, modules }: { id: string; modules: string[] }) => {
      if (isDemo) { toast.success("Modules mis à jour (mode démo)"); return; }
      const { error } = await (supabase as any).from("employees").update({ acces_modules: modules }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["employees"] }); toast.success("Accès modules mis à jour"); setModulesOpen(false); },
    onError: () => toast.error("Erreur"),
  });

  const openModulesDialog = (emp: Employee) => {
    setSelectedEmp(emp);
    setSelectedModules([...(emp.acces_modules || [])]);
    setModulesOpen(true);
  };

  const toggleModule = (key: string) => {
    setSelectedModules((prev) => prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]);
  };

  const filtered = employees.filter((e) =>
    `${e.prenom} ${e.nom} ${e.email} ${e.poste}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="h-6 w-6 text-primary" /> Salariés</h1>
              <p className="text-muted-foreground text-sm">{employees.length} salarié{employees.length > 1 ? "s" : ""}</p>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild><Button variant="outline" className="gap-2"><Plus className="h-4 w-4" /> Ajouter</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Nouveau salarié</DialogTitle></DialogHeader>
                  <form onSubmit={(e) => { e.preventDefault(); addEmployee.mutate(form); }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Prénom</Label><Input value={form.prenom} onChange={(e) => setForm((f) => ({ ...f, prenom: e.target.value }))} required /></div>
                      <div className="space-y-2"><Label>Nom</Label><Input value={form.nom} onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))} required /></div>
                    </div>
                    <div className="space-y-2"><Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Label><Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required /></div>
                    <div className="space-y-2"><Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Téléphone</Label><Input value={form.telephone} onChange={(e) => setForm((f) => ({ ...f, telephone: e.target.value }))} /></div>
                    <div className="space-y-2"><Label className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> Poste</Label><Input value={form.poste} onChange={(e) => setForm((f) => ({ ...f, poste: e.target.value }))} /></div>
                    <Button type="submit" className="w-full" disabled={addEmployee.isPending}>{addEmployee.isPending ? "Ajout..." : "Ajouter le salarié"}</Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <DialogTrigger asChild><Button className="gap-2"><Send className="h-4 w-4" /> Inviter par email</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Inviter un salarié par email</DialogTitle></DialogHeader>
                  <p className="text-sm text-muted-foreground">Un compte sera créé automatiquement et un email avec les identifiants sera envoyé.</p>
                  <form onSubmit={(e) => { e.preventDefault(); inviteEmployee.mutate(inviteForm); }} className="space-y-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Prénom *</Label><Input value={inviteForm.prenom} onChange={(e) => setInviteForm((f) => ({ ...f, prenom: e.target.value }))} required /></div>
                      <div className="space-y-2"><Label>Nom *</Label><Input value={inviteForm.nom} onChange={(e) => setInviteForm((f) => ({ ...f, nom: e.target.value }))} required /></div>
                    </div>
                    <div className="space-y-2"><Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email *</Label><Input type="email" value={inviteForm.email} onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))} required /></div>
                    <div className="space-y-2"><Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Téléphone</Label><Input value={inviteForm.telephone} onChange={(e) => setInviteForm((f) => ({ ...f, telephone: e.target.value }))} /></div>
                    <div className="space-y-2"><Label className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> Poste</Label><Input value={inviteForm.poste} onChange={(e) => setInviteForm((f) => ({ ...f, poste: e.target.value }))} /></div>
                    <Button type="submit" className="w-full gap-2" disabled={inviteEmployee.isPending}>
                      <Send className="h-4 w-4" /> {inviteEmployee.isPending ? "Envoi..." : "Envoyer l'invitation"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Salarié</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Modules</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Embauche</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucun salarié trouvé</TableCell></TableRow>
                    ) : filtered.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium">{emp.prenom} {emp.nom}</TableCell>
                        <TableCell className="text-muted-foreground">{emp.email}</TableCell>
                        <TableCell>{emp.poste || "—"}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap max-w-[200px]">
                            {(emp.acces_modules || []).slice(0, 3).map((m) => (
                              <Badge key={m} variant="secondary" className="text-[10px] px-1.5">{m}</Badge>
                            ))}
                            {(emp.acces_modules || []).length > 3 && <Badge variant="outline" className="text-[10px] px-1.5">+{emp.acces_modules.length - 3}</Badge>}
                          </div>
                        </TableCell>
                        <TableCell><Badge variant={emp.statut === "actif" ? "default" : "secondary"}>{emp.statut}</Badge></TableCell>
                        <TableCell className="text-muted-foreground text-sm">{emp.date_embauche ? format(new Date(emp.date_embauche), "dd MMM yyyy", { locale: fr }) : "—"}</TableCell>
                        <TableCell className="text-center">
                          <Button size="sm" variant="ghost" onClick={() => openModulesDialog(emp)} title="Gérer les accès modules">
                            <Settings2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Modules access + capacity dialog */}
        <Dialog open={modulesOpen} onOpenChange={setModulesOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Paramètres — {selectedEmp?.prenom} {selectedEmp?.nom}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <p className="text-sm font-medium mb-2">Accès modules</p>
                <div className="space-y-2">
                  {ALL_MODULES.map((mod) => (
                    <label key={mod.key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/20 cursor-pointer">
                      <Checkbox checked={selectedModules.includes(mod.key)} onCheckedChange={() => toggleModule(mod.key)} />
                      <span className="text-sm">{mod.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="border-t border-border/50 pt-4">
                <Label className="text-sm font-medium">Capacité maximale de dossiers actifs</Label>
                <p className="text-xs text-muted-foreground mb-2">Nombre max de dossiers en cours simultanés. Laisser vide = pas de limite.</p>
                <Input
                  type="number"
                  min={0}
                  placeholder="Illimité"
                  value={capaciteMax}
                  onChange={(e) => setCapaciteMax(e.target.value)}
                  className="max-w-[160px]"
                />
              </div>
              <Button className="w-full" onClick={() => {
                if (selectedEmp) {
                  updateModules.mutate({ id: selectedEmp.id, modules: selectedModules });
                }
              }} disabled={updateModules.isPending}>
                {updateModules.isPending ? "Mise à jour..." : "Enregistrer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </AdminPageTransition>
    </AdminLayout>
  );
}
