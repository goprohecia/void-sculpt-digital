import { useState } from "react";
import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Building2, Bell, Save, CheckCircle, Mail, Phone, MapPin, Lock, Eye, EyeOff } from "lucide-react";
import { useClients } from "@/hooks/use-clients";
import { useClientId } from "@/hooks/use-client-id";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ClientSettings() {
  const { clientId, isLoading: clientLoading } = useClientId();
  const { getClientById, updateClient } = useClients();
  const client = clientId ? getClientById(clientId) : undefined;

  const [profile, setProfile] = useState({
    prenom: client?.prenom ?? "",
    nom: client?.nom ?? "",
    email: client?.email ?? "",
    telephone: client?.telephone ?? "",
    newPassword: "",
    confirmPassword: "",
  });

  const [company, setCompany] = useState({
    entreprise: client?.entreprise ?? "",
    siret: client?.siret || "",
    adresse: client?.adresse || "",
    codePostal: client?.codePostal || "",
    ville: client?.ville || "",
  });

  const [notifs, setNotifs] = useState({
    emailDevis: true,
    emailFacture: true,
    emailDossier: true,
    emailMessage: true,
    emailSupport: true,
  });

  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ new: false, confirm: false });

  const handleSave = (section: string) => {
    if (!clientId) return;
    setSaving(true);
    if (section === "Profil") {
      updateClient({ id: clientId, updates: { prenom: profile.prenom, nom: profile.nom, email: profile.email, telephone: profile.telephone } });
    } else if (section === "Entreprise") {
      updateClient({ id: clientId, updates: { entreprise: company.entreprise, siret: company.siret, adresse: company.adresse, codePostal: company.codePostal, ville: company.ville } });
    }
    setTimeout(() => {
      setSaving(false);
      toast.success(`${section} mis à jour avec succès`);
    }, 400);
  };

  const handleChangePassword = async () => {
    if (!profile.newPassword || !profile.confirmPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (profile.newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    if (profile.newPassword !== profile.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: profile.newPassword });
    setChangingPassword(false);

    if (error) {
      toast.error("Erreur lors du changement de mot de passe");
      return;
    }

    toast.success("Mot de passe modifié avec succès");
    setProfile((p) => ({ ...p, newPassword: "", confirmPassword: "" }));
  };

  if (clientLoading) return <ClientLayout><div className="p-8 text-center text-muted-foreground">Chargement...</div></ClientLayout>;

  if (!client) return <ClientLayout><div className="p-8 text-center text-muted-foreground">Aucune fiche client trouvée.</div></ClientLayout>;

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6 max-w-3xl" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6 text-[hsl(200,100%,50%)]" />
              Paramètres
            </h1>
            <p className="text-muted-foreground text-sm">Gérez vos informations personnelles et vos préférences</p>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Tabs defaultValue="profil" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profil" className="gap-1.5"><User className="h-3.5 w-3.5" /> Profil</TabsTrigger>
                <TabsTrigger value="entreprise" className="gap-1.5"><Building2 className="h-3.5 w-3.5" /> Entreprise</TabsTrigger>
                <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-3.5 w-3.5" /> Notifications</TabsTrigger>
              </TabsList>

              {/* PROFIL TAB */}
              <TabsContent value="profil">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="h-4 w-4" /> Informations personnelles
                    </CardTitle>
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
                      <Button onClick={() => handleSave("Profil")} disabled={saving} className="gap-2">
                        {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                        Enregistrer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ENTREPRISE TAB */}
              <TabsContent value="entreprise">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="h-4 w-4" /> Mon entreprise
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cl-entreprise">Nom de l'entreprise</Label>
                        <Input id="cl-entreprise" value={company.entreprise} onChange={(e) => setCompany((c) => ({ ...c, entreprise: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cl-siret">SIRET</Label>
                        <Input id="cl-siret" value={company.siret} onChange={(e) => setCompany((c) => ({ ...c, siret: e.target.value }))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cl-adresse" className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Adresse</Label>
                      <Input id="cl-adresse" value={company.adresse} onChange={(e) => setCompany((c) => ({ ...c, adresse: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cl-cp">Code postal</Label>
                        <Input id="cl-cp" value={company.codePostal} onChange={(e) => setCompany((c) => ({ ...c, codePostal: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cl-ville">Ville</Label>
                        <Input id="cl-ville" value={company.ville} onChange={(e) => setCompany((c) => ({ ...c, ville: e.target.value }))} />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button onClick={() => handleSave("Entreprise")} disabled={saving} className="gap-2">
                        {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                        Enregistrer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* NOTIFICATIONS TAB */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bell className="h-4 w-4" /> Préférences de notifications
                    </CardTitle>
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
                        <Switch
                          checked={notifs[item.key]}
                          onCheckedChange={(v) => setNotifs((n) => ({ ...n, [item.key]: v }))}
                        />
                      </div>
                    ))}
                    <div className="flex justify-end pt-2">
                      <Button onClick={() => handleSave("Notifications")} disabled={saving} className="gap-2">
                        {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                        Enregistrer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </ClientLayout>
  );
}
