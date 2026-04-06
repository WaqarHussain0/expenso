/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import Row from '@/components/common/Row';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSetProfileMutation } from '@/lib/rtk/services/user.rtk.service';
import { UserGenderEnum } from '@/types/user-profile.type';

import { IUser } from '@/types/user.type';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
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

const UserProfileForm: React.FC<IUserProfileFormProps> = ({ user }) => {
  const router = useRouter();

  const [setProfile, { isLoading: isSubmitting }] = useSetProfileMutation();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors,isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      email: user?.email || '',
      name: user?.name || '',
      contact: user?.profile?.contact || '',
      gender: user?.profile?.gender || UserGenderEnum.MALE,
    },
  });

  const userGenders = [
    { id: UserGenderEnum.MALE, name: UserGenderEnum.MALE },
    { id: UserGenderEnum.FEMALE, name: UserGenderEnum.FEMALE },
    { id: UserGenderEnum.OTHER, name: UserGenderEnum.OTHER },
  ];

  const getGenderColor = (gender: UserGenderEnum | undefined) => {
    switch (gender) {
      case UserGenderEnum.MALE:
        return 'bg-primary/20 text-primary border-primary';
      case UserGenderEnum.FEMALE:
        return 'bg-destructive/20 text-destructive border-destructive';
      case UserGenderEnum.OTHER:
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500';
      default:
        return null;
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await setProfile({
        name: data.name,
        contact: data.contact,
        gender: data.gender,
        userId: user?.id || '',
      }).unwrap();

      if (response.success) {
        reset();
        toast.success('Request Successfull', {
          description: 'Profile saved successfully',
        });
        router.refresh();
        return;
      }
    } catch (error: any) {
      console.log('err : ', error);
      toast.error('Request failed', {
        description: error?.data?.error || 'Something went wrong',
      });
    }
  };

  useEffect(() => {
    if (user) {
      reset({
        email: user.email || '',
        name: user.name || '',
        contact: user.profile?.contact || '',
        gender: user.profile?.gender || UserGenderEnum.MALE,
      });
    }
  }, [user, reset]);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Row className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-2">
          <div className="space-y-2">
            <Label>Name</Label>

            <Input
              type="text"
              disabled
              placeholder="John Doe"
              {...register('name', {
                required: 'Name is required',
                validate: value =>
                  value.trim().length > 0 || 'Name is required',
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              disabled
              type="text"
              placeholder="john.doe@example.com"
              {...register('email')}
            />
          </div>

          <div className="space-y-2">
            <Label>Contact</Label>

            <Input
              type="text"
              placeholder="+92 317 4945496"
              {...register('contact', {
                required: 'Contact is required',
                validate: value =>
                  value.trim().length > 0 || 'Contact is required',
              })}
            />
            {errors.contact && (
              <p className="text-sm text-red-500">{errors.contact.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Gender *</Label>

            <Controller
              name="gender"
              control={control}
              rules={{ required: 'Gender is required' }}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {userGenders.map(type => {
                    const isActive = field.value === type.id;

                    return (
                      <Button
                        type="button"
                        key={type.id}
                        onClick={() => field.onChange(type.id)}
                        className={`flex items-center gap-2 border px-3 capitalize transition-all ${
                          isActive
                            ? `${getGenderColor(type.id)} `
                            : 'text-muted-foreground hover:bg-muted border-gray-300 bg-transparent'
                        } `}
                      >
                        {type.name}
                      </Button>
                    );
                  })}
                </div>
              )}
            />

            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender.message}</p>
            )}
          </div>
        </Row>

        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {' '}
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </>
  );
};

export default UserProfileForm;
