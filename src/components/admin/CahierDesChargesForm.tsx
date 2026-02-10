import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, CheckCircle, Paperclip, FileIcon, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { CahierDesCharges, CdcPieceJointe } from "@/contexts/DemoDataContext";

// ─── Suggestions pré-définies ────────────────────────────────────
const SUGGESTIONS_FONCTIONNALITES = [
  "Authentification (inscription / connexion)",
  "Tableau de bord utilisateur",
  "Gestion de profil",
  "Notifications par e-mail",
  "Notifications push",
  "Système de messagerie interne",
  "Recherche et filtres avancés",
  "Paiement en ligne (Stripe / PayPal)",
  "Gestion des rôles et permissions",
  "Export CSV / PDF",
  "Tableau de bord administrateur",
  "Système de réservation / booking",
  "Blog / CMS intégré",
  "Système d'avis / notation",
  "Intégration calendrier",
  "Multi-langue",
  "Mode sombre / clair",
  "Chat en temps réel",
  "Système de fichiers / upload",
  "Statistiques et analytics",
];

const SUGGESTIONS_DESIGN = [
  "Design minimaliste et épuré",
  "Style corporate / professionnel",
  "Look moderne et coloré",
  "Dark mode par défaut",
  "Animations fluides (transitions, micro-interactions)",
  "Respect de la charte graphique existante",
  "Composants arrondis (border-radius)",
  "Typographie premium (serif / sans-serif)",
  "Palette de couleurs neutres",
  "Illustrations personnalisées",
  "Iconographie cohérente (Lucide / Heroicons)",
  "Glassmorphism / effets de profondeur",
];

const SUGGESTIONS_CONTRAINTES = [
  "Responsive (mobile, tablette, desktop)",
  "Compatible Chrome, Firefox, Safari, Edge",
  "Hébergement sur serveur européen (RGPD)",
  "API RESTful",
  "Base de données PostgreSQL",
  "Temps de chargement < 3 secondes",
  "Certificat SSL obligatoire",
  "Intégration avec un ERP existant",
  "CI/CD et déploiement automatisé",
  "Tests unitaires et d'intégration",
  "Accessibilité WCAG 2.1 AA",
  "PWA (Progressive Web App)",
];

const SUGGESTIONS_SECURITE = [
  "Authentification à deux facteurs (2FA)",
  "Chiffrement des données sensibles",
  "Protection contre les attaques XSS / CSRF",
  "Conformité RGPD",
  "Politique de mots de passe robuste",
  "Journalisation des actions utilisateurs",
  "Sauvegarde automatique quotidienne",
  "Gestion des sessions et timeout",
];

const SUGGESTIONS_SEO = [
  "Balises méta optimisées",
  "URLs propres et lisibles",
  "Sitemap XML automatique",
  "Schema.org / données structurées",
  "Performance Lighthouse > 90",
  "Open Graph pour réseaux sociaux",
  "Redirection 301 automatique",
  "Lazy loading des images",
];

const SUGGESTIONS_MAINTENANCE = [
  "Maintenance corrective incluse 3 mois",
  "Support technique par e-mail",
  "Mise à jour de sécurité mensuelle",
  "Monitoring de disponibilité 24/7",
  "Documentation technique complète",
  "Formation utilisateur incluse",
  "SLA avec temps de réponse garanti",
];

// ─── Composant de suggestions cliquables ─────────────────────────
function SuggestionChips({
  suggestions,
  selected,
  onToggle,
}: {
  suggestions: string[];
  selected: string[];
  onToggle: (s: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {suggestions.map((s) => {
        const isActive = selected.some((sel) => sel.toLowerCase() === s.toLowerCase());
        return (
          <Badge
            key={s}
            variant={isActive ? "default" : "outline"}
            className={`cursor-pointer text-xs transition-all select-none ${isActive ? "opacity-60" : "hover:bg-accent"}`}
            onClick={() => onToggle(s)}
          >
            {isActive ? "✓ " : "+ "}{s}
          </Badge>
        );
      })}
    </div>
  );
}

// ─── Form Props ──────────────────────────────────────────────────
interface CahierDesChargesFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  demandeId: string;
  existing?: CahierDesCharges | null;
  onSave: (cahier: CahierDesCharges) => void;
}

export function CahierDesChargesForm({ open, onOpenChange, demandeId, existing, onSave }: CahierDesChargesFormProps) {
  const [contexte, setContexte] = useState("");
  const [publicCible, setPublicCible] = useState("");
  const [fonctionnalites, setFonctionnalites] = useState<string[]>([""]);
  const [designNotes, setDesignNotes] = useState("");
  const [contraintesTechniques, setContraintesTechniques] = useState("");
  const [planningSouhaite, setPlanningSouhaite] = useState("");
  const [budgetComplementaire, setBudgetComplementaire] = useState("");
  const [remarques, setRemarques] = useState("");
  // Nouvelles rubriques stockées dans remarques structurées
  const [securite, setSecurite] = useState("");
  const [seo, setSeo] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [objectifsKpi, setObjectifsKpi] = useState("");
  const [inspirations, setInspirations] = useState("");
  const [piecesJointes, setPiecesJointes] = useState<CdcPieceJointe[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existing) {
      setContexte(existing.contexte);
      setPublicCible(existing.publicCible);
      setFonctionnalites(existing.fonctionnalites.length > 0 ? [...existing.fonctionnalites] : [""]);
      setDesignNotes(existing.designNotes);
      setContraintesTechniques(existing.contraintesTechniques);
      setPlanningSouhaite(existing.planningSouhaite);
      setBudgetComplementaire(existing.budgetComplementaire);
      setPiecesJointes(existing.piecesJointes || []);
      const parsed = parseRemarques(existing.remarques);
      setRemarques(parsed.remarques);
      setSecurite(parsed.securite);
      setSeo(parsed.seo);
      setMaintenance(parsed.maintenance);
      setObjectifsKpi(parsed.objectifsKpi);
      setInspirations(parsed.inspirations);
    } else {
      setContexte(""); setPublicCible(""); setFonctionnalites([""]); setDesignNotes("");
      setContraintesTechniques(""); setPlanningSouhaite(""); setBudgetComplementaire("");
      setRemarques(""); setSecurite(""); setSeo(""); setMaintenance(""); setObjectifsKpi(""); setInspirations("");
      setPiecesJointes([]);
    }
  }, [existing, open]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
    const maxSize = 10 * 1024 * 1024; // 10 MB

    setUploading(true);
    const newAttachments: CdcPieceJointe[] = [];

    for (const file of Array.from(files)) {
      if (!allowed.includes(file.type)) {
        toast.error(`Type non supporté : ${file.name}. Formats acceptés : images, PDF`);
        continue;
      }
      if (file.size > maxSize) {
        toast.error(`Fichier trop volumineux : ${file.name} (max 10 Mo)`);
        continue;
      }

      const ext = file.name.split(".").pop();
      const path = `${demandeId}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error } = await supabase.storage.from("cdc-attachments").upload(path, file);
      if (error) {
        toast.error(`Erreur upload : ${file.name}`);
        continue;
      }

      const { data: signedData } = await supabase.storage.from("cdc-attachments").createSignedUrl(path, 60 * 60 * 24 * 365);
      const fileUrl = signedData?.signedUrl || path;

      newAttachments.push({
        name: file.name,
        url: fileUrl,
        type: file.type,
        size: file.size,
      });
    }

    if (newAttachments.length > 0) {
      setPiecesJointes((prev) => [...prev, ...newAttachments]);
      toast.success(`${newAttachments.length} fichier(s) ajouté(s)`);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (idx: number) => {
    setPiecesJointes((prev) => prev.filter((_, i) => i !== idx));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const addFonctionnalite = () => setFonctionnalites((prev) => [...prev, ""]);
  const removeFonctionnalite = (idx: number) => setFonctionnalites((prev) => prev.filter((_, i) => i !== idx));
  const updateFonctionnalite = (idx: number, val: string) => setFonctionnalites((prev) => prev.map((f, i) => (i === idx ? val : f)));

  // Toggle a suggestion into fonctionnalites list
  const toggleFonctionnaliteSuggestion = (s: string) => {
    setFonctionnalites((prev) => {
      const exists = prev.some((f) => f.toLowerCase() === s.toLowerCase());
      if (exists) return prev.filter((f) => f.toLowerCase() !== s.toLowerCase());
      // Replace empty slot or add
      const emptyIdx = prev.findIndex((f) => f.trim() === "");
      if (emptyIdx >= 0) {
        const next = [...prev];
        next[emptyIdx] = s;
        return next;
      }
      return [...prev, s];
    });
  };

  // Toggle a suggestion into a text field (append/remove line)
  const toggleTextSuggestion = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    suggestion: string
  ) => {
    const lines = value.split("\n").filter(Boolean);
    const exists = lines.some((l) => l.toLowerCase() === suggestion.toLowerCase());
    if (exists) {
      setter(lines.filter((l) => l.toLowerCase() !== suggestion.toLowerCase()).join("\n"));
    } else {
      setter(value ? value + "\n" + suggestion : suggestion);
    }
  };

  const getTextSuggestionSelected = (value: string) =>
    value.split("\n").map((l) => l.trim()).filter(Boolean);

  const buildRemarques = () => {
    const sections: string[] = [];
    if (securite.trim()) sections.push(`[SÉCURITÉ]\n${securite.trim()}`);
    if (seo.trim()) sections.push(`[SEO / RÉFÉRENCEMENT]\n${seo.trim()}`);
    if (maintenance.trim()) sections.push(`[MAINTENANCE / SUPPORT]\n${maintenance.trim()}`);
    if (objectifsKpi.trim()) sections.push(`[OBJECTIFS / KPI]\n${objectifsKpi.trim()}`);
    if (inspirations.trim()) sections.push(`[INSPIRATIONS / RÉFÉRENCES]\n${inspirations.trim()}`);
    if (remarques.trim()) sections.push(`[REMARQUES GÉNÉRALES]\n${remarques.trim()}`);
    return sections.join("\n\n");
  };

  const buildCahier = (statut: "brouillon" | "complet"): CahierDesCharges => {
    const now = new Date().toISOString();
    const isNew = !existing;
    const wasRejected = existing?.statut === "rejeté";
    const prevHistorique = existing?.historique || [];
    const newEntry = {
      id: `h_${Date.now()}`,
      action: isNew && statut === "brouillon" ? "creation" as const : statut === "complet" ? "soumission" as const : "mise_a_jour" as const,
      auteur: "client" as const,
      description: isNew && statut === "brouillon" ? "Cahier des charges créé" : wasRejected && statut === "complet" ? "Cahier des charges re-soumis après correction" : statut === "complet" ? "Cahier des charges soumis pour validation" : "Cahier des charges mis à jour",
      date: now,
    };
    return {
      id: existing?.id || `cdc_${Date.now()}`,
      demandeId,
      contexte: contexte.trim(),
      publicCible: publicCible.trim(),
      fonctionnalites: fonctionnalites.map((f) => f.trim()).filter(Boolean),
      designNotes: designNotes.trim(),
      contraintesTechniques: contraintesTechniques.trim(),
      planningSouhaite: planningSouhaite.trim(),
      budgetComplementaire: budgetComplementaire.trim(),
      remarques: buildRemarques(),
      statut,
      dateMiseAJour: now.split("T")[0],
      historique: [...prevHistorique, newEntry],
      piecesJointes,
      ...(existing?.nbRejets ? { nbRejets: existing.nbRejets } : {}),
    };
  };

  const handleSaveDraft = () => {
    onSave(buildCahier("brouillon"));
    toast.success("Brouillon enregistré");
    onOpenChange(false);
  };

  const handleFinalize = () => {
    if (!contexte.trim()) { toast.error("Le contexte du projet est requis"); return; }
    onSave(buildCahier("complet"));
    toast.success("Cahier des charges finalisé");
    onOpenChange(false);
  };

  const sectionClass = "space-y-2";
  const sectionTitle = "text-sm font-semibold text-foreground";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cahier des charges</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          {/* Contexte */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Contexte du projet *</Label>
            <Textarea value={contexte} onChange={(e) => setContexte(e.target.value)} placeholder="Présentez votre entreprise et les objectifs du projet..." rows={3} />
          </div>

          {/* Public cible */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Public cible</Label>
            <Textarea value={publicCible} onChange={(e) => setPublicCible(e.target.value)} placeholder="Décrivez les utilisateurs visés, personas..." rows={2} />
          </div>

          {/* Fonctionnalités */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Fonctionnalités attendues</Label>
            <p className="text-xs text-muted-foreground">Cliquez sur une suggestion pour l'ajouter ou la retirer</p>
            <SuggestionChips
              suggestions={SUGGESTIONS_FONCTIONNALITES}
              selected={fonctionnalites}
              onToggle={toggleFonctionnaliteSuggestion}
            />
            {fonctionnalites.map((f, idx) => (
              <div key={idx} className="flex gap-2">
                <Input value={f} onChange={(e) => updateFonctionnalite(idx, e.target.value)} placeholder={`Fonctionnalité ${idx + 1}`} />
                {fonctionnalites.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeFonctionnalite(idx)} className="shrink-0">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addFonctionnalite} className="gap-1">
              <Plus className="h-3 w-3" /> Ajouter
            </Button>
          </div>

          {/* Design */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Design et charte graphique</Label>
            <p className="text-xs text-muted-foreground">Sélectionnez des options et/ou décrivez vos préférences</p>
            <SuggestionChips
              suggestions={SUGGESTIONS_DESIGN}
              selected={getTextSuggestionSelected(designNotes)}
              onToggle={(s) => toggleTextSuggestion(designNotes, setDesignNotes, s)}
            />
            <Textarea value={designNotes} onChange={(e) => setDesignNotes(e.target.value)} placeholder="Détails complémentaires : couleurs, inspirations, URLs..." rows={2} />
          </div>

          {/* Contraintes techniques */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Contraintes techniques</Label>
            <p className="text-xs text-muted-foreground">Sélectionnez les contraintes applicables</p>
            <SuggestionChips
              suggestions={SUGGESTIONS_CONTRAINTES}
              selected={getTextSuggestionSelected(contraintesTechniques)}
              onToggle={(s) => toggleTextSuggestion(contraintesTechniques, setContraintesTechniques, s)}
            />
            <Textarea value={contraintesTechniques} onChange={(e) => setContraintesTechniques(e.target.value)} placeholder="Technologies imposées, hébergement, intégrations tierces..." rows={2} />
          </div>

          {/* Sécurité */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Sécurité et conformité</Label>
            <SuggestionChips
              suggestions={SUGGESTIONS_SECURITE}
              selected={getTextSuggestionSelected(securite)}
              onToggle={(s) => toggleTextSuggestion(securite, setSecurite, s)}
            />
            <Textarea value={securite} onChange={(e) => setSecurite(e.target.value)} placeholder="Exigences de sécurité spécifiques..." rows={2} />
          </div>

          {/* SEO */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>SEO et référencement</Label>
            <SuggestionChips
              suggestions={SUGGESTIONS_SEO}
              selected={getTextSuggestionSelected(seo)}
              onToggle={(s) => toggleTextSuggestion(seo, setSeo, s)}
            />
            <Textarea value={seo} onChange={(e) => setSeo(e.target.value)} placeholder="Objectifs SEO spécifiques..." rows={2} />
          </div>

          {/* Maintenance */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Maintenance et support</Label>
            <SuggestionChips
              suggestions={SUGGESTIONS_MAINTENANCE}
              selected={getTextSuggestionSelected(maintenance)}
              onToggle={(s) => toggleTextSuggestion(maintenance, setMaintenance, s)}
            />
            <Textarea value={maintenance} onChange={(e) => setMaintenance(e.target.value)} placeholder="Attentes en matière de support post-livraison..." rows={2} />
          </div>

          {/* Objectifs / KPI */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Objectifs et KPI</Label>
            <Textarea value={objectifsKpi} onChange={(e) => setObjectifsKpi(e.target.value)} placeholder="Nombre d'utilisateurs visés, taux de conversion, temps de chargement cible..." rows={2} />
          </div>

          {/* Inspirations */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Sites d'inspiration / Références</Label>
            <Textarea value={inspirations} onChange={(e) => setInspirations(e.target.value)} placeholder="URLs de sites qui vous inspirent, captures d'écran..." rows={2} />
          </div>

          {/* Planning */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Planning souhaité</Label>
            <Input value={planningSouhaite} onChange={(e) => setPlanningSouhaite(e.target.value)} placeholder="Date de livraison souhaitée, jalons..." />
          </div>

          {/* Budget */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Budget complémentaire</Label>
            <Input value={budgetComplementaire} onChange={(e) => setBudgetComplementaire(e.target.value)} placeholder="Informations budgétaires additionnelles..." />
          </div>

          {/* Pièces jointes */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Pièces jointes</Label>
            <p className="text-xs text-muted-foreground">Images (JPG, PNG, WebP) et documents PDF — max 10 Mo par fichier</p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            {piecesJointes.length > 0 && (
              <div className="space-y-1.5">
                {piecesJointes.map((pj, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-md border border-border/50 bg-muted/20 px-3 py-2 text-sm">
                    {pj.type.startsWith("image/") ? (
                      <img src={pj.url} alt={pj.name} className="h-8 w-8 rounded object-cover shrink-0" />
                    ) : (
                      <FileIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="flex-1 truncate">{pj.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{formatFileSize(pj.size)}</span>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => removeAttachment(idx)}>
                      <X className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="gap-1"
            >
              {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Paperclip className="h-3 w-3" />}
              {uploading ? "Upload en cours..." : "Ajouter des fichiers"}
            </Button>
          </div>

          {/* Remarques */}
          <div className={sectionClass}>
            <Label className={sectionTitle}>Remarques générales</Label>
            <Textarea value={remarques} onChange={(e) => setRemarques(e.target.value)} placeholder="Notes supplémentaires..." rows={3} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={handleSaveDraft} className="flex-1 gap-1">
              <Save className="h-4 w-4" /> Enregistrer brouillon
            </Button>
            <Button onClick={handleFinalize} className="flex-1 gap-1">
              <CheckCircle className="h-4 w-4" /> Finaliser
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Parse extended sections from remarques field ────────────────
function parseRemarques(raw: string) {
  const result = { remarques: "", securite: "", seo: "", maintenance: "", objectifsKpi: "", inspirations: "" };
  if (!raw) return result;

  const sectionMap: Record<string, keyof typeof result> = {
    "[SÉCURITÉ]": "securite",
    "[SEO / RÉFÉRENCEMENT]": "seo",
    "[MAINTENANCE / SUPPORT]": "maintenance",
    "[OBJECTIFS / KPI]": "objectifsKpi",
    "[INSPIRATIONS / RÉFÉRENCES]": "inspirations",
    "[REMARQUES GÉNÉRALES]": "remarques",
  };

  // Try to parse structured sections
  let hasStructured = false;
  for (const key of Object.keys(sectionMap)) {
    if (raw.includes(key)) { hasStructured = true; break; }
  }

  if (!hasStructured) {
    result.remarques = raw;
    return result;
  }

  const lines = raw.split("\n");
  let currentKey: keyof typeof result = "remarques";
  for (const line of lines) {
    const trimmed = line.trim();
    let matched = false;
    for (const [tag, key] of Object.entries(sectionMap)) {
      if (trimmed === tag) {
        currentKey = key;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result[currentKey] = result[currentKey] ? result[currentKey] + "\n" + line : line;
    }
  }

  // Trim all values
  for (const key of Object.keys(result) as (keyof typeof result)[]) {
    result[key] = result[key].trim();
  }

  return result;
}
