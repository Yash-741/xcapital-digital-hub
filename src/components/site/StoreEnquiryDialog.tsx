import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";
import { insertLead } from "@/lib/leads-insert";

type Form = { name: string; phone: string; email: string; message: string };
type Errs = Partial<Record<keyof Form, string>>;

export function StoreEnquiryDialog({
  open, onOpenChange, productName, categoryName,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  productName?: string;
  categoryName?: string;
}) {
  const { t, tEn } = useI18n();
  const schema = z.object({
    name: z.string().trim().min(2, t("validation.name")).max(100, t("validation.nameMax")),
    phone: z.string().trim().regex(/^(\+?91[\-\s]?)?[6-9]\d{9}$/, t("validation.phoneIN")),
    email: z.string().trim().email(t("validation.email")).max(255, t("validation.emailMax")),
    message: z.string().trim().min(10, t("validation.messageMin")).max(1000, t("validation.messageMax")),
  });
  const initial: Form = {
    name: "", phone: "", email: "",
    message: productName
      ? `${tEn("I'd like a quote for")} ${tEn(productName)}.`
      : "",
  };
  const [form, setForm] = useState<Form>(initial);
  const [errs, setErrs] = useState<Errs>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (k: keyof Form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errs[k]) setErrs((e) => ({ ...e, [k]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const next: Errs = {};
      for (const i of r.error.issues) {
        const k = i.path[0] as keyof Form;
        if (!next[k]) next[k] = i.message;
      }
      setErrs(next);
      toast.error(t("toast.fixFields"));
      return;
    }
    setSubmitting(true);
    try {
      await insertLead({
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: form.message,
        requirement: productName || categoryName || "Store enquiry",
        category: categoryName || "Store",
        source: productName ? `store:${productName}` : "store",
      });
      toast.success("Thank you! Our team will contact you shortly.");
      onOpenChange(false);
      setForm({ ...initial });
    } catch {
      toast.error("Something went wrong, please try again");
    } finally {
      setSubmitting(false);
    }
  };

  const title = productName
    ? `${tEn("Request a Quote")} — ${tEn(productName)}`
    : tEn("Contact Sales");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--brand-black)]">{title}</DialogTitle>
          <DialogDescription>
            {categoryName ? tEn(categoryName) + " · " : ""}
            {tEn("Share a few details and our team will reach out within one business day.")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3" noValidate>
          {([
            { k: "name", placeholder: t("about.reach.placeholder.name"), type: "text", maxLength: 100 },
            { k: "phone", placeholder: t("about.reach.placeholder.phone"), type: "tel", maxLength: 15 },
            { k: "email", placeholder: t("about.reach.placeholder.email"), type: "email", maxLength: 255 },
          ] as const).map((f) => (
            <div key={f.k}>
              <input
                type={f.type}
                value={form[f.k]}
                onChange={(e) => update(f.k, e.target.value)}
                placeholder={f.placeholder}
                maxLength={f.maxLength}
                aria-invalid={!!errs[f.k]}
                className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-yellow)] ${
                  errs[f.k] ? "border-destructive" : "border-border"
                }`}
              />
              {errs[f.k] && <p className="text-xs text-destructive mt-1">{errs[f.k]}</p>}
            </div>
          ))}
          <div>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder={t("about.reach.placeholder.message")}
              maxLength={1000}
              aria-invalid={!!errs.message}
              className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-yellow)] ${
                errs.message ? "border-destructive" : "border-border"
              }`}
            />
            {errs.message && <p className="text-xs text-destructive mt-1">{errs.message}</p>}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--brand-black)] bg-[var(--brand-yellow)] hover:brightness-105 transition disabled:opacity-60"
          >
            {submitting ? tEn("Sending…") : t("about.reach.submit")}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}