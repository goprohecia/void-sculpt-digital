import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsDemo } from "./useIsDemo";

/**
 * Hook to check if the current user has a specific permission.
 * Uses the DB function check_permission (SECURITY DEFINER).
 * In demo mode, always returns true (admin).
 */
export function usePermission(permissionCode: string) {
  const { isDemo, isLoading: authLoading, supabaseUserId } = useIsDemo();

  const { data: hasPermission = false, isLoading } = useQuery({
    queryKey: ["permission", permissionCode, supabaseUserId],
    queryFn: async () => {
      if (!supabaseUserId) return false;
      // Admins always pass
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: supabaseUserId,
        _role: "admin",
      });
      if (isAdmin) return true;
      // Check granular permission
      const { data } = await supabase.rpc("check_permission", {
        _user_id: supabaseUserId,
        _permission_code: permissionCode,
      });
      return data === true;
    },
    enabled: !isDemo && !authLoading && !!supabaseUserId,
    staleTime: 30_000,
  });

  return {
    hasPermission: isDemo ? true : hasPermission,
    isLoading: authLoading || isLoading,
  };
}

/**
 * Hook to check multiple permissions at once.
 */
export function usePermissions(permissionCodes: string[]) {
  const { isDemo, isLoading: authLoading, supabaseUserId } = useIsDemo();

  const { data: results = {}, isLoading } = useQuery({
    queryKey: ["permissions-check", permissionCodes.join(","), supabaseUserId],
    queryFn: async () => {
      if (!supabaseUserId) return {};
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: supabaseUserId,
        _role: "admin",
      });
      if (isAdmin) {
        return Object.fromEntries(permissionCodes.map((c) => [c, true]));
      }
      const checks: Record<string, boolean> = {};
      for (const code of permissionCodes) {
        const { data } = await supabase.rpc("check_permission", {
          _user_id: supabaseUserId,
          _permission_code: code,
        });
        checks[code] = data === true;
      }
      return checks;
    },
    enabled: !isDemo && !authLoading && !!supabaseUserId && permissionCodes.length > 0,
    staleTime: 30_000,
  });

  return {
    permissions: isDemo ? Object.fromEntries(permissionCodes.map((c) => [c, true])) : results,
    isLoading: authLoading || isLoading,
  };
}
