import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const LOGO_URL = "https://usulfquilneqlcyuwdof.supabase.co/storage/v1/object/public/email-assets/logo-mba.png";

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

    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) throw new Error("Accès réservé aux administrateurs");

    // Fetch admin's profile name for referral
    const { data: adminProfile } = await supabaseAdmin
      .from("profiles")
      .select("nom")
      .eq("user_id", caller.id)
      .maybeSingle();
    const adminName = adminProfile?.nom || "Votre prestataire";

    // Fetch business name from app_settings if available
    const { data: businessSetting } = await supabaseAdmin
      .from("app_settings")
      .select("value")
      .eq("key", "business_name")
      .maybeSingle();
    const businessName = (businessSetting?.value as string) || adminName;

    const { prenom, nom, email, telephone, entreprise, siret, adresse, codePostal, ville, pays } = await req.json();

    if (!prenom || !nom || !email) {
      throw new Error("Prénom, nom et email sont obligatoires");
    }
    if (!telephone) {
      throw new Error("Le téléphone est obligatoire");
    }

    const tempPassword = generatePassword();

    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { nom: `${prenom} ${nom}`, telephone: telephone || "" },
    });

    if (createError) throw new Error(`Erreur création compte : ${createError.message}`);

    const userId = userData.user.id;

    // Update client record with extra fields
    const { data: clientRows } = await supabaseAdmin
      .from("clients")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (clientRows) {
      await supabaseAdmin.from("clients").update({
        telephone: telephone || "",
        entreprise: entreprise || "",
        siret: siret || null,
        adresse: adresse || null,
        code_postal: codePostal || null,
        ville: ville || null,
        pays: pays || null,
      }).eq("id", clientRows.id);
    }

    const loginUrl = Deno.env.get("SITE_URL") || "https://impartialgames.com";

    await resend.emails.send({
      from: "Impartial <studio@impartialgames.com>",
      to: [email],
      subject: `${businessName} vous invite à rejoindre votre espace client`,
      html: buildInvitationEmail({ prenom, email, tempPassword, loginUrl, businessName, adminName }),
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

function buildInvitationEmail({
  prenom, email, tempPassword, loginUrl, businessName, adminName,
}: {
  prenom: string; email: string; tempPassword: string; loginUrl: string; businessName: string; adminName: string;
}) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <!-- Logo -->
        <tr><td style="text-align:center;padding-bottom:12px;">
          <img src="${LOGO_URL}" alt="Impartial" width="64" height="64" style="display:inline-block;border-radius:16px;" />
        </td></tr>
        <!-- Header -->
        <tr><td style="text-align:center;padding-bottom:32px;">
          <h1 style="margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px;">
            <span style="color:#a78bfa;">Im</span><span style="color:#e4e4e7;">partial</span>
          </h1>
          <p style="margin:4px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#71717a;">Studio digital</p>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#111116;border:1px solid #27272a;border-radius:16px;padding:40px 36px;">
          <!-- Welcome badge -->
          <div style="text-align:center;margin-bottom:28px;">
            <div style="display:inline-block;background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(167,139,250,0.15));border:1px solid rgba(167,139,250,0.3);border-radius:50%;width:72px;height:72px;line-height:72px;">
              <span style="font-size:36px;">🎉</span>
            </div>
          </div>

          <p style="margin:0 0 4px;font-size:13px;color:#a78bfa;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;text-align:center;">Invitation</p>
          <h2 style="margin:0 0 8px;font-size:22px;color:#fafafa;font-weight:600;text-align:center;">Bonjour ${prenom} !</h2>
          <p style="margin:0 0 28px;font-size:14px;line-height:1.7;color:#a1a1aa;text-align:center;">
            <strong style="color:#fafafa;">${businessName}</strong> vous invite à rejoindre votre espace client personnalisé. Vous y retrouverez tous les services et informations mis à votre disposition.
          </p>

          <!-- Referral badge -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(124,58,237,0.08);border:1px solid rgba(167,139,250,0.2);border-radius:10px;margin-bottom:24px;">
            <tr><td style="padding:14px 18px;">
              <p style="margin:0;font-size:13px;color:#a78bfa;line-height:1.5;">
                🔗 Vous êtes référé(e) par <strong>${adminName}</strong>. Votre espace a été configuré spécialement pour vous donner accès aux services proposés.
              </p>
            </td></tr>
          </table>

          <!-- Credentials -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;border:1px solid #1e1e2a;border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:16px;">
                    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#71717a;">Email</p>
                    <p style="margin:0;font-size:15px;color:#fafafa;font-weight:500;">${email}</p>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #1e1e2a;padding-top:16px;">
                    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#71717a;">Mot de passe provisoire</p>
                    <p style="margin:0;font-size:16px;color:#a78bfa;font-weight:700;font-family:'SF Mono','Fira Code',monospace;letter-spacing:1.5px;">${tempPassword}</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- Features summary -->
          <p style="margin:0 0 14px;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#71717a;text-align:center;">Votre espace client vous permet de</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #1e1e2a;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="36" style="vertical-align:top;"><span style="font-size:18px;">📊</span></td>
                    <td style="padding-left:8px;">
                      <p style="margin:0;font-size:14px;color:#fafafa;font-weight:500;">Suivre vos projets</p>
                      <p style="margin:2px 0 0;font-size:12px;color:#71717a;">Avancement, jalons et préviews en temps réel</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #1e1e2a;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="36" style="vertical-align:top;"><span style="font-size:18px;">📄</span></td>
                    <td style="padding-left:8px;">
                      <p style="margin:0;font-size:14px;color:#fafafa;font-weight:500;">Gérer devis & factures</p>
                      <p style="margin:2px 0 0;font-size:12px;color:#71717a;">Consulter, signer et payer en ligne</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #1e1e2a;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="36" style="vertical-align:top;"><span style="font-size:18px;">💬</span></td>
                    <td style="padding-left:8px;">
                      <p style="margin:0;font-size:14px;color:#fafafa;font-weight:500;">Échanger avec votre prestataire</p>
                      <p style="margin:2px 0 0;font-size:12px;color:#71717a;">Messagerie intégrée et support dédié</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="36" style="vertical-align:top;"><span style="font-size:18px;">📅</span></td>
                    <td style="padding-left:8px;">
                      <p style="margin:0;font-size:14px;color:#fafafa;font-weight:500;">Planifier vos rendez-vous</p>
                      <p style="margin:2px 0 0;font-size:12px;color:#71717a;">Réservation directe en ligne</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Warning -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:10px;margin-bottom:28px;">
            <tr><td style="padding:14px 18px;">
              <p style="margin:0;font-size:13px;color:#fbbf24;line-height:1.5;">
                ⚠️ Pour votre sécurité, nous vous recommandons de modifier votre mot de passe dès votre première connexion.
              </p>
            </td></tr>
          </table>

          <!-- CTA -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${loginUrl}/client/login" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#a78bfa);color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:12px;font-size:15px;font-weight:600;letter-spacing:0.3px;">
                Accéder à mon espace client →
              </a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:28px;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;color:#52525b;">Cet email a été envoyé automatiquement par ${businessName}.</p>
          <p style="margin:0 0 6px;font-size:12px;color:#52525b;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
          <p style="margin:0;font-size:11px;color:#3f3f46;">© ${new Date().getFullYear()} Impartial — Studio digital</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `;
}
