import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Trash2, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "XCapital Admin Portal" }, { name: "robots", content: "noindex" }] }),
  component: AdminDashboard,
});

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  requirement: string | null;
  message: string | null;
  status: string;
  source: string | null;
  created_at: string;
};

const STATUSES = ["New", "Contacted", "In Progress", "Closed"] as const;
const PAGE_SIZE = 12;

const statusColor: Record<string, string> = {
  New: "bg-blue-100 text-blue-800",
  Contacted: "bg-amber-100 text-amber-800",
  "In Progress": "bg-purple-100 text-purple-800",
  Closed: "bg-green-100 text-green-800",
};

function AdminDashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate({ to: "/admin", replace: true });
        return;
      }
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!role) {
        await supabase.auth.signOut();
        navigate({ to: "/admin", replace: true });
        return;
      }
      setAuthed(true);
    })();
  }, [navigate]);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    enabled: authed === true,
    queryFn: async (): Promise<Lead[]> => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("leads").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const deleteLead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reqFilter, setReqFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  const requirements = useMemo(() => {
    const s = new Set<string>();
    for (const l of leads) if (l.requirement) s.add(l.requirement);
    return Array.from(s).sort();
  }, [leads]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (reqFilter !== "all" && l.requirement !== reqFilter) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q)
      );
    });
  }, [leads, search, statusFilter, reqFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, statusFilter, reqFilter]);

  const stats = useMemo(() => ({
    total: leads.length,
    new: leads.filter((l) => l.status === "New").length,
    contacted: leads.filter((l) => l.status === "Contacted").length,
    closed: leads.filter((l) => l.status === "Closed").length,
  }), [leads]);

  async function handleLogout() {
    await supabase.auth.signOut();
    qc.clear();
    navigate({ to: "/admin", replace: true });
  }

  if (authed !== true) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#0a1438] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold">
              XCapital <span className="text-[var(--brand-yellow)]">Admin Portal</span>
            </h1>
            <p className="text-xs text-slate-300">Lead management</p>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="text-white hover:bg-white/10">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Leads" value={stats.total} accent="bg-[#0a1438]" />
          <StatCard label="New" value={stats.new} accent="bg-blue-600" />
          <StatCard label="Contacted" value={stats.contacted} accent="bg-amber-500" />
          <StatCard label="Closed" value={stats.closed} accent="bg-green-600" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 grid gap-3 md:grid-cols-[1fr_180px_220px]">
          <Input
            placeholder="Search name, phone, or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={reqFilter} onValueChange={setReqFilter}>
            <SelectTrigger><SelectValue placeholder="Requirement" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All products</SelectItem>
              {requirements.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="w-8"></th>
                  <th className="text-left px-3 py-3">Name</th>
                  <th className="text-left px-3 py-3">Phone</th>
                  <th className="text-left px-3 py-3 hidden md:table-cell">Email</th>
                  <th className="text-left px-3 py-3 hidden lg:table-cell">Requirement</th>
                  <th className="text-left px-3 py-3">Status</th>
                  <th className="text-left px-3 py-3 hidden sm:table-cell">Date</th>
                  <th className="text-right px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">Loading leads…</td></tr>
                )}
                {!isLoading && pageRows.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No leads found</td></tr>
                )}
                {pageRows.map((l) => {
                  const open = expanded === l.id;
                  return (
                    <FragmentRow key={l.id}>
                      <tr
                        className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"
                        onClick={() => setExpanded(open ? null : l.id)}
                      >
                        <td className="px-2 text-slate-400">
                          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </td>
                        <td className="px-3 py-3 font-medium text-slate-900">{l.name}</td>
                        <td className="px-3 py-3"><a href={`tel:${l.phone}`} className="text-[#0a1438] hover:underline" onClick={(e) => e.stopPropagation()}>{l.phone}</a></td>
                        <td className="px-3 py-3 hidden md:table-cell"><a href={`mailto:${l.email}`} className="text-[#0a1438] hover:underline" onClick={(e) => e.stopPropagation()}>{l.email}</a></td>
                        <td className="px-3 py-3 hidden lg:table-cell">{l.requirement || "—"}</td>
                        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={l.status}
                            onValueChange={(v) => updateStatus.mutate({ id: l.id, status: v })}
                          >
                            <SelectTrigger className="h-8 w-[130px]">
                              <SelectValue>
                                <Badge className={`${statusColor[l.status]} border-0 font-medium`}>{l.status}</Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-3 py-3 hidden sm:table-cell text-slate-600">
                          {new Date(l.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (confirm(`Delete lead from ${l.name}?`)) deleteLead.mutate(l.id);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                      {open && (
                        <tr className="bg-slate-50/70 border-t border-slate-100">
                          <td></td>
                          <td colSpan={7} className="px-3 py-4">
                            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                              <div><dt className="text-slate-500">Email</dt><dd>{l.email}</dd></div>
                              <div><dt className="text-slate-500">Requirement</dt><dd>{l.requirement || "—"}</dd></div>
                              <div><dt className="text-slate-500">Source</dt><dd>{l.source || "—"}</dd></div>
                              <div><dt className="text-slate-500">Submitted</dt><dd>{new Date(l.created_at).toLocaleString()}</dd></div>
                              <div className="sm:col-span-2">
                                <dt className="text-slate-500">Message</dt>
                                <dd className="whitespace-pre-wrap">{l.message || "—"}</dd>
                              </div>
                            </dl>
                          </td>
                        </tr>
                      )}
                    </FragmentRow>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm">
              <span className="text-slate-600">
                Page {currentPage} of {totalPages} · {filtered.length} leads
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
                <Button size="sm" variant="outline" disabled={currentPage >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg ${accent}`} />
      <div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-xs text-slate-500 uppercase tracking-wide">{label}</div>
      </div>
    </div>
  );
}

// React fragments cannot be table-row children in some renderers — use a passthrough wrapper.
function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}