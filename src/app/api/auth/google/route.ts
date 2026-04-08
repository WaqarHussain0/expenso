/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { AuthService } from '@/backend/modules/auth/auth.service';
import { NextRequest, NextResponse } from 'next/server';

const authService = new AuthService();

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();

    const { googleToken } = body;

    if (!googleToken) {
      throw new Error('Google token is required');
    }

    const response = await authService.googleLogin(googleToken);
    // Return success response
    return NextResponse.json(
      {
        message: 'Google login',
        data: response.userData,
        accessToken: response.accessToken,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Error while logging in:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 400 },
    );
  }
}
