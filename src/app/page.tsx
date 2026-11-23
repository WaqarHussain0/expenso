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
import UseCases from '@/components/feature/marketing/landing/UseCases';
import Faq, { FAQS } from '@/components/feature/marketing/landing/Faq';
import FinalCta from '@/components/feature/marketing/landing/FinalCta';
import JsonLd from '@/components/common/JsonLd';
import {
  CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  absoluteUrl,
} from '@/app/constants/site.constant';

export const metadata: Metadata = {
  // Keyword-first title for the home page (skips the "| Expenso" template)
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
};

// schema.org graph: who publishes the site, what the app is, and the FAQ.
// Only facts that are true on the page — no ratings or reviews.
const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: absoluteUrl('/android-chrome-512x512.png'),
      email: CONTACT_EMAIL,
      founder: { '@type': 'Person', name: 'Waqar Hussain' },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: 'en',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'WebApplication',
      '@id': `${SITE_URL}/#app`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      applicationCategory: 'FinanceApplication',
      applicationSubCategory: 'Expense tracker',
      operatingSystem: 'Any (web browser)',
      browserRequirements: 'Requires JavaScript and a modern browser',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: [
        'Income, expense and investment tracking by category',
        'Monthly dashboard with free cash',
        'Monthly, yearly and custom-range spending charts',
        'Shareable financial reports',
        'Read-only AI finance assistant',
        'Light and dark mode',
      ],
      screenshot: absoluteUrl('/opengraph-image'),
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: FAQS.map(({ q, text }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text },
      })),
    },
  ],
};

const Page = async () => {
  const session = await getServerSideSession();
  const signedIn = !!session?.user;

  return (
    <div className="bg-surface w-full overflow-x-hidden">
      <MarketingNav signedIn={signedIn} />
      <JsonLd data={STRUCTURED_DATA} />
      <HashScroll />
      <main>
        <Hero signedIn={signedIn} />
        <FeatureBento />
        <AssistantSpotlight />
        <HowItWorks />
        <UseCases />
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
