/* eslint-disable react/no-unescaped-entities */
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import Row from '@/components/common/Row';
import Reveal from '@/components/common/Reveal';
import AuroraGlow from '@/components/feature/landing-page/AuroraGlow';
import { IUser } from '@/types/user.type';
import Link from 'next/link';

interface IHeaderProps {
  className?: string;
  user?: IUser;
}

const Header: React.FC<IHeaderProps> = ({ className = '', user }) => {
  return (
    <section
      className={`relative flex w-full flex-col items-center justify-center gap-4 bg-[#0d1117] pb-16 text-center md:py-24 ${className}`}
    >
      {/* Grid texture */}
      <div className="fr-grid-bg pointer-events-none absolute inset-0" />

      {/* Glow orbs */}
      <AuroraGlow />

      <Row className="relative z-10 w-full flex-col gap-3 px-4 md:flex-row md:gap-0 md:px-8">
        <Row className="w-full flex-col">
          {/* Label */}
          <Reveal className="mb-5 inline-flex items-center gap-2">
            <span
              className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-green-400"
              style={{ boxShadow: '0 0 8px #4ade80' }}
            />
            <span className="text-xs font-semibold tracking-widest text-green-400 uppercase">
              Free Personal Finance Tracker
            </span>
          </Reveal>

          {/* Heading */}
          <Reveal delay={80}>
            <h2
              className="mb-5 text-[clamp(32px,5vw,52px)] leading-[1.1] font-bold text-[#f4f4f4]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Know exactly where
              <br />
              <em
                className="text-gradient-green"
                style={{ fontStyle: 'italic' }}
              >
                every rupee goes
              </em>
            </h2>
          </Reveal>

          {/* Subtext */}
          <Reveal delay={160} className="flex w-full justify-center">
            <p className="inter max-w-[560px] text-[14px] text-[#888]">
              I built Expenso because I kept wondering where my salary went by
              the 20th of every month. Now I don't have to wonder. You won't
              either.
            </p>
          </Reveal>

          <Reveal
            delay={240}
            className="mt-3 flex flex-col items-center justify-center gap-2"
          >
            <Link
              href={user ? PAGE_ROUTES.dashboard : PAGE_ROUTES.register}
              className="inline-flex w-fit items-center gap-[8px] rounded-full bg-[#1a7f5a] px-8 py-2 text-[15px] font-medium text-[#f4f4f4] no-underline shadow-[0_4px_10px_rgba(13,17,23,0.25)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_10px_rgba(13,17,23,0.3)] md:px-12 md:py-3"
            >
              {user ? 'My Portfolio' : 'Start for free'} →
            </Link>
          </Reveal>
        </Row>
      </Row>
    </section>
  );
};

export default Header;
