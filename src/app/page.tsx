import type { Metadata } from 'next';
import { getServerSideSession } from '@/lib/next-auth.util';
import MarketingNav from '@/components/feature/marketing/MarketingNav';
import HashScroll from '@/components/feature/marketing/HashScroll';
import MarketingFooter from '@/components/feature/marketing/MarketingFooter';
import Hero from '@/components/feature/marketing/landing/Hero';
import FeatureBento from '@/components/feature/marketing/landing/FeatureBento';
import AssistantSpotlight from '@/components/feature/marketing/landing/AssistantSpotlight';
import HowItWorks from '@/components/feature/marketing/landing/HowItWorks';
import Security from '@/components/feature/marketing/landing/Security';
import Pricing from '@/components/feature/marketing/landing/Pricing';
import Faq from '@/components/feature/marketing/landing/Faq';
import FinalCta from '@/components/feature/marketing/landing/FinalCta';

export const metadata: Metadata = {
  title: 'Expenso — Know exactly where every rupee goes',
  description:
    'A free, private tracker for income, expenses, and investments. Log in seconds, see your month at a glance, share reports, and ask an AI assistant about your money.',
  alternates: { canonical: '/' },
};

const Page = async () => {
  const session = await getServerSideSession();
  const signedIn = !!session?.user;

  return (
    <div className="bg-surface w-full overflow-x-hidden">
      <MarketingNav signedIn={signedIn} />
      <HashScroll />
      <main>
        <Hero signedIn={signedIn} />
        <FeatureBento />
        <AssistantSpotlight />
        <HowItWorks />
        <Security />
        <Pricing signedIn={signedIn} />
        <Faq />
        <FinalCta signedIn={signedIn} />
      </main>
      <MarketingFooter />
    </div>
  );
};

export default Page;
