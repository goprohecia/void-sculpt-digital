import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useIsDemo } from "@/hooks/useIsDemo";
import { Bot, Sparkles, Loader2, Copy, Check } from "lucide-react";

interface AIContextButtonProps {
  label: string;
  context: string;
  prompt: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "icon";
  className?: string;
}

const DEMO_RESPONSES: Record<string, string> = {
  dossier_global: `## Résumé global du portefeuille

**Vue d'ensemble** : 25 dossiers actifs représentant un CA de 125 500 €

### Répartition par statut
- 🔵 **En cours** : 12 dossiers (48%) — 68 000 €
- 🟡 **En attente** : 8 dossiers (32%) — 42 500 €
- ✅ **Terminés** : 4 dossiers (16%) — 12 000 €
- ❌ **Annulés** : 1 dossier (4%) — 3 000 €

### Points d'attention
1. **Dossiers prioritaires** : 3 dossiers en attente depuis plus de 2 semaines
2. **Gros montants** : DOS-2026-006 (25 000 €) et DOS-2026-009 (18 000 €) nécessitent un suivi rapproché
3. **Clients récurrents** : Luxe & Mode a 4 dossiers actifs — opportunité de fidélisation

### Recommandations
1. Relancer les dossiers en attente : DOS-2026-002, DOS-2026-009
2. Planifier les rendez-vous manquants cette semaine
3. Prioriser la validation des cahiers des charges en attente`,

  dossier_single: `## Résumé du dossier

**Statut actuel** : En cours — Avancement estimé à 65%

### Progression
- ✅ Demande reçue et traitée
- ✅ Rendez-vous effectué
- ✅ Cahier des charges validé
- 🔄 Développement en cours
- ⏳ Livraison à planifier

### Analyse
Ce dossier progresse normalement. Le client a validé le CDC et le développement suit son cours. Aucun risque majeur identifié.

### Prochaines étapes recommandées
1. Finaliser le développement front-end
2. Envoyer une mise à jour au client cette semaine
3. Planifier la date de livraison prévisionnelle
4. Préparer les éléments de facturation`,

  email: `## Suggestion d'email

**Objet** : Mise à jour sur l'avancement de votre projet

Bonjour [Nom du client],

J'espère que vous allez bien. Je souhaitais vous tenir informé(e) de l'avancement de votre projet.

Nous avons bien progressé ces dernières semaines :
- ✅ La maquette a été validée
- ✅ Le développement est en cours (65% complété)
- 🔄 L'intégration des API est en phase finale

Nous prévoyons une première démonstration d'ici **[date]**. Seriez-vous disponible pour un point rapide cette semaine ?

N'hésitez pas à me contacter si vous avez des questions.

Cordialement,
[Votre nom]`,

  analyse: `## Analyse des données

### Tendances principales
- **CA mensuel** : En hausse de +12% par rapport au mois précédent
- **Taux de conversion** : 23% (stable)
- **Panier moyen** : 1 850 € (+5%)

### Segments performants
| Segment | CA | Évolution |
|---------|-----|-----------|
| Web | 45 000 € | +15% |
| Mobile | 28 000 € | +8% |
| Back-office | 18 000 € | +22% |

### Recommandations
1. **Augmenter les efforts commerciaux** sur le segment back-office (forte croissance)
2. **Lancer une campagne de relance** sur les devis en attente (12 devis, 35 000 € potentiel)
3. **Optimiser le tunnel de conversion** mobile (taux inférieur au desktop)

### Prévisions
Basé sur la tendance actuelle, le CA du trimestre devrait atteindre **~280 000 €**, soit +10% par rapport au trimestre précédent.`,
};

export function AIContextButton({ label, context, prompt, variant = "outline", size = "sm", className }: AIContextButtonProps) {
  const { isDemo } = useIsDemo();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  const generate = async (extraPrompt?: string) => {
    setLoading(true);
    setResult("");

    if (isDemo) {
      await new Promise(r => setTimeout(r, 1500));
      const key = context.includes("DOSSIER SPÉCIFIQUE") ? "dossier_single" : context.includes("RÉSUMÉ GLOBAL") ? "dossier_global" : context.includes("email") ? "email" : "analyse";
      setResult(DEMO_RESPONSES[key] || DEMO_RESPONSES.analyse);
      setLoading(false);
      return;
    }

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: `${prompt}\n\nContexte:\n${context}${extraPrompt ? `\n\nInstruction supplémentaire: ${extraPrompt}` : ""}` }],
          provider: "openai",
          model: "gpt-4o",
          apiKey: "", // Will be read from app_settings by the edge function
          systemPrompt: "Tu es un assistant IA professionnel intégré dans un logiciel de gestion d'entreprise. Réponds de manière structurée en markdown.",
        }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Erreur");
      }

      if (!resp.body) throw new Error("Pas de stream");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let content = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content || parsed.delta?.text;
            if (delta) { content += delta; setResult(content); }
          } catch {}
        }
      }
    } catch (e: any) {
      toast({ title: "Erreur IA", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={() => { setOpen(true); generate(); }}>
        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              {label}
            </DialogTitle>
            <DialogDescription>Résultat généré par l'IA à partir du contexte actuel</DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0 max-h-[50vh]">
            {loading && !result ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyse en cours…</span>
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none p-1 [&>p]:my-1 [&>ul]:my-1 [&>ol]:my-1 [&>h2]:mt-4 [&>h3]:mt-3">
                {/* Simple markdown-like rendering without react-markdown dependency */}
                {result.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-bold">{line.slice(3)}</h2>;
                  if (line.startsWith("### ")) return <h3 key={i} className="text-base font-semibold">{line.slice(4)}</h3>;
                  if (line.startsWith("- ")) return <li key={i} className="ml-4">{line.slice(2)}</li>;
                  if (line.startsWith("| ")) return <p key={i} className="font-mono text-xs">{line}</p>;
                  if (line.match(/^\d+\. /)) return <li key={i} className="ml-4 list-decimal">{line.replace(/^\d+\. /, "")}</li>;
                  if (line.startsWith("**")) return <p key={i} className="font-semibold">{line.replace(/\*\*/g, "")}</p>;
                  if (line.trim() === "") return <br key={i} />;
                  return <p key={i}>{line}</p>;
                })}
              </div>
            )}
          </ScrollArea>

          <div className="flex items-center gap-2 pt-3 border-t">
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Instruction supplémentaire (optionnel)…"
              rows={1}
              className="flex-1 min-h-[38px] resize-none"
            />
            <Button variant="outline" size="sm" onClick={() => generate(customPrompt)} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Régénérer"}
            </Button>
            <Button variant="outline" size="sm" onClick={copyResult} disabled={!result}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
