import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageTransition, staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { motion } from "framer-motion";
import { LifeBuoy, Send, ArrowLeft } from "lucide-react";
import { tickets as allTickets, clients, type Ticket, type TicketStatus } from "@/data/mockData";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

type FilterStatus = "tous" | TicketStatus;

export default function AdminSupport() {
  const [tickets, setTickets] = useState(allTickets);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("tous");
  const [filterClient, setFilterClient] = useState("tous");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const filtered = tickets
    .filter((t) => filterStatus === "tous" || t.statut === filterStatus)
    .filter((t) => filterClient === "tous" || t.clientId === filterClient);

  const clientsWithTickets = [...new Set(tickets.map((t) => t.clientId))].map((id) => {
    const c = clients.find((cl) => cl.id === id);
    return { id, nom: c?.entreprise || id };
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;
    const msg = { id: `tm-admin-${Date.now()}`, contenu: newMessage.trim(), role: "admin" as const, date: new Date().toISOString().slice(0, 16).replace("T", " ") };
    const updated = tickets.map((t) => t.id === selectedTicket.id ? { ...t, messages: [...t.messages, msg], dateMiseAJour: msg.date } : t);
    setTickets(updated);
    setSelectedTicket(updated.find((t) => t.id === selectedTicket.id)!);
    setNewMessage("");
  };

  const changeStatus = (ticketId: string, newStatus: TicketStatus) => {
    const updated = tickets.map((t) => t.id === ticketId ? { ...t, statut: newStatus, dateMiseAJour: new Date().toISOString().slice(0, 16).replace("T", " ") } : t);
    setTickets(updated);
    if (selectedTicket?.id === ticketId) setSelectedTicket(updated.find((t) => t.id === ticketId)!);
  };

  const formatDate = (d: string) => {
    try { return formatDistanceToNow(new Date(d), { addSuffix: true, locale: fr }); } catch { return d; }
  };

  const statusFilters: { value: FilterStatus; label: string }[] = [
    { value: "tous", label: "Tous" },
    { value: "ouvert", label: "Ouverts" },
    { value: "en_cours", label: "En cours" },
    { value: "resolu", label: "Résolus" },
    { value: "ferme", label: "Fermés" },
  ];

  return (
    <AdminLayout>
      <AdminPageTransition>
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
          <motion.div variants={staggerItem} className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <LifeBuoy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Support</h1>
              <p className="text-sm text-muted-foreground">{tickets.length} ticket(s) au total</p>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center">
            <div className="flex gap-2 flex-wrap">
              {statusFilters.map((f) => (
                <button key={f.value} onClick={() => setFilterStatus(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === f.value ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`}>
                  {f.label}
                </button>
              ))}
            </div>
            <Select value={filterClient} onValueChange={setFilterClient}>
              <SelectTrigger className="w-44 h-8 text-xs bg-muted/30"><SelectValue placeholder="Tous les clients" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les clients</SelectItem>
                {clientsWithTickets.map((c) => <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>)}
              </SelectContent>
            </Select>
          </motion.div>

          {selectedTicket ? (
            <motion.div variants={staggerItem} className="rounded-xl border border-border/50 bg-card overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-border/50">
                <button onClick={() => setSelectedTicket(null)} className="p-1 rounded hover:bg-muted/50"><ArrowLeft className="h-4 w-4" /></button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{selectedTicket.reference} — {selectedTicket.sujet}</h3>
                  <p className="text-xs text-muted-foreground">{selectedTicket.clientNom}</p>
                  <div className="flex gap-2 mt-1">
                    <StatusBadge status={selectedTicket.statut} />
                    <StatusBadge status={selectedTicket.priorite} />
                  </div>
                </div>
                <Select value={selectedTicket.statut} onValueChange={(v) => changeStatus(selectedTicket.id, v as TicketStatus)}>
                  <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ouvert">Ouvert</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="resolu">Résolu</SelectItem>
                    <SelectItem value="ferme">Fermé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto space-y-3">
                {selectedTicket.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "admin" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-xl px-4 py-2.5 ${msg.role === "admin" ? "bg-primary/20 text-foreground" : "bg-muted/60 text-foreground"}`}>
                      <p className="text-xs font-medium mb-1 text-muted-foreground">{msg.role === "admin" ? "Vous" : selectedTicket.clientNom}</p>
                      <p className="text-sm">{msg.contenu}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{formatDate(msg.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border/50 flex gap-2">
                <Textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Répondre..." className="min-h-[60px] resize-none bg-muted/30" onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} />
                <button onClick={handleSendMessage} disabled={!newMessage.trim()} className="self-end p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={staggerItem} className="space-y-3">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">Aucun ticket trouvé</div>
              ) : (
                filtered.map((ticket) => (
                  <button key={ticket.id} onClick={() => setSelectedTicket(ticket)}
                    className="w-full text-left rounded-xl border border-border/50 bg-card p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs text-muted-foreground font-mono">{ticket.reference}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs font-medium">{ticket.clientNom}</span>
                          <StatusBadge status={ticket.statut} />
                          <StatusBadge status={ticket.priorite} />
                        </div>
                        <h3 className="text-sm font-medium truncate">{ticket.sujet}</h3>
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
    </AdminLayout>
  );
}
