'use server';

import 'reflect-metadata';
import { after } from 'next/server';

import { TransactionService } from '@/backend/modules/transaction/transaction.service';
import { UserService } from '@/backend/modules/user/user.service';
import {
  buildStatsExportCsv,
  IStatsExportFilterInput,
  resolveStatsExportRange,
  StatsExportFilterError,
  summariseStatsExport,
} from '@/backend/modules/stats/stats-export.util';
import { statsExportEmailTemplate } from '@/app/constants/email-templates/stats-export.email-template';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';
import { appUrl } from '@/lib/app-url.util';
import { sendEmail } from '@/lib/email.util';
import {
  enforceRateLimit,
  RateLimitError,
} from '@/backend/modules/rate-limit/rate-limit.service';
import {
  LIMITS,
  STATS_EXPORT_MAX_ROWS,
} from '@/backend/modules/rate-limit/limits.constant';
import { ActionAuthError, requireUser } from './action-guard';

const transactionService = new TransactionService();
const userService = new UserService();

interface IExportStatsResult {
  success: boolean;
  error?: string;
  /** Where the file is being sent */
  email?: string;
}

/**
 * Emails the signed-in user a CSV of their transactions for the stats page's
 * current filter (month / year / custom range — nothing outside it).
 *
 * The cheap checks run now so the page can show a real error; building the
 * CSV and sending the email happen in `after()`, once the response is sent.
 */
export async function exportStatsAction(
  filter: IStatsExportFilterInput,
): Promise<IExportStatsResult> {
  try {
    const { objectId: userId } = await requireUser();
    const range = resolveStatsExportRange(filter ?? {});

    const [user, count] = await Promise.all([
      userService.findById(userId),
      transactionService.countInRange(userId, range.start, range.end),
    ]);

    if (!user?.email) {
      return {
        success: false,
        error: 'Your account has no email address to send to.',
      };
    }

    if (count === 0) {
      return {
        success: false,
        error: `No transactions in ${range.label} to export.`,
      };
    }

    // Bounds the query, memory and attachment size of the background job
    if (count > STATS_EXPORT_MAX_ROWS) {
      return {
        success: false,
        error: `${range.label} has ${count.toLocaleString('en-US')} transactions — exports are limited to ${STATS_EXPORT_MAX_ROWS.toLocaleString('en-US')}. Choose a shorter period.`,
      };
    }

    // Counted only for exports that will actually send an email
    await enforceRateLimit({
      action: 'stats-export',
      subject: String(userId),
      ...LIMITS.statsExport,
      message: `You can send up to ${LIMITS.statsExport.limit} exports an hour.`,
    });

    after(async () => {
      try {
        const rows = await transactionService.findForExport(
          userId,
          range.start,
          range.end,
          STATS_EXPORT_MAX_ROWS,
        );

        await sendEmail({
          to: user.email,
          subject: `Your Expenso export — ${range.label}`,
          html: statsExportEmailTemplate({
            name: user.name || 'there',
            periodLabel: range.label,
            fileName: range.fileName,
            statsLink: appUrl(PAGE_ROUTES.stats),
            summary: summariseStatsExport(rows),
          }),
          attachments: [
            {
              filename: range.fileName,
              content: Buffer.from(buildStatsExportCsv(rows), 'utf8'),
            },
          ],
        });
      } catch (error) {
        console.error('Stats export failed:', error);
      }
    });

    return { success: true, email: user.email };
  } catch (error) {
    // Only our own messages reach the user; anything else is logged
    if (
      error instanceof StatsExportFilterError ||
      error instanceof RateLimitError ||
      error instanceof ActionAuthError
    ) {
      return { success: false, error: error.message };
    }
    console.error('Stats export failed:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
