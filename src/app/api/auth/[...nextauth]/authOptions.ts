/* eslint-disable @typescript-eslint/no-explicit-any */

import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { ILoginResponse, IUser } from '@/types/user.type';
import jwt from 'jsonwebtoken';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(
        credentials,
      ): Promise<(IUser & { accessToken: string }) | null> {
        if (!credentials?.email || !credentials?.password) return null;

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

        try {
          const res = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data: ILoginResponse | any = await res.json();

          if (data.error) {
            // Throw error message so NextAuth can surface it to frontend
            throw new Error(data?.error || 'Login failed');
          }

          // Normal login
          return {
            ...data.data.user,
            accessToken: data.data.accessToken,
          };
        } catch (err: string | any) {
          console.error('Authorize error:', err);
          // Important: rethrow to send the message back to signIn() response
          throw new Error(err || 'Login failed');
          // console.error("Authorize error:", err);
          // return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      console.log('Callback user : ', user);
      return true;
    },

    async jwt({ token, user }) {
      // Initial login
      if (user) {
        const customUser = user as IUser & {
          accessToken?: string;
        };

        const decoded = customUser.accessToken
          ? (jwt.decode(customUser.accessToken) as { exp?: number } | null)
          : null;

        token.user = {
          id: customUser.id,
          email: customUser.email!,
          name: customUser.name,
          role: customUser.role,
        };

        token.accessToken = customUser.accessToken ?? null;

        token.accessTokenExpires = decoded?.exp
          ? decoded.exp * 1000
          : Date.now() + 3600 * 1000;

        return token;
      }

      if (
        token.accessTokenExpires &&
        Date.now() > (token.accessTokenExpires as number)
      ) {
        return {
          ...token,
          accessToken: null,
          user: null,
        };
      }

      return token;
    },

    async session({ session, token }) {
      if (!token?.accessToken) {
        return {
          ...session,
          user: undefined as any,
          accessToken: undefined,
        };
      }

      session.user = token.user as IUser;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },

  pages: {
    signIn: PAGE_ROUTES.login,
  },

  secret: process.env.NEXTAUTH_SECRET,
};
