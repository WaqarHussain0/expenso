import 'react-loading-skeleton/dist/skeleton.css';
import Navbar from '@/components/common/Navbar';
import Row from '@/components/common/Row';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Row className="h-screen w-full">
      <Navbar className="h-full w-64" />

      <Row className="h-full flex-1 flex-col items-start overflow-y-auto bg-[#F5F5DC] px-4 py-12 md:py-6">
        {children}
      </Row>
    </Row>
  );
};

export default Layout;
