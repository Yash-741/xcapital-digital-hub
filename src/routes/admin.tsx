import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  // Disable SSR for the entire admin section. The auth session lives in
  // localStorage (browser-only), so server-side rendering would leak the
  // admin shell HTML to unauthenticated visitors before the client-side
  // auth check runs. Skipping SSR ensures nothing is sent until the
  // browser has validated the session and role.
  ssr: false,
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: () => <Outlet />,
});