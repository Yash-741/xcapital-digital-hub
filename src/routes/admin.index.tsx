import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "XCapital Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

async function isAdmin(userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) return false;
  return !!data;
}

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user && (await isAdmin(data.user.id))) {
        navigate({ to: "/admin/dashboard", replace: true });
      }
    })();
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.user) {
      setLoading(false);
      toast.error("Invalid email or password");
      return;
    }
    const ok = await isAdmin(data.user.id);
    if (!ok) {
      await supabase.auth.signOut();
      setLoading(false);
      toast.error("Invalid email or password");
      return;
    }
    navigate({ to: "/admin/dashboard", replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1438] px-4">
      <div className="w-full max-w-sm space-y-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to website
        </Link>
        <form
        onSubmit={onSubmit}
        className="w-full bg-white rounded-xl shadow-xl border-b-4 border-[var(--brand-yellow)] p-8 space-y-5"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0a1438]">XCapital Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage leads</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0a1438] hover:bg-[#15235c] text-white"
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>
        </form>
      </div>
    </div>
  );
}