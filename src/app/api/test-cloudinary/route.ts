import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const config = {
      cloudName: cloudName ? '✅ Set' : '❌ Missing',
      apiKey: apiKey ? '✅ Set' : '❌ Missing',
      apiSecret: apiSecret ? '✅ Set' : '❌ Missing',
      cloudNameValue: cloudName || 'NOT SET',
      apiKeyLength: apiKey ? apiKey.length : 0,
    };

    console.log('Cloudinary Configuration Test:', config);

    // Test Cloudinary API connection
    if (cloudName && apiKey && apiSecret) {
      try {
        const { v2: cloudinary } = await import('cloudinary');
        
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
        });

        // Try to get account info
        const result = await cloudinary.api.ping();
        
        return NextResponse.json({
          success: true,
          message: 'Cloudinary is properly configured! ✅',
          config: config,
          connectionTest: 'Ping successful',
          cloudName: cloudName,
        });
      } catch (error: any) {
        return NextResponse.json({
          success: false,
          message: 'Cloudinary credentials are set but connection failed',
          config: config,
          error: error.message,
          errorDetails: error.error?.message || 'Unknown error',
        }, { status: 500 });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: 'Cloudinary credentials are missing',
        config: config,
        instructions: 'Please set CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, and NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in Vercel environment variables',
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

