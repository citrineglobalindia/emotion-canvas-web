-- Fix: claim_first_admin() declared a local variable named `current_user`,
-- which collides with the PostgreSQL keyword `current_user` (returns the DB
-- role name, type `name`). Inside the INSERT VALUES clause Postgres resolved
-- the keyword instead of the variable, producing:
--   column "user_id" is of type uuid but expression is of type name
-- Rename the variable to avoid the shadow.

CREATE OR REPLACE FUNCTION public.claim_first_admin()
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
    FROM public.user_roles
    WHERE role = 'admin'
  ) THEN
    RETURN public.has_role(v_uid, 'admin');
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_uid, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN public.has_role(v_uid, 'admin');
END;
$$;
