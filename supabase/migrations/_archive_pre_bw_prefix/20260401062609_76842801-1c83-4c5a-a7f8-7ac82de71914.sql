DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;

CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
TO public
WITH CHECK (
  char_length(trim(name)) BETWEEN 1 AND 120
  AND char_length(trim(email)) BETWEEN 3 AND 255
  AND position('@' IN email) > 1
  AND (phone IS NULL OR char_length(trim(phone)) <= 30)
  AND (service IS NULL OR char_length(trim(service)) <= 120)
  AND (message IS NULL OR char_length(trim(message)) <= 5000)
  AND (location IS NULL OR char_length(trim(location)) <= 255)
  AND status = 'new'
  AND notes IS NULL
  AND responded_at IS NULL
);