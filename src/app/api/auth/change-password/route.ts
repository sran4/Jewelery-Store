import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import connectDB from '@/lib/db/mongodb';
import Admin from '@/lib/models/Admin';
import { changePasswordSchema } from '@/lib/validation';
import { hashPassword } from '@/lib/auth/password';

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = changePasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validation.data;

    await connectDB();

    // Find admin
    const admin = await Admin.findOne({
      email: (session.user as any).email.toLowerCase(),
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Verify current password (unless logged in via Google OAuth)
    if (!admin.googleId) {
      const isPasswordValid = await admin.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 401 }
        );
      }
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    admin.passwordHash = newPasswordHash;
    await admin.save();

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully. Please login again.',
    });
  } catch (error: any) {
    console.error('Change Password Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to change password' },
      { status: 500 }
    );
  }
}

