import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Apprentice from "@/models/Apprentice";

export async function PUT(req) {
  try {
    await connectDB();

    const { apprenticeId, taskIndex, status } = await req.json();

    if (!apprenticeId || taskIndex === undefined || !status) {
      return NextResponse.json(
        { message: "Apprentice ID, task index, and status are required" },
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

    // Check if task exists
    if (!apprentice.tasks || apprentice.tasks.length <= taskIndex) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    // Update task status
    apprentice.tasks[taskIndex].status = status;
    apprentice.tasks[taskIndex].updatedAt = new Date();

    await apprentice.save();

    return NextResponse.json(
      {
        success: true,
        message: "Task updated successfully",
        tasks: apprentice.tasks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Task Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
