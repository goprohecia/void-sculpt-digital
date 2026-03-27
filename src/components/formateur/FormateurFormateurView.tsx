import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_SESSIONS } from "@/data/mockFormateurData";
import { SectorStepper } from "@/components/admin/SectorStepper";
import { ClipboardList, Users, FileCheck, Award } from "lucide-react";
import { toast } from "sonner";

export function FormateurFormateurView() {
  const mesSessions = MOCK_SESSIONS.filter((s) => s.statut !== "terminee");
  const [selected, setSelected] = useState(mesSessions[0]);
  const [emargement, setEmargement] = useState<Record<string, Record<string, Record<string, { matin: boolean; apresMidi: boolean }>>>>(() => {
    const init: Record<string, Record<string, Record<string, { matin: boolean; apresMidi: boolean }>>> = {};
    MOCK_SESSIONS.forEach((s) => {
      init[s.id] = {};
      s.stagiaires.forEach((st) => { init[s.id][st.id] = { ...st.emargement }; });
    });
    return init;
  });
  const [notes, setNotes] = useState<Record<string, Record<string, number | "">>>({});
  const [attestations, setAttestations] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    MOCK_SESSIONS.flatMap((s) => s.stagiaires).forEach((st) => { init[st.id] = st.attestationEmise; });
    return init;
  });

  if (!selected) return null;

  const dates = selected.modules.map((m) => m.date);

  const toggleEmargement = (stagiaireId: string, date: string, period: "matin" | "apresMidi") => {
    setEmargement((prev) => {
      const sessionData = { ...prev[selected.id] };
      const stData = { ...(sessionData[stagiaireId] || {}) };
      const dateData = stData[date] || { matin: false, apresMidi: false };
      stData[date] = { ...dateData, [period]: !dateData[period] };
      sessionData[stagiaireId] = stData;
      return { ...prev, [selected.id]: sessionData };
    });
  };

  const handleEmitAttestation = (stagiaireId: string) => {
    setAttestations((prev) => ({ ...prev, [stagiaireId]: true }));
    toast.success("Attestation émise !");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" /> Espace Formateur
        </h1>
        <p className="text-muted-foreground text-sm">Gestion de vos sessions de formation</p>
      </div>

      {/* Session selector */}
      <div className="flex gap-2 flex-wrap">
        {mesSessions.map((s) => (
          <Button key={s.id} variant={selected.id === s.id ? "default" : "outline"} size="sm" onClick={() => setSelected(s)}>
            {s.intitule}
          </Button>
        ))}
      </div>

      {/* Stepper */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <SectorStepper currentStep={selected.step} />
        </CardContent>
      </Card>

      {/* Stagiaires inscrits */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Stagiaires inscrits ({selected.stagiaires.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {selected.stagiaires.map((st) => (
            <div key={st.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
              <div>
                <p className="text-sm font-medium">{st.nom}</p>
                <p className="text-xs text-muted-foreground">{st.email}</p>
              </div>
              <Badge variant={st.conventionSignee ? "secondary" : "outline"} className="text-xs">
                {st.conventionSignee ? "Convention signée" : "En attente"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Feuille d'émargement */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileCheck className="h-4 w-4" /> Feuille d'émargement</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground">
                <th className="text-left p-2 font-medium">Stagiaire</th>
                {dates.map((d) => (
                  <th key={d} className="text-center p-2 font-medium" colSpan={2}>
                    {new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })}
                  </th>
                ))}
              </tr>
              <tr className="border-b border-border/30 text-muted-foreground text-xs">
                <th />
                {dates.map((d) => (
                  <><th key={`${d}-m`} className="text-center p-1">Matin</th><th key={`${d}-a`} className="text-center p-1">AM</th></>
                ))}
              </tr>
            </thead>
            <tbody>
              {selected.stagiaires.map((st) => (
                <tr key={st.id} className="border-b border-border/20">
                  <td className="p-2 font-medium">{st.nom}</td>
                  {dates.map((d) => {
                    const data = emargement[selected.id]?.[st.id]?.[d] || { matin: false, apresMidi: false };
                    return (
                      <>
                        <td key={`${d}-m`} className="text-center p-1">
                          <Checkbox checked={data.matin} onCheckedChange={() => toggleEmargement(st.id, d, "matin")} />
                        </td>
                        <td key={`${d}-a`} className="text-center p-1">
                          <Checkbox checked={data.apresMidi} onCheckedChange={() => toggleEmargement(st.id, d, "apresMidi")} />
                        </td>
                      </>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Évaluation finale */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Award className="h-4 w-4" /> Évaluation finale & Attestations</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {selected.stagiaires.map((st) => (
            <div key={st.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-muted/30">
              <div className="flex-1">
                <p className="text-sm font-medium">{st.nom}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">Note /20</Label>
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    className="w-16 h-8 text-sm"
                    value={notes[st.id]?.[selected.id] ?? st.note ?? ""}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [st.id]: { ...(prev[st.id] || {}), [selected.id]: e.target.value === "" ? "" : Number(e.target.value) } }))}
                  />
                </div>
                {attestations[st.id] ? (
                  <Badge variant="secondary" className="text-xs gap-1"><Award className="h-3 w-3" /> Attestation émise</Badge>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => handleEmitAttestation(st.id)}>
                    Émettre l'attestation
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
