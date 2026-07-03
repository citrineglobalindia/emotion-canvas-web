-- Testimonials: client quotes shown on the homepage, managed from the admin panel.

CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  quote TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published testimonials"
  ON public.testimonials FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can view all testimonials"
  ON public.testimonials FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update testimonials"
  ON public.testimonials FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_testimonials_published ON public.testimonials (published, sort_order);

INSERT INTO public.testimonials (name, role, quote, sort_order) VALUES
('Priya & Arjun', 'Udaipur', 'They didn''t just capture our wedding — they captured our souls. Every frame tells our story with a depth of emotion we didn''t think was possible.', 1),
('Sarah & Michael', 'Tuscany', 'The most cinematic, breathtaking wedding film we''ve ever seen. Our families have watched it a hundred times and still cry every time.', 2),
('Aisha & Ravi', 'Jaipur', 'Working with them felt like working with true artists. They understood our vision and elevated it beyond anything we imagined.', 3),
('Meera & Karan', 'Goa', 'Calm, accommodating, and wonderful — it felt like having close friends capture the most important day of our lives.', 4),
('Anita & Dev', 'Delhi', 'Every minute detail in the frame was perfect. They go the extra mile, and it shows in every photograph.', 5),
('Zara & Kabir', 'Kerala', 'Beyond breathtaking. They turned fleeting moments into timeless art we will treasure for generations.', 6);
