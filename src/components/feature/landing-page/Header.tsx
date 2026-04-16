import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import Row from '@/components/common/Row';
import { IUser } from '@/types/user.type';
import Link from 'next/link';

interface IHeaderProps {
  className?: string;
  user?: IUser;
}

const Header: React.FC<IHeaderProps> = ({ className = '', user }) => {
  return (
    <section
      className={`relative flex w-full flex-col items-center justify-center gap-4 bg-[#0d1117] py-16 text-center md:py-24 ${className}`}
    >
      {/* Grid texture */}
      <div className="fr-grid-bg pointer-events-none absolute inset-0" />

      {/* Glow orb */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[400px] w-[600px] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(ellipse, rgba(74,222,128,.07) 0%, transparent 70%)',
        }}
      />

      <Row className="w-full flex-col gap-3 px-4 md:flex-row md:gap-0 md:px-8">
        <Row className="w-full flex-col">
          {/* Label */}
          <div className="mb-5 inline-flex items-center gap-2">
            <span
              className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-green-400"
              style={{ boxShadow: '0 0 8px #4ade80' }}
            />
            <span className="text-xs font-semibold tracking-widest text-green-400 uppercase">
              Free Personal Finance Tracker
            </span>
          </div>

          {/* Heading */}
          <h2
            className="mb-5 text-[clamp(32px,5vw,52px)] leading-[1.1] font-bold text-[#f4f4f4]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Know exactly where
            <br />
            <em className="text-[#2ea878]" style={{ fontStyle: 'italic' }}>
              every rupee goes
            </em>
          </h2>

          {/* Subtext */}
          <p className="inter max-w-[560px] text-[14px] text-[#888]">
            Expenso turns your daily transactions into clear insights — so you
            can spend smarter, save more, and stress less.
          </p>

          <div className="mt-3 flex flex-col items-center justify-center gap-2">
            <Link
              href={user ? PAGE_ROUTES.dashboard : PAGE_ROUTES.register}
              className="inline-flex w-fit items-center gap-[8px] rounded-full bg-[#1a7f5a] px-8 py-2 text-[15px] font-medium text-[#f4f4f4] no-underline shadow-[0_4px_10px_rgba(13,17,23,0.25)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_10px_rgba(13,17,23,0.3)] md:px-12 md:py-3"
            >
              {user ? 'My Portfolio' : 'Start for free'} →
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
