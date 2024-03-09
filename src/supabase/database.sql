--CUSTOM ROOM 
create table
  public.custom_room (
    room_id uuid not null default gen_random_uuid (),
    room_pw text not null,
    room_owner uuid not null,
    room_name text null,
    room_settings jsonb null,
    room_chat jsonb[] null,
    room_participants jsonb[] null,
    cur_game_id text null,
    participant_count bigint not null default '0'::bigint,
    constraint custom_room_pkey primary key (room_id),
    constraint custom_room_room_owner_fkey foreign key (room_owner) references users (id)
  ) tablespace pg_default;

  --GAME
  create table
  public.game (
    game_id uuid not null default gen_random_uuid (),
    game_type text null,
    total_rounds bigint null,
    round_duration bigint null,
    lat_lng_arr jsonb[] null,
    cur_round bigint null,
    game_winner text null,
    created_at timestamp with time zone not null default now(),
    room_id uuid null,
    round_details jsonb[] null,
    game_participants jsonb[] null,
    cur_round_start_time timestamp with time zone null,
    game_results jsonb[] null,
    constraint game_pkey primary key (game_id),
    constraint game_room_id_fkey foreign key (room_id) references custom_room (room_id)
  ) tablespace pg_default;

  --USERS
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