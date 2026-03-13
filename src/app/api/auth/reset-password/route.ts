/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthService } from '@/backend/modules/auth/auth.service';
import { NextRequest, NextResponse } from 'next/server';

const authService = new AuthService();

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();
    const { token, password } = body;

    const result = await authService.resetPasswordByToken(token, password);

    // Return success response
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 400 },
    );
  }
}
