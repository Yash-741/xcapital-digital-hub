import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  // Disable SSR for the entire admin section. The auth session lives in
  // localStorage (browser-only), so server-side rendering would leak the
  // admin shell HTML to unauthenticated visitors before the client-side
  // auth check runs. Skipping SSR ensures nothing is sent until the
  // browser has validated the session and role.
  ssr: false,
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  useEffect(() => {
    const signOut = () => {
      // Synchronously clear the Supabase session from localStorage so a
      // refresh/close always ends the admin session. The async network call
      // may not complete during unload, but local clearing is enough to
      // force re-login on next load.
      try {
        for (const key of Object.keys(localStorage)) {
          if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
            localStorage.removeItem(key);
          }
        }
      } catch {}
      void supabase.auth.signOut();
    };
    window.addEventListener("beforeunload", signOut);
    return () => window.removeEventListener("beforeunload", signOut);
  }, []);
  return <Outlet />;
}