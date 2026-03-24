/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionService } from '@/backend/modules/transaction/transaction.service';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/backend/utils/guard/withAuth';
import mongoose from 'mongoose';

const transactionService = new TransactionService();

enum FilterOptionEnum {
  MONTH = 'month',
  YEAR = 'year',
  CUSTOM = 'custom',
}

export const POST = withAuth(async (req: NextRequest, user) => {
  try {
    const userMonogoObjectId = new mongoose.Types.ObjectId(user.id);

    // Parse JSON body
    const body = await req.json();
    const { startDate, endDate, year } = body;

    let response;

    // ✅ normalize query param
    const filterBy =
      req.nextUrl.searchParams.get('filterBy')?.toLowerCase() ||
      FilterOptionEnum.MONTH;

    switch (filterBy) {
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
        throw new Error(`Invalid filterBy value: ${filterBy}`);
    }

    if (filterBy === FilterOptionEnum.MONTH) {
      response = await transactionService.getMonthlyDashboardData(
        new Date(startDate),
        new Date(endDate),
        userMonogoObjectId,
      );
    }

    if (filterBy === FilterOptionEnum.YEAR) {
      response = await transactionService.getYearlyDashboardData(
        userMonogoObjectId,
        Number(year),
      );
    }

    if (filterBy === FilterOptionEnum.CUSTOM) {
      response = await transactionService.getCustomDateDashboardData(
        userMonogoObjectId,
        startDate,
        endDate,
      );
    }

    return NextResponse.json(
      {
        response,
        message: 'Dashboard data',
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
