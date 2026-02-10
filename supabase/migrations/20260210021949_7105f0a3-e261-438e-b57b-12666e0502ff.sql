
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  full_name text;
  first_name text;
  last_name text;
  space_pos int;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, nom, telephone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nom', ''),
    COALESCE(NEW.raw_user_meta_data->>'telephone', '')
  );

  -- Insert role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');

  -- Create client record
  full_name := COALESCE(NEW.raw_user_meta_data->>'nom', NEW.raw_user_meta_data->>'full_name', '');
  space_pos := position(' ' in full_name);
  IF space_pos > 0 THEN
    first_name := left(full_name, space_pos - 1);
    last_name := substring(full_name from space_pos + 1);
  ELSE
    first_name := full_name;
    last_name := '';
  END IF;

  INSERT INTO public.clients (user_id, prenom, nom, email, telephone, entreprise, statut)
  VALUES (
    NEW.id,
    first_name,
    last_name,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'telephone', ''),
    '',
    'actif'
  );

  RETURN NEW;
END;
$function$;
