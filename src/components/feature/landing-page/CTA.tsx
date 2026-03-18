import Row from '@/components/common/Row';
import Link from 'next/link';

const CTA = () => {
  return (
    <section
      id="signup"
      className="flex w-full items-center justify-center p-4"
    >
      <Row className="w-full flex-col items-start justify-between rounded-2xl bg-[#D47E30] px-4 py-3 md:w-[90%] md:flex-row md:items-center md:px-8 md:py-6 lg:w-[70%]">
        <Row className="flex-col items-start">
          <h2 className="cta-title text-[28px] text-white md:text-[36px]">
            Start tracking today.
            <br />
            <em className="text-[#6D3B07]">Future you will thank you.</em>
          </h2>

          <p className="cta-sub mt-3 text-[14px] text-slate-300 md:text-[16px]">
            Join Expenso and finally understand where your money goes every
            month.
          </p>
        </Row>

        <Row className="mt-4 flex-col items-start gap-2 md:mt-0">
          <Link
            href="#signup"
            className="inline-block rounded-[8px] px-4 py-3 text-[14px] font-medium text-white transition-all duration-200 bg-[#6D3B07]/90 hover:bg-[#6D3B07] active:scale-95 lg:px-8"
          >
            Create free account →
          </Link>

          <span className="text-[14px] text-slate-300 md:text-[16px]">
            No credit card · Ready in 2 min
          </span>
        </Row>
      </Row>
    </section>
  );
};

export default CTA;
