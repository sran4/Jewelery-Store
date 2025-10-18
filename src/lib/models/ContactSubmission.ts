import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  adminNotes?: string;
  submittedAt: Date;
  readAt?: Date;
  ipAddress?: string;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    inquiryType: {
      type: String,
      required: true,
      enum: [
        'General Inquiry',
        'Product Question',
        'Custom Order',
        'Repair Service',
        'Return/Exchange',
        'Other',
      ],
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'new',
      enum: ['new', 'read', 'replied'],
    },
    adminNotes: {
      type: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    readAt: {
      type: Date,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ContactSubmissionSchema.index({ status: 1 });
ContactSubmissionSchema.index({ submittedAt: -1 });
ContactSubmissionSchema.index({ email: 1 });

const ContactSubmission: Model<IContactSubmission> =
  mongoose.models.ContactSubmission ||
  mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);

export default ContactSubmission;

