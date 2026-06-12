import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/Layout";
import { categories } from "@/lib/store-products";
import { useI18n } from "@/lib/i18n";
import { StoreEnquiryDialog } from "@/components/site/StoreEnquiryDialog";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "X Capital Store — Smart Commerce & Fintech Solutions" },
      { name: "description", content: "Shop POS machines, soundboxes, QR & card payment devices, billing, biometric KYC, banking fintech devices, CCTV, office infrastructure and business consumables at X Capital Store." },
      { property: "og:title", content: "X Capital Store — Smart Commerce & Fintech Solutions" },
      { property: "og:description", content: "Empowering Businesses with Smart Commerce & Financial Technology Solutions." },
    ],
  }),
  component: StorePage,
});

function StorePage() {
  const [query, setQuery] = useState("");
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryCtx, setEnquiryCtx] = useState<{ productName?: string; categoryName?: string }>({});
  const { tEn } = useI18n();
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return categories;
    return categories
      .map((c) => ({
        ...c,
        subs: c.subs
          .map((s) => ({
            ...s,
            items: (s.items ?? []).filter(
              (i) => i.name.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
            ),
          }))
          .filter((s) => (s.items?.length ?? 0) > 0 || s.name.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)),
      }))
      .filter((c) => c.subs.length > 0 || c.title.toLowerCase().includes(q));
  }, [q]);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow={tEn("X Capital Store")}
        title={tEn("Smart Commerce & Financial Technology Solutions")}
        subtitle={tEn("Empowering businesses with POS, payment, billing, biometric, banking, security, office and consumable solutions — all in one place.")}
      />

      <section className="container-x py-8">
        {/* Search */}
        <div className="relative max-w-xl mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tEn("Search products (e.g. POS, soundbox, CCTV)…")}
            className="w-full rounded-md border border-border bg-white pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-yellow)]"
          />
        </div>

        {/* Category quick nav */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-border hover:bg-[var(--brand-yellow-soft)] hover:border-[var(--brand-yellow)] transition"
            >
              {tEn(c.title)}
            </a>
          ))}
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">{tEn("No products match your search.")}</p>
          )}
          {filtered.map((cat) => (
            <div key={cat.id} id={cat.id} className="scroll-mt-24">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-[var(--brand-black)]">{tEn(cat.title)}</h2>
                <p className="text-sm text-muted-foreground mt-1">{tEn(cat.tagline)}</p>
              </div>

              <div className="space-y-6">
                {cat.subs.map((sub) => (
                  <div key={sub.name} className="bg-white rounded-lg shadow-card border-b-[3px] border-[var(--brand-yellow)] p-5">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <h3 className="text-sm font-bold text-[var(--brand-black)] uppercase tracking-wide">{tEn(sub.name)}</h3>
                      <button
                        type="button"
                        onClick={() => {
                          setEnquiryCtx({ productName: sub.name, categoryName: cat.title });
                          setEnquiryOpen(true);
                        }}
                        className="shrink-0 inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold text-[var(--brand-black)] bg-[var(--brand-yellow)] hover:brightness-105 transition"
                      >
                        {tEn("Enquire")}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {(sub.items ?? []).map((it) => {
                        const Icon = it.icon;
                        return (
                          <button
                            type="button"
                            key={it.slug}
                            onClick={() => {
                              setEnquiryCtx({ productName: it.name, categoryName: cat.title });
                              setEnquiryOpen(true);
                            }}
                            className="group flex flex-col items-center text-center p-3 rounded-md border border-transparent hover:border-[var(--brand-yellow)] hover:bg-[var(--brand-yellow-soft)] transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-yellow)]"
                          >
                            <div className="h-12 w-12 grid place-items-center rounded-md bg-[var(--brand-yellow-soft)] text-[var(--brand-black)] group-hover:bg-white">
                              <Icon className="h-6 w-6" strokeWidth={1.5} />
                            </div>
                            <span className="mt-2 text-xs font-medium text-[var(--brand-black)] leading-tight">
                              {tEn(it.name)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg bg-[var(--brand-black)] text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-bold">{tEn("Need help choosing the right device?")}</h3>
            <p className="text-sm text-white/80 mt-1">{tEn("Talk to our specialists for bulk orders, custom bundles and onboarding.")}</p>
          </div>
          <button
            type="button"
            onClick={() => { setEnquiryCtx({}); setEnquiryOpen(true); }}
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--brand-black)] bg-[var(--brand-yellow)] hover:brightness-105 transition"
          >
            {tEn("Contact Sales")}
          </button>
        </div>
      </section>
      <StoreEnquiryDialog
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        productName={enquiryCtx.productName}
        categoryName={enquiryCtx.categoryName}
      />
    </SiteLayout>
  );
}