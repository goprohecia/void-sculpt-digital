import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CompleteProfileDialogProps {
  open: boolean;
  onComplete: () => void;
  userId: string;
}

export function CompleteProfileDialog({ open, onComplete, userId }: CompleteProfileDialogProps) {
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) return;

    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ nom: nom.trim(), telephone: telephone.trim() || null })
      .eq("user_id", userId);

    setLoading(false);

    if (error) {
      toast.error("Erreur lors de la mise à jour du profil");
      console.error(error);
      return;
    }

    toast.success("Profil complété avec succès !");
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Finaliser votre inscription</DialogTitle>
          <DialogDescription>
            Renseignez vos informations pour compléter votre compte
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom complet *</label>
            <Input
              type="text"
              placeholder="Jean Dupont"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Téléphone</label>
            <Input
              type="tel"
              placeholder="+33 6 12 34 56 78"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || !nom.trim()}>
            {loading ? "Enregistrement..." : "Valider"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
