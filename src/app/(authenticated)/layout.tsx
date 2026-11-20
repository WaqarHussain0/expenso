import 'react-loading-skeleton/dist/skeleton.css';
import Navbar from '@/components/common/Navbar';
import TopBar from '@/components/common/TopBar';
// Redux (RTK Query) is only needed inside the app and on /share — keeping the
// provider here keeps it out of the landing and auth page bundles.
import RTKProvider from '@/components/providers/RTK.provider';
import { cookies } from 'next/headers';
import { SIDEBAR_COOKIE } from '@/app/constants/app.constant';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  // Read on the server so the sidebar renders at the right width on first paint
  const sidebarCollapsed =
    (await cookies()).get(SIDEBAR_COOKIE)?.value === 'true';

  return (
    <div className="flex h-screen w-full bg-[#f6f7f5]">
      <Navbar className="h-full" defaultCollapsed={sidebarCollapsed} />

      <main className="no-scrollbar relative flex h-full min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
        {/* soft brand glow behind content */}
        <div
          className="pointer-events-none absolute -top-48 right-0 h-[420px] w-[640px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(46,168,120,.08) 0%, transparent 70%)',
          }}
        />

        <TopBar />

        <div className="relative w-full flex-1 px-3 pt-4 pb-24 md:px-6 md:pt-6 lg:pb-8">
          <RTKProvider>{children}</RTKProvider>
        </div>
      </main>
    </div>
  );
};

export default Layout;
