import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Apprentice from "@/models/Apprentice";

export async function PUT(req) {
  try {
    await connectDB();

    const { apprenticeId, taskIndex } = await req.json();

    if (!apprenticeId || taskIndex === undefined) {
      return NextResponse.json(
        { message: "Apprentice ID and task index are required" },
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

    // Mark feedback as viewed by admin
    apprentice.tasks[taskIndex].adminViewed = true;
    apprentice.tasks[taskIndex].adminViewedAt = new Date();

    // Check if all feedback has been viewed
    const hasUnviewedFeedback = apprentice.tasks.some(
      (task) => task.feedback && task.feedback.trim() && !task.adminViewed
    );

    apprentice.hasUnviewedFeedback = hasUnviewedFeedback;

    await apprentice.save();

    return NextResponse.json(
      {
        success: true,
        message: "Feedback marked as viewed",
        task: apprentice.tasks[taskIndex],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Mark Feedback Viewed Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
