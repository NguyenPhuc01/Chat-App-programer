import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    email: {
      type: "string",
      required: true,
      unique: true,
    },
    fullName: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    access_token: {
      type: String,
      unique: true,
    },
    refresh_token: {
      type: String,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
export const User = mongoose.model("User", userSchema);
