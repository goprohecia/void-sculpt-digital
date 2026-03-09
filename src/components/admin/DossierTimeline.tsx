import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Check, Clock, ChevronDown, ChevronUp, Pencil, MessageSquare, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DEFAULT_TIMELINE_STEPS, useDossierTimeline, useTimelineTemplates } from "@/hooks/use-timeline";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getDefaultStepNotification, type StepNotificationConfig } from "@/data/stepNotificationTemplates";
import { useDemoPlan } from "@/contexts/DemoPlanContext";

interface DossierTimelineProps {
  dossierId: string;
  isAdmin?: boolean;
  isEnterprise?: boolean;
}

export function DossierTimeline({ dossierId, isAdmin = false, isEnterprise = false }: DossierTimelineProps) {
  const { timeline, upsertTimeline } = useDossierTimeline(dossierId);
  const { templates, getDefaultTemplate } = useTimelineTemplates();
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const { demoSector } = useDemoPlan();
  const notifConfigRef = useRef<Record<string, StepNotificationConfig>>({});

  const getNotifConfig = (stepName: string): StepNotificationConfig => {
    if (!notifConfigRef.current[stepName]) {
      notifConfigRef.current[stepName] = getDefaultStepNotification(demoSector, stepName);
    }
    return notifConfigRef.current[stepName];
  };

  const activeTemplate = templates.find((t) => t.id === timeline?.templateId) || getDefaultTemplate();
  const steps = activeTemplate.steps;
  const currentStep = timeline?.currentStep ?? 0;
  const stepDates = timeline?.stepDates ?? {};
  const stepNotes = timeline?.stepNotes ?? {};

  const handleStepClick = (index: number) => {
    if (!isAdmin) {
      setExpandedStep(expandedStep === index ? null : index);
      return;
    }
    setExpandedStep(expandedStep === index ? null : index);
  };

  const markStepComplete = (index: number) => {
    if (!isAdmin) return;
    const newDates = { ...stepDates, [index]: new Date().toISOString() };
    upsertTimeline.mutate({
      currentStep: Math.max(currentStep, index + 1),
      stepDates: newDates,
      templateId: timeline?.templateId ?? activeTemplate.id,
    });
    toast.success(`Étape "${steps[index]}" marquée comme terminée`);
  };

  const revertStep = (index: number) => {
    if (!isAdmin) return;
    const newDates = { ...stepDates };
    // Remove dates for this step and all after
    for (let i = index; i < steps.length; i++) {
      delete newDates[i];
    }
    upsertTimeline.mutate({
      currentStep: index,
      stepDates: newDates,
      templateId: timeline?.templateId ?? activeTemplate.id,
    });
    toast.info(`Progression revenue à l'étape "${steps[index]}"`);
  };

  const addNote = (index: number) => {
    if (!noteInput.trim()) return;
    const existing = stepNotes[index] || "";
    const now = new Date().toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    const newNote = existing ? `${existing}\n[${now}] ${noteInput}` : `[${now}] ${noteInput}`;
    upsertTimeline.mutate({
      stepNotes: { ...stepNotes, [index]: newNote },
      templateId: timeline?.templateId ?? activeTemplate.id,
    });
    setNoteInput("");
    toast.success("Note ajoutée");
  };

  const handleTemplateChange = (templateId: string) => {
    upsertTimeline.mutate({ templateId });
    toast.success("Template de timeline modifié");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Suivi de livraison
        </h2>
        {isAdmin && isEnterprise && templates.length > 1 && (
          <Select value={timeline?.templateId || activeTemplate.id} onValueChange={handleTemplateChange}>
            <SelectTrigger className="w-48 h-8 text-xs">
              <SelectValue placeholder="Template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Visual progress bar */}
      <div className="relative">
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-border" />
        <div
          className="absolute top-4 left-4 h-0.5 bg-primary transition-all duration-500"
          style={{ width: `${steps.length > 1 ? (Math.min(currentStep, steps.length - 1) / (steps.length - 1)) * 100 : 0}%`, maxWidth: "calc(100% - 2rem)" }}
        />
        <div className="relative flex justify-between">
          {steps.map((step, i) => {
            const isCompleted = i < currentStep;
            const isCurrent = i === currentStep;
            const hasDate = !!stepDates[i];
            const hasNotes = !!stepNotes[i];

            return (
              <div key={i} className="flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}>
                <button
                  onClick={() => handleStepClick(i)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 relative",
                    isCompleted && "bg-primary text-primary-foreground shadow-md shadow-primary/30",
                    isCurrent && "bg-primary/20 text-primary border-2 border-primary animate-pulse",
                    !isCompleted && !isCurrent && "bg-muted border border-border text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </button>
                <span className={cn(
                  "text-[9px] sm:text-[10px] mt-1.5 text-center leading-tight max-w-[60px] sm:max-w-[80px]",
                  isCompleted && "text-primary font-medium",
                  isCurrent && "text-foreground font-semibold",
                  !isCompleted && !isCurrent && "text-muted-foreground",
                )}>
                  {step}
                </span>
                {hasDate && (
                  <span className="text-[8px] text-muted-foreground mt-0.5">
                    {new Date(stepDates[i]).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })}
                  </span>
                )}
                {hasNotes && (
                  <MessageSquare className="h-2.5 w-2.5 text-primary/60 mt-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded step detail */}
      {expandedStep !== null && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-lg border border-border/50 bg-muted/20 p-3 space-y-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{steps[expandedStep]}</p>
              {stepDates[expandedStep] && (
                <p className="text-xs text-muted-foreground">
                  Complété le {new Date(stepDates[expandedStep]).toLocaleDateString("fr-FR")}
                </p>
              )}
            </div>
            <div className="flex gap-1.5">
              {isAdmin && expandedStep >= currentStep && (
                <Button size="sm" variant="default" className="text-xs h-7 gap-1" onClick={() => markStepComplete(expandedStep)}>
                  <Check className="h-3 w-3" /> Valider
                </Button>
              )}
              {isAdmin && expandedStep < currentStep && (
                <Button size="sm" variant="outline" className="text-xs h-7 gap-1" onClick={() => revertStep(expandedStep)}>
                  Revenir ici
                </Button>
              )}
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setExpandedStep(null)}>
                <ChevronUp className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Notes */}
          {stepNotes[expandedStep] && (
            <div className="text-xs text-muted-foreground whitespace-pre-line bg-background/50 rounded p-2">
              {stepNotes[expandedStep]}
            </div>
          )}

          {isAdmin && (
            <div className="flex gap-2">
              <Input
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Ajouter une note..."
                className="h-7 text-xs flex-1"
                onKeyDown={(e) => e.key === "Enter" && addNote(expandedStep)}
              />
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => addNote(expandedStep)}>
                Ajouter
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Summary badge */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-[10px]">
          {currentStep}/{steps.length} étapes
        </Badge>
        {currentStep === steps.length && (
          <Badge className="text-[10px] bg-green-500/20 text-green-400 border-green-500/30">
            ✓ Livré
          </Badge>
        )}
      </div>
    </div>
  );
}
