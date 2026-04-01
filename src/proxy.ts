import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import PAGE_ROUTES from './app/constants/page-routes.constant';
// import type { NextRequest } from "next/server";

// Export the custom middleware wrapped with NextAuth's `withAuth`
export default withAuth(
  function middleware() {
    // function middleware(req: NextRequest) {

    try {
      return NextResponse.next();
    } catch (error) {
      console.error('❌ Middleware error:', error);
      return NextResponse.next(); // fallback to avoid breaking the app
    }
  },

  {
    callbacks: {
      authorized: ({ token }) => {
        try {
          if (!token || !token.accessToken) {
            return false;
          }
          return true;
        } catch (err) {
          console.error('❌ Authorization callback error:', err);
          return false;
        }
      },
    },

    pages: {
      signIn: PAGE_ROUTES.login,
    },
  },
);

// 🛡️ Apply middleware to specific routes
export const config = {
  matcher: ['/stats', '/category', '/transaction', '/preferences'],
};
