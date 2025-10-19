import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import connectDB from "@/lib/db/mongodb";
import SiteSettings from "@/lib/models/SiteSettings";

// GET site settings (PUBLIC - only public fields)
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";

    // Check if this is an admin request
    let isAdmin = false;
    if (admin) {
      const session = await getServerSession(authOptions);
      isAdmin = !!(session && session.user);
    }

    let settings = await SiteSettings.findOne().lean();

    // If no settings exist, create default ones
    if (!settings) {
      const defaultSettings = {
        siteName: "SherGill Official",
        siteDescription: "Premium jewelry collection",
        contactEmail: "",
        contactPhone: "",
        address: "",
        socialMedia: {
          facebook: "",
          instagram: "",
          twitter: "",
          youtube: "",
        },
        seo: {
          metaTitle: "",
          metaDescription: "",
          keywords: [],
        },
        features: {
          maintenanceMode: false,
        },
        promotionalSettings: {
          isActive: true,
          message: "🎉 Welcome to SherGill Official!",
          showTimer: false,
          timerMessage: "🔥 Sale ends in:",
          saleEndDate: undefined,
        },
      };

      const createdSettings = await SiteSettings.create(defaultSettings);
      settings = createdSettings.toObject() as any;
    }
    
    if (!settings) {
      return NextResponse.json(
        { success: false, error: "Failed to load settings" },
        { status: 500 }
      );
    }
    
    {
      // Ensure features object has correct structure (backwards compatibility)
      if (!settings.features || typeof settings.features !== "object") {
        settings.features = { maintenanceMode: false };
      } else {
        // Keep only maintenanceMode from old features
        settings.features = {
          maintenanceMode: settings.features.maintenanceMode || false,
        };
      }

      // Ensure promotionalSettings object has correct structure (backwards compatibility)
      if (
        !settings.promotionalSettings ||
        typeof settings.promotionalSettings !== "object"
      ) {
        settings.promotionalSettings = {
          isActive: true,
          message: "🎉 Welcome to SherGill Official!",
          showTimer: false,
          timerMessage: "🔥 Sale ends in:",
          saleEndDate: undefined,
        };
      } else {
        // Ensure all required fields exist
        settings.promotionalSettings = {
          isActive:
            settings.promotionalSettings.isActive !== undefined
              ? settings.promotionalSettings.isActive
              : true,
          message:
            settings.promotionalSettings.message ||
            "🎉 Welcome to SherGill Official!",
          showTimer: settings.promotionalSettings.showTimer || false,
          timerMessage:
            settings.promotionalSettings.timerMessage || "🔥 Sale ends in:",
          saleEndDate: settings.promotionalSettings.saleEndDate || undefined,
        };
      }
      console.log(
        "📖 Loading settings features:",
        JSON.stringify(settings.features, null, 2)
      );
    }

    // If not admin, only return public fields
    if (!isAdmin) {
      const publicSettings = {
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        address: settings.address,
        socialMedia: settings.socialMedia,
        seo: settings.seo,
        features: {
          // Only expose maintenanceMode for client-side maintenance check
          maintenanceMode: settings.features.maintenanceMode,
        },
        promotionalSettings: {
          // Expose promotional settings for public promotional bar
          isActive: settings.promotionalSettings.isActive,
          message: settings.promotionalSettings.message,
          showTimer: settings.promotionalSettings.showTimer,
          timerMessage: settings.promotionalSettings.timerMessage,
          saleEndDate: settings.promotionalSettings.saleEndDate,
        },
      };
      return NextResponse.json({
        success: true,
        settings: publicSettings,
      });
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT update settings (ADMIN ONLY)
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("📝 Saving settings:", JSON.stringify(body.features, null, 2));

    await connectDB();

    // Update or create settings
    const settings = await SiteSettings.findOneAndUpdate(
      {},
      {
        ...body,
        updatedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
      }
    );

    console.log(
      "✅ Settings saved:",
      JSON.stringify(settings.features, null, 2)
    );

    return NextResponse.json({
      success: true,
      settings,
      message: "Settings updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
