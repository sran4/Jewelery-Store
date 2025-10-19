import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSettings extends Document {
  siteName: string;
  siteDescription: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  features: {
    maintenanceMode: boolean;
  };
  promotionalSettings: {
    isActive: boolean;
    message: string;
    showTimer: boolean;
    timerMessage: string;
    saleEndDate?: Date;
  };
  promotionalMessage?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: {
      type: String,
      required: true,
      default: "Shergill Official",
    },
    siteDescription: {
      type: String,
      required: true,
      default: "Premium jewelry collection",
    },
    contactEmail: {
      type: String,
      required: false,
      lowercase: true,
    },
    contactPhone: {
      type: String,
    },
    address: {
      type: String,
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String,
      linkedin: String,
      tiktok: String,
      pinterest: String,
      snapchat: String,
      whatsapp: String,
      telegram: String,
      discord: String,
      reddit: String,
      twitch: String,
      vimeo: String,
      behance: String,
      dribbble: String,
      github: String,
      medium: String,
      clubhouse: String,
    },
    seo: {
      metaTitle: String,
      metaDescription: {
        type: String,
        default:
          "Discover exquisite jewelry pieces including rings, necklaces, bracelets, and earrings.",
      },
      keywords: [
        {
          type: String,
          lowercase: true,
        },
      ],
    },
    features: {
      maintenanceMode: {
        type: Boolean,
        default: false,
      },
    },
    promotionalSettings: {
      isActive: {
        type: Boolean,
        default: true,
      },
      message: {
        type: String,
        default: "🎉 Welcome to Shergill Official!",
        maxlength: 200,
      },
      showTimer: {
        type: Boolean,
        default: false,
      },
      timerMessage: {
        type: String,
        default: "🔥 Sale ends in:",
        maxlength: 100,
      },
      saleEndDate: {
        type: Date,
        default: undefined,
      },
    },
    // Legacy fields for backward compatibility
    promotionalMessage: {
      type: String,
      default:
        "🎉 HUGE SALE! Get up to 70% OFF on selected items - Limited Time Only!",
    },
    phone: String,
    whatsapp: String,
    email: String,
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

let SiteSettings: Model<ISiteSettings>;

try {
  SiteSettings = mongoose.model<ISiteSettings>("SiteSettings");
} catch {
  SiteSettings = mongoose.model<ISiteSettings>(
    "SiteSettings",
    SiteSettingsSchema
  );
}

export default SiteSettings;
