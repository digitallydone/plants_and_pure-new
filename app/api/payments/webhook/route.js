import { NextResponse } from "next/server"
import { headers } from "next/headers"
import crypto from "crypto"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"
import Cart from "@/models/Cart"
import Product from "@/models/Product"

export async function POST(request) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("x-paystack-signature")

    // Verify webhook signature
    const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY).update(body).digest("hex")

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(body)

    if (event.event === "charge.success") {
      await dbConnect()

      const { reference, metadata } = event.data

      const order = await Order.findOne({ orderNumber: reference })

      if (!order) {
        console.error("Webhook: Order not found for reference:", reference)
        return NextResponse.json({ received: true })
      }

      // Skip if already processed
      if (order.paymentStatus === "paid") {
        return NextResponse.json({ received: true })
      }

      order.paymentStatus = "paid"
      order.orderStatus = "processing"
      await order.save()

      // Update product stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        })
      }

      // Clear cart
      await Cart.findOneAndDelete({ user: order.user })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
