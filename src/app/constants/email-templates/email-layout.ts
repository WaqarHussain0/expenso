import { CONTACT_EMAIL, SITE_NAME } from '@/app/constants/site.constant';

/**
 * Shared building blocks for transactional emails.
 *
 * Email clients ignore <style> blocks and modern CSS unevenly, so everything is
 * table-based with inline styles, and fonts fall back to web-safe stacks.
 */

export const EMAIL_COLORS = {
  canvas: '#f6f7f5',
  panel: '#0d1117',
  surface: '#ffffff',
  ink: '#0d1117',
  muted: '#5b6472',
  subtle: '#8a93a1',
  border: '#e7e9e6',
  brand: '#1a7f5a',
  brandBright: '#34d399',
  brandTint: '#e8f3ee',
};

export const EMAIL_FONT =
  "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
export const EMAIL_DISPLAY_FONT = "Georgia, 'Times New Roman', serif";

/** Escape user-provided text before putting it into email HTML. */
export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** A solid, table-based button that renders in Outlook and Gmail alike. */
export const emailButton = (href: string, label: string) => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" bgcolor="${EMAIL_COLORS.brand}" style="border-radius: 10px;">
        <a href="${escapeHtml(href)}" target="_blank"
          style="display: inline-block; padding: 14px 28px; font-family: ${EMAIL_FONT}; font-size: 15px; font-weight: 600; line-height: 1; color: #ffffff; text-decoration: none; border-radius: 10px;">
          ${label}
        </a>
      </td>
    </tr>
  </table>`;

interface IEmailLayoutOptions {
  /** Inbox preview line shown after the subject (hidden in the email body) */
  preheader: string;
  /** Content of the dark header */
  hero: string;
  /** Main white card content */
  body: string;
  /** Small print under the card (e.g. why they got this email) */
  footerNote?: string;
}

/** Full email document: dark hero, white body card, footer. */
export const emailLayout = ({
  preheader,
  hero,
  body,
  footerNote = '',
}: IEmailLayoutOptions) => {
  const c = EMAIL_COLORS;
  const year = new Date().getFullYear();

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${SITE_NAME}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${c.canvas};">
  <!-- Inbox preview text -->
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; mso-hide: all;">
    ${preheader}&#8202;&zwnj;&nbsp;&#8202;&zwnj;&nbsp;&#8202;&zwnj;&nbsp;&#8202;&zwnj;&nbsp;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${c.canvas}" style="background-color: ${c.canvas};">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">

          <!-- Header -->
          <tr>
            <td bgcolor="${c.panel}" style="background-color: ${c.panel}; border-radius: 16px 16px 0 0; padding: 36px 40px;">
              ${hero}
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td bgcolor="${c.surface}" style="background-color: ${c.surface}; border-radius: 0 0 16px 16px; padding: 36px 40px 40px; font-family: ${EMAIL_FONT}; font-size: 15px; line-height: 1.65; color: ${c.ink};">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px 24px 0; font-family: ${EMAIL_FONT}; font-size: 12px; line-height: 1.6; color: ${c.subtle};">
              ${footerNote ? `<p style="margin: 0 0 8px;">${footerNote}</p>` : ''}
              <p style="margin: 0;">
                Questions? Just reply or write to
                <a href="mailto:${CONTACT_EMAIL}" style="color: ${c.muted}; text-decoration: underline;">${CONTACT_EMAIL}</a>
              </p>
              <p style="margin: 8px 0 0;">&copy; ${year} ${SITE_NAME}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
