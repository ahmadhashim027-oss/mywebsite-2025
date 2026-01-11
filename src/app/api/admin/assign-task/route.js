// app/api/admin/assign-task/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Apprentice from "@/models/Apprentice";

export async function POST(req) {
  try {
    await connectDB();

    const { apprenticeId, title, description, dueDate, adminNotes } =
      await req.json();

    if (!apprenticeId || !title || !description) {
      return NextResponse.json(
        { message: "Apprentice ID, title, and description are required" },
        { status: 400 }
      );
    }

    // Find apprentice
    const apprentice = await Apprentice.findById(apprenticeId);

    if (!apprentice) {
      return NextResponse.json(
        { message: "Apprentice not found" },
        { status: 404 }
      );
    }

    // Check if apprentice is approved
    if (!apprentice.approved) {
      return NextResponse.json(
        { message: "Cannot assign tasks to unapproved apprentices" },
        { status: 400 }
      );
    }

    // Create new task
    const newTask = {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      adminNotes: adminNotes || "",
      assignedDate: new Date(),
      status: "pending",
    };

    // Add task to apprentice's tasks array
    apprentice.tasks.push(newTask);
    await apprentice.save();

    return NextResponse.json(
      {
        success: true,
        message: "Task assigned successfully",
        apprentice,
        task: newTask,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Assign Task Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
