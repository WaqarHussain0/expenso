import jwt from 'jsonwebtoken';
import { getJwtSecret } from '@/backend/modules/auth/auth.config';

export interface IJwtPayload {
  id: string;
  email: string;
  role: string;
}

export function verifyToken(token: string): IJwtPayload {
  try {
    return jwt.verify(token, getJwtSecret()) as IJwtPayload;
  } catch {
    throw new Error('Invalid or expired token');
  }
}
