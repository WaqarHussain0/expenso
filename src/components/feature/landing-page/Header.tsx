import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import Row from '@/components/common/Row';
import Link from 'next/link';

const Header = () => {
  return (
    <section className="relative flex w-full flex-col items-center justify-center gap-4 py-4 text-center md:py-10">
      <Row className="w-full flex-col gap-3 px-4 md:flex-row md:gap-0 md:px-8">
        <Row className="w-full flex-col">
          <span className="rounded-full px-4 py-2 text-[12px] font-medium tracking-wider text-green-500 uppercase md:text-[14px]">
            Free Personal Finance Tracker
          </span>

          <h1 className="max-w-210 text-[28px] tracking-tighter md:text-[36px]">
            Know exactly where
            <br />
            <em className="text-[#D47E30] italic">every rupee goes</em>
          </h1>

          <p className="mt-3max-w-130 text-[14px] font-extralight md:text-[16px]">
            Expenso turns your daily transactions into clear insights — so you
            can spend smarter, save more, and stress less.
          </p>

          <div className="mt-3 flex flex-col items-center justify-center gap-2">
            <Link
              href={PAGE_ROUTES.register}
              className="inline-flex w-fit items-center gap-[8px] rounded-full bg-[#0d1117] px-12 py-3 text-[15px] font-medium text-white no-underline shadow-[0_4px_20px_rgba(13,17,23,0.25)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(13,17,23,0.3)]"
            >
              Start for free →
            </Link>

            <Link href="#how" className="text-[14px] font-light">
              See how it works →
            </Link>
          </div>
        </Row>
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
