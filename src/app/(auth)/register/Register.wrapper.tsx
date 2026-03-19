/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
/* eslint-disable react/no-unescaped-entities */
import {
  emailInputField,
  nameInputField,
  passwordInputField,
} from '@/app/constants/input.constant';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import Row from '@/components/common/Row';
import TextElement from '@/components/common/TextElement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { baseUrl } from '@/app/constants/app.constant';

interface IFormValues {
  name: string;
  email: string;
  password: string;
}

const RegisterWrapper = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormValues>();

  const onSubmit = async (data: IFormValues) => {
    try {
      setLoading(true);

      const res = await fetch(`${baseUrl}/api/auth/register`, {
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
        description: result?.message || 'Your account has been created.',
      });

      reset();
      router.push(PAGE_ROUTES.login);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="page-fade bg-opacity-90 w-full max-w-md rounded-lg bg-white p-5 shadow-lg backdrop-blur-sm md:p-8">
      <TextElement as="h1" className="mb-8">
        Register
      </TextElement>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Name Input */}

        <div className="space-y-2">
          <Label className="text-[#D47E30]">{nameInputField.label}</Label>
          <Controller
            name={nameInputField.name as 'name'}
            control={control}
            rules={nameInputField.rules}
            render={({ field }) => (
              <div className="flex flex-col">
                <Input
                  {...field}
                  type="text"
                  placeholder={nameInputField.placeholder}
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
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Row>

        <Row className="flex-col justify-center">
          <TextElement as="p" className="text-[#D47E30]">
            Already have an account?
          </TextElement>
          <Link href={PAGE_ROUTES.login}>
            <TextElement as="span">Login here</TextElement>
          </Link>
        </Row>
      </form>
    </div>
  );
};

export default RegisterWrapper;
