import {
  EMAIL_COLORS as c,
  EMAIL_DISPLAY_FONT,
  EMAIL_FONT,
  emailButton,
  emailLayout,
  escapeHtml,
} from './email-layout';

interface IWelcomeEmailTemplateDTO {
  name: string;
  email: string;
  dashboardLink: string;
}

const STEPS = [
  {
    title: 'Set up your workspace',
    text: 'Pick the income, expense and investment categories that fit your life.',
  },
  {
    title: 'Log your first transaction',
    text: 'Salary, groceries, a SIP — it takes a few seconds to add each one.',
  },
  {
    title: 'See where it all goes',
    text: 'Monthly and yearly charts, shareable reports, and an AI assistant you can ask.',
  },
];

const stepRow = (index: number, title: string, text: string) => `
  <tr>
    <td valign="top" width="44" style="padding: 0 0 18px;">
      <div style="width: 30px; height: 30px; border-radius: 9px; background-color: ${c.brandTint}; color: ${c.brand}; font-family: ${EMAIL_FONT}; font-size: 14px; font-weight: 700; line-height: 30px; text-align: center;">
        ${index}
      </div>
    </td>
    <td valign="top" style="padding: 3px 0 18px; font-family: ${EMAIL_FONT};">
      <p style="margin: 0; font-size: 15px; font-weight: 600; color: ${c.ink};">${title}</p>
      <p style="margin: 2px 0 0; font-size: 14px; line-height: 1.55; color: ${c.muted};">${text}</p>
    </td>
  </tr>`;

export const welcomeEmailTemplate = (payload: IWelcomeEmailTemplateDTO) => {
  const { name, email, dashboardLink } = payload;

  if (!name || !dashboardLink) {
    throw new Error(`Name or dashboard url is missing`);
  }

  // Names are user-provided — never put them into HTML unescaped
  const firstName = escapeHtml(name.trim().split(/\s+/)[0] || name);

  const hero = `
    <p style="margin: 0; font-family: ${EMAIL_FONT}; font-size: 14px; color: rgba(255,255,255,0.6);">
      Hi ${firstName},
    </p>
    <h1 style="margin: 6px 0 0; font-family: ${EMAIL_DISPLAY_FONT}; font-size: 30px; line-height: 1.2; font-weight: 700; color: #f4f4f4;">
      Welcome to <em style="color: ${c.brandBright}; font-style: italic;">Expenso</em>
    </h1>
    <p style="margin: 12px 0 0; font-family: ${EMAIL_FONT}; font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.7);">
      Your account is ready. Let&rsquo;s get your money organised.
    </p>`;

  const body = `
    <p style="margin: 0 0 24px; color: ${c.muted};">
      Expenso keeps your income, expenses and investments in one place, so
      you always know what&rsquo;s left over. Here&rsquo;s how to get going:
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${STEPS.map((step, i) => stepRow(i + 1, step.title, step.text)).join('')}
    </table>

    <div style="height: 8px; line-height: 8px; font-size: 0;">&nbsp;</div>
    ${emailButton(dashboardLink, 'Open your dashboard &rarr;')}

    <p style="margin: 28px 0 0; padding-top: 20px; border-top: 1px solid ${c.border}; font-size: 12px; line-height: 1.6; color: ${c.subtle};">
      Button not working? Copy this link into your browser:<br />
      <a href="${escapeHtml(dashboardLink)}" style="color: ${c.brand}; word-break: break-all;">${escapeHtml(dashboardLink)}</a>
    </p>`;

  return emailLayout({
    preheader: 'Your Expenso account is ready — here’s how to get started.',
    hero,
    body,
    footerNote: email
      ? `You&rsquo;re receiving this because an Expenso account was created with ${escapeHtml(email)}.`
      : '',
  });
};
