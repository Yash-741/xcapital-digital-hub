import { supabase } from "@/integrations/supabase/client";

export type LeadInput = {
  name: string;
  phone: string;
  email: string;
  requirement?: string | null;
  category?: string | null;
  message?: string | null;
  source?: string | null;
};

export async function insertLead(lead: LeadInput) {
  const { error } = await supabase.from("leads").insert({
    name: lead.name.trim(),
    phone: lead.phone.trim(),
    email: lead.email.trim(),
    requirement: lead.requirement?.trim() || null,
    category: lead.category?.trim() || null,
    message: lead.message?.trim() || null,
    source: lead.source?.trim() || null,
  });
  if (error) throw error;
}