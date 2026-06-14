import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

const ALLOWED_SOURCES = new Set([
  "store_enquiry",
  "apply_now",
  "contact",
  "about",
  "homepage",
  "investments",
  "loans",
  "insurance",
  "services",
]);

const LeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(20).regex(/^[0-9+\-\s()]+$/),
  email: z.string().trim().email().max(255),
  requirement: z.string().trim().max(200).optional().nullable(),
  message: z.string().trim().max(2000).optional().nullable(),
  source: z
    .string()
    .trim()
    .max(64)
    .optional()
    .nullable()
    .transform((v) => (v && ALLOWED_SOURCES.has(v) ? v : null)),
});

export const submitLeadEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LeadSchema.parse(input))
  .handler(async ({ data }) => {
    const { rateLimit, getClientIp } = await import("./rate-limit.server");
    const ip = getClientIp(getRequest());
    const rl = rateLimit(`lead:${ip}`, { capacity: 5, refillPerSec: 5 / 60 });
    if (!rl.ok) {
      console.warn(`[submitLeadEnquiry] rate-limited ip=${ip}`);
      throw new Error("Too many submissions. Please try again in a minute.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("leads").insert({
      name: data.name,
      phone: data.phone,
      email: data.email,
      requirement: data.requirement || null,
      message: data.message || null,
      source: data.source || null,
    });
    if (error) {
      console.error("[submitLeadEnquiry] DB error:", error.message);
      throw new Error("Failed to submit your enquiry. Please try again.");
    }
    return { ok: true as const };
  });