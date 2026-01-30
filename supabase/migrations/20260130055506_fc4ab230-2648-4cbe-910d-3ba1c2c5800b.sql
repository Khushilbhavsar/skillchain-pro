-- Fix #1: Role Escalation - Modify handle_new_user to ONLY allow 'student' role by default
-- Users cannot self-assign admin (tpo) or company roles during signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  requested_role text;
  allowed_role app_role;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, name, email, roll_number, department, company_name)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.email),
    new.email,
    new.raw_user_meta_data ->> 'roll_number',
    new.raw_user_meta_data ->> 'department',
    new.raw_user_meta_data ->> 'company_name'
  );
  
  -- Get requested role from metadata
  requested_role := new.raw_user_meta_data ->> 'role';
  
  -- SECURITY: Only allow 'student' role for self-registration
  -- TPO and company roles must be assigned by an admin
  IF requested_role = 'student' THEN
    allowed_role := 'student'::app_role;
  ELSIF requested_role = 'company' THEN
    -- Allow company role only if company_name is provided
    IF (new.raw_user_meta_data ->> 'company_name') IS NOT NULL THEN
      allowed_role := 'company'::app_role;
    ELSE
      allowed_role := 'student'::app_role;
    END IF;
  ELSE
    -- Default to student for any other role including 'tpo'
    allowed_role := 'student'::app_role;
  END IF;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, allowed_role);
  
  RETURN new;
END;
$function$;

-- Fix #3: Add missing UPDATE/DELETE policies on user_roles
-- Only TPO (admin) can update or delete user roles
CREATE POLICY "TPO can update user roles"
ON public.user_roles
FOR UPDATE
USING (has_role(auth.uid(), 'tpo'::app_role));

CREATE POLICY "TPO can delete user roles"
ON public.user_roles
FOR DELETE
USING (has_role(auth.uid(), 'tpo'::app_role));