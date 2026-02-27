import { Schema, model, models, Types } from "mongoose";

const RoomSchema = new Schema(
  {
    hotelId: { type: Types.ObjectId, ref: "Hotel", required: true, index: true },
    name: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1, max: 10 },
    bed: { type: String, default: "Queen" },
    refundable: { type: Boolean, default: true, index: true },
    breakfast: { type: Boolean, default: false, index: true },
    pricePerNight: { type: Number, required: true, min: 0, index: true },
    stock: { type: Number, default: 10 },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

RoomSchema.index({ hotelId: 1, pricePerNight: 1 });
export const Room = models.Room || model("Room", RoomSchema);