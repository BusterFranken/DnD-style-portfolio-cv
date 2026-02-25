// Debug endpoint to check which env vars are available (remove after debugging)
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    openAIKeyLength: process.env.OPENAI_API_KEY?.length || 0,
    dbMode: process.env.DB_MODE || 'not set',
    dynamoTable: process.env.DYNAMODB_TABLE || 'not set',
    dynamoRegion: process.env.DYNAMODB_REGION || 'not set',
    nodeEnv: process.env.NODE_ENV,
  });
}
