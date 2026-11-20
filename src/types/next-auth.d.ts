import 'next-auth';
import 'next-auth/jwt';
import { IUser } from './user.type';

declare module 'next-auth' {
  interface Session {
    user: IUser;
    accessToken?: string;
    /** Set when the session can no longer be refreshed — client should sign out */
    error?: 'RefreshAccessTokenError' | 'SessionExpired' | string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: Pick<IUser, 'id' | 'email' | 'name' | 'role'>;
    accessToken?: string;
    /** epoch ms */
    accessTokenExpires?: number;
    /** Opaque refresh token — server-side only, never sent to the client */
    refreshToken?: string;
    /** epoch ms */
    refreshTokenExpires?: number;
    error?: string;
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser {
    id: string;
    role: string;
    name: string;
    email: string;
    accessToken?: string;
  }
}
