import { useState } from "react";
import { useParams } from "react-router-dom";
import { BookingStepper } from "@/components/booking/BookingStepper";
import { BookingStepSlot, type TimeSlot } from "@/components/booking/BookingStepSlot";
import { BookingStepForm, type BookingFormField } from "@/components/booking/BookingStepForm";
import { BookingStepRecap } from "@/components/booking/BookingStepRecap";
import { BookingStepConfirmation } from "@/components/booking/BookingStepConfirmation";

// Mock booking config
const MOCK_CONFIG = {
  businessName: "Mon Entreprise",
  businessLogo: "",
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

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const totalSteps = skipForm ? 3 : 4;

  const goNext = () => {
    if (currentStep === 1 && skipForm) {
      setCurrentStep(3); // skip to recap (mapped as step 3 in stepper)
    } else {
      setCurrentStep(s => Math.min(s + 1, totalSteps));
    }
  };

  const goBack = () => {
    if (currentStep === 3 && skipForm) {
      setCurrentStep(1);
    } else {
      setCurrentStep(s => Math.max(s - 1, 1));
    }
  };

  // Map logical steps when form is skipped
  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <BookingStepSlot
          selectedSlot={selectedSlot}
          onSelect={setSelectedSlot}
          onNext={goNext}
        />
      );
    }
    if (currentStep === 2 && !skipForm) {
      return (
        <BookingStepForm
          fields={config.champsFormulaire}
          formData={formData}
          onChange={(id, val) => setFormData(prev => ({ ...prev, [id]: val }))}
          onNext={goNext}
          onBack={goBack}
        />
      );
    }
    if ((currentStep === 3 && !skipForm) || (currentStep === 2 && skipForm) || (currentStep === 3 && skipForm)) {
      // Recap step
      const recapStep = skipForm ? 3 : 3;
      if (currentStep === recapStep || (skipForm && currentStep === 3)) {
        return selectedSlot ? (
          <BookingStepRecap
            slot={selectedSlot}
            formData={formData}
            formFields={config.champsFormulaire}
            showForm={config.formulaireEnabled}
            acompteType={config.acompteType}
            acompteMontant={config.acompteMontant}
            prixPrestation={config.prixPrestation}
            onConfirm={goNext}
            onBack={goBack}
          />
        ) : null;
      }
    }
    // Confirmation
    if (selectedSlot) {
      return (
        <BookingStepConfirmation
          slot={selectedSlot}
          businessName={config.businessName}
        />
      );
    }
    return null;
  };

  // Simplified step rendering
  const getContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BookingStepSlot
            selectedSlot={selectedSlot}
            onSelect={setSelectedSlot}
            onNext={goNext}
          />
        );
      case 2:
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
              onConfirm={goNext}
              onBack={goBack}
            />
          ) : null;
        }
        return (
          <BookingStepForm
            fields={config.champsFormulaire}
            formData={formData}
            onChange={(id, val) => setFormData(prev => ({ ...prev, [id]: val }))}
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 3:
        if (skipForm) {
          return selectedSlot ? (
            <BookingStepConfirmation
              slot={selectedSlot}
              businessName={config.businessName}
            />
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
            onConfirm={goNext}
            onBack={goBack}
          />
        ) : null;
      case 4:
        return selectedSlot ? (
          <BookingStepConfirmation
            slot={selectedSlot}
            businessName={config.businessName}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <BookingStepper currentStep={currentStep} skipForm={skipForm} />
        {getContent()}
      </main>
    </div>
  );
}
