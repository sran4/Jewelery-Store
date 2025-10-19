import { NextResponse } from 'next/server';

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: [],
    summary: '',
    recommendation: '',
  };

  try {
    // TEST 1: Check Environment Variables
    console.log('🧪 TEST 1: Checking environment variables...');
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const envTest = {
      name: 'Environment Variables',
      status: 'unknown',
      details: {
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: cloudName ? '✅ Set' : '❌ Missing',
        CLOUDINARY_API_KEY: apiKey ? '✅ Set' : '❌ Missing',
        CLOUDINARY_API_SECRET: apiSecret ? '✅ Set' : '❌ Missing',
        cloudName: cloudName,
        apiKeyLength: apiKey?.length || 0,
        apiSecretLength: apiSecret?.length || 0,
      }
    };

    if (!cloudName || !apiKey || !apiSecret) {
      envTest.status = '❌ FAILED';
      results.tests.push(envTest);
      results.summary = 'Missing environment variables';
      results.recommendation = 'Add CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to Vercel environment variables';
      return NextResponse.json(results, { status: 500 });
    }

    envTest.status = '✅ PASSED';
    results.tests.push(envTest);

    // Dynamic import
    const { v2: cloudinary } = await import('cloudinary');
    
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // TEST 2: Ping Cloudinary API
    console.log('🧪 TEST 2: Pinging Cloudinary API...');
    const pingTest: any = {
      name: 'API Connection',
      status: 'unknown',
      details: {}
    };

    try {
      const pingResult = await cloudinary.api.ping();
      pingTest.status = pingResult.status === 'ok' ? '✅ PASSED' : '❌ FAILED';
      pingTest.details = pingResult;
    } catch (pingError: any) {
      pingTest.status = '❌ FAILED';
      pingTest.details = {
        error: pingError.message,
        http_code: pingError.http_code,
        name: pingError.name,
      };
      
      if (pingError.http_code === 401) {
        results.summary = 'Invalid Cloudinary credentials';
        results.recommendation = 'Your API Key or API Secret is incorrect. Please verify them in your Cloudinary dashboard (Settings → Access Keys) and update in Vercel.';
      }
    }
    results.tests.push(pingTest);

    if (pingTest.status === '❌ FAILED') {
      return NextResponse.json(results, { status: 500 });
    }

    // TEST 3: Get Account Details
    console.log('🧪 TEST 3: Fetching account details...');
    const accountTest: any = {
      name: 'Account Status',
      status: 'unknown',
      details: {}
    };

    try {
      const account = await cloudinary.api.account();
      accountTest.status = '✅ PASSED';
      accountTest.details = {
        cloud_name: account.cloud_name,
        plan: account.plan,
        created_at: account.created_at,
        updated_at: account.updated_at,
      };
    } catch (accountError: any) {
      accountTest.status = '⚠️ WARNING';
      accountTest.details = {
        error: accountError.message,
        http_code: accountError.http_code,
      };
    }
    results.tests.push(accountTest);

    // TEST 4: Check Usage & Quotas
    console.log('🧪 TEST 4: Checking usage and quotas...');
    const quotaTest: any = {
      name: 'Usage & Quotas',
      status: 'unknown',
      details: {}
    };

    try {
      const usage = await cloudinary.api.usage();
      
      const usagePercentage = {
        storage: usage.storage?.used_percent || 0,
        bandwidth: usage.bandwidth?.used_percent || 0,
        transformations: usage.transformations?.used_percent || 0,
        requests: usage.requests?.used_percent || 0,
      };

      quotaTest.details = {
        plan: usage.plan,
        storage: {
          used: usage.storage?.usage || 0,
          limit: usage.storage?.limit || 'unlimited',
          used_percent: usagePercentage.storage,
          unit: usage.storage?.unit || 'MB',
        },
        bandwidth: {
          used: usage.bandwidth?.usage || 0,
          limit: usage.bandwidth?.limit || 'unlimited',
          used_percent: usagePercentage.bandwidth,
          unit: usage.bandwidth?.unit || 'MB',
        },
        transformations: {
          used: usage.transformations?.usage || 0,
          limit: usage.transformations?.limit || 'unlimited',
          used_percent: usagePercentage.transformations,
        },
        requests: {
          used: usage.requests?.usage || 0,
          limit: usage.requests?.limit || 'unlimited',
          used_percent: usagePercentage.requests,
        },
        resources: usage.resources,
        derived_resources: usage.derived_resources,
      };

      // Check if any quota is exceeded
      const overQuota = Object.values(usagePercentage).some((percent) => percent >= 100);
      
      if (overQuota) {
        quotaTest.status = '❌ FAILED';
        results.summary = 'Cloudinary quota exceeded';
        results.recommendation = 'You have exceeded your Cloudinary free tier limits. Please upgrade your plan or delete old images to free up space.';
      } else if (Object.values(usagePercentage).some((percent) => percent >= 80)) {
        quotaTest.status = '⚠️ WARNING';
        results.summary = 'Approaching quota limits';
        results.recommendation = 'You are approaching your Cloudinary limits. Consider upgrading or cleaning up unused images.';
      } else {
        quotaTest.status = '✅ PASSED';
      }
    } catch (usageError: any) {
      quotaTest.status = '⚠️ WARNING';
      quotaTest.details = {
        error: usageError.message,
        http_code: usageError.http_code,
      };
    }
    results.tests.push(quotaTest);

    // TEST 5: Test Upload (Small dummy image)
    console.log('🧪 TEST 5: Testing upload with dummy image...');
    const uploadTest: any = {
      name: 'Upload Test',
      status: 'unknown',
      details: {}
    };

    try {
      // Create a tiny 1x1 transparent PNG (base64)
      const dummyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      
      const uploadResult = await cloudinary.uploader.upload(dummyImage, {
        folder: 'jewelry-store/diagnostics',
        resource_type: 'image',
        public_id: `test-${Date.now()}`,
      });

      uploadTest.status = '✅ PASSED';
      uploadTest.details = {
        message: 'Upload successful!',
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
      };

      // Clean up test image
      try {
        await cloudinary.uploader.destroy(uploadResult.public_id);
        uploadTest.details.cleanup = 'Test image deleted';
      } catch (cleanupError) {
        uploadTest.details.cleanup = 'Could not delete test image';
      }

    } catch (uploadError: any) {
      uploadTest.status = '❌ FAILED';
      uploadTest.details = {
        error: uploadError.message,
        http_code: uploadError.http_code,
        error_code: uploadError.error?.code,
        error_message: uploadError.error?.message,
      };

      if (uploadError.http_code === 401) {
        results.summary = 'Upload failed: Invalid credentials';
        results.recommendation = 'The API Key or API Secret is incorrect. Go to Cloudinary Dashboard → Settings → Access Keys and copy the correct values to Vercel environment variables.';
      } else if (uploadError.http_code === 403) {
        results.summary = 'Upload failed: Permission denied';
        results.recommendation = 'Your Cloudinary account does not have permission to upload. Check if your account is suspended or has billing issues.';
      } else {
        results.summary = `Upload failed: ${uploadError.message}`;
        results.recommendation = 'Check the error details and Cloudinary account status.';
      }
    }
    results.tests.push(uploadTest);

    // Final Summary
    if (!results.summary) {
      const allPassed = results.tests.every((test: any) => test.status === '✅ PASSED');
      if (allPassed) {
        results.summary = '✅ All tests passed! Cloudinary is working correctly.';
        results.recommendation = 'If you are still experiencing upload issues in your app, the problem is likely in your application code, not with Cloudinary.';
      } else {
        results.summary = '⚠️ Some tests failed or have warnings';
        results.recommendation = 'Review the test results above for specific issues.';
      }
    }

    return NextResponse.json(results);

  } catch (error: any) {
    console.error('Diagnostic Error:', error);
    
    results.summary = '❌ Diagnostic failed';
    results.recommendation = 'An unexpected error occurred during diagnostics.';
    results.error = {
      message: error.message,
      name: error.name,
      stack: error.stack?.split('\n').slice(0, 3),
    };

    return NextResponse.json(results, { status: 500 });
  }
}

