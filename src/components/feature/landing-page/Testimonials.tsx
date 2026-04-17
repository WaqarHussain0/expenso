/* eslint-disable react/no-unescaped-entities */
const testimonials = [
  {
    name: 'Bilal Chaudhry',
    profession: 'Software Engineer',
    feedback:
      'I track every rupee now — groceries, SIP, even coffee. The visual dashboard gives me a real snapshot of where I stand. As someone who loves data, Expenso finally scratches that itch without the spreadsheet grind.',
    highlight: 'Logged 200+ transactions in the first month.',
    initials: 'BC',
    accentBg: '#e6f5ef',
    accentText: '#1a7f5a',
    tagBg: '#f0faf5',
    tagBorder: 'rgba(26,127,90,0.15)',
    tag: '💻 Engineering',
    stars: 5,
  },
  {
    name: 'Sana Mirza',
    profession: 'HR Professional',
    feedback:
      "Managing a salary, medical allowance, and side savings used to be a mess. Expenso's custom categories made it click. Now I share my monthly stats link with my husband and we actually talk about money together.",
    highlight: 'Shared monthly reports with family every month.',
    initials: 'SM',
    accentBg: '#fef3c7',
    accentText: '#b45309',
    tagBg: '#fffbeb',
    tagBorder: 'rgba(180,83,9,0.15)',
    tag: '👥 Human Resources',
    stars: 5,
  },
  {
    name: 'Omar Farooq',
    profession: 'BD Executive',
    feedback:
      "In business development, knowing your personal burn rate matters as much as your pipeline. Expenso's free cash tracker tells me exactly what's left after all my commitments — it's become my financial sanity check.",
    highlight: 'Cut unnecessary spend by 22% in two months.',
    initials: 'OF',
    accentBg: '#ede9fe',
    accentText: '#6d28d9',
    tagBg: '#f5f3ff',
    tagBorder: 'rgba(109,40,217,0.15)',
    tag: '📈 Business Development',
    stars: 5,
  },
];

const StarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="#f59e0b"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 1l1.545 3.09L12 4.635l-2.5 2.41.59 3.41L7 8.81l-3.09 1.645.59-3.41L2 4.635l3.455-.545L7 1z" />
  </svg>
);

const QuoteIcon = ({ color }: { color: string }) => (
  <svg
    width="22"
    height="14"
    viewBox="0 0 32 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 24V14.4C0 10.56 0.96 7.36 2.88 4.8C4.86667 2.18667 7.68 0.533333 11.32 0L12.48 2.16C9.97333 2.74667 8.08 3.97333 6.8 5.84C5.57333 7.70667 4.96 9.6 4.96 11.52H9.6V24H0ZM19.52 24V14.4C19.52 10.56 20.48 7.36 22.4 4.8C24.3867 2.18667 27.2 0.533333 30.84 0L32 2.16C29.4933 2.74667 27.6 3.97333 26.32 5.84C25.0933 7.70667 24.48 9.6 24.48 11.52H29.12V24H19.52Z"
      fill={color}
      fillOpacity="0.18"
    />
  </svg>
);

export default function Testimonials() {
  return (
    <section
      className="w-full px-4 py-16 md:px-8 md:py-12"
      style={{
        background: 'linear-gradient(180deg, #f7f8fa 0%, #ffffff 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,400&family=DM+Sans:wght@300;400;500&display=swap');

        .testi-section * { box-sizing: border-box; }

        .testi-card {
          border: 1px solid rgba(0,0,0,0.07);
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          position: relative;
          overflow: hidden;
        }
        .testi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.1);
          border-color: rgba(0,0,0,0.12);
        }

        .testi-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 20px 20px 0 0;
        }
        .testi-card-green::before { background: #1a7f5a; }
        .testi-card-amber::before { background: #b45309; }
        .testi-card-purple::before { background: #6d28d9; }

        .highlight-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 100px;
          margin-top: 16px;
          border: 1px solid;
          width: fit-content;
        }
        .highlight-pill::before {
          content: '✦';
          font-size: 9px;
        }
      `}</style>

      <div className="testi-section">
        {/* Section header */}
        <div className="mb-8 text-center">
          <div
            className="gap-2 rounded-full uppercase"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#e6f5ef',
              color: '#1a7f5a',
              fontSize: '11px',
              fontWeight: 500,
              padding: '4px 12px',
              marginBottom: '16px',
              letterSpacing: '1px',
            }}
          >
            <span
              style={{
                background: '#1a7f5a',
                display: 'inline-block',
              }}
              className="size-1.5 rounded-full"
            />
            Real people, real results
          </div>

          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(30px, 4vw, 48px)',
              fontWeight: 600,
              letterSpacing: '-1.5px',
              lineHeight: 1.08,
              color: '#0d1117',
              margin: '0 0 14px',
            }}
          >
            Loved by people who{' '}
            <em style={{ fontStyle: 'italic', color: '#1a7f5a' }}>
              want clarity
            </em>
          </h2>

          <p
            style={{
              fontSize: '16px',
              color: '#5a6070',
              maxWidth: '440px',
              margin: '0 auto',
              fontWeight: 300,
              lineHeight: 1.65,
            }}
          >
            From engineers to executives — here's what real users say about
            finally feeling in control of their money.
          </p>
        </div>

        {/* Cards */}
        <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`testi-card flex flex-col gap-0 rounded-2xl bg-white p-4 md:p-7 testi-card-${i === 0 ? 'green' : i === 1 ? 'amber' : 'purple'}`}
            >
              {/* Quote icon */}
              <div className="mb-4">
                <QuoteIcon color={t.accentText} />
              </div>

              {/* Tag */}
              <div
                className=""
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: t.tagBg,
                  border: `1px solid ${t.tagBorder}`,
                  color: t.accentText,
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '3px 10px',
                  borderRadius: '100px',
                  marginBottom: '14px',
                  width: 'fit-content',
                }}
              >
                {t.tag}
              </div>

              {/* Stars */}
              <div className="mb-2 flex items-center gap-1">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <StarIcon key={s} />
                ))}
              </div>

              {/* Feedback */}
              <p
                style={{
                  fontSize: '14px',
                  color: '#374151',
                  lineHeight: 1.7,
                  fontWeight: 300,
                  flex: 1,
                  margin: 0,
                }}
              >
                "{t.feedback}"
              </p>

              {/* Highlight */}
              <div
                className="highlight-pill"
                style={{
                  background: t.accentBg,
                  color: t.accentText,
                  borderColor: t.tagBorder,
                }}
              >
                {t.highlight}
              </div>

              {/* Divider */}
              <div
                className="my-4 h-px"
                style={{
                  background: 'rgba(0,0,0,0.06)',
                }}
              />

              {/* Author */}
              <div className="flex items-center gap-2">
                <div
                  className="flex size-10 items-center justify-center rounded-full"
                  style={{
                    background: t.accentBg,
                    color: t.accentText,
                    fontSize: '13px',
                    fontWeight: 600,
                    flexShrink: 0,
                    border: `1.5px solid ${t.tagBorder}`,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0d1117',
                      lineHeight: 1.3,
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#9ba3af',
                      lineHeight: 1.4,
                    }}
                  >
                    {t.profession}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust line */}
        <div
          className="mt-10"
          style={{
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            padding: '0 5%',
          }}
        >
          <div style={{ display: 'flex', gap: '3px' }}>
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
          <span style={{ fontSize: '13px', color: '#5a6070' }}>
            Trusted by users across Pakistan
          </span>
          <span style={{ color: 'rgba(0,0,0,0.15)', fontSize: '13px' }}>·</span>
        </div>
      </div>
    </section>
  );
}
