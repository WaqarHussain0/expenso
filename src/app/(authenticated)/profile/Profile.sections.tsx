import mongoose from 'mongoose';
import Skeleton from 'react-loading-skeleton';
import { UserProfileService } from '@/backend/modules/user/services/user-profile.service';
import { AiKeysService } from '@/backend/modules/ai-keys/ai-keys.service';
import UserProfileForm from '@/components/feature/user-profile/UserProfile.form';
import AiKeysCard from '@/components/feature/user-profile/AiKeys.card';
import { Card } from '@/components/ui/card';

const userProfileService = new UserProfileService();
const aiKeysService = new AiKeysService();

// ───────────────────────────── Profile form ─────────────────────────────

export const ProfileFormSection = async ({ userId }: { userId: string }) => {
  const user = await userProfileService.getProfileByUserId(
    new mongoose.Types.ObjectId(userId),
  );

  return <UserProfileForm user={user} />;
};

/** Dark-panel placeholder — the default skeleton colours vanish on it. */
const PanelBar = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-full bg-white/10 ${className}`} />
);

/** Identity card + details form, same grid as the loaded form. */
export const ProfileFormSkeleton = () => (
  <div
    className="grid w-full grid-cols-1 gap-5 lg:grid-cols-[340px_1fr]"
    aria-busy="true"
    aria-label="Loading profile"
  >
    <aside className="bg-panel relative h-fit overflow-hidden rounded-2xl p-6">
      <div className="flex flex-col items-center gap-3">
        <PanelBar className="size-[86px]" />
        <PanelBar className="mt-1 h-5 w-40" />
        <PanelBar className="h-3 w-48" />
      </div>
      <div className="mt-6 space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <PanelBar key={i} className="h-3 w-full" />
        ))}
      </div>
    </aside>

    <Card className="gap-5 p-6">
      <Skeleton width={140} height={16} />
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i}>
          <Skeleton width={80} height={12} />
          <Skeleton height={36} borderRadius={8} className="mt-2" />
        </div>
      ))}
      <Skeleton width={120} height={36} borderRadius={8} />
    </Card>
  </div>
);

// ───────────────────────────── AI keys ─────────────────────────────

export const AiKeysSection = async ({ userId }: { userId: string }) => {
  const keys = await aiKeysService.listForUser(userId);
  return <AiKeysCard keys={keys} />;
};

export const AiKeysSkeleton = () => (
  <section
    className="bg-surface ring-ink/[0.06] overflow-hidden rounded-2xl ring-1"
    aria-busy="true"
    aria-label="Loading AI provider keys"
  >
    <div className="border-ink/[0.06] border-b px-6 py-5">
      <Skeleton width={130} height={14} />
      <Skeleton width="55%" height={12} className="mt-1" />
    </div>
    <div className="space-y-3 px-6 py-5">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton width={36} height={36} borderRadius={10} />
          <div className="flex-1">
            <Skeleton width="25%" height={13} />
            <Skeleton width="40%" height={11} className="mt-1" />
          </div>
          <Skeleton width={80} height={32} borderRadius={8} />
        </div>
      ))}
    </div>
  </section>
);
