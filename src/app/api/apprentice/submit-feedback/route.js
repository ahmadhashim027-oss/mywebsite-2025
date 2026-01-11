import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Apprentice from "@/models/Apprentice";

export async function PUT(req) {
  try {
    await connectDB();

    const { apprenticeId, taskIndex, feedback, status } = await req.json();

    if (!apprenticeId || taskIndex === undefined || !feedback) {
      return NextResponse.json(
        { message: "Apprentice ID, task index, and feedback are required" },
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

    // Update task with feedback and mark for admin review
    apprentice.tasks[taskIndex].feedback = feedback;
    apprentice.tasks[taskIndex].status = status || "completed";
    apprentice.tasks[taskIndex].completedAt = new Date();
    apprentice.tasks[taskIndex].feedbackSubmittedAt = new Date();
    apprentice.tasks[taskIndex].adminViewed = false; // Mark as unviewed by admin

    // Update apprentice level tracking
    apprentice.hasUnviewedFeedback = true;
    apprentice.lastFeedbackDate = new Date();

    await apprentice.save();

    return NextResponse.json(
      {
        success: true,
        message: "Feedback submitted successfully! Admin will review it.",
        tasks: apprentice.tasks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Submit Feedback Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
