import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

interface Msg {
  id: string;
  contenu: string;
  role: "admin" | "client";
  date: string;
}

interface Props {
  dossierId: string;
  clientNom: string;
}

export function DossierMessages({ dossierId, clientNom }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      contenu: input.trim(),
      role: "admin",
      date: new Date().toISOString(),
    }]);
    setInput("");
    toast.success("Message envoyé");
  };

  if (messages.length === 0 && !input) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground/40 mb-3" />
        <p className="text-muted-foreground mb-3">Aucun message pour ce dossier</p>
        <div className="w-full max-w-md space-y-2">
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={`Écrire à ${clientNom}...`} rows={3} />
          <Button onClick={send} disabled={!input.trim()} className="gap-1.5"><Send className="h-4 w-4" /> Envoyer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === "admin" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] p-3 rounded-lg text-sm ${m.role === "admin" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              <p>{m.contenu}</p>
              <p className={`text-[10px] mt-1 ${m.role === "admin" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {new Date(m.date).toLocaleString("fr-FR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={`Écrire à ${clientNom}...`} rows={2} className="flex-1" onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <Button onClick={send} disabled={!input.trim()} className="self-end"><Send className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
