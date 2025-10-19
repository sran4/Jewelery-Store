/**
 * Reset Admin Password Script
 * Run this if you change ADMIN_EMAIL or ADMIN_PASSWORD in .env
 */

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function resetAdmin() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("❌ ADMIN_EMAIL or ADMIN_PASSWORD not found in .env.local");
    process.exit(1);
  }

  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Define Admin Schema
    const AdminSchema = new mongoose.Schema({
      email: String,
      passwordHash: String,
      name: String,
      role: String,
      loginAttempts: Number,
      lockUntil: Date,
      lastLogin: Date,
    });

    const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

    // Hash new password
    console.log("🔐 Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Find and update or create admin
    const admin = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (admin) {
      console.log(`📝 Updating existing admin: ${ADMIN_EMAIL}`);
      admin.passwordHash = passwordHash;
      admin.loginAttempts = 0;
      admin.lockUntil = undefined;
      await admin.save();
      console.log("✅ Admin password updated successfully!\n");
    } else {
      console.log(`➕ Creating new admin: ${ADMIN_EMAIL}`);
      await Admin.create({
        email: ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        name: "Admin",
        role: "admin",
        loginAttempts: 0,
      });
      console.log("✅ Admin created successfully!\n");
    }

    console.log("📋 Admin Details:");
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log("\n🎉 You can now login with these credentials!");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

resetAdmin();
