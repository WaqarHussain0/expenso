import mongoose, { PipelineStage } from 'mongoose';
import { initDB } from '@/backend/utils/dbInit.util';
import UserEntity, {
  LoginMethodEnum,
  UserRoleEnum,
} from '../entities/user.entity';
import UserProfileEntity, {
  UserGenderEnum,
} from '../entities/user-profile.entity';
import TransactionEntity from '../../transaction/entities/transaction.entity';
import CategoryEntity, {
  CategoryTypeEnum,
} from '../../category/entities/category.entity';
import StatEntity from '../../stats/entities/stats.entity';
import RefreshTokenEntity from '../../auth/entities/refresh-token.entity';
import UserAiKeyEntity from '../../ai-keys/entities/user-ai-key.entity';

/*
 * Read-only aggregations behind the admin's Users pages. Callers must have
 * verified the admin role already (see requireAdminPage).
 *
 * Months are bucketed in UTC (the server's timezone on Vercel).
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const ACTIVE_WINDOW_DAYS = 7;
const TREND_MONTHS = 12;

export type UserStatusFilter = 'active' | 'inactive';
export type UserSortOption = 'newest' | 'oldest' | 'recent' | 'transactions';

export interface IMonthBucket {
  /** "2026-11" */
  key: string;
  /** "Nov" / "Nov 25" */
  label: string;
}

/** The last `count` calendar months (UTC), oldest first. */
const lastMonths = (count: number, now = new Date()): IMonthBucket[] => {
  const months: IMonthBucket[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1),
    );
    const month = d.toLocaleString('en-US', {
      month: 'short',
      timeZone: 'UTC',
    });
    months.push({
      key: `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`,
      label:
        d.getUTCMonth() === 0 || i === count - 1
          ? `${month} ${String(d.getUTCFullYear()).slice(2)}`
          : month,
    });
  }
  return months;
};

const startOfUtcMonth = (monthsAgo = 0, now = new Date()) =>
  new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo, 1));

const monthKeyExpr = (field: string) => ({
  $dateToString: { format: '%Y-%m', date: field, timezone: 'UTC' },
});

/** Signed up without a password → came in through Google. */
const hasPasswordExpr = {
  $gt: [{ $strLenCP: { $ifNull: ['$password', ''] } }, 0],
};

/** Latest of several optional dates (fallback for users from before tracking). */
const latestDate = (...dates: (Date | null | undefined)[]) => {
  const times = dates
    .filter((d): d is Date => !!d)
    .map(d => new Date(d).getTime());
  return times.length ? new Date(Math.max(...times)) : null;
};

const toIso = (d?: Date | null) => (d ? new Date(d).toISOString() : null);

export class UserInsightsService {
  // ───────────────────────────── Overview ─────────────────────────────

  async getOverview() {
    await initDB();

    const now = new Date();
    const monthStart = startOfUtcMonth(0, now);
    const trendStart = startOfUtcMonth(TREND_MONTHS - 1, now);
    const activeSince = new Date(now.getTime() - ACTIVE_WINDOW_DAYS * DAY_MS);

    const regularUserIds = (
      await UserEntity.find({ role: UserRoleEnum.USER }, { _id: 1 }).lean()
    ).map(u => u._id);
    const regularIdSet = new Set(regularUserIds.map(String));

    const [
      [userTotals],
      adminCount,
      signupsByMonth,
      genderSplit,
      recentlyActiveIds,
      recentTokenUserIds,
      recentTxUserIds,
      txUserIds,
      aiKeyUserIds,
      shareLinkCount,
      txTotals,
      txByMonth,
    ] = await Promise.all([
      UserEntity.aggregate<{
        total: number;
        active: number;
        onboarded: number;
        withPassword: number;
        newThisMonth: number;
      }>([
        { $match: { role: UserRoleEnum.USER } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $ne: ['$isActive', false] }, 1, 0] } },
            onboarded: {
              $sum: { $cond: [{ $eq: ['$isFirstLogin', true] }, 0, 1] },
            },
            withPassword: { $sum: { $cond: [hasPasswordExpr, 1, 0] } },
            newThisMonth: {
              $sum: { $cond: [{ $gte: ['$createdAt', monthStart] }, 1, 0] },
            },
          },
        },
      ]),
      UserEntity.countDocuments({ role: UserRoleEnum.ADMIN }),
      UserEntity.aggregate<{ _id: string; count: number }>([
        {
          $match: { role: UserRoleEnum.USER, createdAt: { $gte: trendStart } },
        },
        { $group: { _id: monthKeyExpr('$createdAt'), count: { $sum: 1 } } },
      ]),
      UserProfileEntity.aggregate<{ _id: UserGenderEnum; count: number }>([
        { $match: { userId: { $in: regularUserIds } } },
        { $group: { _id: '$gender', count: { $sum: 1 } } },
      ]),
      UserEntity.distinct('_id', {
        role: UserRoleEnum.USER,
        lastActiveAt: { $gte: activeSince },
      }),
      // Fallbacks for accounts that predate activity tracking
      RefreshTokenEntity.distinct('userId', {
        createdAt: { $gte: activeSince },
      }),
      TransactionEntity.distinct('userId', {
        createdAt: { $gte: activeSince },
      }),
      TransactionEntity.distinct('userId'),
      UserAiKeyEntity.distinct('userId'),
      StatEntity.countDocuments({ userId: { $in: regularUserIds } }),
      TransactionEntity.aggregate<{ total: number; thisMonth: number }>([
        { $match: { userId: { $in: regularUserIds } } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            thisMonth: {
              $sum: { $cond: [{ $gte: ['$createdAt', monthStart] }, 1, 0] },
            },
          },
        },
      ]),
      TransactionEntity.aggregate<{ _id: string; count: number }>([
        {
          $match: {
            userId: { $in: regularUserIds },
            createdAt: { $gte: trendStart },
          },
        },
        { $group: { _id: monthKeyExpr('$createdAt'), count: { $sum: 1 } } },
      ]),
    ]);

    const countRegular = (ids: unknown[]) =>
      new Set(ids.map(String).filter(id => regularIdSet.has(id))).size;

    const activeRecently = countRegular([
      ...recentlyActiveIds,
      ...recentTokenUserIds,
      ...recentTxUserIds,
    ]);

    const total = userTotals?.total ?? 0;
    const signupMap = new Map(signupsByMonth.map(m => [m._id, m.count]));
    const txMap = new Map(txByMonth.map(m => [m._id, m.count]));

    return {
      totals: {
        users: total,
        admins: adminCount,
        active: userTotals?.active ?? 0,
        deactivated: total - (userTotals?.active ?? 0),
        onboarded: userTotals?.onboarded ?? 0,
        newThisMonth: userTotals?.newThisMonth ?? 0,
        activeRecently,
        activeWindowDays: ACTIVE_WINDOW_DAYS,
        withTransactions: countRegular(txUserIds),
        withOwnAiKeys: countRegular(aiKeyUserIds),
        shareLinks: shareLinkCount,
        transactions: txTotals[0]?.total ?? 0,
        transactionsThisMonth: txTotals[0]?.thisMonth ?? 0,
      },
      signInMethods: {
        email: userTotals?.withPassword ?? 0,
        google: total - (userTotals?.withPassword ?? 0),
      },
      genders: {
        male: genderSplit.find(g => g._id === UserGenderEnum.MALE)?.count ?? 0,
        female:
          genderSplit.find(g => g._id === UserGenderEnum.FEMALE)?.count ?? 0,
        other:
          genderSplit.find(g => g._id === UserGenderEnum.OTHER)?.count ?? 0,
        notSet: Math.max(
          0,
          total - genderSplit.reduce((sum, g) => sum + g.count, 0),
        ),
      },
      trend: lastMonths(TREND_MONTHS, now).map(m => ({
        ...m,
        signups: signupMap.get(m.key) ?? 0,
        transactions: txMap.get(m.key) ?? 0,
      })),
    };
  }

  // ───────────────────────────── User list ─────────────────────────────

  async listUsers({
    search,
    page = 1,
    limit = 10,
    gender,
    status,
    sort = 'newest',
  }: {
    search?: string;
    page?: number;
    limit?: number;
    gender?: UserGenderEnum;
    status?: UserStatusFilter;
    sort?: UserSortOption;
  }) {
    await initDB();

    const match: Record<string, unknown> = { role: UserRoleEnum.USER };
    if (search) {
      // Escape regex metacharacters so a search like "a+b" is literal
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      match.$or = [
        { name: { $regex: safe, $options: 'i' } },
        { email: { $regex: safe, $options: 'i' } },
      ];
    }
    if (status === 'active') match.isActive = { $ne: false };
    if (status === 'inactive') match.isActive = false;

    const base: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: UserProfileEntity.collection.name,
          localField: '_id',
          foreignField: 'userId',
          as: 'profile',
        },
      },
      { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
    ];
    if (gender) base.push({ $match: { 'profile.gender': gender } });

    const txLookup: PipelineStage = {
      $lookup: {
        from: TransactionEntity.collection.name,
        let: { uid: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$userId', '$$uid'] } } },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              lastAt: { $max: '$createdAt' },
            },
          },
        ],
        as: 'tx',
      },
    };

    const enrich: PipelineStage[] = [
      {
        $lookup: {
          from: CategoryEntity.collection.name,
          let: { uid: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$userId', '$$uid'] } } },
            { $count: 'n' },
          ],
          as: 'cat',
        },
      },
      {
        $lookup: {
          from: RefreshTokenEntity.collection.name,
          let: { uid: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$userId', '$$uid'] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            { $project: { createdAt: 1 } },
          ],
          as: 'lastToken',
        },
      },
    ];

    const sortStage: Record<UserSortOption, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      recent: { lastActiveAt: -1, createdAt: -1 },
      transactions: { txCount: -1, createdAt: -1 },
    };

    // Sorting by transactions needs the count before paging; otherwise
    // only the visible page is enriched.
    const page$: PipelineStage[] =
      sort === 'transactions'
        ? [
            txLookup,
            {
              $addFields: {
                txCount: { $ifNull: [{ $first: '$tx.count' }, 0] },
              },
            },
            { $sort: sortStage[sort] },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            ...enrich,
          ]
        : [
            { $sort: sortStage[sort] },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            txLookup,
            ...enrich,
          ];

    const [countAgg, rows] = await Promise.all([
      UserEntity.aggregate<{ total: number }>([...base, { $count: 'total' }]),
      UserEntity.aggregate([
        ...base,
        ...page$,
        { $addFields: { hasPassword: hasPasswordExpr } },
        { $project: { password: 0, resetPasswordToken: 0 } },
      ]),
    ]);

    const totalRecords = countAgg[0]?.total ?? 0;

    const data = rows.map(row => {
      const tx = row.tx?.[0];
      return {
        id: String(row._id),
        name: row.name as string,
        email: row.email as string,
        role: row.role as UserRoleEnum,
        isActive: row.isActive !== false,
        isOnboarded: row.isFirstLogin !== true,
        signInMethod: (row.hasPassword
          ? LoginMethodEnum.PASSWORD
          : LoginMethodEnum.GOOGLE) as LoginMethodEnum,
        profile: {
          gender: (row.profile?.gender as UserGenderEnum) ?? null,
          contact: (row.profile?.contact as string) ?? '',
        },
        transactionCount: (tx?.count as number) ?? 0,
        categoryCount: (row.cat?.[0]?.n as number) ?? 0,
        createdAt: toIso(row.createdAt),
        lastActiveAt: toIso(
          latestDate(
            row.lastActiveAt,
            row.lastToken?.[0]?.createdAt,
            tx?.lastAt,
          ),
        ),
      };
    });

    return {
      data,
      meta: {
        page,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
      },
    };
  }

  // ───────────────────────────── One user ─────────────────────────────

  async getUserInsights(id: string) {
    await initDB();

    const userId = new mongoose.Types.ObjectId(id);
    const user = await UserEntity.findById(userId)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .lean();
    if (!user) return null;

    const [hasPassword, profile] = await Promise.all([
      UserEntity.exists({ _id: userId, password: { $nin: [null, ''] } }),
      UserProfileEntity.findOne({ userId }).lean(),
    ]);

    const now = new Date();
    const monthStart = startOfUtcMonth(0, now);
    const trendStart = startOfUtcMonth(TREND_MONTHS - 1, now);
    const months = lastMonths(TREND_MONTHS, now);

    const [[txFacet], categories, sessions, shareLinks, aiKeys] =
      await Promise.all([
        TransactionEntity.aggregate([
          { $match: { userId } },
          {
            $lookup: {
              from: CategoryEntity.collection.name,
              localField: 'categoryId',
              foreignField: '_id',
              as: 'category',
            },
          },
          { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
          {
            $facet: {
              byType: [
                {
                  $group: {
                    _id: '$category.type',
                    count: { $sum: 1 },
                    amount: { $sum: '$amount' },
                  },
                },
              ],
              range: [
                {
                  $group: {
                    _id: null,
                    count: { $sum: 1 },
                    firstDate: { $min: '$date' },
                    lastDate: { $max: '$date' },
                    firstLoggedAt: { $min: '$createdAt' },
                    lastLoggedAt: { $max: '$createdAt' },
                    loggedThisMonth: {
                      $sum: {
                        $cond: [{ $gte: ['$createdAt', monthStart] }, 1, 0],
                      },
                    },
                  },
                },
              ],
              byMonth: [
                { $match: { date: { $gte: trendStart } } },
                {
                  $group: {
                    _id: {
                      month: monthKeyExpr('$date'),
                      type: '$category.type',
                    },
                    amount: { $sum: '$amount' },
                    count: { $sum: 1 },
                  },
                },
              ],
              byCategory: [
                {
                  $group: {
                    _id: '$categoryId',
                    count: { $sum: 1 },
                    amount: { $sum: '$amount' },
                    lastDate: { $max: '$date' },
                  },
                },
              ],
              recent: [
                { $sort: { date: -1, createdAt: -1 } },
                { $limit: 8 },
                {
                  $project: {
                    amount: 1,
                    date: 1,
                    createdAt: 1,
                    'category.name': 1,
                    'category.icon': 1,
                    'category.color': 1,
                    'category.type': 1,
                  },
                },
              ],
            },
          },
        ]),
        CategoryEntity.find({ userId })
          .select('name type icon color isActive createdAt')
          .lean(),
        RefreshTokenEntity.find({ userId })
          .select('createdAt expiresAt revokedAt')
          .sort({ createdAt: -1 })
          .lean(),
        StatEntity.find({ userId })
          .select('filter createdAt')
          .sort({ createdAt: -1 })
          .lean(),
        UserAiKeyEntity.find({ userId })
          .select('provider createdAt updatedAt')
          .lean(),
      ]);

    // ── Totals by type (all time) ──
    const typeTotals = (type: CategoryTypeEnum) =>
      txFacet.byType.find((t: { _id: string }) => t._id === type) ?? {
        count: 0,
        amount: 0,
      };
    const lifetime = {
      income: typeTotals(CategoryTypeEnum.INCOME).amount as number,
      expense: typeTotals(CategoryTypeEnum.EXPENSE).amount as number,
      investment: typeTotals(CategoryTypeEnum.INVESTMENT).amount as number,
    };

    // ── Monthly trend ──
    type MonthRow = {
      _id: { month: string; type: string };
      amount: number;
      count: number;
    };
    const monthRows: MonthRow[] = txFacet.byMonth;
    const trend = months.map(m => {
      const rows = monthRows.filter(r => r._id.month === m.key);
      const sum = (type: CategoryTypeEnum) =>
        rows.find(r => r._id.type === type)?.amount ?? 0;
      return {
        ...m,
        income: sum(CategoryTypeEnum.INCOME),
        expense: sum(CategoryTypeEnum.EXPENSE),
        investment: sum(CategoryTypeEnum.INVESTMENT),
        transactions: rows.reduce((n, r) => n + r.count, 0),
      };
    });
    const currentMonth = trend[trend.length - 1];
    const activeMonths = trend.filter(m => m.transactions > 0).length;

    // ── Categories with usage ──
    const usage = new Map<
      string,
      { count: number; amount: number; lastDate: Date }
    >(
      txFacet.byCategory.map(
        (c: {
          _id: mongoose.Types.ObjectId;
          count: number;
          amount: number;
          lastDate: Date;
        }) => [String(c._id), c],
      ),
    );
    const categoryRows = categories
      .map(c => {
        const u = usage.get(String(c._id));
        return {
          id: String(c._id),
          name: c.name,
          type: c.type,
          icon: c.icon ?? '',
          color: c.color ?? '#94a3b8',
          isActive: c.isActive !== false,
          transactionCount: u?.count ?? 0,
          amount: u?.amount ?? 0,
          lastUsedAt: toIso(u?.lastDate),
        };
      })
      .sort((a, b) => b.amount - a.amount);

    // ── Sessions ──
    const liveSessions = sessions.filter(
      s => !s.revokedAt && new Date(s.expiresAt) > now,
    );

    const range = txFacet.range[0];

    return {
      /** Reference time for relative dates ("3 days ago") */
      generatedAt: now.getTime(),
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive !== false,
        isOnboarded: user.isFirstLogin !== true,
        signInMethod: hasPassword
          ? LoginMethodEnum.PASSWORD
          : LoginMethodEnum.GOOGLE,
        lastLoginMethod: user.lastLoginMethod ?? null,
        loginCount: user.loginCount ?? 0,
        createdAt: toIso(user.createdAt),
        lastLoginAt: toIso(user.lastLoginAt),
        lastActiveAt: toIso(
          latestDate(
            user.lastActiveAt,
            sessions[0]?.createdAt,
            range?.lastLoggedAt,
          ),
        ),
      },
      profile: {
        gender: (profile?.gender as UserGenderEnum | undefined) ?? null,
        contact: profile?.contact ?? '',
        updatedAt: toIso(profile?.updatedAt),
      },
      activity: {
        transactions: range?.count ?? 0,
        loggedThisMonth: range?.loggedThisMonth ?? 0,
        firstTransactionDate: toIso(range?.firstDate),
        lastTransactionDate: toIso(range?.lastDate),
        firstLoggedAt: toIso(range?.firstLoggedAt),
        lastLoggedAt: toIso(range?.lastLoggedAt),
        activeMonths,
        trendMonths: TREND_MONTHS,
        liveSessions: liveSessions.length,
        countsByType: {
          income: typeTotals(CategoryTypeEnum.INCOME).count as number,
          expense: typeTotals(CategoryTypeEnum.EXPENSE).count as number,
          investment: typeTotals(CategoryTypeEnum.INVESTMENT).count as number,
        },
      },
      thisMonth: {
        income: currentMonth.income,
        expense: currentMonth.expense,
        investment: currentMonth.investment,
      },
      lifetime,
      trend,
      categories: categoryRows,
      recentTransactions: (
        txFacet.recent as {
          _id: mongoose.Types.ObjectId;
          amount: number;
          date: Date;
          createdAt: Date;
          category?: {
            name?: string;
            icon?: string;
            color?: string;
            type?: CategoryTypeEnum;
          };
        }[]
      ).map(t => ({
        id: String(t._id),
        amount: t.amount,
        date: toIso(t.date),
        createdAt: toIso(t.createdAt),
        category: {
          name: t.category?.name ?? 'Deleted category',
          icon: t.category?.icon ?? '',
          color: t.category?.color ?? '#94a3b8',
          type: t.category?.type ?? null,
        },
      })),
      shareLinks: shareLinks.map(s => ({
        id: String(s._id),
        type: s.filter?.type ?? '',
        startDate: toIso(s.filter?.startDate),
        endDate: toIso(s.filter?.endDate),
        year: s.filter?.year ?? null,
        createdAt: toIso(s.createdAt),
      })),
      aiKeys: aiKeys.map(k => ({
        provider: k.provider as string,
        addedAt: toIso(k.createdAt),
        updatedAt: toIso(k.updatedAt),
      })),
    };
  }
}

export type IAdminOverview = Awaited<
  ReturnType<UserInsightsService['getOverview']>
>;
export type IAdminUserRow = Awaited<
  ReturnType<UserInsightsService['listUsers']>
>['data'][number];
export type IAdminUserInsights = NonNullable<
  Awaited<ReturnType<UserInsightsService['getUserInsights']>>
>;
