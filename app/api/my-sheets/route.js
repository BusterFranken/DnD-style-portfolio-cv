// GET /api/my-sheets — List sheets created by the current user (by IP)
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

function getClientIP() {
  const headersList = headers();
  return (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown'
  );
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
    return NextResponse.json(
      { error: err.message || 'Failed to list your sheets' },
      { status: 500 }
    );
  }
}
