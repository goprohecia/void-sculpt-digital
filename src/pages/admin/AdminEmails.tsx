import { useState, useMemo, useRef, useCallback } from "react";
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
import { useTags, useClientTags } from "@/hooks/use-produits";
import {
  Mail, Download, Search, Plus, FileText, Send, Trash2, Sparkles, Loader2,
  Paperclip, X, Users, Filter, ShieldCheck, CalendarDays, CheckCircle,
} from "lucide-react";
import { AIContextButton } from "@/components/admin/AIContextButton";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
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

const ACCEPTED_FORMATS = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.mp4";
const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25 MB

interface Attachment {
  name: string;
  size: number;
  url: string;
  path: string;
}

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
  const { tags } = useTags();
  const { clientTags: allClientTags } = useClientTags();

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
  const [tplContexteAi, setTplContexteAi] = useState("");

  // ── Attachments state ──
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Mass email state ──
  const [massOpen, setMassOpen] = useState(false);
  const [massSubject, setMassSubject] = useState("");
  const [massMessage, setMassMessage] = useState("");
  const [massSending, setMassSending] = useState(false);
  const [massConfirmOpen, setMassConfirmOpen] = useState(false);
  const [massFilterStatut, setMassFilterStatut] = useState<string[]>(["actif"]);
  const [massFilterTagId, setMassFilterTagId] = useState<string | null>(null);
  const [massFilterDateAfter, setMassFilterDateAfter] = useState("");
  const [massAttachments, setMassAttachments] = useState<Attachment[]>([]);
  const [massUploading, setMassUploading] = useState(false);
  const [massUploadProgress, setMassUploadProgress] = useState(0);
  const massFileInputRef = useRef<HTMLInputElement>(null);

  // All available types
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
    if (allTypes.some((t) => t.value === trimmed)) { toast.error("Ce type existe déjà"); return; }
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

  // ── Mass email filtered recipients ──
  const massRecipients = useMemo(() => {
    let list = clients.filter((c) => !c.emailOptOut);
    if (massFilterStatut.length > 0) {
      list = list.filter((c) => massFilterStatut.includes(c.statut));
    }
    if (massFilterTagId) {
      const taggedClientIds = new Set(
        allClientTags.filter((ct: any) => ct.tag_id === massFilterTagId).map((ct: any) => ct.client_id)
      );
      list = list.filter((c) => taggedClientIds.has(c.id));
    }
    if (massFilterDateAfter) {
      list = list.filter((c) => c.dateCreation >= massFilterDateAfter);
    }
    return list;
  }, [clients, massFilterStatut, massFilterTagId, massFilterDateAfter, allClientTags]);

  // ── Upload attachment helper ──
  const handleUploadAttachment = useCallback(async (
    files: FileList | null,
    currentAttachments: Attachment[],
    setAtt: (fn: (prev: Attachment[]) => Attachment[]) => void,
    setProgress: (n: number) => void,
    setUploadingState: (b: boolean) => void,
  ) => {
    if (!files || files.length === 0) return;

    const currentTotal = currentAttachments.reduce((s, a) => s + a.size, 0);
    const newTotal = Array.from(files).reduce((s, f) => s + f.size, 0);
    if (currentTotal + newTotal > MAX_TOTAL_SIZE) {
      toast.error("La taille totale des pièces jointes dépasse 25 Mo");
      return;
    }

    setUploadingState(true);
    const uploaded: Attachment[] = [];
    const total = files.length;

    for (let i = 0; i < total; i++) {
      const file = files[i];
      setProgress(Math.round(((i) / total) * 100));
      const path = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("email-attachments").upload(path, file);
      if (error) {
        toast.error(`Erreur upload ${file.name}: ${error.message}`);
        continue;
      }
      const { data: urlData } = supabase.storage.from("email-attachments").getPublicUrl(path);
      uploaded.push({ name: file.name, size: file.size, url: urlData.publicUrl, path });
    }

    setProgress(100);
    setAtt((prev) => [...prev, ...uploaded]);
    setUploadingState(false);
    setProgress(0);
  }, []);

  const removeAttachment = useCallback(async (att: Attachment, setAtt: (fn: (prev: Attachment[]) => Attachment[]) => void) => {
    await supabase.storage.from("email-attachments").remove([att.path]);
    setAtt((prev) => prev.filter((a) => a.path !== att.path));
  }, []);

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
        const client = clients.find((c) => c.email === composeForm.destinataire);
        await supabase.functions.invoke("send-campaign-email", {
          body: {
            recipients: [{ email: composeForm.destinataire, prenom: client?.prenom, clientId: client?.id }],
            subject: composeForm.sujet,
            message: composeForm.contenu,
            attachments: attachments.length > 0 ? attachments.map((a) => ({ name: a.name, url: a.url })) : undefined,
          },
        });
      } catch (e) { console.error("Erreur envoi:", e); }
    }

    toast.success("Email envoyé");
    setComposeOpen(false);
    setComposeForm({ destinataire: "", sujet: "", contenu: "", type: "autre", contexteAi: "" });
    setAttachments([]);
  };

  // ── Mass email send ──
  const handleMassSend = async () => {
    if (!massSubject.trim() || !massMessage.trim()) { toast.error("Sujet et message requis"); return; }
    setMassConfirmOpen(false);
    setMassSending(true);

    try {
      const recipients = massRecipients.map((c) => ({ email: c.email, prenom: c.prenom, clientId: c.id }));
      const { data, error } = await supabase.functions.invoke("send-campaign-email", {
        body: {
          recipients,
          subject: massSubject,
          message: massMessage,
          attachments: massAttachments.length > 0 ? massAttachments.map((a) => ({ name: a.name, url: a.url })) : undefined,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const provider = data?.provider === "brevo" ? "Brevo" : "Resend";
      toast.success(`${data?.sent || recipients.length} email(s) envoyé(s) via ${provider}${data?.skipped ? ` · ${data.skipped} désinscrit(s) exclus` : ""}`);
      setMassOpen(false);
      setMassSubject("");
      setMassMessage("");
      setMassAttachments([]);
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de l'envoi");
    } finally {
      setMassSending(false);
    }
  };

  const handleAddTemplate = () => {
    if (!tplForm.nom || !tplForm.sujet) { toast.error("Nom et sujet requis"); return; }
    addTemplate(tplForm);
    toast.success("Template créé");
    setTplOpen(false);
    setTplForm({ nom: "", sujet: "", contenu: "", type: "relance" });
    setTplContexteAi("");
  };

  // ── Compose AI ──
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
    const destinataireContext = client ? `${client.prenom} ${client.nom} (${client.entreprise || client.email})` : composeForm.destinataire;
    const contextParts: string[] = [];
    if (composeForm.type && composeForm.type !== "autre") contextParts.push(`Type d'email : ${composeForm.type}`);
    if (composeForm.contexteAi.trim()) contextParts.push(composeForm.contexteAi.trim());
    setComposeForm((f) => ({ ...f, contenu: "" }));
    try {
      await streamAiSuggest({
        destinataire: destinataireContext, sujet: composeForm.sujet,
        contexte: contextParts.length > 0 ? contextParts.join(". ") : undefined,
        signal: abortRef.current.signal,
        onDelta: (full) => setComposeForm((f) => ({ ...f, contenu: full })),
      });
    } catch (e: any) {
      if (e.name !== "AbortError") { console.error("AI suggest error:", e); toast.error(e.message || "Erreur IA"); }
    } finally { setAiLoading(false); abortRef.current = null; }
  };

  // ── Template AI ──
  const handleTplAiSuggest = async () => {
    if (!tplForm.sujet && !tplContexteAi) { toast.error("Renseignez un sujet ou un contexte"); return; }
    if (isDemo) {
      setTplForm((f) => ({ ...f, contenu: "Bonjour {{prenom}},\n\nNous revenons vers vous concernant {{sujet}}.\n\nCordialement,\nL'équipe" }));
      return;
    }
    setTplAiLoading(true);
    tplAbortRef.current = new AbortController();
    const contextParts: string[] = [];
    contextParts.push(`Ceci est un template d'email réutilisable de type "${tplForm.type}"`);
    contextParts.push("Variables: {{prenom}}, {{nom}}, {{entreprise}}, {{factureRef}}, {{montant}}");
    if (tplContexteAi.trim()) contextParts.push(tplContexteAi.trim());
    setTplForm((f) => ({ ...f, contenu: "" }));
    try {
      await streamAiSuggest({
        sujet: tplForm.sujet, contexte: contextParts.join(". "),
        signal: tplAbortRef.current.signal,
        onDelta: (full) => setTplForm((f) => ({ ...f, contenu: full })),
      });
    } catch (e: any) {
      if (e.name !== "AbortError") { console.error(e); toast.error(e.message || "Erreur IA"); }
    } finally { setTplAiLoading(false); tplAbortRef.current = null; }
  };

  const handleCancelAi = () => { abortRef.current?.abort(); setAiLoading(false); };
  const handleCancelTplAi = () => { tplAbortRef.current?.abort(); setTplAiLoading(false); };

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

  const AiOverlay = ({ loading }: { loading: boolean }) =>
    loading ? (
      <div className="absolute bottom-2 right-2">
        <span className="inline-flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          <Sparkles className="h-3 w-3 animate-pulse" /> Rédaction en cours…
        </span>
      </div>
    ) : null;

  const renderTypeSelector = (value: string, onChange: (v: string) => void) => (
    <div className="space-y-2">
      <Label>Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {allTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Input value={newCustomType} onChange={(e) => setNewCustomType(e.target.value)} placeholder="Nouveau type…" className="h-8 text-xs"
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddCustomType(); } }} />
        <Button type="button" size="sm" variant="outline" onClick={handleAddCustomType} disabled={!newCustomType.trim()} className="h-8 text-xs px-3">
          <Plus className="h-3 w-3 mr-1" /> Ajouter
        </Button>
      </div>
    </div>
  );

  // ── Attachment UI block ──
  const renderAttachments = (
    atts: Attachment[],
    setAtts: (fn: (prev: Attachment[]) => Attachment[]) => void,
    isUploading: boolean,
    progress: number,
    inputRef: React.RefObject<HTMLInputElement>,
    onUpload: (files: FileList | null) => void,
  ) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5"><Paperclip className="h-3.5 w-3.5" /> Pièces jointes</Label>
        <Button type="button" size="sm" variant="outline" className="h-7 text-xs gap-1"
          onClick={() => inputRef.current?.click()} disabled={isUploading}>
          <Plus className="h-3 w-3" /> Ajouter
        </Button>
        <input ref={inputRef} type="file" accept={ACCEPTED_FORMATS} multiple className="hidden"
          onChange={(e) => onUpload(e.target.files)} />
      </div>
      {isUploading && <Progress value={progress} className="h-1.5" />}
      {atts.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {atts.map((a) => (
            <Badge key={a.path} variant="secondary" className="text-xs gap-1 pr-1">
              <Paperclip className="h-3 w-3" />
              {a.name} ({(a.size / 1024).toFixed(0)} Ko)
              <button onClick={() => removeAttachment(a, setAtts)} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <span className="text-[10px] text-muted-foreground self-center">
            {(atts.reduce((s, a) => s + a.size, 0) / 1024 / 1024).toFixed(1)} / 25 Mo
          </span>
        </div>
      )}
    </div>
  );

  // ── Statut toggle for mass filter ──
  const toggleStatut = (val: string) => {
    setMassFilterStatut((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );
  };

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
                context={`email - ${emailLogs.length} emails envoyés, ${templates.length} templates disponibles.`}
                prompt="Suggère un email professionnel à envoyer basé sur le contexte actuel."
              />
              <Button onClick={() => setMassOpen(true)} variant="outline" size="sm" className="gap-1">
                <Users className="h-4 w-4" /> Envoi de masse
              </Button>
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
          <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[85dvh] overflow-y-auto">
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

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" /> Contexte IA <span className="text-[10px] text-muted-foreground font-normal">(optionnel)</span></Label>
                <Textarea value={composeForm.contexteAi} onChange={(e) => setComposeForm((f) => ({ ...f, contexteAi: e.target.value }))} rows={2} placeholder="Ex: Le client a un retard de paiement…" className="text-sm" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Contenu</Label>
                  <AiSuggestButton loading={aiLoading} onSuggest={handleAiSuggest} onCancel={handleCancelAi}
                    disabled={!composeForm.destinataire && !composeForm.sujet && !composeForm.contexteAi} />
                </div>
                <div className="relative">
                  <Textarea value={composeForm.contenu} onChange={(e) => setComposeForm((f) => ({ ...f, contenu: e.target.value }))} rows={6} disabled={aiLoading} className={aiLoading ? "opacity-80" : ""} placeholder="Rédigez votre email ou utilisez la suggestion IA…" />
                  <AiOverlay loading={aiLoading} />
                </div>
              </div>

              {/* Attachments */}
              {renderAttachments(
                attachments, setAttachments, uploading, uploadProgress, fileInputRef as any,
                (files) => handleUploadAttachment(files, attachments, setAttachments, setUploadProgress, setUploading)
              )}

              {templates.length > 0 && (
                <div className="space-y-2">
                  <Label>Utiliser un template</Label>
                  <Select onValueChange={(v) => { const tpl = templates.find((t) => t.id === v); if (tpl) setComposeForm((f) => ({ ...f, sujet: tpl.sujet, contenu: tpl.contenu })); }}>
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
          <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[85dvh] overflow-y-auto">
            <DialogHeader><DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Nouveau template</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2"><Label>Nom *</Label><Input value={tplForm.nom} onChange={(e) => setTplForm((f) => ({ ...f, nom: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Sujet *</Label><Input value={tplForm.sujet} onChange={(e) => setTplForm((f) => ({ ...f, sujet: e.target.value }))} placeholder="Ex: Relance facture {{factureRef}}" /></div>
              {renderTypeSelector(tplForm.type, (v) => setTplForm((f) => ({ ...f, type: v })))}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" /> Contexte IA <span className="text-[10px] text-muted-foreground font-normal">(optionnel)</span></Label>
                <Textarea value={tplContexteAi} onChange={(e) => setTplContexteAi(e.target.value)} rows={2} placeholder="Ex: Template pour relances impayés…" className="text-sm" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Contenu</Label>
                  <AiSuggestButton loading={tplAiLoading} onSuggest={handleTplAiSuggest} onCancel={handleCancelTplAi} disabled={!tplForm.sujet && !tplContexteAi} />
                </div>
                <div className="relative">
                  <Textarea value={tplForm.contenu} onChange={(e) => setTplForm((f) => ({ ...f, contenu: e.target.value }))} rows={6} disabled={tplAiLoading} className={tplAiLoading ? "opacity-80" : ""} placeholder="Contenu ou suggestion IA…" />
                  <AiOverlay loading={tplAiLoading} />
                </div>
                <p className="text-[10px] text-muted-foreground">Variables : {"{{prenom}}"}, {"{{nom}}"}, {"{{entreprise}}"}, {"{{factureRef}}"}, {"{{montant}}"}</p>
              </div>
              <Button className="w-full" onClick={handleAddTemplate} disabled={tplAiLoading}>Créer le template</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Mass Email Dialog ── */}
        <Dialog open={massOpen} onOpenChange={setMassOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[85dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Envoi de masse</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 pt-2">
              {/* RGPD Badge */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <p className="text-xs text-emerald-300">
                  ✓ Lien de désinscription RGPD inclus automatiquement · Les clients désinscrits sont exclus
                </p>
              </div>

              {/* Filters */}
              <div className="glass-card p-4 space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-1.5"><Filter className="h-4 w-4 text-primary" /> Filtrer les destinataires</h3>

                <div className="grid sm:grid-cols-3 gap-4">
                  {/* Statut filter */}
                  <div className="space-y-2">
                    <Label className="text-xs">Statut</Label>
                    <div className="space-y-1.5">
                      {["prospect", "actif", "inactif"].map((s) => (
                        <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                          <Checkbox checked={massFilterStatut.includes(s)} onCheckedChange={() => toggleStatut(s)} />
                          <span className="capitalize">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tag filter */}
                  <div className="space-y-2">
                    <Label className="text-xs">Tag</Label>
                    <Select value={massFilterTagId || "all"} onValueChange={(v) => setMassFilterTagId(v === "all" ? null : v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Tous" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les tags</SelectItem>
                        {tags.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.nom}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date filter */}
                  <div className="space-y-2">
                    <Label className="text-xs flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Client depuis</Label>
                    <Input type="date" value={massFilterDateAfter} onChange={(e) => setMassFilterDateAfter(e.target.value)} className="h-8 text-xs" />
                  </div>
                </div>

                {/* Recipient counter */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{massRecipients.length} destinataire{massRecipients.length !== 1 ? "s" : ""}</span>
                    <span className="text-xs text-muted-foreground">(email_opt_out exclus)</span>
                  </div>
                  {massRecipients.length >= 6 && (
                    <Badge variant="outline" className="text-[10px]">→ Brevo (masse)</Badge>
                  )}
                  {massRecipients.length > 0 && massRecipients.length < 6 && (
                    <Badge variant="outline" className="text-[10px]">→ Resend</Badge>
                  )}
                </div>

                {/* Preview first 5 */}
                {massRecipients.length > 0 && (
                  <div className="text-xs space-y-1">
                    <p className="text-muted-foreground">Aperçu :</p>
                    {massRecipients.slice(0, 5).map((c) => (
                      <p key={c.id} className="text-foreground">{c.prenom} {c.nom} — {c.email}</p>
                    ))}
                    {massRecipients.length > 5 && (
                      <p className="text-muted-foreground">… et {massRecipients.length - 5} autre{massRecipients.length - 5 > 1 ? "s" : ""}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2"><Label>Sujet *</Label><Input value={massSubject} onChange={(e) => setMassSubject(e.target.value)} /></div>
              <div className="space-y-2"><Label>Message *</Label><Textarea value={massMessage} onChange={(e) => setMassMessage(e.target.value)} rows={6} placeholder="Contenu de l'email…" /></div>

              {/* Mass attachments */}
              {renderAttachments(
                massAttachments, setMassAttachments, massUploading, massUploadProgress, massFileInputRef as any,
                (files) => handleUploadAttachment(files, massAttachments, setMassAttachments, setMassUploadProgress, setMassUploading)
              )}

              <Button className="w-full gap-2" disabled={massSending || !massSubject.trim() || !massMessage.trim() || massRecipients.length === 0}
                onClick={() => setMassConfirmOpen(true)}>
                <Send className="h-4 w-4" /> {massSending ? "Envoi en cours…" : `Envoyer à ${massRecipients.length} personne${massRecipients.length !== 1 ? "s" : ""}`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Mass confirm dialog ── */}
        <Dialog open={massConfirmOpen} onOpenChange={setMassConfirmOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Confirmer l'envoi</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Vous êtes sur le point d'envoyer un email à <span className="font-semibold text-foreground">{massRecipients.length} destinataire{massRecipients.length !== 1 ? "s" : ""}</span>.
              {massRecipients.length >= 6 && " L'envoi sera routé via Brevo."}
            </p>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setMassConfirmOpen(false)}>Annuler</Button>
              <Button onClick={handleMassSend} disabled={massSending} className="gap-1.5">
                {massSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Confirmer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminPageTransition>
    </AdminLayout>
  );
}
