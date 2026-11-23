'use client';
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
import { useState, useTransition } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import GoogleButton from '@/components/common/GoogleButton';
import { registerAction } from '@/lib/server-actions/auth.server-action';

interface IFormValues {
  name: string;
  email: string;
  password: string;
}

const RegisterWrapper = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (data: IFormValues) => {
    startTransition(async () => {
      const result = await registerAction({
        email: data.email,
        name: data.name,
        password: data.password,
      });

      if (result.success) {
        toast.success('Request Successful', {
          description: 'Your account has been created.',
        });
        reset();

        router.push(PAGE_ROUTES.login);
      }

      if (!result.success) {
        toast.error('Request failed', {
          description: result.error || 'Something went wrong',
        });
      }
    });
  };
  return (
    <div className="page-fade border-ink/[0.06] bg-surface w-full rounded-2xl border p-6 shadow-[0_1px_2px_rgba(13,17,23,0.04),0_24px_48px_-16px_rgba(13,17,23,0.14)] md:p-10">
      <TextElement
        as="h1"
        className="mb-2 !text-[30px] !font-bold tracking-tight md:!text-[34px]"
        style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
      >
        Register
      </TextElement>
      <TextElement as="p" className="mb-7 md:mb-8">
        Start tracking in under 2 minutes. Free forever.
      </TextElement>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Name Input */}

        <div className="space-y-2">
          <Label htmlFor="register-name" className="text-ink">
            {nameInputField.label}
          </Label>
          <Controller
            name={nameInputField.name as 'name'}
            control={control}
            rules={nameInputField.rules}
            render={({ field }) => (
              <div className="flex flex-col">
                <Input
                  {...field}
                  id="register-name"
                  className="bg-surface-2 focus-visible:bg-surface h-11 px-3.5 focus-visible:border-[#1a7f5a] focus-visible:ring-[#1a7f5a]/15"
                  type="text"
                  placeholder={nameInputField.placeholder}
                />
                {errors.name && (
                  <TextElement
                    as="span"
                    className="mt-1 text-xs !text-red-500 !no-underline"
                  >
                    {errors.name.message}
                  </TextElement>
                )}
              </div>
            )}
          />
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="register-email" className="text-ink">
            {emailInputField.label}
          </Label>

          <Controller
            name={emailInputField.name as 'email'}
            control={control}
            rules={emailInputField.rules}
            render={({ field }) => (
              <div className="flex flex-col">
                <Input
                  {...field}
                  id="register-email"
                  className="bg-surface-2 focus-visible:bg-surface h-11 px-3.5 focus-visible:border-[#1a7f5a] focus-visible:ring-[#1a7f5a]/15"
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
          <Label htmlFor="register-password" className="text-ink">
            {passwordInputField.label}
          </Label>
          <Controller
            name={passwordInputField.name as 'password'}
            control={control}
            rules={passwordInputField.rules}
            render={({ field }) => (
              <div className="relative flex flex-col">
                <Input
                  {...field}
                  id="register-password"
                  className="bg-surface-2 focus-visible:bg-surface h-11 px-3.5 focus-visible:border-[#1a7f5a] focus-visible:ring-[#1a7f5a]/15"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={passwordInputField.placeholder}
                />
                <button
                  type="button"
                  className="absolute top-[13px] right-3 cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
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

        <Button
          type="submit"
          disabled={isPending}
          className="h-10 w-full rounded-lg px-6"
        >
          {isPending ? 'Registering...' : 'Register'}
        </Button>
        <GoogleButton forLogin={false} />

        <Row className="flex-col justify-center">
          <TextElement as="p" className="">
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
