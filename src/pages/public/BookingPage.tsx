import { useState } from "react";
import { useParams } from "react-router-dom";
import { BookingStepper } from "@/components/booking/BookingStepper";
import { BookingStepSlot, type TimeSlot } from "@/components/booking/BookingStepSlot";
import { BookingStepForm, type BookingFormField } from "@/components/booking/BookingStepForm";
import { BookingStepRecap } from "@/components/booking/BookingStepRecap";
import { BookingStepConfirmation } from "@/components/booking/BookingStepConfirmation";

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
};

export default function BookingPage() {
  const { slug } = useParams();
  const config = MOCK_CONFIG;
  const skipForm = !config.formulaireEnabled;

  // Steps: always 1-based. If skipForm, we use steps [1, 2, 3] mapped to [slot, recap, confirm]
  // Otherwise [1, 2, 3, 4] mapped to [slot, form, recap, confirm]
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Stepper display step (for the visual stepper)
  const stepperStep = step;

  const getContent = () => {
    if (step === 1) {
      return (
        <BookingStepSlot
          selectedSlot={selectedSlot}
          onSelect={setSelectedSlot}
          onNext={() => setStep(2)}
        />
      );
    }

    if (step === 2) {
      if (skipForm) {
        // Step 2 = recap when form is skipped
        return selectedSlot ? (
          <BookingStepRecap
            slot={selectedSlot}
            formData={formData}
            formFields={config.champsFormulaire}
            showForm={false}
            acompteType={config.acompteType}
            acompteMontant={config.acompteMontant}
            prixPrestation={config.prixPrestation}
            onConfirm={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        ) : null;
      }
      // Step 2 = form
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
        // Step 3 = confirmation when form is skipped
        return selectedSlot ? (
          <BookingStepConfirmation slot={selectedSlot} businessName={config.businessName} />
        ) : null;
      }
      // Step 3 = recap
      return selectedSlot ? (
        <BookingStepRecap
          slot={selectedSlot}
          formData={formData}
          formFields={config.champsFormulaire}
          showForm={config.formulaireEnabled}
          acompteType={config.acompteType}
          acompteMontant={config.acompteMontant}
          prixPrestation={config.prixPrestation}
          onConfirm={() => setStep(4)}
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
        <BookingStepper currentStep={stepperStep} skipForm={skipForm} />
        {getContent()}
      </main>
    </div>
  );
}
