import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const LOGO_URL = "https://usulfquilneqlcyuwdof.supabase.co/storage/v1/object/public/email-assets/logo-mba.png";
const MASS_THRESHOLD = 6;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function getBrevoConfig(serviceClient: any, compteId: string | null) {
  if (!compteId) return null;
  const { data } = await serviceClient
    .from("app_settings")
    .select("value")
    .eq("key", "brevo_config")
    .eq("compte_id", compteId)
    .maybeSingle();
  if (!data?.value) return null;
  const config = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
  if (!config.enabled || !config.api_key) return null;
  return config;
}

async function sendViaBrevo(
  brevoConfig: any,
  recipient: { email: string; prenom?: string },
  subject: string,
  htmlContent: string,
  tags?: string[],
  attachments?: { name: string; url: string }[]
) {
  const body: any = {
    sender: { name: brevoConfig.sender_name, email: brevoConfig.sender_email },
    to: [{ email: recipient.email, name: recipient.prenom || "" }],
    subject,
    htmlContent,
  };
  if (tags?.length) body.tags = tags;
  body.headers = { "List-Unsubscribe": `<mailto:${brevoConfig.sender_email}?subject=unsubscribe>` };

  if (attachments?.length) {
    body.attachment = attachments.map((a) => ({ url: a.url, name: a.name }));
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": brevoConfig.api_key,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo API error [${res.status}]: ${err}`);
  }
  return await res.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

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

  const { data: roleData } = await supabaseClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!roleData) {
    return new Response(JSON.stringify({ error: "Accès réservé aux administrateurs" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const serviceClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { recipients, subject, message, test, tags, attachments } = await req.json();

    // Get Brevo config
    const brevoConfig = await getBrevoConfig(serviceClient, user.id);

    // Test mode
    if (test) {
      if (!brevoConfig) {
        return new Response(
          JSON.stringify({ error: "Brevo n'est pas configuré." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const res = await fetch("https://api.brevo.com/v3/account", {
        headers: { "api-key": brevoConfig.api_key, Accept: "application/json" },
      });
      if (!res.ok) {
        return new Response(
          JSON.stringify({ error: "Clé API Brevo invalide" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const account = await res.json();
      return new Response(
        JSON.stringify({ success: true, account: { email: account.email, plan: account.plan?.[0]?.type } }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      throw new Error("Au moins un destinataire est requis");
    }
    if (!subject || !message) {
      throw new Error("Sujet et message sont obligatoires");
    }

    // Filter out opted-out clients
    const emails = recipients.map((r: any) => r.email);
    const { data: optedOut } = await serviceClient
      .from("clients")
      .select("email")
      .in("email", emails)
      .eq("email_opt_out", true);
    const optedOutEmails = new Set((optedOut || []).map((c: any) => c.email));
    const filteredRecipients = recipients.filter((r: any) => !optedOutEmails.has(r.email));

    const year = new Date().getFullYear();
    let sent = 0;
    const errors: string[] = [];
    const skipped = recipients.length - filteredRecipients.length;

    // Smart routing: >=MASS_THRESHOLD recipients → Brevo if available, else Resend
    const useBrevo = !!brevoConfig && filteredRecipients.length >= MASS_THRESHOLD;

    for (const r of filteredRecipients) {
      try {
        const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
        <tr><td style="text-align:center;padding-bottom:12px;">
          <img src="${LOGO_URL}" alt="Logo" width="56" height="56" style="display:inline-block;border-radius:14px;" />
        </td></tr>
        <tr><td style="background:#111116;border:1px solid #27272a;border-radius:16px;padding:36px 32px;">
          <h2 style="margin:0 0 20px;font-size:20px;color:#fafafa;font-weight:600;">Bonjour ${r.prenom || ""},</h2>
          <div style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#a1a1aa;white-space:pre-line;">
            ${message}
          </div>
        </td></tr>
        <tr><td style="padding-top:28px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#3f3f46;">© ${year} — Studio digital</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

        if (useBrevo) {
          await sendViaBrevo(brevoConfig, r, subject, htmlContent, tags, attachments);
        } else {
          const resendOpts: any = {
            from: "Impartial <studio@impartialgames.com>",
            to: [r.email],
            subject,
            html: htmlContent,
          };
          // Resend attachments: fetch content from URL
          if (attachments?.length) {
            resendOpts.attachments = [];
            for (const att of attachments) {
              try {
                const fileRes = await fetch(att.url);
                if (fileRes.ok) {
                  const buffer = await fileRes.arrayBuffer();
                  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
                  resendOpts.attachments.push({ filename: att.name, content: base64 });
                }
              } catch { /* skip failed attachment */ }
            }
          }
          await resend.emails.send(resendOpts);
        }
        sent++;
      } catch (e: any) {
        errors.push(`${r.email}: ${e.message}`);
      }
    }

    // Log emails
    for (const r of filteredRecipients) {
      await serviceClient.from("email_logs").insert({
        type: "campagne",
        destinataire: r.email,
        sujet: subject,
        contenu: message,
        client_id: r.clientId || null,
      });
    }

    return new Response(
      JSON.stringify({ success: true, sent, errors, skipped, provider: useBrevo ? "brevo" : "resend" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-campaign-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
