// GET /api/sheets/:slug — Get a specific sheet by slug
import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
    }

    const db = getDB();
    const sheet = await db.getSheet(slug);

    if (!sheet) {
      return NextResponse.json({ error: 'Sheet not found' }, { status: 404 });
    }

    return NextResponse.json({
      slug: sheet.slug,
      name: sheet.name,
      title: sheet.title,
      data: sheet.data,
      createdAt: sheet.createdAt,
    });
  } catch (err) {
    console.error('Get sheet error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to get sheet' },
      { status: 500 }
    );
  }
}
