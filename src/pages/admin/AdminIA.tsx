import { useState, useRef, useEffect } from "react";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useIsDemo } from "@/hooks/useIsDemo";
import { supabase } from "@/integrations/supabase/client";
import {
  Bot, Send, Settings2, History, Plus, Trash2, MessageSquare,
  Sparkles, Key, Brain, Loader2, AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };
type Conversation = { id: string; titre: string; provider: string; model: string; created_at: string; messages?: Msg[] };

const PROVIDERS = [
  { value: "openai", label: "OpenAI", models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"] },
  { value: "anthropic", label: "Anthropic (Claude)", models: ["claude-sonnet-4-20250514", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"] },
  { value: "mistral", label: "Mistral AI", models: ["mistral-large-latest", "mistral-medium-latest", "mistral-small-latest"] },
];

const DEMO_RESPONSES = [
  "Je suis l'assistant IA de démonstration. En production, je serai connecté au modèle que vous aurez configuré (OpenAI, Claude, Mistral…). Comment puis-je vous aider ?",
  "Voici une suggestion basée sur vos données : je peux analyser vos dossiers clients, rédiger des emails professionnels ou résumer des documents.",
  "Pour activer l'IA en production, configurez votre clé API dans l'onglet Configuration. Les conversations seront automatiquement sauvegardées.",
];

export default function AdminIA() {
  const { isDemo } = useIsDemo();
  const { toast } = useToast();

  // Config state
  const [provider, setProvider] = useState("openai");
  const [model, setModel] = useState("gpt-4o");
  const [apiKey, setApiKey] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("Tu es un assistant IA professionnel intégré dans un logiciel de gestion d'entreprise. Tu aides avec l'analyse de données, la rédaction d'emails, le résumé de dossiers et les conseils business.");

  // Chat state
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // History state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);

  // Load config from app_settings
  useEffect(() => {
    if (isDemo) return;
    (async () => {
      const { data } = await supabase.from("app_settings").select("key, value").in("key", ["ai_provider", "ai_model", "ai_api_key", "ai_system_prompt"]);
      if (data) {
        data.forEach((row: any) => {
          if (row.key === "ai_provider") setProvider(row.value as string);
          if (row.key === "ai_model") setModel(row.value as string);
          if (row.key === "ai_api_key") setApiKey(row.value as string);
          if (row.key === "ai_system_prompt") setSystemPrompt(row.value as string);
        });
      }
    })();
  }, [isDemo]);

  // Load conversations
  useEffect(() => {
    if (isDemo) {
      setConversations([
        { id: "demo-1", titre: "Analyse trimestrielle", provider: "openai", model: "gpt-4o", created_at: new Date().toISOString() },
        { id: "demo-2", titre: "Rédaction email client", provider: "anthropic", model: "claude-sonnet-4-20250514", created_at: new Date(Date.now() - 86400000).toISOString() },
      ]);
      return;
    }
    loadConversations();
  }, [isDemo]);

  const loadConversations = async () => {
    const { data } = await supabase.from("ai_conversations" as any).select("*").order("updated_at", { ascending: false });
    if (data) setConversations(data as any);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const selectedProvider = PROVIDERS.find(p => p.value === provider);

  const saveConfig = async () => {
    if (isDemo) {
      toast({ title: "Configuration sauvegardée (démo)" });
      return;
    }
    const settings = [
      { key: "ai_provider", value: provider },
      { key: "ai_model", value: model },
      { key: "ai_api_key", value: apiKey },
      { key: "ai_system_prompt", value: systemPrompt },
    ];
    for (const s of settings) {
      await (supabase as any).from("app_settings").upsert({ key: s.key, value: s.value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    }
    toast({ title: "Configuration IA sauvegardée" });
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    if (isDemo) {
      await new Promise(r => setTimeout(r, 1200));
      const demoReply = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
      setMessages(prev => [...prev, { role: "assistant", content: demoReply }]);
      setIsLoading(false);
      return;
    }

    if (!apiKey) {
      toast({ title: "Clé API manquante", description: "Configurez votre clé API dans l'onglet Configuration.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    // Stream response
    let assistantContent = "";
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages, provider, model, apiKey, systemPrompt }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Erreur API");
      }

      if (!resp.body) throw new Error("No stream body");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            // Handle OpenAI format
            const delta = parsed.choices?.[0]?.delta?.content;
            // Handle Anthropic format
            const anthropicDelta = parsed.type === "content_block_delta" ? parsed.delta?.text : null;
            const content = delta || anthropicDelta;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch { /* partial json */ }
        }
      }

      // Save to DB
      if (assistantContent && !isDemo) {
        let convId = activeConvId;
        if (!convId) {
          const titre = userMsg.content.substring(0, 50) + (userMsg.content.length > 50 ? "…" : "");
          const { data: conv } = await (supabase as any).from("ai_conversations").insert({ titre, provider, model }).select().single();
          if (conv) { convId = conv.id; setActiveConvId(conv.id); }
        } else {
          await (supabase as any).from("ai_conversations").update({ updated_at: new Date().toISOString() }).eq("id", convId);
        }
        if (convId) {
          await (supabase as any).from("ai_messages").insert([
            { conversation_id: convId, role: "user", content: userMsg.content },
            { conversation_id: convId, role: "assistant", content: assistantContent },
          ]);
          loadConversations();
        }
      }
    } catch (e: any) {
      toast({ title: "Erreur IA", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const newConversation = () => {
    setMessages([]);
    setActiveConvId(null);
  };

  const loadConversation = async (conv: Conversation) => {
    setActiveConvId(conv.id);
    if (isDemo) {
      setMessages([
        { role: "user", content: "Peux-tu m'aider avec l'analyse ?" },
        { role: "assistant", content: DEMO_RESPONSES[0] },
      ]);
      return;
    }
    const { data } = await (supabase as any).from("ai_messages").select("*").eq("conversation_id", conv.id).order("created_at");
    if (data) setMessages(data.map((m: any) => ({ role: m.role, content: m.content })));
  };

  const deleteConversation = async (id: string) => {
    if (isDemo) {
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeConvId === id) newConversation();
      return;
    }
    await (supabase as any).from("ai_conversations").delete().eq("id", id);
    if (activeConvId === id) newConversation();
    loadConversations();
  };

  return (
    <AdminPageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bot className="h-7 w-7 text-primary" />
              Intelligence Artificielle
            </h1>
            <p className="text-muted-foreground mt-1">Chat IA, configuration et historique des conversations</p>
          </div>
          {isDemo && (
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" /> Mode démo
            </Badge>
          )}
        </div>

        <Tabs defaultValue="chat" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chat" className="gap-1.5"><MessageSquare className="h-4 w-4" /> Chat</TabsTrigger>
            <TabsTrigger value="config" className="gap-1.5"><Settings2 className="h-4 w-4" /> Configuration</TabsTrigger>
            <TabsTrigger value="history" className="gap-1.5"><History className="h-4 w-4" /> Historique</TabsTrigger>
          </TabsList>

          {/* CHAT TAB */}
          <TabsContent value="chat" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 h-[calc(100vh-260px)]">
              {/* Sidebar conversations */}
              <Card className="hidden lg:flex flex-col">
                <CardHeader className="pb-2">
                  <Button onClick={newConversation} size="sm" className="w-full gap-1.5">
                    <Plus className="h-4 w-4" /> Nouvelle conversation
                  </Button>
                </CardHeader>
                <ScrollArea className="flex-1 px-3 pb-3">
                  <div className="space-y-1">
                    {conversations.map(conv => (
                      <button
                        key={conv.id}
                        onClick={() => loadConversation(conv)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors group ${
                          activeConvId === conv.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate font-medium">{conv.titre}</span>
                          <Trash2
                            className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive shrink-0"
                            onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{conv.provider} · {conv.model}</span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </Card>

              {/* Chat area */}
              <Card className="flex flex-col">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-3">
                      <Bot className="h-12 w-12 opacity-30" />
                      <div>
                        <p className="font-medium">Assistant IA</p>
                        <p className="text-sm">Posez une question pour commencer une conversation.</p>
                        <p className="text-xs mt-2 flex items-center justify-center gap-1">
                          <Brain className="h-3 w-3" />
                          {selectedProvider?.label} · {model}
                        </p>
                      </div>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}>
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:my-1">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && messages[messages.length - 1]?.role === "user" && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl px-4 py-3">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t p-3">
                  <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Écrivez votre message…"
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                  {!isDemo && !apiKey && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-2">
                      <AlertCircle className="h-3 w-3" /> Clé API non configurée — allez dans Configuration
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* CONFIG TAB */}
          <TabsContent value="config">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5" /> Fournisseur & Modèle</CardTitle>
                  <CardDescription>Choisissez votre fournisseur d'IA et configurez votre clé API</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fournisseur</label>
                    <Select value={provider} onValueChange={(v) => { setProvider(v); setModel(PROVIDERS.find(p => p.value === v)?.models[0] || ""); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PROVIDERS.map(p => (
                          <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Modèle</label>
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {selectedProvider?.models.map(m => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Clé API</label>
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={provider === "openai" ? "sk-..." : provider === "anthropic" ? "sk-ant-..." : "..."}
                    />
                    <p className="text-xs text-muted-foreground">
                      {provider === "openai" && "Obtenez votre clé sur platform.openai.com"}
                      {provider === "anthropic" && "Obtenez votre clé sur console.anthropic.com"}
                      {provider === "mistral" && "Obtenez votre clé sur console.mistral.ai"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5" /> Prompt système</CardTitle>
                  <CardDescription>Personnalisez le comportement de l'assistant IA</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={8}
                    placeholder="Ex: Tu es un assistant professionnel spécialisé en..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Ce prompt définit le rôle et le comportement de l'IA dans toutes les conversations.
                  </p>
                  <Button onClick={saveConfig} className="w-full">Sauvegarder la configuration</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* HISTORY TAB */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Historique des conversations</CardTitle>
                <CardDescription>{conversations.length} conversation(s) enregistrée(s)</CardDescription>
              </CardHeader>
              <CardContent>
                {conversations.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>Aucune conversation enregistrée</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {conversations.map(conv => (
                      <div
                        key={conv.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => { loadConversation(conv); /* switch to chat tab */ }}
                      >
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{conv.titre}</p>
                            <p className="text-xs text-muted-foreground">
                              {conv.provider} · {conv.model} · {format(new Date(conv.created_at), "d MMM yyyy à HH:mm", { locale: fr })}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost" size="icon"
                          onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPageTransition>
  );
}
