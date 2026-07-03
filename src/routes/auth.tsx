import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Login or Register — XCapital" },
      { name: "description", content: "Sign in or create an XCapital account to apply for loans, investments and insurance." },
    ],
  }),
  component: AuthPage,
});

function safeRedirect(target: string | undefined): string {
  if (!target) return "/";
  if (target.startsWith("/") && !target.startsWith("//")) return target;
  return "/";
}

function AuthPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showForgot, setShowForgot] = useState(false);
  const { tEn } = useI18n();
  const { redirect: redirectParam } = Route.useSearch();
  const dest = safeRedirect(redirectParam);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: dest, replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        router.invalidate();
        navigate({ to: dest, replace: true });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, router, dest]);

  if (showForgot) {
    return (
      <SiteLayout>
        <PageHeader eyebrow={tEn("Account")} title={tEn("Reset Password")} subtitle={tEn("Enter your email and we'll send you a reset link.")} />
        <section className="container-x py-10 md:py-14">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-card border-b-[3px] border-[var(--brand-yellow)] p-6 md:p-8">
            <ForgotPasswordForm onBack={() => setShowForgot(false)} />
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHeader eyebrow={tEn("Account")} title={tEn("Login or Register")} subtitle={tEn("Access your XCapital account to apply, track and manage.")} />
      <section className="container-x py-10 md:py-14">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-card border-b-[3px] border-[var(--brand-yellow)] p-6 md:p-8">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")}>
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="login">{tEn("Login")}</TabsTrigger>
              <TabsTrigger value="register">{tEn("Register")}</TabsTrigger>
            </TabsList>
            <TabsContent value="login"><LoginForm onForgotPassword={() => setShowForgot(true)} /></TabsContent>
            <TabsContent value="register"><RegisterForm onDone={() => setTab("login")} /></TabsContent>
          </Tabs>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px bg-border flex-1" /> {tEn("OR")} <div className="h-px bg-border flex-1" />
          </div>
          <GoogleButton redirectPath={dest} />

          <p className="text-xs text-muted-foreground text-center mt-6">
            {tEn("By continuing you agree to our terms and privacy policy.")}
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}

function LoginForm({ onForgotPassword }: { onForgotPassword: () => void }) {
  const { tEn } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const emailSchema = z.string().trim().email(tEn("Enter a valid email")).max(255);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ev = emailSchema.safeParse(email);
    const pv = z.string().min(1, tEn("Password is required")).safeParse(password);
    if (!ev.success) return toast.error(ev.error.issues[0].message);
    if (!pv.success) return toast.error(pv.error.issues[0].message);
    if (!agree) return toast.error(tEn("Please accept the Terms & Conditions and Privacy Policy"));
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: ev.data, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(tEn("Signed in"));
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="li-email">{tEn("Email")}</Label>
        <Input id="li-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="li-pass">{tEn("Password")}</Label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-[var(--brand-black)] underline hover:opacity-75 transition-opacity"
          >
            {tEn("Forgot password?")}
          </button>
        </div>
        <Input id="li-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div className="flex items-start gap-2">
        <Checkbox id="li-agree" checked={agree} onCheckedChange={(v) => setAgree(v === true)} className="mt-0.5" />
        <Label htmlFor="li-agree" className="text-xs font-normal leading-relaxed text-muted-foreground">
          {tEn("I agree to the")} <Link to="/terms" className="underline text-[var(--brand-navy)]">{tEn("Terms & Conditions")}</Link> {tEn("and")} <Link to="/privacy" className="underline text-[var(--brand-navy)]">{tEn("Privacy Policy")}</Link>.
        </Label>
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-[var(--brand-yellow)] text-[var(--brand-black)] hover:brightness-105">
        {loading ? tEn("Signing in...") : tEn("Login")}
      </Button>
    </form>
  );
}

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const { tEn } = useI18n();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const emailSchema = z.string().trim().email(tEn("Enter a valid email")).max(255);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ev = emailSchema.safeParse(email);
    if (!ev.success) return toast.error(ev.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(ev.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl">📧</div>
        <h3 className="text-lg font-semibold">{tEn("Check your email")}</h3>
        <p className="text-sm text-muted-foreground">
          {tEn("We've sent a password reset link to")} <strong>{email}</strong>. {tEn("Click the link in the email to reset your password.")}
        </p>
        <Button variant="outline" onClick={onBack} className="w-full">
          {tEn("Back to Login")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="fp-email">{tEn("Email address")}</Label>
        <Input id="fp-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your registered email" required />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-[var(--brand-yellow)] text-[var(--brand-black)] hover:brightness-105">
        {loading ? tEn("Sending...") : tEn("Send Reset Link")}
      </Button>
      <Button type="button" variant="outline" onClick={onBack} className="w-full">
        {tEn("Back to Login")}
      </Button>
    </form>
  );
}

function RegisterForm({ onDone }: { onDone: () => void }) {
  const { tEn } = useI18n();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const emailSchema = z.string().trim().email(tEn("Enter a valid email")).max(255);
  const passwordSchema = z.string().min(8, tEn("Password must be at least 8 characters")).max(72);
  const nameSchema = z.string().trim().min(2, tEn("Enter your full name")).max(100);
  const phoneSchema = z.string().trim().regex(/^[0-9+\-\s()]{7,20}$/, tEn("Enter a valid phone number"));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nv = nameSchema.safeParse(fullName);
    const phv = phoneSchema.safeParse(phone);
    const ev = emailSchema.safeParse(email);
    const pv = passwordSchema.safeParse(password);
    for (const r of [nv, phv, ev, pv]) {
      if (!r.success) return toast.error(r.error.issues[0].message);
    }
    if (!agree) return toast.error(tEn("Please accept the Terms & Conditions and Privacy Policy"));
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: ev.data!,
      password: pv.data!,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: nv.data, phone: phv.data },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(tEn("Check your email to confirm your account."));
    onDone();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="r-name">{tEn("Full name")}</Label>
        <Input id="r-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="r-phone">{tEn("Phone")}</Label>
        <Input id="r-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="r-email">{tEn("Email")}</Label>
        <Input id="r-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="r-pass">{tEn("Password")}</Label>
        <Input id="r-pass" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <p className="text-xs text-muted-foreground">{tEn("At least 8 characters.")}</p>
      </div>
      <div className="flex items-start gap-2">
        <Checkbox id="r-agree" checked={agree} onCheckedChange={(v) => setAgree(v === true)} className="mt-0.5" />
        <Label htmlFor="r-agree" className="text-xs font-normal leading-relaxed text-muted-foreground">
          {tEn("I agree to the")} <Link to="/terms" className="underline text-[var(--brand-navy)]">{tEn("Terms & Conditions")}</Link> {tEn("and")} <Link to="/privacy" className="underline text-[var(--brand-navy)]">{tEn("Privacy Policy")}</Link>.
        </Label>
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-[var(--brand-yellow)] text-[var(--brand-black)] hover:brightness-105">
        {loading ? tEn("Creating account...") : tEn("Create account")}
      </Button>
    </form>
  );
}

function GoogleButton({ redirectPath }: { redirectPath: string }) {
  const { tEn } = useI18n();
  const [loading, setLoading] = useState(false);
  async function onClick() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${redirectPath}`,
      },
    });
    if (error) {
      setLoading(false);
      toast.error(error.message || tEn("Google sign-in failed"));
      return;
    }
  }
  return (
    <Button type="button" variant="outline" onClick={onClick} disabled={loading} className="w-full">
      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.67-2.26 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.1 14.96 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
      </svg>
      {tEn("Continue with Google")}
    </Button>
  );
}
