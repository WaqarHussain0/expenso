/* eslint-disable react/no-unescaped-entities */
'use client';

import TextElement from '@/components/common/TextElement';
import { Input } from '@/components/ui/input';

import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Row from '@/components/common/Row';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import {
  emailInputField,
  passwordInputField,
} from '@/app/constants/input.constant';
import Link from 'next/link';
import { Label } from '@/components/ui/label';

interface ILoginRequest {
  email: string;
  password: string;
}

const LoginWrapper = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginRequest>();

  const onSubmit = async (data: ILoginRequest) => {
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      toast.error('Login Failed', {
        description: res.error, // ✅ show backend message directly
      });
      setLoading(false);
      return;
    }

    toast.success('Login Successful', {
      description: 'You are now logged in',
    });

    router.push(PAGE_ROUTES.dashboard);

    setLoading(false);
  };

  return (
    <div className="page-fade bg-opacity-90 w-full max-w-md rounded-lg bg-white p-5 shadow-lg backdrop-blur-sm md:p-8">
      <TextElement as="h1" className="mb-8">
        Login
      </TextElement>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Email Input */}
        <div className="space-y-2">
          <Label className="text-[#D47E30]">{emailInputField.label}</Label>
          <Controller
            name={emailInputField.name as 'email'}
            control={control}
            rules={emailInputField.rules}
            render={({ field }) => (
              <div className="flex flex-col">
                <Input
                  {...field}
                  type="email"
                  placeholder={emailInputField.placeholder}
                />
                {errors.email && (
                  <TextElement
                    as="span"
                    className="mt-1 text-xs !text-red-500 !no-underline"
                  >
                    {errors.email.message}
                  </TextElement>
                )}
              </div>
            )}
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <Label className="text-[#D47E30]">{passwordInputField.label}</Label>
          <Controller
            name={passwordInputField.name as 'password'}
            control={control}
            rules={passwordInputField.rules}
            render={({ field }) => (
              <div className="relative flex flex-col">
                <Input
                  {...field}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={passwordInputField.placeholder}
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 cursor-pointer text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <TextElement
                    as="span"
                    className="mt-1 text-xs !text-red-500 !no-underline"
                  >
                    {errors.password.message}
                  </TextElement>
                )}
              </div>
            )}
          />
        </div>

        <Row className="w-full items-center justify-between">
          <Link href={PAGE_ROUTES.forgotPassword}>
            <TextElement as="span">Forgot password</TextElement>
          </Link>

          <Button type="submit" disabled={loading} className="bg-[#6D3B07]">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Row>

        <Row className="flex-col justify-center">
          <TextElement as="p" className="text-[#D47E30]">
            Don't have an account?
          </TextElement>
          <Link href={PAGE_ROUTES.register}>
            <TextElement as="span" className="">
              Signup here
            </TextElement>
          </Link>
        </Row>
      </form>
    </div>
  );
};

export default LoginWrapper;
