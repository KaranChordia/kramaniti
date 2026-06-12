import { DEFAULT_LM_STUDIO_BASE_URL } from './agentOS';

const LOCAL_LM_STUDIO_HOSTS = new Set(['127.0.0.1', 'localhost', '::1', '[::1]']);

export function normalizeLMStudioBaseUrl(value?: string) {
  const withoutTrailingSlash = (value || DEFAULT_LM_STUDIO_BASE_URL).trim().replace(/\/+$/, '');
  if (!withoutTrailingSlash) return DEFAULT_LM_STUDIO_BASE_URL;
  return withoutTrailingSlash.endsWith('/v1') ? withoutTrailingSlash : `${withoutTrailingSlash}/v1`;
}

export function assertLocalLMStudioBaseUrl(value?: string) {
  const baseUrl = normalizeLMStudioBaseUrl(value);
  const parsedUrl = new URL(baseUrl);

  if (parsedUrl.protocol !== 'http:') {
    throw new Error('LM Studio bridge only allows local HTTP URLs.');
  }

  if (!LOCAL_LM_STUDIO_HOSTS.has(parsedUrl.hostname)) {
    throw new Error('LM Studio bridge only allows localhost or 127.0.0.1.');
  }

  return baseUrl;
}

export function createLMStudioHeaders(apiKey?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey?.trim()) {
    headers.Authorization = `Bearer ${apiKey.trim()}`;
  }

  return headers;
}
