/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { authGuard } from './authGuard';
import { IJwtPayload } from './jwt';

type Handler = (
  req: NextRequest,
  user: IJwtPayload,
  context?: any,
) => Promise<Response>;

export function withAuth(handler: Handler) {
  return async (req: NextRequest, context?: any) => {
    try {
      const user = authGuard(req);

      return await handler(req, user, context);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Unauthorized' },
        { status: 401 },
      );
    }
  };
}
