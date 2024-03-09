--1
CREATE OR REPLACE FUNCTION public.append_array_to_uuid_row_room_chat(row_id uuid, new_values JSONB[])
RETURNS VOID AS
$$
BEGIN
  -- Append the new values to the specified row
  UPDATE public.custom_room
  SET room_chat = room_chat || new_values
  WHERE room_id = row_id;
END;
$$
LANGUAGE plpgsql;

--2
-- DROP TRIGGER IF EXISTS signup_copy ON auth.users;
-- DROP TRIGGER IF EXISTS insert_account_trigger on auth.users;

-- DROP FUNCTION IF EXISTS signup_copy_to_users_table();
-- DROP FUNCTION IF EXISTS insert_account();

--3
CREATE OR REPLACE FUNCTION public.append_array_to_uuid_row_room_participants(row_id uuid, new_values JSONB[])
RETURNS VOID AS
$$
BEGIN
  -- Append the new values to the specified row
  UPDATE public.custom_room
  SET room_participants = room_participants || new_values
  WHERE room_id = row_id;
END;
$$
LANGUAGE plpgsql;

--4
CREATE OR REPLACE FUNCTION public.de_append_array_to_uuid_row_room_participants(row_id uuid, values_to_remove JSONB[])
RETURNS VOID AS
$$
BEGIN
  -- Remove the specified values from the array
  UPDATE public.custom_room
  SET room_participants = (
    SELECT ARRAY(SELECT unnest(room_participants) EXCEPT SELECT unnest(values_to_remove))
  )
  WHERE room_id = row_id;
END;
$$
LANGUAGE plpgsql;

-- CREATE OR REPLACE FUNCTION public.de_append_array_to_uuid_row_room_participants(row_id uuid, values_to_remove JSONB[])
-- RETURNS VOID AS
-- $$
-- BEGIN
--   -- Remove the specified values from the array using array_remove
--   UPDATE public.custom_room
--   SET room_participants = array_remove(room_participants, values_to_remove)
--   WHERE room_id = row_id;
-- END;
-- $$
-- LANGUAGE plpgsql;


-- DROP FUNCTION IF EXISTS public.de_append_array_to_uuid_row_room_participants(uuid, JSONB[]);

--5
CREATE OR REPLACE FUNCTION signup_copy_to_users_table()
RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.users (id, user_email, user_name, user_maxscore) 
    VALUES (new.id, new.email, new.user_metadata->>'name', 0);

    RETURN NEW;
  END;
$$

LANGUAGE plpgsql SECURITY DEFINER;


DROP TRIGGER IF EXISTS signup_copy on auth.users;
CREATE TRIGGER signup_copy
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE signup_copy_to_users_table();