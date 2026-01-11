import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Apprentice from "@/models/Apprentice";

export async function GET(req) {
  try {
    await connectDB();

    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const apprentice = await Apprentice.findOne({ email }).select("-password");

    if (!apprentice) {
      return NextResponse.json(
        { message: "Apprentice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ apprentice }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
