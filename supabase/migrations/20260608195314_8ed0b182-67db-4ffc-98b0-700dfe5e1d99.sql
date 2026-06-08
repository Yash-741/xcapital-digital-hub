CREATE TABLE public.service_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('loan','insurance','investment')),
  product_slug text NOT NULL,
  product_name text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  amount numeric,
  tenure text,
  coverage numeric,
  age integer,
  horizon text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.service_leads TO anon, authenticated;
GRANT ALL ON public.service_leads TO service_role;

ALTER TABLE public.service_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
ON public.service_leads FOR INSERT
TO anon, authenticated
WITH CHECK (true);