import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/mongodb";
import ContactSubmission from "@/lib/models/ContactSubmission";
import { contactSchema } from "@/lib/validation";
import { rateLimitContact } from "@/lib/rateLimit";
import { sendContactNotification } from "@/lib/sendgrid";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      );
    }

    // Rate limiting (by email)
    const rateLimit = rateLimitContact(validation.data.email);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Too many submissions. Please try again after ${new Date(
            rateLimit.resetTime
          ).toLocaleTimeString()}`,
        },
        { status: 429 }
      );
    }

    await connectDB();

    // Get IP address
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip") || "unknown";

    // Save to database
    const submission = await ContactSubmission.create({
      ...validation.data,
      status: "new",
      ipAddress,
    });

    // Send email notification to admin
    try {
      await sendContactNotification(validation.data);
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message:
        "Your message has been sent successfully! We'll get back to you soon.",
      submission: {
        id: submission._id,
        submittedAt: submission.submittedAt,
      },
    });
  } catch (error: any) {
    console.error("Contact Submission Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit contact form" },
      { status: 500 }
    );
  }
}

// GET all contact submissions (ADMIN ONLY)
export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    await connectDB();

    let query: any = {};
    if (status) {
      query.status = status;
    }

    const submissions = await ContactSubmission.find(query)
      .sort({ submittedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      submissions,
    });
  } catch (error: any) {
    console.error("Get Submissions Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

// PATCH - Update submission status or add admin notes (ADMIN ONLY)
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const updateData: any = {};
    if (status) {
      updateData.status = status;
      if (status === "read" && !updateData.readAt) {
        updateData.readAt = new Date();
      }
    }
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    const submission = await ContactSubmission.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Submission updated successfully",
      submission,
    });
  } catch (error: any) {
    console.error("Update Submission Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update submission" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a submission (ADMIN ONLY)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const submission = await ContactSubmission.findByIdAndDelete(id);

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Submission deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete Submission Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete submission" },
      { status: 500 }
    );
  }
}
