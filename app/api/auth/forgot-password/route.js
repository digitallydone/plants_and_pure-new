import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    await dbConnect()

    const user = await User.findOne({ email: email.toLowerCase() })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "If an account exists with this email, you will receive a password reset link.",
      })
    }

    // Check if user signed up with OAuth
    if (user.provider !== "credentials") {
      return NextResponse.json({
        message: "If an account exists with this email, you will receive a password reset link.",
      })
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken()
    await user.save()

    // Send email
    const result = await sendPasswordResetEmail(user.email, resetToken, user.name)

    if (!result.success) {
      console.error("Failed to send reset email:", result.error)
      return NextResponse.json({ error: "Failed to send reset email. Please try again." }, { status: 500 })
    }

    return NextResponse.json({
      message: "If an account exists with this email, you will receive a password reset link.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
