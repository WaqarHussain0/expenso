'use client';

import dynamic from 'next/dynamic';
import { Panel, RatioRow, SplitBar } from '@/components/feature/user/admin-ui';
import type { IAdminOverview } from '@/backend/modules/user/services/user-insights.service';

// Charts only load when the Insights view is opened
const UserGrowthChart = dynamic(
  () => import('@/components/feature/user/UserGrowthChart'),
  { ssr: false, loading: () => <div className="h-[260px]" /> },
);

/** The Insights view: growth chart, engagement ratios and split bars. */
const UserInsightsPanels: React.FC<{ overview: IAdminOverview }> = ({
  overview,
}) => {
  const { totals, signInMethods, genders, trend } = overview;
  const users$ = totals.users;

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Panel
        title="Growth"
        description="New users and transactions logged per month, last 12 months."
        className="lg:col-span-2"
      >
        <UserGrowthChart data={trend} />
      </Panel>

      <Panel
        title="Engagement"
        description="How far users have got with the app."
        bodyClassName="space-y-4"
      >
        <RatioRow
          label="Finished first-time setup"
          value={totals.onboarded}
          total={users$}
        />
        <RatioRow
          label="Logged at least one transaction"
          value={totals.withTransactions}
          total={users$}
          color="#6366f1"
        />
        <RatioRow
          label={`Active in the last ${totals.activeWindowDays} days`}
          value={totals.activeRecently}
          total={users$}
          color="#0ea5e9"
        />
        <RatioRow
          label="Using their own AI keys"
          value={totals.withOwnAiKeys}
          total={users$}
          color="#f59e0b"
        />
        <dl className="border-ink/[0.06] grid grid-cols-3 gap-3 border-t pt-4">
          {[
            { label: 'Transactions', value: totals.transactions },
            { label: 'This month', value: totals.transactionsThisMonth },
            { label: 'Share links', value: totals.shareLinks },
          ].map(item => (
            <div key={item.label}>
              <dt className="inter text-ink-subtle text-[11px]">
                {item.label}
              </dt>
              <dd className="manrope text-ink text-lg font-bold tabular-nums">
                {item.value.toLocaleString()}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel title="Sign-in method" description="How each account was created.">
        <SplitBar
          segments={[
            {
              label: 'Email',
              value: signInMethods.email,
              color: '#1a7f5a',
            },
            {
              label: 'Google',
              value: signInMethods.google,
              color: '#4285F4',
            },
          ]}
        />
      </Panel>

      <Panel title="Gender" description="From users' profiles.">
        <SplitBar
          segments={[
            { label: 'Male', value: genders.male, color: '#0ea5e9' },
            { label: 'Female', value: genders.female, color: '#ec4899' },
            { label: 'Other', value: genders.other, color: '#a78bfa' },
            { label: 'Not set', value: genders.notSet, color: '#94a3b8' },
          ]}
        />
      </Panel>

      <Panel
        title="Account status"
        description="Deactivated users can't sign in; their data is kept."
      >
        <SplitBar
          segments={[
            { label: 'Active', value: totals.active, color: '#059669' },
            {
              label: 'Deactivated',
              value: totals.deactivated,
              color: '#f43f5e',
            },
          ]}
        />
      </Panel>
    </div>
  );
};

export default UserInsightsPanels;
