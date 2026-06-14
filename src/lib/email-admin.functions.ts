import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type EmailLogRow = {
  message_id: string | null;
  template_name: string | null;
  recipient_email: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
};

export type QueueMetric = {
  queue_name: string;
  queue_length: number;
  oldest_msg_age_sec: number | null;
  newest_msg_age_sec: number | null;
  total_messages: number | null;
};

export type SuppressedRow = {
  email: string;
  reason: string | null;
  created_at: string;
};

export type EmailDashboardData = {
  stats: { total: number; sent: number; pending: number; failed: number; suppressed: number };
  log: EmailLogRow[];
  queues: QueueMetric[];
  suppressed: SuppressedRow[];
};

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden");
}

export const getEmailDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<EmailDashboardData> => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Latest status per message_id over last 30 days
    const sinceIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: rawLog, error: logErr } = await supabaseAdmin
      .from("email_send_log")
      .select("message_id,template_name,recipient_email,status,error_message,created_at")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false })
      .limit(500);
    if (logErr) throw new Error(logErr.message);

    const seen = new Set<string>();
    const log: EmailLogRow[] = [];
    for (const r of (rawLog ?? []) as EmailLogRow[]) {
      const key = r.message_id ?? `${r.recipient_email}|${r.created_at}`;
      if (seen.has(key)) continue;
      seen.add(key);
      log.push(r);
    }

    const stats = { total: log.length, sent: 0, pending: 0, failed: 0, suppressed: 0 };
    for (const r of log) {
      if (r.status === "sent") stats.sent++;
      else if (r.status === "pending") stats.pending++;
      else if (r.status === "suppressed") stats.suppressed++;
      else stats.failed++;
    }

    let queues: QueueMetric[] = [];
    const { data: q } = await supabaseAdmin.rpc("admin_email_queue_metrics");
    if (Array.isArray(q)) {
      queues = (q as any[]).map((m) => ({
        queue_name: m.queue_name,
        queue_length: Number(m.queue_length ?? 0),
        oldest_msg_age_sec: m.oldest_msg_age_sec ?? null,
        newest_msg_age_sec: m.newest_msg_age_sec ?? null,
        total_messages: m.total_messages ?? null,
      }));
    }

    const { data: supp } = await supabaseAdmin
      .from("suppressed_emails")
      .select("email,reason,created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    return {
      stats,
      log,
      queues,
      suppressed: (supp ?? []) as SuppressedRow[],
    };
  });