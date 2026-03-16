import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // --- Auth check ---
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Non autorisé" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Non autorisé" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Check role
  const { data: roleData } = await supabaseClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  const isAdmin = roleData?.role === "admin";

  // Get client email for filtering (if client role)
  let clientEmail = "";
  if (!isAdmin) {
    const { data: clientData } = await supabaseClient
      .from("clients")
      .select("email")
      .eq("user_id", user.id)
      .maybeSingle();
    clientEmail = clientData?.email || user.email || "";
  }

  // Try to get Calendly token from app_settings first (per-user config), fallback to env
  let CALENDLY_API_TOKEN = "";
  const serviceClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  const { data: settingsData } = await serviceClient
    .from("app_settings")
    .select("value")
    .eq("key", "calendly_config")
    .maybeSingle();
  
  if (settingsData?.value) {
    const val = typeof settingsData.value === "string" ? JSON.parse(settingsData.value) : settingsData.value;
    if (val.enabled && val.api_token) {
      CALENDLY_API_TOKEN = val.api_token;
    }
  }

  if (!CALENDLY_API_TOKEN) {
    CALENDLY_API_TOKEN = Deno.env.get("CALENDLY_API_TOKEN") || "";
  }

  if (!CALENDLY_API_TOKEN) {
    return new Response(
      JSON.stringify({ error: "Calendly n'est pas configuré. Rendez-vous dans Paramètres → Calendly pour ajouter votre token API." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Step 1: Get current user URI
    const meRes = await fetch("https://api.calendly.com/users/me", {
      headers: { Authorization: `Bearer ${CALENDLY_API_TOKEN}` },
    });
    if (!meRes.ok) {
      const errBody = await meRes.text();
      throw new Error(`Calendly /users/me failed [${meRes.status}]: ${errBody}`);
    }
    const meData = await meRes.json();
    const userUri = meData.resource.uri;
    const orgUri = meData.resource.current_organization;

    // Step 2: Parse query params
    const url = new URL(req.url);
    const minDate = url.searchParams.get("min_date") || new Date().toISOString();
    const maxDate = url.searchParams.get("max_date") || "";
    const status = url.searchParams.get("status") || "active";

    // Step 3: Fetch scheduled events
    const params = new URLSearchParams({
      user: userUri,
      organization: orgUri,
      min_start_time: minDate,
      status,
      count: "100",
      sort: "start_time:asc",
    });
    if (maxDate) params.set("max_start_time", maxDate);

    const eventsRes = await fetch(
      `https://api.calendly.com/scheduled_events?${params.toString()}`,
      { headers: { Authorization: `Bearer ${CALENDLY_API_TOKEN}` } }
    );
    if (!eventsRes.ok) {
      const errBody = await eventsRes.text();
      throw new Error(`Calendly events failed [${eventsRes.status}]: ${errBody}`);
    }
    const eventsData = await eventsRes.json();

    // Step 4: For each event, fetch invitees to get client names
    const allEvents = await Promise.all(
      eventsData.collection.map(async (event: any) => {
        let inviteeName = "Inconnu";
        let inviteeEmail = "";
        try {
          const invRes = await fetch(`${event.uri}/invitees`, {
            headers: { Authorization: `Bearer ${CALENDLY_API_TOKEN}` },
          });
          if (invRes.ok) {
            const invData = await invRes.json();
            if (invData.collection.length > 0) {
              inviteeName = invData.collection[0].name || "Inconnu";
              inviteeEmail = invData.collection[0].email || "";
            }
          } else {
            await invRes.text();
          }
        } catch {
          // ignore invitee fetch errors
        }

        const start = new Date(event.start_time);
        const now = new Date();
        const isCanceled = event.status === "canceled";
        const isPast = start < now && !isCanceled;

        return {
          id: event.uri,
          clientNom: inviteeName,
          clientEmail: inviteeEmail,
          date: start.toISOString().split("T")[0],
          heure: start.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Paris",
          }),
          sujet: event.name || "Rendez-vous Calendly",
          statut: isCanceled ? "annule" : isPast ? "passe" : "a_venir",
          location: event.location?.join_url || "",
        };
      })
    );

    // Step 5: Filter for clients - they only see their own appointments
    const events = isAdmin
      ? allEvents
      : allEvents.filter((e: any) => e.clientEmail.toLowerCase() === clientEmail.toLowerCase());

    return new Response(JSON.stringify({ events }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Calendly API error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
