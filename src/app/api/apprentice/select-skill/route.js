import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Apprentice from "@/models/Apprentice";

export async function POST(req) {
  try {
    await connectDB();

    const { apprenticeId, skill } = await req.json();

    if (!apprenticeId || !skill) {
      return NextResponse.json(
        { message: "Apprentice ID and skill are required" },
        { status: 400 }
      );
    }

    // Update apprentice with selected skill and mark as not yet approved
    const apprentice = await Apprentice.findByIdAndUpdate(
      apprenticeId,
      { skill, approved: false },
      { new: true }
    );

    if (!apprentice) {
      return NextResponse.json(
        { message: "Apprentice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Skill submitted for approval", apprentice },
      { status: 200 }
    );
  } catch (error) {
    console.error("Select Skill Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
