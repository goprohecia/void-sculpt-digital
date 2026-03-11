import { useState, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StickyNote, Plus, Search, User, FolderOpen, Trash2, Pin, Filter } from "lucide-react";

interface Note {
  id: string;
  titre: string;
  contenu: string;
  client?: string;
  dossier?: string;
  epingle: boolean;
  date: string;
  auteur: string;
}

const DEMO_NOTES: Note[] = [
  { id: "1", titre: "Appel client Dupont - retour positif", contenu: "Pierre est satisfait de la V1 du site. Il souhaite ajouter un blog et une section témoignages. Budget additionnel à discuter.", client: "Pierre Dupont", dossier: "DOS-038", epingle: true, date: "08/03/2026", auteur: "Admin" },
  { id: "2", titre: "Points d'attention Altarys", contenu: "Le client est sensible aux délais. Prévoir une marge de sécurité sur les deadlines. Contact principal : Marie (DG), pas Jean (technique).", client: "Altarys SAS", dossier: "DOS-042", epingle: true, date: "07/03/2026", auteur: "Sophie M." },
  { id: "3", titre: "Idée : nouveau template email", contenu: "Créer un template de relance plus convivial avec un bouton de paiement direct. Voir les best practices du secteur.", epingle: false, date: "06/03/2026", auteur: "Admin" },
  { id: "4", titre: "Réunion équipe - compte-rendu", contenu: "Objectifs Q2 : augmenter le panier moyen de 15%. Recruter un développeur junior. Lancer la V2 du module facturation avant fin avril.", epingle: false, date: "05/03/2026", auteur: "Admin" },
  { id: "5", titre: "Bug signalé par client Martin", contenu: "Le formulaire de contact ne fonctionne plus sur mobile. À corriger en priorité cette semaine. Screenshot reçu par email.", client: "Marie Martin", dossier: "DOS-035", epingle: false, date: "04/03/2026", auteur: "Marc L." },
  { id: "6", titre: "Benchmark concurrence", contenu: "Concurrent X propose un module CRM intégré. Y a un meilleur design mais moins de fonctionnalités. Notre avantage : la personnalisation.", epingle: false, date: "02/03/2026", auteur: "Admin" },
];

export default function AdminNotes() {
  const [notes, setNotes] = useState(DEMO_NOTES);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newNote, setNewNote] = useState({ titre: "", contenu: "" });
  const [filterAuteur, setFilterAuteur] = useState("all");
  const [filterClient, setFilterClient] = useState("all");
  const [filterEpingle, setFilterEpingle] = useState("all");

  const auteurs = useMemo(() => [...new Set(notes.map((n) => n.auteur))], [notes]);
  const clients = useMemo(() => [...new Set(notes.filter((n) => n.client).map((n) => n.client!))], [notes]);

  const filtered = notes
    .filter((n) => !search || n.titre.toLowerCase().includes(search.toLowerCase()) || n.contenu.toLowerCase().includes(search.toLowerCase()) || n.client?.toLowerCase().includes(search.toLowerCase()))
    .filter((n) => filterAuteur === "all" || n.auteur === filterAuteur)
    .filter((n) => filterClient === "all" || n.client === filterClient)
    .filter((n) => filterEpingle === "all" || (filterEpingle === "pinned" ? n.epingle : !n.epingle))
    .sort((a, b) => (a.epingle === b.epingle ? 0 : a.epingle ? -1 : 1));

  const addNote = () => {
    if (!newNote.titre.trim()) return;
    setNotes((prev) => [
      { id: Date.now().toString(), titre: newNote.titre, contenu: newNote.contenu, epingle: false, date: new Date().toLocaleDateString("fr-FR"), auteur: "Admin" },
      ...prev,
    ]);
    setNewNote({ titre: "", contenu: "" });
    setShowForm(false);
  };

  const togglePin = (id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, epingle: !n.epingle } : n)));
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const hasActiveFilters = filterAuteur !== "all" || filterClient !== "all" || filterEpingle !== "all";

  return (
    <AdminLayout>
      <AdminPageTransition>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <StickyNote className="h-6 w-6 text-primary" /> Notes & Journal
              </h1>
              <p className="text-muted-foreground text-sm">{notes.length} notes · {notes.filter((n) => n.epingle).length} épinglées</p>
            </div>
            <div className="flex gap-2 self-start w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-full sm:w-56" />
              </div>
              <Button onClick={() => setShowForm(!showForm)} className="gap-1.5 shrink-0">
                <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Nouvelle</span> note
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" /> Filtres :
            </div>
            <Select value={filterAuteur} onValueChange={setFilterAuteur}>
              <SelectTrigger className="w-full sm:w-40 h-8 text-xs">
                <SelectValue placeholder="Auteur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les auteurs</SelectItem>
                {auteurs.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterClient} onValueChange={setFilterClient}>
              <SelectTrigger className="w-full sm:w-40 h-8 text-xs">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les clients</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterEpingle} onValueChange={setFilterEpingle}>
              <SelectTrigger className="w-full sm:w-40 h-8 text-xs">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="pinned">Épinglées</SelectItem>
                <SelectItem value="unpinned">Non épinglées</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => { setFilterAuteur("all"); setFilterClient("all"); setFilterEpingle("all"); }}>
                Réinitialiser
              </Button>
            )}
          </div>

          {showForm && (
            <Card>
              <CardContent className="pt-4 space-y-3">
                <Input placeholder="Titre de la note" value={newNote.titre} onChange={(e) => setNewNote((n) => ({ ...n, titre: e.target.value }))} />
                <Textarea placeholder="Contenu..." rows={4} value={newNote.contenu} onChange={(e) => setNewNote((n) => ({ ...n, contenu: e.target.value }))} />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
                  <Button onClick={addNote} disabled={!newNote.titre.trim()}>Enregistrer</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((note) => (
              <Card key={note.id} className={`hover:border-primary/30 transition-colors ${note.epingle ? "border-amber-500/30" : ""}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      {note.epingle && <Pin className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
                      {note.titre}
                    </CardTitle>
                    <div className="flex gap-1 shrink-0">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => togglePin(note.id)}>
                        <Pin className={`h-3 w-3 ${note.epingle ? "text-amber-400" : "text-muted-foreground"}`} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive" onClick={() => deleteNote(note.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xs text-muted-foreground line-clamp-3">{note.contenu}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {note.client && (
                      <Badge variant="outline" className="text-[10px] gap-1"><User className="h-2.5 w-2.5" />{note.client}</Badge>
                    )}
                    {note.dossier && (
                      <Badge variant="outline" className="text-[10px] gap-1"><FolderOpen className="h-2.5 w-2.5" />{note.dossier}</Badge>
                    )}
                    <span className="text-[10px] text-muted-foreground ml-auto">{note.auteur} · {note.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground text-sm">
                Aucune note ne correspond aux filtres sélectionnés.
              </div>
            )}
          </div>
        </div>
      </AdminPageTransition>
    </AdminLayout>
  );
}
