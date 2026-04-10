/* eslint-disable react/no-unescaped-entities */
'use client';

import Row from '@/components/common/Row';
import { Lightbulb } from 'lucide-react';

const MailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.45 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function FeatureRequestSection() {
  return (
    <>
      {/* Scoped styles only for things Tailwind can't express */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .5; transform: scale(.7); }
        }
        .animate-pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }

        .fr-grid-bg {
          background-image:
            linear-gradient(rgba(74,222,128,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,222,128,.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      <section
        id="feature-request"
        className="relative w-full overflow-hidden bg-[#0a0a0a] p-4 lg:p-8"
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

        {/* Inner container — full width up to max-w-5xl */}
        <div className="relative z-10 w-full">
          <Row className="mb-4 w-full flex-col">
            {/* Label */}
            <div className="mb-5 inline-flex items-center gap-2">
              <span
                className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-green-400"
                style={{ boxShadow: '0 0 8px #4ade80' }}
              />
              <span className="text-xs font-semibold tracking-widest text-green-400 uppercase">
                Feature Requests
              </span>
            </div>

            {/* Heading */}
            <h2
              className="mb-5 text-center text-[clamp(32px,5vw,52px)] leading-[1.1] font-bold text-[#f4f4f4]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Have an idea that could make
              <br />
              Expenso{' '}
              <em className="text-[#2ea878]" style={{ fontStyle: 'italic' }}>
                even better?
              </em>
            </h2>

            {/* Subtext */}
            <p className="inter max-w-[660px] text-center text-[14px] leading-relaxed text-[#888]">
              Expenso is built around real user needs. If a feature you want
              could benefit everyone, there&apos;s a good chance it&apos;ll make
              it into the app. Reach out — good ideas are always welcome.
            </p>
          </Row>

          {/* Cards grid */}
          <div className="grid w-full grid-cols-1 items-start gap-6">
            {/* ── Contact Card ── */}
            <div className="rounded-2xl border border-[#1e1e1e] border-green-400/25 bg-[#111] p-6 transition-all duration-300 hover:-translate-y-1">
              <Row className="flex-col gap-2 md:flex-row">
                <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-md bg-green-400/10 text-green-400">
                  <Lightbulb className="size-6" />
                </div>

                <Row className="flex-col items-start">
                  <h3 className="inter text-lg font-bold tracking-tight text-[#f4f4f4]">
                    Submit a Feature Idea
                  </h3>

                  <p className="inter text-[13px] text-[#555]">
                    Think of something missing — a chart type, a new filter,
                    better exports, recurring transactions, budget goals?
                    Describe it and if it's useful for most users, it gets
                    built.
                  </p>
                </Row>
              </Row>

              <ul className="my-3 list-none flex-col divide-y divide-[#1a1a1a] p-0">
                {/* Name */}
                <li className="flex items-center justify-between gap-3 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-lg bg-[#1a1a1a] text-green-400">
                      <UserIcon />
                    </div>
                    <div className="min-w-0">
                      <p className="inter mb-0.5 text-[11px] font-semibold tracking-[.08em] text-[#444] uppercase">
                        Developer
                      </p>
                      <span className="inter block truncate text-sm font-medium text-[#ccc]">
                        Waqar Hussain
                      </span>
                    </div>
                  </div>
                </li>

                {/* Email */}
                <li className="flex items-center justify-between gap-3 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="inter flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-lg bg-[#1a1a1a] text-green-400">
                      <MailIcon />
                    </div>
                    <div className="min-w-0">
                      <p className="mb-0.5 text-[11px] font-semibold tracking-[.08em] text-[#444] uppercase">
                        Email
                      </p>
                      <a
                        href="mailto:waqar.mernstackdev@gmail.com"
                        className="inter block truncate text-sm font-medium text-[#ccc] no-underline transition-colors duration-200 hover:text-green-400"
                      >
                        waqar.mernstackdev@gmail.com
                      </a>
                    </div>
                  </div>
                </li>

                {/* Phone */}
                <li className="flex items-center justify-between gap-3 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-lg bg-[#1a1a1a] text-green-400">
                      <PhoneIcon />
                    </div>
                    <div className="min-w-0">
                      <p className="inter mb-0.5 text-[11px] font-semibold tracking-[.08em] text-[#444] uppercase">
                        WhatsApp / Call
                      </p>
                      <a
                        href="tel:+923174945496"
                        className="manropeBold block truncate text-sm font-medium text-[#ccc] no-underline transition-colors duration-200 hover:text-green-400"
                      >
                        +92 317 4945496
                      </a>
                    </div>
                  </div>
                </li>
              </ul>

              <a
                href="mailto:waqar.mernstackdev@gmail.com?subject=Feature Request — Expenso&body=Hi Waqar,%0A%0AI have a feature idea for Expenso:%0A%0A[Describe your idea here]%0A%0AThanks!"
                className="inter inline-flex items-center gap-2 self-start rounded-lg bg-green-400 px-5 py-2.5 text-[13px] font-bold tracking-wide text-[#0a0a0a] no-underline transition-all duration-200 hover:gap-3 hover:bg-green-300"
              >
                Send your idea <ArrowIcon />
              </a>
            </div>
          </div>

          {/* Bottom note */}
          <p className="mt-9 text-center text-[13px] tracking-wide text-[#3a3a3a]">
            <strong className="font-medium text-[#4a4a4a]">
              Response time:
            </strong>{' '}
            Usually within 24–48 hours · Features are evaluated for general
            usefulness before being added
          </p>
        </div>
      </section>
    </>
  );
}
