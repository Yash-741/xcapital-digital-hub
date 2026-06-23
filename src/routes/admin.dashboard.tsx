import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
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
import { ChevronDown, ChevronRight, Trash2, LogOut, UserCog, ArrowLeft, Download, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download as DownloadIcon } from "lucide-react";
import * as XLSX from "xlsx";
import { ProfileDialog } from "@/components/site/ProfileDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import xcapitalLogo from "@/assets/xcapital-logo.asset.json";

type AdminUser = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  is_admin: boolean;
};

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
  category: string | null;
  message: string | null;
  status: string;
  source: string | null;
  created_at: string;
};

const STATUSES = ["New", "Contacted", "In Progress", "Closed"] as const;
const PAGE_SIZE = 12;

const CATEGORY_PRODUCTS: Record<string, string[]> = {
  Lending: [
    "Business Loans",
    "MSME Funding",
    "Working Capital Finance",
    "Loan Against Property (LAP)",
    "Home Loans",
    "Credit Facilities"
  ],
  Banking: [
    "Cash Credit (CC)",
    "Overdraft Facilities (OD)",
    "Banking Relationship Management",
    "Credit Enhancement Support"
  ],
  Treasury: [
    "Fixed Deposit Solutions",
    "Treasury Advisory",
    "Liquidity Planning",
    "Banking Optimization"
  ],
  Advisory: [
    "Financial Structuring",
    "Funding Strategy",
    "Capital Access Facilitation"
  ]
};

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
  const [profileOpen, setProfileOpen] = useState(false);

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

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    enabled: authed === true,
    queryFn: async (): Promise<AdminUser[]> => [],
  });
  const [userSearch, setUserSearch] = useState("");
  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.email, u.full_name, u.phone].some((v) => v && v.toLowerCase().includes(q)),
    );
  }, [users, userSearch]);

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

  // Manual lead creation state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadCategory, setNewLeadCategory] = useState("Lending");
  const [newLeadRequirement, setNewLeadRequirement] = useState("");
  const [newLeadCustomReq, setNewLeadCustomReq] = useState("");
  const [newLeadStatus, setNewLeadStatus] = useState("New");
  const [newLeadSource, setNewLeadSource] = useState("manual");
  const [newLeadMessage, setNewLeadMessage] = useState("");

  const createLead = useMutation({
    mutationFn: async (newLead: {
      name: string;
      phone: string;
      email: string;
      category: string | null;
      requirement: string | null;
      message: string | null;
      source: string | null;
      status: string;
    }) => {
      const { data, error } = await supabase.from("leads").insert([newLead]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Manual lead added successfully");
      setAddDialogOpen(false);
      // Reset form fields
      setNewLeadName("");
      setNewLeadPhone("");
      setNewLeadEmail("");
      setNewLeadCategory("Lending");
      setNewLeadRequirement("");
      setNewLeadCustomReq("");
      setNewLeadStatus("New");
      setNewLeadSource("manual");
      setNewLeadMessage("");
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.message || "Failed to add manual lead");
    },
  });

  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!newLeadPhone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (!newLeadEmail.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(newLeadEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const finalReq = newLeadRequirement === "custom" ? newLeadCustomReq.trim() : newLeadRequirement;

    createLead.mutate({
      name: newLeadName.trim(),
      phone: newLeadPhone.trim(),
      email: newLeadEmail.trim(),
      category: newLeadCategory || null,
      requirement: finalReq || null,
      message: newLeadMessage.trim() || null,
      source: newLeadSource || null,
      status: newLeadStatus,
    });
  };

  useEffect(() => {
    if (newLeadCategory && CATEGORY_PRODUCTS[newLeadCategory]) {
      setNewLeadRequirement(CATEGORY_PRODUCTS[newLeadCategory][0] || "");
    } else {
      setNewLeadRequirement("");
    }
  }, [newLeadCategory]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reqFilter, setReqFilter] = useState<string>("all");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  const requirements = useMemo(() => {
    const s = new Set<string>();
    for (const l of leads) if (l.requirement) s.add(l.requirement);
    return Array.from(s).sort();
  }, [leads]);

  const categories = useMemo(() => {
    const s = new Set<string>();
    for (const l of leads) if (l.category) s.add(l.category);
    return Array.from(s).sort();
  }, [leads]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (reqFilter !== "all" && l.requirement !== reqFilter) return false;
      if (catFilter !== "all" && l.category !== catFilter) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q)
      );
    });
  }, [leads, search, statusFilter, reqFilter, catFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, statusFilter, reqFilter, catFilter]);

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

  function downloadXlsx(rows: Record<string, unknown>[], sheetName: string, fileName: string) {
    if (rows.length === 0) {
      toast.error("Nothing to export");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `${fileName}-${stamp}.xlsx`);
    toast.success("Exported");
  }

  function exportLeads() {
    downloadXlsx(
      filtered.map((l) => ({
        Name: l.name,
        Phone: l.phone,
        Email: l.email,
        Category: l.category ?? "",
        Product: l.requirement ?? "",
        Status: l.status,
        Source: l.source ?? "",
        Message: l.message ?? "",
        Submitted: new Date(l.created_at).toLocaleString(),
      })),
      "Leads",
      "xcapital-leads",
    );
  }

  function exportUsers() {
    downloadXlsx(
      filteredUsers.map((u) => ({
        Name: u.full_name ?? "",
        Email: u.email ?? "",
        Phone: u.phone ?? "",
        Role: u.is_admin ? "Admin" : "User",
        Joined: new Date(u.created_at).toLocaleString(),
        "Last sign-in": u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "Never",
      })),
      "Users",
      "xcapital-users",
    );
  }

  if (authed !== true) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={xcapitalLogo.url}
              alt="XCapital"
              className="h-9 w-auto shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-[var(--brand-black)] truncate">
                XCapital <span className="text-amber-600">Admin Portal</span>
              </h1>
              <p className="text-[11px] text-muted-foreground -mt-0.5">Lead management</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[var(--brand-black)] hover:bg-[var(--brand-yellow-soft)] transition"
            >
              <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Website</span>
            </Link>
            <button
              onClick={() => setProfileOpen(true)}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[var(--brand-black)] border border-[var(--brand-black)]/15 hover:bg-[var(--brand-yellow-soft)] transition"
            >
              <UserCog className="w-4 h-4" /> <span className="hidden sm:inline">Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full px-3 sm:px-4 py-2 text-sm font-semibold text-[var(--brand-black)] bg-[var(--brand-yellow)] hover:brightness-105 transition"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
        <div className="h-1 bg-[var(--brand-black)]" />
      </header>

      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="leads" className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Leads" value={stats.total} accent="bg-[var(--brand-black)]" />
          <StatCard label="New" value={stats.new} accent="bg-[var(--brand-yellow)]" />
          <StatCard label="Contacted" value={stats.contacted} accent="bg-amber-500" />
          <StatCard label="Closed" value={stats.closed} accent="bg-emerald-600" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 grid gap-3 md:grid-cols-[1fr_120px_140px_140px_auto_auto]">
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
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={reqFilter} onValueChange={setReqFilter}>
            <SelectTrigger><SelectValue placeholder="Requirement" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All products</SelectItem>
              {requirements.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button
            onClick={exportLeads}
            className="bg-[var(--brand-yellow)] hover:brightness-105 text-[var(--brand-black)] font-semibold cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" /> Export XLSX
          </Button>

          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[var(--brand-black)] hover:bg-[var(--brand-black)]/90 text-white font-semibold cursor-pointer">
                <Plus className="w-4 h-4 mr-2" /> Manual Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Manual Lead</DialogTitle>
                <DialogDescription>
                  Enter the details of the manual lead. The lead will be added to the database immediately.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddLeadSubmit} className="space-y-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="lead-name">Full Name *</Label>
                  <Input
                    id="lead-name"
                    required
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="lead-phone">Phone Number *</Label>
                    <Input
                      id="lead-phone"
                      required
                      value={newLeadPhone}
                      onChange={(e) => setNewLeadPhone(e.target.value)}
                      placeholder="e.g. +919876543210"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lead-email">Email Address *</Label>
                    <Input
                      id="lead-email"
                      type="email"
                      required
                      value={newLeadEmail}
                      onChange={(e) => setNewLeadEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="lead-category">Category</Label>
                    <Select value={newLeadCategory} onValueChange={setNewLeadCategory}>
                      <SelectTrigger id="lead-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lending">Lending</SelectItem>
                        <SelectItem value="Banking">Banking</SelectItem>
                        <SelectItem value="Treasury">Treasury</SelectItem>
                        <SelectItem value="Advisory">Advisory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lead-requirement">Product / Requirement</Label>
                    <Select value={newLeadRequirement} onValueChange={setNewLeadRequirement}>
                      <SelectTrigger id="lead-requirement">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_PRODUCTS[newLeadCategory]?.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                        <SelectItem value="custom">Custom Requirement...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {newLeadRequirement === "custom" && (
                  <div className="grid gap-2 animate-in fade-in-50 duration-150">
                    <Label htmlFor="lead-custom-req">Custom Requirement Details *</Label>
                    <Input
                      id="lead-custom-req"
                      required
                      value={newLeadCustomReq}
                      onChange={(e) => setNewLeadCustomReq(e.target.value)}
                      placeholder="e.g. Special Structured Loan"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="lead-status">Initial Status</Label>
                    <Select value={newLeadStatus} onValueChange={setNewLeadStatus}>
                      <SelectTrigger id="lead-status">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lead-source">Lead Source</Label>
                    <Select value={newLeadSource} onValueChange={setNewLeadSource}>
                      <SelectTrigger id="lead-source">
                        <SelectValue placeholder="Source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual Entry</SelectItem>
                        <SelectItem value="cold-call">Cold Call</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="event">Event / Exhibition</SelectItem>
                        <SelectItem value="website">Website Form</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lead-message">Message / Internal Notes</Label>
                  <Textarea
                    id="lead-message"
                    value={newLeadMessage}
                    onChange={(e) => setNewLeadMessage(e.target.value)}
                    placeholder="Enter details about the lead's requirement, business background or notes..."
                    rows={3}
                  />
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddDialogOpen(false)}
                    disabled={createLead.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[var(--brand-yellow)] hover:brightness-105 text-[var(--brand-black)] font-semibold"
                    disabled={createLead.isPending}
                  >
                    {createLead.isPending ? "Adding..." : "Add Lead"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="w-8"></th>
                  <th className="text-left px-3 py-3">Name</th>
                  <th className="text-left px-3 py-3">Phone</th>
                  <th className="text-left px-3 py-3">Email</th>
                  <th className="text-left px-3 py-3">Category</th>
                  <th className="text-left px-3 py-3 hidden lg:table-cell">Product</th>
                  <th className="text-left px-3 py-3">Status</th>
                  <th className="text-left px-3 py-3 hidden sm:table-cell">Date</th>
                  <th className="text-right px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">Loading leads…</td></tr>
                )}
                {!isLoading && pageRows.length === 0 && (
                  <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">No leads found</td></tr>
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
                        <td className="px-3 py-3"><a href={`tel:${l.phone}`} className="text-[var(--brand-black)] hover:underline" onClick={(e) => e.stopPropagation()}>{l.phone}</a></td>
                        <td className="px-3 py-3"><a href={`mailto:${l.email}`} className="text-[var(--brand-black)] hover:underline break-all" onClick={(e) => e.stopPropagation()}>{l.email}</a></td>
                        <td className="px-3 py-3">
                          {l.category ? (
                            <Badge variant="secondary" className="font-medium">{l.category}</Badge>
                          ) : <span className="text-slate-400">—</span>}
                        </td>
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
                          <td colSpan={8} className="px-3 py-4">
                            <div className="grid lg:grid-cols-2 gap-6">
                              <div className="rounded-lg bg-white border border-slate-200 p-4">
                                <h4 className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-3">User Details</h4>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                  <div><dt className="text-slate-500">Full Name</dt><dd className="font-medium text-slate-900">{l.name}</dd></div>
                                  <div><dt className="text-slate-500">Phone</dt><dd><a href={`tel:${l.phone}`} className="text-[var(--brand-black)] hover:underline">{l.phone}</a></dd></div>
                                  <div className="sm:col-span-2"><dt className="text-slate-500">Email</dt><dd><a href={`mailto:${l.email}`} className="text-[var(--brand-black)] hover:underline break-all">{l.email}</a></dd></div>
                                </dl>
                              </div>
                              <div className="rounded-lg bg-white border border-slate-200 p-4">
                                <h4 className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-3">Enquiry Details</h4>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                  <div><dt className="text-slate-500">Category</dt><dd className="font-medium">{l.category || "—"}</dd></div>
                                  <div><dt className="text-slate-500">Product / Requirement</dt><dd className="font-medium">{l.requirement || "—"}</dd></div>
                                  <div><dt className="text-slate-500">Source</dt><dd>{l.source || "—"}</dd></div>
                                  <div><dt className="text-slate-500">Submitted</dt><dd>{new Date(l.created_at).toLocaleString()}</dd></div>
                                  <div className="sm:col-span-2">
                                    <dt className="text-slate-500">Message</dt>
                                    <dd className="whitespace-pre-wrap text-slate-800">{l.message || "—"}</dd>
                                  </div>
                                </dl>
                              </div>
                            </div>
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
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 grid gap-3 md:grid-cols-[1fr_auto]">
              <Input
                placeholder="Search users by name, email, or phone…"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
              <Button
                onClick={exportUsers}
                className="bg-[var(--brand-yellow)] hover:brightness-105 text-[var(--brand-black)] font-semibold"
              >
                <Download className="w-4 h-4 mr-2" /> Export XLSX
              </Button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="text-left px-3 py-3">Name</th>
                      <th className="text-left px-3 py-3">Email</th>
                      <th className="text-left px-3 py-3">Phone</th>
                      <th className="text-left px-3 py-3 hidden sm:table-cell">Role</th>
                      <th className="text-left px-3 py-3 hidden md:table-cell">Joined</th>
                      <th className="text-left px-3 py-3 hidden lg:table-cell">Last sign-in</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersLoading && (
                      <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Loading users…</td></tr>
                    )}
                    {!usersLoading && filteredUsers.length === 0 && (
                      <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No users found</td></tr>
                    )}
                    {filteredUsers.map((u: AdminUser) => (
                      <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-3 py-3 font-medium text-slate-900">{u.full_name || "—"}</td>
                        <td className="px-3 py-3">
                          {u.email ? (
                            <a href={`mailto:${u.email}`} className="text-[var(--brand-black)] hover:underline break-all">{u.email}</a>
                          ) : "—"}
                        </td>
                        <td className="px-3 py-3">
                          {u.phone ? (
                            <a href={`tel:${u.phone}`} className="text-[var(--brand-black)] hover:underline">{u.phone}</a>
                          ) : "—"}
                        </td>
                        <td className="px-3 py-3 hidden sm:table-cell">
                          {u.is_admin ? (
                            <Badge className="bg-[var(--brand-yellow)] text-[var(--brand-black)] border-0">Admin</Badge>
                          ) : (
                            <Badge variant="secondary">User</Badge>
                          )}
                        </td>
                        <td className="px-3 py-3 hidden md:table-cell text-slate-600">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-3 hidden lg:table-cell text-slate-600">
                          {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "Never"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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