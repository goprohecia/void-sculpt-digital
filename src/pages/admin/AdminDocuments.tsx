import { useState, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FolderOpen, File, FileText, Image, Upload, Search, Download, Trash2, FolderPlus, Pencil, FolderInput } from "lucide-react";
import { toast } from "sonner";

interface Doc {
  id: string;
  nom: string;
  type: "pdf" | "image" | "doc" | "autre";
  taille: string;
  dossier: string;
  client?: string;
  dateAjout: string;
}

function detectType(name: string): Doc["type"] {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["pdf"].includes(ext)) return "pdf";
  if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext)) return "image";
  if (["doc", "docx", "odt", "rtf"].includes(ext)) return "doc";
  return "autre";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

const INITIAL_DOCS: Doc[] = [
  { id: "1", nom: "Contrat_Dupont_2026.pdf", type: "pdf", taille: "1.2 Mo", dossier: "Contrats", client: "Pierre Dupont", dateAjout: "05/03/2026" },
  { id: "2", nom: "Devis_Altarys_V2.pdf", type: "pdf", taille: "340 Ko", dossier: "Devis", client: "Altarys SAS", dateAjout: "04/03/2026" },
  { id: "3", nom: "Maquette_site_final.png", type: "image", taille: "3.8 Mo", dossier: "Livrables", client: "Marie Martin", dateAjout: "03/03/2026" },
  { id: "4", nom: "PV_reunion_mars.docx", type: "doc", taille: "85 Ko", dossier: "Interne", dateAjout: "02/03/2026" },
  { id: "5", nom: "Facture_F-2026-089.pdf", type: "pdf", taille: "120 Ko", dossier: "Factures", client: "Pierre Dupont", dateAjout: "01/03/2026" },
  { id: "6", nom: "Logo_client_HD.svg", type: "image", taille: "45 Ko", dossier: "Livrables", client: "Altarys SAS", dateAjout: "28/02/2026" },
  { id: "7", nom: "Cahier_des_charges.pdf", type: "pdf", taille: "890 Ko", dossier: "Contrats", client: "Marie Martin", dateAjout: "25/02/2026" },
  { id: "8", nom: "Notes_strategie.md", type: "autre", taille: "12 Ko", dossier: "Interne", dateAjout: "20/02/2026" },
];

const DEFAULT_DOSSIERS = ["Contrats", "Devis", "Factures", "Livrables", "Interne"];

const TYPE_ICON: Record<string, typeof File> = { pdf: FileText, image: Image, doc: FileText, autre: File };
const TYPE_COLOR: Record<string, string> = { pdf: "text-red-400", image: "text-emerald-400", doc: "text-blue-400", autre: "text-muted-foreground" };

export default function AdminDocuments() {
  const [search, setSearch] = useState("");
  const [dossierFiltre, setDossierFiltre] = useState("Tous");
  const [docs, setDocs] = useState<Doc[]>(INITIAL_DOCS);
  const [dossiers, setDossiers] = useState<string[]>(DEFAULT_DOSSIERS);

  // New folder dialog
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Import dialog
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importDossier, setImportDossier] = useState(dossiers[0]);
  const [importClient, setImportClient] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rename dialog
  const [renameDoc, setRenameDoc] = useState<Doc | null>(null);
  const [renameName, setRenameName] = useState("");

  // Move dialog
  const [moveDoc, setMoveDoc] = useState<Doc | null>(null);
  const [moveDossier, setMoveDossier] = useState("");

  const allDossiers = ["Tous", ...dossiers];

  const filtered = docs.filter((d) => {
    if (dossierFiltre !== "Tous" && d.dossier !== dossierFiltre) return false;
    if (search && !d.nom.toLowerCase().includes(search.toLowerCase()) && !d.client?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalSize = docs.reduce((acc, d) => {
    const m = d.taille.match(/([\d.]+)\s*(Mo|Ko|o)/);
    if (!m) return acc;
    const v = parseFloat(m[1]);
    if (m[2] === "Mo") return acc + v * 1024 * 1024;
    if (m[2] === "Ko") return acc + v * 1024;
    return acc + v;
  }, 0);

  const stats = {
    total: docs.length,
    taille: formatSize(totalSize),
    dossiers: dossiers.length,
  };

  // --- Handlers ---
  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    if (dossiers.some((d) => d.toLowerCase() === name.toLowerCase())) {
      toast.error("Ce dossier existe déjà");
      return;
    }
    setDossiers((prev) => [...prev, name]);
    toast.success(`Dossier "${name}" créé`);
    setNewFolderName("");
    setFolderDialogOpen(false);
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleImport = () => {
    if (selectedFiles.length === 0) return;
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
    const newDocs: Doc[] = selectedFiles.map((f, i) => ({
      id: `imp-${Date.now()}-${i}`,
      nom: f.name,
      type: detectType(f.name),
      taille: formatSize(f.size),
      dossier: importDossier,
      client: importClient.trim() || undefined,
      dateAjout: dateStr,
    }));
    setDocs((prev) => [...newDocs, ...prev]);
    toast.success(`${selectedFiles.length} fichier(s) importé(s) dans "${importDossier}"`);
    setSelectedFiles([]);
    setImportClient("");
    setImportDialogOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    toast.success("Document supprimé");
  };

  const handleDownload = (doc: Doc) => {
    toast.info(`Téléchargement de "${doc.nom}" (démo)`);
  };

  const handleRename = () => {
    if (!renameDoc || !renameName.trim()) return;
    setDocs((prev) => prev.map((d) => d.id === renameDoc.id ? { ...d, nom: renameName.trim(), type: detectType(renameName.trim()) } : d));
    toast.success(`Document renommé en "${renameName.trim()}"`);
    setRenameDoc(null);
  };

  const handleMove = () => {
    if (!moveDoc || !moveDossier) return;
    setDocs((prev) => prev.map((d) => d.id === moveDoc.id ? { ...d, dossier: moveDossier } : d));
    toast.success(`"${moveDoc.nom}" déplacé vers "${moveDossier}"`);
    setMoveDoc(null);
  };

  return (
    <AdminLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FolderOpen className="h-6 w-6 text-primary" /> Documents
              </h1>
              <p className="text-muted-foreground text-sm">{stats.total} fichiers · {stats.taille} · {stats.dossiers} dossiers</p>
            </div>
            <div className="flex gap-2 self-start">
              <Button variant="outline" className="gap-1.5 text-xs sm:text-sm" onClick={() => setFolderDialogOpen(true)}>
                <FolderPlus className="h-4 w-4" /> <span className="hidden sm:inline">Nouveau</span> dossier
              </Button>
              <Button className="gap-1.5 text-xs sm:text-sm" onClick={() => { setImportDossier(dossiers[0]); setImportDialogOpen(true); }}>
                <Upload className="h-4 w-4" /> Importer
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
            <div className="relative w-full sm:flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un fichier..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {allDossiers.map((d) => (
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
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="Renommer" onClick={() => { setRenameDoc(doc); setRenameName(doc.nom); }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="Déplacer" onClick={() => { setMoveDoc(doc); setMoveDossier(dossiers.find((d) => d !== doc.dossier) || dossiers[0]); }}>
                          <FolderInput className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleDownload(doc)}>
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(doc.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
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

        {/* New Folder Dialog */}
        <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Nouveau dossier</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <Label>Nom du dossier</Label>
              <Input
                placeholder="Ex : Projets 2026"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFolderDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import Dialog */}
        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Importer des fichiers</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Fichiers</Label>
                <div
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files.length) setSelectedFiles(Array.from(e.dataTransfer.files));
                  }}
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {selectedFiles.length > 0
                      ? `${selectedFiles.length} fichier(s) sélectionné(s)`
                      : "Glissez-déposez ou cliquez pour sélectionner"}
                  </p>
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground max-h-24 overflow-auto">
                      {selectedFiles.map((f, i) => (
                        <p key={i} className="truncate">{f.name} ({formatSize(f.size)})</p>
                      ))}
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFilesSelected} />
              </div>

              <div className="space-y-1.5">
                <Label>Dossier de destination</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={importDossier}
                  onChange={(e) => setImportDossier(e.target.value)}
                >
                  {dossiers.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Client associé <span className="text-muted-foreground">(optionnel)</span></Label>
                <Input placeholder="Nom du client" value={importClient} onChange={(e) => setImportClient(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setImportDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleImport} disabled={selectedFiles.length === 0}>
                Importer {selectedFiles.length > 0 && `(${selectedFiles.length})`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Rename Dialog */}
        <Dialog open={!!renameDoc} onOpenChange={(v) => !v && setRenameDoc(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Renommer le document</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <Label>Nouveau nom</Label>
              <Input
                value={renameName}
                onChange={(e) => setRenameName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRename()}
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRenameDoc(null)}>Annuler</Button>
              <Button onClick={handleRename} disabled={!renameName.trim()}>Renommer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Move Dialog */}
        <Dialog open={!!moveDoc} onOpenChange={(v) => !v && setMoveDoc(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Déplacer "{moveDoc?.nom}"</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <Label>Dossier de destination</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={moveDossier}
                onChange={(e) => setMoveDossier(e.target.value)}
              >
                {dossiers.filter((d) => d !== moveDoc?.dossier).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">Actuellement dans : {moveDoc?.dossier}</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setMoveDoc(null)}>Annuler</Button>
              <Button onClick={handleMove}>Déplacer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminPageTransition>
    </AdminLayout>
  );
}
