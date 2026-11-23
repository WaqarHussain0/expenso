/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from 'next/navigation';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { StatsService } from '@/backend/modules/stats/stats.service';
import { FilterOptionEnum } from '@/lib/rtk/services/dashboard.rtk.service';
import SharedStatsWrapper from './SharedStats.wrapper';
import SharedStatsSection from './SharedStats.section';
import SharedStatsView from './SharedStats.view';
import mongoose from 'mongoose';
import type { Metadata } from 'next';
import { Suspense, cache } from 'react';

type IUser = {
  _id: string;
  name: string;
  email: string;
};

type SearchParams = Promise<{
  m: string;
}>;

const statsService = new StatsService();

// generateMetadata and the page both need the share record — cache() makes
// that one database lookup per request instead of two.
const getSharedStat = cache((token: string) =>
  statsService.getStatsByToken(token),
);

// Shared reports contain someone's personal finances: never index them.
const PRIVATE_ROBOTS: Metadata['robots'] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false },
};

// Type guard to check if userId is populated
const isUser = (user: any): user is IUser => {
  return user && typeof user === 'object' && 'name' in user;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { m } = await searchParams;

  if (!m) {
    return {
      title: 'Shared Stats',
      description: 'View shared financial statistics.',
      robots: PRIVATE_ROBOTS,
    };
  }

  const stat = await getSharedStat(m);

  if (!stat || !stat.filter) {
    return {
      title: 'Shared Stats',
      description: 'Invalid or expired shared stats link.',
      robots: PRIVATE_ROBOTS,
    };
  }

  const { filter, userId } = stat;
  const { type, startDate, endDate, year } = filter;

  const userName = isUser(userId) ? userId.name : 'User';

  // Format date text
  let dateText = '';
  if (type === FilterOptionEnum.MONTH && startDate && endDate) {
    dateText = `${startDate.toDateString()} - ${endDate.toDateString()}`;
  } else if (type === FilterOptionEnum.YEAR && year) {
    dateText = `Year ${year}`;
  } else if (type === FilterOptionEnum.CUSTOM && startDate && endDate) {
    dateText = `${startDate.toDateString()} - ${endDate.toDateString()}`;
  }

  const title = `${userName}'s Financial Stats (${type})`;
  const description = `View ${userName}'s ${type.toLowerCase()} financial stats for ${dateText}. Includes income, expenses, investments, and visual insights.`;

  return {
    title,
    description,
    robots: PRIVATE_ROBOTS,

    openGraph: {
      title,
      description,
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
/**
 * Validates the share link (one quick lookup) and renders the header right
 * away; the report data streams in behind a loading view of the same layout.
 */
const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { m } = await searchParams;

  if (!m) {
    redirect(PAGE_ROUTES.stats);
  }

  const stat = await getSharedStat(m);

  if (!stat || !stat.filter) {
    redirect(PAGE_ROUTES.stats);
  }

  const { filter, userId } = stat;
  const { type, startDate, endDate, year } = filter;

  // Validate everything the report needs up front: redirects must happen
  // before streaming starts, not from inside the streamed section.
  const isValid =
    (type === FilterOptionEnum.MONTH && !!startDate && !!endDate) ||
    (type === FilterOptionEnum.YEAR && year !== undefined) ||
    (type === FilterOptionEnum.CUSTOM && !!startDate && !!endDate);

  if (!isValid) {
    redirect(PAGE_ROUTES.stats);
  }

  const userObjectId =
    typeof userId === 'string'
      ? new mongoose.Types.ObjectId(userId)
      : new mongoose.Types.ObjectId(userId?._id); // wrap string _id as ObjectId

  // Safely get name
  const userName = isUser(userId) ? userId.name : 'User';

  return (
    <SharedStatsWrapper
      filterType={type}
      userName={userName}
      dateRange={{
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        year,
      }}
    >
      <Suspense fallback={<SharedStatsView filterType={type} isLoading />}>
        <SharedStatsSection
          type={type}
          userObjectId={userObjectId}
          startDate={startDate}
          endDate={endDate}
          year={year}
        />
      </Suspense>
    </SharedStatsWrapper>
  );
};

export default Page;
