import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Send, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PdfPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string | null;
  title: string;
  clientName?: string;
  onDownload?: () => void;
}

export function PdfPreviewDialog({ open, onOpenChange, pdfUrl, title, clientName, onDownload }: PdfPreviewDialogProps) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setSending(true);
    // Simulate email sending delay
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    toast.success(`${title} envoyé${clientName ? ` à ${clientName}` : ""} par email`);
    setTimeout(() => setSent(false), 3000);
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setSent(false);
      setSending(false);
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border/50 flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-base">{title}</DialogTitle>
          <div className="flex items-center gap-2">
            {onDownload && (
              <Button size="sm" variant="outline" className="gap-1.5" onClick={onDownload}>
                <Download className="h-3.5 w-3.5" />
                Télécharger
              </Button>
            )}
            <Button
              size="sm"
              className="gap-1.5"
              onClick={handleSend}
              disabled={sending || sent}
            >
              {sending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : sent ? (
                <CheckCircle className="h-3.5 w-3.5" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              {sending ? "Envoi…" : sent ? "Envoyé !" : "Envoyer au client"}
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title={`Aperçu ${title}`}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Chargement...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
