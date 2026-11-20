'use client';
import Link from 'next/link';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import {
  ChartPie,
  House,
  List,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sparkles,
  Tags,
  Users,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import { useCallback, useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '../ui/alert-dialog';
import { UserRoleEnum } from '@/types/user.type';
import { Avatar, AvatarFallback } from '../ui/avatar';
import Image from 'next/image';
import { SIDEBAR_COOKIE } from '@/app/constants/app.constant';

interface INavbar {
  className?: string;
  /** Initial state, read from a cookie on the server to avoid a layout flash */
  defaultCollapsed?: boolean;
}

/** Small label that appears to the right of an icon when the sidebar is collapsed. */
const CollapsedTooltip: React.FC<{ label: string; show: boolean }> = ({
  label,
  show,
}) =>
  show ? (
    <span className="inter pointer-events-none absolute top-1/2 left-full z-50 ml-3 -translate-x-1 -translate-y-1/2 rounded-md bg-[#0d1117] px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-all duration-200 group-hover/nav:translate-x-0 group-hover/nav:opacity-100 group-focus-visible/nav:translate-x-0 group-focus-visible/nav:opacity-100">
      {label}
    </span>
  ) : null;

const Navbar: React.FC<INavbar> = ({ className = '', defaultCollapsed }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(!!defaultCollapsed);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev;
      // Persist for a year so the server can render the right width next time
      document.cookie = `${SIDEBAR_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
      return next;
    });
  }, []);

  // Ctrl/⌘ + B toggles the sidebar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleCollapsed();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleCollapsed]);

  const { data: session } = useSession();
  const user = session?.user;

  const isAdminUser = user?.role === UserRoleEnum.ADMIN || false;

  const navItems = [
    {
      title: 'Dashboard',
      linkTo: PAGE_ROUTES.dashboard,
      icon: House,
      show: true,
    },

    {
      title: 'Stats',
      linkTo: PAGE_ROUTES.stats,
      icon: ChartPie,
      show: true,
    },
    {
      title: 'Category',
      icon: Tags,
      linkTo: PAGE_ROUTES.category,
      show: true,
    },
    {
      title: 'Transaction',
      icon: List,
      linkTo: PAGE_ROUTES.transaction,
      show: true,
    },

    {
      title: 'Assistant',
      icon: Sparkles,
      linkTo: PAGE_ROUTES.assistant,
      show: true,
    },

    {
      title: 'Users',
      linkTo: PAGE_ROUTES.user,
      icon: Users,
      show: isAdminUser,
    },

    {
      title: 'Profile',
      linkTo: PAGE_ROUTES.profile,
      icon: Settings,
      show: true,
    },
  ];

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    router.push(PAGE_ROUTES.login);
  };

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const visibleNavItems = navItems.filter(item => item.show);

  const isActiveRoute = (linkTo: string) =>
    pathname === linkTo || pathname.startsWith(`${linkTo}/`);

  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        data-collapsed={collapsed}
        className={`relative hidden shrink-0 bg-[#0d1117] text-white transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex ${
          collapsed ? 'w-[76px]' : 'w-64'
        } ${className} flex-col`}
      >
        {/* Brand textures (clipped separately so tooltips can overflow the aside) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="fr-grid-bg absolute inset-0 opacity-70" />
          <div
            className="absolute -top-24 -left-20 h-[320px] w-[360px]"
            style={{
              background:
                'radial-gradient(ellipse, rgba(46,168,120,.16) 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="relative z-40 flex h-full flex-col">
          {/* Logo + toggle */}
          <div
            className={`flex shrink-0 items-center ${
              collapsed
                ? 'h-auto flex-col gap-3 px-3 pt-4 pb-1'
                : 'h-16 justify-between pr-3 pl-6'
            }`}
          >
            <Link
              href={PAGE_ROUTES.dashboard}
              aria-label="Expenso home"
              className="block"
            >
              {collapsed ? (
                <div className="relative size-9">
                  <Image
                    src="/icon.png"
                    alt="Expenso"
                    fill
                    sizes="36px"
                    className="object-contain"
                    priority
                  />
                </div>
              ) : (
                <div className="relative h-[32px] w-[100px]">
                  <Image
                    src={'/light-logo.png'}
                    alt={`Expenso`}
                    fill
                    sizes="100px"
                    className="object-contain object-left"
                    priority
                    fetchPriority="high"
                  />
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
              title={`${collapsed ? 'Expand' : 'Collapse'} sidebar (Ctrl+B)`}
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-white/45 transition-colors duration-300 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-[#34d399]/40 focus-visible:outline-none"
            >
              <ToggleIcon className="size-[18px]" />
            </button>
          </div>

          {/* Nav */}
          <nav
            className={`flex-1 pt-4 ${collapsed ? 'px-3' : 'overflow-y-auto px-3'}`}
          >
            <p
              className={`mb-2 text-[10px] font-semibold tracking-[0.18em] text-white/30 uppercase ${
                collapsed ? 'text-center' : 'px-3'
              }`}
            >
              {collapsed ? '•••' : 'Menu'}
            </p>
            <ul className="space-y-1">
              {visibleNavItems.map(item => {
                const isActive = isActiveRoute(item.linkTo);
                const Icon = item.icon;
                return (
                  <li key={item.title}>
                    <Link
                      href={item.linkTo}
                      aria-label={collapsed ? item.title : undefined}
                      aria-current={isActive ? 'page' : undefined}
                      className={`group/nav relative flex w-full items-center rounded-lg py-2.5 text-sm transition-all duration-300 ${
                        collapsed ? 'justify-center px-0' : 'gap-3 px-3'
                      } ${
                        isActive
                          ? 'bg-white/[0.07] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]'
                          : 'text-white/55 hover:bg-white/[0.04] hover:text-white'
                      }`}
                    >
                      {/* Active accent */}
                      <span
                        className={`absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#34d399] shadow-[0_0_10px_#34d399] transition-opacity duration-300 ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                      <Icon
                        className={`size-[18px] shrink-0 transition-colors duration-300 ${
                          isActive
                            ? 'text-[#34d399]'
                            : 'text-white/45 group-hover/nav:text-white/80'
                        }`}
                        strokeWidth={isActive ? 2.2 : 1.8}
                      />
                      {!collapsed && (
                        <span className="inter truncate font-medium">
                          {item.title}
                        </span>
                      )}
                      <CollapsedTooltip label={item.title} show={collapsed} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User card */}
          <div className="shrink-0 p-3">
            {collapsed ? (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] py-2.5">
                <Link
                  href={PAGE_ROUTES.profile}
                  aria-label={user?.name ? `${user.name} — profile` : 'Profile'}
                  className="group/nav relative"
                >
                  <Avatar className="size-9">
                    <AvatarFallback className="inter bg-gradient-to-br from-[#2ea878] to-[#1a7f5a] text-xs font-semibold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <CollapsedTooltip label={user?.name ?? 'Profile'} show />
                </Link>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  aria-label="Logout"
                  className="group/nav relative flex size-8 cursor-pointer items-center justify-center rounded-lg text-white/45 transition-colors duration-300 hover:bg-white/[0.06] hover:text-[#f87171]"
                >
                  <LogOut className="size-4" />
                  <CollapsedTooltip label="Logout" show />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.04] p-2.5">
                <Avatar className="size-9">
                  <AvatarFallback className="inter bg-gradient-to-br from-[#2ea878] to-[#1a7f5a] text-xs font-semibold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="inter truncate text-sm font-medium text-white capitalize">
                    {user?.name}
                  </p>
                  <p className="inter truncate text-[11px] text-white/40">
                    {user?.email}
                  </p>
                </div>

                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  title="Logout"
                  aria-label="Logout"
                  className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-white/45 transition-colors duration-300 hover:bg-white/[0.06] hover:text-[#f87171]"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-white/[0.06] bg-[#0d1117]/95 px-1 pt-2 pb-[calc(--spacing(2)+env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        {visibleNavItems.map(item => {
          const isActive = isActiveRoute(item.linkTo);
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.linkTo}
              aria-label={item.title}
              className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-md px-1 py-1.5 transition-colors ${
                isActive ? 'text-[#34d399]' : 'text-white/45'
              }`}
            >
              <Icon className="size-6" strokeWidth={isActive ? 2.3 : 1.8} />
              <span
                className={`h-1 w-1 rounded-full bg-[#34d399] transition-opacity ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </Link>
          );
        })}
      </nav>

      {/* Logout Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ll need to sign in again to see your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!bg-destructive text-white"
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? 'Logging out...' : 'Logout'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Navbar;
