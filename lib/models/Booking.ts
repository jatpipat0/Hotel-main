import { Schema, model, models, Types } from "mongoose";

const BookingSchema = new Schema(
  {
    bookingNo: { type: String, required: true, unique: true, index: true },
    hotelId: { type: Types.ObjectId, ref: "Hotel", required: true, index: true },
    roomId: { type: Types.ObjectId, ref: "Room", required: true, index: true },

    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    guests: { type: Number, required: true, min: 1, max: 10 },

    fullName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    requests: { type: String, default: "" },

    nights: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "refunded"],
      default: "pending",
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: ["pay_at_hotel", "promptpay_qr", "card_stripe"],
      default: "pay_at_hotel",
      index: true,
    },

    paidAt: { type: String, default: "" },
    cancelledAt: { type: String, default: "" },
    refundedAt: { type: String, default: "" },
    refundAmount: { type: Number, default: 0 },
    refundReason: { type: String, default: "" },

    paymentId: { type: Types.ObjectId, ref: "Payment", default: null },
  },
  { timestamps: true }
);

BookingSchema.index({ createdAt: -1, status: 1 });
export const Booking = models.Booking || model("Booking", BookingSchema);