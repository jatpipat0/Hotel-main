import { Schema, model, models } from "mongoose";

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, default: "Admin" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Admin = models.Admin || model("Admin", AdminSchema);