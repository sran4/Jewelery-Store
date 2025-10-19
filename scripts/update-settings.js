/**
 * Update Site Settings Script
 * Run this to update existing settings to new schema
 */

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

async function updateSettings() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const SiteSettings = mongoose.connection.collection("sitesettings");

    // Update all documents to remove old features
    const result = await SiteSettings.updateMany(
      {},
      {
        $unset: {
          "features.enableReviews": "",
          "features.enableWishlist": "",
          "features.enableNewsletter": "",
        },
        $set: {
          "features.maintenanceMode": false,
        },
      }
    );

    console.log("✅ Settings updated successfully!");
    console.log(`   Modified ${result.modifiedCount} document(s)\n`);

    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

updateSettings();
