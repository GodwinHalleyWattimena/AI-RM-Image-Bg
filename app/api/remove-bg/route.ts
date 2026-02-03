
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(image.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB to be safe, though remove.bg supports up to 12MB usually)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (image.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Max 10MB allowed.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      console.error('REMOVE_BG_API_KEY is missing');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Prepare FormData for external API
    // STRATEGY: Try 'full' resolution first to maintain original quality (requires credits).
    // If that fails (402), fall back to 'preview' (free tier).
    // 'type=person' acts as a hint to the AI to focus on human subjects (hair, face).

    const tryRemoveBg = async (size: 'full' | 'preview') => {
      const formData = new FormData();
      formData.append('image_file', image);
      formData.append('format', 'png');
      formData.append('type', 'person'); // Explicitly look for people details
      formData.append('semitransparency', 'true'); // Enhance hair/glass details
      formData.append('size', size);

      return fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': apiKey },
        body: formData,
      });
    };

    // Attempt 1: Full HD
    let response = await tryRemoveBg('full');

    // Attempt 2: Fallback to Preview if Payment Required (402)
    if (response.status === 402) {
      console.warn('Insufficient credits for HD, falling back to preview quality.');
      response = await tryRemoveBg('preview');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Remove.bg API Error:', response.status, errorText);
      let errorMessage = 'Failed to process image';
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.errors && errorJson.errors.length > 0) {
          errorMessage = errorJson.errors[0].title;
        }
      } catch (e) {
        // keep default message
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();

    // Return image directly or as base64? 
    // Returning base64 JSON is easier for frontend handling in some cases, 
    // but returning binary blob is more efficient. 
    // Let's return base64 JSON to keep it simple for the frontend state management 
    // and matching the "tulis logika untuk mengirimkan data... dan menerima hasilnya dalam bentuk base64" requirement.

    const base64 = Buffer.from(imageBuffer).toString('base64');
    const mimeType = 'image/png'; // Remove.bg result is usually PNG
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({ result: dataUrl });

  } catch (error) {
    console.error('Internal API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
