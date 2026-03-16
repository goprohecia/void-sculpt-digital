import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Save, CheckCircle, Eye, EyeOff, AlertTriangle, Check, Loader2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BrevoConfig {
  api_key: string;
  sender_email: string;
  sender_name: string;
  enabled: boolean;
}

export function BrevoConfigSettings() {
  const [config, setConfig] = useState<BrevoConfig>({
    api_key: "",
    sender_email: "",
    sender_name: "",
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
        .eq("key", "brevo_config")
        .maybeSingle();
      if (data?.value) {
        const val = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
        setConfig({
          api_key: val.api_key || "",
          sender_email: val.sender_email || "",
          sender_name: val.sender_name || "",
          enabled: val.enabled ?? false,
        });
      }
      setLoaded(true);
    })();
  }, []);

  const maskKey = (key: string) => {
    if (!key) return "";
    if (key.length <= 8) return "••••••••";
    return key.slice(0, 4) + "••••••••" + key.slice(-4);
  };

  const handleSave = async () => {
    if (!config.api_key || !config.sender_email || !config.sender_name) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from("app_settings")
        .upsert(
          { key: "brevo_config", value: JSON.stringify(config), updated_at: new Date().toISOString() },
          { onConflict: "key" }
        );
      if (error) throw error;
      toast.success("Configuration Brevo enregistrée");
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
      const { data, error } = await supabase.functions.invoke("send-campaign-email", {
        body: {
          test: true,
          recipients: [],
          subject: "Test Brevo",
          message: "Test de connexion",
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setTestStatus("success");
      toast.success("Connexion Brevo validée ✓");
    } catch (e: any) {
      setTestStatus("error");
      toast.error(e.message || "Connexion Brevo échouée");
    } finally {
      setTesting(false);
    }
  };

  if (!loaded) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" /> Configuration Brevo
        </CardTitle>
        <CardDescription>
          Connectez votre compte Brevo pour envoyer des emails de masse et des campagnes à vos clients.
          Les emails système (invitations, notifications) continueront d'utiliser le service interne.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-amber-500">Prérequis</p>
            <p>Créez un compte sur{" "}
              <a href="https://www.brevo.com" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1">
                brevo.com <ExternalLink className="h-3 w-3" />
              </a>
              , puis récupérez votre clé API dans <em>Paramètres → SMTP &amp; API → Clés API</em>.</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brevo-key">Clé API Brevo</Label>
          <div className="relative">
            <Input
              id="brevo-key"
              type={showKey ? "text" : "password"}
              placeholder="xkeysib-xxxxxxxxxxxx"
              value={config.api_key}
              onChange={(e) => setConfig((c) => ({ ...c, api_key: e.target.value }))}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brevo-sender-name">Nom de l'expéditeur</Label>
            <Input
              id="brevo-sender-name"
              placeholder="Mon Entreprise"
              value={config.sender_name}
              onChange={(e) => setConfig((c) => ({ ...c, sender_name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brevo-sender-email">Email de l'expéditeur</Label>
            <Input
              id="brevo-sender-email"
              type="email"
              placeholder="contact@monentreprise.fr"
              value={config.sender_email}
              onChange={(e) => setConfig((c) => ({ ...c, sender_email: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">Doit être un expéditeur vérifié dans Brevo.</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-b border-border/30">
          <div>
            <p className="text-sm font-medium">Activer l'envoi via Brevo</p>
            <p className="text-xs text-muted-foreground">Quand désactivé, les emails de masse utilisent le service par défaut.</p>
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
          <Button variant="outline" onClick={handleTest} disabled={testing || !config.api_key} className="gap-2">
            {testing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : testStatus === "success" ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Mail className="h-4 w-4" />
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
