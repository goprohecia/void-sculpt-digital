import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Checks if a user has a specific granular permission.
 * Uses the DB function check_permission (SECURITY DEFINER).
 *
 * Usage in edge functions:
 *   const allowed = await checkPermission(supabaseClient, userId, "voir_dossiers_equipe");
 *   if (!allowed) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
 */
export async function checkPermission(
  supabaseAdmin: ReturnType<typeof createClient>,
  userId: string,
  permissionCode: string
): Promise<boolean> {
  const { data, error } = await supabaseAdmin.rpc("check_permission", {
    _user_id: userId,
    _permission_code: permissionCode,
  });
  if (error) {
    console.error("checkPermission error:", error);
    return false;
  }
  return data === true;
}

/**
 * Checks if user is admin (bypasses granular permissions).
 */
export async function isAdmin(
  supabaseAdmin: ReturnType<typeof createClient>,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabaseAdmin.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) return false;
  return data === true;
}

/**
 * Combined check: admin always passes, employees need permission.
 */
export async function requirePermission(
  supabaseAdmin: ReturnType<typeof createClient>,
  userId: string,
  permissionCode: string
): Promise<{ allowed: boolean; isAdmin: boolean }> {
  const admin = await isAdmin(supabaseAdmin, userId);
  if (admin) return { allowed: true, isAdmin: true };
  const allowed = await checkPermission(supabaseAdmin, userId, permissionCode);
  return { allowed, isAdmin: false };
}
