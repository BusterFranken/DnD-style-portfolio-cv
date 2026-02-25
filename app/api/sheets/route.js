// GET /api/sheets — List all public sheets (for gallery/timeline)
import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const db = getDB();
    const sheets = await db.listSheets(limit, offset);

    return NextResponse.json({ sheets });
  } catch (err) {
    console.error('List sheets error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to list sheets' },
      { status: 500 }
    );
  }
}
