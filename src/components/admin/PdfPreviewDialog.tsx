import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface PdfPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string | null;
  title: string;
  onDownload?: () => void;
}

export function PdfPreviewDialog({ open, onOpenChange, pdfUrl, title, onDownload }: PdfPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
