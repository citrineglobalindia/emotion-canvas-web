-- Baseline schema for the Stories by Black & White website.
--
-- WHY THIS FILE EXISTS
-- The Supabase project backing this site is shared with other products, so
-- every object this site owns is namespaced `bw_`: tables (`bw_stories`),
-- functions (`bw_has_role`), the role enum (`bw_app_role`) and the storage
-- bucket (`bw-media-library`). The original Lovable-generated migrations
-- created unprefixed objects (`stories`, `has_role`, `media-library`) that do
-- not exist in the live database — running them against a fresh project
-- produced a schema the application could not talk to. They are kept for
-- history in `_archive_pre_bw_prefix/` and are no longer applied.
--
-- This file reproduces the live schema exactly and is safe to re-run: tables
-- and indexes use IF NOT EXISTS, policies and triggers are dropped first, and
-- functions use CREATE OR REPLACE.
--
-- After changing the schema here, regenerate the TypeScript types:
--   python3 scripts/gen-types.py

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.bw_contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bw_contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.bw_contact_submissions;
CREATE POLICY "Anyone can submit contact form"
ON public.bw_contact_submissions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "No public reads on contact submissions" ON public.bw_contact_submissions;
CREATE POLICY "No public reads on contact submissions"
ON public.bw_contact_submissions FOR SELECT
  USING (false);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.bw_blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  read_time TEXT DEFAULT '5 min read',
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bw_blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read published blog posts" ON public.bw_blog_posts;
CREATE POLICY "Anyone can read published blog posts"
ON public.bw_blog_posts FOR SELECT
  USING (published = true);

CREATE OR REPLACE FUNCTION public.bw_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_bw_blog_posts_updated_at ON public.bw_blog_posts;
CREATE TRIGGER update_bw_blog_posts_updated_at
BEFORE UPDATE ON public.bw_blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.bw_update_updated_at_column();

ALTER TABLE public.bw_contact_submissions ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.bw_contact_submissions ADD COLUMN IF NOT EXISTS service TEXT;

DO $do$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
                 WHERE t.typname = 'bw_app_role' AND n.nspname = 'public') THEN
    CREATE TYPE public.bw_app_role AS ENUM ('admin', 'editor', 'user');
  END IF;
END $do$;

CREATE TABLE IF NOT EXISTS public.bw_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bw_profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.bw_user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.bw_app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.bw_user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.bw_has_role(_user_id UUID, _role public.bw_app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.bw_user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.bw_claim_first_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user UUID := auth.uid();
BEGIN
  IF current_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.bw_user_roles
    WHERE role = 'admin'
  ) THEN
    RETURN public.bw_has_role(current_user, 'admin');
  END IF;

  INSERT INTO public.bw_user_roles (user_id, role)
  VALUES (current_user, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN public.bw_has_role(current_user, 'admin');
END;
$$;

CREATE TABLE IF NOT EXISTS public.bw_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  couple_names TEXT NOT NULL,
  location TEXT,
  year_label TEXT,
  duration_label TEXT,
  excerpt TEXT,
  intro TEXT,
  cover_image_url TEXT,
  film_url TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bw_stories ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.bw_story_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES public.bw_stories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bw_story_sections ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.bw_story_gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES public.bw_stories(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bw_story_gallery_items ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.bw_site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL,
  section_key TEXT NOT NULL,
  heading TEXT,
  subheading TEXT,
  body TEXT,
  image_url TEXT,
  cta_label TEXT,
  cta_href TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bw_site_content ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.bw_media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id TEXT NOT NULL DEFAULT 'bw-media-library',
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  alt_text TEXT,
  caption TEXT,
  mime_type TEXT,
  file_size BIGINT,
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  uploaded_by UUID,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bw_media_assets ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.bw_contact_submissions
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS responded_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_bw_stories_published_sort ON public.bw_stories (published, sort_order);
CREATE INDEX IF NOT EXISTS idx_bw_story_sections_story_sort ON public.bw_story_sections (story_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_bw_story_gallery_story_sort ON public.bw_story_gallery_items (story_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_bw_site_content_page_section_sort ON public.bw_site_content (page_key, section_key, sort_order);
CREATE INDEX IF NOT EXISTS idx_bw_media_assets_bucket_public ON public.bw_media_assets (bucket_id, is_public);
CREATE INDEX IF NOT EXISTS idx_bw_contact_submissions_status_created_at ON public.bw_contact_submissions (status, created_at DESC);

DROP POLICY IF EXISTS "Users can view their own profile" ON public.bw_profiles;
CREATE POLICY "Users can view their own profile"
ON public.bw_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own profile" ON public.bw_profiles;
CREATE POLICY "Users can create their own profile"
ON public.bw_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.bw_profiles;
CREATE POLICY "Users can update their own profile"
ON public.bw_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.bw_profiles;
CREATE POLICY "Admins can view all profiles"
ON public.bw_profiles
FOR SELECT
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.bw_profiles;
CREATE POLICY "Admins can update all profiles"
ON public.bw_profiles
FOR UPDATE
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'))
WITH CHECK (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can view their own roles" ON public.bw_user_roles;
CREATE POLICY "Users can view their own roles"
ON public.bw_user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all roles" ON public.bw_user_roles;
CREATE POLICY "Admins can view all roles"
ON public.bw_user_roles
FOR SELECT
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can create roles" ON public.bw_user_roles;
CREATE POLICY "Admins can create roles"
ON public.bw_user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update roles" ON public.bw_user_roles;
CREATE POLICY "Admins can update roles"
ON public.bw_user_roles
FOR UPDATE
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'))
WITH CHECK (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete roles" ON public.bw_user_roles;
CREATE POLICY "Admins can delete roles"
ON public.bw_user_roles
FOR DELETE
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can view published stories" ON public.bw_stories;
CREATE POLICY "Anyone can view published stories"
ON public.bw_stories
FOR SELECT
TO public
USING (published = true);

DROP POLICY IF EXISTS "Admins can view all stories" ON public.bw_stories;
CREATE POLICY "Admins can view all stories"
ON public.bw_stories
FOR SELECT
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can create stories" ON public.bw_stories;
CREATE POLICY "Admins can create stories"
ON public.bw_stories
FOR INSERT
TO authenticated
WITH CHECK (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update stories" ON public.bw_stories;
CREATE POLICY "Admins can update stories"
ON public.bw_stories
FOR UPDATE
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'))
WITH CHECK (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete stories" ON public.bw_stories;
CREATE POLICY "Admins can delete stories"
ON public.bw_stories
FOR DELETE
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can view sections for published stories" ON public.bw_story_sections;
CREATE POLICY "Anyone can view sections for published stories"
ON public.bw_story_sections
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1
    FROM public.bw_stories s
    WHERE s.id = story_id
      AND s.published = true
  )
);

DROP POLICY IF EXISTS "Admins can view all story sections" ON public.bw_story_sections;
CREATE POLICY "Admins can view all story sections"
ON public.bw_story_sections
FOR SELECT
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can create story sections" ON public.bw_story_sections;
CREATE POLICY "Admins can create story sections"
ON public.bw_story_sections
FOR INSERT
TO authenticated
WITH CHECK (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update story sections" ON public.bw_story_sections;
CREATE POLICY "Admins can update story sections"
ON public.bw_story_sections
FOR UPDATE
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'))
WITH CHECK (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete story sections" ON public.bw_story_sections;
CREATE POLICY "Admins can delete story sections"
ON public.bw_story_sections
FOR DELETE
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can view gallery items for published stories" ON public.bw_story_gallery_items;
CREATE POLICY "Anyone can view gallery items for published stories"
ON public.bw_story_gallery_items
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1
    FROM public.bw_stories s
    WHERE s.id = story_id
      AND s.published = true
  )
);

DROP POLICY IF EXISTS "Admins can view all story gallery items" ON public.bw_story_gallery_items;
CREATE POLICY "Admins can view all story gallery items"
ON public.bw_story_gallery_items
FOR SELECT
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can create story gallery items" ON public.bw_story_gallery_items;
CREATE POLICY "Admins can create story gallery items"
ON public.bw_story_gallery_items
FOR INSERT
TO authenticated
WITH CHECK (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update story gallery items" ON public.bw_story_gallery_items;
CREATE POLICY "Admins can update story gallery items"
ON public.bw_story_gallery_items
FOR UPDATE
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'))
WITH CHECK (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete story gallery items" ON public.bw_story_gallery_items;
CREATE POLICY "Admins can delete story gallery items"
ON public.bw_story_gallery_items
FOR DELETE
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can view published site content" ON public.bw_site_content;
CREATE POLICY "Anyone can view published site content"
ON public.bw_site_content
FOR SELECT
TO public
USING (published = true);

DROP POLICY IF EXISTS "Admins can view all site content" ON public.bw_site_content;
CREATE POLICY "Admins can view all site content"
ON public.bw_site_content
FOR SELECT
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can create site content" ON public.bw_site_content;
CREATE POLICY "Admins can create site content"
ON public.bw_site_content
FOR INSERT
TO authenticated
WITH CHECK (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update site content" ON public.bw_site_content;
CREATE POLICY "Admins can update site content"
ON public.bw_site_content
FOR UPDATE
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'))
WITH CHECK (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete site content" ON public.bw_site_content;
CREATE POLICY "Admins can delete site content"
ON public.bw_site_content
FOR DELETE
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can view public media assets" ON public.bw_media_assets;
CREATE POLICY "Anyone can view public media assets"
ON public.bw_media_assets
FOR SELECT
TO public
USING (is_public = true);

DROP POLICY IF EXISTS "Admins can view all media assets" ON public.bw_media_assets;
CREATE POLICY "Admins can view all media assets"
ON public.bw_media_assets
FOR SELECT
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can create media assets" ON public.bw_media_assets;
CREATE POLICY "Admins can create media assets"
ON public.bw_media_assets
FOR INSERT
TO authenticated
WITH CHECK (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update media assets" ON public.bw_media_assets;
CREATE POLICY "Admins can update media assets"
ON public.bw_media_assets
FOR UPDATE
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'))
WITH CHECK (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete media assets" ON public.bw_media_assets;
CREATE POLICY "Admins can delete media assets"
ON public.bw_media_assets
FOR DELETE
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.bw_contact_submissions;
CREATE POLICY "Admins can view contact submissions"
ON public.bw_contact_submissions
FOR SELECT
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.bw_contact_submissions;
CREATE POLICY "Admins can update contact submissions"
ON public.bw_contact_submissions
FOR UPDATE
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'))
WITH CHECK (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.bw_contact_submissions;
CREATE POLICY "Admins can delete contact submissions"
ON public.bw_contact_submissions
FOR DELETE
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view all blog posts" ON public.bw_blog_posts;
CREATE POLICY "Admins can view all blog posts"
ON public.bw_blog_posts
FOR SELECT
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can create blog posts" ON public.bw_blog_posts;
CREATE POLICY "Admins can create blog posts"
ON public.bw_blog_posts
FOR INSERT
TO authenticated
WITH CHECK (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update blog posts" ON public.bw_blog_posts;
CREATE POLICY "Admins can update blog posts"
ON public.bw_blog_posts
FOR UPDATE
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'))
WITH CHECK (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete blog posts" ON public.bw_blog_posts;
CREATE POLICY "Admins can delete blog posts"
ON public.bw_blog_posts
FOR DELETE
TO authenticated
USING (public.bw_has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_bw_profiles_updated_at ON public.bw_profiles;
DROP TRIGGER IF EXISTS update_bw_profiles_updated_at ON public.bw_profiles;
CREATE TRIGGER update_bw_profiles_updated_at
BEFORE UPDATE ON public.bw_profiles
FOR EACH ROW
EXECUTE FUNCTION public.bw_update_updated_at_column();

DROP TRIGGER IF EXISTS update_bw_stories_updated_at ON public.bw_stories;
DROP TRIGGER IF EXISTS update_bw_stories_updated_at ON public.bw_stories;
CREATE TRIGGER update_bw_stories_updated_at
BEFORE UPDATE ON public.bw_stories
FOR EACH ROW
EXECUTE FUNCTION public.bw_update_updated_at_column();

DROP TRIGGER IF EXISTS update_bw_story_sections_updated_at ON public.bw_story_sections;
DROP TRIGGER IF EXISTS update_bw_story_sections_updated_at ON public.bw_story_sections;
CREATE TRIGGER update_bw_story_sections_updated_at
BEFORE UPDATE ON public.bw_story_sections
FOR EACH ROW
EXECUTE FUNCTION public.bw_update_updated_at_column();

DROP TRIGGER IF EXISTS update_bw_story_gallery_items_updated_at ON public.bw_story_gallery_items;
DROP TRIGGER IF EXISTS update_bw_story_gallery_items_updated_at ON public.bw_story_gallery_items;
CREATE TRIGGER update_bw_story_gallery_items_updated_at
BEFORE UPDATE ON public.bw_story_gallery_items
FOR EACH ROW
EXECUTE FUNCTION public.bw_update_updated_at_column();

DROP TRIGGER IF EXISTS update_bw_site_content_updated_at ON public.bw_site_content;
DROP TRIGGER IF EXISTS update_bw_site_content_updated_at ON public.bw_site_content;
CREATE TRIGGER update_bw_site_content_updated_at
BEFORE UPDATE ON public.bw_site_content
FOR EACH ROW
EXECUTE FUNCTION public.bw_update_updated_at_column();

DROP TRIGGER IF EXISTS update_bw_media_assets_updated_at ON public.bw_media_assets;
DROP TRIGGER IF EXISTS update_bw_media_assets_updated_at ON public.bw_media_assets;
CREATE TRIGGER update_bw_media_assets_updated_at
BEFORE UPDATE ON public.bw_media_assets
FOR EACH ROW
EXECUTE FUNCTION public.bw_update_updated_at_column();

INSERT INTO storage.buckets (id, name, public)
VALUES ('bw-media-library', 'bw-media-library', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view media library files" ON storage.objects;
CREATE POLICY "Public can view media library files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'bw-media-library');

DROP POLICY IF EXISTS "Admins can upload media library files" ON storage.objects;
CREATE POLICY "Admins can upload media library files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'bw-media-library'
  AND public.bw_has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Admins can update media library files" ON storage.objects;
CREATE POLICY "Admins can update media library files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'bw-media-library'
  AND public.bw_has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'bw-media-library'
  AND public.bw_has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Admins can delete media library files" ON storage.objects;
CREATE POLICY "Admins can delete media library files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'bw-media-library'
  AND public.bw_has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Admins can list media library files" ON storage.objects;
CREATE POLICY "Admins can list media library files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'bw-media-library'
  AND public.bw_has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.bw_contact_submissions;

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.bw_contact_submissions;
CREATE POLICY "Anyone can submit contact form"
ON public.bw_contact_submissions
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

-- Fix: claim_first_admin() declared a local variable named `current_user`,
-- which collides with the PostgreSQL keyword `current_user` (returns the DB
-- role name, type `name`). Inside the INSERT VALUES clause Postgres resolved
-- the keyword instead of the variable, producing:
--   column "user_id" is of type uuid but expression is of type name
-- Rename the variable to avoid the shadow.

CREATE OR REPLACE FUNCTION public.bw_claim_first_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.bw_user_roles
    WHERE role = 'admin'
  ) THEN
    RETURN public.bw_has_role(v_uid, 'admin');
  END IF;

  INSERT INTO public.bw_user_roles (user_id, role)
  VALUES (v_uid, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN public.bw_has_role(v_uid, 'admin');
END;
$$;


-- Chat events: log when a visitor opens the chatbot or sends their first message,
-- so admins get an in-app notification. Two event types are tracked separately:
--   'opened'        -> visitor opened the chat window
--   'first_message' -> visitor sent their first message (message text included)

CREATE TABLE IF NOT EXISTS public.bw_chat_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('opened', 'first_message')),
  message TEXT,
  path TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bw_chat_events ENABLE ROW LEVEL SECURITY;

-- Anyone (anonymous visitors included) may log an event, with light validation
-- so the endpoint can't be abused to store large payloads.
DROP POLICY IF EXISTS "Anyone can log chat events" ON public.bw_chat_events;
CREATE POLICY "Anyone can log chat events"
ON public.bw_chat_events
  FOR INSERT
  TO public
  WITH CHECK (
    event_type IN ('opened', 'first_message')
    AND (message IS NULL OR char_length(message) <= 2000)
    AND (path IS NULL OR char_length(path) <= 300)
  );

-- Only admins can read, mark-as-read, or clear notifications.
DROP POLICY IF EXISTS "Admins can view chat events" ON public.bw_chat_events;
CREATE POLICY "Admins can view chat events"
ON public.bw_chat_events
  FOR SELECT
  TO authenticated
  USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update chat events" ON public.bw_chat_events;
CREATE POLICY "Admins can update chat events"
ON public.bw_chat_events
  FOR UPDATE
  TO authenticated
  USING (public.bw_has_role(auth.uid(), 'admin'))
  WITH CHECK (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete chat events" ON public.bw_chat_events;
CREATE POLICY "Admins can delete chat events"
ON public.bw_chat_events
  FOR DELETE
  TO authenticated
  USING (public.bw_has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_bw_chat_events_created_at ON public.bw_chat_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bw_chat_events_unread ON public.bw_chat_events (read) WHERE read = false;

-- Enable realtime so the admin bell updates live without polling.
ALTER TABLE public.bw_chat_events REPLICA IDENTITY FULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'bw_chat_events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bw_chat_events;
  END IF;
END $$;


-- Testimonials: client quotes shown on the homepage, managed from the admin panel.

CREATE TABLE IF NOT EXISTS public.bw_testimonials (
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

ALTER TABLE public.bw_testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published testimonials" ON public.bw_testimonials;
CREATE POLICY "Anyone can view published testimonials"
ON public.bw_testimonials FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Admins can view all testimonials" ON public.bw_testimonials;
CREATE POLICY "Admins can view all testimonials"
ON public.bw_testimonials FOR SELECT TO authenticated
  USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.bw_testimonials;
CREATE POLICY "Admins can insert testimonials"
ON public.bw_testimonials FOR INSERT TO authenticated
  WITH CHECK (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update testimonials" ON public.bw_testimonials;
CREATE POLICY "Admins can update testimonials"
ON public.bw_testimonials FOR UPDATE TO authenticated
  USING (public.bw_has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.bw_testimonials;
CREATE POLICY "Admins can delete testimonials"
ON public.bw_testimonials FOR DELETE TO authenticated
  USING (public.bw_has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_bw_testimonials_updated_at ON public.bw_testimonials;
CREATE TRIGGER update_bw_testimonials_updated_at
BEFORE UPDATE ON public.bw_testimonials
  FOR EACH ROW EXECUTE FUNCTION public.bw_update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_bw_testimonials_published ON public.bw_testimonials (published, sort_order);

INSERT INTO public.bw_testimonials (name, role, quote, sort_order) VALUES
('Priya & Arjun', 'Udaipur', 'They didn''t just capture our wedding — they captured our souls. Every frame tells our story with a depth of emotion we didn''t think was possible.', 1),
('Sarah & Michael', 'Tuscany', 'The most cinematic, breathtaking wedding film we''ve ever seen. Our families have watched it a hundred times and still cry every time.', 2),
('Aisha & Ravi', 'Jaipur', 'Working with them felt like working with true artists. They understood our vision and elevated it beyond anything we imagined.', 3),
('Meera & Karan', 'Goa', 'Calm, accommodating, and wonderful — it felt like having close friends capture the most important day of our lives.', 4),
('Anita & Dev', 'Delhi', 'Every minute detail in the frame was perfect. They go the extra mile, and it shows in every photograph.', 5),
('Zara & Kabir', 'Kerala', 'Beyond breathtaking. They turned fleeting moments into timeless art we will treasure for generations.', 6);

