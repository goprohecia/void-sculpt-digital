import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const LOGO_URL = "https://usulfquilneqlcyuwdof.supabase.co/storage/v1/object/public/email-assets/logo-mba.png";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const supabaseClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const { data: roleData } = await supabaseClient.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
  if (!roleData) {
    return new Response(JSON.stringify({ error: "Accès réservé aux administrateurs" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  try {
    const { recipients, subject, message } = await req.json();

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      throw new Error("Au moins un destinataire est requis");
    }
    if (!subject || !message) {
      throw new Error("Sujet et message sont obligatoires");
    }

    const year = new Date().getFullYear();
    let sent = 0;
    let errors: string[] = [];

    for (const r of recipients) {
      try {
        await resend.emails.send({
          from: "Impartial <studio@impartialgames.com>",
          to: [r.email],
          subject,
          html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
        <tr><td style="text-align:center;padding-bottom:12px;">
          <img src="${LOGO_URL}" alt="Impartial" width="56" height="56" style="display:inline-block;border-radius:14px;" />
        </td></tr>
        <tr><td style="text-align:center;padding-bottom:32px;">
          <h1 style="margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px;">
            <span style="color:#a78bfa;">Im</span><span style="color:#e4e4e7;">partial</span>
          </h1>
          <p style="margin:4px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#71717a;">Studio digital</p>
        </td></tr>
        <tr><td style="background:#111116;border:1px solid #27272a;border-radius:16px;padding:36px 32px;">
          <h2 style="margin:0 0 20px;font-size:20px;color:#fafafa;font-weight:600;">Bonjour ${r.prenom || ""},</h2>
          <div style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#a1a1aa;white-space:pre-line;">
            ${message}
          </div>
          <p style="margin:24px 0 0;font-size:13px;color:#71717a;line-height:1.6;text-align:center;">
            Cet email vous a été envoyé par l'équipe Impartial.
          </p>
        </td></tr>
        <tr><td style="padding-top:28px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#3f3f46;">© ${year} Impartial — Studio digital</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
        });
        sent++;
      } catch (e: any) {
        errors.push(`${r.email}: ${e.message}`);
      }
    }

    // Log emails
    const serviceClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    for (const r of recipients) {
      await serviceClient.from("email_logs").insert({
        type: "demande",
        destinataire: r.email,
        sujet: subject,
        contenu: message,
        client_id: r.clientId || null,
      });
    }

    return new Response(JSON.stringify({ success: true, sent, errors }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-bulk-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
