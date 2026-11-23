'use client';
import SegmentedControl from '@/components/common/SegmentedControl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setUserProfileAction } from '@/lib/server-actions/user.server-action';
import { UserGenderEnum } from '@/types/user-profile.type';

import { IUser, UserRoleEnum } from '@/types/user.type';
import {
  CalendarDays,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useTransition } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

type FormValues = {
  name: string;
  email: string;
  contact: string;
  gender: UserGenderEnum;
};

interface IUserProfileFormProps {
  user?: IUser;
}

const GENDER_OPTIONS = [
  { value: UserGenderEnum.MALE, label: 'Male' },
  { value: UserGenderEnum.FEMALE, label: 'Female' },
  { value: UserGenderEnum.OTHER, label: 'Other' },
];

const fieldClass =
  'h-10 bg-surface-2 px-3 focus-visible:border-[#1a7f5a] focus-visible:bg-surface focus-visible:ring-[#1a7f5a]/15';

const toFormValues = (user?: IUser): FormValues => ({
  email: user?.email || '',
  name: user?.name || '',
  contact: user?.profile?.contact || '',
  gender: user?.profile?.gender || UserGenderEnum.MALE,
});

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

const UserProfileForm: React.FC<IUserProfileFormProps> = ({ user }) => {
  const { update } = useSession();

  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({ defaultValues: toFormValues(user) });

  // Live values for the identity card
  const [name, contact, gender] = useWatch({
    control,
    name: ['name', 'contact', 'gender'],
  });

  const onSubmit = async (data: FormValues) => {
    startTransition(async () => {
      const result = await setUserProfileAction({
        name: data.name,
        contact: data.contact,
        gender: data.gender,
      });

      if (result.success) {
        // Make the saved values the new baseline (plain reset() would revert
        // the fields to the *previous* values until the page refreshed)
        reset(data);
        // Push the new name into the JWT token + session
        await update({ name: data.name });
        toast.success('Profile saved', {
          description: 'Your details have been updated.',
        });
      } else {
        toast.error('Request failed', {
          description: result.error || 'Something went wrong',
        });
      }
    });
  };

  useEffect(() => {
    if (user) reset(toFormValues(user));
  }, [user, reset]);

  const isAdmin = user?.role === UserRoleEnum.ADMIN;
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  const details = [
    { icon: Mail, label: 'Email', value: user?.email },
    { icon: Phone, label: 'Contact', value: contact?.trim() },
    {
      icon: UserRound,
      label: 'Gender',
      value: gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : '',
    },
    ...(memberSince
      ? [{ icon: CalendarDays, label: 'Member since', value: memberSince }]
      : []),
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-[340px_1fr]">
      {/* ───────── Identity card ───────── */}
      <aside className="bg-panel relative h-fit overflow-hidden rounded-2xl p-6 text-white shadow-[0_20px_40px_-20px_rgba(13,17,23,0.5)]">
        <div className="fr-grid-bg pointer-events-none absolute inset-0" />
        <div
          className="pointer-events-none absolute -top-24 -right-16 h-[280px] w-[360px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(46,168,120,.22) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-gradient-to-br from-[#34d399] to-[#1a7f5a] p-[3px] shadow-[0_10px_30px_-10px_rgba(52,211,153,0.6)]">
              <div className="bg-panel ring-ink flex size-20 items-center justify-center rounded-full ring-2">
                <span className="manrope text-2xl font-bold text-white">
                  {getInitials(name || user?.name || '')}
                </span>
              </div>
            </div>

            <h2
              className="mt-4 max-w-full truncate text-xl font-bold text-[#f4f4f4] capitalize"
              style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
            >
              {name?.trim() || 'Your name'}
            </h2>

            <span className="inter mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-white/70">
              <ShieldCheck className="size-3.5 text-[#34d399]" />
              {isAdmin ? 'Administrator' : 'Member'}
            </span>
          </div>

          <div className="my-6 h-px bg-white/[0.08]" />

          <dl className="space-y-4">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-[#34d399]">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <dt className="inter text-[11px] text-white/40">{label}</dt>
                  <dd className="inter truncate text-sm text-white/90">
                    {value || <span className="text-white/30">Not set</span>}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </aside>

      {/* ───────── Form ───────── */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface ring-ink/[0.06] flex flex-col overflow-hidden rounded-2xl shadow-[0_1px_2px_rgba(13,17,23,0.04)] ring-1"
      >
        <div className="border-ink/[0.06] border-b px-6 py-5">
          <p className="inter text-ink text-sm font-semibold">
            Personal details
          </p>
          <p className="inter text-ink-subtle text-xs">
            Used to personalise your experience across Expenso.
          </p>
        </div>

        <div className="grid flex-1 grid-cols-1 items-start gap-x-5 gap-y-6 p-6 md:grid-cols-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="profile-name">Full name</Label>
            <Input
              id="profile-name"
              type="text"
              placeholder="John Doe"
              aria-invalid={!!errors.name}
              className={fieldClass}
              {...register('name', {
                required: 'Name is required',
                validate: value =>
                  value.trim().length > 0 || 'Name is required',
              })}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <div className="relative">
              <Input
                id="profile-email"
                disabled
                type="text"
                className={`${fieldClass} pr-9 disabled:opacity-70`}
                {...register('email')}
              />
              <Lock className="text-ink-subtle pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2" />
            </div>
            <p className="inter text-ink-subtle text-[11px]">
              Your sign-in email can&apos;t be changed.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <Label htmlFor="profile-contact">Contact number</Label>
            <div className="relative">
              <Phone className="text-ink-subtle pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                id="profile-contact"
                type="tel"
                inputMode="tel"
                placeholder="+92 300 1234567"
                aria-invalid={!!errors.contact}
                className={`${fieldClass} pl-9`}
                {...register('contact', {
                  required: 'Contact is required',
                  validate: value =>
                    value.trim().length > 0 || 'Contact is required',
                })}
              />
            </div>
            {errors.contact && (
              <p className="text-xs text-red-500">{errors.contact.message}</p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>Gender</Label>
            <Controller
              name="gender"
              control={control}
              rules={{ required: 'Gender is required' }}
              render={({ field }) => (
                <SegmentedControl
                  ariaLabel="Gender"
                  options={GENDER_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  className="flex w-full [&>button]:h-9 [&>button]:flex-1 [&>button]:justify-center"
                />
              )}
            />
            {errors.gender && (
              <p className="text-xs text-red-500">{errors.gender.message}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-ink/[0.06] bg-surface-2 flex flex-col-reverse gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p
            className={`inter flex items-center gap-2 text-xs transition-opacity duration-300 ${
              isDirty
                ? 'text-[#b45309] opacity-100 dark:text-[#fbbf24]'
                : 'opacity-0'
            }`}
            aria-live="polite"
          >
            <span className="size-1.5 rounded-full bg-[#f59e0b]" />
            {isDirty ? 'You have unsaved changes' : ''}
          </p>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!isDirty || isPending}
              onClick={() => reset()}
            >
              Discard
            </Button>
            <Button
              type="submit"
              disabled={isPending || !isDirty}
              className="px-5"
            >
              {isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;
