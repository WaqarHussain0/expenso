import type { Metadata } from 'next';
import mongoose from 'mongoose';
import { notFound } from 'next/navigation';
import { requireAdminPage } from '@/lib/admin-page-guard';
import { UserInsightsService } from '@/backend/modules/user/services/user-insights.service';
import UserDetailsWrapper from './UserDetails.wrapper';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: 'User details' };

const insightsService = new UserInsightsService();

const Page = async ({ params }: PageProps) => {
  const admin = await requireAdminPage();
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) notFound();

  const insights = await insightsService.getUserInsights(id);
  if (!insights) notFound();

  return (
    <UserDetailsWrapper
      insights={insights}
      isSelf={admin.id === insights.user.id}
    />
  );
};

export default Page;
