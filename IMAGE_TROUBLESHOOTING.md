# 🖼️ Image Display Troubleshooting Guide

If images are not displaying on your frontend, follow this guide to diagnose and fix the issue.

---

## ✅ **Image Utilities Created**

I've created `src/lib/imageUtils.ts` to handle both image formats:

- **String URLs**: Direct image URLs (from JSON or external sources)
- **Image Objects**: Cloudinary uploads with `{ url, publicId }`

---

## 🔍 **Common Image Issues & Fixes**

### **Issue 1: Images Not Showing at All**

**Possible Causes:**

1. **Database is Empty**

   ```bash
   # Check if you've seeded the database
   # Run this to populate:
   npm run db:reset
   ```

2. **Image URLs are Objects, Not Strings**

   - ✅ **FIXED**: All components now use `imageUtils` helper functions
   - These functions extract URLs from both string and object formats

3. **CORS or Domain Not Allowed**
   - Check `next.config.js` has correct domains
   - Currently allowed: Unsplash, Cloudinary, Picsum

---

### **Issue 2: Some Images Show, Others Don't**

**Possible Causes:**

1. **Mixed Image Formats in Database**

   - Some products have string URLs
   - Some have Cloudinary objects
   - ✅ **FIXED**: `imageUtils` handles both formats

2. **Invalid Image URLs**

   - Check browser console for 404 errors
   - Verify URLs are accessible

3. **Missing Images Field**
   - Products without images show placeholder
   - ✅ **FIXED**: Fallback to Unsplash placeholder image

---

### **Issue 3: Categories Have No Images**

**Possible Causes:**

1. **Categories Not Seeded**

   ```bash
   npm run db:seed  # This uploads category images to Cloudinary
   ```

2. **Image Field Empty in Database**
   - ✅ **FIXED**: Fallback placeholder if `category.image` is empty
   - Check admin panel to add images manually

---

## 🛠️ **Verification Steps**

### **Step 1: Check if Database Has Data**

Open browser console and run:

```javascript
fetch("/api/products")
  .then((r) => r.json())
  .then((d) => console.log("Products:", d));

fetch("/api/categories")
  .then((r) => r.json())
  .then((d) => console.log("Categories:", d));
```

**Expected Output:**

```json
{
  "success": true,
  "products": [
    {
      "id": "prod_001",
      "images": [
        { "url": "https://res.cloudinary.com/...", "publicId": "..." }
        // OR
        "https://images.unsplash.com/..."
      ]
    }
  ]
}
```

---

### **Step 2: Check Image URLs**

If you see products but no images:

1. **Open Browser DevTools** (F12)
2. **Go to Console tab**
3. **Look for errors** like:
   - `Failed to load image: 403 Forbidden`
   - `Invalid src prop on Image`
   - `Hostname not configured`

---

### **Step 3: Check Next.js Config**

**File:** `next.config.js`

Make sure it includes your image domains:

```javascript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "images.unsplash.com", // For JSON seed data
    },
    {
      protocol: "https",
      hostname: "res.cloudinary.com", // For uploaded images
    },
  ],
}
```

**If you change this file, restart the dev server:**

```bash
# Kill the server (Ctrl+C)
npm run dev
```

---

## 🔧 **Manual Fixes**

### **Fix 1: Seed the Database**

If your database is empty:

```bash
# Clear and seed fresh data
npm run db:reset

# This will:
# - Create 4 categories with images
# - Create 5 products with images
# - Upload all images to Cloudinary
```

**Wait ~2-3 minutes** for images to download and upload.

---

### **Fix 2: Add Images Manually**

If seed script fails or you want custom images:

1. **Go to Admin Panel**: http://localhost:3000/admin/products
2. **Create/Edit Product**
3. **Upload Images**: Use the image uploader (max 5 images)
4. **Save**: Images will be uploaded to Cloudinary

---

### **Fix 3: Verify Cloudinary Credentials**

Check `.env.local` has:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Test Cloudinary connection:**

1. Go to http://localhost:3000/admin/products/new
2. Try uploading an image
3. Check if it uploads successfully

---

## 📊 **Image Data Formats Supported**

### **Format 1: String URL (JSON data)**

```json
{
  "images": [
    "https://images.unsplash.com/photo-123.jpg",
    "https://images.unsplash.com/photo-456.jpg"
  ]
}
```

### **Format 2: Cloudinary Object (Uploaded)**

```json
{
  "images": [
    {
      "url": "https://res.cloudinary.com/your-cloud/image/upload/v123/products/abc.jpg",
      "publicId": "products/abc",
      "alt": "Product Name",
      "order": 0,
      "isFeatured": true
    }
  ]
}
```

### **Format 3: Mixed (Both)**

```json
{
  "images": [
    {
      "url": "https://res.cloudinary.com/...",
      "publicId": "products/abc"
    },
    "https://images.unsplash.com/photo-123.jpg"
  ]
}
```

**✅ All formats are supported!**

---

## 🎯 **Component-Specific Checks**

### **ProductCard (Product Listings)**

**How it works:**

```typescript
import { getFirstImageUrl } from "@/lib/imageUtils";

<Image src={getFirstImageUrl(product.images)} />;
```

**Handles:**

- ✅ String arrays
- ✅ Object arrays
- ✅ Empty arrays (shows placeholder)
- ✅ Undefined/null (shows placeholder)

---

### **ImageGallery (Product Detail Page)**

**How it works:**

```typescript
import { getAllImageUrls } from "@/lib/imageUtils";

<ImageGallery images={getAllImageUrls(product.images)} />;
```

**Handles:**

- ✅ Converts all images to string URLs
- ✅ Works with mixed formats
- ✅ Shows placeholder if no images

---

### **CategoryCards (Home Page)**

**How it works:**

```typescript
<Image src={category.image || "fallback-url"} />
```

**Handles:**

- ✅ String URLs from database
- ✅ Fallback if image is empty

---

## 🐛 **Common Errors & Solutions**

### **Error: "Invalid src prop"**

**Cause:** Image URL is `undefined`, `null`, or empty string

**Solution:**

- ✅ Already fixed with `imageUtils` helper
- Falls back to placeholder image

---

### **Error: "Hostname not configured"**

**Cause:** Image domain not in `next.config.js`

**Solution:**
Add the domain to `next.config.js`:

```javascript
remotePatterns: [
  {
    protocol: "https",
    hostname: "your-image-domain.com",
  },
];
```

Restart dev server after changes.

---

### **Error: "Failed to load resource: 403 Forbidden"**

**Cause:** Image URL requires authentication or is hotlink-protected

**Solution:**

- Upload images to Cloudinary instead
- Use admin panel to upload images
- Images will be stored in your Cloudinary account

---

### **Error: "Image doesn't exist (404)"**

**Cause:** Image was deleted from Cloudinary or URL is broken

**Solution:**

1. Re-upload image via admin panel
2. Or update product with new image URL
3. Placeholder will show until fixed

---

## 🚀 **Testing Image Display**

### **Test 1: Check Browser Console**

1. Open DevTools (F12)
2. Go to Console tab
3. Look for image-related errors
4. Check Network tab for failed image requests

---

### **Test 2: Check Database Content**

Open browser console and run:

```javascript
// Check product images
fetch("/api/products")
  .then((r) => r.json())
  .then((d) => {
    console.log("First product images:", d.products[0]?.images);
  });

// Check category images
fetch("/api/categories")
  .then((r) => r.json())
  .then((d) => {
    console.log(
      "Categories:",
      d.categories.map((c) => ({
        name: c.name,
        image: c.image,
      }))
    );
  });
```

**What to look for:**

- Products should have `images` array (string or object)
- Categories should have `image` string

---

### **Test 3: Check Image URLs Directly**

Copy an image URL from the API response and paste it in your browser:

- **Should load**: Image displays
- **Should fail**: 404, 403, or other error

---

## ✅ **Expected Behavior**

After seeding the database:

### **Products:**

- ✅ 4 images per product
- ✅ Images uploaded to Cloudinary
- ✅ URLs like: `https://res.cloudinary.com/your-cloud/...`
- ✅ Stored as objects: `{ url, publicId, alt, order, isFeatured }`

### **Categories:**

- ✅ 1 image per category
- ✅ Images uploaded to Cloudinary
- ✅ URLs like: `https://res.cloudinary.com/your-cloud/...`
- ✅ Stored as string: `"https://..."`

### **Fallbacks:**

- ✅ Placeholder image if no images exist
- ✅ No broken image icons
- ✅ Graceful error handling

---

## 💡 **Quick Fixes**

### **Fix 1: Fresh Start**

```bash
# Clear database and re-seed
npm run db:reset

# Wait 2-3 minutes for images to upload
# Then check frontend
```

### **Fix 2: Check Current Data**

```bash
# Check what's in your database
# Open browser console on any page:
fetch('/api/products').then(r=>r.json()).then(console.log)
```

### **Fix 3: Manual Upload**

```bash
# If seed fails, manually add via admin:
# 1. Go to http://localhost:3000/admin/products/new
# 2. Fill form and upload images
# 3. Save product
```

---

## 📞 **Still Not Working?**

If images still don't display:

1. **Share the Error:**

   - Open browser console (F12)
   - Copy any red error messages
   - Share the error text

2. **Share API Response:**

   ```javascript
   // Run in browser console:
   fetch("/api/products")
     .then((r) => r.json())
     .then((d) => console.log(JSON.stringify(d.products[0], null, 2)));
   ```

   - Copy the output
   - Share the `images` field structure

3. **Check Seed Script:**
   - Did `npm run db:seed` complete successfully?
   - Were there any error messages?
   - Did it say "Images uploaded: X/Y"?

---

## 🎯 **Summary**

**All image handling is now robust:**

- ✅ Supports string URLs
- ✅ Supports Cloudinary objects
- ✅ Supports mixed formats
- ✅ Fallback placeholders
- ✅ Error handling
- ✅ Loading states

**Your images should display correctly after seeding the database!** 🎉
