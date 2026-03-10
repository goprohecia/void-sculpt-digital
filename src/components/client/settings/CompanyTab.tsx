import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Save, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface CompanyTabProps {
  client: any;
  clientId: string;
  updateClient: (args: { id: string; updates: any }) => void;
}

export function CompanyTab({ client, clientId, updateClient }: CompanyTabProps) {
  const [company, setCompany] = useState({
    entreprise: client?.entreprise ?? "",
    siret: client?.siret || "",
    adresse: client?.adresse || "",
    codePostal: client?.codePostal || "",
    ville: client?.ville || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    updateClient({ id: clientId, updates: { entreprise: company.entreprise, siret: company.siret, adresse: company.adresse, codePostal: company.codePostal, ville: company.ville } });
    setTimeout(() => { setSaving(false); toast.success("Entreprise mis à jour avec succès"); }, 400);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4" /> Mon entreprise</CardTitle>
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
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <CheckCircle className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
            Enregistrer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
