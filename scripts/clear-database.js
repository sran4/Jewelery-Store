/**
 * Clear Database Script
 *
 * This script clears all products and categories from MongoDB
 * Use before running seed-data.js for a fresh start
 *
 * Run: node scripts/clear-database.js
 */

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const readline = require("readline");

const MONGODB_URI = process.env.MONGODB_URI;

// Simple schemas for deletion
const CategorySchema = new mongoose.Schema({}, { strict: false });
const ProductSchema = new mongoose.Schema({}, { strict: false });

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

/**
 * Prompt user for confirmation
 */
function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}

/**
 * Clear all data
 */
async function clearDatabase() {
  console.log("\n" + "=".repeat(60));
  console.log("🗑️  DATABASE CLEANUP SCRIPT");
  console.log("=".repeat(60));

  if (!MONGODB_URI) {
    console.error("\n❌ MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    console.log("\n🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get current counts
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();

    console.log("\n📊 Current Database State:");
    console.log(`   - Products: ${productCount}`);
    console.log(`   - Categories: ${categoryCount}`);

    if (productCount === 0 && categoryCount === 0) {
      console.log("\n✨ Database is already empty!");
      await mongoose.disconnect();
      process.exit(0);
    }

    // Ask for confirmation
    console.log("\n⚠️  WARNING: This will DELETE ALL products and categories!");
    const confirmed = await askConfirmation(
      "\n❓ Are you sure you want to continue? (y/N): "
    );

    if (!confirmed) {
      console.log("\n❌ Operation cancelled by user");
      await mongoose.disconnect();
      process.exit(0);
    }

    // Delete all documents
    console.log("\n🗑️  Deleting data...");

    const productsDeleted = await Product.deleteMany({});
    console.log(`   ✅ Deleted ${productsDeleted.deletedCount} products`);

    const categoriesDeleted = await Category.deleteMany({});
    console.log(`   ✅ Deleted ${categoriesDeleted.deletedCount} categories`);

    console.log("\n" + "=".repeat(60));
    console.log("✅ DATABASE CLEARED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("\n💡 Next step: Run seed script to populate with sample data");
    console.log("   node scripts/seed-data.js\n");
  } catch (error) {
    console.error("\n❌ CLEAR PROCESS FAILED:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB\n");
    process.exit(0);
  }
}

// Run the clear script
clearDatabase();
