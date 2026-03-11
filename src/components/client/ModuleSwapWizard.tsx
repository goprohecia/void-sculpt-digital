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

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

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
  const [step, setStep] = useState(1);
  const [moduleToRemove, setModuleToRemove] = useState<string | null>(null);
  const [moduleToAdd, setModuleToAdd] = useState<string | null>(null);

  const reset = () => {
    setStep(1);
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

  const steps = ["Retrait", "Activation", "Confirmation"];

  const swappableActive = activeModules.filter(
    (m) => m !== "overview" && m !== "parametres"
  );

  const renderIcon = (key: string, className?: string) => {
    const Icon = MODULE_ICONS[key] || Layers;
    return <Icon className={className || "h-5 w-5"} />;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden p-0 gap-0 border-gray-200 shadow-xl flex flex-col">
        {/* Stepper header */}
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
              <ArrowRightLeft className="h-5 w-5 text-[#16a34a]" />
              Swap de module
            </h2>
            <Badge variant="outline" className="text-xs font-medium">
              Étape {step} / {steps.length}
            </Badge>
          </div>
          <Progress value={(step / steps.length) * 100} className="h-1.5" />
          <div className="flex justify-between mt-2.5">
            {steps.map((s, i) => (
              <span
                key={s}
                className={`text-[11px] font-medium tracking-wide ${
                  i + 1 <= step ? "text-[#16a34a]" : "text-gray-400"
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Body — scrollable */}
        <div className="px-6 py-5 min-h-[300px] overflow-y-auto flex-1">
          {/* STEP 1 — Select module to remove */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-base mb-1 text-gray-900">Sélectionnez le module à retirer</h3>
                <p className="text-sm text-gray-500">
                  Choisissez le module que vous souhaitez désactiver de votre espace.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {swappableActive.map((key) => (
                  <Card
                    key={key}
                    onClick={() => setModuleToRemove(key)}
                    className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      moduleToRemove === key
                        ? "ring-2 ring-red-400 border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2.5 text-center">
                      {renderIcon(key, `h-6 w-6 ${moduleToRemove === key ? "text-red-500" : "text-gray-400"}`)}
                      <span className={`text-xs font-medium leading-tight ${moduleToRemove === key ? "text-red-700" : "text-gray-700"}`}>
                        {capitalize(getModuleLabel(key))}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
              {moduleToRemove && MODULE_EXTRA_WARNINGS[moduleToRemove] && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200/60 text-sm text-amber-800">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
                  {MODULE_EXTRA_WARNINGS[moduleToRemove]}
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — Select module to add */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-base mb-1 text-gray-900">Sélectionnez le module à activer</h3>
                <p className="text-sm text-gray-500">
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
                      className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        moduleToAdd === key
                          ? "ring-2 ring-[#16a34a] border-[#16a34a]/40 bg-[#f0fdf4]"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2.5 text-center">
                        {renderIcon(key, `h-6 w-6 ${moduleToAdd === key ? "text-[#16a34a]" : "text-gray-400"}`)}
                        <span className={`text-xs font-medium leading-tight ${moduleToAdd === key ? "text-[#15803d]" : "text-gray-700"}`}>
                          {capitalize(getModuleLabel(key))}
                        </span>
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
                <CheckCircle2 className="h-12 w-12 text-[#16a34a] mx-auto" />
                <h3 className="font-semibold text-lg text-gray-900">Récapitulatif du swap</h3>
                <p className="text-sm text-gray-500">
                  Vérifiez les changements avant de confirmer.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Card className="p-5 border-red-200 bg-red-50 text-center min-w-[140px]">
                  {moduleToRemove && renderIcon(moduleToRemove, "h-8 w-8 text-red-500 mx-auto mb-2")}
                  <p className="text-sm font-medium text-gray-900">{moduleToRemove && capitalize(getModuleLabel(moduleToRemove))}</p>
                  <Badge variant="destructive" className="mt-2 text-[10px]">Retiré</Badge>
                </Card>

                <ArrowRight className="h-6 w-6 text-gray-300 shrink-0" />

                <Card className="p-5 border-[#16a34a]/30 bg-[#f0fdf4] text-center min-w-[140px]">
                  {moduleToAdd && renderIcon(moduleToAdd, "h-8 w-8 text-[#16a34a] mx-auto mb-2")}
                  <p className="text-sm font-medium text-gray-900">{moduleToAdd && capitalize(getModuleLabel(moduleToAdd))}</p>
                  <Badge className="mt-2 text-[10px] bg-[#16a34a] hover:bg-[#16a34a]">Activé</Badge>
                </Card>
              </div>

              <p className="text-xs text-center text-gray-500">
                Ce swap sera comptabilisé dans votre quota mensuel.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 flex justify-between shrink-0">
          {step < 3 ? (
            <Button variant="outline" onClick={step === 1 ? handleClose : () => setStep(step - 1)} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          ) : (
            <div />
          )}

          {step === 1 && (
            <Button
              onClick={() => setStep(2)}
              disabled={!moduleToRemove}
              className="gap-1.5 bg-red-500 hover:bg-red-600 text-white disabled:opacity-40"
            >
              Confirmer le retrait
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {step === 2 && (
            <Button onClick={() => setStep(3)} disabled={!moduleToAdd} className="gap-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white disabled:opacity-40">
              Confirmer l'activation
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {step === 3 && (
            <Button onClick={handleFinish} className="gap-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white">
              <CheckCircle2 className="h-4 w-4" />
              Terminer
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
