import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, File, FileText, Image, Upload, Search, Download, Trash2, FolderPlus } from "lucide-react";

interface Doc {
  id: string;
  nom: string;
  type: "pdf" | "image" | "doc" | "autre";
  taille: string;
  dossier: string;
  client?: string;
  dateAjout: string;
}

const DEMO_DOCS: Doc[] = [
  { id: "1", nom: "Contrat_Dupont_2026.pdf", type: "pdf", taille: "1.2 Mo", dossier: "Contrats", client: "Pierre Dupont", dateAjout: "05/03/2026" },
  { id: "2", nom: "Devis_Altarys_V2.pdf", type: "pdf", taille: "340 Ko", dossier: "Devis", client: "Altarys SAS", dateAjout: "04/03/2026" },
  { id: "3", nom: "Maquette_site_final.png", type: "image", taille: "3.8 Mo", dossier: "Livrables", client: "Marie Martin", dateAjout: "03/03/2026" },
  { id: "4", nom: "PV_reunion_mars.docx", type: "doc", taille: "85 Ko", dossier: "Interne", dateAjout: "02/03/2026" },
  { id: "5", nom: "Facture_F-2026-089.pdf", type: "pdf", taille: "120 Ko", dossier: "Factures", client: "Pierre Dupont", dateAjout: "01/03/2026" },
  { id: "6", nom: "Logo_client_HD.svg", type: "image", taille: "45 Ko", dossier: "Livrables", client: "Altarys SAS", dateAjout: "28/02/2026" },
  { id: "7", nom: "Cahier_des_charges.pdf", type: "pdf", taille: "890 Ko", dossier: "Contrats", client: "Marie Martin", dateAjout: "25/02/2026" },
  { id: "8", nom: "Notes_strategie.md", type: "autre", taille: "12 Ko", dossier: "Interne", dateAjout: "20/02/2026" },
];

const DOSSIERS = ["Tous", "Contrats", "Devis", "Factures", "Livrables", "Interne"];

const TYPE_ICON: Record<string, typeof File> = { pdf: FileText, image: Image, doc: FileText, autre: File };
const TYPE_COLOR: Record<string, string> = { pdf: "text-red-400", image: "text-emerald-400", doc: "text-blue-400", autre: "text-muted-foreground" };

export default function AdminDocuments() {
  const [search, setSearch] = useState("");
  const [dossierFiltre, setDossierFiltre] = useState("Tous");

  const filtered = DEMO_DOCS.filter((d) => {
    if (dossierFiltre !== "Tous" && d.dossier !== dossierFiltre) return false;
    if (search && !d.nom.toLowerCase().includes(search.toLowerCase()) && !d.client?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: DEMO_DOCS.length,
    taille: "6.5 Mo",
    dossiers: new Set(DEMO_DOCS.map((d) => d.dossier)).size,
  };

  return (
    <AdminLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FolderOpen className="h-6 w-6 text-primary" /> Documents
              </h1>
              <p className="text-muted-foreground text-sm">{stats.total} fichiers · {stats.taille} · {stats.dossiers} dossiers</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-1.5"><FolderPlus className="h-4 w-4" /> Nouveau dossier</Button>
              <Button className="gap-1.5"><Upload className="h-4 w-4" /> Importer</Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un fichier..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1.5">
              {DOSSIERS.map((d) => (
                <Button key={d} variant={dossierFiltre === d ? "default" : "outline"} size="sm" onClick={() => setDossierFiltre(d)} className="text-xs">
                  {d}
                </Button>
              ))}
            </div>
          </div>

          {/* File list */}
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-1">
                {filtered.map((doc) => {
                  const Icon = TYPE_ICON[doc.type];
                  return (
                    <div key={doc.id} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/20 transition-colors group">
                      <Icon className={`h-5 w-5 shrink-0 ${TYPE_COLOR[doc.type]}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.nom}</p>
                        <p className="text-xs text-muted-foreground">{doc.taille} · {doc.dateAjout}{doc.client && ` · ${doc.client}`}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0">{doc.dossier}</Badge>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Download className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-12">Aucun document trouvé</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminPageTransition>
    </AdminLayout>
  );
}
