import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Skip for admin/client/employee routes — they use overflow-auto on <main>
    const isAppRoute = /^\/(admin|client|employee|superadmin)/.test(pathname);
    if (!isAppRoute) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);
}
