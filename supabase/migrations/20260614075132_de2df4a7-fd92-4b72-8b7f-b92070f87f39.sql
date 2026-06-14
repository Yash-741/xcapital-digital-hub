-- 1) Lock down user_roles writes
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2) Remove permissive INSERT on leads (server fn will use service role)
DROP POLICY IF EXISTS "Anyone can insert a lead" ON public.leads;
REVOKE INSERT ON public.leads FROM anon;
REVOKE INSERT ON public.leads FROM authenticated;

-- 3) service_leads: lock down and add admin-only access policies
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.service_leads;
REVOKE INSERT ON public.service_leads FROM anon;
REVOKE INSERT ON public.service_leads FROM authenticated;

CREATE POLICY "Admins can view service leads" ON public.service_leads
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update service leads" ON public.service_leads
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete service leads" ON public.service_leads
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 4) Restrict EXECUTE on has_role (anon should not call it)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;