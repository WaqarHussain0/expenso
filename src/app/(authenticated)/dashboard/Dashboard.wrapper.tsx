'use client';

import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import {
  LazyCategoryDialog,
  LazyTransactionDialog,
} from '@/components/feature/lazy-dialogs';
import { Card } from '@/components/ui/card';
import {
  ArrowRight,
  ChevronRight,
  List,
  ListPlus,
  Sparkles,
  Tags,
  type LucideIcon,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ReactNode,
  Suspense,
  use,
  useCallback,
  useState,
  useSyncExternalStore,
} from 'react';

interface IDashboardWrapperProps {
  /** Streamed free-cash figure + allocation bar for the hero card */
  freeCash: ReactNode;
  /** Streamed stat cards */
  stats: ReactNode;
  /** Streamed recent transactions card */
  recent: ReactNode;
  /** Resolved with use() so the shell never waits on it */
  isFirstLogin: Promise<boolean>;
}

interface IQuickAction {
  title: string;
  icon: LucideIcon;
  tint: string;
  onClick: () => void;
  description: string;
}

const QuickActionButton: React.FC<{ action: IQuickAction }> = ({ action }) => {
  const Icon = action.icon;

  return (
    <button
      type="button"
      onClick={action.onClick}
      className="group hover:bg-canvas flex w-full cursor-pointer items-center gap-3.5 rounded-xl p-3 text-left transition-colors duration-300"
    >
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
        style={{
          background: `${action.tint}14`,
          color: action.tint,
        }}
      >
        <Icon className="size-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="inter text-ink block text-sm font-medium">
          {action.title}
        </span>
        <span className="inter text-ink-subtle block text-xs leading-relaxed">
          {action.description}
        </span>
      </span>
      <ChevronRight className="text-ink-faint group-hover:text-brand-fg size-4 shrink-0 transition-all duration-300 group-hover:translate-x-0.5" />
    </button>
  );
};

/** Shown only until the user has finished first-time setup. */
const SetupWorkspaceAction: React.FC<{
  isFirstLogin: Promise<boolean>;
  onClick: () => void;
}> = ({ isFirstLogin, onClick }) => {
  if (!use(isFirstLogin)) return null;

  return (
    <QuickActionButton
      action={{
        title: 'Setup Workspace',
        icon: ListPlus,
        tint: '#eab308',
        onClick,
        description: 'Set targets for your income, expenses, and investments.',
      }}
    />
  );
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const noopSubscribe = () => () => {};

/**
 * Client shell for the dashboard: greeting, quick actions and dialogs. The
 * data-driven parts arrive as streamed slots.
 */
const DashboardWrapper: React.FC<IDashboardWrapperProps> = ({
  freeCash,
  stats,
  recent,
  isFirstLogin,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(' ')[0] ?? '';

  // Server renders a neutral greeting; the client re-renders with its local time
  const greeting = useSyncExternalStore(
    noopSubscribe,
    getGreeting,
    () => 'Welcome back',
  );

  const [showCategoryDialog, setShowCategoryDialog] = useState<boolean>(false);
  const handleCloseCategoryDialog = useCallback(
    () => setShowCategoryDialog(prev => !prev),
    [],
  );

  const [showTransactionDialog, setShowTransactionDialog] =
    useState<boolean>(false);
  const handleCloseTransactionDialog = useCallback(
    () => setShowTransactionDialog(prev => !prev),
    [],
  );


  const quickActions: IQuickAction[] = [
    {
      title: 'Record Transaction',
      icon: List,
      tint: '#1a7f5a',
      onClick: handleCloseTransactionDialog,
      description: 'Log a new entry and keep your balance accurate.',
    },
    {
      title: 'New Category',
      icon: Tags,
      tint: '#6366f1',
      onClick: handleCloseCategoryDialog,
      description: 'Create labels to organise and filter your money.',
    },
    {
      title: 'Ask Assistant',
      icon: Sparkles,
      tint: '#d97706',
      onClick: () => router.push(PAGE_ROUTES.assistant),
      description: 'Get instant answers about your spending.',
    },
  ];

  return (
    <div className="page-fade flex w-full flex-col gap-4 md:gap-5">
      <div className="grid w-full grid-cols-1 gap-4 md:gap-5 xl:grid-cols-3">
        {/* ───────── Hero: free cash ───────── */}
        <section className="bg-panel relative overflow-hidden rounded-2xl p-6 text-white shadow-[0_20px_40px_-20px_rgba(13,17,23,0.5)] md:p-8 xl:col-span-2">
          <div className="fr-grid-bg pointer-events-none absolute inset-0" />
          <div
            className="pointer-events-none absolute -top-24 -right-16 h-[320px] w-[420px]"
            style={{
              background:
                'radial-gradient(ellipse, rgba(46,168,120,.22) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="inter text-sm text-white/55">
                  {greeting}
                  {firstName ? `, ${firstName}` : ''}
                </p>
                <h2
                  className="mt-1 text-2xl font-bold text-[#f4f4f4] md:text-[28px]"
                  style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
                >
                  Your{' '}
                  <em
                    className="text-gradient-green"
                    style={{ fontStyle: 'italic' }}
                  >
                    free cash
                  </em>
                </h2>
              </div>

              <Link
                href={PAGE_ROUTES.stats}
                className="inter group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/70 transition-all duration-300 hover:border-[#34d399]/40 hover:text-white"
              >
                View stats
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {freeCash}
          </div>
        </section>

        {/* ───────── Quick actions ───────── */}
        <Card className="flex gap-0 p-2">
          <div className="px-3 pt-3 pb-2">
            <p className="inter text-ink text-sm font-semibold">
              Quick actions
            </p>
            <p className="inter text-ink-subtle text-xs">
              Jump straight into the common stuff
            </p>
          </div>

          <div className="flex flex-1 flex-col justify-around">
            <Suspense fallback={null}>
              <SetupWorkspaceAction
                isFirstLogin={isFirstLogin}
                onClick={() => router.push(PAGE_ROUTES.preferences)}
              />
            </Suspense>

            {quickActions.map(action => (
              <QuickActionButton key={action.title} action={action} />
            ))}
          </div>
        </Card>
      </div>

      {/* ───────── Stats ───────── */}
      {stats}

      {recent}

      {showCategoryDialog && (
        <LazyCategoryDialog onClose={handleCloseCategoryDialog} open />
      )}

      {showTransactionDialog && (
        <LazyTransactionDialog onClose={handleCloseTransactionDialog} open />
      )}
    </div>
  );
};

export default DashboardWrapper;
