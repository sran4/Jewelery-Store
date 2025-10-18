import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db/mongodb';
import SiteSettings from '@/lib/models/SiteSettings';
import { siteSettingsSchema } from '@/lib/validation';

// GET site settings (PUBLIC)
export async function GET() {
  try {
    await connectDB();

    let settings = await SiteSettings.findOne().lean();

    // If no settings exist, create default
    if (!settings) {
      settings = await SiteSettings.create({
        promotionalMessage: '🎉 HUGE SALE! Get up to 70% OFF on selected items',
        phone: '+1-234-567-8900',
        whatsapp: '+1234567890',
        email: 'contact@luxuryjewelry.com',
        address: '123 Luxury Street, New York, NY 10001',
        socialMedia: {
          facebook: 'https://facebook.com/luxuryjewelry',
          instagram: 'https://instagram.com/luxuryjewelry',
          pinterest: 'https://pinterest.com/luxuryjewelry',
        },
      });
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT update settings (ADMIN ONLY)
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = siteSettingsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    await connectDB();

    const settings = await SiteSettings.findOneAndUpdate(
      {},
      {
        ...validation.data,
        updatedBy: (session.user as any).id,
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}

