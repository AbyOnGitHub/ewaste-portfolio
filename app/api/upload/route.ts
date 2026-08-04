import { NextResponse } from 'next/server';

/**
 * Route handler for generating signed client upload URLs or handling direct media uploads for Vercel Blob.
 * Environment Variable: process.env.BLOB_READ_WRITE_TOKEN
 */
export async function POST(request: Request) {
  try {
    const { filename, contentType } = await request.json();

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      return NextResponse.json(
        {
          message: 'Vercel Blob token not configured. Local mock upload mode active.',
          url: null,
          mock: true,
        },
        { status: 200 }
      );
    }

    // Serverless signed upload handling stub
    return NextResponse.json({
      success: true,
      message: 'Ready for client upload to Vercel Blob',
      filename,
      contentType,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
