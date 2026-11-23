'use client';

import TextElement from '@/components/common/TextElement';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Row from '@/components/common/Row';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTransition } from 'react';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { emailInputField } from '@/app/constants/input.constant';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { forgotPasswordAction } from '@/lib/server-actions/auth.server-action';

interface IForgotPasswordRequest {
  email: string;
}

const ForgotPasswordWrapper = () => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IForgotPasswordRequest>();

  const onSubmit = async (data: IForgotPasswordRequest) => {
    startTransition(async () => {
      const result = await forgotPasswordAction(data.email);

      if (result.success) {
        toast.success('Request Successful', {
          description: 'Check your email for further actions',
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
        Forgot Password
      </TextElement>
      <TextElement as="p" className="mb-7 md:mb-8">
        Enter your email and we&apos;ll send you a reset link.
      </TextElement>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Email Input */}
        <div className="space-y-2">
          <Label className="text-ink">{emailInputField.label}</Label>
          <Controller
            name={emailInputField.name as 'email'}
            control={control}
            rules={emailInputField.rules}
            render={({ field }) => (
              <div className="flex flex-col">
                <Input
                  {...field}
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

        <Row className="w-full items-center justify-between">
          <Link href={PAGE_ROUTES.login}>
            <TextElement as="span">Login</TextElement>
          </Link>

          <Button
            type="submit"
            disabled={isPending}
            className="h-10 rounded-lg px-6"
          >
            {isPending ? 'Sending...' : 'Reset Password'}
          </Button>
        </Row>
      </form>
    </div>
  );
};

export default ForgotPasswordWrapper;
