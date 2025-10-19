import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  id: string;
  name: string;
  slug: string;
  image?: string; // Optional - simple string URL
  description?: string; // Optional
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    id: {
      type: String,
      required: false, // Auto-generated if not provided
      unique: true,
      sparse: true, // Allows multiple null values
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
      required: false, // Optional image URL
    },
    description: {
      type: String,
      required: false, // Optional description
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes (slug index is automatically created by unique: true)
CategorySchema.index({ order: 1 });
CategorySchema.index({ isActive: 1 });

// Auto-generate ID if not provided
CategorySchema.pre("save", function (next) {
  if (!this.id) {
    this.id = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
