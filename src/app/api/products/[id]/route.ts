import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/models/Product";
import ProductHistory from "@/lib/models/ProductHistory";
import { productSchema } from "@/lib/validation";
import { deleteMultipleImages } from "@/lib/cloudinary";

// GET single product (PUBLIC)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    await connectDB();

    const product = await Product.findOne({ id }).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error: any) {
    console.error("Get Product Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT update product (ADMIN ONLY)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validate product data
    const validation = productSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      );
    }

    await connectDB();

    // Find existing product
    const existingProduct = await Product.findOne({ id });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update product
    const updatedProduct = await Product.findOneAndUpdate(
      { id },
      {
        ...validation.data,
        updatedBy: (session.user as any).id,
        $inc: { version: 1 },
      },
      { new: true }
    );

    // Create history entry
    await ProductHistory.create({
      productId: updatedProduct!._id,
      version: updatedProduct!.version,
      changes: updatedProduct!.toObject(),
      changedBy: (session.user as any).id,
      changeType: "updated",
      changeDescription: "Product updated",
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error("Update Product Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE product (ADMIN ONLY)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const product = await Product.findOne({ id });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete images from Cloudinary (only if they have publicIds)
    const publicIds = product.images
      .filter(
        (img): img is { publicId: string } =>
          typeof img === "object" &&
          img !== null &&
          "publicId" in img &&
          !!img.publicId
      )
      .map((img) => img.publicId);

    if (publicIds.length > 0) {
      try {
        await deleteMultipleImages(publicIds);
      } catch (error) {
        console.error("Failed to delete images from Cloudinary:", error);
        // Continue with product deletion even if image deletion fails
      }
    }

    // Create history entry before deletion
    await ProductHistory.create({
      productId: product._id,
      version: product.version + 1,
      changes: product.toObject(),
      changedBy: (session.user as any).id,
      changeType: "deleted",
      changeDescription: "Product deleted",
    });

    // Delete product
    await Product.deleteOne({ id });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete Product Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
