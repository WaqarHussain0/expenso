/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import 'reflect-metadata';

import { AuthService } from '@/backend/modules/auth/auth.service';
import { RegisterDto } from '@/backend/modules/auth/dto/register.dto';
import { validateDto } from '@/backend/utils/input-validator.util';

const authService = new AuthService();

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function forgotPasswordAction(
  email: string,
): Promise<ActionResult> {
  try {
    await authService.forgotPassword(email);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
}

export async function resetPasswordAction(
  token: string,
  password: string,
): Promise<ActionResult> {
  try {
    await authService.resetPasswordByToken(token, password);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
}

export async function registerAction(payload: {
  email: string;
  name: string;
  password: string;
}): Promise<ActionResult> {
  try {
    // Transform to DTO and validate
    const dto = await validateDto(RegisterDto, payload);

    await authService.signup(dto);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
}
