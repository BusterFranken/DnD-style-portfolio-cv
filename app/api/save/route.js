// POST /api/save — Save a generated sheet to the database
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

function getClientIP(request) {
  const headersList = headers();
  return (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    request.ip ||
    'unknown'
  );
}

export async function POST(request) {
  try {
    const { nanoid } = await import('nanoid');

    const body = await request.json();

    if (!body.data || !body.data.characterData) {
      return NextResponse.json(
        { error: 'Invalid data: must include characterData' },
        { status: 400 }
      );
    }

    const name = body.data.characterData.personal?.name || 'Unknown Adventurer';
    const title = body.data.characterData.personal?.title || '';
    const slug = nanoid(10);
    const creatorIp = getClientIP(request);

    const db = getDB();
    const result = await db.saveSheet(slug, name, title, body.data, creatorIp);

    return NextResponse.json({
      success: true,
      slug: result.slug,
      createdAt: result.createdAt,
    });
  } catch (err) {
    console.error('Save error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to save sheet' },
      { status: 500 }
    );
  }
}
