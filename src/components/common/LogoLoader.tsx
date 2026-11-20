import Image from 'next/image';

interface ILogoLoaderProps {
  label?: string;
  className?: string;
}

/**
 * Brand loader: the Expenso mark in a white disc, wrapped by a soft halo and
 * a track ring with a spinning arc. Pure CSS animation — no client JS.
 */
const LogoLoader: React.FC<ILogoLoaderProps> = ({
  label = 'Loading',
  className = '',
}) => (
  <div
    role="status"
    aria-live="polite"
    className={`flex flex-col items-center justify-center gap-5 ${className}`}
  >
    <div className="relative size-32">
      {/* soft halo */}
      <div className="logo-loader-halo absolute inset-0 rounded-full bg-[#1a7f5a]/[0.07]" />

      {/* track + spinning arc */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-3 size-[calc(100%-1.5rem)]"
        aria-hidden
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#1a7f5a"
          strokeOpacity="0.12"
          strokeWidth="3"
        />
        <circle
          className="logo-loader-arc"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#logo-loader-gradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="70 213"
        />
        <defs>
          <linearGradient id="logo-loader-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#1a7f5a" />
          </linearGradient>
        </defs>
      </svg>

      {/* logo disc */}
      <div className="absolute inset-[30px] flex items-center justify-center rounded-full bg-white shadow-[0_8px_24px_-8px_rgba(13,17,23,0.25)] ring-1 ring-[#0d1117]/[0.05]">
        <div className="logo-loader-mark relative size-[60px]">
          <Image
            src="/icon.png"
            alt=""
            fill
            sizes="60px"
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>

    <p className="inter text-xs font-medium tracking-wide text-[#8b93a1]">
      {label}
      <span className="logo-loader-dots" aria-hidden />
    </p>
  </div>
);

export default LogoLoader;
