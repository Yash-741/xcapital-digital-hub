import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AdminUser = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  is_admin: boolean;
};

export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUser[]> => {
    const { data: roleRow, error: roleErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (roleErr || !roleRow) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const all: Array<{
      id: string;
      email: string | null;
      created_at: string;
      last_sign_in_at: string | null;
      email_confirmed_at: string | null;
    }> = [];
    let page = 1;
    while (true) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) throw new Error(error.message);
      for (const u of data.users) {
        all.push({
          id: u.id,
          email: u.email ?? null,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at ?? null,
          email_confirmed_at: u.email_confirmed_at ?? null,
        });
      }
      if (data.users.length < 1000) break;
      page += 1;
      if (page > 20) break;
    }

    const ids = all.map((u) => u.id);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, full_name, phone").in("id", ids),
      supabaseAdmin.from("user_roles").select("user_id, role").in("user_id", ids),
    ]);
    const pMap = new Map((profiles ?? []).map((p) => [p.id, p]));
    const adminSet = new Set((roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id));

    return all
      .map((u) => ({
        id: u.id,
        email: u.email,
        full_name: pMap.get(u.id)?.full_name ?? null,
        phone: pMap.get(u.id)?.phone ?? null,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        email_confirmed_at: u.email_confirmed_at,
        is_admin: adminSet.has(u.id),
      }))
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  });