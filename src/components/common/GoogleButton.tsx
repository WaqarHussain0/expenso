'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';

interface IGoogleButtonProps {
  forLogin?: boolean;
}

const GoogleButton: React.FC<IGoogleButtonProps> = ({ forLogin = true }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signIn('google', {
        callbackUrl: PAGE_ROUTES.dashboard,
      });
    } catch (error) {
      console.error('Google login error:', error);
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleLogin}
      variant="outline"
      disabled={loading}
      className="flex h-11 w-full items-center justify-center gap-2 text-sm font-medium"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {forLogin ? 'Signing in...' : 'Creating account'}
        </>
      ) : (
        <>
          {/* Google SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="h-5 w-5"
          >
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303C33.695 32.659 29.259 36 24 36c-6.627 
              0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 
              1.154 7.961 3.039l5.657-5.657C34.046 6.053 
              29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 
              20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 16.108 
              18.961 13 24 13c3.059 0 5.842 1.154 
              7.961 3.039l5.657-5.657C34.046 6.053 
              29.268 4 24 4c-7.732 0-14.41 4.418-17.694 
              10.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.166 0 9.86-1.977 
              13.409-5.193l-6.19-5.238C29.211 
              35.091 26.715 36 24 36c-5.238 
              0-9.673-3.341-11.303-8.009l-6.571 
              5.057C9.385 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303c-1.108 
              3.159-3.266 5.738-6.084 
              7.569l.003-.002 6.19 5.238C33.986 
              39.205 44 32 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>
          {forLogin ? 'Login' : 'Continue'} with Google
        </>
      )}
    </Button>
  );
};

export default GoogleButton;
