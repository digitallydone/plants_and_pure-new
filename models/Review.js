import mongoose from "mongoose"

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    comment: { type: String, required: true },
    images: [{ type: String }],
    isVerifiedPurchase: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    isFlagged: { type: Boolean, default: false },
    flagReason: { type: String },
    helpfulCount: { type: Number, default: 0 },
    adminResponse: { type: String },
  },
  { timestamps: true },
)

ReviewSchema.index({ product: 1, isApproved: 1 })
ReviewSchema.index({ user: 1 })

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema)
