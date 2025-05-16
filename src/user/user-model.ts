import mongoose from "mongoose";
import TUser from "./user-types";

const userSchema = new mongoose.Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "employee",
      enum: ["employee", "manager", "admin"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<TUser>("User", userSchema);
