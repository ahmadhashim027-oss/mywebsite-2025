import { NextResponse } from "next/server";
import Apprentice from "@/models/Apprentice";
import { connectDB } from "@/config/db";

export async function POST(req) {
  try {
    await connectDB();

    const form = await req.formData();

    // Apprentice fields
    const fullName = form.get("fullName");
    const age = form.get("age");
    const gender = form.get("gender");
    const phone = form.get("phone");
    const address = form.get("address");
    const skill = form.get("skill");
    const startDate = form.get("startDate");

    // Guardian fields
    const guardianName = form.get("guardianName");
    const relationship = form.get("relationship");
    const guardianPhone = form.get("guardianPhone");
    const guardianAddress = form.get("guardianAddress");

    // Passport Upload
    const passportFile = form.get("passport");
    let passportUrl = null;

    if (passportFile && passportFile.size > 0) {
      const bytes = await passportFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "apprentice_passports" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });

      passportUrl = uploadResult.secure_url;
    }

    // Save to MongoDB
    await Apprentice.create({
      fullName,
      age,
      gender,
      phone,
      address,
      skill,
      startDate,
      passport: passportUrl,
      guardian: {
        name: guardianName,
        relationship,
        phone: guardianPhone,
        address: guardianAddress,
      },
    });

    return NextResponse.json({
      message: "Apprentice registered successfully!",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
