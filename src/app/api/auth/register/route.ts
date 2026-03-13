/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { AuthService } from '@/backend/modules/auth/auth.service';
import { RegisterDto } from '@/backend/modules/auth/dto/register.dto';
import { validateDto } from '@/backend/utils/input-validator.util';
import { NextRequest, NextResponse } from 'next/server';

const authService = new AuthService();

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();

    // Transform to DTO and validate
    const dto = await validateDto(RegisterDto, body);

    const user = await authService.signup(dto);

    // Return success response
    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 400 },
    );
  }
}
