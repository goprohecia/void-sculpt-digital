import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { useConversations } from "@/hooks/use-conversations";
import { useClientId } from "@/hooks/use-client-id";
import { type Conversation } from "@/data/mockData";
import { MessageSquare, Send } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageMediaUpload, MessageMediaInline } from "@/components/messaging/MessageMediaUpload";

export default function ClientMessaging() {
  const { clientId, isLoading: clientLoading } = useClientId();
  const { getConversationsByClient } = useConversations();
  const mesConversations = clientId ? getConversationsByClient(clientId) : [];
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showList, setShowList] = useState(true);

  const activeConv = selectedConv ?? mesConversations[0] ?? null;

  const handleSelectConv = (conv: Conversation) => {
    setSelectedConv(conv);
    setShowList(false);
  };

  if (clientLoading) return <ClientLayout><div className="p-8 text-center text-muted-foreground">Chargement...</div></ClientLayout>;

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div className="space-y-4" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={staggerItem}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-[hsl(200,100%,60%)]" />
              Messagerie
            </h1>
            <p className="text-muted-foreground text-sm">{mesConversations.length} conversations</p>
          </motion.div>

          {mesConversations.length === 0 ? (
            <motion.div variants={staggerItem}>
              <AdminEmptyState
                icon={MessageSquare}
                title="Aucune conversation"
                description="Vos échanges avec l'équipe apparaîtront ici."
                hint="Une conversation sera créée automatiquement lors du suivi de votre projet."
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
                  <p className="text-xs text-muted-foreground font-medium">Mes conversations</p>
                </div>
                <div className="flex-1 overflow-auto">
                  {mesConversations.map((conv) => (
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
                          <p className="text-sm font-medium truncate">{conv.sujet}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {conv.dernierMessage}
                          </span>
                          {conv.nonLus > 0 && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(200,100%,50%)] text-[9px] font-bold text-white">
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
                          className="md:hidden text-sm text-[hsl(200,100%,60%)]"
                        >
                          ← Retour
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold">{activeConv.sujet}</p>
                          <p className="text-xs text-muted-foreground">Équipe Impartial</p>
                        </div>
                      </div>

                      <div className="flex-1 overflow-auto p-4 space-y-3">
                        {activeConv.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={cn(
                              "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                              msg.role === "client"
                                ? "ml-auto bg-[hsl(200,100%,50%)]/20 text-foreground rounded-br-md"
                                : "bg-muted/40 text-foreground rounded-bl-md"
                            )}
                          >
                            <p>{msg.contenu}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{msg.date}</p>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 border-t border-border/30 flex gap-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Votre message..."
                          className="flex-1 glass-input border-0 resize-none min-h-[40px] max-h-[100px] p-2.5 text-sm"
                          rows={1}
                        />
                        <button className="glass-button p-2.5 text-[hsl(200,100%,60%)] hover:text-white hover:bg-[hsl(200,100%,50%)] transition-colors">
                          <Send className="h-4 w-4" />
                        </button>
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
    </ClientLayout>
  );
}
