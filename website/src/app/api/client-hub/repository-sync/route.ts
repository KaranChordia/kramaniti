import manifest from '@/data/client-hub-repositories.generated.json';
import { invokeClientHubAdmin } from '@/lib/client-hub/server';

export async function POST(request: Request) {
  return invokeClientHubAdmin(request, {
    action: 'sync_repository',
    manifest,
  });
}
