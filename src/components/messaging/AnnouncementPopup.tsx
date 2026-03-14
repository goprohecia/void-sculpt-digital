import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Megaphone } from "lucide-react";

interface Annonce {
  id: string;
  titre: string;
  contenu: string;
}

export function AnnouncementPopup() {
  const { isDemo, supabaseUserId } = useIsDemo();
  const queryClient = useQueryClient();
  const [current, setCurrent] = useState<Annonce | null>(null);
  const [open, setOpen] = useState(false);

  const { data: unread = [] } = useQuery<Annonce[]>({
    queryKey: ["unread-annonces", supabaseUserId],
    queryFn: async () => {
      if (isDemo || !supabaseUserId) return [];

      // Get active annonces
      const { data: annonces, error } = await (supabase as any)
        .from("annonces")
        .select("id, titre, contenu, date_expiration")
        .eq("statut", "active");

      if (error || !annonces?.length) return [];

      // Filter expired
      const now = new Date();
      const active = annonces.filter((a: any) =>
        !a.date_expiration || new Date(a.date_expiration) > now
      );
      if (!active.length) return [];

      // Get already read
      const { data: lectures } = await (supabase as any)
        .from("annonce_lecture")
        .select("annonce_id")
        .eq("user_id", supabaseUserId);

      const readIds = new Set((lectures || []).map((l: any) => l.annonce_id));
      return active.filter((a: any) => !readIds.has(a.id));
    },
    enabled: !isDemo && !!supabaseUserId,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (unread.length > 0 && !current) {
      setCurrent(unread[0]);
      setOpen(true);
    }
  }, [unread, current]);

  const handleClose = async () => {
    if (current && supabaseUserId && !isDemo) {
      await (supabase as any).from("annonce_lecture").insert({
        annonce_id: current.id,
        user_id: supabaseUserId,
      });
      queryClient.invalidateQueries({ queryKey: ["unread-annonces"] });
    }
    setOpen(false);
    setCurrent(null);
  };

  if (!current) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            {current.titre}
          </DialogTitle>
          <DialogDescription className="sr-only">Annonce importante</DialogDescription>
        </DialogHeader>
        <div className="text-sm text-foreground whitespace-pre-wrap pt-2">
          {current.contenu}
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Fermer
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
