import { useState, useRef, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Timer, Play, Square, Clock, User, FolderOpen, TrendingUp, Save, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDossiers } from "@/hooks/use-dossiers";

interface TimeEntry {
  id: string;
  description: string;
  client: string;
  dossier: string;
  duree: string;
  dureeMin: number;
  date: string;
  salarie: string;
}

const INITIAL_ENTRIES: TimeEntry[] = [
  { id: "1", description: "Développement page d'accueil", client: "Altarys SAS", dossier: "DOS-042", duree: "2h30", dureeMin: 150, date: "08/03/2026", salarie: "Sophie M." },
  { id: "2", description: "Appel de suivi client", client: "Pierre Dupont", dossier: "DOS-038", duree: "0h45", dureeMin: 45, date: "08/03/2026", salarie: "Admin" },
  { id: "3", description: "Rédaction cahier des charges", client: "Marie Martin", dossier: "DOS-035", duree: "3h15", dureeMin: 195, date: "07/03/2026", salarie: "Admin" },
  { id: "4", description: "Tests et corrections bugs", client: "Altarys SAS", dossier: "DOS-042", duree: "1h45", dureeMin: 105, date: "07/03/2026", salarie: "Marc L." },
  { id: "5", description: "Design UI composants", client: "Altarys SAS", dossier: "DOS-042", duree: "4h00", dureeMin: 240, date: "06/03/2026", salarie: "Sophie M." },
  { id: "6", description: "Réunion de lancement", client: "Pierre Dupont", dossier: "DOS-038", duree: "1h00", dureeMin: 60, date: "06/03/2026", salarie: "Admin" },
  { id: "7", description: "Configuration serveur", client: "Marie Martin", dossier: "DOS-035", duree: "2h00", dureeMin: 120, date: "05/03/2026", salarie: "Marc L." },
];

export default function AdminTemps() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>(INITIAL_ENTRIES);

  // Save dialog state
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [stoppedElapsed, setStoppedElapsed] = useState(0);
  const [saveDescription, setSaveDescription] = useState("");
  const [saveDossierId, setSaveDossierId] = useState("");
  const [dossierSearch, setDossierSearch] = useState("");

  // Edit dialog state
  const [editEntry, setEditEntry] = useState<TimeEntry | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editDuree, setEditDuree] = useState("");
  const [editClient, setEditClient] = useState("");
  const [editDossier, setEditDossier] = useState("");

  const { dossiers } = useDossiers();

  // Timer logic with proper cleanup
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const totalMinutes = entries.reduce((sum, e) => sum + e.dureeMin, 0);
  const totalHeures = Math.floor(totalMinutes / 60);
  const totalMin = totalMinutes % 60;
  const uniqueClients = new Set(entries.map((e) => e.client)).size;

  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatDuree = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h${m.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setElapsed(0);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setStoppedElapsed(elapsed);
    setSaveDescription("");
    setSaveDossierId("");
    setDossierSearch("");
    setSaveDialogOpen(true);
  };

  const filteredDossiers = dossiers.filter((d) => {
    if (!dossierSearch) return true;
    const q = dossierSearch.toLowerCase();
    return d.reference.toLowerCase().includes(q) || d.clientNom.toLowerCase().includes(q) || d.typePrestation.toLowerCase().includes(q);
  });

  const handleSaveEntry = () => {
    const dossier = dossiers.find((d) => d.id === saveDossierId);
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
    const dureeMin = Math.ceil(stoppedElapsed / 60);

    const newEntry: TimeEntry = {
      id: `t-${Date.now()}`,
      description: saveDescription || "Temps enregistré",
      client: dossier?.clientNom || "—",
      dossier: dossier?.reference || "—",
      duree: formatDuree(stoppedElapsed),
      dureeMin,
      date: dateStr,
      salarie: "Admin",
    };

    setEntries((prev) => [newEntry, ...prev]);
    setElapsed(0);
    setSaveDialogOpen(false);
    toast.success(`${formatDuree(stoppedElapsed)} enregistré${dossier ? ` sur ${dossier.reference}` : ""}`);
  };

  const handleDiscard = () => {
    setElapsed(0);
    setSaveDialogOpen(false);
    toast.info("Temps non enregistré");
  };

  const handleOpenEdit = (entry: TimeEntry) => {
    setEditEntry(entry);
    setEditDescription(entry.description);
    setEditDuree(entry.duree);
    setEditClient(entry.client);
    setEditDossier(entry.dossier);
  };

  const handleSaveEdit = () => {
    if (!editEntry) return;
    setEntries((prev) => prev.map((e) => e.id === editEntry.id ? { ...e, description: editDescription, duree: editDuree, client: editClient, dossier: editDossier } : e));
    toast.success("Entrée modifiée");
    setEditEntry(null);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast.success("Entrée supprimée");
  };

  const selectedDossier = dossiers.find((d) => d.id === saveDossierId);

  return (
    <AdminLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Timer className="h-6 w-6 text-primary" /> Suivi du temps
            </h1>
            <p className="text-muted-foreground text-sm">Tracez le temps passé par client et par dossier</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { label: "Cette semaine", value: `${totalHeures}h${totalMin.toString().padStart(2, "0")}`, icon: Clock },
              { label: "Entrées", value: entries.length.toString(), icon: FolderOpen },
              { label: "Clients actifs", value: uniqueClients.toString(), icon: User },
              { label: "Taux horaire moyen", value: "85€/h", icon: TrendingUp },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Timer */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Button
                  onClick={isRunning ? handleStop : handleStart}
                  variant={isRunning ? "destructive" : "default"}
                  size="lg"
                  className="gap-2"
                >
                  {isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isRunning ? "Arrêter" : "Démarrer"}
                </Button>
                <span className="text-3xl font-mono font-bold tabular-nums">{formatElapsed(elapsed)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Entries */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Entrées récentes</CardTitle>
              <CardDescription>Temps enregistré cette semaine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {entries.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/20 transition-colors">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{entry.description}</p>
                      <p className="text-xs text-muted-foreground">{entry.client} · {entry.dossier} · {entry.salarie}</p>
                    </div>
                    <span className="text-sm font-mono font-medium text-primary shrink-0">{entry.duree}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{entry.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Time Entry Dialog */}
        <Dialog open={saveDialogOpen} onOpenChange={(v) => { if (!v) handleDiscard(); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Save className="h-5 w-5" /> Enregistrer le temps
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="text-center">
                <span className="text-3xl font-mono font-bold text-primary">{formatElapsed(stoppedElapsed)}</span>
                <p className="text-xs text-muted-foreground mt-1">{formatDuree(stoppedElapsed)} enregistré(s)</p>
              </div>

              <div className="space-y-1.5">
                <Label>Description</Label>
                <Input
                  placeholder="Ex : Développement page d'accueil"
                  value={saveDescription}
                  onChange={(e) => setSaveDescription(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <Label>Associer à un dossier</Label>
                <Input
                  placeholder="Rechercher un dossier..."
                  value={dossierSearch}
                  onChange={(e) => setDossierSearch(e.target.value)}
                />
                <div className="max-h-40 overflow-auto border border-border rounded-md divide-y divide-border">
                  {filteredDossiers.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">Aucun dossier trouvé</p>
                  )}
                  {filteredDossiers.slice(0, 10).map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSaveDossierId(d.id)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/30 transition-colors ${saveDossierId === d.id ? "bg-primary/10 text-primary" : ""}`}
                    >
                      <span className="font-medium">{d.reference}</span>
                      <span className="text-muted-foreground"> — {d.clientNom}</span>
                      <span className="text-xs text-muted-foreground ml-1">({d.typePrestation})</span>
                    </button>
                  ))}
                </div>
                {selectedDossier && (
                  <p className="text-xs text-primary">✓ {selectedDossier.reference} — {selectedDossier.clientNom}</p>
                )}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleDiscard}>Annuler</Button>
              <Button onClick={handleSaveEntry} className="gap-1.5">
                <Save className="h-3.5 w-3.5" /> Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminPageTransition>
    </AdminLayout>
  );
}
