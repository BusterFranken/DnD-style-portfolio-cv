// Debug endpoint to check which env vars are available (remove after debugging)
import { NextResponse } from 'next/server';

export async function GET() {
  const key = process.env.OPENAI_API_KEY || '';
  return NextResponse.json({
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    openAIKeyLength: key.length,
    // First 8 chars only — identifies key type (sk-proj / sk-...) without exposing it.
    openAIKeyPrefix: key.slice(0, 8),
    // Whitespace in a pasted key is a common failure — flag it.
    openAIKeyHasWhitespace: /\s/.test(key),
    // LLM endpoint/model overrides (non-secret): these decide where requests go.
    llmBaseUrl: process.env.LLM_BASE_URL || 'not set (default OpenAI)',
    llmModel: process.env.LLM_MODEL || 'not set (default gpt-4o-mini)',
    hasDatabaseUrl: !!(process.env.DATABASE_URL || process.env.POSTGRES_URL),
    dbMode: process.env.DB_MODE || 'not set',
    nodeEnv: process.env.NODE_ENV,
  });
}
