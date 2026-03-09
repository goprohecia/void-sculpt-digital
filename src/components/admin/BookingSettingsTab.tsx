import { useState, useMemo, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Copy, Link, Plus, Trash2, Save, CheckCircle, Eye, ShieldAlert, Download, FileDown, Crown, Upload } from "lucide-react";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";
import { jsPDF } from "jspdf";
import { useDemoPlan } from "@/contexts/DemoPlanContext";

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

  // Cancellation policy state
  const [annulationDelai, setAnnulationDelai] = useState(24);
  const [annulationUnite, setAnnulationUnite] = useState<"heures" | "jours">("heures");
  const [annulationPolitique, setAnnulationPolitique] = useState<"total" | "partiel" | "aucun">("total");
  const [annulationPourcentage, setAnnulationPourcentage] = useState(50);
  const [annulationMessage, setAnnulationMessage] = useState("");

  // QR code state
  const qrRef = useRef<HTMLCanvasElement>(null);
  const { demoPlan } = useDemoPlan();
  const [logoEnabled, setLogoEnabled] = useState(false);
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const isEnterprise = demoPlan === "enterprise";

  const bookingUrl = `https://mybusinessassistant.com/rdv/${slug}`;
  const bookingUrlDisplay = `mybusinessassistant.com/rdv/${slug}`;

  const defaultMessage = useMemo(() => {
    const delaiText = `${annulationDelai} ${annulationUnite === "heures" ? "heure(s)" : "jour(s)"}`;
    if (annulationPolitique === "total") {
      return `Annulation gratuite jusqu'à ${delaiText} avant le rendez-vous. Remboursement intégral de l'acompte.`;
    }
    if (annulationPolitique === "partiel") {
      return `Annulation jusqu'à ${delaiText} avant le rendez-vous. Remboursement de ${annulationPourcentage}% de l'acompte. Au-delà, aucun remboursement.`;
    }
    return `Annulation jusqu'à ${delaiText} avant le rendez-vous. Aucun remboursement de l'acompte.`;
  }, [annulationDelai, annulationUnite, annulationPolitique, annulationPourcentage]);

  const displayedMessage = annulationMessage || defaultMessage;

  const copyLink = () => {
    navigator.clipboard.writeText(bookingUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  const downloadQrPng = () => {
    const canvas = qrRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-${slug}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("QR code PNG téléchargé");
    });
  };

  const downloadQrPdf = () => {
    const canvas = qrRef.current;
    if (!canvas) return;
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const qrSize = 80;
    const x = (pageWidth - qrSize) / 2;
    pdf.setFontSize(20);
    pdf.text("Réservez en ligne", pageWidth / 2, 40, { align: "center" });
    pdf.setFontSize(12);
    pdf.text(bookingUrlDisplay, pageWidth / 2, 50, { align: "center" });
    pdf.addImage(imgData, "PNG", x, 60, qrSize, qrSize);
    pdf.setFontSize(10);
    pdf.text("Scannez ce QR code pour prendre rendez-vous", pageWidth / 2, 60 + qrSize + 10, { align: "center" });
    pdf.save(`qr-${slug}.pdf`);
    toast.success("QR code PDF téléchargé");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image (PNG ou JPG)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoSrc(reader.result as string);
    reader.readAsDataURL(file);
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

  const qrImageSettings = logoEnabled && logoSrc && isEnterprise
    ? { src: logoSrc, height: 56, width: 56, excavate: true }
    : undefined;

  return (
    <div className="space-y-6">
      {/* Slug & Link & QR */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Link className="h-4 w-4" /> Lien de réservation
          </CardTitle>
          <CardDescription>Partagez ce lien ou le QR code avec vos clients pour qu'ils prennent rendez-vous en ligne.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
            <span className="text-sm font-mono truncate flex-1">{bookingUrlDisplay}</span>
            <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5 shrink-0">
              <Copy className="h-3.5 w-3.5" /> Copier
            </Button>
          </div>

          <Separator />

          {/* QR Code */}
          <div className="space-y-4">
            <p className="text-sm font-medium">QR Code</p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <QRCodeCanvas
                  ref={qrRef as any}
                  value={bookingUrl}
                  size={280}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="H"
                  imageSettings={qrImageSettings}
                />
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <Button variant="outline" onClick={downloadQrPng} className="gap-2 justify-start">
                  <Download className="h-4 w-4" /> Télécharger PNG
                </Button>
                <Button variant="outline" onClick={downloadQrPdf} className="gap-2 justify-start">
                  <FileDown className="h-4 w-4" /> Télécharger PDF
                </Button>

                <Separator className="my-1" />

                {/* Logo overlay — Enterprise */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="logo-toggle" className="cursor-pointer text-sm">Afficher mon logo au centre</Label>
                      {!isEnterprise && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Crown className="h-3 w-3" /> Enterprise
                        </Badge>
                      )}
                    </div>
                    <Switch
                      id="logo-toggle"
                      checked={logoEnabled && isEnterprise}
                      onCheckedChange={setLogoEnabled}
                      disabled={!isEnterprise}
                    />
                  </div>

                  {!isEnterprise && (
                    <p className="text-xs text-muted-foreground">
                      Personnalisez votre QR code avec votre logo.{" "}
                      <button className="text-primary underline hover:no-underline font-medium">
                        Passer à l'offre Enterprise →
                      </button>
                    </p>
                  )}

                  {isEnterprise && logoEnabled && (
                    <div className="space-y-2">
                      <Label htmlFor="logo-upload" className="text-xs text-muted-foreground">Logo (PNG ou JPG)</Label>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" asChild className="gap-1.5">
                          <label htmlFor="logo-upload" className="cursor-pointer">
                            <Upload className="h-3.5 w-3.5" /> Choisir un fichier
                            <input
                              id="logo-upload"
                              type="file"
                              accept="image/png,image/jpeg"
                              className="sr-only"
                              onChange={handleLogoUpload}
                            />
                          </label>
                        </Button>
                        {logoSrc && (
                          <img src={logoSrc} alt="Logo" className="h-8 w-8 rounded object-contain border" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
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

      {/* Politique d'annulation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" /> Politique d'annulation
          </CardTitle>
          <CardDescription>Définissez les règles d'annulation et de remboursement de l'acompte.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Délai d'annulation</Label>
              <Input
                type="number"
                min={1}
                value={annulationDelai}
                onChange={e => setAnnulationDelai(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Unité</Label>
              <Select value={annulationUnite} onValueChange={v => setAnnulationUnite(v as "heures" | "jours")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="heures">Heures</SelectItem>
                  <SelectItem value="jours">Jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Politique de remboursement</Label>
            <RadioGroup value={annulationPolitique} onValueChange={v => setAnnulationPolitique(v as "total" | "partiel" | "aucun")} className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <RadioGroupItem value="total" id="pol-total" />
                <Label htmlFor="pol-total" className="cursor-pointer flex-1">
                  <p className="text-sm font-medium">Remboursement total</p>
                  <p className="text-xs text-muted-foreground">L'intégralité de l'acompte est remboursée</p>
                </Label>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <RadioGroupItem value="partiel" id="pol-partiel" />
                <Label htmlFor="pol-partiel" className="cursor-pointer flex-1">
                  <p className="text-sm font-medium">Remboursement partiel</p>
                  <p className="text-xs text-muted-foreground">Un pourcentage de l'acompte est remboursé</p>
                </Label>
                {annulationPolitique === "partiel" && (
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      min={1}
                      max={99}
                      value={annulationPourcentage}
                      onChange={e => setAnnulationPourcentage(Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <RadioGroupItem value="aucun" id="pol-aucun" />
                <Label htmlFor="pol-aucun" className="cursor-pointer flex-1">
                  <p className="text-sm font-medium">Aucun remboursement</p>
                  <p className="text-xs text-muted-foreground">L'acompte n'est pas remboursable</p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Message affiché au client</Label>
            <Textarea
              value={annulationMessage}
              onChange={e => setAnnulationMessage(e.target.value)}
              placeholder={defaultMessage}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">Laissez vide pour utiliser le message généré automatiquement.</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Eye className="h-4 w-4 text-primary" />
              Aperçu client
            </div>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-medium mb-1 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-primary" />
                Conditions d'annulation
              </p>
              <p className="text-sm text-muted-foreground">{displayedMessage}</p>
            </div>
          </div>
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
