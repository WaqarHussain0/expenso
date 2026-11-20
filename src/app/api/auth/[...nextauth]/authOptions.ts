/* eslint-disable @typescript-eslint/no-explicit-any */

import 'reflect-metadata';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { AuthService } from '@/backend/modules/auth/auth.service';
import { LoginDto } from '@/backend/modules/auth/dto/login.dto';
import { validateDto } from '@/backend/utils/input-validator.util';
import { REFRESH_TOKEN_TTL_SECONDS } from '@/backend/modules/auth/auth.config';
import { isReadOnlySessionRead } from '@/lib/auth-context';
import { IUser } from '@/types/user.type';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const authService = new AuthService();

/** Refresh the access token a little before it actually expires. */
const ACCESS_TOKEN_REFRESH_SKEW_MS = 30 * 1000;

type TokenBundle = {
  accessToken: string;
  accessTokenExpires: number;
  refreshToken: string;
  refreshTokenExpires: number;
};

/**
 * Exchange the refresh token for a new pair. Returns the token with an
 * `error` set if the refresh token is expired, revoked or reused.
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const { tokens, user } = await authService.refreshTokens(
      token.refreshToken as string,
    );

    return {
      ...token,
      ...tokens,
      // keep name/role in sync with the database
      user: { ...(token.user as IUser), name: user.name, role: user.role },
      error: undefined,
    };
  } catch (error) {
    console.error('Refresh token error:', (error as Error)?.message);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    // The session cookie lives as long as the refresh token
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  },

  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<(IUser & TokenBundle) | null> {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Call the auth service directly — authorize() already runs on the
          // server, so an HTTP round-trip to our own /api/auth/login only
          // added latency and depended on NEXTAUTH_URL being exactly right.
          const dto = await validateDto(LoginDto, {
            email: credentials.email,
            password: credentials.password,
          });

          const { user, ...tokens } = await authService.login(dto);

          return {
            ...(user as unknown as IUser),
            id: String(user.id),
            ...tokens,
          };
        } catch (err: any) {
          // Expected failures (wrong password, inactive account) aren't
          // server errors — log them quietly and surface the message
          console.warn('Authorize failed:', err?.message);
          // Rethrow so the message reaches the signIn() response
          throw new Error(err?.message || 'Login failed');
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Only handle Google login here
      if (account?.provider === 'google') {
        try {
          if (!account.id_token) throw new Error('Missing Google id_token');

          // Verify with Google and issue our tokens directly (no HTTP hop)
          const { userData, ...tokens } = await authService.googleLogin(
            account.id_token,
          );

          // Attach backend response to user
          const u = user as any;
          u.id = String(userData.id);
          u.name = userData.name;
          u.role = userData.role;
          Object.assign(u, tokens);

          return true;
        } catch (error) {
          console.error('Google signIn error:', error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // ── Initial sign-in ─────────────────────────────────────────
      if (user) {
        const u = user as IUser & TokenBundle;

        return {
          ...token,
          user: {
            id: u.id,
            email: u.email!,
            name: u.name,
            role: u.role,
          },
          accessToken: u.accessToken,
          accessTokenExpires: u.accessTokenExpires,
          refreshToken: u.refreshToken,
          refreshTokenExpires: u.refreshTokenExpires,
          error: undefined,
        };
      }

      // ── Profile name changed in the app ────────────────────────
      if (trigger === 'update' && session?.name && token.user) {
        token.user = { ...(token.user as IUser), name: session.name };
      }

      if (token.error) return token;

      const now = Date.now();

      // Sessions created before refresh tokens existed, or past their lifetime
      if (
        !token.refreshToken ||
        !token.refreshTokenExpires ||
        now >= (token.refreshTokenExpires as number)
      ) {
        return { ...token, error: 'SessionExpired' };
      }

      // Access token still valid
      if (
        token.accessTokenExpires &&
        now <
          (token.accessTokenExpires as number) - ACCESS_TOKEN_REFRESH_SKEW_MS
      ) {
        return token;
      }

      // Server components / actions can't persist a rotated cookie — leave the
      // refresh to the client's next /api/auth/session call.
      if (isReadOnlySessionRead()) return token;

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token.error || !token.user) {
        return {
          ...session,
          user: undefined as any,
          accessToken: undefined,
          error: (token.error as string) ?? 'SessionExpired',
        };
      }

      session.user = token.user as IUser;
      session.accessToken = token.accessToken as string;
      // NOTE: the refresh token is deliberately never exposed to the client
      return session;
    },
  },

  events: {
    // Revoke the refresh token server-side when the user logs out
    async signOut({ token }) {
      try {
        await authService.revokeRefreshToken(token?.refreshToken as string);
      } catch (error) {
        console.error('Failed to revoke refresh token on sign-out:', error);
      }
    },
  },

  pages: {
    signIn: PAGE_ROUTES.login,
  },

  secret: process.env.NEXTAUTH_SECRET,
};
