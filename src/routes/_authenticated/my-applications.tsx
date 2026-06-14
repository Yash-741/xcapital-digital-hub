import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { SiteLayout, PageHeader } from "@/components/site/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listMyApplications } from "@/lib/leads.functions";
import { FileText, Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/my-applications")({
  head: () => ({
    meta: [
      { title: "My Applications — XCapital" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyApplicationsPage,
});

const STATUS_STYLES: Record<string, string> = {
  New: "bg-blue-100 text-blue-800 border-blue-200",
  Contacted: "bg-amber-100 text-amber-800 border-amber-200",
  "In Progress": "bg-purple-100 text-purple-800 border-purple-200",
  Closed: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const CAT_LABEL: Record<string, string> = {
  loan: "Loan",
  insurance: "Insurance",
  investment: "Investment",
};

// Stable 6-digit display ID derived from the row UUID, prefixed with XC.
function shortLeadId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return "XC" + String(h % 1_000_000).padStart(6, "0");
}

function MyApplicationsPage() {
  const fetchApps = useServerFn(listMyApplications);
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["my-applications"],
    queryFn: () => fetchApps(),
  });

  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!data) return data;
    const q = search.trim().toUpperCase().replace(/\s|#/g, "");
    if (!q) return data;
    return data.filter((a) => shortLeadId(a.id).includes(q));
  }, [data, search]);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Account"
        title="My Applications"
        subtitle="Track all the applications you've submitted with XCapital."
      />
      <section className="container-x py-10 md:py-14">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Lead ID (e.g. XC482301)"
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground whitespace-nowrap">
                {filtered
                  ? `${filtered.length} of ${data?.length ?? 0}`
                  : ""}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                {isFetching ? "Refreshing…" : "Refresh"}
              </Button>
            </div>
          </div>

          {isLoading && (
            <div className="text-center py-16 text-muted-foreground">Loading your applications…</div>
          )}

          {error && (
            <div className="text-center py-12 text-red-600">
              {(error as Error).message || "Failed to load applications."}
            </div>
          )}

          {!isLoading && !error && data && data.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-10 text-center">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <h2 className="font-semibold text-lg">No applications yet</h2>
              <p className="text-sm text-muted-foreground mt-1">
                When you apply for a loan, insurance, or investment, it will show up here.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 justify-center">
                <Link
                  to="/loans"
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-[var(--brand-yellow)] text-[var(--brand-black)] hover:brightness-105"
                >
                  Explore loans
                </Link>
                <Link
                  to="/insurance"
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border border-border hover:bg-muted"
                >
                  Insurance
                </Link>
                <Link
                  to="/investments"
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border border-border hover:bg-muted"
                >
                  Investments
                </Link>
              </div>
            </div>
          )}

          {!isLoading && !error && filtered && data && data.length > 0 && filtered.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-10 text-center text-muted-foreground">
              No applications match "{search}".
            </div>
          )}

          {!isLoading && !error && filtered && filtered.length > 0 && (
            <ul className="space-y-3">
              {filtered.map((a) => (
                <li
                  key={a.id}
                  className="bg-card border border-border rounded-xl p-5 shadow-card hover:border-[var(--brand-yellow)] transition"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                          {CAT_LABEL[a.category] ?? a.category}
                        </span>
                        <Badge
                          variant="outline"
                          className={STATUS_STYLES[a.status] ?? "bg-muted text-foreground"}
                        >
                          {a.status}
                        </Badge>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          ID #{shortLeadId(a.id)}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold mt-1 text-[var(--brand-black)]">
                        {a.product_name}
                      </h3>
                    </div>
                    <time className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(a.created_at).toLocaleString()}
                    </time>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1.5 text-sm">
                    {a.amount != null && (
                      <Detail label="Amount" value={`₹${Number(a.amount).toLocaleString("en-IN")}`} />
                    )}
                    {a.tenure && <Detail label="Tenure" value={a.tenure} />}
                    {a.coverage != null && (
                      <Detail label="Coverage" value={`₹${Number(a.coverage).toLocaleString("en-IN")}`} />
                    )}
                    {a.age != null && <Detail label="Age" value={String(a.age)} />}
                    {a.horizon && <Detail label="Horizon" value={a.horizon} />}
                    <Detail label="Phone" value={a.phone} />
                    <Detail label="Email" value={a.email} />
                  </dl>
                  {a.notes && (
                    <p className="mt-3 text-sm text-muted-foreground border-t border-border pt-3">
                      <span className="font-medium text-foreground">Notes: </span>
                      {a.notes}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="truncate">{value}</dd>
    </div>
  );
}