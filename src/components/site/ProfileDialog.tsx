import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ProfileDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);
  // True when the account has an email/password identity (i.e. a password
  // was ever set). False for accounts created purely via Google OAuth —
  // those users have no current password to verify, so we let them set one.
  const [hasPasswordIdentity, setHasPasswordIdentity] = useState(true);

  useEffect(() => {
    if (!open) return;
    (async () => {
      setLoadingProfile(true);
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      if (!u) { setLoadingProfile(false); return; }
      setUserId(u.id);
      setEmail(u.email ?? "");
      const providers = (u.identities ?? []).map((i) => i.provider);
      setHasPasswordIdentity(providers.includes("email"));
      const { data: p } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", u.id)
        .maybeSingle();
      setFullName(p?.full_name ?? (u.user_metadata?.full_name as string) ?? "");
      setPhone(p?.phone ?? (u.user_metadata?.phone as string) ?? "");
      setLoadingProfile(false);
    })();
  }, [open]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId, full_name: fullName.trim() || null, phone: phone.trim() || null }, { onConflict: "id" });
    setSavingProfile(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPwd.length < 8) return toast.error("New password must be at least 8 characters");
    if (newPwd !== confirmPwd) return toast.error("Passwords do not match");
    if (!email) return toast.error("No email on this account");
    setSavingPwd(true);
    if (hasPasswordIdentity) {
      // Re-verify current password to prevent silent session hijack changes
      const { error: verifyErr } = await supabase.auth.signInWithPassword({ email, password: currentPwd });
      if (verifyErr) {
        setSavingPwd(false);
        return toast.error("Current password is incorrect");
      }
    }
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    setSavingPwd(false);
    if (error) return toast.error(error.message);
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    toast.success(hasPasswordIdentity ? "Password updated" : "Password set — you can now sign in with email and password");
    setHasPasswordIdentity(true);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>Manage your profile and password.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="profile">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <form onSubmit={saveProfile} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input value={email} disabled />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pf-name">Full name</Label>
                <Input id="pf-name" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loadingProfile} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pf-phone">Phone</Label>
                <Input id="pf-phone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loadingProfile} />
              </div>
              <Button type="submit" disabled={savingProfile || loadingProfile} className="w-full bg-[#0a1438] hover:bg-[#15235c] text-white">
                {savingProfile ? "Saving…" : "Save profile"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="password">
            <form onSubmit={changePassword} className="space-y-4 pt-2">
              {hasPasswordIdentity ? (
                <div className="space-y-1.5">
                  <Label htmlFor="cp-curr">Current password</Label>
                  <Input id="cp-curr" type="password" autoComplete="current-password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} required />
                </div>
              ) : (
                <p className="text-xs text-muted-foreground bg-muted/50 border border-border rounded-md p-3">
                  You signed in with Google, so there's no current password. Set a password below to also enable email + password login.
                </p>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="cp-new">{hasPasswordIdentity ? "New password" : "Set password"}</Label>
                <Input id="cp-new" type="password" autoComplete="new-password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} required />
                <p className="text-xs text-muted-foreground">At least 8 characters.</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cp-confirm">Confirm password</Label>
                <Input id="cp-confirm" type="password" autoComplete="new-password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} required />
              </div>
              <Button type="submit" disabled={savingPwd} className="w-full bg-[#0a1438] hover:bg-[#15235c] text-white">
                {savingPwd ? (hasPasswordIdentity ? "Updating…" : "Setting…") : (hasPasswordIdentity ? "Change password" : "Set password")}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}