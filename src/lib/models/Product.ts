import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductImage {
  url: string;
  publicId?: string;
  alt?: string;
  order?: number;
  isFeatured?: boolean;
}

export interface IProduct extends Document {
  id?: string;
  sku: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  discount?: number;
  category: string; // Dynamic category slug from database
  material?: string;
  inStock: boolean;
  quantityInStock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  popularityScore?: number;
  images: (string | IProductImage)[]; // Can be string array OR object array
  rating?: number;
  tags?: string[];
  version: number;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: false, // Optional - not all images have publicId
  },
  alt: {
    type: String,
  },
  order: {
    type: Number,
    required: false,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
});

const ProductSchema = new Schema<IProduct>(
  {
    id: {
      type: String,
      required: false, // Will be auto-generated
      unique: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (this: IProduct, value: number) {
          return value < this.price;
        },
        message: "Discount price must be less than regular price",
      },
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },
    category: {
      type: String,
      required: true,
      // Category slug from database - no enum restriction
    },
    material: {
      type: String,
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    quantityInStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    popularityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    images: {
      type: Schema.Types.Mixed, // Accept both string[] and object[]
      required: false,
      default: [],
      validate: {
        validator: function (images: any) {
          if (!Array.isArray(images)) return false;
          return images.length >= 0 && images.length <= 5; // Allow 0-5 images
        },
        message: "Product must have between 0 and 5 images",
      },
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    version: {
      type: Number,
      default: 1,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

// Indexes for performance (sku and id indexes are automatically created by unique: true)
ProductSchema.index({ category: 1 });
ProductSchema.index({ inStock: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ isNew: 1 });
ProductSchema.index({ title: "text", description: "text", tags: "text" });

// Auto-calculate discount percentage before save
ProductSchema.pre("save", function (next) {
  if (this.price && this.discountPrice) {
    this.discount = Math.round(
      ((this.price - this.discountPrice) / this.price) * 100
    );
  }
  next();
});

// Auto-generate ID if not provided
ProductSchema.pre("save", function (next) {
  console.log("Pre-save hook running, current id:", this.id);
  if (!this.id) {
    this.id = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log("Generated new id:", this.id);
  }
  next();
});

// Ensure at least one featured image (only for object arrays)
ProductSchema.pre("save", function (next) {
  if (this.images && this.images.length > 0) {
    // Check if images are objects (not strings)
    if (typeof this.images[0] === "object" && this.images[0] !== null) {
      const hasFeatured = this.images.some((img: any) => img.isFeatured);
      if (!hasFeatured && this.images[0]) {
        (this.images[0] as any).isFeatured = true;
      }
    }
  }
  next();
});

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
