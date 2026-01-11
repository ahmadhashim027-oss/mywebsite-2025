import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../src/config/db.js";
import Admin from "../src/models/Admin.js";

async function seedAdmin() {
  await connectDB();

  const email = "ahmadhashim027@gmail.com";
  const password = await bcrypt.hash("Shim67#+", 10);

  const exists = await Admin.findOne({ email });

  if (exists) {
    console.log("⚠️ Admin already exists");
    process.exit(0);
  }

  await Admin.create({ email, password });

  console.log("✅ Admin created successfully");
  process.exit(0);
}

seedAdmin();
