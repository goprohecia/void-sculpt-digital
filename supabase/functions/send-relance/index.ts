import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const LOGO_URL = "https://aikmzznnmyfbjbomwakq.supabase.co/storage/v1/object/public/email-assets/logo-impartial.png";

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
    const { email, prenom, factureRef, montant, dateEcheance } = await req.json();

    if (!email || !factureRef || !montant) {
      throw new Error("Email, référence facture et montant sont obligatoires");
    }

    const clientPrenom = prenom || "Client";
    const echeance = dateEcheance
      ? new Date(dateEcheance).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
      : "non spécifiée";
    const loginUrl = Deno.env.get("SITE_URL") || "https://impartialgames.com";

    await resend.emails.send({
      from: "Impartial <studio@impartialgames.com>",
      to: [email],
      subject: `Rappel — Facture ${factureRef} en attente de règlement`,
      html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
        <!-- Logo -->
        <tr><td style="text-align:center;padding-bottom:12px;">
          <img src="${LOGO_URL}" alt="Impartial" width="56" height="56" style="display:inline-block;border-radius:14px;" />
        </td></tr>
        <!-- Header -->
        <tr><td style="text-align:center;padding-bottom:32px;">
          <h1 style="margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px;">
            <span style="color:#a78bfa;">Im</span><span style="color:#e4e4e7;">partial</span>
          </h1>
          <p style="margin:4px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#71717a;">Studio digital</p>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#111116;border:1px solid #27272a;border-radius:16px;padding:36px 32px;">
          <p style="margin:0 0 4px;font-size:13px;color:#f59e0b;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;">Rappel de paiement</p>
          <h2 style="margin:0 0 20px;font-size:20px;color:#fafafa;font-weight:600;">Bonjour ${clientPrenom},</h2>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#a1a1aa;">
            Nous nous permettons de vous rappeler que la facture ci-dessous est en attente de règlement. Si le paiement a déjà été effectué, veuillez ignorer ce message.
          </p>

          <!-- Invoice details -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;border:1px solid #1e1e2a;border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:14px;">
                    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#71717a;">Référence</p>
                    <p style="margin:0;font-size:15px;color:#fafafa;font-weight:500;font-family:'SF Mono','Fira Code',monospace;">${factureRef}</p>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #1e1e2a;padding:14px 0;">
                    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#71717a;">Montant dû</p>
                    <p style="margin:0;font-size:22px;color:#f59e0b;font-weight:700;">${Number(montant).toLocaleString("fr-FR")} €</p>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #1e1e2a;padding-top:14px;">
                    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#71717a;">Échéance</p>
                    <p style="margin:0;font-size:15px;color:#fafafa;font-weight:500;">${echeance}</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- CTA -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${loginUrl}/client/factures" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#a78bfa);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:14px;font-weight:600;letter-spacing:0.3px;">
                Consulter ma facture →
              </a>
            </td></tr>
          </table>

          <p style="margin:24px 0 0;font-size:13px;color:#71717a;line-height:1.6;text-align:center;">
            En cas de question, n'hésitez pas à nous contacter via votre espace client ou par email.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:28px;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;color:#52525b;">Cet email a été envoyé automatiquement par Impartial.</p>
          <p style="margin:0 0 6px;font-size:12px;color:#52525b;">Si vous avez déjà réglé cette facture, veuillez ignorer ce message.</p>
          <p style="margin:0;font-size:11px;color:#3f3f46;">© ${new Date().getFullYear()} Impartial — Studio digital</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-relance:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
