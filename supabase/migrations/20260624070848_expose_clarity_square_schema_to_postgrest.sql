-- Kramaniti Clarity Square PostgREST exposure
-- Required for supabase-js calls that target the clarity_square schema.

alter role authenticator set pgrst.db_schemas = 'public, storage, graphql_public, clarity_square';
notify pgrst, 'reload config';
notify pgrst, 'reload schema';
