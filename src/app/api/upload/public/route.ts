import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, folder } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    // Check if Cloudinary credentials are configured
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log('Cloudinary config check:', {
      hasCloudName: !!cloudName,
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
    });

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Cloudinary not configured. Please set CLOUDINARY credentials in environment variables.' },
        { status: 500 }
      );
    }

    // Dynamic import to avoid build-time issues
    const { v2: cloudinary } = await import('cloudinary');
    
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    console.log('Attempting Cloudinary upload...');

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: folder ? `jewelry-store/${folder}` : 'jewelry-store',
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    console.log('Upload successful:', uploadResponse.secure_url);

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    });
  } catch (error: any) {
    console.error('Upload Error Details:', {
      message: error.message,
      error: error.error,
      http_code: error.http_code,
    });
    return NextResponse.json(
      { 
        error: error.message || error.error?.message || 'Failed to upload image',
        details: error.http_code ? `HTTP ${error.http_code}` : undefined,
      },
      { status: 500 }
    );
  }
}


