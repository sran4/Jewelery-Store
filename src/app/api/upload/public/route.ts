import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('📤 PUBLIC UPLOAD ENDPOINT CALLED');
  
  try {
    const body = await request.json();
    const { image, folder } = body;

    console.log('Request received:', {
      hasImage: !!image,
      imageLength: image?.length || 0,
      folder: folder,
    });

    if (!image) {
      console.error('❌ No image in request');
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    // Check if Cloudinary credentials are configured
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log('🔑 Cloudinary config check:', {
      hasCloudName: !!cloudName,
      cloudName: cloudName,
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      hasApiSecret: !!apiSecret,
      apiSecretLength: apiSecret?.length || 0,
    });

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('❌ Missing Cloudinary credentials');
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

    console.log('✅ Cloudinary configured, attempting upload...');

    // Upload to Cloudinary
    const targetFolder = folder ? `jewelry-store/${folder}` : 'jewelry-store';
    console.log('📁 Uploading to folder:', targetFolder);
    
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: targetFolder,
      resource_type: 'image',
      allowed_formats: ['jpg', 'png', 'webp', 'gif', 'jpeg'],
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    console.log('✅ Upload successful!', {
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      format: uploadResponse.format,
      width: uploadResponse.width,
      height: uploadResponse.height,
    });

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    });
  } catch (error: any) {
    console.error('❌ UPLOAD ERROR:', {
      message: error.message,
      name: error.name,
      http_code: error.http_code,
      error: error.error,
      stack: error.stack?.split('\n')[0],
    });
    
    return NextResponse.json(
      { 
        error: error.message || error.error?.message || 'Failed to upload image',
        details: error.http_code ? `HTTP ${error.http_code}` : undefined,
        cloudinaryError: error.error?.message || undefined,
      },
      { status: error.http_code === 401 ? 401 : 500 }
    );
  }
}



