import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, Plus, Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Note {
  id: string;
  auteur: string;
  contenu: string;
  date: string;
}

interface Props {
  dossierId: string;
}

export function DossierNotes({ dossierId }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const add = () => {
    if (!input.trim()) return;
    setNotes(prev => [...prev, { id: `note-${Date.now()}`, auteur: "Admin", contenu: input.trim(), date: new Date().toISOString() }]);
    setInput("");
    toast.success("Note ajoutée");
  };

  const save = () => {
    if (!editContent.trim()) return;
    setNotes(prev => prev.map(n => n.id === editId ? { ...n, contenu: editContent.trim(), date: new Date().toISOString() } : n));
    setEditId(null);
    setEditContent("");
    toast.success("Note modifiée");
  };

  const remove = (id: string) => { setNotes(prev => prev.filter(n => n.id !== id)); toast.success("Note supprimée"); };

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <StickyNote className="h-12 w-12 text-muted-foreground/40 mb-3" />
        <p className="text-muted-foreground mb-3">Aucune note interne</p>
        <div className="w-full max-w-md space-y-2">
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Ajouter une note interne..." rows={3} />
          <Button onClick={add} disabled={!input.trim()} className="gap-1.5"><Plus className="h-4 w-4" /> Ajouter une note</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Ajouter */}
      <div className="flex gap-2">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Nouvelle note..." rows={2} className="flex-1" />
        <Button onClick={add} disabled={!input.trim()} className="self-end gap-1.5"><Plus className="h-4 w-4" /> Ajouter</Button>
      </div>

      {/* Liste */}
      <div className="space-y-2">
        {notes.map(n => (
          <div key={n.id} className="p-3 rounded-lg border bg-card">
            {editId === n.id ? (
              <div className="space-y-2">
                <Textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={2} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={save}>Enregistrer</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>Annuler</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm">{n.contenu}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{n.auteur} · {new Date(n.date).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" onClick={() => { setEditId(n.id); setEditContent(n.contenu); }}><Pencil className="h-3 w-3" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="h-3 w-3" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Supprimer cette note ?</AlertDialogTitle><AlertDialogDescription>Irréversible.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => remove(n.id)}>Supprimer</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
