import { NextRequest } from 'next/server';
import { verifyToken, IJwtPayload } from './jwt';

export function authGuard(req: NextRequest): IJwtPayload {
  const authHeader = req.headers.get('authorization');

  if (!authHeader) {
    throw new Error('Authorization header missing');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Invalid Authorization header format');
  }

  const token = authHeader.split(' ')[1];

  const decoded = verifyToken(token);

  return decoded;
}
