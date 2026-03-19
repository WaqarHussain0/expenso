import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import Row from '@/components/common/Row';
import Link from 'next/link';

const CTA = () => {
  return (
    <section
      id="signup"
      className="flex w-full items-center justify-center p-4"
    >
      <Row className="w-full flex-col items-start justify-between rounded-2xl bg-[#6D3B07] px-4 py-3 md:w-[90%] md:flex-row md:items-center md:px-8 md:py-6 lg:w-[70%]">
        <Row className="flex-col items-start">
          <h2 className="cta-title text-[28px] text-[#F5F5DC] md:text-[36px]">
            Start tracking today.
            <br />
            <em className="text-green-500">Future you will thank you.</em>
          </h2>

          <p className="cta-sub mt-3 text-[14px] text-[#F5F5DC] md:text-[16px]">
            Join Expenso and finally understand where your money goes every
            month.
          </p>
        </Row>

        <Row className="mt-4 flex-col items-start gap-2 md:mt-0">
          <Link
            href={PAGE_ROUTES.register}
            className="inline-block rounded-[8px] bg-[#D47E30]/90 px-4 py-3 text-[14px] font-medium text-white transition-all duration-200 hover:bg-[#D47E30] active:scale-95 lg:px-8"
          >
            Create free account →
          </Link>

          <span className="text-[14px] text-[#F5F5DC] md:text-[16px]">
            No credit card · Ready in 2 min
          </span>
        </Row>
      </Row>
    </section>
  );
};

export default CTA;
