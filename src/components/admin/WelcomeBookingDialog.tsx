import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { CalendlyBookingDialog } from "./CalendlyBookingDialog";

interface WelcomeBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeBookingDialog({ open, onOpenChange }: WelcomeBookingDialogProps) {
  const [showCalendly, setShowCalendly] = useState(false);

  const handleBook = () => {
    onOpenChange(false);
    localStorage.setItem("impartial_first_visit_done", "true");
    setShowCalendly(true);
  };

  const handleLater = () => {
    localStorage.setItem("impartial_first_visit_done", "true");
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <CalendarDays className="h-7 w-7 text-primary" />
            </div>
            <DialogTitle className="text-xl">Bienvenue dans votre espace !</DialogTitle>
            <DialogDescription className="text-sm mt-2">
              Votre inscription est finalisée. Nous vous recommandons de prendre un rendez-vous 
              pour faire connaissance et discuter de votre projet.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button onClick={handleBook} className="w-full gap-2">
              <CalendarDays className="h-4 w-4" />
              Prendre rendez-vous
            </Button>
            <Button variant="ghost" onClick={handleLater} className="w-full text-muted-foreground">
              Plus tard
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <CalendlyBookingDialog open={showCalendly} onOpenChange={setShowCalendly} />
    </>
  );
}
