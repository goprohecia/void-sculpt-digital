import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // Get user from token
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authErr } = await anonClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { sector, teamSize, roles } = await req.json();

    if (!sector || !roles || !Array.isArray(roles)) {
      return new Response(JSON.stringify({ error: "Missing sector or roles" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const compteId = user.id; // Admin = their own user_id

    // 1. Create roles with permissions
    for (const role of roles) {
      // Insert role
      const { data: roleData, error: roleErr } = await supabaseAdmin
        .from("roles")
        .insert({
          nom: role.label,
          description: `Rôle ${role.label} — ${sector}`,
          compte_id: compteId,
        })
        .select("id")
        .single();

      if (roleErr) {
        console.error("Error creating role:", roleErr);
        continue;
      }

      // Find permissions by code and assign them
      if (role.permissions && role.permissions.length > 0) {
        const { data: perms } = await supabaseAdmin
          .from("permissions")
          .select("id, code")
          .in("code", role.permissions);

        if (perms && perms.length > 0) {
          const permInserts = perms.map((p: any) => ({
            role_id: roleData.id,
            permission_id: p.id,
            valeur: true,
          }));
          await supabaseAdmin.from("role_permissions").insert(permInserts);
        }
      }
    }

    // 2. Set sector vocabulary (metier_vocabulaire)
    const vocabDefaults: Record<string, Record<string, string>> = {
      garages: { dossier: "Véhicule", client: "Client", devis: "Devis" },
      btp: { dossier: "Chantier", client: "Maître d'ouvrage", devis: "Devis" },
      immobilier: { dossier: "Mandat", client: "Propriétaire", devis: "Estimation" },
      "auto-ecole": { dossier: "Élève", client: "Candidat", devis: "Forfait" },
      coiffure: { dossier: "Rdv", client: "Client", devis: "Devis" },
      "cabinet-avocats": { dossier: "Affaire", client: "Client", devis: "Honoraires" },
      "expert-comptable": { dossier: "Mission", client: "Entreprise", devis: "Lettre de mission" },
    };

    const vocabMap = vocabDefaults[sector];
    if (vocabMap) {
      const vocabInserts = Object.entries(vocabMap).map(([champ, label]) => ({
        metier_id: sector,
        champ,
        label_custom: label,
        compte_id: compteId,
      }));
      await supabaseAdmin.from("metier_vocabulaire").insert(vocabInserts);
    }

    // 3. Save sector choice in app_settings
    await supabaseAdmin.from("app_settings").upsert(
      {
        key: "account_sector",
        value: JSON.stringify(sector),
        compte_id: compteId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

    await supabaseAdmin.from("app_settings").upsert(
      {
        key: "team_size",
        value: JSON.stringify(teamSize),
        compte_id: compteId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

    // 4. Set onboarding_complete
    await supabaseAdmin.from("app_settings").upsert(
      {
        key: "onboarding_complete",
        value: true,
        compte_id: compteId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-account-structure error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
