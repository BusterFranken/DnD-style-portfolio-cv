// GET /api/job/[jobId] — Poll job status
// POST /api/job/[jobId] — Process the job (called internally or by cron)
import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // Allow up to 2 min for processing

// GET - Poll job status
export async function GET(request, { params }) {
  try {
    const { jobId } = params;
    const db = getDB();
    const job = await db.getJob(jobId);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Return job status
    return NextResponse.json({
      jobId: job.jobId,
      status: job.status,
      result: job.result,
      error: job.error,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    });

  } catch (err) {
    console.error('Job status error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to get job status' },
      { status: 500 }
    );
  }
}

// POST - Process the job (trigger generation)
export async function POST(request, { params }) {
  try {
    const { jobId } = params;
    const db = getDB();
    const job = await db.getJob(jobId);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Only process pending jobs
    if (job.status !== 'pending') {
      return NextResponse.json({
        jobId: job.jobId,
        status: job.status,
        message: 'Job already processed or processing',
      });
    }

    // Mark as processing
    await db.updateJobStatus(jobId, 'processing');

    // Load OpenAI module
    let generateFullSheet;
    try {
      const openaiModule = await import('@/lib/openai-chunks');
      generateFullSheet = openaiModule.generateFullSheet;
    } catch (openaiErr) {
      await db.updateJobStatus(jobId, 'failed', null, 'Failed to load OpenAI module: ' + openaiErr.message);
      return NextResponse.json(
        { error: 'Server module loading error' },
        { status: 500 }
      );
    }

    // Generate the character sheet
    try {
      const appData = await generateFullSheet(job.cvText);
      
      // Save result
      await db.updateJobStatus(jobId, 'complete', appData);

      return NextResponse.json({
        jobId,
        status: 'complete',
        result: appData,
      });

    } catch (genErr) {
      console.error('Generation error:', genErr);
      await db.updateJobStatus(jobId, 'failed', null, genErr.message || 'Generation failed');
      return NextResponse.json(
        { error: genErr.message || 'Generation failed' },
        { status: 500 }
      );
    }

  } catch (err) {
    console.error('Job process error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process job' },
      { status: 500 }
    );
  }
}
