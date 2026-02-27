import { Schema, model, models } from "mongoose";

const HotelSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    city: { type: String, required: true, index: true },
    stars: { type: Number, enum: [3, 4, 5], default: 4 },
    rating: { type: Number, default: 8.5 },
    reviews: { type: Number, default: 0 },
    distanceKm: { type: Number, default: 1.0 },
    amenities: { type: [String], default: [] },
    coverImage: { type: String, default: "" },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Hotel = models.Hotel || model("Hotel", HotelSchema); 