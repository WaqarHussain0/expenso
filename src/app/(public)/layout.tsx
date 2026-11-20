import RTKProvider from '@/components/providers/RTK.provider';

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <RTKProvider>{children}</RTKProvider>
);

export default PublicLayout;
