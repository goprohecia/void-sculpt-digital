import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Save, CheckCircle, Eye, EyeOff, AlertTriangle, Check, Loader2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CalendlyConfig {
  api_token: string;
  scheduling_url: string;
  enabled: boolean;
}

export function CalendlyConfigSettings() {
  const [config, setConfig] = useState<CalendlyConfig>({
    api_token: "",
    scheduling_url: "",
    enabled: false,
  });
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("app_settings")
        .select("key, value")
        .eq("key", "calendly_config")
        .maybeSingle();
      if (data?.value) {
        const val = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
        setConfig({
          api_token: val.api_token || "",
          scheduling_url: val.scheduling_url || "",
          enabled: val.enabled ?? false,
        });
      }
      setLoaded(true);
    })();
  }, []);

  const handleSave = async () => {
    if (!config.api_token) {
      toast.error("Veuillez renseigner le token API Calendly");
      return;
    }
    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from("app_settings")
        .upsert(
          { key: "calendly_config", value: JSON.stringify(config), updated_at: new Date().toISOString() },
          { onConflict: "key" }
        );
      if (error) throw error;
      toast.success("Configuration Calendly enregistrée");
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestStatus("idle");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calendly-events?test=true`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `Erreur ${res.status}`);
      }

      const json = await res.json();
      if (json.error) throw new Error(json.error);

      setTestStatus("success");
      toast.success("Connexion Calendly validée ✓");
    } catch (e: any) {
      setTestStatus("error");
      toast.error(e.message || "Connexion Calendly échouée");
    } finally {
      setTesting(false);
    }
  };

  if (!loaded) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" /> Configuration Calendly
        </CardTitle>
        <CardDescription>
          Connectez votre compte Calendly pour synchroniser automatiquement vos rendez-vous.
          Chaque administrateur peut configurer son propre calendrier.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-amber-500">Comment obtenir votre token ?</p>
            <p>
              Connectez-vous sur{" "}
              <a href="https://calendly.com/integrations/api_webhooks" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1">
                calendly.com <ExternalLink className="h-3 w-3" />
              </a>
              , puis rendez-vous dans <em>Intégrations → API & Webhooks</em> et générez un <strong>Personal Access Token</strong>.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="calendly-token">Token API Personnel</Label>
          <div className="relative">
            <Input
              id="calendly-token"
              type={showKey ? "text" : "password"}
              placeholder="eyJraWQiOi..."
              value={config.api_token}
              onChange={(e) => setConfig((c) => ({ ...c, api_token: e.target.value }))}
              className="pr-10 font-mono text-xs"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="calendly-url">Lien de prise de rendez-vous (optionnel)</Label>
          <Input
            id="calendly-url"
            type="url"
            placeholder="https://calendly.com/votre-nom/30min"
            value={config.scheduling_url}
            onChange={(e) => setConfig((c) => ({ ...c, scheduling_url: e.target.value }))}
          />
          <p className="text-xs text-muted-foreground">
            Ce lien sera utilisé pour les invitations de prise de rendez-vous envoyées aux clients.
          </p>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-b border-border/30">
          <div>
            <p className="text-sm font-medium">Activer la synchronisation Calendly</p>
            <p className="text-xs text-muted-foreground">Les rendez-vous Calendly apparaîtront automatiquement dans votre agenda.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={config.enabled ? "default" : "secondary"} className="text-xs">
              {config.enabled ? "Actif" : "Inactif"}
            </Badge>
            <button
              onClick={() => setConfig((c) => ({ ...c, enabled: !c.enabled }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.enabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end pt-2">
          <Button variant="outline" onClick={handleTest} disabled={testing || !config.api_token} className="gap-2">
            {testing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : testStatus === "success" ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <CalendarDays className="h-4 w-4" />
            )}
            Tester la connexion
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
            Enregistrer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
