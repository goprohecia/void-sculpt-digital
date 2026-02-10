import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function generatePassword(length = 12): string {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
  let password = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  return password;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Non autorisé");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const callerClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) throw new Error("Non autorisé");

    // Check admin role
    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) throw new Error("Accès réservé aux administrateurs");

    const { prenom, nom, email, telephone, entreprise, siret, adresse, codePostal, ville, pays } = await req.json();

    if (!prenom || !nom || !email) {
      throw new Error("Prénom, nom et email sont obligatoires");
    }

    const tempPassword = generatePassword();

    // Create auth user
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { nom: `${prenom} ${nom}`, telephone: telephone || "" },
    });

    if (createError) throw new Error(`Erreur création compte : ${createError.message}`);

    const userId = userData.user.id;

    // Update client record to link user_id (the trigger already created client/profile/role)
    // But we need to update with additional fields the trigger didn't have
    const { data: clientRows } = await supabaseAdmin
      .from("clients")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (clientRows) {
      await supabaseAdmin.from("clients").update({
        entreprise: entreprise || "",
        siret: siret || null,
        adresse: adresse || null,
        code_postal: codePostal || null,
        ville: ville || null,
        pays: pays || null,
      }).eq("id", clientRows.id);
    }

    // Send welcome email with temp password
    const loginUrl = Deno.env.get("SITE_URL") || "https://impartialgames.com";

    await resend.emails.send({
      from: "Impartial <noreply@impartialgames.com>",
      to: [email],
      subject: "Votre compte Impartial a été créé",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0f0f14; color: #e4e4e7; padding: 40px 32px; border-radius: 16px;">
          <h1 style="color: #a78bfa; margin: 0 0 8px 0; font-size: 22px;">Bienvenue chez Impartial</h1>
          <p style="color: #a1a1aa; margin: 0 0 24px 0; font-size: 14px;">Bonjour ${prenom},</p>
          <p style="font-size: 14px; line-height: 1.6;">
            Votre espace client a été créé. Voici vos identifiants de connexion :
          </p>
          <div style="background: #1a1a24; border: 1px solid #27272a; border-radius: 10px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 8px; font-size: 13px; color: #a1a1aa;">Email</p>
            <p style="margin: 0 0 16px; font-size: 15px; font-weight: 600;">${email}</p>
            <p style="margin: 0 0 8px; font-size: 13px; color: #a1a1aa;">Mot de passe provisoire</p>
            <p style="margin: 0; font-size: 15px; font-weight: 600; font-family: monospace; letter-spacing: 1px; color: #a78bfa;">${tempPassword}</p>
          </div>
          <p style="font-size: 13px; color: #f59e0b; margin: 16px 0;">
            ⚠️ Nous vous recommandons de changer votre mot de passe dès votre première connexion.
          </p>
          <a href="${loginUrl}/client/login" style="display: inline-block; background: #7c3aed; color: white; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600; margin-top: 8px;">
            Se connecter
          </a>
          <p style="font-size: 12px; color: #52525b; margin-top: 32px; border-top: 1px solid #27272a; padding-top: 16px;">
            Cet email a été envoyé automatiquement par Impartial. Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet email.
          </p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true, userId }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in create-client-account:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
