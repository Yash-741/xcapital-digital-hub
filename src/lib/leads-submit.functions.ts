import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(20).regex(/^[0-9+\-\s()]+$/),
  email: z.string().trim().email().max(255),
  requirement: z.string().trim().max(200).optional().nullable(),
  message: z.string().trim().max(2000).optional().nullable(),
  source: z.string().trim().max(200).optional().nullable(),
});

export const submitLeadEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LeadSchema.parse(input))
  .handler(async ({ data }) => {
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