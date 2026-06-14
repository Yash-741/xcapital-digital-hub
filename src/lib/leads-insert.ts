import { submitLeadEnquiry } from "@/lib/leads-submit.functions";

export type LeadInput = {
  name: string;
  phone: string;
  email: string;
  requirement?: string | null;
  message?: string | null;
  source?: string | null;
};

export async function insertLead(lead: LeadInput) {
  await submitLeadEnquiry({
    data: {
      name: lead.name.trim(),
      phone: lead.phone.trim(),
      email: lead.email.trim(),
      requirement: lead.requirement?.trim() || null,
      message: lead.message?.trim() || null,
      source: lead.source?.trim() || null,
    },
  });
}