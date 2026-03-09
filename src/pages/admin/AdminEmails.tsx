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
import { Mail, Download, Search, Plus, FileText, Send, Trash2, Pencil, Sparkles, Loader2 } from "lucide-react";
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

const typeFilters: { label: string; value: EmailLogType | "all" }[] = [
  { label: "Tous", value: "all" },
  { label: "Relance", value: "relance" },
  { label: "Devis", value: "devis" },
  { label: "Paiement", value: "paiement" },
  { label: "Demande", value: "demande" },
  { label: "Validation", value: "validation" },
];

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
  const [composeForm, setComposeForm] = useState({ destinataire: "", sujet: "", contenu: "", type: "autre" as string });
  // Template form
  const [tplForm, setTplForm] = useState({ nom: "", sujet: "", contenu: "", type: "relance" });
  // AI suggestion state
  const [aiLoading, setAiLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

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
    setComposeForm({ destinataire: "", sujet: "", contenu: "", type: "autre" });
  };

  const handleAddTemplate = () => {
    if (!tplForm.nom || !tplForm.sujet) { toast.error("Nom et sujet requis"); return; }
    addTemplate(tplForm);
    toast.success("Template créé");
    setTplOpen(false);
    setTplForm({ nom: "", sujet: "", contenu: "", type: "relance" });
  };

  const handleAiSuggest = async () => {
    if (!composeForm.destinataire && !composeForm.sujet) {
      toast.error("Renseignez au moins un destinataire ou un sujet pour la suggestion IA");
      return;
    }

    if (isDemo) {
      setComposeForm((f) => ({ ...f, contenu: "Bonjour,\n\nJe me permets de vous contacter concernant votre projet. Suite à nos échanges, je souhaitais faire un point sur l'avancement et les prochaines étapes.\n\nN'hésitez pas à me faire part de vos retours.\n\nCordialement,\nL'équipe" }));
      return;
    }

    setAiLoading(true);
    abortRef.current = new AbortController();

    // Find client info for context
    const client = clients.find((c) => c.email === composeForm.destinataire);
    const destinataireContext = client
      ? `${client.prenom} ${client.nom} (${client.entreprise || client.email})`
      : composeForm.destinataire;

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/suggest-email`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          destinataire: destinataireContext,
          sujet: composeForm.sujet,
          contexte: composeForm.type !== "autre" ? `Type d'email : ${composeForm.type}` : undefined,
        }),
        signal: abortRef.current.signal,
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erreur IA" }));
        toast.error(err.error || "Erreur lors de la suggestion");
        setAiLoading(false);
        return;
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let content = "";
      let streamDone = false;

      // Clear existing content before streaming
      setComposeForm((f) => ({ ...f, contenu: "" }));

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
            if (delta) {
              content += delta;
              setComposeForm((f) => ({ ...f, contenu: content }));
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Flush remaining
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
            if (delta) {
              content += delta;
              setComposeForm((f) => ({ ...f, contenu: content }));
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        console.error("AI suggest error:", e);
        toast.error("Erreur lors de la suggestion IA");
      }
    } finally {
      setAiLoading(false);
      abortRef.current = null;
    }
  };

  const handleCancelAi = () => {
    abortRef.current?.abort();
    setAiLoading(false);
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

        {/* Compose Dialog */}
        <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
          <DialogContent className="max-w-lg">
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
                <div className="flex items-center justify-between">
                  <Label>Contenu</Label>
                  {aiLoading ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelAi}
                      className="gap-1.5 text-xs h-7 text-destructive hover:text-destructive"
                    >
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Arrêter
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleAiSuggest}
                      disabled={!composeForm.destinataire && !composeForm.sujet}
                      className="gap-1.5 text-xs h-7 text-primary hover:text-primary disabled:opacity-40"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Suggestion IA
                    </Button>
                  )}
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
                  {aiLoading && (
                    <div className="absolute bottom-2 right-2">
                      <span className="inline-flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <Sparkles className="h-3 w-3 animate-pulse" /> Rédaction en cours…
                      </span>
                    </div>
                  )}
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

        {/* Template Dialog */}
        <Dialog open={tplOpen} onOpenChange={setTplOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouveau template</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2"><Label>Nom *</Label><Input value={tplForm.nom} onChange={(e) => setTplForm((f) => ({ ...f, nom: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Sujet *</Label><Input value={tplForm.sujet} onChange={(e) => setTplForm((f) => ({ ...f, sujet: e.target.value }))} placeholder="Ex: Relance facture {{factureRef}}" /></div>
              <div className="space-y-2"><Label>Contenu</Label><Textarea value={tplForm.contenu} onChange={(e) => setTplForm((f) => ({ ...f, contenu: e.target.value }))} rows={5} /></div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={tplForm.type} onValueChange={(v) => setTplForm((f) => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relance">Relance</SelectItem>
                    <SelectItem value="devis">Devis</SelectItem>
                    <SelectItem value="paiement">Paiement</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleAddTemplate}>Créer le template</Button>
            </div>
          </DialogContent>
        </Dialog>
      </AdminPageTransition>
    </AdminLayout>
  );
}
