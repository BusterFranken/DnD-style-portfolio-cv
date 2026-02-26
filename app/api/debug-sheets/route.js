// GET /api/debug-sheets — Debug endpoint to check IP detection and sheets
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const headersList = headers();
    
    // Get all relevant headers
    const relevantHeaders = {
      'x-forwarded-for': headersList.get('x-forwarded-for'),
      'x-real-ip': headersList.get('x-real-ip'),
      'cf-connecting-ip': headersList.get('cf-connecting-ip'),
      'x-client-ip': headersList.get('x-client-ip'),
    };
    
    // Compute detected IP
    const detectedIP = (
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headersList.get('x-real-ip') ||
      headersList.get('cf-connecting-ip') ||
      headersList.get('x-client-ip') ||
      'unknown'
    );
    
    // Try to get sheets for this IP
    const db = getDB();
    let sheetsByIP = [];
    let allSheets = [];
    let error = null;
    
    try {
      sheetsByIP = await db.listSheetsByIP(detectedIP, 10);
      allSheets = await db.listSheets(10);
    } catch (e) {
      error = e.message;
    }
    
    return NextResponse.json({
      detectedIP,
      relevantHeaders,
      sheetsByIP,
      allSheets,
      error,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
