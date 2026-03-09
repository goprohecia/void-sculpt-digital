import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, Phone, Save } from "lucide-react";
import { toast } from "sonner";
import { useDemoPlan } from "@/contexts/DemoPlanContext";
import { getPresetsForSector } from "@/data/sectorTimelines";
import {
  type StepNotificationConfig,
  NOTIFICATION_VARIABLES,
  getDefaultStepNotification,
} from "@/data/stepNotificationTemplates";

export function StepNotificationSettings() {
  const { demoSector } = useDemoPlan();

  // Get steps from the first preset for the current sector
  const presets = getPresetsForSector(demoSector);
  const steps = presets[0]?.steps ?? [];

  // Persist config in ref so it survives re-renders but acts as demo storage
  const configRef = useRef<Record<string, StepNotificationConfig>>({});

  // Initialize configs for all steps
  const getConfig = useCallback((step: string): StepNotificationConfig => {
    if (!configRef.current[step]) {
      configRef.current[step] = getDefaultStepNotification(demoSector, step);
    }
    return configRef.current[step];
  }, [demoSector]);

  // Force re-render
  const [, setTick] = useState(0);
  const rerender = () => setTick((t) => t + 1);

  const updateConfig = (step: string, partial: Partial<StepNotificationConfig>) => {
    const current = getConfig(step);
    configRef.current[step] = { ...current, ...partial };
    rerender();
  };

  const handleBlur = (step: string) => {
    const cfg = configRef.current[step];
    if (cfg && !cfg.message.trim()) {
      const defaultCfg = getDefaultStepNotification(demoSector, step);
      configRef.current[step] = { ...cfg, message: defaultCfg.message };
      rerender();
    }
  };

  const insertVariable = (step: string, variable: string) => {
    const cfg = getConfig(step);
    updateConfig(step, { message: cfg.message + variable });
  };

  const canalLabel = (canal: string) => {
    if (canal === "sms") return "SMS";
    if (canal === "email") return "Email";
    return "SMS + Email";
  };

  const canalIcon = (canal: string) => {
    if (canal === "sms") return <Phone className="h-3 w-3" />;
    if (canal === "email") return <Mail className="h-3 w-3" />;
    return <><Mail className="h-3 w-3" /><Phone className="h-3 w-3" /></>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Notifications par étape
        </CardTitle>
        <CardDescription>
          Configurez les messages envoyés automatiquement à vos clients lorsqu'une étape de dossier est validée.
          Les messages vides seront automatiquement remplacés par le template par défaut.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Aucune étape configurée. Vérifiez vos paramètres de timeline.
          </p>
        ) : (
          steps.map((step, i) => {
            const cfg = getConfig(step);
            return (
              <div
                key={`${step}-${i}`}
                className="rounded-lg border border-border/50 bg-muted/10 p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium truncate">{step}</span>
                    {cfg.enabled && (
                      <Badge variant="outline" className="text-[10px] gap-1 shrink-0">
                        {canalIcon(cfg.canal)} {canalLabel(cfg.canal)}
                      </Badge>
                    )}
                  </div>
                  <Switch
                    checked={cfg.enabled}
                    onCheckedChange={(v) => updateConfig(step, { enabled: v })}
                  />
                </div>

                {cfg.enabled && (
                  <div className="space-y-2 pl-0">
                    <div className="flex items-center gap-2">
                      <Select
                        value={cfg.canal}
                        onValueChange={(v) => updateConfig(step, { canal: v as StepNotificationConfig["canal"] })}
                      >
                        <SelectTrigger className="w-40 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sms">📱 SMS</SelectItem>
                          <SelectItem value="email">📧 Email</SelectItem>
                          <SelectItem value="both">📱📧 Les deux</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Textarea
                      value={cfg.message}
                      onChange={(e) => updateConfig(step, { message: e.target.value })}
                      onBlur={() => handleBlur(step)}
                      className="text-sm min-h-[60px]"
                      placeholder="Message de notification..."
                    />

                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-muted-foreground mr-1 self-center">Variables :</span>
                      {NOTIFICATION_VARIABLES.map((v) => (
                        <button
                          key={v.key}
                          type="button"
                          onClick={() => insertVariable(step, v.key)}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer border border-primary/20"
                          title={v.label}
                        >
                          {v.key}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        <div className="flex justify-end pt-2">
          <Button
            className="gap-1.5"
            onClick={() => toast.success("Configuration des notifications sauvegardée")}
          >
            <Save className="h-4 w-4" /> Enregistrer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
