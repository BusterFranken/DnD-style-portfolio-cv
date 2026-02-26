// GET /api/my-sheets — List sheets created by the current user (by IP)
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

function getClientIP() {
  const headersList = headers();
  // CloudFront/Amplify uses various headers for client IP
  const ip = (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    headersList.get('cf-connecting-ip') ||
    headersList.get('x-client-ip') ||
    'unknown'
  );
  console.log('my-sheets: detected IP =', ip);
  return ip;
}

export async function GET() {
  try {
    const ip = getClientIP();

    if (!ip || ip === 'unknown') {
      return NextResponse.json({ sheets: [] });
    }

    const db = getDB();
    const sheets = await db.listSheetsByIP(ip, 20);

    return NextResponse.json({ sheets });
  } catch (err) {
    console.error('My sheets error:', err);
    // Return empty array instead of error - DynamoDB table may not exist yet
    if (err.name === 'ResourceNotFoundException') {
      return NextResponse.json({ sheets: [], warning: 'Database not configured' });
    }
    return NextResponse.json(
      { error: err.message || 'Failed to list your sheets' },
      { status: 500 }
    );
  }
}
