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
    <div className="page-fade bg-opacity-90 w-full max-w-md rounded-lg bg-white p-5 shadow-lg backdrop-blur-sm md:p-8">
      <TextElement as="h1" className="mb-4 md:mb-8">
        Reset Password
      </TextElement>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label className="text-[#0d1117]">{passwordInputField.label}</Label>
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
                  type={showPassword ? 'text' : 'password'}
                  placeholder={passwordInputField.placeholder}
                />

                {/* Show/Hide Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2.5 right-3 text-gray-400"
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

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Password'}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordWrapper;
