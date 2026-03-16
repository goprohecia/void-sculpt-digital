import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Download, Trash2, Send, Plus } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Doc {
  id: string;
  nom: string;
  type: string;
  taille: string;
  dateUpload: string;
}

interface Props {
  dossierId: string;
}

export function DossierDocuments({ dossierId }: Props) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(f => {
      setDocs(prev => [...prev, {
        id: `doc-${Date.now()}-${Math.random()}`,
        nom: f.name,
        type: f.type.split("/")[1]?.toUpperCase() || "FICHIER",
        taille: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} Mo` : `${(f.size / 1024).toFixed(0)} Ko`,
        dateUpload: new Date().toISOString().split("T")[0],
      }]);
    });
    toast.success("Document(s) uploadé(s)");
    if (fileRef.current) fileRef.current.value = "";
  };

  const remove = (id: string) => { setDocs(prev => prev.filter(d => d.id !== id)); toast.success("Document supprimé"); };

  if (docs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/40 mb-3" />
        <p className="text-muted-foreground mb-3">Aucun document</p>
        <Button onClick={() => fileRef.current?.click()} className="gap-1.5"><Upload className="h-4 w-4" /> Uploader un document</Button>
        <input ref={fileRef} type="file" multiple className="hidden" onChange={handleUpload} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => fileRef.current?.click()} className="gap-1.5"><Upload className="h-3.5 w-3.5" /> Uploader</Button>
        <input ref={fileRef} type="file" multiple className="hidden" onChange={handleUpload} />
      </div>
      <div className="space-y-2">
        {docs.map(d => (
          <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">{d.nom}</p>
                <p className="text-xs text-muted-foreground">{d.type} · {d.taille} · {d.dateUpload}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" onClick={() => toast.success("Téléchargement…")}><Download className="h-3.5 w-3.5" /></Button>
              <Button size="sm" variant="ghost" onClick={() => toast.success("Envoyé au client")}><Send className="h-3.5 w-3.5" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Supprimer ce document ?</AlertDialogTitle><AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => remove(d.id)}>Supprimer</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
