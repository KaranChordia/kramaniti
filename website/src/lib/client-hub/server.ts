import 'server-only';

import { createClient } from '@supabase/supabase-js';
import {
  getClientHubPublicKey,
  type ClientHubDatabase,
  type ClientHubProfile,
} from './supabase';

const getSupabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

const readBearerToken = (request: Request) => {
  const authorization = request.headers.get('authorization') ?? '';
  return authorization.toLowerCase().startsWith('bearer ') ? authorization.slice(7).trim() : '';
};

export const getClientHubUserClient = (accessToken: string) => {
  const url = getSupabaseUrl();
  const publicKey = getClientHubPublicKey();

  if (!url || !publicKey) {
    throw new Error('Client Hub public Supabase access is not configured.');
  }

  return createClient<ClientHubDatabase>(url, publicKey, {
    db: { schema: 'kramaniti_hub' },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};

export const requireClientHubUser = async (request: Request) => {
  const accessToken = readBearerToken(request);
  if (!accessToken) {
    return { error: 'Sign in is required.', status: 401 } as const;
  }

  const userClient = getClientHubUserClient(accessToken);
  const { data, error } = await userClient.auth.getUser(accessToken);
  if (error || !data.user) {
    return { error: 'Your session is no longer valid.', status: 401 } as const;
  }

  const { data: profile, error: profileError } = await userClient
    .from('profiles')
    .select('*')
    .eq('user_id', data.user.id)
    .maybeSingle<ClientHubProfile>();

  if (profileError) {
    return { error: 'Client Hub access could not be checked.', status: 500 } as const;
  }

  return {
    accessToken,
    user: data.user,
    profile,
    userClient,
  } as const;
};

export const requireClientHubOwner = async (request: Request) => {
  const auth = await requireClientHubUser(request);
  if ('error' in auth) return auth;

  if (auth.profile?.role !== 'owner') {
    return { error: 'Founder access is required for this action.', status: 403 } as const;
  }

  return auth;
};

export const invokeClientHubAdmin = async (request: Request, payload: Record<string, unknown>) => {
  const accessToken = readBearerToken(request);
  const url = getSupabaseUrl();
  const publicKey = getClientHubPublicKey();

  if (!accessToken) {
    return Response.json({ error: 'Sign in is required.' }, { status: 401 });
  }
  if (!url || !publicKey) {
    return Response.json({ error: 'Client Hub Supabase access is not configured.' }, { status: 503 });
  }

  try {
    const response = await fetch(`${url}/functions/v1/client-hub-admin`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: publicKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') ?? 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Client Hub admin function request failed', error);
    return Response.json({ error: 'The Client Hub administration service could not be reached.' }, { status: 502 });
  }
};
