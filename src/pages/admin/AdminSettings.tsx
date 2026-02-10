import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Building2, Bell, Save, CheckCircle, Mail, Phone, MapPin, Lock } from "lucide-react";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { toast } from "sonner";

export default function AdminSettings() {
  const { user } = useDemoAuth();

  // Profile form
  const [profile, setProfile] = useState({
    nom: user?.nom || "Admin",
    email: "admin@impartial.fr",
    telephone: "01 23 45 67 89",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Company form
  const [company, setCompany] = useState({
    nom: "Impartial",
    siret: "123 456 789 00012",
    adresse: "42 avenue des Champs-Élysées",
    codePostal: "75008",
    ville: "Paris",
    emailContact: "contact@impartial.fr",
    telephone: "01 23 45 67 89",
  });

  // Notification prefs
  const [notifs, setNotifs] = useState({
    emailRelance: true,
    emailPaiement: true,
    emailDemande: true,
    emailDevis: true,
    emailValidation: true,
    emailSupport: true,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = (section: string) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success(`${section} mis à jour avec succès`);
    }, 500);
  };

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6 max-w-3xl" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              Paramètres
            </h1>
            <p className="text-muted-foreground text-sm">Gérez votre profil, votre entreprise et vos notifications</p>
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
                        <Label htmlFor="admin-nom">Nom complet</Label>
                        <Input id="admin-nom" value={profile.nom} onChange={(e) => setProfile((p) => ({ ...p, nom: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-email" className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Label>
                        <Input id="admin-email" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-tel" className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Téléphone</Label>
                      <Input id="admin-tel" value={profile.telephone} onChange={(e) => setProfile((p) => ({ ...p, telephone: e.target.value }))} />
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium flex items-center gap-1.5 mb-3"><Lock className="h-3.5 w-3.5" /> Changer le mot de passe</p>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="current-pw">Mot de passe actuel</Label>
                          <Input id="current-pw" type="password" value={profile.currentPassword} onChange={(e) => setProfile((p) => ({ ...p, currentPassword: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-pw">Nouveau mot de passe</Label>
                            <Input id="new-pw" type="password" value={profile.newPassword} onChange={(e) => setProfile((p) => ({ ...p, newPassword: e.target.value }))} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-pw">Confirmer</Label>
                            <Input id="confirm-pw" type="password" value={profile.confirmPassword} onChange={(e) => setProfile((p) => ({ ...p, confirmPassword: e.target.value }))} />
                          </div>
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
                      <Building2 className="h-4 w-4" /> Informations de l'entreprise
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="co-nom">Raison sociale</Label>
                        <Input id="co-nom" value={company.nom} onChange={(e) => setCompany((c) => ({ ...c, nom: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="co-siret">SIRET</Label>
                        <Input id="co-siret" value={company.siret} onChange={(e) => setCompany((c) => ({ ...c, siret: e.target.value }))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="co-adresse" className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Adresse</Label>
                      <Input id="co-adresse" value={company.adresse} onChange={(e) => setCompany((c) => ({ ...c, adresse: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="co-cp">Code postal</Label>
                        <Input id="co-cp" value={company.codePostal} onChange={(e) => setCompany((c) => ({ ...c, codePostal: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="co-ville">Ville</Label>
                        <Input id="co-ville" value={company.ville} onChange={(e) => setCompany((c) => ({ ...c, ville: e.target.value }))} />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="co-email" className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email de contact</Label>
                        <Input id="co-email" type="email" value={company.emailContact} onChange={(e) => setCompany((c) => ({ ...c, emailContact: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="co-tel" className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Téléphone</Label>
                        <Input id="co-tel" value={company.telephone} onChange={(e) => setCompany((c) => ({ ...c, telephone: e.target.value }))} />
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
                    <p className="text-sm text-muted-foreground">Choisissez les types de notifications email que vous souhaitez recevoir.</p>
                    {[
                      { key: "emailRelance" as const, label: "Relances de paiement", desc: "Recevoir une notification lors de l'envoi d'une relance" },
                      { key: "emailPaiement" as const, label: "Confirmations de paiement", desc: "Être notifié lorsqu'un paiement est reçu" },
                      { key: "emailDemande" as const, label: "Nouvelles demandes", desc: "Recevoir une alerte pour chaque nouvelle demande client" },
                      { key: "emailDevis" as const, label: "Devis acceptés / refusés", desc: "Être notifié du statut des devis" },
                      { key: "emailValidation" as const, label: "Validations", desc: "Notifications de validation de demandes" },
                      { key: "emailSupport" as const, label: "Tickets support", desc: "Être alerté des nouveaux tickets et réponses" },
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
    </AdminLayout>
  );
}
