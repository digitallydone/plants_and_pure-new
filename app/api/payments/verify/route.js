import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"
import Cart from "@/models/Cart"
import Product from "@/models/Product"
import { verifyPayment } from "@/lib/paystack"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.redirect(new URL("/checkout?error=missing_reference", request.url))
    }

    await dbConnect()

    // Verify payment with Paystack
    const paymentData = await verifyPayment(reference)

    if (paymentData.status !== "success") {
      return NextResponse.redirect(new URL(`/checkout?error=payment_failed`, request.url))
    }

    // Update order
    const order = await Order.findOne({ orderNumber: reference })

    if (!order) {
      return NextResponse.redirect(new URL("/checkout?error=order_not_found", request.url))
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

    // Redirect to success page
    return NextResponse.redirect(new URL(`/checkout/success?order=${order.orderNumber}`, request.url))
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.redirect(new URL("/checkout?error=verification_failed", request.url))
  }
}
