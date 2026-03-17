/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import TextElement from '@/components/common/TextElement';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Row from '@/components/common/Row';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { emailInputField } from '@/app/constants/input.constant';
import { Label } from '@/components/ui/label';
import { baseUrl } from '@/app/constants/app.constant';
import Link from 'next/link';

interface IForgotPasswordRequest {
  email: string;
}

const ForgotPasswordWrapper = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IForgotPasswordRequest>();

  const onSubmit = async (data: IForgotPasswordRequest) => {
    try {
      setLoading(true);

      const res = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || 'Something went wrong');
      }

      toast.success('Request Successful', {
        description: result?.message || 'Check your inbox for the reset link',
      });

      reset();
      router.push(PAGE_ROUTES.login);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-fade bg-opacity-90 w-full max-w-md rounded-lg bg-white p-5 shadow-lg backdrop-blur-sm md:p-8">
      <TextElement as="h1" className="mb-8">
        Forgot Password
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

        <Row className="w-full items-center justify-between">
          <Link href={PAGE_ROUTES.login}>
            <TextElement as="span">Login</TextElement>
          </Link>

          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Reset Password'}
          </Button>
        </Row>
      </form>
    </div>
  );
};

export default ForgotPasswordWrapper;
