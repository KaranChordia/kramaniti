import { createClient } from 'npm:@supabase/supabase-js@2.95.0';

type JsonRecord = Record<string, unknown>;

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};

const respond = (body: JsonRecord, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: jsonHeaders });

const isRecord = (value: unknown): value is JsonRecord =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const readText = (record: JsonRecord, key: string, max = 8000) =>
  (typeof record[key] === 'string' ? record[key] : '').trim().slice(0, max);

const readDefaultKey = (dictionaryName: string, legacyName: string) => {
  const legacy = Deno.env.get(legacyName);
  if (legacy) return legacy;

  try {
    const dictionary = JSON.parse(Deno.env.get(dictionaryName) ?? '{}') as Record<string, string>;
    return dictionary.default ?? Object.values(dictionary)[0] ?? '';
  } catch {
    return '';
  }
};

const USERNAME_PATTERN = /^[a-z0-9_]{3,32}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SAFE_REPOSITORY_PATH = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[a-zA-Z0-9._/-]+$/;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);

const createClientLogin = async (
  body: JsonRecord,
  ownerId: string,
  admin: ReturnType<typeof createClient>
) => {
  const workspaceName = readText(body, 'workspaceName', 120);
  const displayName = readText(body, 'displayName', 100);
  const username = readText(body, 'username', 32).toLowerCase();
  const password = readText(body, 'password', 512);
  const slug = slugify(readText(body, 'slug', 64) || workspaceName);

  if (!workspaceName || !displayName || !SLUG_PATTERN.test(slug)) {
    return respond({ error: 'Client name, workspace name, and a valid workspace slug are required.' }, 400);
  }
  if (!USERNAME_PATTERN.test(username)) {
    return respond({ error: 'Username must use 3-32 lowercase letters, numbers, or underscores.' }, 400);
  }
  if (password.length < 12) {
    return respond({ error: 'Temporary passwords must contain at least 12 characters.' }, 400);
  }

  const { data: existingProfile, error: profileLookupError } = await admin
    .from('profiles')
    .select('user_id')
    .eq('username', username)
    .maybeSingle();
  if (profileLookupError) throw profileLookupError;
  if (existingProfile) return respond({ error: 'That Client Hub username is already in use.' }, 409);

  let createdUserId: string | null = null;
  try {
    const internalEmail = `${username}@client-hub.kramaniti.com`;
    const { data: createdUser, error: userError } = await admin.auth.admin.createUser({
      email: internalEmail,
      password,
      email_confirm: true,
      app_metadata: { client_hub_role: 'client' },
      user_metadata: {
        client_hub_username: username,
        display_name: displayName,
      },
    });

    if (userError || !createdUser.user) {
      const conflict = Boolean(userError?.message.toLowerCase().includes('already'));
      return respond(
        { error: conflict ? 'That Client Hub username is already in use.' : 'Client login could not be created.' },
        conflict ? 409 : 500
      );
    }
    createdUserId = createdUser.user.id;

    const { error: profileError } = await admin.from('profiles').upsert(
      {
        user_id: createdUserId,
        username,
        display_name: displayName,
        role: 'client',
        must_change_password: true,
      },
      { onConflict: 'user_id' }
    );
    if (profileError) throw profileError;

    const { data: existingWorkspace, error: workspaceLookupError } = await admin
      .from('workspaces')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (workspaceLookupError) throw workspaceLookupError;

    let workspace = existingWorkspace;
    if (!workspace) {
      const { data, error } = await admin
        .from('workspaces')
        .insert({
          slug,
          name: workspaceName,
          status: 'active',
          created_by: ownerId,
        })
        .select('*')
        .single();
      if (error || !data) throw error ?? new Error('Workspace creation failed.');
      workspace = data;
    }

    const { error: membershipError } = await admin.from('workspace_members').upsert(
      [
        { workspace_id: workspace.id, user_id: ownerId, role: 'owner' },
        { workspace_id: workspace.id, user_id: createdUserId, role: 'client' },
      ],
      { onConflict: 'workspace_id,user_id' }
    );
    if (membershipError) throw membershipError;

    return respond({
      client: {
        userId: createdUserId,
        username,
        displayName,
        mustChangePassword: true,
      },
      workspace,
    });
  } catch (error) {
    if (createdUserId) await admin.auth.admin.deleteUser(createdUserId).catch(() => undefined);
    console.error('Client Hub create_client failed', error);
    return respond({ error: 'Client account and workspace could not be provisioned.' }, 500);
  }
};

const syncRepositoryManifest = async (
  body: JsonRecord,
  ownerId: string,
  admin: ReturnType<typeof createClient>
) => {
  const manifest = isRecord(body.manifest) ? body.manifest : null;
  const sourceWorkspaces = manifest && Array.isArray(manifest.workspaces) ? manifest.workspaces : null;
  if (manifest?.version !== 1 || !sourceWorkspaces || sourceWorkspaces.length > 100) {
    return respond({ error: 'The curated repository manifest is invalid.' }, 400);
  }

  let itemCount = 0;
  for (const source of sourceWorkspaces) {
    if (!isRecord(source)) return respond({ error: 'The curated repository manifest is invalid.' }, 400);

    const slug = readText(source, 'slug', 64);
    const name = readText(source, 'name', 120);
    const items = Array.isArray(source.items) ? source.items : null;
    const summary = isRecord(source.repositorySummary) ? source.repositorySummary : {};
    if (!SLUG_PATTERN.test(slug) || !name || !items || items.length > 1000) {
      return respond({ error: 'A repository workspace entry is invalid.' }, 400);
    }

    const repositorySummary = {
      repositoryLabel: readText(summary, 'repositoryLabel', 180),
      branch: readText(summary, 'branch', 180) || null,
      revision: readText(summary, 'revision', 80) || null,
      dirty: summary.dirty === true,
      itemCount: items.length,
    };

    const { data: workspace, error: workspaceError } = await admin
      .from('workspaces')
      .upsert(
        {
          slug,
          name,
          status: 'active',
          repository_summary: repositorySummary,
          created_by: ownerId,
        },
        { onConflict: 'slug' }
      )
      .select('*')
      .single();
    if (workspaceError || !workspace) throw workspaceError ?? new Error('Repository workspace sync failed.');

    const { error: membershipError } = await admin.from('workspace_members').upsert(
      { workspace_id: workspace.id, user_id: ownerId, role: 'owner' },
      { onConflict: 'workspace_id,user_id' }
    );
    if (membershipError) throw membershipError;

    const rows = items.map((rawItem) => {
      if (!isRecord(rawItem)) throw new Error('Invalid repository item.');
      const sourceKey = readText(rawItem, 'sourceKey', 300);
      const repositoryPath = readText(rawItem, 'repositoryPath', 500);
      const itemType = readText(rawItem, 'itemType', 20);
      const visibility = readText(rawItem, 'visibility', 20);
      const metadata = isRecord(rawItem.metadata) ? rawItem.metadata : {};

      if (
        !sourceKey.startsWith(`${slug}:`) ||
        !SAFE_REPOSITORY_PATH.test(repositoryPath) ||
        !['repository', 'directory', 'project'].includes(itemType) ||
        !['shared', 'internal'].includes(visibility)
      ) {
        throw new Error('Invalid repository item boundary.');
      }

      return {
        workspace_id: workspace.id,
        source_key: sourceKey,
        repository_label: readText(rawItem, 'repositoryLabel', 180) || repositorySummary.repositoryLabel,
        repository_path: repositoryPath,
        item_type: itemType,
        title: readText(rawItem, 'title', 180),
        summary: readText(rawItem, 'summary', 4000),
        visibility,
        source_hash: readText(rawItem, 'sourceHash', 80) || null,
        metadata: {
          branch: readText(metadata, 'branch', 180) || null,
          dirty: metadata.dirty === true,
        },
        last_synced_at: new Date().toISOString(),
      };
    });

    if (rows.some((row) => !row.title)) return respond({ error: 'A repository item title is required.' }, 400);

    const desiredKeys = new Set(rows.map((row) => row.source_key));
    const { data: existingItems, error: existingError } = await admin
      .from('repository_items')
      .select('id, source_key')
      .eq('workspace_id', workspace.id);
    if (existingError) throw existingError;

    const staleIds = (existingItems ?? [])
      .filter((item) => !desiredKeys.has(item.source_key))
      .map((item) => item.id);
    if (staleIds.length) {
      const { error: deleteError } = await admin.from('repository_items').delete().in('id', staleIds);
      if (deleteError) throw deleteError;
    }

    if (rows.length) {
      const { error: itemError } = await admin
        .from('repository_items')
        .upsert(rows, { onConflict: 'workspace_id,source_key' });
      if (itemError) throw itemError;
    }
    itemCount += rows.length;
  }

  return respond({
    workspaceCount: sourceWorkspaces.length,
    itemCount,
    generatedAt: typeof manifest.generatedAt === 'string' ? manifest.generatedAt : null,
  });
};

Deno.serve(async (request: Request) => {
  if (request.method !== 'POST') return respond({ error: 'Method not allowed.' }, 405);

  const authorization = request.headers.get('authorization') ?? '';
  const token = authorization.toLowerCase().startsWith('bearer ')
    ? authorization.slice(7).trim()
    : '';
  if (!token) return respond({ error: 'Sign in is required.' }, 401);

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const publicKey = readDefaultKey('SUPABASE_PUBLISHABLE_KEYS', 'SUPABASE_ANON_KEY');
  const adminKey = readDefaultKey('SUPABASE_SECRET_KEYS', 'SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !publicKey || !adminKey) {
    console.error('Client Hub admin function is missing Supabase runtime keys.');
    return respond({ error: 'Client Hub administration is not configured.' }, 503);
  }

  const userClient = createClient(supabaseUrl, publicKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const admin = createClient(supabaseUrl, adminKey, {
    db: { schema: 'kramaniti_hub' },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const { data: userData, error: userError } = await userClient.auth.getUser(token);
  if (userError || !userData.user) return respond({ error: 'Your session is no longer valid.' }, 401);

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('role')
    .eq('user_id', userData.user.id)
    .maybeSingle();
  if (profileError) return respond({ error: 'Client Hub owner access could not be checked.' }, 500);
  if (profile?.role !== 'owner') return respond({ error: 'Founder access is required for this action.' }, 403);

  let body: JsonRecord;
  try {
    const parsed = await request.json();
    body = isRecord(parsed) ? parsed : {};
  } catch {
    return respond({ error: 'A valid JSON request is required.' }, 400);
  }

  try {
    const action = readText(body, 'action', 40);
    if (action === 'create_client') return await createClientLogin(body, userData.user.id, admin);
    if (action === 'sync_repository') return await syncRepositoryManifest(body, userData.user.id, admin);
    return respond({ error: 'Unknown Client Hub admin action.' }, 400);
  } catch (error) {
    console.error('Client Hub admin function failed', error);
    return respond({ error: 'The Client Hub admin action could not be completed.' }, 500);
  }
});
