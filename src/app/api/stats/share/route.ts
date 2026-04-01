/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { StatsService } from '@/backend/modules/stats/stats.service';

enum FilterOptionEnum {
  MONTH = 'month',
  YEAR = 'year',
  CUSTOM = 'custom',
}

const statsService = new StatsService();
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { startDate, endDate, year, type, userId } = body;

    const payload: any = {
      userId: new mongoose.Types.ObjectId(userId),
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
};
