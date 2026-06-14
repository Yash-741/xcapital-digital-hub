
ALTER TABLE public.service_leads
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'New';

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'service_leads_status_check'
  ) THEN
    ALTER TABLE public.service_leads
      ADD CONSTRAINT service_leads_status_check
      CHECK (status IN ('New','Contacted','In Progress','Closed'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_service_leads_user_id ON public.service_leads(user_id);
CREATE INDEX IF NOT EXISTS idx_service_leads_created_at ON public.service_leads(created_at DESC);

DROP POLICY IF EXISTS "Users can view their own service leads" ON public.service_leads;
CREATE POLICY "Users can view their own service leads"
  ON public.service_leads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
