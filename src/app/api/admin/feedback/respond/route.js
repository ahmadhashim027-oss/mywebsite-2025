import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Apprentice from "@/models/Apprentice";

export async function PUT(req) {
  try {
    await connectDB();

    const { apprenticeId, taskIndex, adminResponse } = await req.json();

    if (!apprenticeId || taskIndex === undefined || !adminResponse) {
      return NextResponse.json(
        { message: "Apprentice ID, task index, and response are required" },
        { status: 400 }
      );
    }

    const apprentice = await Apprentice.findById(apprenticeId);

    if (!apprentice) {
      return NextResponse.json(
        { message: "Apprentice not found" },
        { status: 404 }
      );
    }

    if (!apprentice.tasks || apprentice.tasks.length <= taskIndex) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    // Add admin response
    apprentice.tasks[taskIndex].adminResponse = adminResponse;
    apprentice.tasks[taskIndex].adminRespondedAt = new Date();
    apprentice.tasks[taskIndex].adminViewed = true;
    apprentice.tasks[taskIndex].adminViewedAt = new Date();

    await apprentice.save();

    return NextResponse.json(
      {
        success: true,
        message: "Response sent successfully",
        task: apprentice.tasks[taskIndex],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin Respond Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
