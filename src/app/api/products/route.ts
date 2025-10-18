import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';
import ProductHistory from '@/lib/models/ProductHistory';
import { productSchema } from '@/lib/validation';
import { rateLimitAPI } from '@/lib/rateLimit';

// GET all products (PUBLIC)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('inStock');
    const search = searchParams.get('search');

    await connectDB();

    let query: any = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (inStock === 'true') {
      query.inStock = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const products = await Product.find(query)
      .sort({ popularityScore: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error: any) {
    console.error('Get Products Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST new product (ADMIN ONLY)
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limiting
    const rateLimit = rateLimitAPI((session.user as any).id);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate product data
    const validation = productSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    await connectDB();

    // Create product
    const product = await Product.create({
      ...validation.data,
      createdBy: (session.user as any).id,
      updatedBy: (session.user as any).id,
    });

    // Create history entry
    await ProductHistory.create({
      productId: product._id,
      version: 1,
      changes: product.toObject(),
      changedBy: (session.user as any).id,
      changeType: 'created',
      changeDescription: 'Product created',
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error: any) {
    console.error('Create Product Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

