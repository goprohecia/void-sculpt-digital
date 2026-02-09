import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CalendlyBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CalendlyBookingDialog({ open, onOpenChange }: CalendlyBookingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Prendre un rendez-vous</DialogTitle>
        </DialogHeader>
        <div className="flex-1 h-full px-4 pb-4">
          <iframe
            src="https://calendly.com/yannis-bezriche/impartial-games"
            className="w-full h-full min-h-[500px] rounded-lg border-0"
            title="Calendly"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
