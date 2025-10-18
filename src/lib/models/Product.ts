import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductImage {
  url: string;
  publicId: string;
  alt?: string;
  order: number;
  isFeatured: boolean;
}

export interface IProduct extends Document {
  id: string;
  sku: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  discount?: number;
  category: 'rings' | 'bracelets' | 'necklaces' | 'earrings';
  material?: string;
  inStock: boolean;
  quantityInStock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  popularityScore?: number;
  images: IProductImage[]; // Flexible 1-5 images
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
    required: true,
  },
  alt: {
    type: String,
  },
  order: {
    type: Number,
    required: true,
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
      required: true,
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
        validator: function(this: IProduct, value: number) {
          return value < this.price;
        },
        message: 'Discount price must be less than regular price',
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
      enum: ['rings', 'bracelets', 'necklaces', 'earrings'],
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
      type: [ProductImageSchema],
      required: true,
      validate: {
        validator: function(images: IProductImage[]) {
          return images.length >= 1 && images.length <= 5;
        },
        message: 'Product must have between 1 and 5 images',
      },
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    tags: [{
      type: String,
      lowercase: true,
      trim: true,
    }],
    version: {
      type: Number,
      default: 1,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
ProductSchema.index({ category: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ id: 1 });
ProductSchema.index({ inStock: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ isNew: 1 });
ProductSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Auto-calculate discount percentage before save
ProductSchema.pre('save', function(next) {
  if (this.price && this.discountPrice) {
    this.discount = Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  next();
});

// Auto-generate ID if not provided
ProductSchema.pre('save', function(next) {
  if (!this.id) {
    this.id = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Ensure at least one featured image
ProductSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    const hasFeatured = this.images.some(img => img.isFeatured);
    if (!hasFeatured) {
      this.images[0].isFeatured = true;
    }
  }
  next();
});

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;

