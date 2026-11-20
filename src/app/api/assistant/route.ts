/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/backend/utils/guard/withAuth';
import { validateDto } from '@/backend/utils/input-validator.util';
import { AskAssistantDto } from '@/backend/modules/assistant/dto/ask-assistant.dto';
import { AssistantService } from '@/backend/modules/assistant/assistant.service';

const assistantService = new AssistantService();

// Two LLM calls (+ fallbacks) can be slow when a provider is under load —
// allow up to 2 minutes so Vercel doesn't cut the function off mid-answer.
export const maxDuration = 120;

export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    const body = await req.json();
    const dto = await validateDto(AskAssistantDto, body);

    const { answer, provider, source } = await assistantService.ask(
      user.id,
      dto.question,
    );

    return NextResponse.json(
      {
        response: answer,
        provider,
        source,
        message: 'Assistant response',
        success: true,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: Number.isInteger(error?.status) ? error.status : 400 },
    );
  }
});
