import {
  EMAIL_COLORS as c,
  EMAIL_DISPLAY_FONT,
  EMAIL_FONT,
  emailButton,
  emailLayout,
  escapeHtml,
} from './email-layout';

interface IStatsExportEmailTemplateDTO {
  name: string;
  /** Period the export covers, e.g. "November 2026" */
  periodLabel: string;
  fileName: string;
  statsLink: string;
  summary: {
    income: number;
    expense: number;
    investment: number;
    freeCash: number;
    count: number;
  };
}

const formatAmount = (value: number) =>
  value.toLocaleString('en-US', { maximumFractionDigits: 2 });

const summaryRow = (label: string, value: number, strong = false) => `
  <tr>
    <td style="padding: 10px 0; border-bottom: 1px solid ${c.border}; font-family: ${EMAIL_FONT}; font-size: 14px; color: ${strong ? c.ink : c.muted}; ${strong ? 'font-weight: 600;' : ''}">
      ${label}
    </td>
    <td align="right" style="padding: 10px 0; border-bottom: 1px solid ${c.border}; font-family: ${EMAIL_FONT}; font-size: 14px; font-weight: 600; color: ${strong ? (value < 0 ? '#b42318' : c.brand) : c.ink}; white-space: nowrap;">
      ${formatAmount(value)}
    </td>
  </tr>`;

export const statsExportEmailTemplate = (
  payload: IStatsExportEmailTemplateDTO,
) => {
  const { name, periodLabel, fileName, statsLink, summary } = payload;

  const firstName = escapeHtml(name.trim().split(/\s+/)[0] || 'there');
  const period = escapeHtml(periodLabel);

  const hero = `
    <p style="margin: 0; font-family: ${EMAIL_FONT}; font-size: 14px; color: rgba(255,255,255,0.6);">
      Hi ${firstName},
    </p>
    <h1 style="margin: 6px 0 0; font-family: ${EMAIL_DISPLAY_FONT}; font-size: 28px; line-height: 1.25; font-weight: 700; color: #f4f4f4;">
      Your export for <em style="color: ${c.brandBright}; font-style: italic;">${period}</em>
    </h1>
    <p style="margin: 12px 0 0; font-family: ${EMAIL_FONT}; font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.7);">
      The CSV with every transaction in this period is attached.
    </p>`;

  const body = `
    <p style="margin: 0 0 16px; color: ${c.muted};">
      Here&rsquo;s a quick summary of what&rsquo;s inside
      <strong style="color: ${c.ink};">${escapeHtml(fileName)}</strong>:
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${summaryRow('Income', summary.income)}
      ${summaryRow('Expenses', summary.expense)}
      ${summaryRow('Investments', summary.investment)}
      ${summaryRow('Free cash', summary.freeCash, true)}
    </table>

    <p style="margin: 14px 0 24px; font-size: 13px; color: ${c.subtle};">
      ${summary.count} transaction${summary.count === 1 ? '' : 's'} &middot;
      columns: Date, Type, Category, Amount, Note
    </p>

    ${emailButton(statsLink, 'View your stats &rarr;')}`;

  return emailLayout({
    preheader: `Your Expenso CSV for ${period} is attached.`,
    hero,
    body,
    footerNote:
      'You&rsquo;re receiving this because you requested an export from your Expenso stats page.',
  });
};
