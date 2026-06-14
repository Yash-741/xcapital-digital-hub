import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, Mail } from "lucide-react";
import { getEmailDashboard, type EmailLogRow } from "@/lib/email-admin.functions";

export const Route = createFileRoute("/admin/emails")({
  head: () => ({ meta: [{ title: "Email Queue — XCapital Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminEmails,
});

const statusColor: Record<string, string> = {
  sent: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  suppressed: "bg-slate-200 text-slate-700",
  dlq: "bg-red-100 text-red-800",
  failed: "bg-red-100 text-red-800",
  bounced: "bg-red-100 text-red-800",
  complained: "bg-red-100 text-red-800",
};

function AdminEmails() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return navigate({ to: "/admin", replace: true });
      const { data: role } = await supabase
        .from("user_roles").select("role")
        .eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
      if (!role) { await supabase.auth.signOut(); return navigate({ to: "/admin", replace: true }); }
      setAuthed(true);
    })();
  }, [navigate]);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-emails"],
    enabled: authed === true,
    refetchInterval: 15_000,
    queryFn: () => getEmailDashboard(),
  });

  const log: EmailLogRow[] = data?.log ?? [];
  const filtered = useMemo(
    () => statusFilter === "all" ? log : log.filter((r) => r.status === statusFilter),
    [log, statusFilter],
  );

  if (authed !== true) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#0a1438] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-[var(--brand-yellow)]" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Email Queue</h1>
              <p className="text-xs text-slate-300">notify.xcapital.co.in · last 30 days</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/dashboard" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Button onClick={() => refetch()} disabled={isFetching} variant="ghost" className="text-white hover:bg-white/10">
              <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Stat label="Total" value={data?.stats.total ?? 0} accent="bg-[#0a1438]" />
          <Stat label="Sent" value={data?.stats.sent ?? 0} accent="bg-green-600" />
          <Stat label="Pending" value={data?.stats.pending ?? 0} accent="bg-amber-500" />
          <Stat label="Failed" value={data?.stats.failed ?? 0} accent="bg-red-600" />
          <Stat label="Suppressed" value={data?.stats.suppressed ?? 0} accent="bg-slate-500" />
        </div>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Live queues</h2>
          {data?.queues?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-600">
                  <tr className="text-left">
                    <th className="py-2 pr-4">Queue</th>
                    <th className="py-2 pr-4">Waiting</th>
                    <th className="py-2 pr-4">Oldest msg</th>
                    <th className="py-2 pr-4">Total processed</th>
                  </tr>
                </thead>
                <tbody>
                  {data.queues.map((q: any) => (
                    <tr key={q.queue_name} className="border-t border-slate-100">
                      <td className="py-2 pr-4 font-medium text-slate-900">{q.queue_name}</td>
                      <td className="py-2 pr-4">{q.queue_length}</td>
                      <td className="py-2 pr-4 text-slate-600">{q.oldest_msg_age_sec != null ? `${q.oldest_msg_age_sec}s` : "—"}</td>
                      <td className="py-2 pr-4 text-slate-600">{q.total_messages ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No queue activity.</p>
          )}
        </section>

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">Recent send attempts</h2>
            <div className="flex gap-1 text-xs">
              {["all", "sent", "pending", "failed", "dlq", "suppressed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2 py-1 rounded ${statusFilter === s ? "bg-[#0a1438] text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >{s}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="text-left px-3 py-2">Template</th>
                  <th className="text-left px-3 py-2">Recipient</th>
                  <th className="text-left px-3 py-2">Status</th>
                  <th className="text-left px-3 py-2">When</th>
                  <th className="text-left px-3 py-2">Error</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Loading…</td></tr>}
                {!isLoading && filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No emails in this view yet.</td></tr>
                )}
                {filtered.map((r, i) => (
                  <tr key={(r.message_id ?? "") + i} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-medium text-slate-900">{r.template_name ?? "—"}</td>
                    <td className="px-3 py-2">{r.recipient_email ?? "—"}</td>
                    <td className="px-3 py-2">
                      <Badge className={`${statusColor[r.status] ?? "bg-slate-100 text-slate-700"} border-0`}>{r.status}</Badge>
                    </td>
                    <td className="px-3 py-2 text-slate-600">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="px-3 py-2 text-red-700 text-xs max-w-md truncate" title={r.error_message ?? ""}>{r.error_message ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {data?.suppressed?.length ? (
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Suppressed recipients</h2>
            <ul className="text-sm divide-y divide-slate-100">
              {data.suppressed.map((s: any, i: number) => (
                <li key={s.email + i} className="py-2 flex justify-between gap-4">
                  <span className="font-medium">{s.email}</span>
                  <span className="text-slate-500">{s.reason ?? "—"}</span>
                  <span className="text-slate-400 text-xs">{new Date(s.created_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg ${accent}`} />
      <div>
        <div className="text-xl font-bold text-slate-900">{value}</div>
        <div className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</div>
      </div>
    </div>
  );
}