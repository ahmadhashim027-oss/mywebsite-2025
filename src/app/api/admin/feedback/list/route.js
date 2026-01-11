import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Apprentice from "@/models/Apprentice";

export async function GET(req) {
  try {
    await connectDB();

    // Get all apprentices with pending feedback
    const apprentices = await Apprentice.find({
      "tasks.feedback": { $ne: "", $exists: true },
    }).select("-password");

    // Format data for admin view
    const feedbackList = [];

    apprentices.forEach((apprentice) => {
      apprentice.tasks.forEach((task, taskIndex) => {
        if (task.feedback && task.feedback.trim()) {
          feedbackList.push({
            apprenticeId: apprentice._id,
            apprenticeName: apprentice.fullName,
            apprenticeEmail: apprentice.email,
            apprenticeSkill: apprentice.skill,
            taskId: task._id,
            taskIndex: taskIndex,
            taskTitle: task.title,
            taskDescription: task.description,
            feedback: task.feedback,
            feedbackSubmittedAt: task.feedbackSubmittedAt,
            adminViewed: task.adminViewed,
            adminViewedAt: task.adminViewedAt,
            adminResponse: task.adminResponse,
            adminRespondedAt: task.adminRespondedAt,
            taskAssignedDate: task.assignedDate,
            taskCompletedAt: task.completedAt,
            taskStatus: task.status,
          });
        }
      });
    });

    // Sort by most recent feedback first
    feedbackList.sort(
      (a, b) =>
        new Date(b.feedbackSubmittedAt) - new Date(a.feedbackSubmittedAt)
    );

    return NextResponse.json(
      {
        success: true,
        feedbackList,
        totalCount: feedbackList.length,
        unviewedCount: feedbackList.filter((f) => !f.adminViewed).length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Feedback List Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
