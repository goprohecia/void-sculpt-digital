import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface BookingFormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  required: boolean;
  options?: string[];
}

interface BookingStepFormProps {
  fields: BookingFormField[];
  formData: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BookingStepForm({ fields, formData, onChange, onNext, onBack }: BookingStepFormProps) {
  const allRequiredFilled = fields
    .filter(f => f.required)
    .every(f => formData[f.id]?.trim());

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Informations complémentaires</h2>
        <p className="text-sm text-muted-foreground">Veuillez remplir les informations ci-dessous avant votre rendez-vous</p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        {fields.map(field => (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.type === "textarea" ? (
              <Textarea
                value={formData[field.id] || ""}
                onChange={e => onChange(field.id, e.target.value)}
                placeholder={`Votre ${field.label.toLowerCase()}...`}
              />
            ) : field.type === "select" && field.options ? (
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData[field.id] || ""}
                onChange={e => onChange(field.id, e.target.value)}
              >
                <option value="">Sélectionner...</option>
                {field.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <Input
                value={formData[field.id] || ""}
                onChange={e => onChange(field.id, e.target.value)}
                placeholder={`Votre ${field.label.toLowerCase()}...`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Retour</Button>
        <Button onClick={onNext} disabled={!allRequiredFilled}>Continuer</Button>
      </div>
    </div>
  );
}
