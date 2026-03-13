/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { AuthService } from '@/backend/modules/auth/auth.service';
import { validateDto } from '@/backend/utils/input-validator.util';
import { NextRequest, NextResponse } from 'next/server';
import { LoginDto } from '@/backend/modules/auth/dto/login.dto';

const authService = new AuthService();

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();

    // Transform to DTO and validate
    const dto = await validateDto(LoginDto, body);

    const user = await authService.login(dto);

    // Return success response
    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error: any) {
    console.error('Error while logging in:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 400 },
    );
  }
}
