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

    // 🔍 Check if already exists
    const existing = await this.statEntity.findOne({
      userId,
      'filter.type': normalizedFilter.type,
      'filter.startDate': normalizedFilter.startDate,
      'filter.endDate': normalizedFilter.endDate,
      'filter.year': normalizedFilter.year,
    });

    if (existing) {
      return `${process.env.NEXTAUTH_URL}/stats/share?m=${existing.token}`;
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

    return await this.statEntity.findOne({ token })
    .populate('userId', '_id name email')
    .lean();
  }
}
