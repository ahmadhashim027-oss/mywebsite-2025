import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/config/db";
import Apprentice from "@/models/Apprentice";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find apprentice by email
    const apprentice = await Apprentice.findOne({ email });

    if (!apprentice) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, apprentice.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ✅ SUCCESS: return apprentice data only
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        apprentice: {
          id: apprentice._id,
          fullName: apprentice.fullName,
          email: apprentice.email,
          phone: apprentice.phone,
          age: apprentice.age,
          gender: apprentice.gender,
          address: apprentice.address,
          passport: apprentice.passport,
          guardian: apprentice.guardian,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Apprentice login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
