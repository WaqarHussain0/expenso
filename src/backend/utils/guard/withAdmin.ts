/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { adminGuard } from './adminGuard';
import { IJwtPayload } from './jwt';

type Handler = (
  req: NextRequest,
  user: IJwtPayload,
  context?: any,
) => Promise<Response>;

export function withAdmin(handler: Handler) {
  return async (req: NextRequest, context?: any) => {
    try {
      const user = adminGuard(req);

      return await handler(req, user, context);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Forbidden' },
        { status: 403 },
      );
    }
  };
}
