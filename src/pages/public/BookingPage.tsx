import { useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { BookingStepper } from "@/components/booking/BookingStepper";
import { BookingStepSlot, generateSlots, type TimeSlot } from "@/components/booking/BookingStepSlot";
import { BookingStepForm, type BookingFormField } from "@/components/booking/BookingStepForm";
import { BookingStepRecap } from "@/components/booking/BookingStepRecap";
import { BookingStepConfirmation } from "@/components/booking/BookingStepConfirmation";
import { BookingCountdown } from "@/components/booking/BookingCountdown";
import { toast } from "@/hooks/use-toast";
import { MOCK_DISPONIBILITES } from "@/data/mockData";

const LOCK_DURATION_MS = 10 * 60 * 1000;

const MOCK_CONFIG = {
  businessName: "Mon Entreprise",
  slug: "mon-entreprise",
  acompteType: "fixe" as const,
  acompteMontant: 30,
  prixPrestation: 120,
  formulaireEnabled: true,
  champsFormulaire: [
    { id: "motif", label: "Motif du rendez-vous", type: "text" as const, required: true },
    { id: "message", label: "Message complémentaire", type: "textarea" as const, required: false },
  ] as BookingFormField[],
  annulation: {
    delai: 24,
    unite: "heures" as const,
    politique: "total" as const,
    pourcentagePartiel: 50,
    messageClient: "Annulation gratuite jusqu'à 24h avant le rendez-vous. Remboursement intégral de l'acompte.",
  },
};

export default function BookingPage() {
  const { slug } = useParams();
  const config = MOCK_CONFIG;
  const skipForm = !config.formulaireEnabled;

  const [step, setStep] = useState(1);
  const [slots, setSlots] = useState<TimeSlot[]>(() => generateSlots());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [lockExpiry, setLockExpiry] = useState<number | null>(null);
  const confirmed = useRef(false);

  const lockSlot = useCallback((slot: TimeSlot) => {
    setSlots(prev => prev.map(s => {
      if (selectedSlot && s.id === selectedSlot.id && s.status === "verrouille") {
        return { ...s, status: "disponible" as const };
      }
      if (s.id === slot.id) {
        return { ...s, status: "verrouille" as const };
      }
      return s;
    }));
    setSelectedSlot(slot);
    setLockExpiry(Date.now() + LOCK_DURATION_MS);
    confirmed.current = false;
  }, [selectedSlot]);

  const handleExpired = useCallback(() => {
    if (confirmed.current) return;
    setSlots(prev => prev.map(s =>
      selectedSlot && s.id === selectedSlot.id && s.status === "verrouille"
        ? { ...s, status: "disponible" as const }
        : s
    ));
    setSelectedSlot(null);
    setLockExpiry(null);
    setStep(1);
    toast({
      title: "Créneau expiré",
      description: "Votre créneau n'est plus réservé, veuillez en sélectionner un autre.",
      variant: "destructive",
    });
  }, [selectedSlot]);

  const handleConfirm = useCallback(() => {
    confirmed.current = true;
    setSlots(prev => prev.map(s =>
      selectedSlot && s.id === selectedSlot.id
        ? { ...s, status: "reserve" as const }
        : s
    ));
    setLockExpiry(null);
    setStep(skipForm ? 3 : 4);
  }, [selectedSlot, skipForm]);

  const isConfirmed = confirmed.current;
  const showCountdown = selectedSlot && lockExpiry && !isConfirmed;

  const getContent = () => {
    if (step === 1) {
      return (
        <BookingStepSlot
          slots={slots}
          selectedSlot={selectedSlot}
          onSelect={lockSlot}
          onNext={() => setStep(2)}
        />
      );
    }

    if (step === 2) {
      if (skipForm) {
        return selectedSlot ? (
          <BookingStepRecap
            slot={selectedSlot}
            formData={formData}
            formFields={config.champsFormulaire}
            showForm={false}
            acompteType={config.acompteType}
            acompteMontant={config.acompteMontant}
            prixPrestation={config.prixPrestation}
            cancellationMessage={config.annulation.messageClient}
            onConfirm={handleConfirm}
            onBack={() => setStep(1)}
          />
        ) : null;
      }
      return (
        <BookingStepForm
          fields={config.champsFormulaire}
          formData={formData}
          onChange={(id, val) => setFormData(prev => ({ ...prev, [id]: val }))}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      );
    }

    if (step === 3) {
      if (skipForm) {
        return selectedSlot ? (
          <BookingStepConfirmation slot={selectedSlot} businessName={config.businessName} />
        ) : null;
      }
      return selectedSlot ? (
        <BookingStepRecap
          slot={selectedSlot}
          formData={formData}
          formFields={config.champsFormulaire}
          showForm={config.formulaireEnabled}
          acompteType={config.acompteType}
          acompteMontant={config.acompteMontant}
          prixPrestation={config.prixPrestation}
          cancellationMessage={config.annulation.messageClient}
          onConfirm={handleConfirm}
          onBack={() => setStep(2)}
        />
      ) : null;
    }

    if (step === 4) {
      return selectedSlot ? (
        <BookingStepConfirmation slot={selectedSlot} businessName={config.businessName} />
      ) : null;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {config.businessName[0]}
          </div>
          <div>
            <h1 className="font-semibold">{config.businessName}</h1>
            <p className="text-xs text-muted-foreground">Réservation en ligne</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <BookingStepper currentStep={step} skipForm={skipForm} />
        {showCountdown && (
          <BookingCountdown lockExpiry={lockExpiry} onExpired={handleExpired} />
        )}
        {getContent()}
      </main>
    </div>
  );
}
