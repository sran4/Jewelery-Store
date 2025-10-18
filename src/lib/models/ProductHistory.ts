import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductHistory extends Document {
  productId: mongoose.Types.ObjectId;
  version: number;
  changes: any; // Snapshot of the product
  changedBy: mongoose.Types.ObjectId;
  changeType: 'created' | 'updated' | 'deleted';
  changeDescription?: string;
  timestamp: Date;
}

const ProductHistorySchema = new Schema<IProductHistory>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  version: {
    type: Number,
    required: true,
  },
  changes: {
    type: Schema.Types.Mixed,
    required: true,
  },
  changedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  changeType: {
    type: String,
    required: true,
    enum: ['created', 'updated', 'deleted'],
  },
  changeDescription: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
ProductHistorySchema.index({ productId: 1, version: -1 });
ProductHistorySchema.index({ timestamp: -1 });

const ProductHistory: Model<IProductHistory> =
  mongoose.models.ProductHistory ||
  mongoose.model<IProductHistory>('ProductHistory', ProductHistorySchema);

export default ProductHistory;

