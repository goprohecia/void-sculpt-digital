import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, ArrowRight, CheckCircle2,
  Users, FolderKanban, Receipt, MessageSquare, MailWarning,
  Headphones, Calendar, ListTodo, BarChart3, FileText,
  Clock, Zap, Bot, Settings, Layers, PieChart,
  ShieldCheck, PackageSearch, ArrowRightLeft, AlertTriangle,
} from "lucide-react";
import { MODULE_EXTRA_WARNINGS } from "@/components/client/SwapWarningScreen";
import type { LucideIcon } from "lucide-react";

const MODULE_ICONS: Record<string, LucideIcon> = {
  overview: Layers,
  clients: Users,
  employees: Users,
  dossiers: FolderKanban,
  pipeline: PieChart,
  facturation: Receipt,
  relances: MailWarning,
  stock: PackageSearch,
  messagerie: MessageSquare,
  emails: FileText,
  "rendez-vous": Calendar,
  agenda: Calendar,
  taches: ListTodo,
  support: Headphones,
  notes: FileText,
  analyse: BarChart3,
  rapports: PieChart,
  documents: FileText,
  temps: Clock,
  automatisations: Zap,
  ia: Bot,
  parametres: Settings,
};

// Modules that trigger specific content-loss warnings
const CONTENT_LOSS_WARNINGS: Record<string, string> = {
  facturation: "Toutes vos factures, devis et historiques de paiement seront définitivement supprimés.",
  dossiers: "Tous vos dossiers clients et leur suivi seront définitivement supprimés.",
  messagerie: "Toutes vos conversations et messages seront définitivement supprimés.",
  agenda: "Tous vos rendez-vous et événements planifiés seront définitivement supprimés.",
  documents: "Tous vos documents stockés seront définitivement supprimés.",
  stock: "Tout votre inventaire et historique de mouvements sera définitivement supprimé.",
};

interface ModuleSwapWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeModules: string[];
  availableModules: string[];
  getModuleLabel: (key: string) => string;
  onSwapComplete: (removed: string, added: string) => void;
}

export function ModuleSwapWizard({
  open,
  onOpenChange,
  activeModules,
  availableModules,
  getModuleLabel,
  onSwapComplete,
}: ModuleSwapWizardProps) {
  // Steps now start at 1 (removal) — warning screen is handled externally
  const [step, setStep] = useState(1);
  const [moduleToRemove, setModuleToRemove] = useState<string | null>(null);
  const [moduleToAdd, setModuleToAdd] = useState<string | null>(null);

  const reset = () => {
    setStep(0);
    setAccepted(false);
    setModuleToRemove(null);
    setModuleToAdd(null);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const handleFinish = () => {
    if (moduleToRemove && moduleToAdd) {
      onSwapComplete(moduleToRemove, moduleToAdd);
    }
    handleClose();
  };

  const steps = ["Avertissement", "Retrait", "Activation", "Confirmation"];

  // Exclude non-swappable modules
  const swappableActive = activeModules.filter(
    (m) => m !== "overview" && m !== "parametres"
  );

  const renderIcon = (key: string, className?: string) => {
    const Icon = MODULE_ICONS[key] || Layers;
    return <Icon className={className || "h-5 w-5"} />;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Stepper header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
              Swap de module
            </h2>
            <Badge variant="outline" className="text-xs">
              Étape {step + 1} / {steps.length}
            </Badge>
          </div>
          <Progress value={((step + 1) / steps.length) * 100} className="h-1.5" />
          <div className="flex justify-between mt-2">
            {steps.map((s, i) => (
              <span
                key={s}
                className={`text-[10px] font-medium ${
                  i <= step ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 min-h-[340px]">
          {/* STEP 0 — Warning */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="h-8 w-8 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-destructive text-base">
                    Attention — Perte de données irréversible
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    En retirant un module, toutes les données associées à ce module seront
                    <strong className="text-foreground"> définitivement supprimées</strong>. Cette action est irréversible.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                    {Object.entries(CONTENT_LOSS_WARNINGS).slice(0, 4).map(([key, msg]) => (
                      <li key={key} className="flex items-start gap-1.5">
                        <span className="text-destructive mt-0.5">•</span>
                        <span><strong>{getModuleLabel(key)}</strong> : {msg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-md border bg-muted/30">
                <Checkbox
                  id="accept-loss"
                  checked={accepted}
                  onCheckedChange={(v) => setAccepted(v === true)}
                  className="mt-0.5"
                />
                <label htmlFor="accept-loss" className="text-sm cursor-pointer leading-relaxed">
                  Je comprends que les données du module retiré seront{" "}
                  <strong>définitivement perdues</strong> et je souhaite continuer.
                </label>
              </div>
            </div>
          )}

          {/* STEP 1 — Select module to remove */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-base mb-1">Sélectionnez le module à retirer</h3>
                <p className="text-sm text-muted-foreground">
                  Choisissez le module que vous souhaitez désactiver de votre espace.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {swappableActive.map((key) => (
                  <Card
                    key={key}
                    onClick={() => setModuleToRemove(key)}
                    className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                      moduleToRemove === key
                        ? "ring-2 ring-destructive border-destructive bg-destructive/5"
                        : "hover:border-muted-foreground/40"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      {renderIcon(key, `h-6 w-6 ${moduleToRemove === key ? "text-destructive" : "text-muted-foreground"}`)}
                      <span className="text-xs font-medium leading-tight">{getModuleLabel(key)}</span>
                    </div>
                  </Card>
                ))}
              </div>
              {moduleToRemove && CONTENT_LOSS_WARNINGS[moduleToRemove] && (
                <p className="text-xs text-destructive flex items-start gap-1.5 p-2 rounded bg-destructive/5">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  {CONTENT_LOSS_WARNINGS[moduleToRemove]}
                </p>
              )}
            </div>
          )}

          {/* STEP 2 — Select module to add */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-base mb-1">Sélectionnez le module à activer</h3>
                <p className="text-sm text-muted-foreground">
                  Choisissez le module que vous souhaitez ajouter à votre espace.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableModules
                  .filter((m) => m !== "overview" && m !== "parametres")
                  .map((key) => (
                    <Card
                      key={key}
                      onClick={() => setModuleToAdd(key)}
                      className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                        moduleToAdd === key
                          ? "ring-2 ring-primary border-primary bg-primary/5"
                          : "hover:border-muted-foreground/40"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2 text-center">
                        {renderIcon(key, `h-6 w-6 ${moduleToAdd === key ? "text-primary" : "text-muted-foreground"}`)}
                        <span className="text-xs font-medium leading-tight">{getModuleLabel(key)}</span>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* STEP 3 — Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
                <h3 className="font-semibold text-lg">Récapitulatif du swap</h3>
                <p className="text-sm text-muted-foreground">
                  Vérifiez les changements avant de confirmer.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Card className="p-4 border-destructive/30 bg-destructive/5 text-center min-w-[140px]">
                  {moduleToRemove && renderIcon(moduleToRemove, "h-8 w-8 text-destructive mx-auto mb-2")}
                  <p className="text-sm font-medium">{moduleToRemove && getModuleLabel(moduleToRemove)}</p>
                  <Badge variant="destructive" className="mt-1 text-[10px]">Retiré</Badge>
                </Card>

                <ArrowRight className="h-6 w-6 text-muted-foreground shrink-0" />

                <Card className="p-4 border-primary/30 bg-primary/5 text-center min-w-[140px]">
                  {moduleToAdd && renderIcon(moduleToAdd, "h-8 w-8 text-primary mx-auto mb-2")}
                  <p className="text-sm font-medium">{moduleToAdd && getModuleLabel(moduleToAdd)}</p>
                  <Badge className="mt-1 text-[10px] bg-primary">Activé</Badge>
                </Card>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Ce swap sera comptabilisé dans votre quota mensuel.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-between">
          {step < 3 ? (
            <Button variant="ghost" onClick={step === 0 ? handleClose : () => setStep(step - 1)} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          ) : (
            <div />
          )}

          {step === 0 && (
            <Button onClick={() => setStep(1)} disabled={!accepted} className="gap-1.5">
              Continuer
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {step === 1 && (
            <Button
              onClick={() => setStep(2)}
              disabled={!moduleToRemove}
              variant="destructive"
              className="gap-1.5"
            >
              Confirmer le retrait
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {step === 2 && (
            <Button onClick={() => setStep(3)} disabled={!moduleToAdd} className="gap-1.5">
              Confirmer l'activation
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {step === 3 && (
            <Button onClick={handleFinish} className="gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Terminer
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
