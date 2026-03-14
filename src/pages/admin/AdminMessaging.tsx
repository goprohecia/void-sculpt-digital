import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { useConversations } from "@/hooks/use-conversations";
import { type Conversation } from "@/data/mockData";
import { MessageSquare, Send, Users, Plus, X } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "@/hooks/useIsDemo";
import { useClients } from "@/hooks/use-clients";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useDemoPlan } from "@/contexts/DemoPlanContext";
import { MessageMediaUpload, MessageMediaInline } from "@/components/messaging/MessageMediaUpload";

type TabType = "clients" | "salaries";

export default function AdminMessaging() {
  const { conversations } = useConversations();
  const { isDemo } = useIsDemo();
  const { clients } = useClients();
  const { getModuleLabel } = useDemoPlan();
  const queryClient = useQueryClient();
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showList, setShowList] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("clients");
  const [showNewConv, setShowNewConv] = useState(false);
  const [newConvForm, setNewConvForm] = useState({ recipientId: "", sujet: "", message: "" });
  const [creating, setCreating] = useState(false);
  const [pendingMedia, setPendingMedia] = useState<any>(null);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(0);
  const [mediaResult, setMediaResult] = useState<any>(null);
  const uploadRef = useRef<any>(null);

  // Get sector-specific labels
  const clientsLabel = getModuleLabel("clients");
  const employeesLabel = getModuleLabel("employees");

  // Fetch employees for the "salaries" tab
  const { data: employees = [] } = useQuery<any[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      if (isDemo) return [
        { id: "demo-emp-1", prenom: "Sophie", nom: "Martin", email: "sophie.martin@mba.demo", poste: "Développeuse" },
        { id: "demo-emp-2", prenom: "Lucas", nom: "Dupont", email: "lucas.dupont@mba.demo", poste: "Chef de projet" },
      ];
      const { data, error } = await (supabase as any).from("employees").select("id, prenom, nom, email, poste").eq("statut", "actif");
      if (error) throw error;
      return data || [];
    },
  });

  const activeConv = selectedConv ?? conversations[0] ?? null;

  const handleSelectConv = (conv: Conversation) => {
    setSelectedConv(conv);
    setShowList(false);
  };

  // Reset form when dialog opens based on active tab
  const handleOpenNewConv = () => {
    setNewConvForm({ recipientId: "", sujet: "", message: "" });
    setShowNewConv(true);
  };

  const handleCreateConversation = async () => {
    if (!newConvForm.recipientId || !newConvForm.sujet.trim() || !newConvForm.message.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (isDemo) {
      toast.success("Conversation créée (mode démo)");
      setShowNewConv(false);
      setNewConvForm({ recipientId: "", sujet: "", message: "" });
      return;
    }

    setCreating(true);
    try {
      if (activeTab === "clients") {
        const client = clients.find((c) => c.id === newConvForm.recipientId);
        const clientNom = client ? `${client.prenom} ${client.nom}` : "Client";

        // Create conversation
        const { data: conv, error: convError } = await supabase
          .from("conversations")
          .insert({
            client_id: newConvForm.recipientId,
            client_nom: clientNom,
            sujet: newConvForm.sujet.trim(),
            non_lus: 0,
            dernier_message: new Date().toISOString(),
          })
          .select()
          .single();

        if (convError) throw convError;

        // Create first message
        const { error: msgError } = await supabase
          .from("messages")
          .insert({
            conversation_id: conv.id,
            contenu: newConvForm.message.trim(),
            role: "admin",
            date: new Date().toISOString(),
          });

        if (msgError) throw msgError;

        // Create notification for the client
        await supabase.from("notifications").insert({
          type: "message",
          titre: "Nouveau message",
          description: `Vous avez reçu un nouveau message : ${newConvForm.sujet.trim()}`,
          destinataire: "client",
          client_id: newConvForm.recipientId,
          lien: "/client/messagerie",
          lu: false,
        });

        toast.success("Message envoyé au client");
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      } else {
        // For employees - create notification (messaging not fully implemented yet)
        const employee = employees.find((e: any) => e.id === newConvForm.recipientId);
        const empNom = employee ? `${employee.prenom} ${employee.nom}` : employeesLabel;

        // Create notification for the employee
        await supabase.from("notifications").insert({
          type: "message",
          titre: "Nouveau message de l'administration",
          description: `Sujet : ${newConvForm.sujet.trim()} - ${newConvForm.message.trim().slice(0, 100)}...`,
          destinataire: "employee",
          lien: "/employee/messagerie",
          lu: false,
        });

        toast.success(`Message envoyé à ${empNom}`);
      }

      setShowNewConv(false);
      setNewConvForm({ recipientId: "", sujet: "", message: "" });
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'envoi");
    } finally {
      setCreating(false);
    }
  };

  // Get recipient list based on active tab
  const recipients = activeTab === "clients" 
    ? clients.map((c) => ({ id: c.id, label: `${c.prenom} ${c.nom}`, sublabel: c.entreprise || c.email }))
    : employees.map((e: any) => ({ id: e.id, label: `${e.prenom} ${e.nom}`, sublabel: e.poste || e.email }));

  const recipientLabel = activeTab === "clients" ? `${clientsLabel} destinataire` : `${employeesLabel} destinataire`;
  const recipientPlaceholder = activeTab === "clients" ? `Sélectionner un ${clientsLabel.toLowerCase()}` : `Sélectionner un ${employeesLabel.toLowerCase()}`;

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-4" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2"><MessageSquare className="h-6 w-6 text-primary" /> Messagerie</h1>
              <p className="text-muted-foreground text-sm">{conversations.length} conversations {clientsLabel.toLowerCase()} · {employees.length} {employeesLabel.toLowerCase()}</p>
            </div>
            <button
              onClick={handleOpenNewConv}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Nouveau message
            </button>
          </motion.div>

          {/* Tab selector */}
          <motion.div variants={staggerItem} className="flex gap-1 p-1 rounded-lg bg-muted/20 w-fit">
            <button onClick={() => setActiveTab("clients")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "clients" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <MessageSquare className="h-3.5 w-3.5 inline mr-1.5" />{clientsLabel}
            </button>
            <button onClick={() => setActiveTab("salaries")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "salaries" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <Users className="h-3.5 w-3.5 inline mr-1.5" />{employeesLabel}
            </button>
          </motion.div>

          {activeTab === "clients" ? (
            <motion.div className="glass-card overflow-hidden flex" style={{ height: "calc(100dvh - 280px)" }} variants={staggerItem}>
              {/* Conversation list */}
              <div className={cn("w-full md:w-80 border-r border-border/30 flex flex-col overflow-hidden", !showList && "hidden md:flex")}>
                <div className="p-3 border-b border-border/30"><p className="text-xs text-muted-foreground font-medium">Conversations {clientsLabel.toLowerCase()}</p></div>
                <div className="flex-1 overflow-auto">
                  {conversations.map((conv) => (
                    <button key={conv.id} onClick={() => handleSelectConv(conv)} className={cn("w-full text-left p-3 border-b border-border/10 hover:bg-muted/20 transition-colors", activeConv?.id === conv.id && "bg-muted/30")}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{conv.clientNom}</p>
                          <p className="text-xs text-muted-foreground truncate">{conv.sujet}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">{conv.dernierMessage}</span>
                          {conv.nonLus > 0 && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{conv.nonLus}</span>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message detail */}
              <AnimatePresence mode="wait">
                <motion.div key={activeConv?.id || "empty"} className={cn("flex-1 flex flex-col", showList && "hidden md:flex")} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                  {activeConv ? (
                    <>
                      <div className="p-4 border-b border-border/30 flex items-center gap-3">
                        <button onClick={() => setShowList(true)} className="md:hidden text-sm text-primary">← Retour</button>
                        <div className="flex-1 min-w-0"><p className="text-sm font-semibold">{activeConv.clientNom}</p><p className="text-xs text-muted-foreground">{activeConv.sujet}</p></div>
                      </div>
                      <div className="flex-1 overflow-auto p-4 space-y-3">
                        {activeConv.messages.map((msg) => (
                          <div key={msg.id} className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm", msg.role === "admin" ? "ml-auto bg-primary/20 text-foreground rounded-br-md" : "bg-muted/40 text-foreground rounded-bl-md")}>
                            <p>{msg.contenu}</p>
                            <MessageMediaInline
                              mediaUrl={(msg as any).media_url}
                              mediaType={(msg as any).media_type}
                              mediaName={(msg as any).media_name}
                              mediaSize={(msg as any).media_size}
                            />
                            <p className="text-[10px] text-muted-foreground mt-1">{msg.date}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-border/30 relative">
                        <div className="flex gap-2">
                          <MessageMediaUpload
                            onMediaReady={setMediaResult}
                            pending={pendingMedia}
                            setPending={setPendingMedia}
                            uploading={mediaUploading}
                            setUploading={setMediaUploading}
                            progress={mediaProgress}
                            setProgress={setMediaProgress}
                          />
                          <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Votre message..." className="flex-1 glass-input border-0 resize-none min-h-[40px] max-h-[100px] p-2.5 text-sm" rows={1} />
                          <button
                            disabled={mediaUploading || (!replyText.trim() && !pendingMedia)}
                            onClick={async () => {
                              if (!activeConv || isDemo) { toast.info("Mode démo"); return; }
                              let media = mediaResult;
                              // Upload pending media if not yet uploaded
                              if (pendingMedia && !media) {
                                const hiddenInput = document.querySelector('[data-upload-fn]') as any;
                                if (hiddenInput?.__uploadFn) {
                                  media = await hiddenInput.__uploadFn();
                                  if (!media && !replyText.trim()) return;
                                }
                              }
                              const { error } = await supabase.from("messages").insert({
                                conversation_id: activeConv.id,
                                contenu: replyText.trim() || (media ? `📎 ${media.name}` : ""),
                                role: "admin",
                                date: new Date().toISOString(),
                                ...(media ? { media_url: media.url, media_type: media.type, media_name: media.name, media_size: media.size } : {}),
                              } as any);
                              if (error) { toast.error(error.message); return; }
                              setReplyText("");
                              setMediaResult(null);
                              setPendingMedia(null);
                              queryClient.invalidateQueries({ queryKey: ["conversations"] });
                            }}
                            className="glass-button p-2.5 text-primary hover:text-primary-foreground hover:bg-primary transition-colors disabled:opacity-50"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : conversations.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center"><AdminEmptyState icon={MessageSquare} title="Aucune conversation" description={`Les échanges avec vos ${clientsLabel.toLowerCase()} apparaîtront ici.`} /></div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Sélectionnez une conversation</div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Salaries tab */
            <motion.div className="glass-card p-6" style={{ minHeight: "calc(100dvh - 280px)" }} variants={staggerItem}>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Messagerie {employeesLabel.toLowerCase()}</h3>
              {employees.length === 0 ? (
                <AdminEmptyState icon={Users} title={`Aucun ${employeesLabel.toLowerCase()}`} description={`Ajoutez des ${employeesLabel.toLowerCase()} pour leur envoyer des messages.`} />
              ) : (
                <div className="space-y-3">
                  {employees.map((emp: any) => (
                    <div key={emp.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                      <div>
                        <p className="text-sm font-medium">{emp.prenom} {emp.nom}</p>
                        <p className="text-xs text-muted-foreground">{emp.poste || emp.email}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setNewConvForm({ recipientId: emp.id, sujet: "", message: "" });
                          setShowNewConv(true);
                        }}
                        className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors" 
                        title="Envoyer un message"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground text-center pt-4">La messagerie interne avec les {employeesLabel.toLowerCase()} sera bientôt disponible en temps réel.</p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* New conversation dialog */}
        <Dialog open={showNewConv} onOpenChange={setShowNewConv}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Nouveau message
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">{recipientLabel}</label>
                <Select value={newConvForm.recipientId || "__none__"} onValueChange={(v) => setNewConvForm((f) => ({ ...f, recipientId: v === "__none__" ? "" : v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={recipientPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">{recipientPlaceholder}</SelectItem>
                    {recipients.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.label} — {r.sublabel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sujet</label>
                <Input
                  value={newConvForm.sujet}
                  onChange={(e) => setNewConvForm((f) => ({ ...f, sujet: e.target.value }))}
                  placeholder={activeTab === "clients" ? "Ex: Suivi de votre projet" : "Ex: Information importante"}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={newConvForm.message}
                  onChange={(e) => setNewConvForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Rédigez votre message..."
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowNewConv(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
                  Annuler
                </button>
                <button
                  onClick={handleCreateConversation}
                  disabled={creating || !newConvForm.recipientId || !newConvForm.sujet.trim() || !newConvForm.message.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {creating ? "Envoi..." : "Envoyer"}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </AdminPageTransition>
    </AdminLayout>
  );
}
