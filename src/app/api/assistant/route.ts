/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/backend/utils/guard/withAuth';
import { validateDto } from '@/backend/utils/input-validator.util';
import { AskAssistantDto } from '@/backend/modules/assistant/dto/ask-assistant.dto';
import { AssistantService } from '@/backend/modules/assistant/assistant.service';

const assistantService = new AssistantService();

export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    const body = await req.json();
    const dto = await validateDto(AskAssistantDto, body);

    const response = await assistantService.ask(user.id, dto.question);

    return NextResponse.json(
      { response, message: 'Assistant response', success: true },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: Number.isInteger(error?.status) ? error.status : 400 },
    );
  }
});
