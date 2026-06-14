ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS category text;
CREATE INDEX IF NOT EXISTS idx_leads_category ON public.leads(category);