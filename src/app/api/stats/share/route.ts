/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { StatsService } from '@/backend/modules/stats/stats.service';
import { withAuth } from '@/backend/utils/guard/withAuth';

enum FilterOptionEnum {
  MONTH = 'month',
  YEAR = 'year',
  CUSTOM = 'custom',
}

const statsService = new StatsService();
export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    const body = await req.json();
    const userMonogoObjectId = new mongoose.Types.ObjectId(user.id);

    const { startDate, endDate, year, type } = body;

    const payload: any = {
      userId: userMonogoObjectId,
      filter: { type, startDate, endDate },
    };

    switch (type) {
      case FilterOptionEnum.MONTH: {
        if (!startDate || !endDate) {
          throw new Error(
            'startDate and endDate are required for month filter',
          );
        }

        break;
      }

      case FilterOptionEnum.YEAR: {
        if (!year) {
          throw new Error('year is required for year filter');
        }

        break;
      }

      case FilterOptionEnum.CUSTOM: {
        if (!endDate || !startDate) {
          throw new Error('endDate, startDate, are required for custom filter');
        }

        break;
      }

      default:
        throw new Error(`Invalid filterBy value: ${type}`);
    }

    const shareableLink = await statsService.createSharedLink(payload);

    return NextResponse.json(
      {
        url: shareableLink,
        message: 'Stats share link created successfully',
        success: true,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Error creating category:', error);

    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 400 },
    );
  }
});
