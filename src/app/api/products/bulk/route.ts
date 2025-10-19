import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import connectDB from '@/lib/db/mongodb';
import Product from '@/lib/models/Product';
import ProductHistory from '@/lib/models/ProductHistory';
import { deleteMultipleImages } from '@/lib/cloudinary';

// POST bulk operations
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, productIds, data } = body;

    if (!action || !productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: 'Invalid request. Action and productIds are required' },
        { status: 400 }
      );
    }

    await connectDB();

    let result;

    switch (action) {
      case 'delete':
        // Get products to delete their images
        const productsToDelete = await Product.find({ id: { $in: productIds } });
        
        // Collect all image public IDs
        const allPublicIds: string[] = [];
        for (const product of productsToDelete) {
          const ids = product.images.map((img) => img.publicId).filter(Boolean);
          allPublicIds.push(...ids);
        }

        // Delete images from Cloudinary
        if (allPublicIds.length > 0) {
          await deleteMultipleImages(allPublicIds);
        }

        // Create history entries
        for (const product of productsToDelete) {
          await ProductHistory.create({
            productId: product._id,
            version: product.version + 1,
            changes: product.toObject(),
            changedBy: (session.user as any).id,
            changeType: 'deleted',
            changeDescription: 'Bulk delete operation',
          });
        }

        // Delete products
        result = await Product.deleteMany({ id: { $in: productIds } });
        break;

      case 'discount':
        if (!data?.discountPercentage) {
          return NextResponse.json(
            { error: 'Discount percentage is required' },
            { status: 400 }
          );
        }

        const products = await Product.find({ id: { $in: productIds } });
        
        for (const product of products) {
          const discountPrice = product.price * (1 - data.discountPercentage / 100);
          product.discountPrice = Math.round(discountPrice * 100) / 100;
          product.discount = data.discountPercentage;
          product.updatedBy = (session.user as any).id;
          product.version += 1;
          await product.save();

          // Create history
          await ProductHistory.create({
            productId: product._id,
            version: product.version,
            changes: product.toObject(),
            changedBy: (session.user as any).id,
            changeType: 'updated',
            changeDescription: `Bulk discount: ${data.discountPercentage}% applied`,
          });
        }

        result = { modifiedCount: products.length };
        break;

      case 'category':
        if (!data?.category) {
          return NextResponse.json(
            { error: 'Category is required' },
            { status: 400 }
          );
        }

        result = await Product.updateMany(
          { id: { $in: productIds } },
          {
            $set: { category: data.category },
            $inc: { version: 1 },
          }
        );
        break;

      case 'stock':
        if (typeof data?.inStock !== 'boolean') {
          return NextResponse.json(
            { error: 'Stock status is required' },
            { status: 400 }
          );
        }

        result = await Product.updateMany(
          { id: { $in: productIds } },
          {
            $set: { inStock: data.inStock },
            $inc: { version: 1 },
          }
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Bulk ${action} completed successfully`,
      result,
    });
  } catch (error: any) {
    console.error('Bulk Operation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Bulk operation failed' },
      { status: 500 }
    );
  }
}

