# 🗄️ Backend Integration - Product Requirements Document

## 📌 Project Overview

**Goal**: Integrate MongoDB, Cloudinary, and Admin Panel to transform the static jewelry store into a fully dynamic content management system.

**Timeline**: 2-3 weeks  
**Admin Users**: Single admin account  
**Authentication**: JWT + Google OAuth backup  
**Image Storage**: Cloudinary  
**Email**: SendGrid

---

## 🎯 Core Requirements

### ✅ Must-Have Features
- Single admin authentication with Google OAuth backup
- Full CRUD operations for products
- Cloudinary image upload (1-5 images per product, flexible)
- Version history for products
- Contact form email notifications to admin
- Rate limiting on all sensitive endpoints
- Separate admin panel (`/admin` route)
- Facebook Pixel & Google Analytics integration
- CSV import/export for products
- Bulk operations (delete, discount)

### ❌ Out of Scope (For Now)
- Multiple admin users
- Customer accounts
- Product analytics/views tracking
- Draft/published status
- Forgot password feature

---

## 📊 Database Schema Design

### **1. Admin Schema**
```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase),
  passwordHash: String,
  googleId: String (optional, for OAuth),
  name: String,
  role: String (default: "admin"),
  lastLogin: Date,
  loginAttempts: Number (default: 0),
  lockUntil: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### **2. Product Schema**
```javascript
{
  _id: ObjectId,
  id: String (unique, auto-generated),
  sku: String (unique),
  title: String,
  description: String,
  price: Number,
  discountPrice: Number (optional),
  discount: Number (optional),
  category: Enum['rings', 'bracelets', 'necklaces', 'earrings'],
  material: String,
  inStock: Boolean,
  quantityInStock: Number,
  isNew: Boolean,
  isFeatured: Boolean,
  popularityScore: Number,
  images: [{
    url: String,
    publicId: String (Cloudinary ID),
    alt: String,
    order: Number,
    isFeatured: Boolean (main image)
  }],
  rating: Number,
  tags: [String],
  version: Number,
  createdBy: ObjectId (ref: Admin),
  updatedBy: ObjectId (ref: Admin),
  createdAt: Date,
  updatedAt: Date
}
```

### **3. Category Schema**
```javascript
{
  _id: ObjectId,
  id: String,
  name: String,
  slug: String (unique),
  image: {
    url: String,
    publicId: String
  },
  description: String,
  order: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **4. SiteSettings Schema**
```javascript
{
  _id: ObjectId,
  promotionalMessage: String,
  phone: String,
  whatsapp: String,
  email: String,
  address: String,
  socialMedia: {
    facebook: String,
    instagram: String,
    pinterest: String
  },
  seo: {
    metaDescription: String,
    keywords: [String]
  },
  updatedAt: Date,
  updatedBy: ObjectId (ref: Admin)
}
```

### **5. ProductHistory Schema** (Version Control)
```javascript
{
  _id: ObjectId,
  productId: ObjectId (ref: Product),
  version: Number,
  changes: Object (snapshot of product),
  changedBy: ObjectId (ref: Admin),
  changeType: Enum['created', 'updated', 'deleted'],
  timestamp: Date
}
```

### **6. ContactSubmission Schema**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  inquiryType: String,
  message: String,
  status: Enum['new', 'read', 'replied'],
  adminNotes: String,
  submittedAt: Date,
  readAt: Date
}
```

---

## 🗂️ Updated Project Structure

```
jewelery-store/
├── .env.local (git-ignored)
├── .env.example (template)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts
│   │   │   │   ├── login/route.ts
│   │   │   │   └── logout/route.ts
│   │   │   ├── products/
│   │   │   │   ├── route.ts (GET all, POST new)
│   │   │   │   ├── [id]/route.ts (GET, PUT, DELETE)
│   │   │   │   ├── bulk/route.ts
│   │   │   │   └── import/route.ts (CSV)
│   │   │   ├── categories/
│   │   │   │   └── route.ts
│   │   │   ├── settings/
│   │   │   │   └── route.ts
│   │   │   ├── upload/
│   │   │   │   └── route.ts (Cloudinary)
│   │   │   └── contact/
│   │   │       └── route.ts
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx (dashboard)
│   │   │   ├── login/page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx (list)
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── categories/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── contact/page.tsx
│   │   └── (existing public pages)
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── BulkActions.tsx
│   │   │   ├── CSVImporter.tsx
│   │   │   └── PasswordStrength.tsx
│   │   └── (existing components)
│   ├── lib/
│   │   ├── db/
│   │   │   └── mongodb.ts
│   │   ├── models/
│   │   │   ├── Admin.ts
│   │   │   ├── Product.ts
│   │   │   ├── Category.ts
│   │   │   ├── SiteSettings.ts
│   │   │   ├── ProductHistory.ts
│   │   │   └── ContactSubmission.ts
│   │   ├── auth/
│   │   │   ├── jwt.ts
│   │   │   └── password.ts
│   │   ├── cloudinary.ts
│   │   ├── sendgrid.ts
│   │   ├── rateLimit.ts
│   │   └── validation.ts
│   └── middleware.ts (route protection)
```

---

## 📝 Environment Variables Needed

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jewelrystore

# JWT Secret
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=30d

# Admin Credentials (Initial Setup)
ADMIN_EMAIL=admin@luxuryjewelry.com
ADMIN_PASSWORD=YourSecurePassword123!

# Google OAuth (Backup Login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_ADMIN_EMAIL=your-gmail@gmail.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@luxuryjewelry.com
ADMIN_NOTIFICATION_EMAIL=admin@luxuryjewelry.com

# Facebook & Google
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your-pixel-id
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Site
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=another-super-secret-key

# Rate Limiting
RATE_LIMIT_LOGIN=5
RATE_LIMIT_CONTACT=10
```

---

## 🎨 Admin Login Page Design

### Features:
- ✅ Modern glassmorphism design
- ✅ Real-time password strength indicator
- ✅ Live validation messages
- ✅ "Remember me for 30 days" checkbox
- ✅ Google OAuth button as backup
- ✅ Loading states & animations
- ✅ Security indicators (HTTPS badge, encryption notice)

### Password Requirements (Live Validation):
- ✅ Minimum 8 characters (progress bar)
- ✅ One uppercase letter (✓ indicator)
- ✅ One lowercase letter (✓ indicator)
- ✅ One number (✓ indicator)
- ✅ One special character (✓ indicator)
- ✅ Strength meter (Weak/Medium/Strong)

---

## 📸 Image Upload Guidelines for Admin

### **Recommended Specifications:**
- **Format**: JPEG, PNG, WebP
- **File Size**: Maximum 5MB per image
- **Dimensions**: Minimum 1200×1200px (recommended: 2000×2000px for crisp quality)
- **Aspect Ratio**: 1:1 (Square) - enforced by cropper
- **Color Space**: sRGB
- **Resolution**: 72 DPI minimum (for web)
- **Quantity**: 1-5 images per product (flexible)

### **Upload Process:**
1. **Drag & drop** or click to browse (up to 5 images)
2. **Preview** all selected images
3. **Crop/Resize** each image to square (1:1)
4. **Set featured** image (first by default)
5. **Reorder** by drag & drop
6. **Upload** to Cloudinary (with progress bars)
7. **Auto-generate** thumbnails (400x400, 800x800)

### **Quality Optimization:**
- Cloudinary auto-optimization
- WebP conversion for better compression
- Lazy loading on frontend
- CDN delivery

---

## 🔄 **Detailed Task Breakdown**

I'll break this into manageable phases with subtasks. Ready to proceed?

