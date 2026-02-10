import { useState } from "react";
import { ClientLayout } from "@/components/admin/ClientLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { motion } from "framer-motion";
import { LifeBuoy, Plus, Send, ArrowLeft } from "lucide-react";
import { useTickets } from "@/hooks/use-tickets";
import { useClientId } from "@/hooks/use-client-id";
import { type Ticket, type TicketPriority, type TicketStatus } from "@/data/mockData";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

type FilterStatus = "tous" | TicketStatus;

export default function ClientSupport() {
  const { clientId, clientName, isLoading: clientLoading } = useClientId();
  const { getTicketsByClient } = useTickets();
  const initialTickets = clientId ? getTicketsByClient(clientId) : [];
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>("tous");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({ sujet: "", description: "", priorite: "normale" as TicketPriority });

  if (initialTickets.length > 0 && !initialized) {
    setTickets(initialTickets);
    setInitialized(true);
  }

  const filteredTickets = filter === "tous" ? tickets : tickets.filter((t) => t.statut === filter);

  const filters: { value: FilterStatus; label: string }[] = [
    { value: "tous", label: "Tous" },
    { value: "ouvert", label: "Ouverts" },
    { value: "en_cours", label: "En cours" },
    { value: "resolu", label: "Résolus" },
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;
    const msg = {
      id: `tm-new-${Date.now()}`,
      contenu: newMessage.trim(),
      role: "client" as const,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
    };
    const updated = tickets.map((t) =>
      t.id === selectedTicket.id ? { ...t, messages: [...t.messages, msg], dateMiseAJour: msg.date } : t
    );
    setTickets(updated);
    setSelectedTicket(updated.find((t) => t.id === selectedTicket.id)!);
    setNewMessage("");
  };

  const handleCreateTicket = () => {
    if (!newTicket.sujet.trim() || !newTicket.description.trim() || !clientId) return;
    const ticket: Ticket = {
      id: `tk-new-${Date.now()}`,
      reference: `TK-${String(tickets.length + 1).padStart(3, "0")}`,
      clientId,
      clientNom: clientName,
      sujet: newTicket.sujet,
      description: newTicket.description,
      priorite: newTicket.priorite,
      statut: "ouvert",
      dateCreation: new Date().toISOString().slice(0, 16).replace("T", " "),
      dateMiseAJour: new Date().toISOString().slice(0, 16).replace("T", " "),
      messages: [{ id: `tm-new-${Date.now()}`, contenu: newTicket.description, role: "client", date: new Date().toISOString().slice(0, 16).replace("T", " ") }],
    };
    setTickets((prev) => [ticket, ...prev]);
    setNewTicket({ sujet: "", description: "", priorite: "normale" });
    setShowNewTicket(false);
    toast.success("Ticket créé avec succès");
  };

  const formatDate = (d: string) => {
    try { return formatDistanceToNow(new Date(d), { addSuffix: true, locale: fr }); } catch { return d; }
  };

  if (clientLoading) return <ClientLayout><div className="p-8 text-center text-muted-foreground">Chargement...</div></ClientLayout>;

  return (
    <ClientLayout>
      <AdminPageTransition>
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
          {/* Header */}
          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[hsl(200,100%,50%)]/10">
                <LifeBuoy className="h-6 w-6 text-[hsl(200,100%,60%)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Support & Assistance</h1>
                <p className="text-sm text-muted-foreground">{tickets.length} ticket(s)</p>
              </div>
            </div>
            <button onClick={() => setShowNewTicket(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(200,100%,50%)] text-white text-sm font-medium hover:bg-[hsl(200,100%,45%)] transition-colors">
              <Plus className="h-4 w-4" /> Nouveau ticket
            </button>
          </motion.div>

          {/* Filters */}
          <motion.div variants={staggerItem} className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f.value ? "bg-[hsl(200,100%,50%)]/20 text-[hsl(200,100%,60%)] border border-[hsl(200,100%,50%)]/30" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>

          {/* Ticket list or detail */}
          {filteredTickets.length === 0 && !selectedTicket ? (
            <motion.div variants={staggerItem}>
              <AdminEmptyState
                icon={LifeBuoy}
                title="Aucun ticket"
                description="Vos demandes de support apparaîtront ici."
                hint="Cliquez sur « Nouveau ticket » pour contacter l'équipe."
              />
            </motion.div>
          ) : selectedTicket ? (
            <motion.div variants={staggerItem} className="rounded-xl border border-border/50 bg-card overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-border/50">
                <button onClick={() => setSelectedTicket(null)} className="p-1 rounded hover:bg-muted/50">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{selectedTicket.reference} — {selectedTicket.sujet}</h3>
                  <div className="flex gap-2 mt-1">
                    <StatusBadge status={selectedTicket.statut} />
                    <StatusBadge status={selectedTicket.priorite} />
                  </div>
                </div>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto space-y-3">
                {selectedTicket.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "client" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-xl px-4 py-2.5 ${msg.role === "client" ? "bg-[hsl(200,100%,50%)]/20 text-foreground" : "bg-muted/60 text-foreground"}`}>
                      <p className="text-sm">{msg.contenu}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{formatDate(msg.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
              {(selectedTicket.statut === "ouvert" || selectedTicket.statut === "en_cours") && (
                <div className="p-4 border-t border-border/50 flex gap-2">
                  <Textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Votre réponse..." className="min-h-[60px] resize-none bg-muted/30" onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} />
                  <button onClick={handleSendMessage} disabled={!newMessage.trim()} className="self-end p-2.5 rounded-lg bg-[hsl(200,100%,50%)] text-white hover:bg-[hsl(200,100%,45%)] disabled:opacity-50 transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div variants={staggerItem} className="space-y-3">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">Aucun ticket trouvé</div>
              ) : (
                filteredTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className="w-full text-left rounded-xl border border-border/50 bg-card p-4 hover:border-[hsl(200,100%,50%)]/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground font-mono">{ticket.reference}</span>
                          <StatusBadge status={ticket.statut} />
                          <StatusBadge status={ticket.priorite} />
                        </div>
                        <h3 className="text-sm font-medium truncate">{ticket.sujet}</h3>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{ticket.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[10px] text-muted-foreground">{formatDate(ticket.dateCreation)}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{ticket.messages.length} msg</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </motion.div>
          )}
        </motion.div>
      </AdminPageTransition>

      {/* New ticket dialog */}
      <Dialog open={showNewTicket} onOpenChange={setShowNewTicket}>
        <DialogContent className="bg-card border-border/50">
          <DialogHeader>
            <DialogTitle>Nouveau ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Sujet</label>
              <Input value={newTicket.sujet} onChange={(e) => setNewTicket((p) => ({ ...p, sujet: e.target.value }))} placeholder="Décrivez brièvement le problème" className="bg-muted/30" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea value={newTicket.description} onChange={(e) => setNewTicket((p) => ({ ...p, description: e.target.value }))} placeholder="Détaillez votre demande..." className="min-h-[100px] bg-muted/30" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Priorité</label>
              <Select value={newTicket.priorite} onValueChange={(v) => setNewTicket((p) => ({ ...p, priorite: v as TicketPriority }))}>
                <SelectTrigger className="bg-muted/30"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="basse">Basse</SelectItem>
                  <SelectItem value="normale">Normale</SelectItem>
                  <SelectItem value="haute">Haute</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <button onClick={handleCreateTicket} disabled={!newTicket.sujet.trim() || !newTicket.description.trim()} className="w-full py-2 rounded-lg bg-[hsl(200,100%,50%)] text-white text-sm font-medium hover:bg-[hsl(200,100%,45%)] disabled:opacity-50 transition-colors">
              Créer le ticket
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </ClientLayout>
  );
}
