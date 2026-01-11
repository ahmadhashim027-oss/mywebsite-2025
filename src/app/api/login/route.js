import { connectDB } from "@/config/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return new Response(JSON.stringify({ msg: "Admin not found" }), {
        status: 404,
      });
    }

    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass) {
      return new Response(JSON.stringify({ msg: "Incorrect password" }), {
        status: 400,
      });
    }

    admin.lastLogin = new Date();
    await admin.save();

    return new Response(
      JSON.stringify({
        msg: "Login successful",
        admin: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
