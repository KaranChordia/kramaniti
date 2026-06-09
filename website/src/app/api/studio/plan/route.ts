import { NextResponse } from 'next/server';
import { createMockStudioPlan } from '../../../../lib/studio/mockPlanner';
import type { StudioIntake } from '../../../../lib/studio/types';

export async function POST(request: Request) {
  try {
    const intake = (await request.json()) as Partial<StudioIntake>;

    const plan = createMockStudioPlan({
      companyName: intake.companyName ?? '',
      website: intake.website ?? '',
      industry: intake.industry ?? '',
      companyStage: intake.companyStage ?? '',
      knownContext: intake.knownContext ?? '',
      currentTools: intake.currentTools ?? '',
      priorityQuestion: intake.priorityQuestion ?? '',
      researchMode: intake.researchMode === 'mock-web' ? 'mock-web' : 'manual',
    });

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Studio plan route error:', error);
    return NextResponse.json({ error: 'Unable to create Studio plan.' }, { status: 500 });
  }
}
