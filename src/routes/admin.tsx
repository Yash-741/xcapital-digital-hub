import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const signOut = () => {
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

  // Auto-logout after inactivity (only on authenticated admin pages).
  useEffect(() => {
    if (pathname === "/admin") return; // skip on login screen
    const IDLE_MS = 15 * 60 * 1000; // 15 minutes
    const WARN_MS = 60 * 1000;      // warn 1 min before
    let idleTimer: ReturnType<typeof setTimeout>;
    let warnTimer: ReturnType<typeof setTimeout>;

    const logout = async () => {
      await supabase.auth.signOut();
      toast.error("Signed out due to inactivity");
      navigate({ to: "/admin", replace: true });
    };

    const reset = () => {
      clearTimeout(idleTimer);
      clearTimeout(warnTimer);
      warnTimer = setTimeout(() => {
        toast.warning("You'll be signed out in 1 minute due to inactivity");
      }, IDLE_MS - WARN_MS);
      idleTimer = setTimeout(logout, IDLE_MS);
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "visibilitychange"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      clearTimeout(idleTimer);
      clearTimeout(warnTimer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [pathname, navigate]);

  return <Outlet />;
}