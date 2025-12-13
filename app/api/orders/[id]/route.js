import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"
import { authOptions } from "@/lib/auth-options"

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { id } = await params

    const order = await Order.findOne({
      _id: id,
      user: session.user.id,
    }).lean()

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Order GET error:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}
