import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const LeadSchema = z.object({
  category: z.enum(["loan", "insurance", "investment"]),
  product_slug: z.string().min(1).max(120),
  product_name: z.string().min(1).max(200),
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20).regex(/^[0-9+\-\s]+$/),
  amount: z.number().nonnegative().max(1_000_000_000).optional(),
  tenure: z.string().trim().max(60).optional(),
  coverage: z.number().nonnegative().max(1_000_000_000).optional(),
  age: z.number().int().min(0).max(120).optional(),
  horizon: z.string().trim().max(60).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export const submitLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => LeadSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { rateLimit, getClientIp } = await import("./rate-limit.server");
    const ip = getClientIp(getRequest());
    const rl = rateLimit(`servicelead:${ip}`, { capacity: 5, refillPerSec: 5 / 60 });
    if (!rl.ok) {
      console.warn(`[submitLead] rate-limited ip=${ip}`);
      throw new Error("Too many submissions. Please try again in a minute.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("service_leads")
      .insert({ ...data, user_id: context.userId });
    if (error) {
      console.error("[submitLead] DB error:", error.message);
      throw new Error("Failed to submit your enquiry. Please try again.");
    }
    return { ok: true as const };
  });

export const listMyApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = (context.claims as { email?: string } | null)?.email ?? null;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [serviceRes, leadsRes] = await Promise.all([
      supabaseAdmin
        .from("service_leads")
        .select(
          "id, category, product_slug, product_name, full_name, email, phone, amount, tenure, coverage, age, horizon, notes, status, created_at, user_id",
        )
        .or(
          email
            ? `user_id.eq.${context.userId},email.eq.${email}`
            : `user_id.eq.${context.userId}`,
        )
        .order("created_at", { ascending: false }),
      email
        ? supabaseAdmin
            .from("leads")
            .select("id, name, email, phone, category, requirement, message, status, created_at")
            .eq("email", email)
            .order("created_at", { ascending: false })
        : Promise.resolve({ data: [], error: null } as const),
    ]);

    if (serviceRes.error) {
      console.error("[listMyApplications] service_leads error:", serviceRes.error.message);
      throw new Error("Failed to load your applications.");
    }
    if (leadsRes.error) {
      console.error("[listMyApplications] leads error:", leadsRes.error.message);
    }

    type App = {
      id: string;
      category: string;
      product_slug: string | null;
      product_name: string;
      full_name: string;
      email: string;
      phone: string;
      amount: number | null;
      tenure: string | null;
      coverage: number | null;
      age: number | null;
      horizon: string | null;
      notes: string | null;
      status: string;
      created_at: string;
    };

    const fromService: App[] = (serviceRes.data ?? []).map((r: any) => ({
      id: r.id,
      category: r.category,
      product_slug: r.product_slug,
      product_name: r.product_name,
      full_name: r.full_name,
      email: r.email,
      phone: r.phone,
      amount: r.amount,
      tenure: r.tenure,
      coverage: r.coverage,
      age: r.age,
      horizon: r.horizon,
      notes: r.notes,
      status: r.status ?? "New",
      created_at: r.created_at,
    }));

    const fromLeads: App[] = ((leadsRes.data as any[]) ?? []).map((r) => ({
      id: r.id,
      category: r.category ?? "enquiry",
      product_slug: null,
      product_name: r.requirement || r.category || "Enquiry",
      full_name: r.name ?? "",
      email: r.email ?? "",
      phone: r.phone ?? "",
      amount: null,
      tenure: null,
      coverage: null,
      age: null,
      horizon: null,
      notes: r.message ?? null,
      status: r.status ?? "New",
      created_at: r.created_at,
    }));

    // Dedupe across the two source tables: same submission often lands in
    // both `service_leads` and `leads` within a few seconds.
    const sigOf = (a: App) => {
      const t = Math.floor(new Date(a.created_at).getTime() / 60000); // minute bucket
      return `${(a.email || "").toLowerCase()}|${(a.product_name || "").toLowerCase()}|${t}`;
    };
    const seenId = new Set<string>();
    const seenSig = new Set<string>();
    const merged = [...fromService, ...fromLeads].filter((a) => {
      if (seenId.has(a.id)) return false;
      const sig = sigOf(a);
      if (seenSig.has(sig)) return false;
      seenId.add(a.id);
      seenSig.add(sig);
      return true;
    });
    merged.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    return merged;
  });