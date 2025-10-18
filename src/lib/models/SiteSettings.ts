import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSettings extends Document {
  promotionalMessage: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    pinterest?: string;
    twitter?: string;
  };
  seo: {
    metaDescription: string;
    keywords: string[];
  };
  updatedBy?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    promotionalMessage: {
      type: String,
      required: true,
      default: '🎉 HUGE SALE! Get up to 70% OFF on selected items - Limited Time Only!',
    },
    phone: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: true,
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      pinterest: String,
      twitter: String,
    },
    seo: {
      metaDescription: {
        type: String,
        default: 'Discover exquisite jewelry pieces including rings, necklaces, bracelets, and earrings.',
      },
      keywords: [{
        type: String,
        lowercase: true,
      }],
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

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;

