import { useState } from "react";
import { motion } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Building2, Mail, Phone, MapPin, Save, CheckCircle } from "lucide-react";
import { DEMO_CLIENT_ID } from "@/data/mockData";
import { useDemoData } from "@/contexts/DemoDataContext";
import { toast } from "sonner";

export default function ClientProfile() {
  const { getClientById, updateClient } = useDemoData();
  const client = getClientById(DEMO_CLIENT_ID)!;

  const [form, setForm] = useState({
    prenom: client.prenom,
    nom: client.nom,
    email: client.email,
    telephone: client.telephone,
    entreprise: client.entreprise,
    siret: client.siret || "",
    adresse: client.adresse || "",
    codePostal: client.codePostal || "",
    ville: client.ville || "",
    pays: client.pays || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    updateClient(DEMO_CLIENT_ID, {
      prenom: form.prenom,
      nom: form.nom,
      email: form.email,
      telephone: form.telephone,
      entreprise: form.entreprise,
      siret: form.siret,
      adresse: form.adresse,
      codePostal: form.codePostal,
      ville: form.ville,
      pays: form.pays,
    });
    setTimeout(() => {
      setSaving(false);
      toast.success("Coordonnées mises à jour avec succès");
    }, 400);
  };

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6 max-w-2xl" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold">Mon profil</h1>
            <p className="text-muted-foreground text-sm">Consultez et modifiez vos informations personnelles et celles de votre entreprise</p>
          </motion.div>

          {/* Avatar + résumé */}
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-[hsl(200,100%,50%)]/15 flex items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-[hsl(200,100%,60%)]">
                      {client.prenom.charAt(0)}{client.nom.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-semibold">{client.prenom} {client.nom}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" /> {client.entreprise}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Client depuis le {new Date(client.dateCreation).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Formulaire */}
          <motion.div variants={staggerItem}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" /> Coordonnées personnelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom</Label>
                      <Input id="prenom" value={form.prenom} onChange={(e) => handleChange("prenom", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom</Label>
                      <Input id="nom" value={form.nom} onChange={(e) => handleChange("nom", e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> Email
                    </Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telephone" className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> Téléphone
                    </Label>
                    <Input id="telephone" value={form.telephone} onChange={(e) => handleChange("telephone", e.target.value)} />
                  </div>

                  <Separator />

                  <p className="text-sm font-semibold flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" /> Coordonnées de l'entreprise
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="entreprise">Nom de l'entreprise</Label>
                      <Input id="entreprise" value={form.entreprise} onChange={(e) => handleChange("entreprise", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siret">SIRET / N° d'identification</Label>
                      <Input id="siret" value={form.siret} onChange={(e) => handleChange("siret", e.target.value)} placeholder="Ex: 123 456 789 00012" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adresse" className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> Adresse
                    </Label>
                    <Input id="adresse" value={form.adresse} onChange={(e) => handleChange("adresse", e.target.value)} placeholder="Rue, numéro" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="codePostal">Code postal</Label>
                      <Input id="codePostal" value={form.codePostal} onChange={(e) => handleChange("codePostal", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ville">Ville</Label>
                      <Input id="ville" value={form.ville} onChange={(e) => handleChange("ville", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pays">Pays</Label>
                      <Input id="pays" value={form.pays} onChange={(e) => handleChange("pays", e.target.value)} placeholder="Ex: France" />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={saving} className="gap-2">
                      {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                      {saving ? "Enregistrement…" : "Enregistrer"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AdminPageTransition>
    </ClientLayout>
  );
}
