
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

// 🟢 CREATE TASK
export async function POST(request) {
  try {
    await connectDB();
    const { title, date, description } = await request.json();
    const newTask = await Task.create({ title, date, description });
    return NextResponse.json({
      success: true,
      message: "Task created successfully",
      newTask,
    });
  } catch (error) {
    console.error("Error in POST /api/task:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 🟢 READ ALL TASKS
export async function GET() {
  try {
    await connectDB();
    const tasks = await Task.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error("Error in GET /api/task:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 🟡 UPDATE TASK (Edit or Mark as Done)
export async function PUT(request) {
  try {
    await connectDB();
    const { id, title, date, description, completed } = await request.json();

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (date !== undefined) updateData.date = date;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedTask) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task updated successfully",
      updatedTask,
    });
  } catch (error) {
    console.error("Error in PUT /api/task:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 🔴 DELETE TASK
export async function DELETE(request) {
  try {
    await connectDB();
    const { id } = await request.json();
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/task:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}