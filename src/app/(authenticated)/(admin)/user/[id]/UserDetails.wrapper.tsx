import {
  CalendarDays,
  CalendarPlus,
  FolderTree,
  KeyRound,
  Link2,
  LogIn,
  MonitorSmartphone,
  Phone,
  Receipt,
  Activity,
  VenusAndMars,
  Clock,
} from 'lucide-react';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { COLOR_CODES } from '@/app/constants/app.constant';
import PageHeader from '@/components/common/PageHeader';
import StatWrapper from '@/components/common/Stat.wrapper';
import CategoryIcon from '@/components/common/CategoryIcon';
import EmptyState from '@/components/common/EmptyState';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import UserAdminActions from '@/components/feature/user/UserAdminActions';
import UserActivityChart from '@/components/feature/user/UserActivityChart';
import {
  AdminPill,
  AiKeyPill,
  Fact,
  KpiTile,
  Panel,
  Pill,
  SignInPill,
  StatusPill,
} from '@/components/feature/user/admin-ui';
import { buildCashflowStats } from '@/lib/stats.util';
import { daysSince, formatDate, formatRelative } from '@/lib/date.util';
import { formatCompactAmount, getInitials } from '@/lib/utils';
import { UserRoleEnum } from '@/types/user.type';
import type { IAdminUserInsights } from '@/backend/modules/user/services/user-insights.service';

interface IUserDetailsWrapperProps {
  insights: IAdminUserInsights;
  /** The admin is looking at their own account */
  isSelf: boolean;
}

const TYPE_COLOR: Record<string, string> = {
  income: COLOR_CODES.income,
  expense: COLOR_CODES.expense,
  investment: COLOR_CODES.investment,
};

const TYPE_TONE = {
  income: 'success',
  expense: 'danger',
  investment: 'warning',
} as const;

const TypePill: React.FC<{ type: string | null }> = ({ type }) =>
  type ? (
    <Pill
      tone={TYPE_TONE[type as keyof typeof TYPE_TONE] ?? 'muted'}
      className="capitalize"
    >
      {type}
    </Pill>
  ) : null;

/** "Month · Nov 2026", "Year · 2026", "Custom · 1 Jan – 31 Mar 2026" */
const describeShareLink = (link: IAdminUserInsights['shareLinks'][number]) => {
  if (link.type === 'year' && link.year) return `Year ${link.year}`;
  if (link.type === 'month' && link.startDate) {
    return new Date(link.startDate).toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
    });
  }
  if (link.startDate && link.endDate) {
    return `${formatDate(link.startDate)} – ${formatDate(link.endDate)}`;
  }
  return link.type || 'Report';
};

const UserDetailsWrapper: React.FC<IUserDetailsWrapperProps> = ({
  insights,
  isSelf,
}) => {
  const {
    user,
    profile,
    activity,
    thisMonth,
    lifetime,
    trend,
    categories,
    recentTransactions,
    shareLinks,
    aiKeys,
  } = insights;

  const now = insights.generatedAt;
  const memberDays = daysSince(user.createdAt, now);
  const usedCategories = categories.filter(c => c.transactionCount > 0);
  const avgPerActiveMonth = activity.activeMonths
    ? Math.round(
        trend.reduce((n, m) => n + m.transactions, 0) / activity.activeMonths,
      )
    : 0;

  // Share of each category within its own type (expense vs expense, …)
  const typeTotals = categories.reduce<Record<string, number>>((acc, c) => {
    acc[c.type] = (acc[c.type] ?? 0) + c.amount;
    return acc;
  }, {});

  return (
    <div className="page-fade flex w-full flex-col gap-5">
      <PageHeader
        title={
          <span className="capitalize">{user.name || 'User details'}</span>
        }
        description={
          memberDays === 0
            ? `Joined today · ${formatDate(user.createdAt)}`
            : `Member for ${memberDays} ${memberDays === 1 ? 'day' : 'days'} · joined ${formatDate(user.createdAt)}`
        }
        breadcrumbs={[
          { label: 'Dashboard', linkTo: PAGE_ROUTES.dashboard },
          { label: 'Users', linkTo: PAGE_ROUTES.user },
          { label: user.name || 'User' },
        ]}
        actions={
          <UserAdminActions
            userId={user.id}
            name={user.name}
            isActive={user.isActive}
            disabled={isSelf}
          />
        }
      />

      {/* ── Identity ── */}
      <Panel title="Account" bodyClassName="pt-3">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex min-w-0 items-center gap-4 lg:w-[320px] lg:shrink-0">
            <Avatar className="size-14">
              <AvatarFallback className="inter bg-gradient-to-br from-[#2ea878] to-[#1a7f5a] text-base font-semibold text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="inter text-ink truncate text-base font-semibold capitalize">
                {user.name}
              </p>
              <a
                href={`mailto:${user.email}`}
                className="inter text-ink-muted hover:text-brand-fg block truncate text-sm"
              >
                {user.email}
              </a>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <StatusPill active={user.isActive} />
                {user.role === UserRoleEnum.ADMIN && <AdminPill />}
                <SignInPill method={user.signInMethod} />
                {user.isOnboarded ? (
                  <Pill tone="brand">Setup complete</Pill>
                ) : (
                  <Pill tone="warning">Setup pending</Pill>
                )}
              </div>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
            <Fact
              icon={Clock}
              label="Last active"
              value={formatRelative(user.lastActiveAt, {
                now,
                empty: 'No activity yet',
              })}
              hint={
                user.lastActiveAt ? formatDate(user.lastActiveAt) : undefined
              }
            />
            <Fact
              icon={LogIn}
              label="Last sign-in"
              value={
                user.lastLoginAt
                  ? formatRelative(user.lastLoginAt, { now })
                  : 'Not recorded yet'
              }
              hint={
                user.loginCount
                  ? `${user.loginCount} ${user.loginCount === 1 ? 'sign-in' : 'sign-ins'} tracked${
                      user.lastLoginMethod
                        ? ` · last via ${user.lastLoginMethod === 'google' ? 'Google' : 'password'}`
                        : ''
                    }`
                  : 'Tracking started recently'
              }
            />
            <Fact
              icon={MonitorSmartphone}
              label="Signed-in sessions"
              value={`${activity.liveSessions} ${activity.liveSessions === 1 ? 'device' : 'devices'}`}
              hint="Not expired or signed out"
            />
            <Fact
              icon={CalendarPlus}
              label="Joined"
              value={formatDate(user.createdAt)}
              hint={formatRelative(user.createdAt, { now })}
            />
            <Fact
              icon={Phone}
              label="Contact"
              value={
                profile.contact ? (
                  <a
                    href={`tel:${profile.contact}`}
                    className="hover:text-brand-fg tabular-nums"
                  >
                    {profile.contact}
                  </a>
                ) : (
                  <span className="text-ink-faint">Not provided</span>
                )
              }
            />
            <Fact
              icon={VenusAndMars}
              label="Gender"
              value={
                profile.gender ? (
                  <span className="capitalize">{profile.gender}</span>
                ) : (
                  <span className="text-ink-faint">Not provided</span>
                )
              }
            />
          </div>
        </div>
      </Panel>

      {/* ── Usage KPIs ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
        <KpiTile
          label="Transactions"
          value={activity.transactions.toLocaleString()}
          icon={Receipt}
          color="#6366f1"
          hint={`${activity.loggedThisMonth} logged this month`}
        />
        <KpiTile
          label="Categories"
          value={categories.length}
          icon={FolderTree}
          color="#0ea5e9"
          hint={`${usedCategories.length} in use`}
        />
        <KpiTile
          label="Active months"
          value={`${activity.activeMonths} / ${activity.trendMonths}`}
          icon={Activity}
          color="#1a7f5a"
          hint={
            avgPerActiveMonth
              ? `≈ ${avgPerActiveMonth} transactions per active month`
              : 'No transactions in the last year'
          }
        />
        <KpiTile
          label="Share links"
          value={shareLinks.length}
          icon={Link2}
          color="#f59e0b"
          hint={
            shareLinks[0]
              ? `Last shared ${formatRelative(shareLinks[0].createdAt, { now })}`
              : 'Never shared a report'
          }
        />
      </div>

      {/* ── Money ── */}
      <Panel
        title="Cashflow"
        description={`All time: ${activity.countsByType.income} income · ${activity.countsByType.expense} expense · ${activity.countsByType.investment} investment entries`}
        bodyClassName="space-y-5"
      >
        {[
          { label: 'This month', totals: thisMonth },
          { label: 'All time', totals: lifetime },
        ].map(row => (
          <section key={row.label} aria-label={row.label}>
            <p className="inter text-ink-subtle mb-2.5 text-[11px] font-semibold tracking-wider uppercase">
              {row.label}
            </p>
            <StatWrapper
              stats={buildCashflowStats(row.totals, row.label)}
              className="sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4"
            />
          </section>
        ))}
      </Panel>

      {/* ── Trend + timeline ── */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel
          title="Money flow"
          description="Income, expense and investment by month, last 12 months."
          className="lg:col-span-2"
        >
          {activity.transactions ? (
            <UserActivityChart data={trend} />
          ) : (
            <EmptyState
              icon={Receipt}
              title="No transactions yet"
              description="This user hasn't logged anything."
            />
          )}
        </Panel>

        <Panel title="Timeline" bodyClassName="space-y-4">
          <Fact
            icon={CalendarDays}
            label="First transaction"
            value={formatDate(activity.firstTransactionDate, 'None yet')}
            hint={
              activity.firstLoggedAt
                ? `Logged ${formatRelative(activity.firstLoggedAt, { now })}`
                : undefined
            }
          />
          <Fact
            icon={CalendarDays}
            label="Latest transaction"
            value={formatDate(activity.lastTransactionDate, 'None yet')}
            hint={
              activity.lastLoggedAt
                ? `Logged ${formatRelative(activity.lastLoggedAt, { now })}`
                : undefined
            }
          />
          <Fact
            icon={KeyRound}
            label="AI provider keys"
            value={
              aiKeys.length ? (
                <span className="flex flex-wrap gap-1.5">
                  {aiKeys.map(k => (
                    <AiKeyPill key={k.provider} provider={k.provider} />
                  ))}
                </span>
              ) : (
                'Uses the system keys'
              )
            }
          />
          <div>
            <p className="inter text-ink-subtle mb-2 text-[11px] font-medium tracking-wide uppercase">
              Shared reports
            </p>
            {shareLinks.length ? (
              <ul className="space-y-1.5">
                {shareLinks.slice(0, 5).map(link => (
                  <li
                    key={link.id}
                    className="inter flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="text-ink truncate">
                      <span className="text-ink-subtle capitalize">
                        {link.type} ·{' '}
                      </span>
                      {describeShareLink(link)}
                    </span>
                    <span className="text-ink-subtle shrink-0">
                      {formatDate(link.createdAt)}
                    </span>
                  </li>
                ))}
                {shareLinks.length > 5 && (
                  <li className="inter text-ink-subtle text-xs">
                    +{shareLinks.length - 5} more
                  </li>
                )}
              </ul>
            ) : (
              <p className="inter text-ink-faint text-xs">None</p>
            )}
          </div>
        </Panel>
      </div>

      {/* ── Categories + recent ── */}
      <div className="grid gap-5 lg:grid-cols-5">
        <Panel
          title="Categories"
          description="Sorted by total amount. Bars show the share within each type."
          className="lg:col-span-3"
        >
          {categories.length ? (
            <ul className="divide-ink/[0.05] divide-y">
              {categories.map(c => {
                const share = typeTotals[c.type]
                  ? (c.amount / typeTotals[c.type]) * 100
                  : 0;
                return (
                  <li key={c.id} className="flex items-center gap-3 py-2.5">
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${c.color}1A` }}
                    >
                      <CategoryIcon
                        name={c.icon}
                        color={c.color}
                        className="size-4"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inter text-ink truncate text-sm font-medium capitalize">
                          {c.name}
                        </span>
                        <TypePill type={c.type} />
                      </div>
                      <div className="bg-ink/[0.05] mt-1.5 h-1 overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${share}%`,
                            backgroundColor: TYPE_COLOR[c.type] ?? c.color,
                          }}
                        />
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="manrope text-ink text-sm font-bold tabular-nums">
                        {formatCompactAmount(c.amount)}
                      </p>
                      <p className="inter text-ink-subtle text-[11px]">
                        {c.transactionCount}{' '}
                        {c.transactionCount === 1 ? 'entry' : 'entries'}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              icon={FolderTree}
              title="No categories"
              description="This user hasn't created any categories yet."
            />
          )}
        </Panel>

        <Panel
          title="Recent transactions"
          description="Latest 8 by date. Notes are kept private."
          className="lg:col-span-2"
        >
          {recentTransactions.length ? (
            <ul className="divide-ink/[0.05] divide-y">
              {recentTransactions.map(t => (
                <li key={t.id} className="flex items-center gap-3 py-2.5">
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${t.category.color}1A` }}
                  >
                    <CategoryIcon
                      name={t.category.icon}
                      color={t.category.color}
                      className="size-4"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="inter text-ink truncate text-sm font-medium capitalize">
                      {t.category.name}
                    </p>
                    <p className="inter text-ink-subtle text-xs">
                      {formatDate(t.date)}
                    </p>
                  </div>
                  <span
                    className="manrope shrink-0 text-sm font-bold tabular-nums"
                    style={{
                      color: t.category.type
                        ? TYPE_COLOR[t.category.type]
                        : undefined,
                    }}
                  >
                    {t.category.type === 'income' ? '+' : '−'}
                    {formatCompactAmount(t.amount)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Receipt}
              title="Nothing logged yet"
              description="Transactions will show up here."
            />
          )}
        </Panel>
      </div>
    </div>
  );
};

export default UserDetailsWrapper;
