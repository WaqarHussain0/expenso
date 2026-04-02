/* eslint-disable @typescript-eslint/no-explicit-any */
import { initDB } from '@/backend/utils/dbInit.util';
import StatEntity from './entities/stats.entity';
import crypto from 'crypto';

const normalizeFilter = (filter: any) => {
  return {
    type: filter.type,
    ...(filter.startDate && { startDate: new Date(filter.startDate) }),
    ...(filter.endDate && { endDate: new Date(filter.endDate) }),
    ...(filter.year && { year: Number(filter.year) }),
  };
};

export class StatsService {
  private readonly statEntity = StatEntity;

  async createSharedLink(payload: any) {
    const { userId, filter } = payload;

    await initDB();

    const normalizedFilter = normalizeFilter(filter);

    // 🔍 Build explicit query for nested filter fields
    const filterQuery: Record<string, any> = {
      userId,
      'filter.type': normalizedFilter.type,
    };

    if (normalizedFilter.startDate) {
      filterQuery['filter.startDate'] = new Date(normalizedFilter.startDate);
    }
    if (normalizedFilter.endDate) {
      filterQuery['filter.endDate'] = new Date(normalizedFilter.endDate);
    }
    if (normalizedFilter.year !== undefined) {
      filterQuery['filter.year'] = normalizedFilter.year;
    }

    // 🔍 Check if already exists
    const existing = await this.statEntity.findOne(filterQuery);

    if (existing) {
      return `${process.env.NEXTAUTH_URL}share?m=${existing.token}`;
    }

    // 🆕 Create new token
    const token = crypto.randomBytes(32).toString('hex');

    await this.statEntity.create({
      userId,
      filter: normalizedFilter,
      token,
    });

    return `${process.env.NEXTAUTH_URL}share?m=${token}`;
  }

  async getStatsByToken(token: string) {
    await initDB();

    return await this.statEntity
      .findOne({ token })
      .populate({
        path: 'userId',
        select: '_id name email', // populate only relevant fields
      })
      .lean();
  }
}
