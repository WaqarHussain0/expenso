import Row from '@/components/common/Row';
import Link from 'next/link';

const Header = () => {
  return (
    <section className="relative flex w-full flex-col items-center justify-center gap-4 bg-[#F5F5DC] py-16 text-center">
      <Row className="w-full flex-col">
        <span className="rounded-full px-4 py-2 text-[12px] font-semibold tracking-wider text-[#D47E30] uppercase md:text-[14px]">
          Free Personal Finance Tracker
        </span>

        <h1 className="max-w-210 text-[28px] tracking-tighter md:text-[36px]">
          Know exactly where
          <br />
          <em className="text-[#D47E30] italic">every rupee goes</em>
        </h1>

        <p className="mt-3max-w-130 text-[14px] font-extralight md:text-[16px]">
          Expenso turns your daily transactions into clear insights — so you can
          spend smarter, save more, and stress less.
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#signup"
            className="inline-block rounded-[8px]  px-4 py-2 text-[14px] font-medium text-[#F5F5DC] transition-all duration-200 bg-[#6D3B07]/90 hover:bg-[#6D3B07] active:scale-95 md:px-5 md:py-4"
          >
            Start for free →
          </Link>

          <Link href="#how" className="text-[14px] font-light">
            See how it works →
          </Link>
        </div>

        <p className="mt-3 text-[14px] md:text-[16px]">
          No credit card required &nbsp;·&nbsp; Set up in 2 minutes
        </p>
      </Row>

      {/* <!-- Dashboard Mockup --> */}

      {/* <Row className="w-full md:w-[60%] bg-[#f0efe9] p-2 md:p-3 gap-4 rounded-md">
        <div className="flex gap-1">
          <div className="mockup-dot size-[10px] rounded-full bg-[#ff5f57]"></div>
          <div className="mockup-dot size-[10px] rounded-full bg-[#febc2e]"></div>
          <div className="mockup-dot size-[10px] rounded-full bg-[#28c840]"></div>
        </div>
        <div className="flex flex-1 justify-center rounded-md bg-white px-4 py-1">
          app.expenso.io/dashboard
        </div>
      </Row> */}
    </section>
  );
};

export default Header;
