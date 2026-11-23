import Image from 'next/image';

interface IBrandLogoProps {
  /** Sizing for the wrapper, e.g. "h-[30px] w-[96px]" */
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Expenso wordmark for theme-aware surfaces: the dark-lettered logo in light
 * mode, the light-lettered one in dark mode. (On always-dark panels use
 * /light-logo.png directly.)
 */
const BrandLogo: React.FC<IBrandLogoProps> = ({
  className = 'h-[30px] w-[96px]',
  sizes = '96px',
  priority = false,
}) => (
  <div className={`relative ${className}`}>
    <Image
      src="/dark-logo.png"
      alt="Expenso"
      fill
      sizes={sizes}
      priority={priority}
      className="object-contain object-left dark:hidden"
    />
    <Image
      src="/light-logo.png"
      alt=""
      aria-hidden
      fill
      sizes={sizes}
      priority={priority}
      className="hidden object-contain object-left dark:block"
    />
  </div>
);

export default BrandLogo;
