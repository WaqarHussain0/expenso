import Nav from '@/components/feature/landing-page/Nav';
import Header from '@/components/feature/landing-page/Header';
import Feature from '@/components/feature/landing-page/Features';
import HowItWork from '@/components/feature/landing-page/HowItWork';
import Stats from '@/components/feature/landing-page/Stats';
import CTA from '@/components/feature/landing-page/CTA';
import Footer from '@/components/feature/landing-page/Footer';
import Row from '@/components/common/Row';
import Pricing from '@/components/feature/landing-page/Pricing';
import ShareableStats from '@/components/feature/landing-page/ShareableStats';
import { getServerSideSession } from '@/lib/next-auth.util';
import FeatureRequestSection from '@/components/feature/landing-page/FeatureRequest';
import Testimonials from '@/components/feature/landing-page/Testimonials';

const Page = async () => {
  const session = await getServerSideSession();
  const user = session?.user;

  return (
    <Row className="no-scrollbar w-full flex-col overflow-x-hidden overflow-y-auto">
      <Nav className="" />
      <Header className="" user={user} />
      <Stats className="" />

      <Feature className="" />
      <ShareableStats className="" />

      <HowItWork className="" />
      <FeatureRequestSection />

      <Pricing className="my-3" />

      <Testimonials />
      <CTA className="" />
      <Footer className="" />
    </Row>
  );
};

export default Page;
