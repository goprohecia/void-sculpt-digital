import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Copy, Link, Plus, Trash2, Save, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  required: boolean;
}

export function BookingSettingsTab() {
  const [slug, setSlug] = useState("mon-entreprise");
  const [acompteType, setAcompteType] = useState<"fixe" | "pourcentage">("fixe");
  const [acompteMontant, setAcompteMontant] = useState(30);
  const [formulaireEnabled, setFormulaireEnabled] = useState(true);
  const [fields, setFields] = useState<FormField[]>([
    { id: "motif", label: "Motif du rendez-vous", type: "text", required: true },
    { id: "message", label: "Message complémentaire", type: "textarea", required: false },
  ]);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "textarea" | "select">("text");
  const [saving, setSaving] = useState(false);

  const bookingUrl = `mybusinessassistant.com/rdv/${slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(`https://${bookingUrl}`);
    toast.success("Lien copié dans le presse-papier");
  };

  const addField = () => {
    if (!newFieldLabel.trim()) return;
    setFields(prev => [...prev, {
      id: `field_${Date.now()}`,
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: false,
    }]);
    setNewFieldLabel("");
  };

  const removeField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
  };

  const toggleRequired = (id: string) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, required: !f.required } : f));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Paramètres de réservation enregistrés");
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Slug & Link */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Link className="h-4 w-4" /> Lien de réservation
          </CardTitle>
          <CardDescription>Partagez ce lien avec vos clients pour qu'ils prennent rendez-vous en ligne.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="booking-slug">Slug du lien</Label>
            <Input
              id="booking-slug"
              value={slug}
              onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              placeholder="mon-entreprise"
            />
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
            <CalendarDays className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm font-mono truncate flex-1">{bookingUrl}</span>
            <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5 shrink-0">
              <Copy className="h-3.5 w-3.5" /> Copier
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Acompte */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            💳 Acompte
          </CardTitle>
          <CardDescription>Configurez le montant de l'acompte demandé lors de la réservation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type d'acompte</Label>
              <Select value={acompteType} onValueChange={v => setAcompteType(v as "fixe" | "pourcentage")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixe">Montant fixe (€)</SelectItem>
                  <SelectItem value="pourcentage">Pourcentage (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{acompteType === "fixe" ? "Montant (€)" : "Pourcentage (%)"}</Label>
              <Input
                type="number"
                min={0}
                value={acompteMontant}
                onChange={e => setAcompteMontant(Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire pré-RDV */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            📋 Formulaire pré-rendez-vous
          </CardTitle>
          <CardDescription>Demandez des informations complémentaires avant la prise de rendez-vous.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Activer le formulaire</p>
              <p className="text-xs text-muted-foreground">Le client devra remplir ce formulaire avant de confirmer</p>
            </div>
            <Switch checked={formulaireEnabled} onCheckedChange={setFormulaireEnabled} />
          </div>

          {formulaireEnabled && (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="text-sm font-medium">Champs personnalisés</p>
                {fields.map(field => (
                  <div key={field.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{field.label}</p>
                      <p className="text-xs text-muted-foreground capitalize">{field.type}{field.required ? " • Obligatoire" : ""}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRequired(field.id)}
                      className="text-xs"
                    >
                      {field.required ? "Optionnel" : "Obligatoire"}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeField(field.id)} className="text-destructive h-8 w-8">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}

                <div className="flex gap-2">
                  <Input
                    placeholder="Nom du champ..."
                    value={newFieldLabel}
                    onChange={e => setNewFieldLabel(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={newFieldType} onValueChange={v => setNewFieldType(v as "text" | "textarea" | "select")}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texte</SelectItem>
                      <SelectItem value="textarea">Zone de texte</SelectItem>
                      <SelectItem value="select">Liste</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={addField} disabled={!newFieldLabel.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </Button>
      </div>
    </div>
  );
}
