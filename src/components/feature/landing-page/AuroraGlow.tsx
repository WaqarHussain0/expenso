interface IAuroraGlowProps {
  variant?: 'teal' | 'warm';
}

const AuroraGlow: React.FC<IAuroraGlowProps> = ({ variant = 'teal' }) => {
  return (
    <>
      <div
        className="animate-drift-a pointer-events-none absolute -top-32 left-1/3 h-[420px] w-[560px] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(ellipse, rgba(46,168,120,.18) 0%, transparent 70%)',
        }}
      />
      <div
        className="animate-drift-b pointer-events-none absolute -top-16 left-2/3 h-[380px] w-[520px] -translate-x-1/2"
        style={{
          background:
            variant === 'warm'
              ? 'radial-gradient(ellipse, rgba(251,146,60,.14) 0%, transparent 70%)'
              : 'radial-gradient(ellipse, rgba(45,212,191,.16) 0%, transparent 70%)',
        }}
      />
    </>
  );
};

export default AuroraGlow;
