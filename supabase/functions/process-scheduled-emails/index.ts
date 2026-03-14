import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOGO_URL = "https://usulfquilneqlcyuwdof.supabase.co/storage/v1/object/public/email-assets/logo-mba.png";
const MASS_THRESHOLD = 6;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const serviceClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // Fetch scheduled emails that are due
    const { data: scheduled, error: fetchErr } = await serviceClient
      .from("emails_planifies")
      .select("*")
      .eq("statut", "planifie")
      .lte("date_envoi_planifie", new Date().toISOString())
      .limit(10);

    if (fetchErr) throw fetchErr;
    if (!scheduled || scheduled.length === 0) {
      return new Response(
        JSON.stringify({ processed: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    let totalProcessed = 0;

    for (const email of scheduled) {
      try {
        // Mark as en_cours to prevent double processing
        await serviceClient
          .from("emails_planifies")
          .update({ statut: "en_cours", updated_at: new Date().toISOString() })
          .eq("id", email.id)
          .eq("statut", "planifie");

        const recipients = (email.destinataires_json || []) as Array<{
          email: string;
          prenom?: string;
          clientId?: string;
        }>;
        const attachments = (email.pieces_jointes || []) as Array<{ name: string; url: string }>;

        // Get Brevo config for the compte
        let brevoConfig: any = null;
        if (email.compte_id) {
          const { data: settingsData } = await serviceClient
            .from("app_settings")
            .select("value")
            .eq("key", "brevo_config")
            .eq("compte_id", email.compte_id)
            .maybeSingle();
          if (settingsData?.value) {
            const config = typeof settingsData.value === "string"
              ? JSON.parse(settingsData.value)
              : settingsData.value;
            if (config.enabled && config.api_key) brevoConfig = config;
          }
        }

        // Filter opted-out
        const emailAddresses = recipients.map((r) => r.email);
        const { data: optedOut } = await serviceClient
          .from("clients")
          .select("email")
          .in("email", emailAddresses)
          .eq("email_opt_out", true);
        const optedOutSet = new Set((optedOut || []).map((c: any) => c.email));
        const filtered = recipients.filter((r) => !optedOutSet.has(r.email));

        const useBrevo = !!brevoConfig && filtered.length >= MASS_THRESHOLD;
        const year = new Date().getFullYear();
        let sent = 0;

        for (const r of filtered) {
          const htmlContent = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;padding:0;background:#09090b;font-family:'Segoe UI',Roboto,Arial,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;"><tr><td align="center" style="padding:40px 16px;"><table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;"><tr><td style="text-align:center;padding-bottom:12px;"><img src="${LOGO_URL}" alt="Logo" width="56" height="56" style="display:inline-block;border-radius:14px;" /></td></tr><tr><td style="background:#111116;border:1px solid #27272a;border-radius:16px;padding:36px 32px;"><h2 style="margin:0 0 20px;font-size:20px;color:#fafafa;font-weight:600;">Bonjour ${r.prenom || ""},</h2><div style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#a1a1aa;white-space:pre-line;">${email.contenu}</div></td></tr><tr><td style="padding-top:28px;text-align:center;"><p style="margin:0;font-size:11px;color:#3f3f46;">© ${year} — Studio digital</p></td></tr></table></td></tr></table></body></html>`;

          try {
            if (useBrevo) {
              const body: any = {
                sender: { name: brevoConfig.sender_name, email: brevoConfig.sender_email },
                to: [{ email: r.email, name: r.prenom || "" }],
                subject: email.objet,
                htmlContent,
                headers: { "List-Unsubscribe": `<mailto:${brevoConfig.sender_email}?subject=unsubscribe>` },
              };
              if (attachments.length) body.attachment = attachments.map((a) => ({ url: a.url, name: a.name }));
              const res = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: { "api-key": brevoConfig.api_key, "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(body),
              });
              if (!res.ok) { const err = await res.text(); console.error(`Brevo error for ${r.email}: ${err}`); continue; }
              await res.json();
            } else {
              const resendOpts: any = {
                from: "Impartial <studio@impartialgames.com>",
                to: [r.email],
                subject: email.objet,
                html: htmlContent,
              };
              if (attachments.length) {
                resendOpts.attachments = [];
                for (const att of attachments) {
                  try {
                    const fileRes = await fetch(att.url);
                    if (fileRes.ok) {
                      const buffer = await fileRes.arrayBuffer();
                      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
                      resendOpts.attachments.push({ filename: att.name, content: base64 });
                    }
                  } catch { /* skip */ }
                }
              }
              await resend.emails.send(resendOpts);
            }
            sent++;
          } catch (e: any) {
            console.error(`Failed to send to ${r.email}:`, e.message);
          }
        }

        // Log sent emails
        for (const r of filtered) {
          await serviceClient.from("email_logs").insert({
            type: "campagne",
            destinataire: r.email,
            sujet: email.objet,
            contenu: email.contenu,
            client_id: r.clientId || null,
            compte_id: email.compte_id,
          });
        }

        // Create campaign record
        const { data: campaignData } = await serviceClient.from("campagnes_email").insert({
          objet: email.objet,
          date_envoi: new Date().toISOString(),
          nb_destinataires: sent,
          statut: "envoye",
          source: "planifie",
          compte_id: email.compte_id,
        }).select("id").single();

        // Update scheduled email
        await serviceClient
          .from("emails_planifies")
          .update({
            statut: "envoye",
            brevo_campaign_id: campaignData?.id || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", email.id);

        totalProcessed++;
      } catch (e: any) {
        console.error(`Error processing scheduled email ${email.id}:`, e.message);
        // Mark as erreur
        await serviceClient
          .from("emails_planifies")
          .update({ statut: "erreur", updated_at: new Date().toISOString() })
          .eq("id", email.id);
      }
    }

    return new Response(
      JSON.stringify({ processed: totalProcessed }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in process-scheduled-emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
