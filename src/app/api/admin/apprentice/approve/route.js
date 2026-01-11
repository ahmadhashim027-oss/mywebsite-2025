import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Apprentice from "@/models/Apprentice";

export async function POST(request) {
  console.log("✅ POST /api/admin/apprentice/approve called");

  try {
    // Connect to database
    await connectDB();
    console.log("✅ Database connected");

    // Parse request body
    const body = await request.json();
    console.log("📦 Request body:", body);

    const { apprenticeId, approved = true } = body;

    // Validate input
    if (!apprenticeId) {
      console.log("❌ Missing apprenticeId");
      return NextResponse.json(
        {
          success: false,
          message: "Apprentice ID is required",
        },
        { status: 400 }
      );
    }

    console.log(
      `🔄 Updating apprentice ${apprenticeId} to approved=${approved}`
    );

    // Update the apprentice
    const apprentice = await Apprentice.findByIdAndUpdate(
      apprenticeId,
      {
        approved: approved,
        updatedAt: new Date(),
        ...(approved && { approvedAt: new Date() }),
      },
      { new: true }
    ).select("-password");

    if (!apprentice) {
      console.log("❌ Apprentice not found:", apprenticeId);
      return NextResponse.json(
        {
          success: false,
          message: "Apprentice not found",
        },
        { status: 404 }
      );
    }

    console.log("✅ Successfully updated:", apprentice.email);

    return NextResponse.json({
      success: true,
      message: `Apprentice ${approved ? "approved" : "rejected"} successfully`,
      apprentice: {
        _id: apprentice._id,
        fullName: apprentice.fullName,
        email: apprentice.email,
        approved: apprentice.approved,
      },
    });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Also handle PATCH requests
export async function PATCH(request) {
  return POST(request);
}

// GET for testing
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Apprentice Approval API",
    endpoint: "/api/admin/apprentice/approve",
    methods: ["POST", "PATCH", "GET"],
  });
}
