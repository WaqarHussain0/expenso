import 'react-loading-skeleton/dist/skeleton.css';
import Navbar from '@/components/common/Navbar';
import Row from '@/components/common/Row';
import TopBar from '@/components/common/TopBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Row className="h-screen w-full">
      <Navbar className="h-full w-64" />

      <Row className="no-scrollbar h-full flex-1 flex-col overflow-y-auto bg-white">
        <TopBar className="h-[50px] flex-shrink-0" />

        <div className="w-full flex-1 overflow-y-auto bg-slate-50 px-3 pt-3">
          {children}
        </div>
      </Row>
    </Row>
  );
};

export default Layout;
