import { invokeClientHubAdmin } from '@/lib/client-hub/server';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    return invokeClientHubAdmin(request, {
      ...body,
      action: 'create_client',
    });
  } catch {
    return Response.json({ error: 'A valid client account request is required.' }, { status: 400 });
  }
}
