# Database Seeding Scripts

This directory contains scripts to populate your MongoDB database with sample data from the JSON file and upload images to Cloudinary.

## 📋 Prerequisites

Before running these scripts, ensure you have:

1. **Environment Variables** (`.env.local`):

   ```env
   # MongoDB
   MONGODB_URI=mongodb+srv://your-connection-string

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

2. **Dependencies Installed**:
   ```bash
   npm install
   ```

## 🚀 Quick Start

### Option 1: Fresh Start (Recommended)

```bash
# Step 1: Clear existing data
node scripts/clear-database.js

# Step 2: Seed new data
node scripts/seed-data.js
```

### Option 2: Seed Only (Append Mode)

```bash
# Add data to existing database
node scripts/seed-data.js
```

## 📜 Available Scripts

### 1. `clear-database.js` - Clear Database

Removes all products and categories from MongoDB.

**Usage:**

```bash
node scripts/clear-database.js
```

**Features:**

- ✅ Prompts for confirmation before deleting
- ✅ Shows current database state
- ✅ Safe - won't delete if database is empty
- ✅ Detailed logging

**Output Example:**

```
🗑️  DATABASE CLEANUP SCRIPT
================================================
🔌 Connecting to MongoDB...
✅ Connected to MongoDB

📊 Current Database State:
   - Products: 5
   - Categories: 4

⚠️  WARNING: This will DELETE ALL products and categories!
❓ Are you sure you want to continue? (y/N): y

🗑️  Deleting data...
   ✅ Deleted 5 products
   ✅ Deleted 4 categories

✅ DATABASE CLEARED SUCCESSFULLY!
```

---

### 2. `seed-data.js` - Populate Database

Loads sample data from `src/data/products.json` into MongoDB and Cloudinary.

**Usage:**

```bash
node scripts/seed-data.js
```

**What It Does:**

1. 📖 Reads first 5 products and 4 categories from JSON file
2. ⬇️ Downloads images from external URLs (Unsplash)
3. ⬆️ Uploads images to YOUR Cloudinary account
4. 💾 Saves products and categories to MongoDB
5. 🧹 Cleans up temporary files

**Features:**

- ✅ Automatic image download and upload
- ✅ Image optimization (max 1000x1000, auto quality)
- ✅ Organized Cloudinary folders (`products/`, `categories/`)
- ✅ Detailed progress logging
- ✅ Error handling for failed uploads
- ✅ Auto-cleanup of temp files

**Output Example:**

```
🌱 STARTING DATA SEED PROCESS
================================================
🔌 Connecting to MongoDB...
✅ Connected to MongoDB

📖 Loading data from products.json...
✅ Loaded 4 categories and 5 products

📂 SEEDING CATEGORIES
================================================
[1/4] Processing: Rings
   ⬇️  Downloading image 1...
   ⬆️  Uploading to Cloudinary...
   ✅ Image 1 uploaded successfully
   ✅ Category created: Rings
...

📦 SEEDING PRODUCTS
================================================
[1/5] Processing: Elegant Diamond Ring
   ⬇️  Downloading image 1...
   ⬆️  Uploading to Cloudinary...
   ✅ Image 1 uploaded successfully
   ...
   ✅ Product created: Elegant Diamond Ring
   📸 Images uploaded: 4/4
...

🎉 SEED PROCESS COMPLETED!
================================================
✅ Categories created: 4/4
✅ Products created: 5/5

📊 Summary:
   - Total images uploaded to Cloudinary: ~24
   - Database: MongoDB
   - Image Storage: Cloudinary

✨ Your database is now populated with sample data!
🚀 Start your app with: npm run dev
```

## 📁 File Structure

```
scripts/
├── README.md              # This file
├── clear-database.js      # Clear database script
├── seed-data.js          # Seed data script
├── reset-admin.js        # Reset admin credentials
└── temp/                 # Temporary image storage (auto-created/deleted)
```

## 🎯 What Data Gets Seeded?

### Categories (4)

- Rings
- Bracelets
- Necklaces
- Earrings

Each category includes:

- Name, slug, description
- Image (uploaded to Cloudinary)
- Active status

### Products (5)

- First 5 products from `src/data/products.json`

Each product includes:

- Title, SKU, description
- Pricing (regular + discount)
- Category, material
- Stock information
- Images (4 per product, uploaded to Cloudinary)
- Rating, popularity score
- Tags (searchable)
- New/Featured flags

## 🔧 Configuration

You can modify these constants in `seed-data.js`:

```javascript
const NUM_PRODUCTS = 5; // Number of products to seed
const NUM_CATEGORIES = 4; // Number of categories to seed
```

## ⚠️ Important Notes

1. **Cloudinary Free Tier**:

   - Free tier includes 25 GB storage and 25 GB bandwidth
   - ~24 images will use minimal space
   - Images are optimized to reduce size

2. **MongoDB Atlas Free Tier**:

   - Free tier includes 512 MB storage
   - Sample data uses ~1-2 MB

3. **Image Processing**:

   - Images are downloaded to `scripts/temp/` folder
   - Temporary files are auto-deleted after upload
   - If script fails, temp files are cleaned up

4. **Unique Constraints**:

   - SKU must be unique per product
   - Slug must be unique per category
   - Running seed twice may cause duplicate errors

5. **Time to Complete**:
   - Clearing database: ~5 seconds
   - Seeding data: ~2-3 minutes (depends on internet speed)
   - Total images to upload: ~24 (4 categories + 20 product images)

## 🐛 Troubleshooting

### Error: "MONGODB_URI not found"

**Solution**: Make sure `.env.local` has `MONGODB_URI` set

### Error: "Cloudinary credentials not found"

**Solution**: Add all 3 Cloudinary variables to `.env.local`:

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Error: "E11000 duplicate key error"

**Solution**: Clear database first with `clear-database.js`

### Error: "Failed to download image"

**Solution**:

- Check internet connection
- Unsplash URLs may be temporarily unavailable
- Script will continue with other images

### Error: "Cloudinary upload failed"

**Solution**:

- Verify Cloudinary credentials
- Check Cloudinary dashboard for quota limits
- Ensure API key has upload permissions

## 📊 Verifying Seeded Data

After running the seed script:

1. **Check MongoDB**:

   - Go to MongoDB Atlas Dashboard
   - Browse Collections
   - Should see `products` and `categories` collections

2. **Check Cloudinary**:

   - Go to Cloudinary Dashboard
   - Media Library
   - Should see `products/` and `categories/` folders

3. **Check Frontend**:
   ```bash
   npm run dev
   ```
   - Visit `http://localhost:3000`
   - Should see 5 products with images
   - Visit `http://localhost:3000/admin/products`
   - Should see admin dashboard with products

## 🔄 Re-seeding Data

To start fresh:

```bash
# Clear everything
node scripts/clear-database.js

# Seed again
node scripts/seed-data.js
```

## 💡 Tips

1. **First Time Setup**: Always clear database first to avoid duplicates
2. **Testing**: Use seed scripts to quickly populate test data
3. **Development**: Keep JSON file updated with your preferred sample data
4. **Production**: Don't run these scripts in production!

## 🎉 Success Criteria

After successful seeding, you should see:

- ✅ 4 categories in MongoDB
- ✅ 5 products in MongoDB
- ✅ ~24 images in Cloudinary
- ✅ Products visible on frontend
- ✅ Categories working in navigation
- ✅ Admin dashboard showing all data

## 📞 Need Help?

If you encounter issues:

1. Check the error messages in console
2. Verify all environment variables
3. Ensure MongoDB and Cloudinary are accessible
4. Check the troubleshooting section above
