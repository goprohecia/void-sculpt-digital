import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Trash2, Send } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Photo {
  id: string;
  url: string;
  nom: string;
  date: string;
}

interface Props {
  dossierId: string;
}

export function DossierPhotos({ dossierId }: Props) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(f => {
      if (!f.type.startsWith("image/")) { toast.error(`${f.name} n'est pas une image`); return; }
      const url = URL.createObjectURL(f);
      setPhotos(prev => [...prev, { id: `photo-${Date.now()}-${Math.random()}`, url, nom: f.name, date: new Date().toISOString().split("T")[0] }]);
    });
    toast.success("Photo(s) ajoutée(s)");
    if (fileRef.current) fileRef.current.value = "";
  };

  const remove = (id: string) => { setPhotos(prev => prev.filter(p => p.id !== id)); toast.success("Photo supprimée"); };

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Camera className="h-12 w-12 text-muted-foreground/40 mb-3" />
        <p className="text-muted-foreground mb-3">Aucune photo</p>
        <Button onClick={() => fileRef.current?.click()} className="gap-1.5"><Upload className="h-4 w-4" /> Ajouter une photo</Button>
        <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => fileRef.current?.click()} className="gap-1.5"><Upload className="h-3.5 w-3.5" /> Ajouter</Button>
        <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map(p => (
          <div key={p.id} className="relative group rounded-lg overflow-hidden border bg-card">
            <img src={p.url} alt={p.nom} className="w-full h-32 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => toast.success("Envoyée au client")}><Send className="h-3 w-3" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button size="sm" variant="destructive"><Trash2 className="h-3 w-3" /></Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Supprimer cette photo ?</AlertDialogTitle><AlertDialogDescription>Irréversible.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => remove(p.id)}>Supprimer</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <p className="text-[10px] text-muted-foreground p-1.5 truncate">{p.nom}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
