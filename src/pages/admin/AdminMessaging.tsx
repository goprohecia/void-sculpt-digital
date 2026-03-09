import { useState, useMemo } from "react";
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

type TabType = "clients" | "salaries";

export default function AdminMessaging() {
  const { conversations } = useConversations();
  const { isDemo } = useIsDemo();
  const { clients } = useClients();
  const queryClient = useQueryClient();
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showList, setShowList] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("clients");
  const [showNewConv, setShowNewConv] = useState(false);
  const [newConvForm, setNewConvForm] = useState({ clientId: "", sujet: "", message: "" });
  const [creating, setCreating] = useState(false);

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

  const handleCreateConversation = async () => {
    if (!newConvForm.clientId || !newConvForm.sujet.trim() || !newConvForm.message.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (isDemo) {
      toast.success("Conversation créée (mode démo)");
      setShowNewConv(false);
      setNewConvForm({ clientId: "", sujet: "", message: "" });
      return;
    }

    setCreating(true);
    try {
      const client = clients.find((c) => c.id === newConvForm.clientId);
      const clientNom = client ? `${client.prenom} ${client.nom}` : "Client";

      // Create conversation
      const { data: conv, error: convError } = await supabase
        .from("conversations")
        .insert({
          client_id: newConvForm.clientId,
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

      toast.success("Conversation créée");
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setShowNewConv(false);
      setNewConvForm({ clientId: "", sujet: "", message: "" });
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la création");
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div className="space-y-4" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2"><MessageSquare className="h-6 w-6 text-primary" /> Messagerie</h1>
              <p className="text-muted-foreground text-sm">{conversations.length} conversations clients · {employees.length} salariés</p>
            </div>
            <button
              onClick={() => setShowNewConv(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Nouveau message
            </button>
          </motion.div>

          {/* Tab selector */}
          <motion.div variants={staggerItem} className="flex gap-1 p-1 rounded-lg bg-muted/20 w-fit">
            <button onClick={() => setActiveTab("clients")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "clients" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <MessageSquare className="h-3.5 w-3.5 inline mr-1.5" />Clients
            </button>
            <button onClick={() => setActiveTab("salaries")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "salaries" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <Users className="h-3.5 w-3.5 inline mr-1.5" />Salariés
            </button>
          </motion.div>

          {activeTab === "clients" ? (
            <motion.div className="glass-card overflow-hidden flex" style={{ height: "calc(100dvh - 280px)" }} variants={staggerItem}>
              {/* Conversation list */}
              <div className={cn("w-full md:w-80 border-r border-border/30 flex flex-col overflow-hidden", !showList && "hidden md:flex")}>
                <div className="p-3 border-b border-border/30"><p className="text-xs text-muted-foreground font-medium">Conversations clients</p></div>
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
                            <p className="text-[10px] text-muted-foreground mt-1">{msg.date}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-border/30 flex gap-2">
                        <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Votre message..." className="flex-1 glass-input border-0 resize-none min-h-[40px] max-h-[100px] p-2.5 text-sm" rows={1} />
                        <button className="glass-button p-2.5 text-primary hover:text-primary-foreground hover:bg-primary transition-colors"><Send className="h-4 w-4" /></button>
                      </div>
                    </>
                  ) : conversations.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center"><AdminEmptyState icon={MessageSquare} title="Aucune conversation" description="Les échanges avec vos clients apparaîtront ici." /></div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Sélectionnez une conversation</div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Salaries tab */
            <motion.div className="glass-card p-6" style={{ minHeight: "calc(100dvh - 280px)" }} variants={staggerItem}>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Messagerie salariés</h3>
              {employees.length === 0 ? (
                <AdminEmptyState icon={Users} title="Aucun salarié" description="Ajoutez des salariés pour leur envoyer des messages." />
              ) : (
                <div className="space-y-3">
                  {employees.map((emp: any) => (
                    <div key={emp.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                      <div>
                        <p className="text-sm font-medium">{emp.prenom} {emp.nom}</p>
                        <p className="text-xs text-muted-foreground">{emp.poste || emp.email}</p>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors" title="Envoyer un message">
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground text-center pt-4">La messagerie interne avec les salariés sera bientôt disponible en temps réel.</p>
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
                <label className="text-sm font-medium">Client destinataire</label>
                <Select value={newConvForm.clientId || "__none__"} onValueChange={(v) => setNewConvForm((f) => ({ ...f, clientId: v === "__none__" ? "" : v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Sélectionner un client</SelectItem>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.prenom} {c.nom} — {c.entreprise || c.email}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sujet</label>
                <Input
                  value={newConvForm.sujet}
                  onChange={(e) => setNewConvForm((f) => ({ ...f, sujet: e.target.value }))}
                  placeholder="Ex: Suivi de votre projet"
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
                  disabled={creating || !newConvForm.clientId || !newConvForm.sujet.trim() || !newConvForm.message.trim()}
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
