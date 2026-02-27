import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Plus, Search, Mail, Phone, Briefcase } from "lucide-react";
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
}

const DEMO_EMPLOYEES: Employee[] = [
  {
    id: "demo-emp-1",
    nom: "Martin",
    prenom: "Sophie",
    email: "sophie.martin@mba.demo",
    telephone: "06 12 34 56 78",
    poste: "Développeuse",
    statut: "actif",
    date_embauche: "2025-03-01T00:00:00Z",
    created_at: "2025-03-01T00:00:00Z",
  },
  {
    id: "demo-emp-2",
    nom: "Dupont",
    prenom: "Lucas",
    email: "lucas.dupont@mba.demo",
    telephone: "06 98 76 54 32",
    poste: "Chef de projet",
    statut: "actif",
    date_embauche: "2025-06-15T00:00:00Z",
    created_at: "2025-06-15T00:00:00Z",
  },
];

export default function AdminEmployees() {
  const { isDemo } = useIsDemo();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", poste: "" });

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      if (isDemo) return DEMO_EMPLOYEES;
      const { data, error } = await (supabase as any)
        .from("employees")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addEmployee = useMutation({
    mutationFn: async (emp: typeof form) => {
      if (isDemo) {
        toast.success("Salarié ajouté (mode démo)");
        return;
      }
      const { error } = await (supabase as any).from("employees").insert({
        nom: emp.nom,
        prenom: emp.prenom,
        email: emp.email,
        telephone: emp.telephone,
        poste: emp.poste,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Salarié ajouté avec succès");
      setOpen(false);
      setForm({ nom: "", prenom: "", email: "", telephone: "", poste: "" });
    },
    onError: () => toast.error("Erreur lors de l'ajout"),
  });

  const filtered = employees.filter((e) =>
    `${e.prenom} ${e.nom} ${e.email} ${e.poste}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Salariés
              </h1>
              <p className="text-muted-foreground text-sm">{employees.length} salarié{employees.length > 1 ? "s" : ""}</p>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2"><Plus className="h-4 w-4" /> Ajouter</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nouveau salarié</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => { e.preventDefault(); addEmployee.mutate(form); }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Prénom</Label>
                        <Input value={form.prenom} onChange={(e) => setForm((f) => ({ ...f, prenom: e.target.value }))} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Nom</Label>
                        <Input value={form.nom} onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Label>
                      <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Téléphone</Label>
                      <Input value={form.telephone} onChange={(e) => setForm((f) => ({ ...f, telephone: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> Poste</Label>
                      <Input value={form.poste} onChange={(e) => setForm((f) => ({ ...f, poste: e.target.value }))} />
                    </div>
                    <Button type="submit" className="w-full" disabled={addEmployee.isPending}>
                      {addEmployee.isPending ? "Ajout..." : "Ajouter le salarié"}
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
                      <TableHead>Statut</TableHead>
                      <TableHead>Embauche</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Aucun salarié trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((emp) => (
                        <TableRow key={emp.id}>
                          <TableCell className="font-medium">{emp.prenom} {emp.nom}</TableCell>
                          <TableCell className="text-muted-foreground">{emp.email}</TableCell>
                          <TableCell>{emp.poste || "—"}</TableCell>
                          <TableCell>
                            <Badge variant={emp.statut === "actif" ? "default" : "secondary"}>
                              {emp.statut}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {emp.date_embauche ? format(new Date(emp.date_embauche), "dd MMM yyyy", { locale: fr }) : "—"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </AdminLayout>
  );
}
