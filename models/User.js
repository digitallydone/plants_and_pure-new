import mongoose from "mongoose"
import crypto from "crypto"

const AddressSchema = new mongoose.Schema({
  label: { type: String, default: "Home" },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
})

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    addresses: [AddressSchema],
    savedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    emailVerified: { type: Date },
    provider: { type: String, default: "credentials" }, // credentials, google
    providerId: { type: String }, // OAuth provider ID
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true },
)

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex")

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")

  this.passwordResetExpires = Date.now() + 60 * 60 * 1000 // 1 hour

  return resetToken
}

export default mongoose.models.User || mongoose.model("User", UserSchema)
