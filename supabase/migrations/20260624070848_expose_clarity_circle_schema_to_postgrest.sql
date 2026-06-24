-- Kramaniti Clarity Circle PostgREST exposure
-- Required for supabase-js calls that target the clarity_circle schema.

alter role authenticator set pgrst.db_schemas = 'public, storage, graphql_public, clarity_circle';
notify pgrst, 'reload config';
notify pgrst, 'reload schema';
