import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Lock, Eye, EyeOff, Save, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileTabProps {
  client: any;
  clientId: string;
  updateClient: (args: { id: string; updates: any }) => void;
}

export function ProfileTab({ client, clientId, updateClient }: ProfileTabProps) {
  const [profile, setProfile] = useState({
    prenom: client?.prenom ?? "",
    nom: client?.nom ?? "",
    email: client?.email ?? "",
    telephone: client?.telephone ?? "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ new: false, confirm: false });

  const handleSave = () => {
    setSaving(true);
    updateClient({ id: clientId, updates: { prenom: profile.prenom, nom: profile.nom, email: profile.email, telephone: profile.telephone } });
    setTimeout(() => { setSaving(false); toast.success("Profil mis à jour avec succès"); }, 400);
  };

  const handleChangePassword = async () => {
    if (!profile.newPassword || !profile.confirmPassword) { toast.error("Veuillez remplir tous les champs"); return; }
    if (profile.newPassword.length < 8) { toast.error("Le mot de passe doit contenir au moins 8 caractères"); return; }
    if (profile.newPassword !== profile.confirmPassword) { toast.error("Les mots de passe ne correspondent pas"); return; }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: profile.newPassword });
    setChangingPassword(false);
    if (error) { toast.error("Erreur lors du changement de mot de passe"); return; }
    toast.success("Mot de passe modifié avec succès");
    setProfile((p) => ({ ...p, newPassword: "", confirmPassword: "" }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" /> Informations personnelles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cl-prenom">Prénom</Label>
            <Input id="cl-prenom" value={profile.prenom} onChange={(e) => setProfile((p) => ({ ...p, prenom: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cl-nom">Nom</Label>
            <Input id="cl-nom" value={profile.nom} onChange={(e) => setProfile((p) => ({ ...p, nom: e.target.value }))} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cl-email" className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Label>
          <Input id="cl-email" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cl-tel" className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Téléphone</Label>
          <Input id="cl-tel" value={profile.telephone} onChange={(e) => setProfile((p) => ({ ...p, telephone: e.target.value }))} />
        </div>
        <Separator />
        <div>
          <p className="text-sm font-medium flex items-center gap-1.5 mb-3"><Lock className="h-3.5 w-3.5" /> Changer le mot de passe</p>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cl-new-pw">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input id="cl-new-pw" type={showPasswords.new ? "text" : "password"} placeholder="Min. 8 caractères" value={profile.newPassword} onChange={(e) => setProfile((p) => ({ ...p, newPassword: e.target.value }))} className="pr-10" />
                  <button type="button" onClick={() => setShowPasswords(s => ({ ...s, new: !s.new }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cl-confirm-pw">Confirmer</Label>
                <div className="relative">
                  <Input id="cl-confirm-pw" type={showPasswords.confirm ? "text" : "password"} placeholder="Répétez le mot de passe" value={profile.confirmPassword} onChange={(e) => setProfile((p) => ({ ...p, confirmPassword: e.target.value }))} className="pr-10" />
                  <button type="button" onClick={() => setShowPasswords(s => ({ ...s, confirm: !s.confirm }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleChangePassword} disabled={changingPassword} variant="outline" className="gap-2">
                <Lock className="h-4 w-4" />
                {changingPassword ? "Modification..." : "Changer le mot de passe"}
              </Button>
            </div>
          </div>
        </div>
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
