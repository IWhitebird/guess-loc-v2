


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

