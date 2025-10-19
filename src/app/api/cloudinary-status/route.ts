import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({
        success: false,
        error: 'Missing Cloudinary credentials',
        config: {
          hasCloudName: !!cloudName,
          hasApiKey: !!apiKey,
          hasApiSecret: !!apiSecret,
        }
      }, { status: 400 });
    }

    // Dynamic import to avoid build-time issues
    const { v2: cloudinary } = await import('cloudinary');
    
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // Test connection and get account info
    const pingResult = await cloudinary.api.ping();
    
    if (pingResult.status !== 'ok') {
      return NextResponse.json({
        success: false,
        error: 'Cloudinary ping failed',
        pingResult
      }, { status: 500 });
    }

    // Get usage statistics
    const usage = await cloudinary.api.usage();
    
    // Get account details
    const account = await cloudinary.api.account();

    return NextResponse.json({
      success: true,
      message: 'Cloudinary is working!',
      account: {
        cloud_name: account.cloud_name,
        plan: account.plan,
        created_at: account.created_at,
        updated_at: account.updated_at,
      },
      usage: {
        plan: usage.plan,
        objects: usage.objects,
        bandwidth: usage.bandwidth,
        storage: usage.storage,
        requests: usage.requests,
        resources: usage.resources,
        derived_resources: usage.derived_resources,
        transformations: usage.transformations,
        video: usage.video,
        credits: usage.credits,
      },
      limits: {
        // Free plan limits
        max_objects: usage.plan === 'free' ? 25000 : 'unlimited',
        max_bandwidth: usage.plan === 'free' ? 25000 : 'unlimited',
        max_storage: usage.plan === 'free' ? 25 : 'unlimited',
        max_requests: usage.plan === 'free' ? 25000 : 'unlimited',
        max_transformations: usage.plan === 'free' ? 25000 : 'unlimited',
      }
    });

  } catch (error: any) {
    console.error('Cloudinary Status Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to check Cloudinary status',
      details: {
        name: error.name,
        http_code: error.http_code,
        error: error.error,
      }
    }, { status: 500 });
  }
}
