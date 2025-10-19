/**
 * Seed Script - Load Sample Data from JSON to MongoDB & Cloudinary
 *
 * This script:
 * 1. Reads products and categories from src/data/products.json
 * 2. Downloads images from external URLs
 * 3. Uploads images to your Cloudinary account
 * 4. Saves products and categories to MongoDB
 *
 * Prerequisites:
 * - MongoDB connection string in .env.local
 * - Cloudinary credentials in .env.local
 * - Run: node scripts/seed-data.js
 */

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

// ============================================
// Configuration
// ============================================

const MONGODB_URI = process.env.MONGODB_URI;
const NUM_PRODUCTS = 5; // First 5 products
const NUM_CATEGORIES = 4; // First 4 categories (excluding "all")

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ============================================
// Mongoose Schemas
// ============================================

const CategorySchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    slug: { type: String, unique: true },
    image: String,
    description: String,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    id: String,
    sku: { type: String, unique: true },
    title: String,
    description: String,
    price: Number,
    discountPrice: Number,
    discount: Number,
    category: String,
    material: String,
    inStock: Boolean,
    quantityInStock: Number,
    isNew: Boolean,
    isFeatured: Boolean,
    popularityScore: Number,
    images: mongoose.Schema.Types.Mixed,
    rating: Number,
    tags: [String],
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

// ============================================
// Helper Functions
// ============================================

/**
 * Download image from URL to temporary file
 */
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(filepath);

    protocol
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`));
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          resolve(filepath);
        });
      })
      .on("error", (err) => {
        fs.unlink(filepath, () => {}); // Delete file on error
        reject(err);
      });
  });
}

/**
 * Upload image to Cloudinary
 */
async function uploadToCloudinary(filepath, folder) {
  try {
    const result = await cloudinary.uploader.upload(filepath, {
      folder: folder,
      resource_type: "image",
      transformation: [
        { quality: "auto", fetch_format: "auto" },
        { width: 1000, height: 1000, crop: "limit" },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    throw error;
  }
}

/**
 * Process image: download from URL and upload to Cloudinary
 */
async function processImage(imageUrl, folder, index) {
  const tempDir = path.join(__dirname, "temp");

  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const tempFile = path.join(tempDir, `temp_${Date.now()}_${index}.jpg`);

  try {
    console.log(`   ⬇️  Downloading image ${index + 1}...`);
    await downloadImage(imageUrl, tempFile);

    console.log(`   ⬆️  Uploading to Cloudinary...`);
    const cloudinaryData = await uploadToCloudinary(tempFile, folder);

    // Clean up temp file
    fs.unlinkSync(tempFile);

    console.log(`   ✅ Image ${index + 1} uploaded successfully`);
    return cloudinaryData;
  } catch (error) {
    console.error(`   ❌ Failed to process image ${index + 1}:`, error.message);
    // Clean up temp file if it exists
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    return null;
  }
}

/**
 * Load and parse JSON data
 */
function loadJsonData() {
  const jsonPath = path.join(__dirname, "..", "src", "data", "products.json");
  const rawData = fs.readFileSync(jsonPath, "utf8");
  return JSON.parse(rawData);
}

/**
 * Seed Categories
 */
async function seedCategories(categories) {
  console.log("\n📂 SEEDING CATEGORIES");
  console.log("=".repeat(50));

  const seededCategories = [];

  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    console.log(`\n[${i + 1}/${categories.length}] Processing: ${cat.name}`);

    try {
      // Process category image
      let categoryImage = cat.image;

      if (cat.image && cat.image.startsWith("http")) {
        const cloudinaryData = await processImage(cat.image, "categories", i);
        if (cloudinaryData) {
          categoryImage = cloudinaryData.url;
        }
      }

      // Create category in MongoDB
      const categoryData = {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: categoryImage,
        description: cat.description || "",
        order: i,
        isActive: true,
      };

      const category = await Category.create(categoryData);
      seededCategories.push(category);

      console.log(`   ✅ Category created: ${cat.name}`);
    } catch (error) {
      console.error(
        `   ❌ Failed to create category ${cat.name}:`,
        error.message
      );
    }
  }

  return seededCategories;
}

/**
 * Seed Products
 */
async function seedProducts(products) {
  console.log("\n📦 SEEDING PRODUCTS");
  console.log("=".repeat(50));

  const seededProducts = [];

  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    console.log(`\n[${i + 1}/${products.length}] Processing: ${prod.title}`);

    try {
      // Process product images
      const processedImages = [];

      if (prod.images && Array.isArray(prod.images)) {
        for (let imgIndex = 0; imgIndex < prod.images.length; imgIndex++) {
          const imageUrl = prod.images[imgIndex];

          if (imageUrl.startsWith("http")) {
            const cloudinaryData = await processImage(
              imageUrl,
              "products",
              `${i}_${imgIndex}`
            );

            if (cloudinaryData) {
              processedImages.push({
                url: cloudinaryData.url,
                publicId: cloudinaryData.publicId,
                alt: prod.title,
                order: imgIndex,
                isFeatured: imgIndex === 0,
              });
            }
          }
        }
      }

      // Create product in MongoDB
      const productData = {
        id: prod.id,
        sku: prod.sku,
        title: prod.title,
        description: prod.description,
        price: prod.price,
        discountPrice: prod.discountPrice || 0,
        discount: prod.discount || 0,
        category: prod.category,
        material: prod.material || "",
        inStock: prod.inStock !== false,
        quantityInStock: prod.quantityInStock || 0,
        isNew: prod.isNew || false,
        isFeatured: prod.isFeatured || false,
        popularityScore: prod.popularityScore || 50,
        images: processedImages,
        rating: prod.rating || 0,
        tags: prod.tags || [],
        version: 1,
      };

      const product = await Product.create(productData);
      seededProducts.push(product);

      console.log(`   ✅ Product created: ${prod.title}`);
      console.log(
        `   📸 Images uploaded: ${processedImages.length}/${
          prod.images?.length || 0
        }`
      );
    } catch (error) {
      console.error(
        `   ❌ Failed to create product ${prod.title}:`,
        error.message
      );
    }
  }

  return seededProducts;
}

/**
 * Clean up temporary files
 */
function cleanupTempFiles() {
  const tempDir = path.join(__dirname, "temp");
  if (fs.existsSync(tempDir)) {
    const files = fs.readdirSync(tempDir);
    files.forEach((file) => {
      fs.unlinkSync(path.join(tempDir, file));
    });
    fs.rmdirSync(tempDir);
    console.log("\n🧹 Cleaned up temporary files");
  }
}

/**
 * Main Seed Function
 */
async function seedData() {
  console.log("\n" + "=".repeat(60));
  console.log("🌱 STARTING DATA SEED PROCESS");
  console.log("=".repeat(60));

  // Validate environment variables
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  if (
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error("❌ Cloudinary credentials not found in .env.local");
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    console.log("\n🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Load JSON data
    console.log("\n📖 Loading data from products.json...");
    const jsonData = loadJsonData();

    // Filter categories (exclude "all")
    const categories = jsonData.categories
      .filter((cat) => cat.slug !== "all")
      .slice(0, NUM_CATEGORIES);

    const products = jsonData.products.slice(0, NUM_PRODUCTS);

    console.log(
      `✅ Loaded ${categories.length} categories and ${products.length} products`
    );

    // Seed categories
    const seededCategories = await seedCategories(categories);

    // Seed products
    const seededProducts = await seedProducts(products);

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 SEED PROCESS COMPLETED!");
    console.log("=".repeat(60));
    console.log(
      `✅ Categories created: ${seededCategories.length}/${categories.length}`
    );
    console.log(
      `✅ Products created: ${seededProducts.length}/${products.length}`
    );
    console.log("\n📊 Summary:");
    console.log(
      `   - Total images uploaded to Cloudinary: ~${
        seededProducts.length * 4 + seededCategories.length
      }`
    );
    console.log(`   - Database: MongoDB`);
    console.log(`   - Image Storage: Cloudinary`);
    console.log("\n✨ Your database is now populated with sample data!");
    console.log("🚀 Start your app with: npm run dev\n");
  } catch (error) {
    console.error("\n❌ SEED PROCESS FAILED:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    // Cleanup
    cleanupTempFiles();

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB\n");
    process.exit(0);
  }
}

// Run the seed script
seedData();
