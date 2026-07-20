import { requireClientHubUser } from '@/lib/client-hub/server';

export async function POST(request: Request) {
  try {
    const auth = await requireClientHubUser(request);
    if ('error' in auth) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    if (auth.profile?.role !== 'owner') {
      return Response.json(
        { error: 'Founder access has not been assigned to this account.' },
        { status: 403 }
      );
    }

    return Response.json({ profile: auth.profile });
  } catch (error) {
    console.error('Client Hub founder bootstrap failed', error);
    return Response.json({ error: 'Founder access could not be activated.' }, { status: 500 });
  }
}
