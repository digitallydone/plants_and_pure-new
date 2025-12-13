import mongoose from "mongoose"

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  variant: { type: String },
  price: { type: Number, required: true },
})

const CartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sessionId: { type: String },
    items: [CartItemSchema],
    couponCode: { type: String },
    discount: { type: Number, default: 0 },
  },
  { timestamps: true },
)

CartSchema.index({ user: 1 })
CartSchema.index({ sessionId: 1 })

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema)
