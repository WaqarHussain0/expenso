import { sendEmail } from '@/lib/email.util';
import { after, NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    after(async () => {
      // User gets response instantly — email fires in background
      await sendEmail({
        to: body?.email,
        subject: 'Welcome aboard!',
        html: '<p>Thanks for signing up!</p>',
      });
    });

    // Response fires immediately — none of the above blocks the user
    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error || 'Something went wrong' },
      { status: 400 },
    );
  }
};
