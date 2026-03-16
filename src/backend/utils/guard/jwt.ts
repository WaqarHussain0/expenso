import jwt from 'jsonwebtoken';

export interface IJwtPayload {
  id: string;
  email: string;
  role: string;
}

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your_super_secret';

export function verifyToken(token: string): IJwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as IJwtPayload;
  } catch {
    throw new Error('Invalid or expired token');
  }
}
