// POST /api/create — Upload CV + docs, generate D&D character sheet
import { NextResponse } from 'next/server';

export const maxDuration = 120; // Allow up to 2 min for OpenAI calls
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured on server' },
        { status: 500 }
      );
    }

    // Dynamic imports to help with Lambda cold starts
    let extractText, extractImageFromPDF, generateFullSheet;
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

    try {
      const openaiModule = await import('@/lib/openai-chunks');
      generateFullSheet = openaiModule.generateFullSheet;
    } catch (openaiErr) {
      console.error('Failed to load openai-chunks module:', openaiErr);
      return NextResponse.json(
        { error: 'Server module loading error (openai): ' + openaiErr.message },
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

    // Generate the full D&D character sheet via chunked OpenAI calls
    const appData = await generateFullSheet(combinedText);

    // Attach extracted image as avatar if found
    if (extractedImage && appData.characterData) {
      appData.characterData.avatarImage = extractedImage;
    }

    return NextResponse.json({ success: true, data: appData });
  } catch (err) {
    console.error('Create error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate character sheet' },
      { status: 500 }
    );
  }
}
