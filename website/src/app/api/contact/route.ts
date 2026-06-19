import { NextResponse } from 'next/server';

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  budget?: unknown;
  goal?: unknown;
  website?: unknown;
  page?: unknown;
};

const MAX_FIELD_LENGTH = 2000;

function cleanString(value: unknown, maxLength = MAX_FIELD_LENGTH) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, maxLength);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const honeypot = cleanString(payload.website, 500);

  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const name = cleanString(payload.name, 160);
  const email = cleanString(payload.email, 200).toLowerCase();
  const company = cleanString(payload.company, 200);
  const budget = cleanString(payload.budget, 80);
  const goal = cleanString(payload.goal, 2000);
  const page = cleanString(payload.page, 500);

  if (!name || !email || !company || !goal) {
    return NextResponse.json({ error: 'Please complete the required fields.' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid work email.' }, { status: 400 });
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: 'Contact storage is not configured yet.' },
      { status: 503 },
    );
  }

  const submission = {
    submittedAt: new Date().toISOString(),
    name,
    email,
    company,
    budget,
    goal,
    page,
    source: 'kramaniti-website',
  };

  try {
    const targetUrl = new URL(webhookUrl);

    if (process.env.CONTACT_WEBHOOK_SECRET && !targetUrl.searchParams.has('secret')) {
      targetUrl.searchParams.set('secret', process.env.CONTACT_WEBHOOK_SECRET);
    }

    const response = await fetch(targetUrl.toString(), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(submission),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Unable to save the enquiry right now.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Unable to save the enquiry right now.' },
      { status: 502 },
    );
  }
}
