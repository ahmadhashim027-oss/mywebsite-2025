import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/config/db";
import Apprentice from "@/models/Apprentice";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      fullName,
      age,
      gender,
      email,
      phone,
      password,
      address,
      passport,
      guardian,
    } = body;

    // Check existing apprentice
    const existingUser = await Apprentice.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const apprentice = await Apprentice.create({
      fullName,
      age,
      gender,
      email,
      phone,
      password: hashedPassword,
      address,
      passport,
      guardian,
    });

    return NextResponse.json(
      {
        message: "Apprentice registered successfully",
        apprentice: {
          id: apprentice._id,
          fullName: apprentice.fullName,
          email: apprentice.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const apprentices = await Apprentice.find()
      .select("-password") // exclude password
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: apprentices.length,
        apprentices,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Apprentice Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch apprentices" },
      { status: 500 }
    );
  }
}
