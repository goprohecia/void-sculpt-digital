import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

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

  try {
    const { email, password, nom, telephone } = await req.json();

    if (!email || !password || !nom) {
      throw new Error("Email, mot de passe et nom sont requis");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Format d'email invalide");
    }

    if (password.length < 6) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Create user without auto-confirming email
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { nom: nom.trim(), telephone: telephone?.trim() || "" },
    });

    if (createError) {
      if (createError.message.includes("already been registered")) {
        throw new Error("Un compte existe déjà avec cet email");
      }
      throw new Error(createError.message);
    }

    const siteUrl = Deno.env.get("SITE_URL") || "https://impartialgames.com";

    // Generate email confirmation link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "signup",
      email,
      password,
      options: {
        redirectTo: `${siteUrl}/client/login`,
      },
    });

    if (linkError) {
      console.error("generateLink error:", linkError.message);
      throw new Error("Erreur lors de la génération du lien de confirmation");
    }

    const actionLink = linkData.properties?.action_link;
    if (!actionLink) {
      console.error("No action_link returned");
      throw new Error("Erreur lors de la génération du lien de confirmation");
    }

    const prenom = nom.trim().split(" ")[0];

    await resend.emails.send({
      from: "Impartial <studio@impartialgames.com>",
      to: [email],
      subject: "Confirmez votre inscription — Impartial",
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
          <!-- Icon -->
          <div style="text-align:center;margin-bottom:24px;">
            <div style="display:inline-block;background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(167,139,250,0.15));border:1px solid rgba(167,139,250,0.3);border-radius:50%;width:56px;height:56px;line-height:56px;font-size:28px;">✉️</div>
          </div>

          <p style="margin:0 0 4px;font-size:13px;color:#a78bfa;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;text-align:center;">Confirmation</p>
          <h2 style="margin:0 0 8px;font-size:20px;color:#fafafa;font-weight:600;text-align:center;">Bienvenue ${prenom} !</h2>
          <p style="margin:0 0 28px;font-size:14px;line-height:1.7;color:#a1a1aa;text-align:center;">
            Merci de vous être inscrit sur Impartial. Veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous.
          </p>

          <!-- CTA -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td align="center">
              <a href="${actionLink}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#a78bfa);color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:12px;font-size:15px;font-weight:600;letter-spacing:0.3px;">
                Confirmer mon email →
              </a>
            </td></tr>
          </table>

          <!-- Warning -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:10px;margin-bottom:24px;">
            <tr><td style="padding:14px 18px;">
              <p style="margin:0;font-size:13px;color:#fbbf24;line-height:1.5;">
                ⚠️ Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte, ignorez simplement cet email.
              </p>
            </td></tr>
          </table>

          <p style="margin:0;font-size:12px;color:#71717a;line-height:1.6;text-align:center;">
            Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur&nbsp;:<br/>
            <a href="${actionLink}" style="color:#a78bfa;word-break:break-all;font-size:11px;">${actionLink}</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:28px;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;color:#52525b;">Cet email a été envoyé automatiquement par Impartial.</p>
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
    console.error("Error in send-signup-confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
