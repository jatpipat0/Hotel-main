import { Schema, model, models, Types } from "mongoose";

const PaymentSchema = new Schema(
  {
    bookingId: { type: Types.ObjectId, ref: "Booking", required: true, index: true },
    method: { type: String, enum: ["promptpay_qr", "card_stripe"], required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "THB" },
    status: { type: String, enum: ["created", "paid", "failed", "refunded"], default: "created", index: true },
    promptpayPayload: { type: String, default: "" },
    stripePaymentIntentId: { type: String, default: "" },
    paidAt: { type: String, default: "" },
    refundedAt: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Payment = models.Payment || model("Payment", PaymentSchema);