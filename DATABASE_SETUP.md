# 🗄️ Database Setup Guide

Quick guide to populate your MongoDB database with sample products and categories.

## 🚀 Quick Start (3 Steps)

### Step 1: Configure Environment Variables

Make sure your `.env.local` file has these variables:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Step 2: Clear Existing Data

```bash
npm run db:clear
```

This will prompt you for confirmation before deleting all products and categories.

### Step 3: Seed Sample Data

```bash
npm run db:seed
```

This will:

- Load 5 products and 4 categories from `src/data/products.json`
- Download all images from external URLs
- Upload images to your Cloudinary account
- Save everything to MongoDB

**Time:** ~2-3 minutes

---

## 📝 Available Commands

| Command               | Description                        |
| --------------------- | ---------------------------------- |
| `npm run db:clear`    | Delete all products and categories |
| `npm run db:seed`     | Populate database with sample data |
| `npm run db:reset`    | Clear + Seed in one command        |
| `npm run admin:reset` | Reset admin credentials            |

---

## 🎯 What You'll Get

After running `npm run db:seed`:

### 4 Categories

- 💍 **Rings** - Elegant rings for every occasion
- 📿 **Bracelets** - Beautiful bracelets to adorn your wrist
- 👑 **Necklaces** - Stunning necklaces for a perfect look
- 💎 **Earrings** - Dazzling earrings for any style

### 5 Products

1. **Elegant Diamond Ring** - $2,999.99 (20% off)
2. **Pearl Necklace** - $799.99
3. **Gold Charm Bracelet** - $1,499.99 (70% off)
4. **Diamond Stud Earrings** - $1,899.99
5. **Sapphire Pendant** - $1,299.99 (15% off)

### ~24 Images

- 4 category images
- 20 product images (4 per product)
- All uploaded to Cloudinary
- Optimized for web (max 1000x1000)

---

## 🔄 Complete Setup Flow

```bash
# 1. Install dependencies (if not done)
npm install

# 2. Configure .env.local
# Add MongoDB and Cloudinary credentials

# 3. Reset admin credentials (optional)
npm run admin:reset

# 4. Clear and seed database
npm run db:reset

# 5. Start development server
npm run dev
```

---

## ✅ Verification

After seeding, verify everything works:

### 1. Check MongoDB

- Go to [MongoDB Atlas](https://cloud.mongodb.com)
- Browse Collections
- Should see `products` (5 docs) and `categories` (4 docs)

### 2. Check Cloudinary

- Go to [Cloudinary Dashboard](https://cloudinary.com/console)
- Media Library
- Should see `products/` and `categories/` folders with images

### 3. Check Frontend

```bash
npm run dev
```

Visit these pages:

- **Home**: http://localhost:3000 (should show products)
- **Products**: http://localhost:3000/products (should show 5 products)
- **Admin**: http://localhost:3000/admin/products (should show admin dashboard)

---

## 🎨 Sample Data Structure

### Category Example

```json
{
  "id": "rings",
  "name": "Rings",
  "slug": "rings",
  "image": "https://res.cloudinary.com/your-cloud/...",
  "description": "Elegant rings for every occasion",
  "isActive": true
}
```

### Product Example

```json
{
  "id": "prod_001",
  "sku": "RNG-GLD-001",
  "title": "Elegant Diamond Ring",
  "description": "Exquisite 18K yellow gold ring...",
  "price": 2999.99,
  "discountPrice": 2399.99,
  "discount": 20,
  "category": "rings",
  "material": "18K Gold",
  "inStock": true,
  "quantityInStock": 5,
  "isNew": true,
  "isFeatured": true,
  "images": [
    {
      "url": "https://res.cloudinary.com/your-cloud/...",
      "publicId": "products/...",
      "alt": "Elegant Diamond Ring",
      "order": 0,
      "isFeatured": true
    }
  ],
  "rating": 4.8,
  "tags": ["diamond", "luxury", "wedding"]
}
```

---

## 🔧 Customization

Want to seed different data?

### Edit Data Source

Modify `src/data/products.json` with your own products and categories.

### Change Quantity

Edit `scripts/seed-data.js`:

```javascript
const NUM_PRODUCTS = 5; // Change to any number
const NUM_CATEGORIES = 4; // Change to any number
```

Then run:

```bash
npm run db:reset
```

---

## 🐛 Troubleshooting

### "MONGODB_URI not found"

**Fix**: Add `MONGODB_URI` to `.env.local`

### "Cloudinary credentials not found"

**Fix**: Add all 3 Cloudinary variables to `.env.local`

### "E11000 duplicate key error"

**Fix**: Run `npm run db:clear` first to remove existing data

### "Failed to download image"

**Fix**: Check internet connection. Script will continue with other images.

### "Cloudinary upload failed"

**Fix**:

1. Verify credentials in `.env.local`
2. Check Cloudinary dashboard for quota
3. Ensure API key has upload permissions

---

## 💡 Pro Tips

### 1. Quick Reset

Use the combined command to clear and seed in one go:

```bash
npm run db:reset
```

### 2. Fresh Start Every Day

During development, start fresh each day:

```bash
npm run db:reset && npm run dev
```

### 3. Custom NPM Scripts

Add your own shortcuts to `package.json`:

```json
"scripts": {
  "fresh-start": "npm run db:reset && npm run dev",
  "deploy-prep": "npm run build && npm run db:seed"
}
```

### 4. Backup Before Clearing

MongoDB Atlas has automatic backups, but for safety:

- Export data before clearing
- Test seed scripts in development first
- Never run in production!

---

## 📊 Expected Output

### Clear Command

```
🗑️  DATABASE CLEANUP SCRIPT
================================================
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

### Seed Command

```
🌱 STARTING DATA SEED PROCESS
================================================
✅ Connected to MongoDB
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

---

## 🎉 Success!

Once complete, your app will have:

- ✅ Real database-driven content
- ✅ Product listings with images
- ✅ Category navigation
- ✅ Search functionality
- ✅ Admin dashboard with data
- ✅ Fully functional frontend

**Time to build something amazing! 🚀**

---

## 📚 More Information

For detailed documentation, see:

- `scripts/README.md` - Detailed script documentation
- `SETUP_GUIDES.md` - Complete setup guide
- `ENV_TEMPLATE.txt` - Environment variables reference

## 🆘 Need Help?

If you're stuck:

1. Check error messages carefully
2. Verify all environment variables
3. Read the troubleshooting section
4. Check `scripts/README.md` for details
