import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { EmailLogPanel } from "@/components/admin/EmailLogPanel";
import { useEmailLogs } from "@/hooks/use-email-logs";
import { useEmailTemplates } from "@/hooks/use-email-templates";
import { useClients } from "@/hooks/use-clients";
import { useIsDemo } from "@/hooks/useIsDemo";
import { supabase } from "@/integrations/supabase/client";
import type { EmailLogType } from "@/contexts/DemoDataContext";
import { exportCsv } from "@/lib/exportCsv";
import { Mail, Download, Search, Plus, FileText, Send, Trash2, Sparkles, Loader2 } from "lucide-react";
import { AIContextButton } from "@/components/admin/AIContextButton";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const BUILTIN_TYPES = [
  { value: "relance", label: "Relance" },
  { value: "devis", label: "Devis" },
  { value: "paiement", label: "Paiement" },
  { value: "demande", label: "Demande" },
  { value: "validation", label: "Validation" },
  { value: "autre", label: "Autre" },
];

const typeFilters: { label: string; value: EmailLogType | "all" }[] = [
  { label: "Tous", value: "all" },
  { label: "Relance", value: "relance" },
  { label: "Devis", value: "devis" },
  { label: "Paiement", value: "paiement" },
  { label: "Demande", value: "demande" },
  { label: "Validation", value: "validation" },
];

// ── Shared AI streaming helper ──
async function streamAiSuggest(opts: {
  destinataire?: string;
  sujet?: string;
  contexte?: string;
  signal?: AbortSignal;
  onDelta: (full: string) => void;
}) {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/suggest-email`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({
      destinataire: opts.destinataire,
      sujet: opts.sujet,
      contexte: opts.contexte,
    }),
    signal: opts.signal,
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Erreur IA" }));
    throw new Error(err.error || "Erreur lors de la suggestion");
  }
  if (!resp.body) throw new Error("No response body");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let content = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { streamDone = true; break; }
      try {
        const parsed = JSON.parse(jsonStr);
        const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (delta) { content += delta; opts.onDelta(content); }
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  // Flush
  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (delta) { content += delta; opts.onDelta(content); }
      } catch { /* ignore */ }
    }
  }
  return content;
}

export default function AdminEmails() {
  const { emailLogs, pushEmail } = useEmailLogs();
  const { templates, addTemplate, deleteTemplate } = useEmailTemplates();
  const { clients } = useClients();
  const { isDemo } = useIsDemo();

  const [typeFilter, setTypeFilter] = useState<EmailLogType | "all">("all");
  const [search, setSearch] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [tplOpen, setTplOpen] = useState(false);

  // Compose form
  const [composeForm, setComposeForm] = useState({ destinataire: "", sujet: "", contenu: "", type: "autre", contexteAi: "" });
  // Template form
  const [tplForm, setTplForm] = useState({ nom: "", sujet: "", contenu: "", type: "relance" });
  // Custom types
  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const [newCustomType, setNewCustomType] = useState("");

  // AI states
  const [aiLoading, setAiLoading] = useState(false);
  const [tplAiLoading, setTplAiLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const tplAbortRef = useRef<AbortController | null>(null);
  // Template AI context
  const [tplContexteAi, setTplContexteAi] = useState("");

  // All available types = builtin + custom
  const allTypes = useMemo(() => {
    const builtinValues = BUILTIN_TYPES.map((t) => t.value);
    const extras = customTypes.filter((ct) => !builtinValues.includes(ct));
    return [
      ...BUILTIN_TYPES,
      ...extras.map((ct) => ({ value: ct, label: ct.charAt(0).toUpperCase() + ct.slice(1) })),
    ];
  }, [customTypes]);

  const handleAddCustomType = () => {
    const trimmed = newCustomType.trim().toLowerCase();
    if (!trimmed) return;
    if (allTypes.some((t) => t.value === trimmed)) {
      toast.error("Ce type existe déjà");
      return;
    }
    setCustomTypes((prev) => [...prev, trimmed]);
    setNewCustomType("");
    toast.success(`Type "${trimmed}" ajouté`);
  };

  const filtered = useMemo(() => {
    let list = emailLogs;
    if (typeFilter !== "all") list = list.filter((e) => e.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.destinataire.toLowerCase().includes(q) || e.sujet.toLowerCase().includes(q) || (e.reference && e.reference.toLowerCase().includes(q)));
    }
    return list;
  }, [emailLogs, typeFilter, search]);

  const handleExportCsv = () => {
    if (filtered.length === 0) { toast.error("Aucun email à exporter"); return; }
    exportCsv(`emails-${new Date().toISOString().slice(0, 10)}.csv`,
      ["ID", "Type", "Destinataire", "Sujet", "Date", "Référence"],
      filtered.map((e) => [e.id, e.type, e.destinataire, e.sujet, new Date(e.dateEnvoi).toLocaleString("fr-FR"), e.reference || ""])
    );
    toast.success("Export CSV téléchargé");
  };

  const handleCompose = async () => {
    if (!composeForm.destinataire || !composeForm.sujet) { toast.error("Destinataire et sujet requis"); return; }
    pushEmail(composeForm.type as EmailLogType, composeForm.destinataire, composeForm.sujet, composeForm.contenu);

    if (!isDemo) {
      try {
        await supabase.functions.invoke("send-bulk-email", {
          body: { emails: [composeForm.destinataire], sujet: composeForm.sujet, contenu: composeForm.contenu },
        });
      } catch (e) { console.error("Erreur envoi:", e); }
    }

    toast.success("Email envoyé");
    setComposeOpen(false);
    setComposeForm({ destinataire: "", sujet: "", contenu: "", type: "autre", contexteAi: "" });
  };

  const handleAddTemplate = () => {
    if (!tplForm.nom || !tplForm.sujet) { toast.error("Nom et sujet requis"); return; }
    addTemplate(tplForm);
    toast.success("Template créé");
    setTplOpen(false);
    setTplForm({ nom: "", sujet: "", contenu: "", type: "relance" });
    setTplContexteAi("");
  };

  // ── Compose AI suggestion ──
  const handleAiSuggest = async () => {
    if (!composeForm.destinataire && !composeForm.sujet && !composeForm.contexteAi) {
      toast.error("Renseignez un destinataire, un sujet ou un contexte pour la suggestion IA");
      return;
    }

    if (isDemo) {
      setComposeForm((f) => ({ ...f, contenu: "Bonjour,\n\nJe me permets de vous contacter concernant votre projet. Suite à nos échanges, je souhaitais faire un point sur l'avancement et les prochaines étapes.\n\nN'hésitez pas à me faire part de vos retours.\n\nCordialement,\nL'équipe" }));
      return;
    }

    setAiLoading(true);
    abortRef.current = new AbortController();

    const client = clients.find((c) => c.email === composeForm.destinataire);
    const destinataireContext = client
      ? `${client.prenom} ${client.nom} (${client.entreprise || client.email})`
      : composeForm.destinataire;

    // Build context from type + user-provided context
    const contextParts: string[] = [];
    if (composeForm.type && composeForm.type !== "autre") contextParts.push(`Type d'email : ${composeForm.type}`);
    if (composeForm.contexteAi.trim()) contextParts.push(composeForm.contexteAi.trim());

    setComposeForm((f) => ({ ...f, contenu: "" }));

    try {
      await streamAiSuggest({
        destinataire: destinataireContext,
        sujet: composeForm.sujet,
        contexte: contextParts.length > 0 ? contextParts.join(". ") : undefined,
        signal: abortRef.current.signal,
        onDelta: (full) => setComposeForm((f) => ({ ...f, contenu: full })),
      });
    } catch (e: any) {
      if (e.name !== "AbortError") {
        console.error("AI suggest error:", e);
        toast.error(e.message || "Erreur lors de la suggestion IA");
      }
    } finally {
      setAiLoading(false);
      abortRef.current = null;
    }
  };

  // ── Template AI suggestion ──
  const handleTplAiSuggest = async () => {
    if (!tplForm.sujet && !tplContexteAi) {
      toast.error("Renseignez un sujet ou un contexte pour la suggestion IA");
      return;
    }

    if (isDemo) {
      setTplForm((f) => ({ ...f, contenu: "Bonjour {{prenom}},\n\nNous revenons vers vous concernant {{sujet}}.\n\nN'hésitez pas à nous contacter pour toute question.\n\nCordialement,\nL'équipe" }));
      return;
    }

    setTplAiLoading(true);
    tplAbortRef.current = new AbortController();

    const contextParts: string[] = [];
    contextParts.push(`Ceci est un template d'email réutilisable de type "${tplForm.type}"`);
    contextParts.push("Tu peux utiliser des variables entre double accolades comme {{prenom}}, {{nom}}, {{entreprise}}, {{factureRef}}, {{montant}} pour personnaliser le template");
    if (tplContexteAi.trim()) contextParts.push(tplContexteAi.trim());

    setTplForm((f) => ({ ...f, contenu: "" }));

    try {
      await streamAiSuggest({
        sujet: tplForm.sujet,
        contexte: contextParts.join(". "),
        signal: tplAbortRef.current.signal,
        onDelta: (full) => setTplForm((f) => ({ ...f, contenu: full })),
      });
    } catch (e: any) {
      if (e.name !== "AbortError") {
        console.error("TPL AI suggest error:", e);
        toast.error(e.message || "Erreur lors de la suggestion IA");
      }
    } finally {
      setTplAiLoading(false);
      tplAbortRef.current = null;
    }
  };

  const handleCancelAi = () => { abortRef.current?.abort(); setAiLoading(false); };
  const handleCancelTplAi = () => { tplAbortRef.current?.abort(); setTplAiLoading(false); };

  // Shared AI button component
  const AiSuggestButton = ({ loading, onSuggest, onCancel, disabled }: { loading: boolean; onSuggest: () => void; onCancel: () => void; disabled?: boolean }) =>
    loading ? (
      <Button type="button" size="sm" variant="ghost" onClick={onCancel} className="gap-1.5 text-xs h-7 text-destructive hover:text-destructive">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Arrêter
      </Button>
    ) : (
      <Button type="button" size="sm" variant="ghost" onClick={onSuggest} disabled={disabled} className="gap-1.5 text-xs h-7 text-primary hover:text-primary disabled:opacity-40">
        <Sparkles className="h-3.5 w-3.5" /> Suggestion IA
      </Button>
    );

  // Shared AI textarea overlay
  const AiOverlay = ({ loading }: { loading: boolean }) =>
    loading ? (
      <div className="absolute bottom-2 right-2">
        <span className="inline-flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          <Sparkles className="h-3 w-3 animate-pulse" /> Rédaction en cours…
        </span>
      </div>
    ) : null;

  // Type selector rendered inline (not as a component to avoid focus loss)
  const renderTypeSelector = (value: string, onChange: (v: string) => void) => (
    <div className="space-y-2">
      <Label>Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {allTypes.map((t) => (
            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Input
          value={newCustomType}
          onChange={(e) => setNewCustomType(e.target.value)}
          placeholder="Nouveau type personnalisé…"
          className="h-8 text-xs"
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddCustomType(); } }}
        />
        <Button type="button" size="sm" variant="outline" onClick={handleAddCustomType} disabled={!newCustomType.trim()} className="h-8 text-xs px-3">
          <Plus className="h-3 w-3 mr-1" /> Ajouter
        </Button>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2"><Mail className="h-6 w-6 text-primary" /> Emails</h1>
              <p className="text-muted-foreground text-sm">{emailLogs.length} email{emailLogs.length !== 1 ? "s" : ""} · {templates.length} template{templates.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex gap-2 self-start">
              <AIContextButton
                label="Suggestion d'email"
                context={`email - ${emailLogs.length} emails envoyés, ${templates.length} templates disponibles. Derniers types: ${emailLogs.slice(0, 5).map(e => e.type).join(", ")}.`}
                prompt="Suggère un email professionnel à envoyer basé sur le contexte actuel. Propose un objet accrocheur et un contenu structuré adapté au contexte business."
              />
              <Button onClick={() => setComposeOpen(true)} size="sm" className="gap-1"><Plus className="h-4 w-4" /> Composer</Button>
              <Button onClick={handleExportCsv} variant="outline" size="sm" className="gap-1"><Download className="h-4 w-4" /> CSV</Button>
            </div>
          </motion.div>

          <Tabs defaultValue="journal">
            <TabsList>
              <TabsTrigger value="journal">Journal ({emailLogs.length})</TabsTrigger>
              <TabsTrigger value="templates">Templates ({templates.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="journal" className="space-y-4 mt-4">
              <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {typeFilters.map((f) => (
                    <button key={f.value} onClick={() => setTypeFilter(f.value)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${typeFilter === f.value ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"}`}>{f.label}</button>
                  ))}
                </div>
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Rechercher…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
                </div>
              </motion.div>

              <motion.div variants={staggerItem} className="glass-card p-4 sm:p-6">
                <p className="text-xs text-muted-foreground mb-3">{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</p>
                <EmailLogPanel emails={filtered} />
              </motion.div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4 mt-4">
              <div className="flex justify-end">
                <Button size="sm" onClick={() => setTplOpen(true)} className="gap-1"><Plus className="h-4 w-4" /> Nouveau template</Button>
              </div>
              <div className="space-y-3">
                {templates.length === 0 ? (
                  <AdminEmptyState icon={FileText} title="Aucun template" description="Créez des templates d'email réutilisables." />
                ) : templates.map((tpl) => (
                  <div key={tpl.id} className="glass-card p-4 flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{tpl.nom}</p>
                      <p className="text-xs text-muted-foreground truncate">{tpl.sujet}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground">{tpl.type}</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => { deleteTemplate(tpl.id); toast.success("Template supprimé"); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* ── Compose Dialog ── */}
        <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="flex items-center gap-2"><Send className="h-5 w-5 text-primary" /> Composer un email</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Destinataire</Label>
                <Select value={composeForm.destinataire} onValueChange={(v) => setComposeForm((f) => ({ ...f, destinataire: v }))}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner un client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => <SelectItem key={c.id} value={c.email}>{c.entreprise || `${c.prenom} ${c.nom}`} — {c.email}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Sujet *</Label><Input value={composeForm.sujet} onChange={(e) => setComposeForm((f) => ({ ...f, sujet: e.target.value }))} /></div>

              {/* Context field for AI */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Contexte pour l'IA
                  <span className="text-[10px] text-muted-foreground font-normal">(optionnel)</span>
                </Label>
                <Textarea
                  value={composeForm.contexteAi}
                  onChange={(e) => setComposeForm((f) => ({ ...f, contexteAi: e.target.value }))}
                  rows={2}
                  placeholder="Ex: Le client a un retard de paiement de 15 jours sur la facture F-2024-042. C'est la 2ème relance."
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Contenu</Label>
                  <AiSuggestButton
                    loading={aiLoading}
                    onSuggest={handleAiSuggest}
                    onCancel={handleCancelAi}
                    disabled={!composeForm.destinataire && !composeForm.sujet && !composeForm.contexteAi}
                  />
                </div>
                <div className="relative">
                  <Textarea
                    value={composeForm.contenu}
                    onChange={(e) => setComposeForm((f) => ({ ...f, contenu: e.target.value }))}
                    rows={6}
                    disabled={aiLoading}
                    className={aiLoading ? "opacity-80" : ""}
                    placeholder="Rédigez votre email ou utilisez la suggestion IA…"
                  />
                  <AiOverlay loading={aiLoading} />
                </div>
              </div>
              {templates.length > 0 && (
                <div className="space-y-2">
                  <Label>Utiliser un template</Label>
                  <Select onValueChange={(v) => {
                    const tpl = templates.find((t) => t.id === v);
                    if (tpl) setComposeForm((f) => ({ ...f, sujet: tpl.sujet, contenu: tpl.contenu }));
                  }}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner (optionnel)" /></SelectTrigger>
                    <SelectContent>{templates.map((t) => <SelectItem key={t.id} value={t.id}>{t.nom}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}
              <Button className="w-full gap-2" onClick={handleCompose} disabled={aiLoading}><Send className="h-4 w-4" /> Envoyer</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Template Dialog ── */}
        <Dialog open={tplOpen} onOpenChange={setTplOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Nouveau template</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2"><Label>Nom *</Label><Input value={tplForm.nom} onChange={(e) => setTplForm((f) => ({ ...f, nom: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Sujet *</Label><Input value={tplForm.sujet} onChange={(e) => setTplForm((f) => ({ ...f, sujet: e.target.value }))} placeholder="Ex: Relance facture {{factureRef}}" /></div>

              <TypeSelector value={tplForm.type} onChange={(v) => setTplForm((f) => ({ ...f, type: v }))} />

              {/* Context field for template AI */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Contexte pour l'IA
                  <span className="text-[10px] text-muted-foreground font-normal">(optionnel)</span>
                </Label>
                <Textarea
                  value={tplContexteAi}
                  onChange={(e) => setTplContexteAi(e.target.value)}
                  rows={2}
                  placeholder="Ex: Template pour relancer les clients avec un impayé de plus de 30 jours, ton ferme mais courtois."
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Contenu</Label>
                  <AiSuggestButton
                    loading={tplAiLoading}
                    onSuggest={handleTplAiSuggest}
                    onCancel={handleCancelTplAi}
                    disabled={!tplForm.sujet && !tplContexteAi}
                  />
                </div>
                <div className="relative">
                  <Textarea
                    value={tplForm.contenu}
                    onChange={(e) => setTplForm((f) => ({ ...f, contenu: e.target.value }))}
                    rows={6}
                    disabled={tplAiLoading}
                    className={tplAiLoading ? "opacity-80" : ""}
                    placeholder="Contenu du template ou utilisez la suggestion IA…"
                  />
                  <AiOverlay loading={tplAiLoading} />
                </div>
                <p className="text-[10px] text-muted-foreground">Variables disponibles : {"{{prenom}}"}, {"{{nom}}"}, {"{{entreprise}}"}, {"{{factureRef}}"}, {"{{montant}}"}</p>
              </div>
              <Button className="w-full" onClick={handleAddTemplate} disabled={tplAiLoading}>Créer le template</Button>
            </div>
          </DialogContent>
        </Dialog>
      </AdminPageTransition>
    </AdminLayout>
  );
}
