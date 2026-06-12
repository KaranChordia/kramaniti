import { NextResponse } from 'next/server';
import { assertLocalLMStudioBaseUrl, createLMStudioHeaders } from '../../../../../lib/studio/lmStudio';

export const runtime = 'nodejs';

type ModelListRequest = {
  baseUrl?: string;
  apiKey?: string;
};

type OpenAIModel = {
  id?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as ModelListRequest;
    const baseUrl = assertLocalLMStudioBaseUrl(body.baseUrl);

    const response = await fetch(`${baseUrl}/models`, {
      cache: 'no-store',
      headers: createLMStudioHeaders(body.apiKey),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { error: payload?.error?.message ?? payload?.error ?? `LM Studio returned ${response.status}.` },
        { status: response.status }
      );
    }

    const models = Array.isArray(payload?.data)
      ? payload.data.map((model: OpenAIModel) => model.id).filter(Boolean)
      : [];

    return NextResponse.json({ baseUrl, models, data: payload?.data ?? [] });
  } catch (error) {
    console.error('LM Studio model bridge error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to reach LM Studio.' },
      { status: 500 }
    );
  }
}
