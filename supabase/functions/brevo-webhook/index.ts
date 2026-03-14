import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Brevo webhooks are unauthenticated — we use the service role to write
  const serviceClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const payload = await req.json();

    // Brevo sends single event or array
    const events = Array.isArray(payload) ? payload : [payload];

    for (const event of events) {
      const email = event.email || event["email-id"] || "";
      const eventType = event.event || event.type || "unknown";
      const campaignId = event["campaign_id"] || event.tag || null;

      // Map Brevo event types to our types
      const typeMap: Record<string, string> = {
        delivered: "delivered",
        opened: "opened",
        open: "opened",
        click: "clicked",
        clicked: "clicked",
        hard_bounce: "bounced",
        soft_bounce: "bounced",
        bounce: "bounced",
        unsubscribe: "unsubscribed",
        unsubscribed: "unsubscribed",
        spam: "complained",
        complaint: "complained",
      };

      const normalizedType = typeMap[eventType.toLowerCase()] || eventType;

      // Insert into email_events
      await serviceClient.from("email_events").insert({
        email_destinataire: email,
        type_event: normalizedType,
        campagne_id: campaignId ? String(campaignId) : null,
        metadata: event,
        date_event: event.date ? new Date(event.date).toISOString() : new Date().toISOString(),
      });

      // RGPD: Handle unsubscribe — set email_opt_out on the client
      if (normalizedType === "unsubscribed" && email) {
        await serviceClient
          .from("clients")
          .update({ email_opt_out: true })
          .eq("email", email);
      }

      // Handle bounces — also opt out to protect sender reputation
      if (normalizedType === "bounced" && email && eventType.toLowerCase() === "hard_bounce") {
        await serviceClient
          .from("clients")
          .update({ email_opt_out: true })
          .eq("email", email);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in brevo-webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
