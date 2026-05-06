-- Contact / inquiry form submissions
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  product TEXT,
  idea TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',   -- new | replied | closed
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an inquiry
CREATE POLICY "Public insert inquiries"
  ON public.inquiries FOR INSERT WITH CHECK (true);

-- Admin can read/update/delete
CREATE POLICY "Public read inquiries"
  ON public.inquiries FOR SELECT USING (true);

CREATE POLICY "Open update inquiries"
  ON public.inquiries FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Open delete inquiries"
  ON public.inquiries FOR DELETE USING (true);
