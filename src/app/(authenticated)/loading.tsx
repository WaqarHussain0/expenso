import LogoLoader from '@/components/common/LogoLoader';

/**
 * Shown inside the authenticated shell while the next page's server data
 * loads, so the sidebar and top bar stay put during navigation.
 */
const Loading = () => (
  <div className="flex min-h-[60vh] w-full items-center justify-center">
    <LogoLoader />
  </div>
);

export default Loading;
