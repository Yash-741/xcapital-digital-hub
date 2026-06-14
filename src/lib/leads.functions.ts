import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

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
  .inputValidator((input: unknown) => LeadSchema.parse(input))
  .handler(async ({ data }) => {
    const { rateLimit, getClientIp } = await import("./rate-limit.server");
    const ip = getClientIp(getRequest());
    const rl = rateLimit(`servicelead:${ip}`, { capacity: 5, refillPerSec: 5 / 60 });
    if (!rl.ok) {
      console.warn(`[submitLead] rate-limited ip=${ip}`);
      throw new Error("Too many submissions. Please try again in a minute.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("service_leads").insert(data);
    if (error) {
      console.error("[submitLead] DB error:", error.message);
      throw new Error("Failed to submit your enquiry. Please try again.");
    }
    return { ok: true as const };
  });