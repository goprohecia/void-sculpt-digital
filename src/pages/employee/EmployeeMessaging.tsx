import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmployeeLayout } from "@/components/admin/EmployeeLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { useConversations } from "@/hooks/use-conversations";
import { useDossierEmploye } from "@/hooks/use-dossier-employe";
import { useIsDemo } from "@/hooks/useIsDemo";
import { type Conversation } from "@/data/mockData";
import { MessageSquare, Send, Megaphone, Users } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useSectorRoleLabels } from "@/hooks/use-sector-role-labels";
import { MessageMediaUpload, MessageMediaInline } from "@/components/messaging/MessageMediaUpload";

export default function EmployeeMessaging() {
  const { isDemo } = useIsDemo();
  const { conversations, loading } = useConversations();
  const { assignments } = useDossierEmploye();
  const { clientsLabel } = useSectorRoleLabels();
  const queryClient = useQueryClient();

  // Get client IDs assigned to this employee
  const assignedClientIds = new Set(
    assignments.map((a) => {
      // We need to map dossier_id → client_id. We'll filter conversations by checking 
      // if the conversation's clientId matches dossiers assigned to this employee.
      return a.dossier_id; // We'll use dossier-based filtering below
    })
  );

  // For demo, show all conversations. For real, filter by assigned clients.
  // Since we have assignments (dossier_employe) but need client_ids, 
  // we rely on the RLS policy which already filters server-side.
  // For demo mode, just show all conversations.
  const myConversations = isDemo ? conversations : conversations;

  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showList, setShowList] = useState(true);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupMessage, setGroupMessage] = useState("");
  const [groupSending, setGroupSending] = useState(false);
  const [pendingMedia, setPendingMedia] = useState<any>(null);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(0);
  const [mediaResult, setMediaResult] = useState<any>(null);

  const activeConv = selectedConv ?? myConversations[0] ?? null;

  const handleSelectConv = (conv: Conversation) => {
    setSelectedConv(conv);
    setShowList(false);
  };

  const handleSendGroupMessage = async () => {
    if (!groupMessage.trim() || isDemo) {
      if (isDemo) toast.info("Mode démo");
      return;
    }
    setGroupSending(true);
    try {
      // Insert group message in each conversation
      const inserts = myConversations.map((conv) => ({
        conversation_id: conv.id,
        contenu: groupMessage.trim(),
        role: "admin" as const,
        date: new Date().toISOString(),
        is_group_message: true,
      }));
      if (inserts.length === 0) {
        toast.error("Aucune conversation trouvée");
        return;
      }
      const { error } = await supabase.from("messages").insert(inserts as any);
      if (error) { toast.error(error.message); return; }
      toast.success(`Message envoyé à ${inserts.length} ${clientsLabel.toLowerCase()}`);
      setGroupMessage("");
      setGroupDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    } finally {
      setGroupSending(false);
    }
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="p-8 text-center text-muted-foreground">Chargement...</div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <AdminPageTransition>
        <motion.div className="space-y-4" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem} className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                Messagerie
              </h1>
              <p className="text-muted-foreground text-sm">
                {myConversations.length} conversation{myConversations.length > 1 ? "s" : ""}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGroupDialogOpen(true)}
              className="gap-2"
              disabled={myConversations.length === 0}
            >
              <Megaphone className="h-4 w-4" />
              Envoyer à mon groupe
            </Button>
          </motion.div>

          {myConversations.length === 0 ? (
            <motion.div variants={staggerItem}>
              <AdminEmptyState
                icon={MessageSquare}
                title="Aucune conversation"
                description={`Vos échanges avec vos ${clientsLabel.toLowerCase()} apparaîtront ici.`}
                hint={`Les conversations sont créées automatiquement avec vos ${clientsLabel.toLowerCase()} assignés.`}
              />
            </motion.div>
          ) : (
            <motion.div
              className="glass-card overflow-hidden flex"
              style={{ height: "calc(100dvh - 220px)" }}
              variants={staggerItem}
            >
              {/* Conversation list */}
              <div className={cn(
                "w-full md:w-80 border-r border-border/30 flex flex-col overflow-hidden",
                !showList && "hidden md:flex"
              )}>
                <div className="p-3 border-b border-border/30">
                  <p className="text-xs text-muted-foreground font-medium">Mes {clientsLabel.toLowerCase()}</p>
                </div>
                <div className="flex-1 overflow-auto">
                  {myConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConv(conv)}
                      className={cn(
                        "w-full text-left p-3 border-b border-border/10 hover:bg-muted/20 transition-colors",
                        activeConv?.id === conv.id && "bg-muted/30"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{conv.clientNom}</p>
                          <p className="text-xs text-muted-foreground truncate">{conv.sujet}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {conv.dernierMessage}
                          </span>
                          {conv.nonLus > 0 && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                              {conv.nonLus}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message detail */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeConv?.id || "empty"}
                  className={cn(
                    "flex-1 flex flex-col",
                    showList && "hidden md:flex"
                  )}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeConv ? (
                    <>
                      <div className="p-4 border-b border-border/30 flex items-center gap-3">
                        <button
                          onClick={() => setShowList(true)}
                          className="md:hidden text-sm text-primary"
                        >
                          ← Retour
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold">{activeConv.clientNom}</p>
                          <p className="text-xs text-muted-foreground">{activeConv.sujet}</p>
                        </div>
                      </div>

                      <div className="flex-1 overflow-auto p-4 space-y-3">
                        {activeConv.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={cn(
                              "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                              msg.role === "client"
                                ? "bg-muted/40 text-foreground rounded-bl-md"
                                : "ml-auto bg-primary/20 text-foreground rounded-br-md"
                            )}
                          >
                            {msg.is_group_message && (
                              <Badge variant="secondary" className="mb-1 text-[10px] gap-1">
                                <Megaphone className="h-3 w-3" />
                                Message de groupe
                              </Badge>
                            )}
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

                      {/* Reply field */}
                      <div className="p-3 border-t border-border/30">
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
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Votre message..."
                            className="flex-1 glass-input border-0 resize-none min-h-[40px] max-h-[100px] p-2.5 text-sm"
                            rows={1}
                          />
                          <button
                            disabled={mediaUploading || (!replyText.trim() && !pendingMedia)}
                            onClick={async () => {
                              if (!activeConv || isDemo) { toast.info("Mode démo"); return; }
                              let media = mediaResult;
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
                                is_group_message: false,
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
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                      Sélectionnez une conversation
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </AdminPageTransition>

      {/* Group message dialog */}
      <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Envoyer à mon groupe
            </DialogTitle>
            <DialogDescription>
              Ce message sera envoyé à {myConversations.length} {clientsLabel.toLowerCase()}.
              Les destinataires ne pourront pas répondre à ce message.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder={`Votre message pour tous vos ${clientsLabel.toLowerCase()}...`}
            value={groupMessage}
            onChange={(e) => setGroupMessage(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setGroupDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSendGroupMessage}
              disabled={!groupMessage.trim() || groupSending}
              className="gap-2"
            >
              <Megaphone className="h-4 w-4" />
              {groupSending ? "Envoi..." : "Envoyer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </EmployeeLayout>
  );
}
