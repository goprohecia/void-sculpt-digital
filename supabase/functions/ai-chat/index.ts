import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, provider, model, apiKey, systemPrompt } = await req.json();

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Clé API non configurée. Rendez-vous dans la configuration IA." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let url: string;
    let headers: Record<string, string>;
    let body: Record<string, unknown>;

    const allMessages = [
      { role: "system", content: systemPrompt || "Tu es un assistant IA professionnel et utile." },
      ...messages,
    ];

    if (provider === "anthropic") {
      url = "https://api.anthropic.com/v1/messages";
      headers = {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      };
      const systemMsg = allMessages.find(m => m.role === "system")?.content || "";
      const userMessages = allMessages.filter(m => m.role !== "system");
      body = {
        model: model || "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemMsg,
        messages: userMessages,
        stream: true,
      };
    } else if (provider === "gemini") {
      // Google Gemini via OpenAI-compatible endpoint
      url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
      headers = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };
      body = {
        model: model || "gemini-2.5-flash",
        messages: allMessages,
        stream: true,
      };
    } else {
      // OpenAI compatible (OpenAI, Mistral, etc.)
      url = provider === "mistral"
        ? "https://api.mistral.ai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";
      headers = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };
      body = {
        model: model || "gpt-4o",
        messages: allMessages,
        stream: true,
      };
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      return new Response(JSON.stringify({ error: `Erreur API (${response.status}): ${errorText.substring(0, 200)}` }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
