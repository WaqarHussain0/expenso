import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

interface IOgImageProps {
  eyebrow: string;
  title: string;
  accent: string;
  subtitle: string;
}

/**
 * Branded 1200×630 social card (Open Graph / Twitter). Satori supports a
 * subset of CSS: every element with more than one child needs display:flex.
 */
export const renderOgImage = ({
  eyebrow,
  title,
  accent,
  subtitle,
}: IOgImageProps) =>
  new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        background:
          'radial-gradient(circle at 85% 10%, rgba(52,211,153,0.28), transparent 45%), radial-gradient(circle at 0% 100%, rgba(26,127,90,0.35), transparent 50%), #0d1117',
        color: '#f4f4f4',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #34d399, #1a7f5a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            fontWeight: 800,
            color: '#0d1117',
          }}
        >
          E
        </div>
        <div style={{ fontSize: 34, fontWeight: 700 }}>Expenso</div>
        <div
          style={{
            marginLeft: 16,
            padding: '8px 18px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.16)',
            fontSize: 20,
            color: 'rgba(255,255,255,0.7)',
            textTransform: 'uppercase',
            letterSpacing: 3,
          }}
        >
          {eyebrow}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: 74,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 74,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -2,
            color: '#34d399',
            fontStyle: 'italic',
          }}
        >
          {accent}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 28,
            color: 'rgba(255,255,255,0.62)',
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 36,
          fontSize: 22,
          color: 'rgba(255,255,255,0.55)',
        }}
      >
        {['Free forever', 'Private by default', 'AI money assistant'].map(
          perk => (
            <div
              key={perk}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              {/* drawn dot: the default OG font has no check-mark glyph */}
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: '#34d399',
                }}
              />
              {perk}
            </div>
          ),
        )}
      </div>
    </div>,
    OG_SIZE,
  );
