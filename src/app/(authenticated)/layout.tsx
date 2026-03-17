import Navbar from '@/components/common/Navbar';
import Row from '@/components/common/Row';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Row className="h-screen w-full">
      <Navbar className="bgPrimary h-full w-64" />

      <Row className="h-full flex-1 flex-col items-start overflow-y-auto bg-[#F5F5DC] p-4 md:p-6">
        {children}
      </Row>
    </Row>
  );
};

export default Layout;
