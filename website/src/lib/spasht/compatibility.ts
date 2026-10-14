/** Legacy values below preserve data and identity; never use for new product links. */
export const workspaceStorageKey = 'kramaniti-spasht-sequence-v1';
export const handoffStorageKey = 'kramaniti-spasht-engine-handoff-v1';
export const legacyWorkspaceKeys = ['kramaniti-clarity-square-sequence-v1', 'kramaniti-clarity-circle-sequence-v1'];
export const legacyHandoffKeys = ['kramaniti-clarity-square-engine-handoff-v1', 'kramaniti-clarity-circle-engine-handoff-v1'];
export const defaultThreadId = 'spasht-thread-default';
export function normalizeThreadId(id: string | null | undefined) {
  return !id || ['square-thread-default', 'circle-thread-default'].includes(id) ? defaultThreadId : id;
}
// Immutable receipt namespace: changing the hash permits a second approval.
export const actionClaimNamespace = 'clarity-square:action-claim:';
export function readCompatibleStorage(storage: Storage, canonical: string, legacy: string[]) {
  for (const key of [canonical, ...legacy]) {
    const value = storage.getItem(key);
    if (!value) continue;
    try {
      const parsed: unknown = JSON.parse(value);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) continue;
    } catch { continue; }
    if (key !== canonical) { try { storage.setItem(canonical, value); } catch { /* quota cannot prevent reading */ } }
    return value;
  }
  return null;
}
export function clearCompatibleStorage(storage: Storage, canonical: string, legacy: string[]) {
  for (const key of [canonical, ...legacy]) storage.removeItem(key);
}
export function normalizeProjectPayload<T extends object>(value: T): T {
  const payload = value as T & { spashtProject?: unknown; squareProject?: unknown };
  const { squareProject, ...canonicalPayload } = payload;
  return { ...canonicalPayload, spashtProject: payload.spashtProject ?? squareProject } as T;
}
