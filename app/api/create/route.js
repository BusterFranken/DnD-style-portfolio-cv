// POST /api/create — Upload CV, start background job, return jobId
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { nanoid } from 'nanoid';
import { getDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

function getClientIP() {
  const headersList = headers();
  // CloudFront/Amplify uses various headers for client IP
  return (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    headersList.get('cf-connecting-ip') ||
    headersList.get('x-client-ip') ||
    'unknown'
  );
}

// GET handler for debugging
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/create',
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    keyLength: process.env.OPENAI_API_KEY?.length || 0,
  });
}

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured on server' },
        { status: 500 }
      );
    }

    // Dynamic import for PDF parsing
    let extractText, extractImageFromPDF;
    try {
      const pdfModule = await import('@/lib/parse-pdf');
      extractText = pdfModule.extractText;
      extractImageFromPDF = pdfModule.extractImageFromPDF;
    } catch (pdfErr) {
      console.error('Failed to load parse-pdf module:', pdfErr);
      return NextResponse.json(
        { error: 'Server module loading error (pdf): ' + pdfErr.message },
        { status: 500 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded. Please upload at least a CV.' },
        { status: 400 }
      );
    }

    // Extract text and attempt to extract a profile image from uploaded files
    let combinedText = '';
    let extractedImage = null;

    for (const file of files) {
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = (file.name || '').toLowerCase().split('.').pop();

        // Extract text
        const text = await extractText(buffer, file.name);
        if (text) {
          combinedText += `\n\n--- ${file.name} ---\n${text}`;
        }

        // Try to extract profile image from PDFs
        if (ext === 'pdf' && !extractedImage) {
          try {
            extractedImage = await extractImageFromPDF(buffer);
          } catch (imgErr) {
            console.warn('Image extraction failed:', imgErr.message);
          }
        }

        // If the uploaded file is an image itself, use it as the avatar
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) && !extractedImage) {
          const mimeMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp' };
          const mime = mimeMap[ext] || 'image/png';
          extractedImage = `data:${mime};base64,${buffer.toString('base64')}`;
        }
      }
    }

    if (!combinedText.trim()) {
      return NextResponse.json(
        { error: 'Could not extract any text from uploaded files.' },
        { status: 400 }
      );
    }

    // Trim to reasonable size (avoid token limits)
    if (combinedText.length > 30000) {
      combinedText = combinedText.substring(0, 30000) + '\n\n[Text truncated...]';
    }

    // Create a job and return immediately
    const jobId = nanoid(12);
    const creatorIp = getClientIP();
    const db = getDB();

    // Store the job with CV text (we'll also store the image reference)
    await db.createJob(jobId, combinedText, creatorIp);

    // Store extracted image in a temporary way (include in job data)
    if (extractedImage) {
      // We'll pass it via a separate update or include in cvText as metadata
      // For simplicity, we'll re-extract on processing or skip image for now
    }

    // Return the jobId immediately - client will poll for results
    return NextResponse.json({ 
      success: true, 
      jobId,
      message: 'Job started. Poll /api/job/{jobId} for status.',
    });

  } catch (err) {
    console.error('Create error:', err);
    const errorMsg = err.message || err.toString() || 'Unknown error';
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
