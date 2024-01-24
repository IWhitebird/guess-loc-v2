-- tables
create table
  public.users (
    id uuid not null,
    user_email text null,
    user_name text null,
    user_maxscore bigint null,
    user_pfp text null,
    friends_id uuid[] null,
    incoming_fr_reqs uuid[] null,
    xp_points bigint null,
    outgoing_fr_reqs uuid[] null,
    online_status text not null default 'offline'::text,
    constraint users_pkey primary key (id),
    constraint users_id_fkey foreign key (id) references auth.users (id)
  ) tablespace pg_default;

  create table
  public.custom_room (
    room_id uuid not null default gen_random_uuid (),
    room_pw text not null,
    room_owner uuid not null,
    room_name text null,
    room_settings jsonb null,
    room_chat jsonb[] null,
    room_participants jsonb[] null,
    constraint custom_room_pkey primary key (room_id),
    constraint custom_room_room_owner_fkey foreign key (room_owner) references users (id)
  ) tablespace pg_default;

-- functioons
CREATE OR REPLACE FUNCTION name_email_search(search_term varchar)
RETURNS SETOF users
LANGUAGE plpgsql
AS $$
	begin
		SET pg_trgm.similarity_threshold = 0.2;
		return query
			SELECT *
			FROM users b 
			WHERE search_term % ANY(STRING_TO_ARRAY(b.user_name, ' ')) OR search_term % ANY(STRING_TO_ARRAY(b.user_email, ' '));
	end;
$$;


SELECT * FROM name_email_search('alp');

-- save auth
CREATE OR REPLACE FUNCTION signup_copy_to_users_table() RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.users (id, user_email, user_name, user_maxscore,user_pfp) 
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 0,new.raw_user_meta_data->>'avatar_url');

    RETURN NEW;
  END;

$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS signup_copy on auth.users;
CREATE TRIGGER signup_copy
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE signup_copy_to_users_table();
