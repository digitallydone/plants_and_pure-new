import { NextResponse } from "next/server"
import { sendContactFormEmail } from "@/lib/email"

export async function POST(request) {
  try {
    const data = await request.json()
    const { name, email, subject, message, phone } = data

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Name, email, subject, and message are required" }, { status: 400 })
    }

    const result = await sendContactFormEmail({ name, email, subject, message, phone })

    if (!result.success) {
      console.error("Failed to send contact email:", result.error)
      return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
    }

    return NextResponse.json({
      message: "Message sent successfully! We'll get back to you soon.",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
