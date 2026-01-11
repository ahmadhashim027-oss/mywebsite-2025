import mongoose from "mongoose";

const GuardianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
});

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  feedback: { type: String, default: "" },
  adminNotes: { type: String, default: "" },
  completedAt: { type: Date },
  // New fields for admin feedback management
  feedbackSubmittedAt: { type: Date },
  adminViewed: { type: Boolean, default: false },
  adminViewedAt: { type: Date },
  adminResponse: { type: String, default: "" },
  adminRespondedAt: { type: Date },
});

const ApprenticeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    passport: { type: String, default: "" },

    guardian: { type: GuardianSchema, required: true },

    skill: { type: String, default: "" },
    approved: { type: Boolean, default: false },

    tasks: [TaskSchema],

    // Track feedback notifications for admin
    hasUnviewedFeedback: { type: Boolean, default: false },
    lastFeedbackDate: { type: Date },
  },
  { timestamps: true }
);

// Static method to find apprentice by email
ApprenticeSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Method to get apprentices with pending feedback for admin
ApprenticeSchema.statics.getWithPendingFeedback = async function () {
  return this.find({
    "tasks.feedback": { $ne: "", $exists: true },
    "tasks.adminViewed": false,
  }).select("-password");
};

const Apprentice =
  mongoose.models.Apprentice || mongoose.model("Apprentice", ApprenticeSchema);
export default Apprentice;
