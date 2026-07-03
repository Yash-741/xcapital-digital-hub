import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — XCapital" },
      { name: "description", content: "Set a new password for your XCapital account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { tEn } = useI18n();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase sets the session from the URL hash automatically
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pv = z.string().min(8, tEn("Password must be at least 8 characters")).max(72).safeParse(password);
    if (!pv.success) return toast.error(pv.error.issues[0].message);
    if (password !== confirm) return toast.error(tEn("Passwords do not match"));
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pv.data });
    setLoading(false);
    if (error) return toast.error(error.message);
    setDone(true);
    toast.success(tEn("Password updated successfully"));
    setTimeout(() => navigate({ to: "/auth" }), 3000);
  }

  if (done) {
    return (
      <SiteLayout>
        <PageHeader eyebrow={tEn("Account")} title={tEn("Password Updated!")} subtitle={tEn("Your password has been reset successfully. Redirecting to login...")} />
        <section className="container-x py-10">
          <div className="max-w-md mx-auto text-center">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-muted-foreground">Redirecting to login in 3 seconds...</p>
          </div>
        </section>
      </SiteLayout>
    );
  }

  if (!ready) {
    return (
      <SiteLayout>
        <PageHeader eyebrow={tEn("Account")} title={tEn("Reset Password")} subtitle={tEn("Verifying your reset link...")} />
        <section className="container-x py-10">
          <div className="max-w-md mx-auto text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-muted-foreground">Please wait while we verify your reset link...</p>
            <p className="text-xs text-muted-foreground mt-4">If this takes too long, please request a new reset link from the login page.</p>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHeader eyebrow={tEn("Account")} title={tEn("Set New Password")} subtitle={tEn("Choose a strong password for your account.")} />
      <section className="container-x py-10 md:py-14">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-card border-b-[3px] border-[var(--brand-yellow)] p-6 md:p-8">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="rp-pass">{tEn("New Password")}</Label>
              <Input
                id="rp-pass" type="password" autoComplete="new-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters" required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rp-confirm">{tEn("Confirm Password")}</Label>
              <Input
                id="rp-confirm" type="password" autoComplete="new-password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password" required
              />
            </div>
            <Button
              type="submit" disabled={loading}
              className="w-full bg-[var(--brand-yellow)] text-[var(--brand-black)] hover:brightness-105"
            >
              {loading ? tEn("Updating...") : tEn("Update Password")}
            </Button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
