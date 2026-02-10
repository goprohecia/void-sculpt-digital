import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const { email, prenom, demandeRef, titre, statut } = await req.json();

    if (!email || !demandeRef || !titre || !statut) {
      throw new Error("Email, référence, titre et statut sont obligatoires");
    }

    const clientPrenom = prenom || "Client";
    const loginUrl = Deno.env.get("SITE_URL") || "https://impartialgames.com";
    const isValidee = statut === "validee";
    const label = isValidee ? "validée" : "refusée";
    const accentColor = isValidee ? "#22c55e" : "#ef4444";
    const icon = isValidee ? "✓" : "✕";
    const bgAccent = isValidee ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)";
    const borderAccent = isValidee ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)";

    await resend.emails.send({
      from: "Impartial <studio@impartialgames.com>",
      to: [email],
      subject: `Demande ${label} — ${demandeRef}`,
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
          <!-- Status badge -->
          <div style="text-align:center;margin-bottom:24px;">
            <div style="display:inline-block;background:${bgAccent};border:1px solid ${borderAccent};border-radius:50%;width:56px;height:56px;line-height:56px;font-size:28px;color:${accentColor};">${icon}</div>
          </div>

          <p style="margin:0 0 4px;font-size:13px;color:${accentColor};font-weight:600;text-transform:uppercase;letter-spacing:1.5px;text-align:center;">Demande ${label}</p>
          <h2 style="margin:0 0 20px;font-size:20px;color:#fafafa;font-weight:600;text-align:center;">Bonjour ${clientPrenom},</h2>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#a1a1aa;text-align:center;">
            ${isValidee
              ? "Bonne nouvelle ! Votre demande a été validée par notre équipe. Nous vous contacterons prochainement pour les prochaines étapes."
              : "Après examen, votre demande n'a malheureusement pas pu être validée. N'hésitez pas à nous contacter pour en discuter ou soumettre une nouvelle demande."}
          </p>

          <!-- Details -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;border:1px solid #1e1e2a;border-radius:12px;margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:14px;">
                    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#71717a;">Projet</p>
                    <p style="margin:0;font-size:15px;color:#fafafa;font-weight:500;">${titre}</p>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #1e1e2a;padding:14px 0;">
                    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#71717a;">Référence</p>
                    <p style="margin:0;font-size:15px;color:#fafafa;font-weight:500;font-family:'SF Mono','Fira Code',monospace;">${demandeRef}</p>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #1e1e2a;padding-top:14px;">
                    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#71717a;">Statut</p>
                    <p style="margin:0;font-size:15px;color:${accentColor};font-weight:600;">${isValidee ? "✓ Validée" : "✕ Refusée"}</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- CTA -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${loginUrl}/client/demandes" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#a78bfa);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:14px;font-weight:600;letter-spacing:0.3px;">
                Voir mes demandes →
              </a>
            </td></tr>
          </table>
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
    console.error("Error in send-demande-statut:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
