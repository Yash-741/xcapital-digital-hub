import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout, PageHeader } from "@/components/site/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { submitLead } from "@/lib/leads.functions";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

type Cat = "loan" | "insurance" | "investment";

const PRODUCTS: Record<Cat, { slug: string; name: string }[]> = {
  loan: [
    { slug: "personal-loan", name: "Personal Loan" },
    { slug: "home-loan", name: "Home Loan" },
    { slug: "business-loan", name: "Business Loan" },
    { slug: "loans-for-doctors", name: "Loans for Doctors" },
    { slug: "loan-against-property", name: "Loan Against Property" },
    { slug: "loan-for-cas", name: "Loan for CAs" },
    { slug: "commercial-lending", name: "Commercial Lending" },
    { slug: "medical-equipment-finance", name: "Medical Equipment Finance" },
    { slug: "lease-rental-discounting", name: "Lease Rental Discounting" },
    { slug: "loan-against-securities", name: "Loan Against Securities" },
    { slug: "used-car-loan", name: "Used Car Loan" },
    { slug: "education-loan", name: "Education Loan" },
  ],
  insurance: [
    { slug: "health-insurance", name: "Health Insurance" },
    { slug: "life-insurance", name: "Life Insurance" },
    { slug: "medical-claim", name: "Medical Claim" },
  ],
  investment: [
    { slug: "fixed-deposits", name: "Fixed Deposits" },
    { slug: "bonds", name: "Bonds" },
  ],
};

export const Route = createFileRoute("/apply/$category/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Apply for ${params.slug.replace(/-/g, " ")} — XCapital` },
      { name: "description", content: "Submit your details and a XCapital advisor will reach out shortly." },
    ],
  }),
  component: ApplyPage,
});

function ApplyPage() {
  const { category, slug } = Route.useParams();
  const { t } = useI18n();
  const navigate = useNavigate();
  const cat = category as Cat;
  const product = useMemo(
    () => PRODUCTS[cat]?.find((p) => p.slug === slug),
    [cat, slug],
  );

  const send = useServerFn(submitLead);
  const [loading, setLoading] = useState(false);
  const [authState, setAuthState] = useState<"checking" | "in" | "out">("checking");
  const [userEmail, setUserEmail] = useState<string>("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [agree, setAgree] = useState(false);
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "",
    amount: "", tenure: "", coverage: "", age: "", horizon: "", notes: "",
  });

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (data.user) {
        setUserEmail(data.user.email ?? "");
        setForm((f) => ({ ...f, email: f.email || (data.user!.email ?? "") }));
        setAuthState("in");
      } else {
        setAuthState("out");
      }
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        setUserEmail(session.user.email ?? "");
        setAuthState("in");
      } else {
        setAuthState("out");
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!product) {
    return (
      <SiteLayout>
        <PageHeader title={t("apply.notFound.title")} subtitle={t("apply.notFound.subtitle")} />
        <div className="container-x py-12">
          <Link to="/" className="text-[var(--brand-navy)] underline">{t("apply.notFound.back")}</Link>
        </div>
      </SiteLayout>
    );
  }

  if (authState === "checking") {
    return (
      <SiteLayout>
        <PageHeader title={`${t("apply.title")} ${product.name}`} subtitle={t("apply.subtitle")} />
        <div className="container-x py-16 text-center text-muted-foreground">Loading…</div>
      </SiteLayout>
    );
  }

  if (authState === "out") {
    const redirectTo = `/apply/${cat}/${product.slug}`;
    return (
      <SiteLayout>
        <PageHeader
          eyebrow={t("apply.eyebrow")}
          title={`Sign in to apply for ${product.name}`}
          subtitle="Please sign in or create an account to submit your application."
        />
        <section className="container-x py-12">
          <div className="max-w-md mx-auto bg-card border border-border rounded-xl shadow-card p-6 md:p-8 text-center space-y-5">
            <p className="text-sm text-muted-foreground">
              You need to be signed in before you can apply. It only takes a moment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => navigate({ to: "/auth", search: { redirect: redirectTo } as never })}
                className="bg-[var(--brand-yellow)] text-[var(--brand-black)] font-semibold hover:brightness-105"
              >
                Sign in to continue
              </Button>
              <Link to="/" className="inline-flex items-center justify-center text-sm text-muted-foreground hover:underline px-4 py-2">
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agree) {
      toast.error("Please accept the Terms & Conditions and Privacy Policy");
      return;
    }
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        category: cat,
        product_slug: product!.slug,
        product_name: product!.name,
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      };
      if (cat === "loan") {
        if (form.amount) payload.amount = Number(form.amount);
        if (form.tenure) payload.tenure = form.tenure;
      } else if (cat === "insurance") {
        if (form.coverage) payload.coverage = Number(form.coverage);
        if (form.age) payload.age = Number(form.age);
      } else if (cat === "investment") {
        if (form.amount) payload.amount = Number(form.amount);
        if (form.horizon) payload.horizon = form.horizon;
      }
      if (form.notes) payload.notes = form.notes;

      await send({ data: payload as never });
      try {
        const { insertLead } = await import("@/lib/leads-insert");
        await insertLead({
          name: form.full_name,
          phone: form.phone,
          email: form.email,
          requirement: product!.name,
          category: cat === "loan" ? "Loan" : cat === "insurance" ? "Insurance" : "Investment",
          message: form.notes,
          source: `apply:${cat}`,
        });
      } catch {
        // non-fatal; primary submission already succeeded
      }
      setSuccessOpen(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("toast.somethingWrong");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const catLabel = cat === "loan" ? t("apply.cat.loan") : cat === "insurance" ? t("apply.cat.insurance") : t("apply.cat.investment");

  return (
    <SiteLayout>
      <PageHeader
        eyebrow={`${t("apply.eyebrow")} · ${catLabel}`}
        title={`${t("apply.title")} ${product.name}`}
        subtitle={t("apply.subtitle")}
      />
      <Dialog
        open={successOpen}
        onOpenChange={(v) => {
          setSuccessOpen(v);
          if (!v) navigate({ to: "/" });
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-[var(--brand-yellow-soft)] flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-[var(--brand-black)]" />
            </div>
            <DialogTitle className="text-center">Application received</DialogTitle>
            <DialogDescription className="text-center">
              {t("toast.advisorSuccess")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => {
                setSuccessOpen(false);
                navigate({ to: "/" });
              }}
              className="bg-[var(--brand-yellow)] text-[var(--brand-black)] font-semibold hover:brightness-105"
            >
              Back to home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <section className="container-x py-12">
        <form onSubmit={onSubmit} className="max-w-2xl bg-card border border-border rounded-xl shadow-card p-6 md:p-8 space-y-5">
          {userEmail && (
            <p className="text-xs text-muted-foreground">Signed in as <span className="font-medium">{userEmail}</span></p>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            <Field label={t("apply.field.fullName")} required>
              <Input required minLength={2} maxLength={120} value={form.full_name} onChange={set("full_name")} />
            </Field>
            <Field label={t("apply.field.phone")} required>
              <Input required type="tel" pattern="[0-9+\-\s]{7,20}" value={form.phone} onChange={set("phone")} />
            </Field>
          </div>
          <Field label={t("apply.field.email")} required>
            <Input required type="email" maxLength={255} value={form.email} onChange={set("email")} />
          </Field>

          {cat === "loan" && (
            <div className="grid md:grid-cols-2 gap-4">
              <Field label={t("apply.field.loanAmount")}>
                <Input type="number" min={0} value={form.amount} onChange={set("amount")} placeholder="e.g. 500000" />
              </Field>
              <Field label={t("apply.field.tenure")}>
                <Input value={form.tenure} onChange={set("tenure")} placeholder={t("apply.placeholder.tenure")} />
              </Field>
            </div>
          )}

          {cat === "insurance" && (
            <div className="grid md:grid-cols-2 gap-4">
              <Field label={t("apply.field.coverage")}>
                <Input type="number" min={0} value={form.coverage} onChange={set("coverage")} placeholder="e.g. 1000000" />
              </Field>
              <Field label={t("apply.field.age")}>
                <Input type="number" min={0} max={120} value={form.age} onChange={set("age")} placeholder="e.g. 32" />
              </Field>
            </div>
          )}

          {cat === "investment" && (
            <div className="grid md:grid-cols-2 gap-4">
              <Field label={t("apply.field.investAmount")}>
                <Input type="number" min={0} value={form.amount} onChange={set("amount")} placeholder="e.g. 100000" />
              </Field>
              <Field label={t("apply.field.horizon")}>
                <Input value={form.horizon} onChange={set("horizon")} placeholder={t("apply.placeholder.horizon")} />
              </Field>
            </div>
          )}

          <Field label={t("apply.field.notes")}>
            <Textarea rows={4} maxLength={1000} value={form.notes} onChange={set("notes")} placeholder={t("apply.placeholder.notes")} />
          </Field>

          <div className="flex items-start gap-2 pt-1">
            <Checkbox id="apply-agree" checked={agree} onCheckedChange={(v) => setAgree(v === true)} className="mt-0.5" />
            <Label htmlFor="apply-agree" className="text-xs font-normal leading-relaxed text-muted-foreground">
              I agree to the <Link to="/terms" className="underline text-[var(--brand-navy)]">Terms & Conditions</Link> and <Link to="/privacy" className="underline text-[var(--brand-navy)]">Privacy Policy</Link>.
            </Label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={loading || !agree} className="bg-[var(--brand-yellow)] text-[var(--brand-black)] font-semibold hover:brightness-105">
              {loading ? t("apply.submitting") : t("apply.submit")}
            </Button>
            <Link to="/about" className="text-sm text-muted-foreground hover:underline">{t("apply.contactDirect")}</Link>
          </div>
        </form>
      </section>
    </SiteLayout>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}