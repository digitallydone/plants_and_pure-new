import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"
import Cart from "@/models/Cart"
import { authOptions } from "@/lib/auth-options"
import { generateOrderNumber } from "@/lib/utils/format"
import { initializePayment } from "@/lib/paystack"
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/constants"

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = 10

    const [orders, total] = await Promise.all([
      Order.find({ user: session.user.id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments({ user: session.user.id }),
    ])

    return NextResponse.json({
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Orders GET error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in to place an order" }, { status: 401 })
    }

    await dbConnect()

    const { shippingAddress, phone } = await request.json()

    // Get cart
    const cart = await Cart.findOne({ user: session.user.id }).populate({
      path: "items.product",
      select: "name slug images price stock",
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Validate stock
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json({ error: `${item.product.name} is out of stock` }, { status: 400 })
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const total = subtotal + shippingCost

    // Create order
    const orderNumber = generateOrderNumber()

    const order = await Order.create({
      user: session.user.id,
      orderNumber,
      items: cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0],
        price: item.price,
        quantity: item.quantity,
        variant: item.variant,
      })),
      shippingAddress,
      subtotal,
      shippingCost,
      total,
      paymentStatus: "pending",
      orderStatus: "pending",
    })

    // Initialize Paystack payment
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const paymentData = await initializePayment({
      email: session.user.email,
      amount: total,
      reference: orderNumber,
      callbackUrl: `${baseUrl}/api/payments/verify`,
      metadata: {
        orderId: order._id.toString(),
        orderNumber,
        userId: session.user.id,
      },
    })

    // Update order with payment reference
    order.paymentReference = paymentData.reference
    await order.save()

    // Don't clear cart yet - wait for payment verification

    return NextResponse.json({
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
      },
      paymentUrl: paymentData.authorization_url,
    })
  } catch (error) {
    console.error("Orders POST error:", error)
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 })
  }
}
