import Nav from '@/components/feature/landing-page/Nav';
import Header from '@/components/feature/landing-page/Header';
import Feature from '@/components/feature/landing-page/Features';
import HowItWork from '@/components/feature/landing-page/HowItWork';
import Stats from '@/components/feature/landing-page/Stats';
import CTA from '@/components/feature/landing-page/CTA';
import Footer from '@/components/feature/landing-page/Footer';
import Row from '@/components/common/Row';

const Page = async () => {
  return (
    <Row className="no-scrollbar w-full flex-col">
      <Nav />
      <Header />
      <Feature />
      <HowItWork />
      <Stats />
      <CTA />
      <Footer />
    </Row>
  );
};

export default Page;
