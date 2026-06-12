import { NextResponse } from 'next/server';
import { assertLocalLMStudioBaseUrl, createLMStudioHeaders } from '../../../../../lib/studio/lmStudio';

export const runtime = 'nodejs';

type LMStudioMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type ChatRequest = {
  baseUrl?: string;
  apiKey?: string;
  model?: string;
  messages?: LMStudioMessage[];
};

type ChatResponseChoice = {
  message?: {
    content?: string;
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest;
    const baseUrl = assertLocalLMStudioBaseUrl(body.baseUrl);
    const model = body.model?.trim();
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (!model) {
      return NextResponse.json({ error: 'LM Studio model is required.' }, { status: 400 });
    }

    if (!messages.length || messages.some((message) => !message.content?.trim())) {
      return NextResponse.json({ error: 'At least one non-empty message is required.' }, { status: 400 });
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      cache: 'no-store',
      headers: createLMStudioHeaders(body.apiKey),
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        max_tokens: 900,
      }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { error: payload?.error?.message ?? payload?.error ?? `LM Studio returned ${response.status}.` },
        { status: response.status }
      );
    }

    const content =
      (payload?.choices as ChatResponseChoice[] | undefined)?.[0]?.message?.content ??
      'LM Studio responded, but no assistant content was returned.';

    return NextResponse.json({
      content,
      model: payload?.model ?? model,
      usage: payload?.usage ?? null,
    });
  } catch (error) {
    console.error('LM Studio chat bridge error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to run the local model prompt.' },
      { status: 500 }
    );
  }
}
