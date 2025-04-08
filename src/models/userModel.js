// models/userModel.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userType: { type: String, enum: ["student", "professor"], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  collegeName: { type: String, required: true },
  interests: [{ type: String }],

  // Student specific
  graduationYear: Number,
  cgpa: Number,

  // Professor specific
  position: String,
  googleScholar: String,
  otherLinks: [String],

  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});
// models/userModel.ts
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Fix typo in field name
UserSchema.virtual("isVerdified").get(function () {
  return this.isVerified;
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
