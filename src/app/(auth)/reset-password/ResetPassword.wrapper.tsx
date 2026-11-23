'use client';

import TextElement from '@/components/common/TextElement';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState, useTransition } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { passwordInputField } from '@/app/constants/input.constant';
import { Label } from '@/components/ui/label';
import { resetPasswordAction } from '@/lib/server-actions/auth.server-action';

interface IResetPasswordRequest {
  password: string;
}

const ResetPasswordWrapper = ({ token }: { token: string }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IResetPasswordRequest>();

  const onSubmit = async (data: IResetPasswordRequest) => {
    startTransition(async () => {
      const result = await resetPasswordAction(token, data.password);

      if (result.success) {
        toast.success('Request Successful', {
          description: 'Password reset successfully',
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
        Reset Password
      </TextElement>
      <TextElement as="p" className="mb-7 md:mb-8">
        Choose a strong new password for your account.
      </TextElement>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label className="text-ink">{passwordInputField.label}</Label>
          <Controller
            name={passwordInputField.name as 'password'}
            control={control}
            rules={{
              ...passwordInputField.rules,
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            render={({ field }) => (
              <div className="relative flex flex-col">
                <Input
                  {...field}
                  className="bg-surface-2 focus-visible:bg-surface h-11 px-3.5 focus-visible:border-[#1a7f5a] focus-visible:ring-[#1a7f5a]/15"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={passwordInputField.placeholder}
                />

                {/* Show/Hide Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-[13px] right-3 cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
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
          className="h-10 rounded-lg px-6"
        >
          {isPending ? 'Saving...' : 'Save Password'}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordWrapper;
