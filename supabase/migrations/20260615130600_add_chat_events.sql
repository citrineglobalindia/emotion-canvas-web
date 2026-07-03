-- Chat events: log when a visitor opens the chatbot or sends their first message,
-- so admins get an in-app notification. Two event types are tracked separately:
--   'opened'        -> visitor opened the chat window
--   'first_message' -> visitor sent their first message (message text included)

CREATE TABLE public.chat_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('opened', 'first_message')),
  message TEXT,
  path TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_events ENABLE ROW LEVEL SECURITY;

-- Anyone (anonymous visitors included) may log an event, with light validation
-- so the endpoint can't be abused to store large payloads.
CREATE POLICY "Anyone can log chat events"
  ON public.chat_events
  FOR INSERT
  TO public
  WITH CHECK (
    event_type IN ('opened', 'first_message')
    AND (message IS NULL OR char_length(message) <= 2000)
    AND (path IS NULL OR char_length(path) <= 300)
  );

-- Only admins can read, mark-as-read, or clear notifications.
CREATE POLICY "Admins can view chat events"
  ON public.chat_events
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update chat events"
  ON public.chat_events
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete chat events"
  ON public.chat_events
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_chat_events_created_at ON public.chat_events (created_at DESC);
CREATE INDEX idx_chat_events_unread ON public.chat_events (read) WHERE read = false;

-- Enable realtime so the admin bell updates live without polling.
ALTER TABLE public.chat_events REPLICA IDENTITY FULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'chat_events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_events;
  END IF;
END $$;
