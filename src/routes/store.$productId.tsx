import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Phone, Mail } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { findProduct, type Product } from "@/lib/store-products";

export const Route = createFileRoute("/store/$productId")({
  loader: ({ params }) => {
    const found = findProduct(params.productId);
    if (!found) throw notFound();
    return found;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product — X Capital Store" }] };
    const { product, category } = loaderData;
    const title = `${product.name} — ${category.title} | X Capital Store`;
    const desc = product.description;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-x py-20 text-center">
        <h1 className="text-2xl font-bold text-[var(--brand-black)]">Product not found</h1>
        <p className="text-muted-foreground mt-2">The product you're looking for doesn't exist.</p>
        <Link to="/store" className="inline-block mt-6 text-sm font-semibold text-[var(--brand-black)] underline">Back to Store</Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error, reset }) => (
    <SiteLayout>
      <div className="container-x py-20 text-center">
        <h1 className="text-2xl font-bold text-[var(--brand-black)]">Something went wrong</h1>
        <p className="text-muted-foreground mt-2">{error.message}</p>
        <button onClick={reset} className="mt-6 text-sm font-semibold underline">Try again</button>
      </div>
    </SiteLayout>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product, category, sub } = Route.useLoaderData();
  const Icon = product.icon;
  const related = sub.items.filter((i: Product) => i.slug !== product.slug).slice(0, 6);

  return (
    <SiteLayout>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="container-x py-3 text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
          <Link to="/store" className="hover:text-[var(--brand-black)]">Store</Link>
          <span>/</span>
          <a href={`/store#${category.id}`} className="hover:text-[var(--brand-black)]">{category.title}</a>
          <span>/</span>
          <span className="text-[var(--brand-black)] font-medium">{product.name}</span>
        </div>
      </div>

      <section className="bg-white border-b-4 border-[var(--brand-yellow)]">
        <div className="container-x py-10 md:py-14 grid gap-8 md:grid-cols-[auto_1fr] items-start">
          <div className="h-32 w-32 md:h-40 md:w-40 grid place-items-center rounded-lg bg-[var(--brand-yellow-soft)] text-[var(--brand-black)] shrink-0">
            <Icon className="h-16 w-16 md:h-20 md:w-20" strokeWidth={1.25} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--brand-black)]/60 font-semibold">{sub.name}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-black)] mt-1">{product.name}</h1>
            <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">{product.description}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/about" hash="reach-us" className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--brand-black)] bg-[var(--brand-yellow)] hover:brightness-105 transition">
                Request a Quote
              </Link>
              <a href="tel:+918879109148" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border border-border bg-white hover:border-[var(--brand-yellow)] transition">
                <Phone className="h-4 w-4" /> +91 88791 09148
              </a>
              <a href="mailto:info@xcapital.co.in" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border border-border bg-white hover:border-[var(--brand-yellow)] transition">
                <Mail className="h-4 w-4" /> Email Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-10 grid gap-8 md:grid-cols-3">
        <div className="bg-white rounded-lg shadow-card border-b-[3px] border-[var(--brand-yellow)] p-6">
          <h2 className="text-sm font-bold text-[var(--brand-black)] uppercase tracking-wide mb-4">Key Features</h2>
          <ul className="space-y-3">
            {product.features.map((f: string) => (
              <li key={f} className="flex items-start gap-2 text-sm text-[var(--brand-black)]/85">
                <Check className="h-4 w-4 text-[var(--brand-black)] bg-[var(--brand-yellow)] rounded-full p-0.5 mt-0.5 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-card border-b-[3px] border-[var(--brand-yellow)] p-6">
          <h2 className="text-sm font-bold text-[var(--brand-black)] uppercase tracking-wide mb-4">Best For</h2>
          <ul className="space-y-2">
            {product.useCases.map((u: string) => (
              <li key={u} className="text-sm text-[var(--brand-black)]/85 leading-relaxed">• {u}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-card border-b-[3px] border-[var(--brand-yellow)] p-6">
          <h2 className="text-sm font-bold text-[var(--brand-black)] uppercase tracking-wide mb-4">Specs & Pricing</h2>
          <ul className="space-y-2">
            {product.specs.map((s: string) => (
              <li key={s} className="text-sm text-[var(--brand-black)]/85 leading-relaxed">• {s}</li>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x pb-12">
          <h2 className="text-lg font-bold text-[var(--brand-black)] mb-4">More in {sub.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {related.map((r: Product) => {
              const RIcon = r.icon;
              return (
                <Link
                  key={r.slug}
                  to="/store/$productId"
                  params={{ productId: r.slug }}
                  className="group flex flex-col items-center text-center p-3 rounded-md border border-border bg-white hover:border-[var(--brand-yellow)] hover:bg-[var(--brand-yellow-soft)] transition"
                >
                  <div className="h-12 w-12 grid place-items-center rounded-md bg-[var(--brand-yellow-soft)] text-[var(--brand-black)] group-hover:bg-white">
                    <RIcon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <span className="mt-2 text-xs font-medium text-[var(--brand-black)] leading-tight">{r.name}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="container-x pb-16">
        <Link to="/store" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-black)] hover:text-[var(--brand-black)]/70">
          <ArrowLeft className="h-4 w-4" /> Back to Store
        </Link>
      </section>
    </SiteLayout>
  );
}