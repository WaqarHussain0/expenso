import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import Link from 'next/link';

interface ICTAProps {
  className?: string;
}

const CTA: React.FC<ICTAProps> = ({ className = '' }) => {
  return (
    <section
      id="signup"
      className={`relative flex w-full flex-col items-center justify-center bg-[#0d1117] px-4 py-12 md:px-8 ${className} `}
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

      {/* Label */}
      <div className="mb-5 inline-flex items-center gap-2">
        <span
          className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-green-400"
          style={{ boxShadow: '0 0 8px #4ade80' }}
        />
        <span className="text-xs font-semibold tracking-widest text-green-400 uppercase">
          Free forever · No card needed
        </span>
      </div>

      {/* Heading */}
      <h2
        className="mb-5 w-full text-center text-[28px] leading-[1.1] font-bold text-white md:text-[36px]"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Start tracking today.
        <br />
        <em className="text-[#2ea878]" style={{ fontStyle: 'italic' }}>
          Future you will thank you.
        </em>
      </h2>

      {/* Subtext */}
      <p className="inter mb-2 max-w-[560px] text-center text-[14px] text-[#888]">
        Join Expenso and finally understand where your money goes every month.
        Setup takes 2 minutes.
      </p>

      <Link
        href={PAGE_ROUTES.register}
        className="my-2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-medium text-[var(--ink)] no-underline shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] active:scale-95"
      >
        Create free account →
      </Link>

      <p className="text-sm text-[#FFFFFF4D]">
        No credit card · Ready in 2 min
      </p>
    </section>
  );
};

export default CTA;
