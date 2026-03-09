import { useState } from "react";
import { format as fmtDate } from "date-fns";
import { fr } from "date-fns/locale";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { BarChart3, Download, FileText, TrendingUp, Users, Receipt, FolderOpen, Calendar as CalendarIcon, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const RAPPORTS = [
  { id: "ca", titre: "Chiffre d'affaires", description: "CA mensuel, trimestriel et annuel avec évolution", icon: TrendingUp, categorie: "Finance" },
  { id: "clients", titre: "Activité clients", description: "Nouveaux clients, segments, taux de rétention", icon: Users, categorie: "Commercial" },
  { id: "factures", titre: "État des factures", description: "Factures émises, payées, en retard, montants", icon: Receipt, categorie: "Finance" },
  { id: "dossiers", titre: "Suivi des dossiers", description: "Dossiers par statut, durée moyenne, rentabilité", icon: FolderOpen, categorie: "Opérations" },
  { id: "temps", titre: "Temps passé", description: "Temps par client, dossier, salarié et rentabilité horaire", icon: Calendar, categorie: "Opérations" },
  { id: "performance", titre: "Performance équipe", description: "Productivité, dossiers traités, objectifs atteints", icon: BarChart3, categorie: "RH" },
];

const HISTORIQUE = [
  { nom: "CA_Mars_2026.pdf", date: "08/03/2026", taille: "245 Ko", type: "Finance" },
  { nom: "Clients_Fevrier_2026.csv", date: "01/03/2026", taille: "128 Ko", type: "Commercial" },
  { nom: "Factures_Q1_2026.pdf", date: "28/02/2026", taille: "512 Ko", type: "Finance" },
  { nom: "Dossiers_Fevrier_2026.pdf", date: "28/02/2026", taille: "340 Ko", type: "Opérations" },
];

export default function AdminRapports() {
  const [periode, setPeriode] = useState("mois");
  const [format, setFormat] = useState("pdf");

  const handleGenerate = (rapportId: string) => {
    toast.success(`Rapport "${RAPPORTS.find((r) => r.id === rapportId)?.titre}" généré en ${format.toUpperCase()}`);
  };

  return (
    <AdminLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" /> Rapports & Exports
              </h1>
              <p className="text-muted-foreground text-sm">Générez des rapports personnalisés en PDF ou CSV</p>
            </div>
            <div className="flex gap-2">
              <Select value={periode} onValueChange={setPeriode}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="semaine">Cette semaine</SelectItem>
                  <SelectItem value="mois">Ce mois</SelectItem>
                  <SelectItem value="trimestre">Ce trimestre</SelectItem>
                  <SelectItem value="annee">Cette année</SelectItem>
                </SelectContent>
              </Select>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RAPPORTS.map((rapport) => (
              <Card key={rapport.id} className="hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <rapport.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm">{rapport.titre}</CardTitle>
                      <Badge variant="outline" className="text-[10px] mt-1">{rapport.categorie}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">{rapport.description}</p>
                  <Button size="sm" className="w-full gap-1.5" onClick={() => handleGenerate(rapport.id)}>
                    <Download className="h-3.5 w-3.5" /> Générer ({format.toUpperCase()})
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Historique */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" /> Historique des exports
              </CardTitle>
              <CardDescription>Retrouvez vos rapports précédemment générés.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {HISTORIQUE.map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{h.nom}</p>
                        <p className="text-xs text-muted-foreground">{h.date} · {h.taille}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">{h.type}</Badge>
                      <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs">
                        <Download className="h-3 w-3" /> Télécharger
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminPageTransition>
    </AdminLayout>
  );
}
