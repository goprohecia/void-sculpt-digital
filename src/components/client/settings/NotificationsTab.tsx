import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Save, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function NotificationsTab() {
  const [notifs, setNotifs] = useState({
    emailDevis: true,
    emailFacture: true,
    emailDossier: true,
    emailMessage: true,
    emailSupport: true,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); toast.success("Notifications mis à jour avec succès"); }, 400);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" /> Préférences de notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Choisissez les notifications que vous souhaitez recevoir par email.</p>
        {[
          { key: "emailDevis" as const, label: "Devis", desc: "Recevoir une notification pour les nouveaux devis" },
          { key: "emailFacture" as const, label: "Factures", desc: "Être notifié des nouvelles factures et confirmations de paiement" },
          { key: "emailDossier" as const, label: "Dossiers", desc: "Suivre l'avancement de vos dossiers" },
          { key: "emailMessage" as const, label: "Messages", desc: "Recevoir une alerte pour les nouveaux messages" },
          { key: "emailSupport" as const, label: "Support", desc: "Être notifié des réponses à vos tickets" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <Switch checked={notifs[item.key]} onCheckedChange={(v) => setNotifs((n) => ({ ...n, [item.key]: v }))} />
          </div>
        ))}
        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
            Enregistrer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
